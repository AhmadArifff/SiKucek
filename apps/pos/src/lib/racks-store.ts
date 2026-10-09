'use client';

export interface PhysicalRackItem {
  id: string;
  code: string; // e.g. RAK-A1, RAK-A2, RAK-B1, RAK-B2, GANTUNG-01
  type: 'shelf' | 'hanger' | 'shoe_rack';
  capacity_orders: number;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export const INITIAL_RACKS: PhysicalRackItem[] = [
  {
    id: 'rack-01',
    code: 'RAK-A1',
    type: 'shelf',
    capacity_orders: 1,
    description: 'Rak tingkat 1 bagian depan dekat kasir',
    is_active: true,
    created_at: '2026-10-08T08:00:00Z',
  },
  {
    id: 'rack-02',
    code: 'RAK-A2',
    type: 'shelf',
    capacity_orders: 1,
    description: 'Rak tingkat 2 bagian depan dekat kasir',
    is_active: true,
    created_at: '2026-10-08T08:00:00Z',
  },
  {
    id: 'rack-03',
    code: 'RAK-B1',
    type: 'shelf',
    capacity_orders: 1,
    description: 'Rak tengah untuk cucian kiloan express',
    is_active: true,
    created_at: '2026-10-08T08:00:00Z',
  },
  {
    id: 'rack-04',
    code: 'RAK-B2',
    type: 'shelf',
    capacity_orders: 1,
    description: 'Rak tengah tingkat bawah',
    is_active: true,
    created_at: '2026-10-08T08:00:00Z',
  },
  {
    id: 'rack-05',
    code: 'GANTUNG-01',
    type: 'hanger',
    capacity_orders: 3,
    description: 'Gantungan baju khusus jas dan gamis',
    is_active: true,
    created_at: '2026-10-08T08:00:00Z',
  },
  {
    id: 'rack-06',
    code: 'SEPATU-01',
    type: 'shoe_rack',
    capacity_orders: 2,
    description: 'Rak khusus sepatu bersih dan kering',
    is_active: true,
    created_at: '2026-10-08T08:00:00Z',
  },
];

const RACKS_STORAGE_KEY = 'sikucek_pos_racks';

export function getStoredRacks(): PhysicalRackItem[] {
  if (typeof window === 'undefined') return INITIAL_RACKS;
  try {
    const raw = localStorage.getItem(RACKS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(RACKS_STORAGE_KEY, JSON.stringify(INITIAL_RACKS));
      return INITIAL_RACKS;
    }
    return JSON.parse(raw) as PhysicalRackItem[];
  } catch {
    return INITIAL_RACKS;
  }
}

export function saveStoredRacks(racks: PhysicalRackItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(RACKS_STORAGE_KEY, JSON.stringify(racks));
  } catch (err) {
    console.error('Failed to save racks to localStorage:', err);
  }
}
