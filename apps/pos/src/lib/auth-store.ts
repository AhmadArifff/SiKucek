'use client';

import { UserRole, USER_ROLE } from '@sikucek/shared';

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  role_title: string;
  avatar_color: string;
  outlet_name: string;
}

export const DEMO_STAFF_USERS: StaffUser[] = [
  {
    id: 'staff-001',
    name: 'Ahmad Arif',
    email: 'owner@sikucek.app',
    phone: '081234567890',
    role: USER_ROLE.OWNER,
    role_title: 'Owner & General Manager',
    avatar_color: 'bg-amber-500 text-white',
    outlet_name: 'Outlet Pusat Margonda Raya',
  },
  {
    id: 'staff-002',
    name: 'Siti Rahma',
    email: 'kasir@sikucek.app',
    phone: '085711223344',
    role: USER_ROLE.CASHIER,
    role_title: 'Kasir Utama (Shift Pagi)',
    avatar_color: 'bg-sky-500 text-white',
    outlet_name: 'Outlet Pusat Margonda Raya',
  },
  {
    id: 'staff-003',
    name: 'Bambang Wahyudi',
    email: 'operator@sikucek.app',
    phone: '087899887766',
    role: USER_ROLE.WASHER,
    role_title: 'Operator Mesin & Cuci',
    avatar_color: 'bg-emerald-500 text-white',
    outlet_name: 'Outlet Pusat Margonda Raya',
  },
];

const AUTH_STORAGE_KEY = 'sikucek_pos_auth_user';

export function getStoredStaffUser(): StaffUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StaffUser;
  } catch {
    return null;
  }
}

export function saveStoredStaffUser(user: StaffUser | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (err) {
    console.error('Failed to save staff auth user to localStorage:', err);
  }
}

export function loginStaff(
  identifier: string,
  pinOrPass: string
): { success: boolean; user?: StaffUser; error?: string } {
  const cleanId = identifier.trim().toLowerCase();
  const cleanPin = pinOrPass.trim();

  // Find matching staff user
  const matched = DEMO_STAFF_USERS.find(
    (u) =>
      u.email.toLowerCase() === cleanId ||
      u.phone === cleanId ||
      u.name.toLowerCase() === cleanId ||
      (cleanId === 'owner' && u.role === USER_ROLE.OWNER) ||
      (cleanId === 'kasir' && u.role === USER_ROLE.CASHIER) ||
      (cleanId === 'operator' && u.role === USER_ROLE.WASHER)
  );

  if (!matched) {
    return {
      success: false,
      error: 'Akun staf tidak ditemukan. Gunakan email/nomor staf yang terdaftar.',
    };
  }

  // Password / PIN validation (default testing PIN: 123456 or admin123 or any pin in dev mode)
  if (cleanPin !== '123456' && cleanPin !== 'admin123' && cleanPin !== 'sikucek') {
    return {
      success: false,
      error: 'PIN / Kata sandi salah. Gunakan PIN standar testing: 123456',
    };
  }

  saveStoredStaffUser(matched);
  return { success: true, user: matched };
}

export function logoutStaff(): void {
  saveStoredStaffUser(null);
}

export function canAccessAdmin(user: StaffUser | null): boolean {
  if (!user) return false;
  return user.role === USER_ROLE.OWNER;
}
