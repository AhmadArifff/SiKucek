'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  ClipboardList,
  PlusCircle,
  Tag,
  MapPin,
  BarChart3,
  Gift,
  TrendingUp,
  Users,
  Settings,
  LogOut,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import {
  getStoredStaffUser,
  logoutStaff,
  StaffUser,
  canAccessAdmin,
} from '../../lib/auth-store';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<StaffUser | null>(null);

  useEffect(() => {
    setCurrentUser(getStoredStaffUser());
  }, [pathname]);

  // Hide Navbar completely on Login Page
  if (pathname === '/login') {
    return null;
  }

  const isOwner = canAccessAdmin(currentUser);

  const navItems = [
    { href: '/', label: 'Antrean', icon: ClipboardList, adminOnly: false },
    { href: '/orders/new', label: 'Terima Cucian', icon: PlusCircle, adminOnly: false },
    { href: '/admin/services', label: 'Tarif Layanan', icon: Tag, adminOnly: true },
    { href: '/admin/racks', label: 'Rak Fisik', icon: MapPin, adminOnly: true },
    { href: '/admin/reports', label: 'Laporan', icon: BarChart3, adminOnly: true },
    { href: '/admin/coupons', label: 'Kupon', icon: Gift, adminOnly: true },
    { href: '/admin/marketing', label: 'Marketing', icon: TrendingUp, adminOnly: true },
    { href: '/admin/customers', label: 'CRM', icon: Users, adminOnly: true },
    { href: '/admin/settings', label: 'Pengaturan', icon: Settings, adminOnly: true },
  ];

  const handleLogout = () => {
    logoutStaff();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* Brand & Outlet Identity */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden border-2 border-sky-400 shadow-sm shadow-sky-200 group-hover:scale-105 transition-transform">
            <Image
              src="/logo-sikucek.jpg"
              alt="Logo SiKucek"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="hidden lg:block">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                SiKucek<span className="text-sky-500"> POS</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">
                Kasir &amp; Operator
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate max-w-[180px]">
              {currentUser?.outlet_name || 'Buka 07:00 s.d 21:00 WIB'}
            </p>
          </div>
        </Link>

        {/* Horizontal Navigation Menu */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const isRestrictedForUser = item.adminOnly && !isOwner;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={isRestrictedForUser ? 'Khusus Akun Owner/Manager' : item.label}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-sm shadow-sky-200'
                    : isRestrictedForUser
                    ? 'text-slate-400 hover:bg-slate-50'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden md:inline">{item.label}</span>
                {isRestrictedForUser && (
                  <Lock className="w-2.5 h-2.5 text-slate-400 hidden xl:inline" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Current Active Staff User & Logout Action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-sm ${currentUser.avatar_color}`}
              >
                {currentUser.name.charAt(0)}
              </div>

              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight">
                  {currentUser.name}
                </p>
                <div className="flex items-center gap-1">
                  <span
                    className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                      currentUser.role === 'owner'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-sky-100 text-sky-800'
                    }`}
                  >
                    {currentUser.role}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                title="Keluar / Logout"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-3.5 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl shadow-sm transition"
            >
              Masuk Staf
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
