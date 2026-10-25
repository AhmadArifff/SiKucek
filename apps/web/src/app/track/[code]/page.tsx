'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import TimelineStepper from '../../../components/tracking/TimelineStepper';
import RackBanner from '../../../components/tracking/RackBanner';
import QcGallery from '../../../components/tracking/QcGallery';
import DigitalReceipt from '../../../components/tracking/DigitalReceipt';
import {
  getOrderTracking,
  PublicOrderTracking,
} from '../../../lib/tracking-store';
import { formatIndonesianDateTime } from '@sikucek/shared';
import {
  ArrowLeft,
  Search,
  Sparkles,
  RefreshCw,
  Info,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface TrackingPageProps {
  params: Promise<{ code: string }>;
}

export default function TrackingPage({ params }: TrackingPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const rawCode = resolvedParams.code || '';

  const [order, setOrder] = useState<PublicOrderTracking | null>(null);
  const [searchInput, setSearchInput] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => {
    if (rawCode) {
      const data = getOrderTracking(rawCode);
      setOrder(data);
    }
  }, [rawCode]);

  const handleSearchAnother = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchInput.trim().toUpperCase();
    if (clean) {
      router.push(`/track/${clean}`);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      if (rawCode) {
        const data = getOrderTracking(rawCode);
        setOrder(data);
      }
      setIsRefreshing(false);
    }, 400);
  };

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-mesh-cyan">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center glass-panel p-8 rounded-3xl border border-sky-100/90 shadow-xl shadow-sky-500/10">
            <div className="w-12 h-12 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-heading font-black text-slate-800">
              Memuat data pelacakan resi...
            </p>
            <p className="text-xs text-slate-500 mt-1 font-sans">
              Menghubungkan ke pusat data outlet SiKucek
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isReady = order.status === 'ready';
  const isCompleted = order.status === 'completed';

  return (
    <div className="min-h-screen flex flex-col bg-mesh-cyan text-slate-900">
      <Navbar />

      <main className="flex-1 py-6 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
          {/* Top Navigation & Fast Switch Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/80 hover:bg-white text-xs sm:text-sm font-heading font-bold text-slate-700 hover:text-sky-600 border border-slate-200/80 shadow-xs transition-all self-start active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </Link>

            {/* Quick Search Another Code */}
            <form
              onSubmit={handleSearchAnother}
              className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-sky-200 shadow-sm w-full sm:w-auto"
            >
              <Search className="w-4 h-4 text-sky-500 shrink-0" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Lacak No. Resi Lain..."
                className="text-xs font-semibold text-slate-900 placeholder-slate-400 bg-transparent border-none focus:outline-none w-full uppercase font-mono"
              />
              <button
                type="submit"
                className="px-3.5 py-1 text-xs font-heading font-black bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white rounded-xl transition shadow-xs shrink-0 cursor-pointer"
              >
                Cari
              </button>
            </form>
          </div>

          {/* Simulation Notice if triggered via fallback simulator */}
          {order.isSimulation && (
            <div className="bg-sky-50/90 border border-sky-200 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between text-xs text-sky-950 shadow-xs">
              <div className="flex items-center gap-2.5">
                <Info className="w-4 h-4 text-sky-600 shrink-0" />
                <span className="text-[11px] sm:text-xs font-sans">
                  Pratinjau dinamis simulasi untuk nomor resi{' '}
                  <strong className="font-mono text-sky-700">{order.trackingCode}</strong>.
                </span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-sky-200 text-sky-900 px-2.5 py-0.5 rounded-full shrink-0">
                Mode Simulasi
              </span>
            </div>
          )}

          {/* Main Order Identity Header Card */}
          <div className="glass-panel rounded-3xl sm:rounded-4xl p-5 sm:p-8 border border-sky-100/90 shadow-xl shadow-sky-500/5 relative overflow-hidden">
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-400 via-teal-400 to-coral-400" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-6 border-b border-slate-100">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2.5">
                  <span className="text-xs font-mono font-black text-sky-800 bg-sky-100/80 px-3 py-1 rounded-xl border border-sky-200 shadow-xs">
                    {order.trackingCode}
                  </span>
                  <span
                    className={`px-3 py-1 text-[11px] sm:text-xs font-black uppercase tracking-wider rounded-xl shadow-xs ${
                      isCompleted
                        ? 'bg-slate-100 text-slate-800 border border-slate-200'
                        : isReady
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-gradient-to-r from-sky-500 to-teal-500 text-white'
                    }`}
                  >
                    Status: {order.status}
                  </span>
                </div>

                <h1 className="text-xl sm:text-3xl font-heading font-black text-slate-900 tracking-tight">
                  Cucian an. {order.customerName}
                </h1>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 font-sans">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>No. WhatsApp: <strong className="font-mono text-slate-700">{order.customerPhone}</strong></span>
                </p>
              </div>

              {/* Refresh Button */}
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="self-start md:self-auto flex items-center gap-2 px-4 py-2 text-xs font-heading font-bold text-slate-700 hover:text-sky-700 bg-white/90 hover:bg-white rounded-xl border border-slate-200 shadow-sm transition active:scale-95 cursor-pointer"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-500' : ''}`}
                />
                Segarkan Status
              </button>
            </div>

            {/* Date Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-5 text-xs font-sans">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/70 border border-slate-100">
                <Calendar className="w-4 h-4 text-sky-500 shrink-0" />
                <div>
                  <p className="text-[10px] font-heading font-black uppercase tracking-wider text-slate-500">Waktu Masuk Kasir:</p>
                  <p className="font-bold text-slate-900 mt-0.5">{formatIndonesianDateTime(order.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/70 border border-slate-100">
                <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                <div>
                  <p className="text-[10px] font-heading font-black uppercase tracking-wider text-slate-500">Estimasi Siap Ambil:</p>
                  <p className="font-bold text-slate-900 mt-0.5">{formatIndonesianDateTime(order.estimatedReadyAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/70 border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <p className="text-[10px] font-heading font-black uppercase tracking-wider text-slate-500">Jaminan Kualitas:</p>
                  <p className="font-bold text-slate-900 mt-0.5">100% Higienis &amp; Garansi Wangi</p>
                </div>
              </div>
            </div>
          </div>

          {/* 1. Physical Rack Banner (Triggered when ready or completed) */}
          <RackBanner
            rackLocation={order.rackLocation}
            isReady={isReady}
            isCompleted={isCompleted}
          />

          {/* 2. Visual Stepper Linimasa (7 Tahap) */}
          <TimelineStepper
            steps={order.steps}
            currentStatus={order.status}
          />

          {/* 3. Galeri Foto QC Anti-Sengketa */}
          <QcGallery photos={order.qcPhotos} />

          {/* 4. Rincian Nota Digital */}
          <DigitalReceipt order={order} />

          {/* Mascot Friendly Advice Card */}
          <div className="bg-gradient-to-r from-sky-50 via-white to-amber-50/60 rounded-3xl p-5 sm:p-6 border border-sky-100 shadow-sm flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-500/20">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
              <p className="font-heading font-black text-slate-900 mb-1">
                Tips dari Si Kucek:
              </p>
              <p>
                Bawa kantong belanja ramah lingkungan saat mengambil cucian di outlet SiKucek. Tunjukkan nomor resi ini kepada kasir untuk verifikasi cepat tanpa antre panjang.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

