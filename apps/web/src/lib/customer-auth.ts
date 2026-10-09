'use client';

export type CustomerTier = 'busa_baru' | 'wangi_segar' | 'kinclong_sultan';

export interface CustomerSession {
  id: string;
  name: string;
  phone: string;
  tier: CustomerTier;
  tierLabel: string;
  tierDiscountPercent: number;
  referralCode: string;
  pointsBalance: number;
  stampsCount: number;
  completedOrdersCount: number;
  totalSpent: number;
  totalKgWashed: number;
  joinedAt: string;
  isLoggedIn: boolean;
}

export const TIER_CONFIG: Record<
  CustomerTier,
  {
    label: string;
    badgeBg: string;
    textColor: string;
    discountPercent: number;
    minOrders: number;
    maxOrders: number;
    perks: string[];
  }
> = {
  busa_baru: {
    label: 'Busa Baru',
    badgeBg: 'bg-slate-100 border-slate-200 text-slate-700',
    textColor: 'text-slate-700',
    discountPercent: 0,
    minOrders: 0,
    maxOrders: 4,
    perks: ['Akses Stamp Card Digital (5 slot)', 'Daily Check-in Streak Poin', 'Pelacakan cucian real-time'],
  },
  wangi_segar: {
    label: 'Wangi Segar',
    badgeBg: 'bg-amber-100 border-amber-300 text-amber-900',
    textColor: 'text-amber-800',
    discountPercent: 5,
    minOrders: 5,
    maxOrders: 14,
    perks: [
      'Diskon tetap 5% untuk semua paket kiloan',
      'Bonus 1.5x koin check-in harian',
      'Prioritas antrean mesin cuci',
    ],
  },
  kinclong_sultan: {
    label: 'Kinclong Sultan',
    badgeBg: 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black border-amber-300',
    textColor: 'text-amber-900',
    discountPercent: 10,
    minOrders: 15,
    maxOrders: 9999,
    perks: [
      'Diskon tetap 10% untuk semua paket kiloan',
      'Prioritas pengerjaan Express tanpa biaya ekstra',
      'Gratis tas laundry eksklusif SiKucek',
    ],
  },
};

export const DEMO_PRESET_CUSTOMERS: CustomerSession[] = [
  {
    id: 'cust-rani-01',
    name: 'Rani Maharani',
    phone: '081234567890',
    tier: 'wangi_segar',
    tierLabel: 'Wangi Segar',
    tierDiscountPercent: 5,
    referralCode: 'RANI-KUCEK',
    pointsBalance: 240,
    stampsCount: 3,
    completedOrdersCount: 7,
    totalSpent: 345000,
    totalKgWashed: 32.5,
    joinedAt: '2026-08-15',
    isLoggedIn: true,
  },
  {
    id: 'cust-budi-02',
    name: 'Budi Santoso',
    phone: '085712345678',
    tier: 'busa_baru',
    tierLabel: 'Busa Baru',
    tierDiscountPercent: 0,
    referralCode: 'BUDI-KUCEK',
    pointsBalance: 45,
    stampsCount: 1,
    completedOrdersCount: 1,
    totalSpent: 42000,
    totalKgWashed: 4.5,
    joinedAt: '2026-10-01',
    isLoggedIn: true,
  },
  {
    id: 'cust-sultan-03',
    name: 'Sultan Andara',
    phone: '081199887766',
    tier: 'kinclong_sultan',
    tierLabel: 'Kinclong Sultan',
    tierDiscountPercent: 10,
    referralCode: 'SULTAN-KUCEK',
    pointsBalance: 680,
    stampsCount: 4,
    completedOrdersCount: 18,
    totalSpent: 980000,
    totalKgWashed: 94.0,
    joinedAt: '2026-05-20',
    isLoggedIn: true,
  },
];

const CUSTOMER_SESSION_KEY = 'sikucek_customer_session_v1';

export function calculateTier(completedOrders: number): {
  tier: CustomerTier;
  label: string;
  discountPercent: number;
} {
  if (completedOrders >= 15) {
    return {
      tier: 'kinclong_sultan',
      label: TIER_CONFIG.kinclong_sultan.label,
      discountPercent: TIER_CONFIG.kinclong_sultan.discountPercent,
    };
  }
  if (completedOrders >= 5) {
    return {
      tier: 'wangi_segar',
      label: TIER_CONFIG.wangi_segar.label,
      discountPercent: TIER_CONFIG.wangi_segar.discountPercent,
    };
  }
  return {
    tier: 'busa_baru',
    label: TIER_CONFIG.busa_baru.label,
    discountPercent: TIER_CONFIG.busa_baru.discountPercent,
  };
}

export function getCustomerSession(): CustomerSession {
  if (typeof window === 'undefined') {
    return DEMO_PRESET_CUSTOMERS[0];
  }

  try {
    const raw = localStorage.getItem(CUSTOMER_SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.phone) {
        return parsed;
      }
    }
  } catch {
    // Ignore storage parse error
  }

  // Default fallback to first demo customer so app pages work out of the box
  const fallback = DEMO_PRESET_CUSTOMERS[0];
  saveCustomerSession(fallback);
  return fallback;
}

export function saveCustomerSession(session: CustomerSession): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(session));
    window.dispatchEvent(new Event('sikucek_customer_session_updated'));
  } catch {
    // Ignore storage write error
  }
}

export function loginWithPhone(phone: string, inputName?: string): CustomerSession {
  const cleanPhone = phone.replace(/\D/g, '');
  const matchedPreset = DEMO_PRESET_CUSTOMERS.find(
    (c) => c.phone.replace(/\D/g, '') === cleanPhone
  );

  if (matchedPreset) {
    saveCustomerSession(matchedPreset);
    return matchedPreset;
  }

  // Create new customer profile
  const baseName = inputName && inputName.trim().length > 0 ? inputName.trim() : 'Pelanggan SiKucek';
  const cleanRef = baseName.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5) || 'KUCEK';
  const newProfile: CustomerSession = {
    id: `cust-${Date.now()}`,
    name: baseName,
    phone: phone,
    tier: 'busa_baru',
    tierLabel: 'Busa Baru',
    tierDiscountPercent: 0,
    referralCode: `${cleanRef}-${Math.floor(1000 + Math.random() * 9000)}`,
    pointsBalance: 50, // Welcome gift 50 points
    stampsCount: 0,
    completedOrdersCount: 0,
    totalSpent: 0,
    totalKgWashed: 0,
    joinedAt: new Date().toISOString().split('T')[0],
    isLoggedIn: true,
  };

  saveCustomerSession(newProfile);
  return newProfile;
}

export function logoutCustomer(): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getCustomerSession();
    const guest: CustomerSession = {
      ...current,
      isLoggedIn: false,
    };
    localStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(guest));
    window.dispatchEvent(new Event('sikucek_customer_session_updated'));
  } catch {
    // Ignore
  }
}

export function updateCustomerPoints(pointsDelta: number): CustomerSession {
  const session = getCustomerSession();
  const nextPoints = Math.max(0, session.pointsBalance + pointsDelta);
  const updated = {
    ...session,
    pointsBalance: nextPoints,
  };
  saveCustomerSession(updated);
  return updated;
}

export function updateCustomerStamps(stampsDelta: number): CustomerSession {
  const session = getCustomerSession();
  let nextStamps = session.stampsCount + stampsDelta;
  if (nextStamps > 5) nextStamps = 1;
  const updated = {
    ...session,
    stampsCount: nextStamps,
  };
  saveCustomerSession(updated);
  return updated;
}
