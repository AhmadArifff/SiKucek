'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, KeyRound, UserCheck } from 'lucide-react';
import {
  getStoredStaffUser,
  canAccessAdmin,
  StaffUser,
  logoutStaff,
} from '../../lib/auth-store';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<StaffUser | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    const user = getStoredStaffUser();
    setCurrentUser(user);
    setIsChecking(false);

    // If unauthenticated and not on the login page, redirect to login
    if (!user && pathname !== '/login') {
      router.push('/login');
    }
  }, [pathname, router]);

  // While checking on client side
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-600">Memverifikasi Izin Akses Staf...</p>
        </div>
      </div>
    );
  }

  // Public login page does not require login
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // If not logged in, prevent rendering children while redirect happens
  if (!currentUser) {
    return null;
  }

  // RBAC Access Check for /admin routes
  const isAdminRoute = pathname.startsWith('/admin');
  const isOwner = canAccessAdmin(currentUser);

  if (isAdminRoute && !isOwner) {
    return (
      <div className="max-w-2xl mx-auto p-6 mt-10">
        <div className="bg-white rounded-3xl p-8 border border-amber-200 shadow-xl space-y-5 text-center">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
              Batasan Akses Role ({currentUser.role_title})
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-2">
              Akses Halaman Dibatasi Khusus Owner / Manager
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
              Halo <strong>{currentUser.name}</strong>, modul administrasi (Kupon, Marketing ROI, CRM, &amp; Vault Pengaturan) dilindungi dan hanya dapat dikelola oleh akun dengan peran <strong>Owner</strong>.
            </p>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Antrean Kasir
            </Link>

            <button
              type="button"
              onClick={() => {
                logoutStaff();
                router.push('/login');
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4 text-slate-500" />
              Ganti Akun (Login sebagai Owner)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
