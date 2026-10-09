/**
 * Constants & Enums Definition for SiKucek Laundry System
 */

export const ORDER_STATUS = {
  RECEIVED: 'received',
  WASHING: 'washing',
  DRYING: 'drying',
  IRONING: 'ironing',
  PACKING_QC: 'packing_qc',
  READY: 'ready',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

export const PAYMENT_STATUS = {
  UNPAID: 'unpaid',
  PENDING: 'pending',
  PAID: 'paid',
  REFUNDED: 'refunded',
  EXPIRED: 'expired',
} as const;

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];

export const PAYMENT_CHANNEL = {
  CASH: 'cash',
  MIDTRANS_QRIS: 'midtrans_qris',
  MIDTRANS_VA: 'midtrans_va',
  MIDTRANS_GOPAY: 'midtrans_gopay',
} as const;

export type PaymentChannel = typeof PAYMENT_CHANNEL[keyof typeof PAYMENT_CHANNEL];

export const SERVICE_CATEGORY = {
  KILOAN: 'kiloan',
  SATUAN: 'satuan',
} as const;

export type ServiceCategory = typeof SERVICE_CATEGORY[keyof typeof SERVICE_CATEGORY];

export const QC_ISSUE_TYPE = {
  TORN: 'torn',
  STAIN: 'stain',
  COLOR_FADED: 'color_faded',
  MISSING_BUTTON: 'missing_button',
  OTHER: 'other',
} as const;

export type QcIssueType = typeof QC_ISSUE_TYPE[keyof typeof QC_ISSUE_TYPE];

export const QC_ISSUE_LABELS: Record<QcIssueType, string> = {
  torn: 'Sobek / Jahitan Lepas',
  stain: 'Noda Membandel / Jamur',
  color_faded: 'Luntur Awal',
  missing_button: 'Kancing Lepas / Hilang',
  other: 'Kondisi Cacat Lainnya',
};

export const USER_ROLE = {
  CUSTOMER: 'customer',
  CASHIER: 'cashier',
  WASHER: 'washer',
  IRONER: 'ironer',
  OWNER: 'owner',
} as const;

export type UserRole = typeof USER_ROLE[keyof typeof USER_ROLE];

export const DISCOUNT_TYPE = {
  FREE_KILOAN: 'free_kiloan',
  PERCENTAGE: 'percentage',
  FIXED_AMOUNT: 'fixed_amount',
} as const;

export type DiscountType = typeof DISCOUNT_TYPE[keyof typeof DISCOUNT_TYPE];

export const CUSTOMER_TIER = {
  BUSA_BARU: 'busa_baru',
  WANGI_SEGAR: 'wangi_segar',
  KINCLONG_SULTAN: 'kinclong_sultan',
} as const;

export type CustomerTier = typeof CUSTOMER_TIER[keyof typeof CUSTOMER_TIER];

export const BUSINESS_DEFAULTS = {
  DEFAULT_MIN_WEIGHT_KG: 2.0,
  STAMP_TARGET_COUNT: 5,
  STAMP_REWARD_MAX_KG: 5.0,
  DORMANT_DAYS_THRESHOLD: 14,
  MAX_PHOTO_UPLOAD_BYTES: 500 * 1024, // 500 KB client-side WebP compression
} as const;
