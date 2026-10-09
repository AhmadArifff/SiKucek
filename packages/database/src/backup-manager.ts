/**
 * @sikucek/database - backup-manager.ts
 * Enterprise Database Maintenance, Backup Snapshot, Restore, & Reset Toolkit
 */

export interface SiKucekBackupBundle {
  app: 'SiKucek';
  format_version: '1.0.0';
  exported_at: string;
  source: 'pos_admin' | 'cli_runner' | 'cloud_sync';
  metadata: {
    total_orders: number;
    total_services: number;
    total_racks: number;
    total_coupons: number;
    total_customers: number;
    description: string;
  };
  data: {
    orders: any[];
    services: any[];
    racks: any[];
    coupons: any[];
    campaigns: any[];
    banners: any[];
    customers: any[];
    app_settings: any;
  };
}

/**
 * Validates whether an uploaded object conforms to the canonical SiKucek backup format.
 */
export function validateBackupBundle(bundle: any): {
  valid: boolean;
  error?: string;
  metadata?: SiKucekBackupBundle['metadata'];
} {
  if (!bundle || typeof bundle !== 'object') {
    return { valid: false, error: 'Berkas cadangan tidak valid (bukan JSON object).' };
  }

  if (bundle.app !== 'SiKucek') {
    return { valid: false, error: 'Format berkas tidak cocok. Nilai app wajib "SiKucek".' };
  }

  if (!bundle.data || typeof bundle.data !== 'object') {
    return { valid: false, error: 'Bagian data cadangan tidak ditemukan.' };
  }

  const { orders, services, racks, app_settings } = bundle.data;
  if (!Array.isArray(orders) || !Array.isArray(services) || !Array.isArray(racks)) {
    return { valid: false, error: 'Struktur entitas orders/services/racks wajib berupa array.' };
  }

  return {
    valid: true,
    metadata: bundle.metadata || {
      total_orders: orders.length,
      total_services: services.length,
      total_racks: racks.length,
      total_coupons: bundle.data.coupons?.length || 0,
      total_customers: bundle.data.customers?.length || 0,
      description: 'Snapshot Valid SiKucek',
    },
  };
}

/**
 * Assembles a standardized backup bundle from runtime datasets.
 */
export function generateBackupBundle(
  dataset: {
    orders?: any[];
    services?: any[];
    racks?: any[];
    coupons?: any[];
    campaigns?: any[];
    banners?: any[];
    customers?: any[];
    app_settings?: any;
  },
  source: 'pos_admin' | 'cli_runner' | 'cloud_sync' = 'pos_admin'
): SiKucekBackupBundle {
  const orders = dataset.orders || [];
  const services = dataset.services || [];
  const racks = dataset.racks || [];
  const coupons = dataset.coupons || [];
  const campaigns = dataset.campaigns || [];
  const banners = dataset.banners || [];
  const customers = dataset.customers || [];
  const app_settings = dataset.app_settings || {};

  return {
    app: 'SiKucek',
    format_version: '1.0.0',
    exported_at: new Date().toISOString(),
    source,
    metadata: {
      total_orders: orders.length,
      total_services: services.length,
      total_racks: racks.length,
      total_coupons: coupons.length,
      total_customers: customers.length,
      description: `Snapshot Cadangan Database SiKucek (${new Date().toLocaleDateString('id-ID', {
        dateStyle: 'medium',
      })})`,
    },
    data: {
      orders,
      services,
      racks,
      coupons,
      campaigns,
      banners,
      customers,
      app_settings,
    },
  };
}

/**
 * Manifest information for PostgreSQL Database migrations (PRD Bab 7).
 */
export const DATABASE_MIGRATION_MANIFEST = {
  migration_name: '001_initial_schema.sql',
  total_tables: 18,
  tables: [
    { name: 'profiles', category: 'Auth & Identitas', primary_key: 'id' },
    { name: 'services', category: 'Katalog Layanan', primary_key: 'id' },
    { name: 'racks', category: 'Fasilitas Fisik', primary_key: 'id' },
    { name: 'orders', category: 'Transaksi Inti', primary_key: 'id' },
    { name: 'order_items', category: 'Transaksi Inti', primary_key: 'id' },
    { name: 'order_qc_photos', category: 'Quality Control', primary_key: 'id' },
    { name: 'order_status_logs', category: 'Audit Linimasa', primary_key: 'id' },
    { name: 'payments', category: 'Finansial & Midtrans', primary_key: 'id' },
    { name: 'loyalty_stamp_cards', category: 'Gamifikasi & Loyalti', primary_key: 'id' },
    { name: 'daily_checkins', category: 'Gamifikasi & Loyalti', primary_key: 'id' },
    { name: 'coupons', category: 'Pemasaran & Promo', primary_key: 'id' },
    { name: 'customer_coupons', category: 'Pemasaran & Promo', primary_key: 'id' },
    { name: 'marketing_campaigns', category: 'Pemasaran & Promo', primary_key: 'id' },
    { name: 'referral_logs', category: 'Pemasaran & Promo', primary_key: 'id' },
    { name: 'marketing_banners', category: 'Pemasaran & Promo', primary_key: 'id' },
    { name: 'app_settings', category: 'Zero-Hardcode Vault', primary_key: 'key' },
    { name: 'whatsapp_queue', category: 'Otomatisasi Bot', primary_key: 'id' },
    { name: 'activity_audit_logs', category: 'Keamanan & Tata Kelola', primary_key: 'id' },
  ],
  storage_buckets: [
    { name: 'qc-photos', public: true, description: 'Bucket foto bukti cacat pakaian WebRTC' },
  ],
};
