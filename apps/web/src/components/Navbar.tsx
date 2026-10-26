'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Calculator, Receipt, ShieldCheck, Gift, User, Sparkles } from 'lucide-react';

interface NavbarProps {
  isHidden?: boolean;
}

export default function Navbar({ isHidden = false }: NavbarProps) {
  return (
    <header
      className={`fixed top-2 sm:top-4 left-0 right-0 z-50 px-3 sm:px-6 transition-all duration-700 ease-in-out ${
        isHidden
          ? '-translate-y-24 opacity-0 pointer-events-none'
          : 'translate-y-0 opacity-100 pointer-events-auto'
      }`}
    >
      <div className="max-w-6xl mx-auto glass-panel rounded-full px-4 sm:px-6 h-16 flex items-center justify-between border border-white/80 shadow-lg shadow-sky-500/5 transition-all">
        {/* Brand Identity with Mascot */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-sky-400 shadow-sm shadow-sky-400/30 group-hover:scale-105 transition-transform duration-200 shrink-0">
            <Image
              src="/logo-sikucek.jpg"
              alt="Maskot Si Kucek"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-black text-lg sm:text-xl tracking-tight text-slate-900">
                SiKucek<span className="text-sky-500">.</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 rounded-full border border-amber-300 shadow-xs">
                <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                SMART
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-sans hidden md:block leading-none mt-0.5">
              Laundry Pintar, Cepat &amp; Transparan
            </p>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-heading font-bold text-slate-600">
          <Link
            href="/#tracking-bar"
            className="px-2.5 py-1.5 rounded-full hover:text-sky-600 hover:bg-sky-50/80 transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Search className="w-3.5 h-3.5 text-sky-500" />
            <span>Lacak</span>
          </Link>
          <Link
            href="/#kalkulator"
            className="px-2.5 py-1.5 rounded-full hover:text-sky-600 hover:bg-sky-50/80 transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Calculator className="w-3.5 h-3.5 text-sky-500" />
            <span>Estimator</span>
          </Link>
          <Link
            href="/#layanan"
            className="px-2.5 py-1.5 rounded-full hover:text-sky-600 hover:bg-sky-50/80 transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Receipt className="w-3.5 h-3.5 text-sky-500" />
            <span>Tarif</span>
          </Link>
          <Link
            href="/#keunggulan"
            className="px-2.5 py-1.5 rounded-full hover:text-sky-600 hover:bg-sky-50/80 transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
            <span>Keunggulan</span>
          </Link>
          <Link
            href="/app"
            className="px-2.5 py-1.5 rounded-full text-amber-900 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/90 shadow-xs transition-all flex items-center gap-1.5 whitespace-nowrap font-bold"
          >
            <Gift className="w-3.5 h-3.5 text-amber-600" />
            <span>Stamp Card</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-950 text-[9px] font-black uppercase">
              5Kg
            </span>
          </Link>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/auth/login"
            className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-heading font-bold text-slate-700 hover:text-sky-700 hover:bg-sky-50/80 rounded-full border border-slate-200/90 shadow-xs transition whitespace-nowrap shrink-0"
          >
            <User className="w-3.5 h-3.5 text-sky-500" />
            <span>Member PWA</span>
          </Link>
          <Link
            href="/#tracking-bar"
            className="px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-heading font-black text-white bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 rounded-full shadow-md shadow-sky-500/25 flex items-center gap-1.5 whitespace-nowrap shrink-0 transition active:scale-95"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Cek Cucian</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

