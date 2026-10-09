'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CustomerAppNav from '../../../components/CustomerAppNav';
import Footer from '../../../components/Footer';
import {
  Tag,
  Gift,
  Coins,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Percent,
  Clock,
} from 'lucide-react';
import { formatRupiah } from '@sikucek/shared';
import {
  getCustomerSession,
  updateCustomerPoints,
} from '../../../lib/customer-auth';

interface CouponItem {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'free_kiloan' | 'fixed' | 'percent';
  valueDisplay: string;
  ruleBadge: string;
  validUntil: string;
}

interface RedeemableReward {
  id: string;
  title: string;
  costPoints: number;
  description: string;
}

const INITIAL_COUPONS: CouponItem[] = [
  {
    id: 'cp-01',
    code: 'STEMPEL-5KG-FREE',
    title: 'Gratis Cuci Kiloan Maks. 5 Kg',
    description: 'Reward spesial dari penyelesaian 5 stempel cucian.',
    discountType: 'free_kiloan',
    valueDisplay: 'Maks. 5.00 Kg',
    ruleBadge: 'Khusus Kiloan Saja (Satuan Tetap Normal)',
    validUntil: '30 Nov 2026',
  },
  {
    id: 'cp-02',
    code: 'WELCOME-10K',
    title: 'Diskon Sambutan Rp 10.000',
    description: 'Potongan harga langsung untuk pelanggan baru.',
    discountType: 'fixed',
    valueDisplay: 'Rp 10.000',
    ruleBadge: 'Min. Order Rp 30.000',
    validUntil: '15 Des 2026',
  },
  {
    id: 'cp-03',
    code: 'EXPRESS-HEMAT',
    title: 'Diskon 10% Layanan Express',
    description: 'Potongan khusus untuk layanan 1 hari selesai.',
    discountType: 'percent',
    valueDisplay: 'Diskon 10%',
    ruleBadge: 'Layanan Express Kiloan',
    validUntil: '31 Des 2026',
  },
];

const REDEEMABLE_REWARDS: RedeemableReward[] = [
  {
    id: 'rd-01',
    title: 'Voucher Potongan Rp 5.000',
    costPoints: 100,
    description: 'Bisa dipakai untuk pesanan kiloan atau satuan apa saja.',
  },
  {
    id: 'rd-02',
    title: 'Voucher Gratis Cuci Kiloan 2 Kg',
    costPoints: 180,
    description: 'Potongan biaya kiloan hingga 2.00 kg.',
  },
  {
    id: 'rd-03',
    title: 'Voucher Potongan Rp 15.000',
    costPoints: 250,
    description: 'Potongan besar untuk cucian bed cover atau jas.',
  },
];

export default function CouponsPage() {
  const [points, setPoints] = useState<number>(240);
  const [userCoupons, setUserCoupons] = useState<CouponItem[]>(INITIAL_COUPONS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const session = getCustomerSession();
    setPoints(session.pointsBalance);
  }, []);

  const handleRedeem = (reward: RedeemableReward) => {
    if (points < reward.costPoints) {
      setToastMessage('Poin Anda belum mencukupi untuk menukar voucher ini.');
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }

    const updated = updateCustomerPoints(-reward.costPoints);
    setPoints(updated.pointsBalance);

    const newCoupon: CouponItem = {
      id: `cp-${Date.now()}`,
      code: `TUKAR-${reward.costPoints}PTS`,
      title: reward.title,
      description: reward.description,
      discountType: 'fixed',
      valueDisplay: reward.title,
      ruleBadge: 'Hasil Tukar Koin',
      validUntil: '31 Des 2026',
    };
    setUserCoupons((prev) => [newCoupon, ...prev]);
    setToastMessage(`Berhasil menukar ${reward.costPoints} Poin dengan ${reward.title}!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 text-slate-900 pb-16 sm:pb-0">
      <CustomerAppNav />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-sky-600 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Dashboard Loyalti
            </Link>

            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-amber-200 shadow-sm self-start sm:self-auto">
              <Coins className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-semibold text-slate-600">Saldo Poin:</span>
              <span className="text-sm font-black font-mono text-amber-700">
                {points} Poin
              </span>
            </div>
          </div>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="bg-sky-100 border-2 border-sky-300 text-sky-900 rounded-2xl p-4 shadow-lg flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-sky-600 shrink-0" />
              <p className="text-xs sm:text-sm font-bold">{toastMessage}</p>
            </div>
          )}

          {/* 1. Active Coupons Wallet */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-md">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-sky-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800">
                    Dompet Kupon Aktif ({userCoupons.length})
                  </h1>
                  <p className="text-xs text-slate-500">
                    Tunjukkan kode kupon kepada kasir saat mengantar cucian
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userCoupons.map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl border-2 border-dashed border-amber-300 bg-gradient-to-br from-amber-50/50 to-amber-100/30 p-5 flex flex-col justify-between hover:shadow-md transition"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-900 rounded-lg">
                        {c.valueDisplay}
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        s/d {c.validUntil}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">
                      {c.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {c.description}
                    </p>

                    <div className="mt-3">
                      <span className="inline-block text-[10px] font-bold text-amber-800 bg-white/80 px-2 py-0.5 rounded-md border border-amber-200">
                        * {c.ruleBadge}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-semibold">
                        Kode Kupon:
                      </p>
                      <p className="text-xs font-mono font-black text-amber-900">
                        {c.code}
                      </p>
                    </div>

                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">
                      Siap Pakai
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Point Redemption Catalog */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-md">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-sky-50">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 border border-teal-200 flex items-center justify-center shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Katalog Penukaran Poin
                </h2>
                <p className="text-xs text-slate-500">
                  Tukarkan poin check-in harian Anda dengan voucher diskon cucian
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {REDEEMABLE_REWARDS.map((item) => {
                const canAfford = points >= item.costPoints;

                return (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-teal-100 text-teal-800 rounded-md">
                          Voucher
                        </span>
                        <span className="text-xs font-black font-mono text-amber-700">
                          {item.costPoints} Poin
                        </span>
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-800">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {item.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRedeem(item)}
                      disabled={!canAfford}
                      className={`mt-4 w-full py-2 px-3 rounded-xl text-xs font-bold transition ${
                        canAfford
                          ? 'bg-sky-500 hover:bg-sky-600 text-white shadow-sm active:scale-95'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Tukar Sekarang' : 'Poin Kurang'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
