'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CustomerAppNav from '../../../components/CustomerAppNav';
import Footer from '../../../components/Footer';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  MapPin,
  Camera,
  ArrowRight,
  ExternalLink,
  Search,
  Filter,
  Sparkles,
  RefreshCw,
  QrCode,
} from 'lucide-react';
import {
  getCustomerSession,
  type CustomerSession,
} from '../../../lib/customer-auth';
import {
  getCustomerOrders,
  type PublicOrderTracking,
} from '../../../lib/tracking-store';
import { formatRupiah, formatKg } from '@sikucek/shared';

type TabType = 'all' | 'in_progress' | 'ready' | 'completed';

export default function CustomerOrdersPage() {
  const [session, setSession] = useState<CustomerSession | null>(null);
  const [orders, setOrders] = useState<PublicOrderTracking[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = () => {
    const currentSession = getCustomerSession();
    setSession(currentSession);
    const customerOrders = getCustomerOrders(currentSession.phone);
    setOrders(customerOrders);
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener('sikucek_customer_session_updated', handleUpdate);
    return () => {
      window.removeEventListener('sikucek_customer_session_updated', handleUpdate);
    };
  }, []);

  const filteredOrders = orders.filter((order) => {
    // Search query match
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      order.orderNumber.toLowerCase().includes(q) ||
      order.trackingCode.toLowerCase().includes(q) ||
      (order.rackLocation && order.rackLocation.toLowerCase().includes(q));

    if (!matchSearch) return false;

    // Tab filter
    if (activeTab === 'all') return true;
    if (activeTab === 'in_progress') {
      return ['received', 'washing', 'drying', 'ironing', 'packing_qc'].includes(
        order.status
      );
    }
    if (activeTab === 'ready') {
      return order.status === 'ready';
    }
    if (activeTab === 'completed') {
      return order.status === 'completed';
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'received':
        return {
          label: 'Diterima di Kasir',
          className: 'bg-blue-50 text-blue-700 border-blue-200',
        };
      case 'washing':
        return {
          label: 'Sedang Dicuci',
          className: 'bg-sky-50 text-sky-700 border-sky-200',
        };
      case 'drying':
        return {
          label: 'Sedang Dikeringkan',
          className: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        };
      case 'ironing':
        return {
          label: 'Setrika & Lipat',
          className: 'bg-amber-50 text-amber-700 border-amber-200',
        };
      case 'packing_qc':
        return {
          label: 'Pengecekan Akhir',
          className: 'bg-purple-50 text-purple-700 border-purple-200',
        };
      case 'ready':
        return {
          label: 'Siap Ambil di Rak',
          className: 'bg-emerald-50 text-emerald-700 border-emerald-300 font-black',
        };
      case 'completed':
        return {
          label: 'Selesai Diambil',
          className: 'bg-slate-100 text-slate-700 border-slate-200',
        };
      default:
        return {
          label: status,
          className: 'bg-slate-50 text-slate-600 border-slate-200',
        };
    }
  };

  const inProgressCount = orders.filter((o) =>
    ['received', 'washing', 'drying', 'ironing', 'packing_qc'].includes(o.status)
  ).length;
  const readyCount = orders.filter((o) => o.status === 'ready').length;
  const completedCount = orders.filter((o) => o.status === 'completed').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 text-slate-900 pb-16 sm:pb-0">
      <CustomerAppNav />

      <main className="flex-1 py-6 sm:py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  Riwayat Pesanan Cucian
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800">
                  {orders.length} Pesanan
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Pantau progres pengerjaan pakaian, nomor rak siap ambil, dan foto bukti QC.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadData}
                className="p-2 text-slate-500 hover:text-sky-600 bg-white hover:bg-sky-50 border border-slate-200 rounded-xl shadow-sm transition"
                title="Muat Ulang Pesanan"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <Link
                href="/#tracking-bar"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition"
              >
                <Search className="w-3.5 h-3.5" />
                Lacak Resi Lain
              </Link>
            </div>
          </div>

          {/* Search & Tabs */}
          <div className="bg-white rounded-2xl p-4 border border-sky-100 shadow-sm space-y-3">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kode resi, nomor order, atau rak..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition"
              />
            </div>

            {/* Tab Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeTab === 'all'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semua ({orders.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('in_progress')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeTab === 'in_progress'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Sedang Diproses ({inProgressCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ready')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeTab === 'ready'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                Siap di Rak ({readyCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('completed')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeTab === 'completed'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Selesai ({completedCount})
              </button>
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-3xl p-10 border border-sky-100 text-center shadow-sm">
              <div className="relative w-20 h-20 mx-auto mb-4 rounded-2xl overflow-hidden border-2 border-sky-200 shadow-sm">
                <Image
                  src="/logo-sikucek.jpg"
                  alt="Maskot Si Kucek Kosong"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Tidak ada pesanan cucian
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                {searchQuery
                  ? 'Tidak ada pesanan yang sesuai dengan kata kunci pencarian Anda.'
                  : 'Belum ada cucian pada kategori ini. Yuk cuci pakaian kotor Anda di outlet SiKucek!'}
              </p>
              <Link
                href="/#layanan"
                className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-md shadow-sky-200 transition"
              >
                <Sparkles className="w-4 h-4" />
                Lihat Tarif Layanan
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const statusBadge = getStatusBadge(order.status);
                const isReady = order.status === 'ready';

                return (
                  <div
                    key={order.id}
                    className={`bg-white rounded-3xl p-5 sm:p-6 border transition shadow-sm hover:shadow-md ${
                      isReady
                        ? 'border-emerald-300 ring-2 ring-emerald-100'
                        : 'border-sky-100'
                    }`}
                  >
                    {/* Top Order Details */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-black text-sm sm:text-base text-slate-900">
                            {order.orderNumber}
                          </span>
                          <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200">
                            Resi: {order.trackingCode}
                          </span>
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusBadge.className}`}
                          >
                            {statusBadge.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Masuk kasir: {new Date(order.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>

                      {/* Ready in Rack High-Contrast Badge */}
                      {isReady && order.rackLocation && (
                        <div className="bg-emerald-500 text-white px-3.5 py-2 rounded-2xl flex items-center gap-2 shadow-sm shrink-0">
                          <MapPin className="w-4 h-4 text-emerald-200 animate-bounce" />
                          <div>
                            <span className="text-[10px] uppercase font-bold text-emerald-100 block leading-tight">
                              Lokasi Rak Ambil
                            </span>
                            <span className="text-sm font-black font-mono">
                              {order.rackLocation}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Middle Info (Items, Weight, Payment) */}
                    <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px] mb-0.5">
                          Rincian Cucian
                        </span>
                        <p className="font-semibold text-slate-800">
                          {order.kiloanWeightKg > 0 && `${formatKg(order.kiloanWeightKg)} Kiloan`}
                          {order.kiloanWeightKg > 0 && order.items.filter((i) => i.category === 'satuan').length > 0 && ' + '}
                          {order.items.filter((i) => i.category === 'satuan').length > 0 &&
                            `${order.items.filter((i) => i.category === 'satuan').reduce((acc, curr) => acc + curr.quantity, 0)} Helai Satuan`}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                          {order.items.map((i) => i.name).join(', ')}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[11px] mb-0.5">
                          Status Pembayaran
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                              order.paymentStatus === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {order.paymentStatus === 'paid' ? 'Lunas' : 'Belum Lunas'}
                          </span>
                          <span className="font-bold text-slate-700">
                            {formatRupiah(order.finalAmount)}
                          </span>
                        </div>
                        {order.discountAmount > 0 && (
                          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                            Hemat {formatRupiah(order.discountAmount)} (Kupon)
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[11px] mb-0.5">
                          Inspeksi QC &amp; Cacat
                        </span>
                        {order.qcPhotos && order.qcPhotos.length > 0 ? (
                          <div className="flex items-center gap-1.5 text-amber-700 font-semibold mt-0.5">
                            <Camera className="w-3.5 h-3.5 text-amber-600" />
                            <span>{order.qcPhotos.length} Foto Kondisi Awal</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 font-medium">
                            Kondisi pakaian normal
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                      <span className="text-[11px] text-slate-500 hidden sm:inline">
                        Estimasi selesai: {new Date(order.estimatedReadyAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>

                      <Link
                        href={`/track/${order.trackingCode}`}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 font-bold text-xs rounded-xl transition"
                      >
                        <QrCode className="w-3.5 h-3.5 text-sky-600" />
                        Lacak Detail &amp; Foto QC
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
