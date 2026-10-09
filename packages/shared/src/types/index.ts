import type {
  OrderStatus,
  PaymentStatus,
  PaymentChannel,
  ServiceCategory,
  QcIssueType,
  UserRole,
  DiscountType,
  CustomerTier,
} from '../constants/index';

export interface Profile {
  id: string; // Supabase auth.users UUID
  name: string;
  phone: string;
  role: UserRole;
  tier: CustomerTier;
  points_balance: number;
  referral_code: string;
  referred_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerTierDefinition {
  id: string;
  name: CustomerTier;
  display_name: string;
  min_completed_orders: number;
  kiloan_discount_percent: number;
  priority_order: number;
}

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  unit_name: string; // 'kg', 'pcs', 'pasang', 'set'
  price_per_unit: number; // in IDR
  min_weight_kg?: number; // for kiloan services (e.g. 2.0)
  estimated_duration_hours: number;
  is_active: boolean;
  created_at: string;
}

export interface PhysicalRack {
  id: string;
  code: string; // e.g. 'RAK-A1', 'RAK-B02', 'GANTUNG-01'
  description?: string | null;
  is_occupied: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string; // e.g. 'SKC-261008-0001'
  tracking_code: string; // alphanumeric unique public code, e.g. 'SKC-X7K9P'
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_channel?: PaymentChannel | null;
  rack_location?: string | null;
  
  // Hybrid calculations
  kiloan_weight_kg: number;
  kiloan_charged_weight_kg: number;
  kiloan_subtotal: number;
  satuan_subtotal: number;
  gross_amount: number;
  discount_amount: number;
  final_amount: number;

  notes?: string | null;
  cashier_id: string;
  estimated_ready_at: string;
  actual_ready_at?: string | null;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  service_id: string;
  service_name: string;
  category: ServiceCategory;
  quantity: number; // kg for kiloan or pcs count for satuan
  price_per_unit: number;
  subtotal: number;
  notes?: string | null;
}

export interface OrderQcPhoto {
  id: string;
  order_id: string;
  photo_url: string;
  thumbnail_url?: string | null;
  issue_type: QcIssueType;
  description?: string | null;
  created_at: string;
}

export interface OrderStatusLog {
  id: string;
  order_id: string;
  from_status?: OrderStatus | null;
  to_status: OrderStatus;
  changed_by: string;
  rack_location?: string | null;
  notes?: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  channel: PaymentChannel;
  status: PaymentStatus;
  midtrans_order_id?: string | null;
  midtrans_transaction_id?: string | null;
  midtrans_payment_type?: string | null;
  qris_url?: string | null;
  va_number?: string | null;
  paid_at?: string | null;
  created_at: string;
}

export interface LoyaltyStampCard {
  id: string;
  customer_id: string;
  stamps_count: number; // 0 to 5
  cards_completed: number;
  updated_at: string;
}

export interface LoyaltyStamp {
  id: string;
  card_id: string;
  customer_id: string;
  order_id: string; // Unique constraint to prevent duplicate stamping
  created_at: string;
}

export interface DailyCheckin {
  id: string;
  customer_id: string;
  checkin_date: string; // YYYY-MM-DD
  points_earned: number;
  streak_day: number; // 1 to 7
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  discount_type: DiscountType;
  discount_value: number; // percentage or fixed IDR amount, or max kg (5.0)
  max_discount_amount?: number | null;
  min_order_amount?: number | null;
  campaign_id?: string | null;
  is_active: boolean;
  valid_from: string;
  valid_until: string;
}

export interface UserCoupon {
  id: string;
  customer_id: string;
  coupon_id: string;
  coupon?: Coupon;
  is_used: boolean;
  used_at?: string | null;
  order_id?: string | null;
  created_at: string;
}

export interface MarketingCampaign {
  id: string;
  title: string;
  channel: 'instagram_ads' | 'tiktok_organic' | 'brosur_kampus' | 'event_bazar' | 'referral' | 'other';
  promo_code?: string | null;
  budget_amount: number;
  total_discount_given: number;
  total_revenue_generated: number;
  roi_ratio: number;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
}

export interface MarketingBanner {
  id: string;
  title: string;
  image_url: string;
  action_url?: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface ReferralLog {
  id: string;
  referrer_id: string;
  referred_customer_id: string;
  first_order_id?: string | null;
  reward_points_awarded: number;
  is_rewarded: boolean;
  created_at: string;
}

export interface AppSetting<T = unknown> {
  key: string;
  category: 'payment' | 'outlet' | 'business_rules' | 'whatsapp';
  value: T;
  description?: string | null;
  is_secret: boolean;
  updated_at: string;
}

export interface MidtransConfig {
  server_key: string;
  client_key: string;
  merchant_id: string;
  is_production: boolean;
}

export interface OutletProfileConfig {
  name: string;
  phone: string;
  address: string;
  open_hours: string;
  maps_url: string;
  instagram?: string;
  tiktok?: string;
}

export interface BusinessRulesConfig {
  min_weight_kiloan: number;
  stamp_target: number;
  stamp_reward_max_kg: number;
  dormant_days_limit: number;
}

export interface WhatsAppMessageQueue {
  id: string;
  phone_number: string;
  message_body: string;
  order_id?: string | null;
  event_type: 'order_received' | 'order_ready' | 'winback' | 'custom';
  status: 'pending' | 'sent' | 'failed';
  attempts: number;
  error_message?: string | null;
  sent_at?: string | null;
  created_at: string;
}
