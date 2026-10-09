'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Calculator, Receipt, ShieldCheck, Gift, QrCode } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-sky-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Identity */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-sky-400 shadow-sm shadow-sky-200 group-hover:scale-105 transition-transform">
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
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-sky-600 via-sky-500 to-sky-700 bg-clip-text text-transparent">
                SiKucek
              </span>
              <span className="inline-block px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-700 rounded-full">
                OS
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium hidden sm:block">
              Laundry Pintar, Cepat & Higienis
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <Link
            href="/#tracking-bar"
            className="hover:text-sky-600 transition flex items-center gap-1.5"
          >
            <Search className="w-4 h-4 text-sky-500" />
            Lacak Resi
          </Link>
          <Link
            href="/#kalkulator"
            className="hover:text-sky-600 transition flex items-center gap-1.5"
          >
            <Calculator className="w-4 h-4 text-sky-500" />
            Estimator Biaya
          </Link>
          <Link
            href="/#layanan"
            className="hover:text-sky-600 transition flex items-center gap-1.5"
          >
            <Receipt className="w-4 h-4 text-sky-500" />
            Daftar Tarif
          </Link>
          <Link
            href="/#keunggulan"
            className="hover:text-sky-600 transition flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-sky-500" />
            Keunggulan
          </Link>
          <Link
            href="/app"
            className="text-amber-600 hover:text-amber-700 flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200 transition"
          >
            <Gift className="w-4 h-4" />
            Stamp Card & Poin
          </Link>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/track/SKC-B8D02"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-xl border border-sky-200 transition"
          >
            <QrCode className="w-3.5 h-3.5 text-sky-600" />
            Demo Resi
          </Link>
          <Link
            href="/#tracking-bar"
            className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 rounded-xl shadow-md shadow-sky-200 transition active:scale-95"
          >
            Cek Cucian
          </Link>
        </div>
      </div>
    </header>
  );
}
