'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import CustomerAppNav from '../../../components/CustomerAppNav';
import Footer from '../../../components/Footer';
import {
  User,
  Award,
  Share2,
  Copy,
  Check,
  Gift,
  Coins,
  Scale,
  ShoppingBag,
  ExternalLink,
  LogOut,
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import {
  getCustomerSession,
  saveCustomerSession,
  logoutCustomer,
  TIER_CONFIG,
  DEMO_PRESET_CUSTOMERS,
  type CustomerSession,
  type CustomerTier,
} from '../../../lib/customer-auth';
import { formatRupiah, formatKg } from '@sikucek/shared';

export default function CustomerProfilePage() {
  const router = useRouter();
  const [session, setSession] = useState<CustomerSession | null>(null);
  const [copied, setCopied] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);

  useEffect(() => {
    setSession(getCustomerSession());

    const handleUpdate = () => {
      setSession(getCustomerSession());
    };

    window.addEventListener('sikucek_customer_session_updated', handleUpdate);
    return () => {
      window.removeEventListener('sikucek_customer_session_updated', handleUpdate);
    };
  }, []);

  if (!session) {
    return null;
  }

  const handleCopyReferral = () => {
    if (!session) return;
    navigator.clipboard.writeText(session.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShareWhatsApp = () => {
    if (!session) return;
    const text = encodeURIComponent(
      `Halo! Cobain deh cuci baju di SiKucek Laundry, bersih, wangi, higienis, dan ada foto QC anti-sengketa! Gunakan kode referralku ${session.referralCode} untuk dapat DISKON 10% di cucian pertamamu: https://sikucek.app/app`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleSwitchAccount = (preset: CustomerSession) => {
    saveCustomerSession(preset);
    setSession(preset);
    setShowSwitchModal(false);
  };

  const handleLogout = () => {
    logoutCustomer();
    router.push('/auth/login');
  };

  // Tier calculation progress
  const currentTierConfig = TIER_CONFIG[session.tier];
  let nextTierName = 'Kinclong Sultan (Maksimal)';
  let ordersToNextTier = 0;
  let progressPercent = 100;

  if (session.tier === 'busa_baru') {
    nextTierName = 'Wangi Segar (5 Pesanan)';
    ordersToNextTier = Math.max(0, 5 - session.completedOrdersCount);
    progressPercent = Math.min(100, (session.completedOrdersCount / 5) * 100);
  } else if (session.tier === 'wangi_segar') {
    nextTierName = 'Kinclong Sultan (15 Pesanan)';
    ordersToNextTier = Math.max(0, 15 - session.completedOrdersCount);
    progressPercent = Math.min(100, ((session.completedOrdersCount - 5) / 10) * 100);
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 text-slate-900 pb-16 sm:pb-0">
      <CustomerAppNav />

      <main className="flex-1 py-6 sm:py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          {/* 1. Header Profile Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-sky-400 shadow-md shrink-0">
                  <Image
                    src="/logo-sikucek.jpg"
                    alt="Maskot Profil"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                      {session.name}
                    </h1>
                    <span
                      className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full border ${currentTierConfig.badgeBg}`}
                    >
                      {currentTierConfig.label}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    No. WhatsApp: <span className="font-semibold text-slate-700">{session.phone}</span> &bull; Terdaftar sejak {session.joinedAt}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setShowSwitchModal(true)}
                  className="px-3.5 py-2 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition"
                >
                  Ganti Profil Demo
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl transition"
                  title="Keluar dari Akun"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
              <div className="bg-sky-50/50 p-3.5 rounded-2xl border border-sky-100/60">
                <span className="text-[11px] text-slate-500 block">Koin Loyalti</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span className="text-base font-black font-mono text-slate-800">
                    {session.pointsBalance} Pts
                  </span>
                </div>
              </div>

              <div className="bg-sky-50/50 p-3.5 rounded-2xl border border-sky-100/60">
                <span className="text-[11px] text-slate-500 block">Pesanan Selesai</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <ShoppingBag className="w-4 h-4 text-sky-600" />
                  <span className="text-base font-black font-mono text-slate-800">
                    {session.completedOrdersCount}x Cuci
                  </span>
                </div>
              </div>

              <div className="bg-sky-50/50 p-3.5 rounded-2xl border border-sky-100/60">
                <span className="text-[11px] text-slate-500 block">Total Cucian</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Scale className="w-4 h-4 text-indigo-500" />
                  <span className="text-base font-black font-mono text-slate-800">
                    {formatKg(session.totalKgWashed)}
                  </span>
                </div>
              </div>

              <div className="bg-sky-50/50 p-3.5 rounded-2xl border border-sky-100/60">
                <span className="text-[11px] text-slate-500 block">Stempel Aktif</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Gift className="w-4 h-4 text-rose-500" />
                  <span className="text-base font-black font-mono text-slate-800">
                    {session.stampsCount} / 5 Cap
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Kartu Tingkatan Loyalitas (Bab 12.5) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-sky-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Tingkatan Keanggotaan (Customer Tier)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Naikkan jumlah cucian untuk membuka diskon permanen kiloan dan prioritas antrean.
                  </p>
                </div>
              </div>

              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border self-start sm:self-auto ${currentTierConfig.badgeBg}`}
              >
                Aktif: {currentTierConfig.label}
              </span>
            </div>

            {/* Progress Bar to next tier */}
            <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                <span>Progres Menuju: {nextTierName}</span>
                <span>{progressPercent.toFixed(0)}%</span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                {ordersToNextTier > 0
                  ? `Kurang ${ordersToNextTier} pesanan cucian selesai lagi untuk naik tingkat ke level berikutnya!`
                  : 'Selamat! Anda sudah berada di tingkat loyalti tertinggi SiKucek.'}
              </p>
            </div>

            {/* All Tiers Comparison Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(Object.keys(TIER_CONFIG) as CustomerTier[]).map((tierKey) => {
                const cfg = TIER_CONFIG[tierKey];
                const isCurrent = session.tier === tierKey;

                return (
                  <div
                    key={tierKey}
                    className={`rounded-2xl p-4 border transition ${
                      isCurrent
                        ? 'border-sky-400 bg-sky-50/50 shadow-sm ring-2 ring-sky-100'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`text-xs font-black uppercase px-2 py-0.5 rounded-lg border ${cfg.badgeBg}`}>
                        {cfg.label}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-black text-sky-700 bg-white px-2 py-0.5 rounded-full border border-sky-300">
                          Tingkat Anda
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-bold text-slate-700 mb-3">
                      {tierKey === 'busa_baru' && '0 - 4 Pesanan'}
                      {tierKey === 'wangi_segar' && '5 - 14 Pesanan'}
                      {tierKey === 'kinclong_sultan' && '15+ Pesanan'}
                      <span className="block text-[11px] font-normal text-slate-500">
                        Diskon Kiloan: {cfg.discountPercent}%
                      </span>
                    </div>

                    <ul className="space-y-1.5 text-[11px] text-slate-600">
                      {cfg.perks.map((perk, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Kartu Program Referral (Bab 12.2 - Ajak Teman Cuci) */}
          <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-amber-500/20 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 max-w-lg">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-amber-100 border border-white/30">
                  <Share2 className="w-3.5 h-3.5" />
                  Program Ajak Teman (Win-Win Incentive)
                </span>
                <h2 className="text-xl sm:text-2xl font-black">
                  Bagikan Kode, Dapatkan 50 Koin Poin!
                </h2>
                <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
                  Teman yang memakai kodemu dapat <strong>diskon 10%</strong> untuk cucian pertama mereka. Saat cucian teman selesai diambil, kamu otomatis mendapat <strong>50 Poin Loyalti</strong>!
                </p>
              </div>

              {/* Referral Code Box */}
              <div className="bg-white text-slate-900 rounded-2xl p-4 sm:p-5 shadow-lg border border-amber-200 text-center shrink-0 w-full sm:w-auto">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Kode Referral Unik Anda
                </span>
                <div className="font-mono font-black text-2xl tracking-widest text-slate-900 my-2">
                  {session.referralCode}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    type="button"
                    onClick={handleCopyReferral}
                    className="flex-1 px-3 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-200" />
                        Tersalin!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Salin Kode
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    className="px-3.5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition flex items-center justify-center gap-1.5 active:scale-95"
                    title="Bagikan ke WhatsApp"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    Share WA
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Link Cepat ke Kupon & Resi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/app/coupons"
              className="bg-white rounded-3xl p-5 border border-sky-100 hover:border-sky-300 shadow-sm transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    Dompet Kupon &amp; Voucher
                  </h4>
                  <p className="text-xs text-slate-500">
                    Gunakan voucher Gratis Cuci 5 Kg dari hasil 5 stempel
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition" />
            </Link>

            <Link
              href="/app/orders"
              className="bg-white rounded-3xl p-5 border border-sky-100 hover:border-sky-300 shadow-sm transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    Semua Pesanan Cucian
                  </h4>
                  <p className="text-xs text-slate-500">
                    Lihat pakaian di mesin cuci, setrika, atau siap di rak
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>
        </div>
      </main>

      {/* Switch Profile Demo Modal */}
      {showSwitchModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-sky-100 shadow-2xl">
            <h3 className="text-base font-black text-slate-900 mb-2">
              Pilih Profil Demo Pengujian
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Pilih salah satu profil untuk menguji tampilan tier, kupon, dan pesanan yang berbeda.
            </p>

            <div className="space-y-2 mb-5">
              {DEMO_PRESET_CUSTOMERS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSwitchAccount(preset)}
                  className={`w-full text-left p-3 rounded-2xl border transition flex items-center justify-between ${
                    session.id === preset.id
                      ? 'border-sky-500 bg-sky-50/50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">
                        {preset.name}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {preset.tierLabel}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      {preset.phone} &bull; {preset.pointsBalance} Poin &bull; {preset.completedOrdersCount} Pesanan
                    </span>
                  </div>
                  {session.id === preset.id && (
                    <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  )}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowSwitchModal(false)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
