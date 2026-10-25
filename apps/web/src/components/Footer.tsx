import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, Phone, Gift, CheckCircle2, ArrowUpRight, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800/80 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-coral-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-2xl overflow-hidden border-2 border-sky-400 shadow-md shadow-sky-500/20">
                <Image
                  src="/logo-sikucek.jpg"
                  alt="Maskot Si Kucek"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-2xl font-heading font-black tracking-tight text-white block">
                  SiKucek<span className="text-sky-400">.</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-sky-400 font-bold block">
                  Smart Laundry Operating System
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm font-sans">
              Solusi laundry modern dengan foto QC anti-sengketa, alokasi rak fisik teratur, serta sistem loyalti stempel otomatis tanpa ribet.
            </p>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-slate-900/90 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5 font-medium shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Anti-Sengketa QC
              </span>
              <span className="bg-slate-900/90 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1.5 font-medium shadow-sm">
                <Gift className="w-3.5 h-3.5" />
                Kupon Gratis 5 Kg
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-heading font-black uppercase tracking-wider text-white">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400 font-sans">
              <li>
                <Link href="/#tracking-bar" className="hover:text-sky-300 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  Lacak Resi Cucian
                </Link>
              </li>
              <li>
                <Link href="/#kalkulator" className="hover:text-sky-300 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  Estimator Biaya Hybrid
                </Link>
              </li>
              <li>
                <Link href="/#layanan" className="hover:text-sky-300 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Tarif Kiloan & Satuan
                </Link>
              </li>
              <li>
                <Link href="/app" className="hover:text-coral-300 transition-colors flex items-center gap-1.5 font-semibold text-coral-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-coral-400" />
                  Stamp Card PWA
                </Link>
              </li>
              <li>
                <Link href="/track/SKC-B8D02" className="hover:text-sky-300 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  Contoh Nota Siap Ambil (Rak)
                </Link>
              </li>
            </ul>
          </div>

          {/* Outlet Contact Info */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-heading font-black uppercase tracking-wider text-white">
              Outlet & Layanan
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400 font-sans">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  Jl. SiKucek Fresh No. 88, Kampus Boulevard, Yogyakarta
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Buka Setiap Hari: 07:00 - 21:00 WIB</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-sky-300 transition-colors underline font-mono"
                >
                  WhatsApp Outlet: 0812-3456-7890
                </a>
              </li>
            </ul>

            <div className="pt-2">
              <a
                href="http://localhost:3001"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-sky-400 border border-slate-700 hover:border-sky-500/50 text-xs font-bold transition shadow-sm"
              >
                <span>Masuk Portal Kasir &amp; POS</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-sans">
          <p>
            &copy; {new Date().getFullYear()} SiKucek Operating System. Hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Bersih higienis tanpa drama</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

