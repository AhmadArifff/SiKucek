'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  WashingMachine,
  PlusCircle,
  LayoutDashboard,
  Tag,
  TrendingUp,
  Users,
  Settings,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Antrean', icon: LayoutDashboard },
    { href: '/orders/new', label: 'Terima Cucian', icon: PlusCircle },
    { href: '/admin/coupons', label: 'Kupon Promo', icon: Tag },
    { href: '/admin/marketing', label: 'Marketing ROI', icon: TrendingUp },
    { href: '/admin/customers', label: 'CRM Pelanggan', icon: Users },
    { href: '/admin/settings', label: 'Pengaturan', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-200 group-hover:scale-105 transition">
            <WashingMachine className="w-6 h-6 animate-pulse" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                SiKucek<span className="text-sky-500"> POS</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">
                Kasir &amp; Operator
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Buka 07:00 s.d 21:00 WIB</p>
          </div>
        </Link>

        {/* Horizontal Navigation Menu */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-sm shadow-sky-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
