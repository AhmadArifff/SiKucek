'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CustomerAppNav from '../../components/CustomerAppNav';
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
  User,
  Ticket,
} from 'lucide-react';
import {
  getCustomerSession,
  updateCustomerPoints,
  updateCustomerStamps,
  type CustomerSession,
} from '../../lib/customer-auth';

export default function CustomerDashboardPage() {
  const [session, setSession] = useState<CustomerSession | null>(null);
  const [stampsCount, setStampsCount] = useState<number>(3);
  const [pointsBalance, setPointsBalance] = useState<number>(240);
  const [hasClaimedToday, setHasClaimedToday] = useState<boolean>(false);
  const [streakDay, setStreakDay] = useState<number>(4);
  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null);

  useEffect(() => {
    const current = getCustomerSession();
    setSession(current);
    setStampsCount(current.stampsCount);
    setPointsBalance(current.pointsBalance);

    const handleUpdate = () => {
      const updated = getCustomerSession();
      setSession(updated);
      setStampsCount(updated.stampsCount);
      setPointsBalance(updated.pointsBalance);
    };

    window.addEventListener('sikucek_customer_session_updated', handleUpdate);
    return () => {
      window.removeEventListener('sikucek_customer_session_updated', handleUpdate);
    };
  }, []);

  const handleClaimDaily = () => {
    if (hasClaimedToday) return;
    const earned = streakDay * 5 + 5; // e.g. Day 4 = 25 pts
    const updated = updateCustomerPoints(earned);
    setPointsBalance(updated.pointsBalance);
    setHasClaimedToday(true);
    setCelebrationMessage(`Hore! +${earned} Koin Poin berhasil diklaim ke saldo Anda!`);
    setTimeout(() => setCelebrationMessage(null), 4000);
  };

  const handleSimulateAddStamp = () => {
    if (stampsCount < 5) {
      const next = stampsCount + 1;
      const updated = updateCustomerStamps(1);
      setStampsCount(updated.stampsCount);
      if (next === 5) {
        setCelebrationMessage(
          'Selamat! 5 Stempel Lengkap! 1 Voucher "Gratis Cuci Kiloan Maks. 5 Kg" otomatis diterbitkan ke dompet kupon Anda!'
        );
      }
    } else {
      // Reset card cycle
      const updated = updateCustomerStamps(-4);
      setStampsCount(updated.stampsCount);
      setCelebrationMessage('Siklus kartu baru dimulai! Stempel ke-1 tercatat.');
    }
    setTimeout(() => setCelebrationMessage(null), 5000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-mesh-cyan text-slate-900 pb-16 sm:pb-0">
      <CustomerAppNav />

      <main className="flex-1 py-6 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8">
          {/* Top Profile Header */}
          <div className="relative bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white rounded-3xl sm:rounded-4xl p-5 sm:p-8 shadow-2xl shadow-sky-950/25 overflow-hidden border border-white/10">
            {/* Ambient bubble glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-coral-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6">
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-white/40 shadow-lg shadow-sky-500/20 shrink-0">
                  <Image
                    src="/logo-sikucek.jpg"
                    alt="Maskot Profil"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-heading font-black tracking-tight">
                      Halo, {session?.name || 'Rani Maharani'}!
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-xs">
                      Tier: {session?.tierLabel || 'Wangi Segar'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-sky-200 mt-1 font-sans">
                    {session?.phone || '0812-3456-7890'} &bull; Kode Referral: <span className="font-mono font-bold text-amber-300">{session?.referralCode || 'RANI-KUCEK'}</span>
                  </p>
                </div>
              </div>

              {/* Point Balance Badge */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-white/15 text-left sm:text-right self-start sm:self-auto shadow-inner">
                <span className="text-[10px] uppercase tracking-wider text-sky-300 font-heading font-black block">
                  Saldo Koin Loyalti
                </span>
                <div className="flex items-center gap-2 justify-start sm:justify-end mt-1">
                  <Coins className="w-5 h-5 text-amber-300 animate-pulse" />
                  <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
                    {pointsBalance}
                  </span>
                  <span className="text-xs text-amber-300 font-bold">Poin</span>
                </div>
              </div>
            </div>

            {/* Quick Links Nav */}
            <div className="relative z-10 mt-6 pt-4 border-t border-white/15 flex flex-wrap gap-2 text-xs font-heading font-bold">
              <span className="bg-white text-sky-800 px-3.5 py-1.5 rounded-xl shadow-xs">
                Loyalti &amp; Stamp
              </span>
              <Link
                href="/app/orders"
                className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 border border-white/10"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Pesanan Saya
              </Link>
              <Link
                href="/app/coupons"
                className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 border border-white/10"
              >
                <Ticket className="w-3.5 h-3.5" />
                Dompet Kupon
              </Link>
              <Link
                href="/app/profile"
                className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 border border-white/10"
              >
                <User className="w-3.5 h-3.5" />
                Profil &amp; Referral
              </Link>
            </div>
          </div>

          {/* Toast / Celebration Alert */}
          {celebrationMessage && (
            <div className="bg-amber-100/90 border-2 border-amber-300 text-amber-950 rounded-2xl p-4 shadow-lg flex items-center gap-3 animate-bounce">
              <Sparkles className="w-6 h-6 text-amber-600 shrink-0" />
              <p className="text-xs sm:text-sm font-heading font-bold leading-snug">
                {celebrationMessage}
              </p>
            </div>
          )}

          {/* 1. Stamp Card Digital (Bab 10.4) */}
          <div className="glass-panel rounded-3xl sm:rounded-4xl p-5 sm:p-8 border border-sky-100/90 shadow-xl shadow-sky-500/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-sky-100/80">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0 shadow-xs">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-heading font-black text-slate-900">
                    Stamp Card Digital (5 Slot)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5 font-sans">
                    Kumpulkan 5 stempel cucian untuk klaim kupon cuci kiloan gratis hingga 5 kg
                  </p>
                </div>
              </div>

              <span className="text-xs font-heading font-black px-3.5 py-1.5 bg-amber-100 text-amber-900 rounded-full border border-amber-300/80 self-start sm:self-auto shadow-xs">
                Progres: {stampsCount} / 5 Stempel
              </span>
            </div>

            {/* Stamp Slots Grid */}
            <div className="grid grid-cols-5 gap-2 sm:gap-4 my-5 sm:my-7">
              {[1, 2, 3, 4, 5].map((slotNumber) => {
                const isFilled = slotNumber <= stampsCount;
                const isRewardSlot = slotNumber === 5;

                return (
                  <div
                    key={slotNumber}
                    className={`aspect-square rounded-2xl sm:rounded-3xl border-2 flex flex-col items-center justify-center p-2 text-center transition-all relative ${
                      isFilled
                        ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-amber-100/80 shadow-md shadow-amber-400/20 scale-102'
                        : isRewardSlot
                        ? 'border-dashed border-coral-400 bg-coral-50/50 text-coral-600 shadow-sm'
                        : 'border-dashed border-slate-200 bg-slate-50/50 text-slate-400'
                    }`}
                  >
                    {isFilled ? (
                      <>
                        <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 text-slate-950 font-black flex items-center justify-center shadow-md shadow-amber-500/30 text-sm sm:text-lg">
                          🪙
                        </div>
                        <span className="text-[10px] sm:text-xs font-heading font-black text-amber-900 mt-1">
                          #{slotNumber}
                        </span>
                      </>
                    ) : isRewardSlot ? (
                      <>
                        <Gift className="w-6 h-6 sm:w-9 sm:h-9 text-coral-500 animate-pulse" />
                        <span className="text-[9px] sm:text-xs font-heading font-black text-coral-600 mt-1 leading-tight">
                          Gratis 5Kg
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-xs sm:text-base font-black font-mono text-slate-300">
                          #{slotNumber}
                        </span>
                        <span className="text-[9px] text-slate-400 mt-0.5 hidden sm:block font-sans">
                          Kosong
                        </span>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Rule Callout & Simulation Action */}
            <div className="bg-sky-50/80 rounded-2xl p-4 sm:p-5 border border-sky-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-xs text-slate-600 space-y-1 font-sans">
                <p className="font-heading font-black text-sky-950">
                  Aturan Diskon Parsial Kupon (Bab 10.4 PRD):
                </p>
                <p>
                  Kupon hadiah stempel <strong>hanya memotong tagihan porsi kiloan</strong> hingga maksimal 5.00 kg. Porsi cucian satuan tetap ditagih normal tanpa potongan.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSimulateAddStamp}
                className="px-4 py-2.5 text-xs font-heading font-black text-sky-700 bg-white hover:bg-sky-50 border border-sky-200 rounded-xl shadow-xs transition active:scale-95 shrink-0 cursor-pointer"
              >
                + Simulasi Tambah Stempel
              </button>
            </div>
          </div>

          {/* 2. Daily Check-in Streak Reward (Bab 10.4) */}
          <div className="glass-panel rounded-3xl sm:rounded-4xl p-5 sm:p-8 border border-sky-100/90 shadow-xl shadow-sky-500/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-sky-100/80">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-600 border border-teal-200 flex items-center justify-center shrink-0 shadow-xs">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-heading font-black text-slate-900">
                    Daily Check-in Streak
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5 font-sans">
                    Buka PWA setiap hari dan klaim bonus koin streak berturut-turut
                  </p>
                </div>
              </div>

              <span className="text-xs font-heading font-black px-3.5 py-1.5 bg-teal-100 text-teal-900 rounded-full border border-teal-300/80 self-start sm:self-auto shadow-xs">
                Streak: Hari ke-{streakDay}
              </span>
            </div>

            {/* 7-Day Streak Road */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-3 mb-6">
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
                    className={`rounded-2xl p-2 sm:p-3 text-center border transition-all ${
                      isPassed
                        ? 'border-teal-300 bg-teal-50 text-teal-800'
                        : isCurrent
                        ? 'border-sky-500 bg-gradient-to-br from-sky-500 to-teal-500 text-white shadow-lg shadow-sky-500/25 ring-2 ring-sky-300/40 scale-102'
                        : 'border-slate-200 bg-slate-50/70 text-slate-400'
                    }`}
                  >
                    <p className="text-[10px] font-heading font-black uppercase">
                      H-{st.day}
                    </p>
                    <p className="text-xs sm:text-base font-black mt-1 font-mono">
                      +{st.pts}
                    </p>
                    {st.bonus && (
                      <span className="text-[9px] font-black text-amber-300 block mt-0.5">
                        Super!
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
                className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-heading font-black text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer ${
                  hasClaimedToday
                    ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-teal-500/25'
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
          <div className="glass-panel rounded-3xl p-6 border border-sky-100/90 shadow-xl shadow-sky-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-500/20">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-heading font-black uppercase tracking-wider text-sky-700 bg-sky-100/80 px-2.5 py-0.5 rounded-full border border-sky-200">
                  Cucian Sedang Berjalan
                </span>
                <h3 className="text-base font-heading font-black text-slate-900 mt-1">
                  Pesanan #SKC-261009-0001 (Kode: SKC-R4N1X)
                </h3>
                <p className="text-xs text-slate-500 font-sans">
                  Status: <strong className="text-slate-800">Sedang Cuci</strong> &bull; Total: <span className="font-mono font-bold text-slate-800">Rp 32.400</span>
                </p>
              </div>
            </div>

            <Link
              href="/track/SKC-R4N1X"
              className="px-5 py-2.5 text-xs font-heading font-black text-white bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 rounded-xl transition shadow-sm shadow-sky-500/20 flex items-center gap-2 self-start sm:self-auto active:scale-95"
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

