/**
 * Financial, Weight & Date Formatters for SiKucek Laundry System
 */

/**
 * Format numeric value to Indonesian Rupiah (IDR)
 * Pure tabular numeric representation, e.g. Rp 45.000
 */
export function formatRupiah(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'Rp 0';
  }
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return formatted.replace(/\s+/g, ' ');
}

/**
 * Format weight in kilograms with up to 2 decimal places
 * e.g. 2.45 kg or 3.00 kg
 */
export function formatKg(weight: number): string {
  if (isNaN(weight) || weight === null || weight === undefined) {
    return '0.00 kg';
  }
  return `${weight.toFixed(2)} kg`;
}

/**
 * Standardize Indonesian phone numbers to international 62 format
 * e.g. '08123456789' -> '628123456789'
 * e.g. '+628123456789' -> '628123456789'
 */
export function normalizeIndonesianPhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  } else if (cleaned.startsWith('62')) {
    // Already in 62 format
  } else if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
}

export interface HybridCalculationParams {
  kiloanItems: Array<{
    weightKg: number;
    pricePerKg: number;
    minWeightKg?: number;
  }>;
  satuanItems: Array<{
    quantity: number;
    pricePerUnit: number;
  }>;
  appliedCoupon?: {
    type: 'free_kiloan' | 'percentage' | 'fixed_amount';
    value: number; // For free_kiloan: max kg (e.g. 5.0). For percentage: e.g. 10. For fixed: e.g. 10000
    maxDiscountAmount?: number;
  } | null;
}

export interface HybridCalculationResult {
  totalKiloanWeight: number;
  chargedKiloanWeight: number;
  kiloanSubtotal: number;
  satuanSubtotal: number;
  grossAmount: number;
  discountAmount: number;
  finalAmount: number;
  discountExplanation: string;
}

/**
 * Hybrid Order Billing Calculation
 * STRICT BUSINESS RULE (PRD Bab 10.4):
 * Free Kiloan Stamp Coupon (max 5 kg) ONLY discounts the kiloan portion!
 * Unit (Satuan) items are strictly charged in full with ZERO discount applied.
 */
export function calculateHybridBilling(params: HybridCalculationParams): HybridCalculationResult {
  let totalKiloanWeight = 0;
  let chargedKiloanWeight = 0;
  let kiloanSubtotal = 0;

  for (const item of params.kiloanItems) {
    totalKiloanWeight += item.weightKg;
    const minWeight = item.minWeightKg || 0;
    const charged = Math.max(item.weightKg, minWeight);
    chargedKiloanWeight += charged;
    kiloanSubtotal += charged * item.pricePerKg;
  }

  let satuanSubtotal = 0;
  for (const item of params.satuanItems) {
    satuanSubtotal += item.quantity * item.pricePerUnit;
  }

  const grossAmount = kiloanSubtotal + satuanSubtotal;
  let discountAmount = 0;
  let discountExplanation = 'Tidak ada diskon';

  if (params.appliedCoupon) {
    const { type, value, maxDiscountAmount } = params.appliedCoupon;

    if (type === 'free_kiloan') {
      // Free kiloan coupon strictly discounts kiloan subtotal
      if (params.kiloanItems.length > 0 && kiloanSubtotal > 0) {
        // Find effective rate per kg across items
        const effectiveRatePerKg = kiloanSubtotal / (chargedKiloanWeight || 1);
        const freeKg = Math.min(chargedKiloanWeight, value);
        discountAmount = Math.round(freeKg * effectiveRatePerKg);
        discountExplanation = `Gratis Cuci Kiloan ${freeKg.toFixed(2)} kg (Hanya memotong porsi kiloan)`;
      } else {
        discountAmount = 0;
        discountExplanation = 'Kupon kiloan tidak dapat diterapkan karena tidak ada item kiloan dalam pesanan';
      }
    } else if (type === 'percentage') {
      const rawDiscount = (grossAmount * value) / 100;
      discountAmount = maxDiscountAmount ? Math.min(rawDiscount, maxDiscountAmount) : rawDiscount;
      discountAmount = Math.round(discountAmount);
      discountExplanation = `Diskon ${value}%`;
    } else if (type === 'fixed_amount') {
      discountAmount = Math.min(grossAmount, value);
      discountExplanation = `Potongan langsung ${formatRupiah(value)}`;
    }
  }

  const finalAmount = Math.max(0, grossAmount - discountAmount);

  return {
    totalKiloanWeight,
    chargedKiloanWeight,
    kiloanSubtotal,
    satuanSubtotal,
    grossAmount,
    discountAmount,
    finalAmount,
    discountExplanation,
  };
}

/**
 * Convenient hybrid order totals calculator for POS intake
 */
export function calculateHybridOrderTotals(params: {
  kiloan_weight_kg: number;
  kiloan_unit_price: number;
  min_weight_kg?: number;
  satuan_subtotal: number;
  discount_amount?: number;
}) {
  const chargedWeight = Math.max(params.kiloan_weight_kg, params.min_weight_kg || 0);
  const kiloan_subtotal = params.kiloan_weight_kg > 0 ? chargedWeight * params.kiloan_unit_price : 0;
  const gross_amount = kiloan_subtotal + params.satuan_subtotal;
  const discount_amount = params.discount_amount || 0;
  const final_amount = Math.max(0, gross_amount - discount_amount);

  return {
    kiloan_weight_kg: params.kiloan_weight_kg,
    kiloan_charged_weight_kg: params.kiloan_weight_kg > 0 ? chargedWeight : 0,
    kiloan_subtotal,
    satuan_subtotal: params.satuan_subtotal,
    gross_amount,
    discount_amount,
    final_amount,
  };
}

/**
 * Format ISO date string into Indonesian readable format
 * e.g. '08 Okt 2026, 14:30 WIB'
 */
export function formatIndonesianDateTime(dateStr: string | Date): string {
  if (!dateStr) return '-';
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  if (isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date) + ' WIB';
}

/**
 * Format payment channel into a customer-friendly clean label
 * Ensures NO backend vendor / gateway names (such as Midtrans) are exposed in customer interfaces
 */
export function formatPaymentChannelName(channel?: string | null): string {
  if (!channel) return 'QRIS';
  switch (channel.toLowerCase()) {
    case 'cash':
      return 'Tunai';
    case 'midtrans_qris':
    case 'qris':
      return 'QRIS';
    case 'midtrans_va':
    case 'va':
      return 'Transfer Bank';
    case 'midtrans_gopay':
    case 'gopay':
      return 'GoPay';
    default:
      return 'QRIS';
  }
}
