'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {
  Gift,
  Sparkles,
  CheckCircle2,
  Calendar,
  Coins,
  ArrowRight,
  Award,
  Zap,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';

export default function CustomerDashboardPage() {
  const [stampsCount, setStampsCount] = useState<number>(3);
  const [pointsBalance, setPointsBalance] = useState<number>(240);
  const [hasClaimedToday, setHasClaimedToday] = useState<boolean>(false);
  const [streakDay, setStreakDay] = useState<number>(4);
  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null);

  const handleClaimDaily = () => {
    if (hasClaimedToday) return;
    const earned = streakDay * 5 + 5; // e.g. Day 4 = 25 pts
    setPointsBalance((prev) => prev + earned);
    setHasClaimedToday(true);
    setCelebrationMessage(`Hore! +${earned} Koin Poin berhasil diklaim ke saldo Anda!`);
    setTimeout(() => setCelebrationMessage(null), 4000);
  };

  const handleSimulateAddStamp = () => {
    if (stampsCount < 5) {
      const next = stampsCount + 1;
      setStampsCount(next);
      if (next === 5) {
        setCelebrationMessage(
          'Selamat! 5 Stempel Lengkap! 1 Voucher "Gratis Cuci Kiloan Maks. 5 Kg" otomatis diterbitkan ke dompet kupon Anda!'
        );
      }
    } else {
      // Reset card cycle
      setStampsCount(1);
      setCelebrationMessage('Siklus kartu baru dimulai! Stempel ke-1 tercatat.');
    }
    setTimeout(() => setCelebrationMessage(null), 5000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 text-slate-900">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Top Profile Header */}
          <div className="bg-gradient-to-r from-sky-600 via-sky-500 to-sky-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-sky-600/20 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/50 shadow-md">
                  <Image
                    src="/logo-sikucek.jpg"
                    alt="Maskot Profil"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-black">
                      Halo, Rani Maharani!
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-900 shadow-sm">
                      Tier: Wangi Segar
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-sky-100 mt-1">
                    0812-3456-7890 &bull; Kode Referral: <span className="font-mono font-bold">RANI-KUCEK</span>
                  </p>
                </div>
              </div>

              {/* Point Balance Badge */}
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 text-right sm:text-right self-start sm:self-auto">
                <span className="text-[11px] uppercase tracking-wider text-sky-100 font-bold block">
                  Saldo Koin Loyalti
                </span>
                <div className="flex items-center gap-1.5 justify-start sm:justify-end mt-1">
                  <Coins className="w-5 h-5 text-amber-300 animate-pulse" />
                  <span className="text-2xl font-black font-mono text-white">
                    {pointsBalance} Poin
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Links Nav */}
            <div className="mt-6 pt-5 border-t border-white/20 flex flex-wrap gap-2 text-xs font-bold">
              <span className="bg-white text-sky-700 px-3.5 py-1.5 rounded-xl">
                Loyalti &amp; Stamp
              </span>
              <Link
                href="/app/coupons"
                className="bg-white/20 hover:bg-white/30 text-white px-3.5 py-1.5 rounded-xl transition flex items-center gap-1"
              >
                Dompet Kupon Saya
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/track/SKC-R4N1X"
                className="bg-white/20 hover:bg-white/30 text-white px-3.5 py-1.5 rounded-xl transition flex items-center gap-1"
              >
                Cucian Aktif Saya
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Toast / Celebration Alert */}
          {celebrationMessage && (
            <div className="bg-amber-100 border-2 border-amber-300 text-amber-900 rounded-2xl p-4 shadow-lg flex items-center gap-3 animate-bounce">
              <Sparkles className="w-6 h-6 text-amber-600 shrink-0" />
              <p className="text-xs sm:text-sm font-bold leading-snug">
                {celebrationMessage}
              </p>
            </div>
          )}

          {/* 1. Stamp Card Digital (Bab 10.4) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-sky-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    Stamp Card Digital (5 Slot)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Setiap cucian selesai otomatis menambah 1 stempel. Kumpulkan 5 untuk cuci kiloan gratis 5 kg!
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200 self-start sm:self-auto">
                Progres: {stampsCount} / 5 Stempel
              </span>
            </div>

            {/* Stamp Slots Grid */}
            <div className="grid grid-cols-5 gap-2 sm:gap-4 my-6">
              {[1, 2, 3, 4, 5].map((slotNumber) => {
                const isFilled = slotNumber <= stampsCount;
                const isRewardSlot = slotNumber === 5;

                return (
                  <div
                    key={slotNumber}
                    className={`aspect-square rounded-2xl sm:rounded-3xl border-2 flex flex-col items-center justify-center p-2 text-center transition-all relative ${
                      isFilled
                        ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-amber-100/60 shadow-md shadow-amber-200/50'
                        : isRewardSlot
                        ? 'border-dashed border-rose-300 bg-rose-50/40 text-rose-600'
                        : 'border-dashed border-slate-200 bg-slate-50/50 text-slate-400'
                    }`}
                  >
                    {isFilled ? (
                      <>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-400 text-slate-900 font-black flex items-center justify-center shadow-inner text-xs sm:text-base">
                          🪙
                        </div>
                        <span className="text-[10px] sm:text-xs font-black text-amber-800 mt-1">
                          Cap #{slotNumber}
                        </span>
                      </>
                    ) : isRewardSlot ? (
                      <>
                        <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-rose-500 animate-pulse" />
                        <span className="text-[9px] sm:text-[11px] font-extrabold text-rose-600 mt-1 leading-tight">
                          Gratis 5 Kg!
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-xs sm:text-sm font-bold font-mono text-slate-300">
                          #{slotNumber}
                        </span>
                        <span className="text-[9px] text-slate-400 mt-0.5">
                          Kosong
                        </span>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Rule Callout & Simulation Action */}
            <div className="bg-sky-50 rounded-2xl p-4 border border-sky-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-xs text-slate-600 space-y-1">
                <p className="font-bold text-sky-900">
                  Aturan Diskon Parsial Kupon (Bab 10.4):
                </p>
                <p>
                  Kupon hadiah stempel <strong>hanya memotong tagihan porsi kiloan</strong> hingga maksimal 5.00 kg. Porsi cucian satuan tetap ditagih normal tanpa diskon.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSimulateAddStamp}
                className="px-4 py-2.5 text-xs font-bold text-sky-700 bg-white hover:bg-sky-100 border border-sky-200 rounded-xl shadow-sm transition active:scale-95 shrink-0"
              >
                + Simulasi Tambah Stempel
              </button>
            </div>
          </div>

          {/* 2. Daily Check-in Streak Reward (Bab 10.4) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-sky-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 border border-teal-200 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    Daily Check-in Streak
                  </h2>
                  <p className="text-xs text-slate-500">
                    Buka PWA setiap hari dan klaim bonus koin streak berturut-turut
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold px-3 py-1 bg-teal-50 text-teal-700 rounded-full border border-teal-200 self-start sm:self-auto">
                Streak: Hari ke-{streakDay}
              </span>
            </div>

            {/* 7-Day Streak Road */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-6">
              {[
                { day: 1, pts: 10 },
                { day: 2, pts: 15 },
                { day: 3, pts: 20 },
                { day: 4, pts: 25 },
                { day: 5, pts: 30 },
                { day: 6, pts: 35 },
                { day: 7, pts: 50, bonus: true },
              ].map((st) => {
                const isPassed = st.day < streakDay;
                const isCurrent = st.day === streakDay;

                return (
                  <div
                    key={st.day}
                    className={`rounded-2xl p-2 sm:p-3 text-center border transition ${
                      isPassed
                        ? 'border-teal-300 bg-teal-50 text-teal-800'
                        : isCurrent
                        ? 'border-sky-500 bg-sky-500 text-white shadow-md shadow-sky-200 ring-2 ring-sky-200'
                        : 'border-slate-200 bg-slate-50 text-slate-400'
                    }`}
                  >
                    <p className="text-[10px] font-bold uppercase">
                      H-{st.day}
                    </p>
                    <p className="text-xs sm:text-sm font-black mt-1 font-mono">
                      +{st.pts}
                    </p>
                    {st.bonus && (
                      <span className="text-[9px] font-extrabold text-amber-300 block">
                        Bonus!
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Claim Action Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleClaimDaily}
                disabled={hasClaimedToday}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-sm transition shadow-lg ${
                  hasClaimedToday
                    ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-teal-200 active:scale-95'
                }`}
              >
                {hasClaimedToday ? (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Poin Hari Ini Sudah Diklaim (Kembali Besok!)
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    Klaim Koin Hari Ini (+{streakDay * 5 + 5} Poin)
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Active Order Widget Card */}
          <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                  Cucian Aktif
                </span>
                <h3 className="text-base font-bold text-slate-800 mt-1">
                  Pesanan #SKC-261009-0001 (Kode: SKC-R4N1X)
                </h3>
                <p className="text-xs text-slate-500">
                  Status: <strong>Sedang Cuci</strong> &bull; Total: Rp 32.400
                </p>
              </div>
            </div>

            <Link
              href="/track/SKC-R4N1X"
              className="px-5 py-2.5 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition flex items-center gap-2 self-start sm:self-auto"
            >
              Lihat Progres &amp; Foto QC
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
