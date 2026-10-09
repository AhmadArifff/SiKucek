'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Calendar,
  Printer,
  Copy,
  Check,
  TrendingUp,
  Banknote,
  QrCode,
  Scale,
  DollarSign,
  FileText,
  Search,
  ExternalLink,
} from 'lucide-react';
import { formatRupiah, formatKg, formatPaymentChannelName } from '@sikucek/shared';
import { getStoredOrders, PosOrder } from '../../../lib/orders-store';

export default function AdminReportsPage() {
  const [orders, setOrders] = useState<PosOrder[]>([]);
  const [period, setPeriod] = useState<'today' | '7days' | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSummary, setCopiedSummary] = useState(false);

  useEffect(() => {
    setOrders(getStoredOrders());
  }, []);

  const filteredOrders = useMemo(() => {
    const now = Date.now();
    return orders.filter((o) => {
      const orderTime = new Date(o.created_at).getTime();

      if (period === 'today') {
        const isToday = new Date(o.created_at).toDateString() === new Date().toDateString();
        if (!isToday) return false;
      } else if (period === '7days') {
        if (now - orderTime > 7 * 86400000) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          o.order_number.toLowerCase().includes(q) ||
          o.customer_name.toLowerCase().includes(q) ||
          o.tracking_code.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [orders, period, searchQuery]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    let totalGross = 0;
    let totalDiscount = 0;
    let totalNet = 0;
    let paidTotal = 0;
    let unpaidTotal = 0;
    let totalWeight = 0;
    let cashTotal = 0;
    let qrisTotal = 0;

    for (const o of filteredOrders) {
      totalGross += o.gross_amount;
      totalDiscount += o.discount_amount;
      totalNet += o.final_amount;
      totalWeight += o.kiloan_weight_kg;

      if (o.payment_status === 'paid') {
        paidTotal += o.final_amount;
        if (o.payment_channel === 'cash') {
          cashTotal += o.final_amount;
        } else {
          qrisTotal += o.final_amount;
        }
      } else {
        unpaidTotal += o.final_amount;
      }
    }

    return {
      totalOrders: filteredOrders.length,
      totalGross,
      totalDiscount,
      totalNet,
      paidTotal,
      unpaidTotal,
      totalWeight,
      cashTotal,
      qrisTotal,
    };
  }, [filteredOrders]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleCopyClosingSummary = () => {
    const summaryText = `*LAPORAN OPERASIONAL OUTLET SIKUCEK*
Periode: ${period === 'today' ? 'Hari Ini' : period === '7days' ? '7 Hari Terakhir' : 'Semua Data'}
Tanggal Rekap: ${new Date().toLocaleDateString('id-ID')}

Total Transaksi: ${metrics.totalOrders} order
Total Volume Kiloan: ${formatKg(metrics.totalWeight)}

Omzet Lunas (Terima Kasir): ${formatRupiah(metrics.paidTotal)}
- Tunai (Cash): ${formatRupiah(metrics.cashTotal)}
- QRIS / Cashless: ${formatRupiah(metrics.qrisTotal)}
Piutang Belum Lunas: ${formatRupiah(metrics.unpaidTotal)}
Total Subsidi Diskon Promo: ${formatRupiah(metrics.totalDiscount)}

_Laporan otomatis digenerate dari SiKucek POS Operating System_`;

    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(summaryText);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Laporan Keuangan &amp; Rekapitulasi Operasional
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">
              Khusus Owner
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Audit omzet kasir harian, volume timbangan, rincian tunai vs QRIS, dan rekap closing outlet
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleCopyClosingSummary}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl transition"
          >
            {copiedSummary ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Format WA Disalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin Rekap WA</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow transition"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Rekap</span>
          </button>
        </div>
      </div>

      {/* Printable Header for Physical Printer */}
      <div className="hidden print:block pb-4 border-b border-slate-300 text-center space-y-1">
        <h2 className="text-xl font-black">REKAPITULASI LAPORAN OPERASIONAL SIKUCEK LAUNDRY</h2>
        <p className="text-xs text-slate-600">Jl. Margonda Raya No. 12, Depok - WhatsApp 0812-3456-7890</p>
        <p className="text-xs text-slate-500">
          Dicetak pada: {new Date().toLocaleString('id-ID')}
        </p>
      </div>

      {/* KPI Financial Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Omzet Lunas Diterima
          </span>
          <p className="text-2xl font-black font-mono text-emerald-600">
            {formatRupiah(metrics.paidTotal)}
          </p>
          <p className="text-[10px] text-slate-600">Kas masuk kasir</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Total Piutang Belum Lunas
          </span>
          <p className="text-2xl font-black font-mono text-amber-600">
            {formatRupiah(metrics.unpaidTotal)}
          </p>
          <p className="text-[10px] text-slate-600">Bayar saat ambil pakaian</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Total Berat Kiloan
            </span>
            <Scale className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-2xl font-black font-mono text-slate-900">
            {formatKg(metrics.totalWeight)}
          </p>
          <p className="text-[10px] text-slate-600">Beban kerja mesin cuci</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Diskon Kupon Promo
          </span>
          <p className="text-2xl font-black font-mono text-rose-600">
            {formatRupiah(metrics.totalDiscount)}
          </p>
          <p className="text-[10px] text-slate-600">Insentif royalti pelanggan</p>
        </div>
      </div>

      {/* Payment Channel Breakdown Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <Banknote className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase text-slate-500">
                Penerimaan Tunai (Cash)
              </span>
              <p className="text-xl font-black font-mono text-slate-900">
                {formatRupiah(metrics.cashTotal)}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-600 font-mono">
            {metrics.paidTotal > 0
              ? Math.round((metrics.cashTotal / metrics.paidTotal) * 100)
              : 0}
            %
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase text-slate-500">
                Penerimaan QRIS &amp; Transfer
              </span>
              <p className="text-xl font-black font-mono text-slate-900">
                {formatRupiah(metrics.qrisTotal)}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-600 font-mono">
            {metrics.paidTotal > 0
              ? Math.round((metrics.qrisTotal / metrics.paidTotal) * 100)
              : 0}
            %
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              type="button"
              onClick={() => setPeriod('today')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                period === 'today'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Hari Ini
            </button>
            <button
              type="button"
              onClick={() => setPeriod('7days')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                period === '7days'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              7 Hari Terakhir
            </button>
            <button
              type="button"
              onClick={() => setPeriod('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                period === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua Periode ({orders.length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari invoice / pelanggan..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-3 px-3">No Invoice</th>
                <th className="py-3 px-3">Pelanggan</th>
                <th className="py-3 px-3 text-center">Berat (Kg)</th>
                <th className="py-3 px-3">Metode Bayar</th>
                <th className="py-3 px-3 text-right">Subtotal</th>
                <th className="py-3 px-3 text-right">Diskon</th>
                <th className="py-3 px-3 text-right">Total Akhir</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right print:hidden">Nota</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3 font-bold text-slate-900">
                    {ord.order_number}
                    <span className="block text-[10px] text-slate-600 font-normal">
                      {new Date(ord.created_at).toLocaleDateString('id-ID')}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-sans font-semibold text-slate-800">
                    {ord.customer_name}
                    <span className="block text-[10px] text-slate-600 font-mono">
                      {ord.customer_phone}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-slate-700">
                    {formatKg(ord.kiloan_weight_kg)}
                  </td>
                  <td className="py-3 px-3 font-sans text-[11px] font-semibold text-slate-600">
                    {formatPaymentChannelName(ord.payment_channel)}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-600">
                    {formatRupiah(ord.gross_amount)}
                  </td>
                  <td className="py-3 px-3 text-right text-rose-600">
                    {ord.discount_amount > 0 ? `-${formatRupiah(ord.discount_amount)}` : '0'}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900">
                    {formatRupiah(ord.final_amount)}
                  </td>
                  <td className="py-3 px-3 text-center font-sans">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        ord.payment_status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ord.payment_status === 'paid' ? 'Lunas' : 'Belum Bayar'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-sans print:hidden">
                    <Link
                      href={`/orders/${ord.id}/receipt`}
                      className="text-[11px] font-bold text-sky-600 hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>Struk</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
