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
      <div className="min-h-screen flex flex-col bg-sky-50/50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-600">
              Memuat data pelacakan resi...
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
    <div className="min-h-screen flex flex-col bg-slate-50/60 text-slate-900">
      <Navbar />

      <main className="flex-1 py-4 sm:py-12">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 space-y-4 sm:space-y-6">
          {/* Top Navigation & Fast Switch Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-sky-600 transition self-start"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </Link>

            {/* Quick Search Another Code */}
            <form
              onSubmit={handleSearchAnother}
              className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl sm:rounded-2xl border border-sky-200 shadow-sm w-full sm:w-auto"
            >
              <Search className="w-4 h-4 text-sky-400 shrink-0" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Lacak No. Resi Lain..."
                className="text-xs font-semibold text-slate-800 placeholder-slate-400 bg-transparent border-none focus:outline-none w-full uppercase font-mono"
              />
              <button
                type="submit"
                className="px-3 py-1 text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white rounded-lg sm:rounded-xl transition shrink-0"
              >
                Cari
              </button>
            </form>
          </div>

          {/* Simulation Notice if triggered via fallback simulator */}
          {order.isSimulation && (
            <div className="bg-sky-100/70 border border-sky-300 rounded-xl sm:rounded-2xl p-3 sm:p-3.5 flex items-center justify-between text-xs text-sky-900">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-sky-600 shrink-0" />
                <span className="text-[11px] sm:text-xs">
                  Pratinjau dinamis untuk nomor resi{' '}
                  <strong className="font-mono">{order.trackingCode}</strong>.
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold bg-sky-200 px-2 py-0.5 rounded-full shrink-0">
                Simulasi
              </span>
            </div>
          )}

          {/* Main Order Identity Header Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-sky-100 shadow-md sm:shadow-lg relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 pb-4 sm:pb-6 border-b border-slate-100">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-black text-sky-700 bg-sky-50 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg sm:rounded-xl border border-sky-200">
                    {order.trackingCode}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider rounded-lg sm:rounded-xl ${
                      isCompleted
                        ? 'bg-slate-100 text-slate-700'
                        : isReady
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-sky-100 text-sky-800 border border-sky-300'
                    }`}
                  >
                    Status: {order.status}
                  </span>
                </div>

                <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                  Cucian an. {order.customerName}
                </h1>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-1 flex items-center gap-1.5 sm:gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>No. HP: {order.customerPhone}</span>
                </p>
              </div>

              {/* Refresh Button */}
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="self-start md:self-auto flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold text-slate-600 hover:text-sky-600 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-500' : ''}`}
                />
                Segarkan Status
              </button>
            </div>

            {/* Date Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-5 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-sky-500 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-600">Waktu Masuk Kasir:</p>
                  <p className="font-semibold text-slate-800">{formatIndonesianDateTime(order.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-600">Estimasi Selesai:</p>
                  <p className="font-semibold text-slate-800">{formatIndonesianDateTime(order.estimatedReadyAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-600">Jaminan Kualitas:</p>
                  <p className="font-semibold text-slate-800">100% Bersih &amp; Garansi Wangi</p>
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
          <div className="bg-gradient-to-r from-sky-50 via-white to-amber-50 rounded-3xl p-5 border border-sky-100 flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-200">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p className="font-bold text-slate-900 mb-0.5">
                Tips dari Si Kucek:
              </p>
              <p>
                Jangan lupa bawa kantong laundry sendiri saat mengambil pakaian di outlet untuk mendukung gerakan ramah lingkungan. Bila ada pertanyaan atau instruksi khusus perlakuan kain, hubungi kasir kami melalui tombol WhatsApp di atas.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
