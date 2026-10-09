'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Coins,
  MessageCircle,
  Sparkles,
  Phone,
  Calendar,
  Gift,
  CheckCircle2,
  AlertTriangle,
  Award,
} from 'lucide-react';
import {
  getStoredCustomers,
  saveStoredCustomers,
  AdminCustomerProfile,
} from '../../../lib/marketing-store';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomerProfile[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'dormant'>('dormant');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setCustomers(getStoredCustomers());
  }, []);

  const totalCustomers = customers.length;
  const dormantCustomers = customers.filter((c) => c.is_dormant);
  const activeCustomers = customers.filter((c) => !c.is_dormant);
  const totalPoints = customers.reduce((acc, c) => acc + c.points_balance, 0);

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'kinclong_sultan':
        return <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">Kinclong Sultan</span>;
      case 'wangi_segar':
        return <span className="bg-sky-100 text-sky-800 border border-sky-300 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">Wangi Segar</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">Busa Baru</span>;
    }
  };

  const handleSendWinbackWa = (customer: AdminCustomerProfile) => {
    const rawPhone = customer.phone.replace(/\D/g, '');
    const cleanPhone = rawPhone.startsWith('0') ? '62' + rawPhone.slice(1) : rawPhone;

    const message = encodeURIComponent(
      `Hai Kak ${customer.name}! Si Kucek kangen nih, sudah ${customer.days_since_last_order} hari keranjang cucian Kakak belum mampir ke outlet SiKucek 😊\n\n` +
      `Biar pakaian Kakak kembali wangi lavender dan bersih rapi, kami sediakan VOUCHER KHUSUS POTONGAN Rp 15.000 untuk Kakak!\n` +
      `Kode Kupon: *WINBACK-15K*\n\n` +
      `Cukup tunjukkan pesan ini atau sebutkan kode kupon saat mengantar cucian di kasir hari ini ya. Sampai jumpa di SiKucek!`
    );

    const waUrl = `https://wa.me/${cleanPhone}?text=${message}`;
    if (typeof window !== 'undefined') {
      window.open(waUrl, '_blank');
      setToastMessage(`Pesan WhatsApp Winback disiapkan untuk ${customer.name}!`);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              CRM Pelanggan &amp; Retensi Dorman
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">
              Bab 12 PRD
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Segmentasi pelanggan setia, audit aktivitas cucian, dan automasi re-engagement winback WhatsApp
          </p>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl p-4 shadow-sm flex items-center gap-2 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Pelanggan
            </span>
            <Users className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-2xl font-black font-mono text-slate-900">{totalCustomers}</p>
          <p className="text-[10px] text-slate-500">Basis database outlet</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Pelanggan Aktif
            </span>
            <UserCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black font-mono text-emerald-600">{activeCustomers.length}</p>
          <p className="text-[10px] text-slate-500">Mencuci &lt;14 hari terakhir</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-rose-200 bg-rose-50/20 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
              Pelanggan Dorman
            </span>
            <UserX className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black font-mono text-rose-600">{dormantCustomers.length}</p>
          <p className="text-[10px] text-rose-700 font-semibold">&gt;14 hari tidak mencuci</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Poin Loyalti Beredar
            </span>
            <Coins className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black font-mono text-amber-600">{totalPoints} Pts</p>
          <p className="text-[10px] text-slate-500">Dapat ditukarkan kupon</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('dormant')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-2xl border transition ${
            activeTab === 'dormant'
              ? 'border-rose-400 bg-rose-50 text-rose-800 shadow-sm'
              : 'border-transparent text-slate-600 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          <span>Target Winback Dorman ({dormantCustomers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-2xl border transition ${
            activeTab === 'all'
              ? 'border-sky-500 bg-sky-50 text-sky-700 shadow-sm'
              : 'border-transparent text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Semua Pelanggan ({totalCustomers})</span>
        </button>
      </div>

      {/* TAB 1: DORMANT SEGMENTS (>14 DAYS) */}
      {activeTab === 'dormant' && (
        <div className="space-y-4">
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-900 leading-relaxed">
              <p className="font-bold mb-0.5">Strategi Winback Otomatis (Bab 12):</p>
              <p>
                Pelanggan di bawah ini belum mencuci selama lebih dari 14 hari berturut-turut. Klik tombol <strong>Kirim WA Winback</strong> untuk menghubungi mereka secara personal dengan penawaran kupon diskon Rp 15.000 (<code>WINBACK-15K</code>) guna menaikkan frekuensi repeat order.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Nama Pelanggan</th>
                    <th className="py-3 px-4">Nomor WhatsApp</th>
                    <th className="py-3 px-4">Tier Loyalitas</th>
                    <th className="py-3 px-4 text-center">Lama Tidak Mencuci</th>
                    <th className="py-3 px-4 text-right">Saldo Poin</th>
                    <th className="py-3 px-4 text-center">Aksi Winback</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dormantCustomers.map((cust) => (
                    <tr key={cust.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900">{cust.name}</p>
                        <p className="text-[10px] text-slate-400">
                          {cust.total_completed_orders} pesanan terselesaikan
                        </p>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700">
                        {cust.phone}
                      </td>
                      <td className="py-3 px-4">
                        {getTierBadge(cust.tier)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-rose-100 text-rose-900 font-extrabold text-[11px] px-2.5 py-1 rounded-xl font-mono">
                          {cust.days_since_last_order} Hari
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-amber-600">
                        {cust.points_balance} Pts
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleSendWinbackWa(cust)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition active:scale-95 inline-flex items-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          Kirim WA Winback
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ALL CUSTOMERS */}
      {activeTab === 'all' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Nama Pelanggan</th>
                  <th className="py-3 px-4">Nomor WhatsApp</th>
                  <th className="py-3 px-4">Tier Loyalitas</th>
                  <th className="py-3 px-4 text-center">Cucian Selesai</th>
                  <th className="py-3 px-4 text-right">Saldo Poin</th>
                  <th className="py-3 px-4 text-center">Kode Referral</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{cust.name}</p>
                      <p className="text-[10px] text-slate-400">
                        Order terakhir: {cust.days_since_last_order} hari lalu
                      </p>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      {cust.phone}
                    </td>
                    <td className="py-3 px-4">
                      {getTierBadge(cust.tier)}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-800">
                      {cust.total_completed_orders} Order
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-amber-600">
                      {cust.points_balance} Pts
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                        {cust.referral_code}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          cust.is_dormant
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {cust.is_dormant ? 'Dorman' : 'Aktif'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
