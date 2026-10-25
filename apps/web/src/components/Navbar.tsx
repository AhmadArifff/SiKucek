'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Calculator, Receipt, ShieldCheck, Gift, User, Sparkles } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-2 sm:top-4 z-50 px-3 sm:px-6">
      <div className="max-w-6xl mx-auto glass-panel rounded-2xl sm:rounded-full px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between transition-all">
        {/* Brand Identity with Mascot */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-sky-400/80 shadow-md shadow-sky-300/40 group-hover:scale-105 transition-transform duration-200">
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
              <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-sky-600 via-sky-500 to-sky-700 bg-clip-text text-transparent">
                SiKucek
              </span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-full border border-amber-300/60 shadow-sm">
                <Sparkles className="w-2.5 h-2.5 text-amber-500 animate-spin" />
                SMART
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium hidden sm:block">
              Laundry Pintar, Cepat &amp; Transparan
            </p>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-slate-600">
          <Link
            href="/#tracking-bar"
            className="px-3 py-2 rounded-full hover:text-sky-600 hover:bg-sky-50 transition-colors flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5 text-sky-500" />
            Lacak Resi
          </Link>
          <Link
            href="/#kalkulator"
            className="px-3 py-2 rounded-full hover:text-sky-600 hover:bg-sky-50 transition-colors flex items-center gap-1.5"
          >
            <Calculator className="w-3.5 h-3.5 text-sky-500" />
            Estimator Biaya
          </Link>
          <Link
            href="/#layanan"
            className="px-3 py-2 rounded-full hover:text-sky-600 hover:bg-sky-50 transition-colors flex items-center gap-1.5"
          >
            <Receipt className="w-3.5 h-3.5 text-sky-500" />
            Daftar Tarif
          </Link>
          <Link
            href="/#keunggulan"
            className="px-3 py-2 rounded-full hover:text-sky-600 hover:bg-sky-50 transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
            Keunggulan
          </Link>
          <Link
            href="/app"
            className="px-3.5 py-1.5 rounded-full text-amber-800 bg-gradient-to-r from-amber-100 to-amber-50 hover:from-amber-200 hover:to-amber-100 border border-amber-300/60 shadow-sm transition-all flex items-center gap-1.5 font-extrabold"
          >
            <Gift className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
            Stamp Card (Gratis 5 Kg)
          </Link>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <Link
            href="/auth/login"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-sky-600 hover:bg-sky-50/80 rounded-xl sm:rounded-full border border-slate-200/80 transition"
          >
            <User className="w-3.5 h-3.5 text-sky-500" />
            Member PWA
          </Link>
          <Link
            href="/#tracking-bar"
            className="px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-extrabold text-white btn-tactile-cyan rounded-xl sm:rounded-full flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Cek Cucian</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
