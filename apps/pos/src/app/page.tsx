'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  PlusCircle,
  Search,
  Package,
  Scale,
  Banknote,
  ChevronRight,
  MapPin,
  Clock,
  Phone,
  ShieldAlert,
  Settings,
} from 'lucide-react';
import {
  formatRupiah,
  formatKg,
  ORDER_STATUS,
  type OrderStatus,
} from '@sikucek/shared';
import { getStoredOrders, type PosOrder } from '../lib/orders-store';

export default function PosDashboardPage() {
  const [orders, setOrders] = useState<PosOrder[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setOrders(getStoredOrders());
  }, []);

  // Compute Metrics
  const metrics = useMemo(() => {
    const todayOrders = orders;
    const totalOrders = todayOrders.length;
    const totalWeight = todayOrders.reduce((acc, o) => acc + o.kiloan_weight_kg, 0);
    const readyInRack = todayOrders.filter((o) => o.status === ORDER_STATUS.READY).length;
    const totalOmzet = todayOrders
      .filter((o) => o.payment_status === 'paid')
      .reduce((acc, o) => acc + o.final_amount, 0);

    return { totalOrders, totalWeight, readyInRack, totalOmzet };
  }, [orders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Tab filter
      if (activeTab === 'received' && order.status !== ORDER_STATUS.RECEIVED) return false;
      if (activeTab === 'washing' && order.status !== ORDER_STATUS.WASHING && order.status !== ORDER_STATUS.DRYING) return false;
      if (activeTab === 'ironing' && order.status !== ORDER_STATUS.IRONING) return false;
      if (activeTab === 'ready' && order.status !== ORDER_STATUS.READY) return false;
      if (activeTab === 'completed' && order.status !== ORDER_STATUS.COMPLETED) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = order.customer_name.toLowerCase().includes(query);
        const matchesPhone = order.customer_phone.includes(query);
        const matchesOrderNum = order.order_number.toLowerCase().includes(query);
        const matchesRack = order.rack_location?.toLowerCase().includes(query) || false;
        return matchesName || matchesPhone || matchesOrderNum || matchesRack;
      }

      return true;
    });
  }, [orders, activeTab, searchQuery]);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'received':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Diterima</span>;
      case 'washing':
      case 'drying':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">Cuci / Kering</span>;
      case 'ironing':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">Setrika Uap</span>;
      case 'packing_qc':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">Packing QC</span>;
      case 'ready':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Siap di Rak</span>;
      case 'completed':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">Selesai</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Top Banner Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Dasbor Antrean Kasir & Operator
          </h1>
          <p className="text-xs text-slate-500">
            Kelola penerimaan cucian, pemantauan mesin, dan alokasi rak fisik
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Link
            href="/admin/settings"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl border border-slate-200 transition"
          >
            <Settings className="w-4 h-4 text-slate-500" />
            Pengaturan (Vault)
          </Link>
          <Link
            href="/orders/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-2xl shadow-lg shadow-sky-200 transition"
          >
            <PlusCircle className="w-4 h-4" />
            + Terima Cucian Baru
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Order Hari Ini
            </span>
            <Package className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-mono">
            {metrics.totalOrders}
          </p>
          <p className="text-[10px] text-slate-500">Transaksi tercatat</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Berat Kiloan (Kg)
            </span>
            <Scale className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-mono">
            {formatKg(metrics.totalWeight)}
          </p>
          <p className="text-[10px] text-slate-500">Total cucian masuk</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Siap di Rak (Ready)
            </span>
            <MapPin className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-600 font-mono">
            {metrics.readyInRack}
          </p>
          <p className="text-[10px] text-slate-500">Menunggu diambil pelanggan</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Omzet Lunas (Rp)
            </span>
            <Banknote className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-mono">
            {formatRupiah(metrics.totalOmzet)}
          </p>
          <p className="text-[10px] text-slate-500">Kasir tunai & QRIS</p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Workflow Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'Semua Status' },
              { id: 'received', label: 'Diterima' },
              { id: 'washing', label: 'Cuci & Kering' },
              { id: 'ironing', label: 'Setrika Uap' },
              { id: 'ready', label: 'Siap di Rak' },
              { id: 'completed', label: 'Selesai' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'bg-sky-500 text-white shadow-sm shadow-sky-200'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari order, nama, rak..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Orders Table / Cards List */}
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Package className="w-10 h-10 mx-auto opacity-40 text-slate-400" />
            <p className="text-xs font-medium">Tidak ada cucian pada kategori ini</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block p-4 rounded-2xl border border-slate-200 hover:border-sky-300 hover:shadow-md transition bg-slate-50/50 hover:bg-white group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {order.order_number}
                      </span>
                      {getStatusBadge(order.status)}
                      {order.qc_photos.length > 0 && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                          <ShieldAlert className="w-3 h-3" />
                          {order.qc_photos.length} Foto QC
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">{order.customer_name}</span>
                      <span className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {order.customer_phone}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Tracking: {order.tracking_code}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500">
                      {order.items.map((i) => `${i.service_name} (${i.quantity} ${i.category === 'kiloan' ? 'kg' : 'pcs'})`).join(', ')}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="text-right">
                      <p className="font-extrabold text-sm text-slate-900 font-mono">
                        {formatRupiah(order.final_amount)}
                      </p>
                      <span
                        className={`text-[10px] font-bold uppercase ${
                          order.payment_status === 'paid' ? 'text-emerald-600' : 'text-amber-600'
                        }`}
                      >
                        {order.payment_status === 'paid' ? 'Lunas' : 'Belum Bayar'}
                      </span>
                    </div>

                    {order.rack_location ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-100 text-amber-900 text-[11px] font-bold rounded-lg">
                        <MapPin className="w-3 h-3 text-amber-600" />
                        {order.rack_location}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-400 text-xs group-hover:text-sky-500 transition font-semibold">
                        Proses <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
