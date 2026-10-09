'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Estimator from '../components/Estimator';
import Footer from '../components/Footer';
import {
  Search,
  Camera,
  Layers,
  Gift,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Shirt,
  Sparkles,
  Smartphone,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [trackingCode, setTrackingCode] = useState<string>('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = trackingCode.trim().toUpperCase();
    if (clean) {
      router.push(`/track/${clean}`);
    }
  };

  const setPresetCode = (code: string) => {
    setTrackingCode(code);
    router.push(`/track/${code}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50/60 via-white to-sky-50/40 text-slate-900">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-10 sm:pt-16 pb-16 sm:pb-24 border-b border-sky-100">
          {/* Decorative Background Bubbles */}
          <div className="absolute top-10 left-10 w-72 h-72 bg-sky-200/40 rounded-full blur-3xl pointer-events-none animate-float-bubble" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Hero Text & Search Bar */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                {/* Pill Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/90 text-sky-800 text-xs font-bold border border-sky-200/80 shadow-sm">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                  <span>Sistem Operasi Laundry Generasi Baru</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  Laundry Bersih, Higienis, &amp; Transparan Tanpa Drama
                </h1>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Pantau progres cucian secara real-time dari timbangan hingga rak penyimpanan. Dilengkapi foto Quality Control (QC) anti-sengketa &amp; diskon loyalti stempel otomatis!
                </p>

                {/* Quick Tracking Search Bar */}
                <div id="tracking-bar" className="pt-2">
                  <div className="bg-white p-2.5 sm:p-3 rounded-3xl shadow-xl shadow-sky-200/50 border border-sky-200 max-w-xl mx-auto lg:mx-0">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1">
                        <Search className="w-5 h-5 text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={trackingCode}
                          onChange={(e) => setTrackingCode(e.target.value)}
                          placeholder="Masukkan No. Resi (cth: SKC-B8D02)"
                          className="w-full pl-11 pr-4 py-3 text-sm sm:text-base font-semibold text-slate-800 placeholder-slate-400 rounded-2xl border-none focus:outline-none focus:ring-2 focus:ring-sky-400 uppercase font-mono"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white text-sm font-black rounded-2xl shadow-md shadow-sky-300 transition active:scale-95 flex items-center justify-center gap-2"
                      >
                        <span>Lacak Sekarang</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  </div>

                  {/* Preset Demo Code Chips */}
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mt-3 text-xs text-slate-500">
                    <span className="font-semibold text-slate-600">Coba Resi Demo:</span>
                    <button
                      type="button"
                      onClick={() => setPresetCode('SKC-B8D02')}
                      className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-700 font-bold font-mono rounded-lg border border-emerald-200 shadow-sm transition"
                    >
                      SKC-B8D02 (Siap di Rak A2)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPresetCode('SKC-R4N1X')}
                      className="px-2.5 py-1 bg-white hover:bg-sky-50 text-sky-700 font-bold font-mono rounded-lg border border-sky-200 shadow-sm transition"
                    >
                      SKC-R4N1X (Cuci &amp; Foto QC)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPresetCode('SKC-DEMO01')}
                      className="px-2.5 py-1 bg-white hover:bg-amber-50 text-amber-700 font-bold font-mono rounded-lg border border-amber-200 shadow-sm transition"
                    >
                      SKC-DEMO01 (Kupon 5 Kg)
                    </button>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="pt-4 grid grid-cols-3 gap-4 border-t border-sky-100 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
                  <div>
                    <p className="text-xl sm:text-2xl font-black text-sky-600">100%</p>
                    <p className="text-[11px] font-semibold text-slate-500">Transparansi QC</p>
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-black text-amber-500">5 Stempel</p>
                    <p className="text-[11px] font-semibold text-slate-500">Gratis 5 Kg</p>
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-black text-emerald-600">0 Biaya</p>
                    <p className="text-[11px] font-semibold text-slate-500">Pelacakan Publik</p>
                  </div>
                </div>
              </div>

              {/* Mascot & Brand Showcase Card */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-sm">
                  {/* Floating Mascot Card */}
                  <div className="bg-white rounded-3xl p-6 shadow-2xl shadow-sky-200/60 border border-sky-100 relative z-10 text-center">
                    <div className="relative w-56 h-56 mx-auto rounded-3xl overflow-hidden border-4 border-sky-100 shadow-inner mb-4">
                      <Image
                        src="/logo-sikucek.jpg"
                        alt="Karakter Maskot Si Kucek"
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>

                    <h3 className="text-xl font-black text-sky-800">
                      Kenalkan Si Kucek!
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Maskot ember ceria yang siap menyulap pakaian kotor Anda menjadi bersih, wangi lavender, dan kinclong berseri.
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                      <span className="flex items-center gap-1 font-semibold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        Pewangi Premium
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-sky-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-500" />
                        Setrika Uap Presisi
                      </span>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -right-4 bg-amber-400 text-slate-900 font-extrabold text-xs px-3.5 py-1.5 rounded-2xl shadow-lg border-2 border-white rotate-6 z-20">
                    Gratis Cuci 5 Kg!
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-sky-500 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-2xl shadow-lg border-2 border-white -rotate-6 z-20">
                    Cek Rak Instan
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why SiKucek Section (4 Pilar Keunggulan) */}
        <section id="keunggulan" className="py-16 sm:py-20 bg-white border-b border-sky-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-sky-600 uppercase tracking-widest bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                Keunggulan Layanan
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-3">
                Mengapa Memilih SiKucek?
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Kami memahami kekhawatiran Anda seputar pakaian hilang, luntur, atau tertukar. SiKucek menghadirkan standar operasional higienis dan transparan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Pilar 1 */}
              <div className="bg-sky-50/50 rounded-3xl p-6 border border-sky-100 hover:shadow-lg hover:border-sky-300 transition group">
                <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-200 mb-4 group-hover:scale-105 transition-transform">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  Foto QC Anti-Sengketa
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Pakaian robek, berjamur, atau kancing copot dipotret kasir saat awal masuk dan dapat dilihat di link pelacakan Anda.
                </p>
              </div>

              {/* Pilar 2 */}
              <div className="bg-sky-50/50 rounded-3xl p-6 border border-sky-100 hover:shadow-lg hover:border-sky-300 transition group">
                <div className="w-12 h-12 rounded-2xl bg-teal-500 text-white flex items-center justify-center shadow-md shadow-teal-200 mb-4 group-hover:scale-105 transition-transform">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  Nomor Rak Fisik Tertera
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Saat cucian siap, sistem langsung menampilkan nomor rak penyimpanan. Kasir tidak perlu membongkar tumpukan plastik.
                </p>
              </div>

              {/* Pilar 3 */}
              <div className="bg-sky-50/50 rounded-3xl p-6 border border-sky-100 hover:shadow-lg hover:border-sky-300 transition group">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-200 mb-4 group-hover:scale-105 transition-transform">
                  <Gift className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  Stamp Card 5-Slot
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Kumpulkan 5 stempel cucian untuk mendapatkan voucher gratis cuci kiloan maksimal 5 kg tanpa diundi!
                </p>
              </div>

              {/* Pilar 4 */}
              <div className="bg-sky-50/50 rounded-3xl p-6 border border-sky-100 hover:shadow-lg hover:border-sky-300 transition group">
                <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-200 mb-4 group-hover:scale-105 transition-transform">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  Notifikasi WA Otomatis
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Nota digital dan kabar cucian selesai langsung mampir ke nomor WhatsApp Anda tanpa perlu download aplikasi rumit.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Live Estimator Section */}
        <section id="kalkulator" className="py-16 sm:py-20 bg-sky-50/50 border-b border-sky-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Kalkulator Transparan
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-3">
                Hitung Estimasi Biaya Cucian
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Geser slider kiloan dan tambahkan pakaian satuan untuk mengetahui estimasi harga sebelum mengantar cucian ke outlet.
              </p>
            </div>

            <Estimator />
          </div>
        </section>

        {/* Service Price Catalog */}
        <section id="layanan" className="py-16 sm:py-20 bg-white border-b border-sky-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-sky-600 uppercase tracking-widest bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                Daftar Tarif Resmi
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-3">
                Layanan Kiloan &amp; Satuan
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Tarif bersahabat mahasiswa dan keluarga dengan garansi kebersihan optimal
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Kategori Kiloan */}
              <div className="bg-sky-50/40 rounded-3xl p-6 sm:p-7 border border-sky-100">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center">
                    <Shirt className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      Layanan Cuci Kiloan
                    </h3>
                    <p className="text-xs text-slate-500">
                      Minimum order 2.00 kg. Sudah termasuk cuci, kering, dan setrika uap.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { name: 'Cuci Kering Setrika Reguler', duration: '48 Jam (2 Hari)', price: 'Rp 7.000 / kg' },
                    { name: 'Cuci Kering Setrika Express', duration: '24 Jam (1 Hari)', price: 'Rp 10.000 / kg' },
                    { name: 'Cuci Kering Setrika Kilat', duration: '6 Jam', price: 'Rp 15.000 / kg' },
                  ].map((srv, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-3.5 rounded-2xl border border-sky-100 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-slate-800">{srv.name}</p>
                        <p className="text-[11px] text-slate-500">{srv.duration}</p>
                      </div>
                      <span className="text-xs sm:text-sm font-extrabold font-mono text-sky-700 bg-sky-50 px-2.5 py-1 rounded-xl">
                        {srv.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kategori Satuan */}
              <div className="bg-amber-50/40 rounded-3xl p-6 sm:p-7 border border-amber-100">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      Layanan Pakaian Satuan
                    </h3>
                    <p className="text-xs text-slate-500">
                      Perawatan khusus kain tebal, formal, sprei, dan alas kaki.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { name: 'Kemeja / Blouse Formal', unit: 'per pcs', price: 'Rp 5.000' },
                    { name: 'Celana Jeans / Bahan Panjang', unit: 'per pcs', price: 'Rp 7.000' },
                    { name: 'Jas / Blazer Eksekutif', unit: 'per pcs', price: 'Rp 20.000' },
                    { name: 'Bed Cover King Size', unit: 'per pcs', price: 'Rp 25.000' },
                    { name: 'Sepatu Sneakers / Canvas', unit: 'per pasang', price: 'Rp 25.000' },
                  ].map((srv, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-3.5 rounded-2xl border border-amber-100 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-slate-800">{srv.name}</p>
                        <p className="text-[11px] text-slate-500">{srv.unit}</p>
                      </div>
                      <span className="text-xs sm:text-sm font-extrabold font-mono text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl">
                        {srv.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gamification & PWA Banner Callout */}
        <section className="py-14 bg-gradient-to-r from-sky-600 via-sky-500 to-sky-700 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
              <div className="space-y-2 max-w-xl">
                <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full text-white">
                  Program Retensi Pelanggan
                </span>
                <h3 className="text-2xl sm:text-3xl font-black">
                  Kumpulkan 5 Stempel &amp; Check-in Harian
                </h3>
                <p className="text-xs sm:text-sm text-sky-100 leading-relaxed">
                  Cukup login ke PWA SiKucek untuk klaim koin harian streak dan cap stempel cucian otomatis. Dapatkan hadiah cuci kiloan gratis 5 kg!
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/app"
                  className="px-6 py-3 bg-white hover:bg-sky-50 text-sky-700 font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg transition active:scale-95 flex items-center gap-2"
                >
                  <Gift className="w-4 h-4 text-amber-500" />
                  Buka Stamp Card PWA
                </Link>
                <Link
                  href="/track/SKC-DEMO01"
                  className="px-5 py-3 bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm rounded-2xl transition border border-white/30"
                >
                  Lihat Contoh Kupon Terpasang
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
