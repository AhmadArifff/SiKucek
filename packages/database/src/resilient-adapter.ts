import { getSupabaseClient, isSupabaseConfigured } from './client';
import type { Database } from './types';

export interface HealthCheckResult {
  connected: boolean;
  mode: 'live' | 'mock_fallback';
  latencyMs?: number;
  message: string;
}

export const DEFAULT_APP_SETTINGS: Record<string, any> = {
  payment_midtrans: {
    server_key: 'SB-Mid-server-simulated-key',
    client_key: 'SB-Mid-client-simulated-key',
    merchant_id: 'G12345678',
    is_production: false,
  },
  outlet_profile: {
    name: 'SiKucek Laundry',
    phone: '081234567890',
    address: 'Jl. Babarsari No. 12, Sleman, Yogyakarta',
    open_hours: '07.00 - 21.00 WIB',
    maps_url: 'https://maps.google.com/?q=SiKucek+Laundry',
  },
  business_rules: {
    min_weight_kiloan: 2.0,
    stamp_target: 5,
    stamp_reward_max_kg: 5.0,
    dormant_days_limit: 14,
  },
  wa_template_received: {
    template:
      'Halo Kak {customer_name}! Cucian {order_number} telah diterima di SiKucek. Pantau linimasa cucian Anda secara live di: {tracking_url}',
  },
  wa_template_ready: {
    template:
      'Hore Kak {customer_name}! Pakaian di nota {order_number} sudah SELESAI, bersih, dan harum. Siap diambil di {rack_location}. Nota: {tracking_url}',
  },
  wa_template_winback: {
    template:
      'Halo Kak {customer_name}! Baju kotor di rumah sudah menumpuk? Khusus hari ini ada diskon 15% cuci kiloan dengan kupon: {promo_code}. Yuk merapat!',
  },
};

/**
 * Perform a non-blocking health check on Supabase connection.
 * If credentials are missing or database unreachable, gracefully falls back to mock mode.
 */
export async function checkSupabaseHealth(): Promise<HealthCheckResult> {
  if (!isSupabaseConfigured()) {
    return {
      connected: false,
      mode: 'mock_fallback',
      message:
        'Kredensial Supabase belum disetel di .env.local. Sistem berjalan dalam Mode Mandiri / Zero Cost (Mock Store Lokal).',
    };
  }

  const client = getSupabaseClient();
  if (!client) {
    return {
      connected: false,
      mode: 'mock_fallback',
      message: 'Gagal menginisialisasi Supabase client.',
    };
  }

  const startTime = Date.now();
  try {
    const { data, error } = await client
      .from('app_settings')
      .select('key')
      .limit(1);

    const latencyMs = Date.now() - startTime;

    if (error) {
      return {
        connected: false,
        mode: 'mock_fallback',
        latencyMs,
        message: `Koneksi Supabase error: ${error.message}. Otomatis beralih ke Mock Store.`,
      };
    }

    return {
      connected: true,
      mode: 'live',
      latencyMs,
      message: `Terhubung stabil ke Supabase Cloud PostgreSQL (Latensi: ${latencyMs}ms).`,
    };
  } catch (err: any) {
    return {
      connected: false,
      mode: 'mock_fallback',
      message: `Gagal menjangkau server Supabase (${err?.message || 'Network error'}). Menggunakan fallback lokal.`,
    };
  }
}

/**
 * Fetch application settings from Supabase public.app_settings.
 * Returns null if not configured or query fails.
 */
export async function fetchAppSettingsFromSupabase(): Promise<Record<string, any> | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client.from('app_settings').select('*');
    if (error || !data || data.length === 0) return null;

    const result: Record<string, any> = {};
    for (const row of (data as Array<{ key: string; value: any }>)) {
      result[row.key] = row.value;
    }
    return result;
  } catch {
    return null;
  }
}

/**
 * Upload a QC photograph to Supabase Storage bucket 'qc-photos'
 * If offline or storage not set, returns a simulated URL.
 */
export async function uploadQcPhotoToStorage(
  file: Blob,
  fileName: string
): Promise<{ success: boolean; photoUrl: string; mode: 'live' | 'mock' }> {
  const client = getSupabaseClient();

  if (!client) {
    // Generate simulated URL for local/demo environment
    const mockUrl =
      'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&auto=format&fit=crop&q=80';
    return { success: true, photoUrl: mockUrl, mode: 'mock' };
  }

  try {
    const filePath = `orders/${Date.now()}_${fileName}`;
    const { data, error } = await client.storage
      .from('qc-photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      // Graceful fallback to mock url
      return {
        success: true,
        photoUrl:
          'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&auto=format&fit=crop&q=80',
        mode: 'mock',
      };
    }

    const { data: publicUrlData } = client.storage
      .from('qc-photos')
      .getPublicUrl(data.path);

    return {
      success: true,
      photoUrl: publicUrlData.publicUrl,
      mode: 'live',
    };
  } catch {
    return {
      success: true,
      photoUrl:
        'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&auto=format&fit=crop&q=80',
      mode: 'mock',
    };
  }
}
