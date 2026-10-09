'use client';

import { INITIAL_SERVICES } from './orders-store';

export interface PosServiceItem {
  id: string;
  name: string;
  category: 'kiloan' | 'satuan';
  unit_name: string;
  price_per_unit: number;
  min_weight_kg?: number;
  estimated_duration_hours: number;
  is_active: boolean;
  description?: string;
}

const SERVICES_STORAGE_KEY = 'sikucek_pos_services';

export function getStoredServices(): PosServiceItem[] {
  if (typeof window === 'undefined') {
    return INITIAL_SERVICES.map((s) => ({ ...s, is_active: true }));
  }
  try {
    const raw = localStorage.getItem(SERVICES_STORAGE_KEY);
    if (!raw) {
      const initial = INITIAL_SERVICES.map((s) => ({ ...s, is_active: true }));
      localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw) as PosServiceItem[];
  } catch {
    return INITIAL_SERVICES.map((s) => ({ ...s, is_active: true }));
  }
}

export function saveStoredServices(services: PosServiceItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(services));
  } catch (err) {
    console.error('Failed to save services to localStorage:', err);
  }
}
