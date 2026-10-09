import {
  Coupon,
  MarketingCampaign,
  MarketingBanner,
  CustomerTier,
  DiscountType,
} from '@sikucek/shared';

export interface AdminCustomerProfile {
  id: string;
  name: string;
  phone: string;
  tier: CustomerTier;
  points_balance: number;
  total_completed_orders: number;
  last_order_at: string;
  days_since_last_order: number;
  is_dormant: boolean; // true if > 14 days
  referral_code: string;
}

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'cp-001',
    code: 'STEMPEL-5KG-FREE',
    title: 'Gratis Cuci Kiloan Maksimal 5 Kg',
    description: 'Hadiah loyalitas penyelesaian 5 stempel cucian. Hanya memotong porsi kiloan.',
    discount_type: 'free_kiloan',
    discount_value: 5.0, // 5.0 kg
    max_discount_amount: null,
    min_order_amount: null,
    is_active: true,
    valid_from: '2026-01-01',
    valid_until: '2026-12-31',
  },
  {
    id: 'cp-002',
    code: 'WELCOME-10K',
    title: 'Voucher Pelanggan Baru Rp 10.000',
    description: 'Potongan langsung untuk transaksi cucian pertama.',
    discount_type: 'fixed_amount',
    discount_value: 10000,
    max_discount_amount: null,
    min_order_amount: 30000,
    is_active: true,
    valid_from: '2026-01-01',
    valid_until: '2026-12-31',
  },
  {
    id: 'cp-003',
    code: 'WINBACK-15K',
    title: 'Voucher Kangen SiKucek Rp 15.000',
    description: 'Spesial untuk pelanggan dorman yang belum mencuci lebih dari 14 hari.',
    discount_type: 'fixed_amount',
    discount_value: 15000,
    max_discount_amount: null,
    min_order_amount: 35000,
    is_active: true,
    valid_from: '2026-01-01',
    valid_until: '2026-12-31',
  },
  {
    id: 'cp-004',
    code: 'EXPRESS-10',
    title: 'Diskon 10% Layanan Express 1 Hari',
    description: 'Potongan hemat untuk pelanggan dengan kebutuhan cucian kilat.',
    discount_type: 'percentage',
    discount_value: 10,
    max_discount_amount: 20000,
    min_order_amount: 25000,
    is_active: true,
    valid_from: '2026-01-01',
    valid_until: '2026-12-31',
  },
  {
    id: 'cp-005',
    code: 'MHS-HEMAT',
    title: 'Diskon 15% Pelajar & Mahasiswa',
    description: 'Tunjukkan kartu tanda mahasiswa aktif untuk klaim diskon.',
    discount_type: 'percentage',
    discount_value: 15,
    max_discount_amount: 25000,
    min_order_amount: 20000,
    is_active: true,
    valid_from: '2026-01-01',
    valid_until: '2026-12-31',
  },
];

export const INITIAL_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: 'cmp-001',
    title: 'Instagram Ads Mahasiswa Baru Sleman',
    channel: 'instagram_ads',
    promo_code: 'IGMHS26',
    budget_amount: 500000,
    total_discount_given: 320000,
    total_revenue_generated: 2450000,
    roi_ratio: 4.9,
    starts_at: '2026-09-01',
    ends_at: '2026-10-31',
    is_active: true,
  },
  {
    id: 'cmp-002',
    title: 'TikTok Video Edukasi Cuci Sepatu & Jas',
    channel: 'tiktok_organic',
    promo_code: 'TIKTOKSEPATU',
    budget_amount: 150000,
    total_discount_given: 180000,
    total_revenue_generated: 1120000,
    roi_ratio: 7.4,
    starts_at: '2026-09-15',
    ends_at: '2026-10-31',
    is_active: true,
  },
  {
    id: 'cmp-003',
    title: 'Penyebaran Brosur Kos-Kosan Kampus',
    channel: 'brosur_kampus',
    promo_code: 'BROSURKOS',
    budget_amount: 300000,
    total_discount_given: 240000,
    total_revenue_generated: 980000,
    roi_ratio: 3.2,
    starts_at: '2026-09-10',
    ends_at: '2026-10-15',
    is_active: true,
  },
  {
    id: 'cmp-004',
    title: 'Program Ajak Teman (Referral Koin)',
    channel: 'referral',
    promo_code: 'AJAKTEMAN',
    budget_amount: 200000,
    total_discount_given: 150000,
    total_revenue_generated: 890000,
    roi_ratio: 4.4,
    starts_at: '2026-08-01',
    ends_at: '2026-12-31',
    is_active: true,
  },
  {
    id: 'cmp-005',
    title: 'Sponsorship Bazar Kampus Boulevard',
    channel: 'event_bazar',
    promo_code: 'BAZAR26',
    budget_amount: 400000,
    total_discount_given: 310000,
    total_revenue_generated: 1650000,
    roi_ratio: 4.1,
    starts_at: '2026-09-20',
    ends_at: '2026-10-05',
    is_active: false,
  },
];

export const INITIAL_BANNERS: MarketingBanner[] = [
  {
    id: 'ban-001',
    title: 'Kumpulkan 5 Stempel: Gratis Cuci Kiloan 5 Kg!',
    image_url: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=1200&auto=format&fit=crop&q=80',
    action_url: '/app',
    sort_order: 1,
    is_active: true,
    created_at: '2026-09-01T08:00:00Z',
  },
  {
    id: 'ban-002',
    title: 'Promo Mahasiswa: Diskon 15% Cuci Kiloan Hari Senin-Rabu',
    image_url: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=1200&auto=format&fit=crop&q=80',
    action_url: '/#kalkulator',
    sort_order: 2,
    is_active: true,
    created_at: '2026-09-05T08:00:00Z',
  },
  {
    id: 'ban-003',
    title: 'Perawatan Sepatu Sneakers & Jas Formal Bebas Kusut',
    image_url: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=1200&auto=format&fit=crop&q=80',
    action_url: '/#layanan',
    sort_order: 3,
    is_active: true,
    created_at: '2026-09-10T08:00:00Z',
  },
];

export const INITIAL_CUSTOMERS: AdminCustomerProfile[] = [
  {
    id: 'cust-001',
    name: 'Rani Maharani',
    phone: '081234567890',
    tier: 'wangi_segar',
    points_balance: 240,
    total_completed_orders: 6,
    last_order_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    days_since_last_order: 1,
    is_dormant: false,
    referral_code: 'RANI-KUCEK',
  },
  {
    id: 'cust-002',
    name: 'Budi Prasetyo',
    phone: '085712345678',
    tier: 'busa_baru',
    points_balance: 50,
    total_completed_orders: 2,
    last_order_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    days_since_last_order: 2,
    is_dormant: false,
    referral_code: 'BUDI-SKC',
  },
  {
    id: 'cust-003',
    name: 'Sinta Amelia',
    phone: '081399887766',
    tier: 'kinclong_sultan',
    points_balance: 480,
    total_completed_orders: 16,
    last_order_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    days_since_last_order: 3,
    is_dormant: false,
    referral_code: 'SINTA-VIP',
  },
  {
    id: 'cust-004',
    name: 'Denny Pratama',
    phone: '087811223344',
    tier: 'busa_baru',
    points_balance: 30,
    total_completed_orders: 3,
    last_order_at: new Date(Date.now() - 86400000 * 19).toISOString(),
    days_since_last_order: 19,
    is_dormant: true, // > 14 hari
    referral_code: 'DENNY-99',
  },
  {
    id: 'cust-005',
    name: 'Maya Anggraini',
    phone: '082155667788',
    tier: 'wangi_segar',
    points_balance: 180,
    total_completed_orders: 7,
    last_order_at: new Date(Date.now() - 86400000 * 25).toISOString(),
    days_since_last_order: 25,
    is_dormant: true, // > 14 hari
    referral_code: 'MAYA-SEGAR',
  },
  {
    id: 'cust-006',
    name: 'Reza Firmansyah',
    phone: '089677889900',
    tier: 'busa_baru',
    points_balance: 20,
    total_completed_orders: 1,
    last_order_at: new Date(Date.now() - 86400000 * 32).toISOString(),
    days_since_last_order: 32,
    is_dormant: true, // > 14 hari
    referral_code: 'REZA-SKC',
  },
];

// Local Storage Keys
const COUPONS_STORAGE_KEY = 'sikucek_admin_coupons_v1';
const CAMPAIGNS_STORAGE_KEY = 'sikucek_admin_campaigns_v1';
const BANNERS_STORAGE_KEY = 'sikucek_admin_banners_v1';
const CUSTOMERS_STORAGE_KEY = 'sikucek_admin_customers_v1';

export function getStoredCoupons(): Coupon[] {
  if (typeof window === 'undefined') return INITIAL_COUPONS;
  try {
    const raw = localStorage.getItem(COUPONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(INITIAL_COUPONS));
      return INITIAL_COUPONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_COUPONS;
  }
}

export function saveStoredCoupons(coupons: Coupon[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(coupons));
  } catch (err) {
    console.error('Failed to save coupons', err);
  }
}

export function getStoredCampaigns(): MarketingCampaign[] {
  if (typeof window === 'undefined') return INITIAL_CAMPAIGNS;
  try {
    const raw = localStorage.getItem(CAMPAIGNS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CAMPAIGNS_STORAGE_KEY, JSON.stringify(INITIAL_CAMPAIGNS));
      return INITIAL_CAMPAIGNS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CAMPAIGNS;
  }
}

export function saveStoredCampaigns(campaigns: MarketingCampaign[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CAMPAIGNS_STORAGE_KEY, JSON.stringify(campaigns));
  } catch (err) {
    console.error('Failed to save campaigns', err);
  }
}

export function getStoredBanners(): MarketingBanner[] {
  if (typeof window === 'undefined') return INITIAL_BANNERS;
  try {
    const raw = localStorage.getItem(BANNERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(BANNERS_STORAGE_KEY, JSON.stringify(INITIAL_BANNERS));
      return INITIAL_BANNERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_BANNERS;
  }
}

export function saveStoredBanners(banners: MarketingBanner[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(BANNERS_STORAGE_KEY, JSON.stringify(banners));
  } catch (err) {
    console.error('Failed to save banners', err);
  }
}

export function getStoredCustomers(): AdminCustomerProfile[] {
  if (typeof window === 'undefined') return INITIAL_CUSTOMERS;
  try {
    const raw = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(INITIAL_CUSTOMERS));
      return INITIAL_CUSTOMERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CUSTOMERS;
  }
}

export function saveStoredCustomers(customers: AdminCustomerProfile[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
  } catch (err) {
    console.error('Failed to save customers', err);
  }
}
