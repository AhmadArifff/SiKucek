import {
  MidtransConfigInput,
  WhatsAppConfigInput,
  BUSINESS_DEFAULTS,
} from '@sikucek/shared';

export interface MidtransSettingsState {
  server_key: string;
  client_key: string;
  merchant_id: string;
  is_production: boolean;
  simulation_mode: boolean;
}

export interface WhatsAppSettingsState {
  session_name: string;
  outlet_phone: string;
  auto_notify_received: boolean;
  auto_notify_ready: boolean;
  template_received: string;
  template_ready: string;
  template_winback: string;
  connection_status: 'connected' | 'qr_ready' | 'disconnected';
  last_connected_at?: string;
}

export interface OutletProfileState {
  name: string;
  phone: string;
  address: string;
  open_hours: string;
  maps_url: string;
}

export interface BusinessRulesState {
  min_weight_kiloan: number;
  stamp_target: number;
  stamp_reward_max_kg: number;
  dormant_days_limit: number;
}

export interface AppSettingsBundle {
  midtrans: MidtransSettingsState;
  whatsapp: WhatsAppSettingsState;
  outlet: OutletProfileState;
  business_rules: BusinessRulesState;
}

export const DEFAULT_SETTINGS: AppSettingsBundle = {
  midtrans: {
    server_key: 'SB-Mid-server-DemoKucekSecretKey123',
    client_key: 'SB-Mid-client-DemoKucekPubKey456',
    merchant_id: 'G123456789',
    is_production: false, // Default Sandbox
    simulation_mode: true, // Default local instant simulator
  },
  whatsapp: {
    session_name: 'sikucek-outlet-01',
    outlet_phone: '081234567890',
    auto_notify_received: true,
    auto_notify_ready: true,
    template_received:
      'Halo Kak {customer_name}! Terima kasih sudah mencuci di SiKucek.\n\n' +
      'Nomor Pesanan: {order_number}\n' +
      'Layanan: {ringkasan_layanan}\n' +
      'Total Tagihan: {final_amount} ({status_bayar})\n' +
      'Estimasi Selesai: {estimasi_selesai}\n\n' +
      'Pantau proses cucian & foto kondisi pakaian Kakak di sini:\n' +
      'https://sikucek.app/track/{tracking_code}\n\n' +
      'Si Kucek siap bikin pakaian Kakak wangi, bersih, dan kinclong!',
    template_ready:
      'Kabar gembira Kak {customer_name}! Pakaian Kakak di SiKucek sudah SELESAI, bersih, wangi, dan rapi dipacking.\n\n' +
      'Nomor Pesanan: {order_number}\n' +
      'Lokasi Pengambilan: {rack_location}\n' +
      'Total Pembayaran: {final_amount} ({status_bayar})\n\n' +
      'Silakan ambil pakaian Kakak di kasir dengan menyebutkan nomor rak di atas atau tunjukkan tautan nota ini:\n' +
      'https://sikucek.app/track/{tracking_code}\n\n' +
      'Sampai jumpa di SiKucek!',
    template_winback:
      'Hai Kak {customer_name}! Si Kucek kangen nih, keranjang cucian Kakak sudah penuh belum? 😊\n\n' +
      'Khusus minggu ini ada voucher potongan Rp 10.000 untuk Kakak dengan kode kupon: KINCLONG10.\n' +
      'Bawa cucian Kakak ke outlet kami hari ini ya!',
    connection_status: 'connected',
    last_connected_at: new Date(Date.now() - 3600000).toISOString(),
  },
  outlet: {
    name: 'SiKucek Fresh Laundry (Outlet Kampus)',
    phone: '081234567890',
    address: 'Jl. SiKucek Fresh No. 88, Sleman, Yogyakarta',
    open_hours: '07:00 - 21:00 WIB Setiap Hari',
    maps_url: 'https://maps.google.com/?q=SiKucek+Laundry',
  },
  business_rules: {
    min_weight_kiloan: BUSINESS_DEFAULTS.DEFAULT_MIN_WEIGHT_KG, // 2.0 kg
    stamp_target: BUSINESS_DEFAULTS.STAMP_TARGET_COUNT, // 5
    stamp_reward_max_kg: BUSINESS_DEFAULTS.STAMP_REWARD_MAX_KG, // 5.0 kg
    dormant_days_limit: BUSINESS_DEFAULTS.DORMANT_DAYS_THRESHOLD, // 14 hari
  },
};

const SETTINGS_STORAGE_KEY = 'sikucek_app_settings_v1';

export function getAppSettings(): AppSettingsBundle {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    const parsed = JSON.parse(raw);
    return {
      midtrans: { ...DEFAULT_SETTINGS.midtrans, ...parsed.midtrans },
      whatsapp: { ...DEFAULT_SETTINGS.whatsapp, ...parsed.whatsapp },
      outlet: { ...DEFAULT_SETTINGS.outlet, ...parsed.outlet },
      business_rules: { ...DEFAULT_SETTINGS.business_rules, ...parsed.business_rules },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveAppSettings(newSettings: AppSettingsBundle): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
  } catch (err) {
    console.error('Failed to save settings to localStorage', err);
  }
}
