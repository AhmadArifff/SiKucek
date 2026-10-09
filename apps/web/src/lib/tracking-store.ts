import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  PAYMENT_CHANNEL,
  QC_ISSUE_LABELS,
  type OrderStatus,
  type PaymentStatus,
  type PaymentChannel,
  type QcIssueType,
} from '@sikucek/shared';

export interface TrackingItem {
  name: string;
  category: 'kiloan' | 'satuan';
  quantity: number;
  unit: string;
  pricePerUnit: number;
  subtotal: number;
}

export interface TrackingQcPhoto {
  id: string;
  photoUrl: string;
  issueType: QcIssueType;
  issueLabel: string;
  description: string;
  createdAt: string;
}

export interface TrackingStep {
  status: OrderStatus;
  label: string;
  description: string;
  timestamp?: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface PublicOrderTracking {
  id: string;
  orderNumber: string;
  trackingCode: string;
  customerName: string;
  customerPhone: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentChannel: PaymentChannel;
  rackLocation?: string;
  kiloanWeightKg: number;
  kiloanChargedWeightKg: number;
  kiloanSubtotal: number;
  satuanSubtotal: number;
  grossAmount: number;
  discountAmount: number;
  discountExplanation?: string;
  finalAmount: number;
  createdAt: string;
  estimatedReadyAt: string;
  actualReadyAt?: string;
  notes?: string;
  items: TrackingItem[];
  qcPhotos: TrackingQcPhoto[];
  steps: TrackingStep[];
  isSimulation?: boolean;
}

export const TIMELINE_STAGES: Array<{
  status: OrderStatus;
  label: string;
  description: string;
}> = [
  {
    status: 'received',
    label: 'Diterima di Kasir',
    description: 'Pakaian telah ditimbang, dicek QC awal, dan masuk antrean.',
  },
  {
    status: 'washing',
    label: 'Proses Pencucian',
    description: 'Pakaian sedang dicuci dengan deterjen higienis dan pewangi ramah serat.',
  },
  {
    status: 'drying',
    label: 'Proses Pengeringan',
    description: 'Pakaian berada di mesin pengering suhu terkontrol anti-susut.',
  },
  {
    status: 'ironing',
    label: 'Setrika Uap & Lipat',
    description: 'Pakaian disetrika uap presisi agar rapi dan licin maksimal.',
  },
  {
    status: 'packing_qc',
    label: 'Pengecekan Akhir & Packing',
    description: 'Pemeriksaan kelengkapan helai dan dipacking plastik kedap debu.',
  },
  {
    status: 'ready',
    label: 'Siap Diambil di Rak',
    description: 'Pakaian telah diletakkan di rak penyimpanan outlet dan siap diambil.',
  },
  {
    status: 'completed',
    label: 'Selesai Diambil',
    description: 'Pakaian telah diserahkan kepada pelanggan dengan nota lunas.',
  },
];

const ORDER_STATUS_ORDER: OrderStatus[] = [
  'received',
  'washing',
  'drying',
  'ironing',
  'packing_qc',
  'ready',
  'completed',
];

export function buildTimelineSteps(
  currentStatus: OrderStatus,
  createdAt: string,
  estimatedReadyAt: string
): TrackingStep[] {
  const currentIndex = ORDER_STATUS_ORDER.indexOf(currentStatus);
  const createdDate = new Date(createdAt);

  return TIMELINE_STAGES.map((stage, idx) => {
    const isCompleted = idx < currentIndex || currentStatus === 'completed';
    const isCurrent = idx === currentIndex && currentStatus !== 'completed';

    // Approximate timestamps for demo stages
    let timestamp: string | undefined;
    if (idx === 0) {
      timestamp = formatTimeRelative(createdDate);
    } else if (idx <= currentIndex) {
      const stepDate = new Date(createdDate.getTime() + idx * 2 * 3600000);
      timestamp = formatTimeRelative(stepDate);
    } else if (idx === 5) {
      timestamp = 'Estimasi: ' + formatTimeRelative(new Date(estimatedReadyAt));
    }

    return {
      status: stage.status,
      label: stage.label,
      description: stage.description,
      timestamp,
      isCompleted,
      isCurrent,
    };
  });
}

function formatTimeRelative(d: Date): string {
  if (isNaN(d.getTime())) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d) + ' WIB';
}

// Built-in Realistic Orders for Showcase & Offline Tests
export const SHOWCASE_ORDERS: PublicOrderTracking[] = [
  {
    id: 'ord-002',
    orderNumber: 'SKC-261009-0002',
    trackingCode: 'SKC-B8D02',
    customerName: 'Budi Prasetyo',
    customerPhone: '085712345678',
    status: 'ready',
    paymentStatus: 'paid',
    paymentChannel: 'midtrans_qris',
    rackLocation: 'RAK-A2',
    kiloanWeightKg: 4.5,
    kiloanChargedWeightKg: 4.5,
    kiloanSubtotal: 31500,
    satuanSubtotal: 0,
    grossAmount: 31500,
    discountAmount: 0,
    finalAmount: 31500,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    estimatedReadyAt: new Date(Date.now() - 7200000).toISOString(),
    actualReadyAt: new Date(Date.now() - 3600000).toISOString(),
    notes: 'Pakaian sudah wangi lavender dan terbungkus rapi.',
    items: [
      {
        name: 'Cuci Kering Setrika (Reguler 2 Hari)',
        category: 'kiloan',
        quantity: 4.5,
        unit: 'kg',
        pricePerUnit: 7000,
        subtotal: 31500,
      },
    ],
    qcPhotos: [],
    steps: buildTimelineSteps(
      'ready',
      new Date(Date.now() - 86400000).toISOString(),
      new Date(Date.now() - 7200000).toISOString()
    ),
  },
  {
    id: 'ord-001',
    orderNumber: 'SKC-261009-0001',
    trackingCode: 'SKC-R4N1X',
    customerName: 'Rani Maharani',
    customerPhone: '081234567890',
    status: 'washing',
    paymentStatus: 'paid',
    paymentChannel: 'cash',
    kiloanWeightKg: 3.2,
    kiloanChargedWeightKg: 3.2,
    kiloanSubtotal: 22400,
    satuanSubtotal: 10000,
    grossAmount: 32400,
    discountAmount: 0,
    finalAmount: 32400,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    estimatedReadyAt: new Date(Date.now() + 172800000).toISOString(),
    notes: 'Pisahkan baju putih dan jangan gunakan pemutih keras.',
    items: [
      {
        name: 'Cuci Kering Setrika (Reguler 2 Hari)',
        category: 'kiloan',
        quantity: 3.2,
        unit: 'kg',
        pricePerUnit: 7000,
        subtotal: 22400,
      },
      {
        name: 'Kemeja / Blouse (Satuan)',
        category: 'satuan',
        quantity: 2,
        unit: 'pcs',
        pricePerUnit: 5000,
        subtotal: 10000,
      },
    ],
    qcPhotos: [
      {
        id: 'qc-001',
        photoUrl:
          'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&auto=format&fit=crop&q=80',
        issueType: 'stain',
        issueLabel: QC_ISSUE_LABELS.stain,
        description: 'Ada noda kecap membandel di bagian kerah kemeja putih saat penerimaan kasir.',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
    steps: buildTimelineSteps(
      'washing',
      new Date(Date.now() - 7200000).toISOString(),
      new Date(Date.now() + 172800000).toISOString()
    ),
  },
  {
    id: 'ord-003',
    orderNumber: 'SKC-261009-0003',
    trackingCode: 'SKC-DEMO01',
    customerName: 'Sinta Amelia',
    customerPhone: '081399887766',
    status: 'ready',
    paymentStatus: 'paid',
    paymentChannel: 'midtrans_qris',
    rackLocation: 'RAK-B02',
    kiloanWeightKg: 5.0,
    kiloanChargedWeightKg: 5.0,
    kiloanSubtotal: 35000,
    satuanSubtotal: 25000,
    grossAmount: 60000,
    discountAmount: 35000,
    discountExplanation: 'Kupon Stempel Loyalti: Gratis Cuci Kiloan 5 Kg (Porsi Satuan tetap ditagih penuh)',
    finalAmount: 25000,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    estimatedReadyAt: new Date(Date.now() - 14400000).toISOString(),
    actualReadyAt: new Date(Date.now() - 7200000).toISOString(),
    notes: 'Bed cover wangi sakura, kemasan ganda anti-lembab.',
    items: [
      {
        name: 'Cuci Kering Setrika Kiloan',
        category: 'kiloan',
        quantity: 5.0,
        unit: 'kg',
        pricePerUnit: 7000,
        subtotal: 35000,
      },
      {
        name: 'Bed Cover King Size (Satuan)',
        category: 'satuan',
        quantity: 1,
        unit: 'pcs',
        pricePerUnit: 25000,
        subtotal: 25000,
      },
    ],
    qcPhotos: [
      {
        id: 'qc-002',
        photoUrl:
          'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80',
        issueType: 'torn',
        issueLabel: QC_ISSUE_LABELS.torn,
        description: 'Terdapat jahitan lepas sepanjang 4 cm di keliman sudut bed cover.',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ],
    steps: buildTimelineSteps(
      'ready',
      new Date(Date.now() - 86400000 * 2).toISOString(),
      new Date(Date.now() - 14400000).toISOString()
    ),
  },
];

/**
 * Fetch tracking details by tracking code or order number.
 * First inspects browser POS localStorage ('sikucek_pos_orders_v1'),
 * falls back to built-in showcase orders,
 * and if still not matched, generates a graceful deterministic simulated order.
 */
export function getOrderTracking(rawCode: string): PublicOrderTracking {
  const code = (rawCode || '').trim().toUpperCase();

  // 1. Check POS localStorage if in client environment
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('sikucek_pos_orders_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const match = parsed.find(
            (o: any) =>
              (o.tracking_code && o.tracking_code.toUpperCase() === code) ||
              (o.order_number && o.order_number.toUpperCase() === code)
          );

          if (match) {
            return {
              id: match.id,
              orderNumber: match.order_number,
              trackingCode: match.tracking_code,
              customerName: match.customer_name,
              customerPhone: match.customer_phone,
              status: match.status,
              paymentStatus: match.payment_status,
              paymentChannel: match.payment_channel,
              rackLocation: match.rack_location,
              kiloanWeightKg: match.kiloan_weight_kg || 0,
              kiloanChargedWeightKg: match.kiloan_charged_weight_kg || 0,
              kiloanSubtotal: match.kiloan_subtotal || 0,
              satuanSubtotal: match.satuan_subtotal || 0,
              grossAmount: match.gross_amount || 0,
              discountAmount: match.discount_amount || 0,
              finalAmount: match.final_amount || 0,
              createdAt: match.created_at || new Date().toISOString(),
              estimatedReadyAt: match.estimated_ready_at || new Date().toISOString(),
              notes: match.notes,
              items: (match.items || []).map((it: any) => ({
                name: it.service_name,
                category: it.category,
                quantity: it.quantity,
                unit: it.category === 'kiloan' ? 'kg' : 'pcs',
                pricePerUnit: it.price_per_unit,
                subtotal: it.subtotal,
              })),
              qcPhotos: (match.qc_photos || []).map((qc: any) => ({
                id: qc.id,
                photoUrl: qc.photo_url,
                issueType: qc.issue_type,
                issueLabel: QC_ISSUE_LABELS[qc.issue_type as QcIssueType] || 'Kondisi Cacat',
                description: qc.description || 'Pemeriksaan kondisi fisik awal',
                createdAt: qc.created_at || new Date().toISOString(),
              })),
              steps: buildTimelineSteps(
                match.status,
                match.created_at || new Date().toISOString(),
                match.estimated_ready_at || new Date().toISOString()
              ),
              isSimulation: false,
            };
          }
        }
      }
    } catch {
      // Ignore local storage read errors
    }
  }

  // 2. Check showcase orders
  const found = SHOWCASE_ORDERS.find(
    (o) =>
      o.trackingCode.toUpperCase() === code ||
      o.orderNumber.toUpperCase() === code
  );
  if (found) return found;

  // 3. Deterministic Realistic Fallback Simulation
  const isReadySim = code.includes('READY') || code.endsWith('2') || code.endsWith('5');
  const simStatus: OrderStatus = isReadySim ? 'ready' : 'ironing';
  const createdDate = new Date(Date.now() - 48 * 3600000).toISOString();
  const estReady = new Date(Date.now() + 12 * 3600000).toISOString();

  return {
    id: `sim-${code}`,
    orderNumber: `SKC-${code}`,
    trackingCode: code || 'SKC-DEMO01',
    customerName: 'Pelanggan Setia SiKucek',
    customerPhone: '0812xxxx8899',
    status: simStatus,
    paymentStatus: 'paid',
    paymentChannel: 'midtrans_qris',
    rackLocation: isReadySim ? 'RAK-B03' : undefined,
    kiloanWeightKg: 3.5,
    kiloanChargedWeightKg: 3.5,
    kiloanSubtotal: 24500,
    satuanSubtotal: 15000,
    grossAmount: 39500,
    discountAmount: 0,
    finalAmount: 39500,
    createdAt: createdDate,
    estimatedReadyAt: estReady,
    notes: 'Harum segar, packing rapi kedap udara.',
    items: [
      {
        name: 'Cuci Kering Setrika Kiloan Reguler',
        category: 'kiloan',
        quantity: 3.5,
        unit: 'kg',
        pricePerUnit: 7000,
        subtotal: 24500,
      },
      {
        name: 'Selimut / Jaket Tebal (Satuan)',
        category: 'satuan',
        quantity: 1,
        unit: 'pcs',
        pricePerUnit: 15000,
        subtotal: 15000,
      },
    ],
    qcPhotos: [
      {
        id: 'qc-sim-01',
        photoUrl:
          'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800&auto=format&fit=crop&q=80',
        issueType: 'missing_button',
        issueLabel: QC_ISSUE_LABELS.missing_button,
        description: 'Kancing bagian manset kanan sudah terlepas saat baju diterima kasir.',
        createdAt: createdDate,
      },
    ],
    steps: buildTimelineSteps(simStatus, createdDate, estReady),
    isSimulation: true,
  };
}

/**
 * Retrieve all orders associated with a customer phone number
 * Reads from POS localStorage and showcase dataset
 */
export function getCustomerOrders(customerPhone?: string): PublicOrderTracking[] {
  const allOrders: PublicOrderTracking[] = [];
  const cleanPhone = (customerPhone || '').replace(/\D/g, '');

  // 1. Check POS localStorage
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('sikucek_pos_orders_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          for (const match of parsed) {
            const matchPhone = (match.customer_phone || '').replace(/\D/g, '');
            if (!cleanPhone || matchPhone.includes(cleanPhone) || cleanPhone.includes(matchPhone)) {
              allOrders.push({
                id: match.id,
                orderNumber: match.order_number,
                trackingCode: match.tracking_code,
                customerName: match.customer_name,
                customerPhone: match.customer_phone,
                status: match.status,
                paymentStatus: match.payment_status,
                paymentChannel: match.payment_channel,
                rackLocation: match.rack_location,
                kiloanWeightKg: match.kiloan_weight_kg || 0,
                kiloanChargedWeightKg: match.kiloan_charged_weight_kg || 0,
                kiloanSubtotal: match.kiloan_subtotal || 0,
                satuanSubtotal: match.satuan_subtotal || 0,
                grossAmount: match.gross_amount || 0,
                discountAmount: match.discount_amount || 0,
                discountExplanation: match.discount_explanation,
                finalAmount: match.final_amount || 0,
                createdAt: match.created_at || new Date().toISOString(),
                estimatedReadyAt: match.estimated_ready_at || new Date().toISOString(),
                notes: match.notes,
                items: (match.items || []).map((it: any) => ({
                  name: it.service_name,
                  category: it.category,
                  quantity: it.quantity,
                  unit: it.category === 'kiloan' ? 'kg' : 'pcs',
                  pricePerUnit: it.price_per_unit,
                  subtotal: it.subtotal,
                })),
                qcPhotos: (match.qc_photos || []).map((qc: any) => ({
                  id: qc.id,
                  photoUrl: qc.photo_url,
                  issueType: qc.issue_type,
                  issueLabel: QC_ISSUE_LABELS[qc.issue_type as QcIssueType] || 'Kondisi Cacat',
                  description: qc.description || 'Pemeriksaan kondisi fisik awal',
                  createdAt: qc.created_at || new Date().toISOString(),
                })),
                steps: buildTimelineSteps(
                  match.status,
                  match.created_at || new Date().toISOString(),
                  match.estimated_ready_at || new Date().toISOString()
                ),
                isSimulation: false,
              });
            }
          }
        }
      }
    } catch {
      // Ignore
    }
  }

  // 2. Check Showcase Orders
  for (const ord of SHOWCASE_ORDERS) {
    const ordPhone = (ord.customerPhone || '').replace(/\D/g, '');
    if (!cleanPhone || ordPhone.includes(cleanPhone) || cleanPhone.includes(ordPhone)) {
      if (!allOrders.some((o) => o.id === ord.id || o.trackingCode === ord.trackingCode)) {
        allOrders.push(ord);
      }
    }
  }

  // 3. Fallback demo order history if empty
  if (allOrders.length === 0 || cleanPhone.includes('81234567890')) {
    const pastOrder: PublicOrderTracking = {
      id: 'ord-hist-001',
      orderNumber: 'SKC-261005-0012',
      trackingCode: 'SKC-L4L4P',
      customerName: 'Rani Maharani',
      customerPhone: '081234567890',
      status: 'completed',
      paymentStatus: 'paid',
      paymentChannel: 'cash',
      rackLocation: 'RAK-A01',
      kiloanWeightKg: 4.0,
      kiloanChargedWeightKg: 4.0,
      kiloanSubtotal: 28000,
      satuanSubtotal: 15000,
      grossAmount: 43000,
      discountAmount: 0,
      finalAmount: 43000,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      estimatedReadyAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      actualReadyAt: new Date(Date.now() - 86400000 * 3 + 3600000).toISOString(),
      items: [
        {
          name: 'Cuci Kering Setrika Reguler',
          category: 'kiloan',
          quantity: 4.0,
          unit: 'kg',
          pricePerUnit: 7000,
          subtotal: 28000,
        },
        {
          name: 'Jaket Denim (Satuan)',
          category: 'satuan',
          quantity: 1,
          unit: 'pcs',
          pricePerUnit: 15000,
          subtotal: 15000,
        },
      ],
      qcPhotos: [],
      steps: buildTimelineSteps(
        'completed',
        new Date(Date.now() - 86400000 * 5).toISOString(),
        new Date(Date.now() - 86400000 * 3).toISOString()
      ),
      isSimulation: false,
    };
    if (!allOrders.some((o) => o.id === pastOrder.id)) {
      allOrders.push(pastOrder);
    }
  }

  return allOrders;
}

