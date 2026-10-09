import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, Phone, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-10 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-sky-400">
                <Image
                  src="/logo-sikucek.jpg"
                  alt="Maskot Si Kucek"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                SiKucek
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Sistem operasional laundry cerdas dengan transparansi foto QC awal, alokasi rak terorganisir, dan sistem loyalti stempel otomatis.
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-sky-300">
              <span className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Anti-Sengketa QC
              </span>
              <span className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Kupon Gratis 5 Kg
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Menu Cepat
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/#tracking-bar" className="hover:text-sky-400 transition">
                  Lacak Resi Cucian
                </Link>
              </li>
              <li>
                <Link href="/#kalkulator" className="hover:text-sky-400 transition">
                  Estimator Biaya
                </Link>
              </li>
              <li>
                <Link href="/#layanan" className="hover:text-sky-400 transition">
                  Tarif Kiloan & Satuan
                </Link>
              </li>
              <li>
                <Link href="/app" className="hover:text-amber-400 transition">
                  Stamp Card Digital & PWA
                </Link>
              </li>
              <li>
                <Link href="/track/SKC-B8D02" className="hover:text-sky-400 transition">
                  Contoh Nota Siap Ambil (Rak)
                </Link>
              </li>
            </ul>
          </div>

          {/* Outlet Contact Info */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Outlet & Jam Operasional
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
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
                  className="hover:text-sky-400 transition underline"
                >
                  WhatsApp Kasir: 0812-3456-7890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} SiKucek Operating System. Hak cipta dilindungi.
          </p>
          <p className="flex items-center gap-1.5 text-slate-400">
            <span>Dirancang dengan</span>
            <span className="text-rose-500">&hearts;</span>
            <span>untuk kebersihan higienis tanpa drama</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
