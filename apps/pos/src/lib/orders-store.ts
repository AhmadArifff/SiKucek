import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  PAYMENT_CHANNEL,
  SERVICE_CATEGORY,
  BUSINESS_DEFAULTS,
  type OrderStatus,
  type PaymentStatus,
  type PaymentChannel,
  type QcIssueType,
} from '@sikucek/shared';
import { calculateHybridOrderTotals } from '@sikucek/shared';

export interface PosOrderItem {
  service_id: string;
  service_name: string;
  category: 'kiloan' | 'satuan';
  quantity: number;
  price_per_unit: number;
  subtotal: number;
  notes?: string;
}

export interface PosQcPhoto {
  id: string;
  photo_url: string; // base64 or blob or storage url
  issue_type: QcIssueType;
  description?: string;
  created_at: string;
}

export interface PosOrder {
  id: string;
  order_number: string;
  tracking_code: string;
  customer_name: string;
  customer_phone: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_channel: PaymentChannel;
  rack_location?: string;
  kiloan_weight_kg: number;
  kiloan_charged_weight_kg: number;
  kiloan_subtotal: number;
  satuan_subtotal: number;
  gross_amount: number;
  discount_amount: number;
  final_amount: number;
  cash_received?: number;
  cash_change?: number;
  items: PosOrderItem[];
  qc_photos: PosQcPhoto[];
  notes?: string;
  created_at: string;
  estimated_ready_at: string;
}

export const INITIAL_SERVICES = [
  // Kiloan Services
  {
    id: 'srv-kilo-reguler',
    name: 'Cuci Kering Setrika (Reguler 2 Hari)',
    category: 'kiloan' as const,
    unit_name: 'kg',
    price_per_unit: 7000,
    min_weight_kg: 2.0,
    estimated_duration_hours: 48,
  },
  {
    id: 'srv-kilo-express',
    name: 'Cuci Kering Setrika (Express 1 Hari)',
    category: 'kiloan' as const,
    unit_name: 'kg',
    price_per_unit: 10000,
    min_weight_kg: 2.0,
    estimated_duration_hours: 24,
  },
  {
    id: 'srv-kilo-kilat',
    name: 'Cuci Kering Setrika (Kilat 6 Jam)',
    category: 'kiloan' as const,
    unit_name: 'kg',
    price_per_unit: 15000,
    min_weight_kg: 2.0,
    estimated_duration_hours: 6,
  },
  // Satuan Services
  {
    id: 'srv-sat-kemeja',
    name: 'Kemeja / Blouse',
    category: 'satuan' as const,
    unit_name: 'pcs',
    price_per_unit: 5000,
    estimated_duration_hours: 48,
  },
  {
    id: 'srv-sat-celana',
    name: 'Celana Panjang / Jeans',
    category: 'satuan' as const,
    unit_name: 'pcs',
    price_per_unit: 7000,
    estimated_duration_hours: 48,
  },
  {
    id: 'srv-sat-jas',
    name: 'Jas / Blazer Formal',
    category: 'satuan' as const,
    unit_name: 'pcs',
    price_per_unit: 20000,
    estimated_duration_hours: 48,
  },
  {
    id: 'srv-sat-bedcover',
    name: 'Bed Cover Besar (King)',
    category: 'satuan' as const,
    unit_name: 'pcs',
    price_per_unit: 25000,
    estimated_duration_hours: 48,
  },
  {
    id: 'srv-sat-selimut',
    name: 'Selimut Tebal',
    category: 'satuan' as const,
    unit_name: 'pcs',
    price_per_unit: 15000,
    estimated_duration_hours: 48,
  },
  {
    id: 'srv-sat-sepatu',
    name: 'Sepatu Sneakers / Canvas',
    category: 'satuan' as const,
    unit_name: 'pasang',
    price_per_unit: 25000,
    estimated_duration_hours: 72,
  },
];

export const INITIAL_RACKS = [
  { code: 'RAK-A1', description: 'Rak Atas Reguler Kiloan', is_occupied: false },
  { code: 'RAK-A2', description: 'Rak Tengah Reguler Kiloan', is_occupied: true },
  { code: 'RAK-B1', description: 'Rak Bawah Bed Cover & Selimut', is_occupied: false },
  { code: 'RAK-B2', description: 'Rak Tengah Express', is_occupied: false },
  { code: 'GANTUNG-01', description: 'Hanger Khusus Jas & Gamis', is_occupied: false },
  { code: 'GANTUNG-02', description: 'Hanger Kemeja Rapi', is_occupied: false },
];

export const INITIAL_ORDERS: PosOrder[] = [
  {
    id: 'ord-001',
    order_number: 'SKC-261009-0001',
    tracking_code: 'SKC-R4N1X',
    customer_name: 'Rani Maharani',
    customer_phone: '081234567890',
    status: 'washing',
    payment_status: 'paid',
    payment_channel: 'cash',
    kiloan_weight_kg: 3.2,
    kiloan_charged_weight_kg: 3.2,
    kiloan_subtotal: 22400,
    satuan_subtotal: 10000,
    gross_amount: 32400,
    discount_amount: 0,
    final_amount: 32400,
    cash_received: 50000,
    cash_change: 17600,
    items: [
      {
        service_id: 'srv-kilo-reguler',
        service_name: 'Cuci Kering Setrika (Reguler 2 Hari)',
        category: 'kiloan',
        quantity: 3.2,
        price_per_unit: 7000,
        subtotal: 22400,
      },
      {
        service_id: 'srv-sat-kemeja',
        service_name: 'Kemeja / Blouse',
        category: 'satuan',
        quantity: 2,
        price_per_unit: 5000,
        subtotal: 10000,
      },
    ],
    qc_photos: [
      {
        id: 'qc-001',
        photo_url: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&auto=format&fit=crop&q=60',
        issue_type: 'stain',
        description: 'Ada noda kecap di kerah kemeja putih',
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
    notes: 'Pisahkan baju putih dan jangan gunakan pemutih keras.',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    estimated_ready_at: new Date(Date.now() + 172800000).toISOString(),
  },
  {
    id: 'ord-002',
    order_number: 'SKC-261009-0002',
    tracking_code: 'SKC-B8D02',
    customer_name: 'Budi Prasetyo',
    customer_phone: '085712345678',
    status: 'ready',
    payment_status: 'paid',
    payment_channel: 'midtrans_qris',
    rack_location: 'RAK-A2',
    kiloan_weight_kg: 4.5,
    kiloan_charged_weight_kg: 4.5,
    kiloan_subtotal: 31500,
    satuan_subtotal: 0,
    gross_amount: 31500,
    discount_amount: 0,
    final_amount: 31500,
    items: [
      {
        service_id: 'srv-kilo-reguler',
        service_name: 'Cuci Kering Setrika (Reguler 2 Hari)',
        category: 'kiloan',
        quantity: 4.5,
        price_per_unit: 7000,
        subtotal: 31500,
      },
    ],
    qc_photos: [],
    created_at: new Date(Date.now() - 86400000).toISOString(),
    estimated_ready_at: new Date(Date.now() - 3600000).toISOString(),
  },
];

// In-Memory Storage Key for Local Persistence in Browser
const STORAGE_KEY = 'sikucek_pos_orders_v1';

export function getStoredOrders(): PosOrder[] {
  if (typeof window === 'undefined') return INITIAL_ORDERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ORDERS;
  }
}

export function saveStoredOrders(orders: PosOrder[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error('Failed to save orders to localStorage', err);
  }
}

export function createPosOrder(data: {
  customer_name: string;
  customer_phone: string;
  items: PosOrderItem[];
  qc_photos: PosQcPhoto[];
  payment_channel: PaymentChannel;
  paid_immediately: boolean;
  cash_received?: number;
  notes?: string;
  discount_amount?: number;
}): PosOrder {
  const kiloanItems = data.items.filter((i) => i.category === 'kiloan');
  const satuanItems = data.items.filter((i) => i.category === 'satuan');

  const kiloan_weight_kg = kiloanItems.reduce((acc, i) => acc + i.quantity, 0);
  const kiloan_unit_price = kiloanItems[0]?.price_per_unit || 7000;
  const satuan_subtotal = satuanItems.reduce((acc, i) => acc + i.subtotal, 0);

  const totals = calculateHybridOrderTotals({
    kiloan_weight_kg,
    kiloan_unit_price,
    min_weight_kg: BUSINESS_DEFAULTS.DEFAULT_MIN_WEIGHT_KG,
    satuan_subtotal,
    discount_amount: data.discount_amount || 0,
  });

  const now = new Date();
  const dateStr = now.toISOString().slice(2, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();

  const newOrder: PosOrder = {
    id: 'ord-' + Date.now(),
    order_number: `SKC-${dateStr}-${randomSuffix}`,
    tracking_code: `SKC-${randomCode}`,
    customer_name: data.customer_name,
    customer_phone: data.customer_phone,
    status: 'received',
    payment_status: data.paid_immediately ? 'paid' : 'unpaid',
    payment_channel: data.payment_channel,
    kiloan_weight_kg: totals.kiloan_weight_kg,
    kiloan_charged_weight_kg: totals.kiloan_charged_weight_kg,
    kiloan_subtotal: totals.kiloan_subtotal,
    satuan_subtotal: totals.satuan_subtotal,
    gross_amount: totals.gross_amount,
    discount_amount: totals.discount_amount,
    final_amount: totals.final_amount,
    cash_received: data.cash_received,
    cash_change: data.cash_received ? Math.max(0, data.cash_received - totals.final_amount) : 0,
    items: data.items,
    qc_photos: data.qc_photos,
    notes: data.notes,
    created_at: now.toISOString(),
    estimated_ready_at: new Date(now.getTime() + 48 * 3600000).toISOString(),
  };

  const existing = getStoredOrders();
  const updated = [newOrder, ...existing];
  saveStoredOrders(updated);
  return newOrder;
}

export function updatePosOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  rackLocation?: string
): { success: boolean; error?: string; order?: PosOrder } {
  // Guardrail Bab 10.5 PRD: jika status READY, nomor rak WAJIB diisi
  if (newStatus === ORDER_STATUS.READY) {
    if (!rackLocation || rackLocation.trim().length === 0) {
      return {
        success: false,
        error: 'Lokasi rak fisik (rack_location) WAJIB dipilih sebelum pesanan ditandai Siap Ambil (Ready)!',
      };
    }
  }

  const orders = getStoredOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx === -1) {
    return { success: false, error: 'Pesanan tidak ditemukan' };
  }

  const updatedOrder: PosOrder = {
    ...orders[idx],
    status: newStatus,
    ...(rackLocation ? { rack_location: rackLocation } : {}),
  };

  orders[idx] = updatedOrder;
  saveStoredOrders(orders);
  return { success: true, order: updatedOrder };
}

export function updatePosOrderPayment(
  orderId: string,
  paymentChannel: PaymentChannel = 'midtrans_qris',
  paymentStatus: PaymentStatus = 'paid'
): { success: boolean; error?: string; order?: PosOrder } {
  const orders = getStoredOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx === -1) {
    return { success: false, error: 'Pesanan tidak ditemukan' };
  }

  const updatedOrder: PosOrder = {
    ...orders[idx],
    payment_status: paymentStatus,
    payment_channel: paymentChannel,
  };

  orders[idx] = updatedOrder;
  saveStoredOrders(orders);
  return { success: true, order: updatedOrder };
}

