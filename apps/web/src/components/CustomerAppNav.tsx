'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  Gift,
  ShoppingBag,
  Ticket,
  User,
  Coins,
  ArrowLeft,
  LogOut,
  LogIn,
} from 'lucide-react';
import {
  getCustomerSession,
  logoutCustomer,
  type CustomerSession,
} from '../lib/customer-auth';

export default function CustomerAppNav() {
  const pathname = usePathname();
  const [session, setSession] = useState<CustomerSession | null>(null);

  useEffect(() => {
    setSession(getCustomerSession());

    const handleUpdate = () => {
      setSession(getCustomerSession());
    };

    window.addEventListener('sikucek_customer_session_updated', handleUpdate);
    return () => {
      window.removeEventListener('sikucek_customer_session_updated', handleUpdate);
    };
  }, []);

  const navLinks = [
    {
      href: '/app',
      label: 'Loyalti & Stempel',
      icon: Gift,
      active: pathname === '/app',
    },
    {
      href: '/app/orders',
      label: 'Pesanan Saya',
      icon: ShoppingBag,
      active: pathname === '/app/orders',
    },
    {
      href: '/app/coupons',
      label: 'Dompet Kupon',
      icon: Ticket,
      active: pathname === '/app/coupons',
    },
    {
      href: '/app/profile',
      label: 'Profil & Referral',
      icon: User,
      active: pathname === '/app/profile',
    },
  ];

  return (
    <div className="w-full">
      {/* Top Bar for Customer Portal */}
      <div className="bg-white border-b border-sky-100 shadow-sm sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-1.5 -ml-1 text-slate-500 hover:text-sky-600 rounded-xl hover:bg-sky-50 transition"
              title="Kembali ke Beranda"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <Link href="/app" className="flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-sky-400 shadow-sm shadow-sky-200 group-hover:scale-105 transition-transform">
                <Image
                  src="/logo-sikucek.jpg"
                  alt="Maskot Si Kucek"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="hidden sm:block">
                <span className="font-extrabold text-base bg-gradient-to-r from-sky-600 to-sky-700 bg-clip-text text-transparent">
                  SiKucek PWA
                </span>
                <span className="text-[10px] text-slate-400 block -mt-0.5">
                  Portal Pelanggan
                </span>
              </div>
            </Link>
          </div>

          {/* Right Status (Points & Profile Link) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {session && session.isLoggedIn ? (
              <>
                <Link
                  href="/app"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-2xl transition"
                >
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-black font-mono text-amber-900">
                    {session.pointsBalance} Pts
                  </span>
                </Link>

                <Link
                  href="/app/profile"
                  className="flex items-center gap-2 pl-2 pr-3 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl transition"
                >
                  <div className="w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {session.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[110px]">
                      {session.name}
                    </p>
                    <span className="text-[10px] text-sky-600 font-semibold">
                      {session.tierLabel}
                    </span>
                  </div>
                </Link>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 rounded-xl shadow-sm transition"
              >
                <LogIn className="w-4 h-4" />
                Masuk
              </Link>
            )}
          </div>
        </div>

        {/* Desktop / Tablet Sub-Tabs Bar */}
        <div className="border-t border-sky-50 bg-sky-50/40 hidden sm:block">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center gap-2 overflow-x-auto py-2">
            {navLinks.map((tab) => {
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    tab.active
                      ? 'bg-sky-500 text-white shadow-sm shadow-sky-300'
                      : 'text-slate-600 hover:text-sky-700 hover:bg-white/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-sky-100 shadow-lg px-2 py-2">
        <div className="grid grid-cols-4 gap-1">
          {navLinks.map((tab) => {
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center justify-center py-1.5 rounded-xl text-[10px] font-bold transition ${
                  tab.active
                    ? 'text-sky-600 bg-sky-50'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 mb-0.5 ${tab.active ? 'text-sky-600' : 'text-slate-400'}`} />
                <span className="truncate max-w-[70px]">{tab.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
