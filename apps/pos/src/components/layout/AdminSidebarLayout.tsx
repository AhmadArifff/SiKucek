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
  Menu,
  X,
  ExternalLink,
  Clock,
  Sparkles,
  ShieldCheck,
  Lock,
  ChevronRight,
  Store,
  CreditCard,
} from 'lucide-react';
import {
  getStoredStaffUser,
  logoutStaff,
  StaffUser,
  canAccessAdmin,
} from '../../lib/auth-store';
import { getStoredOrders } from '../../lib/orders-store';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
  badge?: string | number;
  highlight?: boolean;
}

interface NavGroup {
  groupName: string;
  items: NavItem[];
}

export function AdminSidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<StaffUser | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [ordersCount, setOrdersCount] = useState<number>(0);
  const [occupiedRacksCount, setOccupiedRacksCount] = useState<number>(0);

  useEffect(() => {
    setCurrentUser(getStoredStaffUser());
    setMobileMenuOpen(false);

    // Live order & rack badge
    try {
      const orders = getStoredOrders();
      const activeOrders = orders.filter((o) => o.status !== 'completed');
      setOrdersCount(activeOrders.length);

      const occupiedRackCodes = new Set(
        orders
          .filter((o) => o.status === 'ready' && o.rack_location)
          .map((o) => o.rack_location)
      );
      setOccupiedRacksCount(occupiedRackCodes.size);
    } catch {
      // Graceful fallback
    }
  }, [pathname]);

  // Live Digital Clock WIB
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' WIB'
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Login page should render as full-screen clean page without sidebar
  if (pathname === '/login') {
    return <>{children}</>;
  }

  const isOwner = canAccessAdmin(currentUser);

  const handleLogout = () => {
    if (confirm('Keluar dari sesi kasir/admin SiKucek?')) {
      logoutStaff();
      router.push('/login');
    }
  };

  const navGroups: NavGroup[] = [
    {
      groupName: 'Operasional Kasir',
      items: [
        {
          href: '/',
          label: 'Antrean Cucian',
          icon: ClipboardList,
          adminOnly: false,
          badge: ordersCount > 0 ? ordersCount : undefined,
        },
        {
          href: '/orders/new',
          label: 'Terima Cucian',
          icon: PlusCircle,
          adminOnly: false,
          highlight: true,
        },
        {
          href: '/admin/racks',
          label: 'Alokasi Rak Fisik',
          icon: MapPin,
          adminOnly: true,
          badge: occupiedRacksCount > 0 ? `${occupiedRacksCount} Rak` : undefined,
        },
      ],
    },
    {
      groupName: 'Manajemen Outlet',
      items: [
        {
          href: '/admin/services',
          label: 'Tarif Layanan',
          icon: Tag,
          adminOnly: true,
        },
        {
          href: '/admin/reports',
          label: 'Laporan Keuangan',
          icon: BarChart3,
          adminOnly: true,
        },
      ],
    },
    {
      groupName: 'Pemasaran & CRM',
      items: [
        {
          href: '/admin/coupons',
          label: 'Kupon Promosi',
          icon: Gift,
          adminOnly: true,
        },
        {
          href: '/admin/marketing',
          label: 'Marketing & ROI',
          icon: TrendingUp,
          adminOnly: true,
        },
        {
          href: '/admin/customers',
          label: 'CRM Pelanggan',
          icon: Users,
          adminOnly: true,
        },
      ],
    },
    {
      groupName: 'Sistem & Vault',
      items: [
        {
          href: '/admin/settings',
          label: 'Pengaturan & Vault',
          icon: Settings,
          adminOnly: true,
        },
      ],
    },
  ];

  // Helper for Breadcrumbs / Current Page Label
  const getCurrentPageLabel = () => {
    if (pathname === '/') return 'Dasbor Antrean Kasir';
    if (pathname === '/orders/new') return 'Penerimaan Cucian Baru (Intake Hybrid)';
    if (pathname.startsWith('/orders/') && pathname.endsWith('/receipt')) return 'Cetak Nota Transaksi';
    if (pathname.startsWith('/orders/')) return 'Detail Cucian & Status';
    if (pathname === '/admin/services') return 'Master Tarif Layanan';
    if (pathname === '/admin/racks') return 'Master Rak Fisik Outlet';
    if (pathname === '/admin/reports') return 'Laporan Finansial & Omzet';
    if (pathname === '/admin/coupons') return 'Manajemen Kupon Diskon';
    if (pathname === '/admin/marketing') return 'Dashboard Marketing ROI';
    if (pathname === '/admin/customers') return 'Database CRM Pelanggan';
    if (pathname === '/admin/settings') return 'Pusat Pengaturan & Vault';
    return 'Admin Panel';
  };

  const renderNavLinks = () => (
    <div className="space-y-6">
      {navGroups.map((group) => {
        const visibleItems = group.items.filter((item) => !item.adminOnly || isOwner);
        if (visibleItems.length === 0) return null;

        return (
          <div key={group.groupName} className="space-y-1.5">
            <span className="text-[10px] font-heading font-black uppercase tracking-wider text-slate-400 px-3 block">
              {group.groupName}
            </span>
            <div className="space-y-1">
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`group flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-heading font-bold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-sky-500 to-teal-500 text-white shadow-md shadow-sky-500/25 scale-101'
                        : item.highlight
                        ? 'bg-sky-50/90 text-sky-800 hover:bg-sky-100 border border-sky-200/80 shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                          isActive
                            ? 'text-white'
                            : item.highlight
                            ? 'text-sky-600'
                            : 'text-slate-400 group-hover:text-slate-700'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-sky-100 text-sky-800 border border-sky-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-100/90 text-slate-900 font-sans">
      {/* ========================================================================= */}
      {/* DESKTOP SIDEBAR (Sticky Left, w-64 xl:w-72) */}
      {/* ========================================================================= */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 bg-white/95 backdrop-blur-md border-r border-slate-200/80 h-screen sticky top-0 shrink-0 z-30 select-none justify-between shadow-xs">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-2xl overflow-hidden border-2 border-sky-400 shadow-md shadow-sky-400/20 group-hover:scale-105 transition-transform shrink-0">
              <Image
                src="/logo-sikucek.jpg"
                alt="Logo SiKucek"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-black text-base tracking-tight text-slate-900">
                  SiKucek<span className="text-sky-500"> OS</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Outlet Aktif Online" />
              </div>
              <p className="text-[11px] font-medium text-slate-500 truncate font-sans">
                {currentUser?.outlet_name || 'Outlet SiKucek'}
              </p>
            </div>
          </Link>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {renderNavLinks()}
        </div>

        {/* Sidebar Footer: User Account & Logout */}
        <div className="p-4 border-t border-slate-200/80 bg-slate-50/80 space-y-3">
          {currentUser && (
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${currentUser.avatar_color} shadow-xs text-white`}
                >
                  {currentUser.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-heading font-black text-slate-900 truncate leading-tight">
                    {currentUser.name}
                  </p>
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md inline-block mt-0.5 ${
                      currentUser.role === 'owner'
                        ? 'bg-amber-100 text-amber-900 border border-amber-200'
                        : 'bg-sky-100 text-sky-900 border border-sky-200'
                    }`}
                  >
                    {currentUser.role_title || currentUser.role}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                title="Keluar dari sesi kasir"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition shrink-0 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Quick link to customer web portal */}
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 text-xs font-heading font-bold text-slate-600 hover:text-sky-700 bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded-xl transition shadow-xs"
          >
            <span>Buka Web Pelanggan (PWA)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MOBILE DRAWER SIDEBAR (Slide-over for screens < lg) */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Menu */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col justify-between z-10 animate-slideRight">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-sky-400">
                  <Image
                    src="/logo-sikucek.jpg"
                    alt="Logo SiKucek"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="font-heading font-black text-sm text-slate-900">
                    SiKucek<span className="text-sky-500"> POS</span>
                  </span>
                  <p className="text-[10px] text-slate-500">Menu Kasir</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {renderNavLinks()}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
              {currentUser && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${currentUser.avatar_color} text-white`}>
                      {currentUser.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{currentUser.name}</p>
                      <span className="text-[9px] uppercase font-bold text-slate-500">{currentUser.role}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-xs font-bold text-rose-600 hover:underline"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAIN CONTENT WRAPPER (Right Side) */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 h-15 sm:h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition shrink-0"
              title="Buka Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb / Current Route Title */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium hidden sm:flex">
                <span>SiKucek Admin</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-700 font-bold">{getCurrentPageLabel()}</span>
              </div>
              <h2 className="text-xs sm:text-base font-heading font-black text-slate-900 tracking-tight truncate max-w-[190px] sm:max-w-none">
                {getCurrentPageLabel()}
              </h2>
            </div>
          </div>

          {/* Right Header Status & Actions */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Live Clock WIB */}
            {currentTime && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-mono font-bold text-slate-700 shadow-xs">
                <Clock className="w-3.5 h-3.5 text-sky-500" />
                <span>{currentTime}</span>
              </div>
            )}

            {/* Outlet Status Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-heading font-bold text-emerald-800 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Buka: 07:00 - 21:00 WIB</span>
            </div>

            {/* Quick Action: New Order */}
            {pathname !== '/orders/new' && (
              <Link
                href="/orders/new"
                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 active:scale-95 text-white text-xs font-heading font-black rounded-xl shadow-md shadow-sky-500/25 transition flex items-center gap-1.5 shrink-0"
              >
                <PlusCircle className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Terima Cucian</span>
                <span className="sm:hidden text-[11px]">Terima</span>
              </Link>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

