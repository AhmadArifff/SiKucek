'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  MapPin,
  PlusCircle,
  PackageCheck,
  Package,
  Layers,
  Search,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  X,
  ExternalLink,
  Shirt,
} from 'lucide-react';
import { formatRupiah, formatKg, ORDER_STATUS } from '@sikucek/shared';
import {
  getStoredRacks,
  saveStoredRacks,
  PhysicalRackItem,
  INITIAL_RACKS,
} from '../../../lib/racks-store';
import { getStoredOrders, PosOrder } from '../../../lib/orders-store';

export default function AdminRacksPage() {
  const [racks, setRacks] = useState<PhysicalRackItem[]>([]);
  const [orders, setOrders] = useState<PosOrder[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'shelf' | 'hanger' | 'shoe_rack'>('all');
  const [filterOccupancy, setFilterOccupancy] = useState<'all' | 'occupied' | 'empty'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [type, setType] = useState<'shelf' | 'hanger' | 'shoe_rack'>('shelf');
  const [capacityOrders, setCapacityOrders] = useState<number>(1);
  const [description, setDescription] = useState('');

  useEffect(() => {
    setRacks(getStoredRacks());
    setOrders(getStoredOrders());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Map which orders are occupying which rack
  const rackOccupancyMap = useMemo(() => {
    const map = new Map<string, PosOrder[]>();
    const readyOrders = orders.filter((o) => o.status === ORDER_STATUS.READY && o.rack_location);

    for (const ord of readyOrders) {
      if (ord.rack_location) {
        const cleanRack = ord.rack_location.toUpperCase();
        const existing = map.get(cleanRack) || [];
        existing.push(ord);
        map.set(cleanRack, existing);
      }
    }
    return map;
  }, [orders]);

  const handleCreateRack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const cleanCode = code.trim().toUpperCase();
    if (racks.some((r) => r.code === cleanCode)) {
      alert(`Kode rak "${cleanCode}" sudah terdaftar.`);
      return;
    }

    const newRack: PhysicalRackItem = {
      id: `rack-${Date.now().toString(36)}`,
      code: cleanCode,
      type,
      capacity_orders: capacityOrders,
      description: description.trim() || undefined,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    const updated = [...racks, newRack];
    setRacks(updated);
    saveStoredRacks(updated);

    setCode('');
    setDescription('');
    setIsModalOpen(false);
    showToast(`Rak "${newRack.code}" berhasil ditambahkan.`);
  };

  const handleDeleteRack = (id: string, rackCode: string) => {
    const occupying = rackOccupancyMap.get(rackCode) || [];
    if (occupying.length > 0) {
      alert(`Rak ${rackCode} tidak bisa dihapus karena masih memuat cucian siap ambil milik ${occupying[0].customer_name}.`);
      return;
    }

    if (confirm(`Hapus rak "${rackCode}" dari outlet?`)) {
      const updated = racks.filter((r) => r.id !== id);
      setRacks(updated);
      saveStoredRacks(updated);
      showToast(`Rak "${rackCode}" berhasil dihapus.`);
    }
  };

  const filteredRacks = racks.filter((r) => {
    if (filterType !== 'all' && r.type !== filterType) return false;
    const occupyingOrders = rackOccupancyMap.get(r.code) || [];
    const isOccupied = occupyingOrders.length > 0;

    if (filterOccupancy === 'occupied' && !isOccupied) return false;
    if (filterOccupancy === 'empty' && isOccupied) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCode = r.code.toLowerCase().includes(q);
      const matchCust = occupyingOrders.some(
        (o) => o.customer_name.toLowerCase().includes(q) || o.tracking_code.toLowerCase().includes(q)
      );
      return matchCode || matchCust;
    }

    return true;
  });

  const totalRacks = racks.length;
  const occupiedCount = racks.filter((r) => (rackOccupancyMap.get(r.code) || []).length > 0).length;
  const emptyCount = totalRacks - occupiedCount;
  const occupancyPercentage = totalRacks > 0 ? Math.round((occupiedCount / totalRacks) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Master Rak Fisik &amp; Manajemen Penyimpanan
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              Bab 10.5 PRD
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Tata letak nomor rak outlet untuk penempatan pakaian siap ambil (Ready to Pick Up)
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-2xl shadow-lg shadow-sky-200 transition active:scale-95 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          + Tambah Rak Baru
        </button>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl p-4 shadow-sm flex items-center gap-2 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Total Rak Outlet
          </span>
          <p className="text-2xl font-black font-mono text-slate-900">{totalRacks}</p>
          <p className="text-[10px] text-slate-600">Kapasitas penyimpanan</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Rak Terisi (Ready)
            </span>
            <PackageCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black font-mono text-emerald-600">{occupiedCount}</p>
          <p className="text-[10px] text-slate-600">Menunggu diambil pelanggan</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Rak Kosong (Tersedia)
            </span>
            <Package className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-2xl font-black font-mono text-sky-600">{emptyCount}</p>
          <p className="text-[10px] text-slate-600">Siap dialokasikan</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-4 rounded-3xl shadow-lg shadow-emerald-200 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">
            Tingkat Keterisian Rak
          </span>
          <p className="text-2xl font-black font-mono">{occupancyPercentage}%</p>
          <p className="text-[10px] text-emerald-100">Efisiensi ruang outlet</p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setFilterOccupancy('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                filterOccupancy === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua Rak ({totalRacks})
            </button>
            <button
              type="button"
              onClick={() => setFilterOccupancy('occupied')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                filterOccupancy === 'occupied'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <PackageCheck className="w-3.5 h-3.5" />
              Terisi ({occupiedCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterOccupancy('empty')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                filterOccupancy === 'empty'
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              Kosong ({emptyCount})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nomor rak / nama..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
        </div>

        {/* Visual Rack Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {filteredRacks.map((rack) => {
            const occupyingOrders = rackOccupancyMap.get(rack.code) || [];
            const isOccupied = occupyingOrders.length > 0;

            return (
              <div
                key={rack.id}
                className={`rounded-3xl p-5 border transition flex flex-col justify-between ${
                  isOccupied
                    ? 'border-emerald-300 bg-emerald-50/50 shadow-md shadow-emerald-100'
                    : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-sky-300 shadow-sm'
                }`}
              >
                <div>
                  {/* Top Badge & Code */}
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black font-mono tracking-wider text-slate-900 flex items-center gap-1.5">
                      <MapPin
                        className={`w-4 h-4 ${isOccupied ? 'text-emerald-600' : 'text-slate-400'}`}
                      />
                      {rack.code}
                    </span>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isOccupied
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isOccupied ? 'Terisi (Ready)' : 'Kosong'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-1">
                    {rack.description || `Tipe: ${rack.type === 'hanger' ? 'Gantungan Hanger' : 'Rak Lipat'}`}
                  </p>

                  {/* Occupancy Detail */}
                  {isOccupied ? (
                    <div className="mt-4 pt-3 border-t border-emerald-200/80 space-y-2">
                      {occupyingOrders.map((ord) => (
                        <div
                          key={ord.id}
                          className="bg-white p-3 rounded-2xl border border-emerald-200 space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-xs text-slate-900 truncate">
                              {ord.customer_name}
                            </p>
                            <Link
                              href={`/orders/${ord.id}`}
                              className="text-[10px] font-bold text-sky-600 hover:underline flex items-center gap-0.5"
                            >
                              <span>Lihat</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-600 font-mono">
                            <span>Resi: {ord.tracking_code}</span>
                            <span className="font-bold text-emerald-700">
                              {formatKg(ord.kiloan_weight_kg)}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 pt-0.5">
                            Status: <strong className="text-emerald-700">Siap Diambil</strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-6 py-4 text-center border border-dashed border-slate-300 rounded-2xl text-slate-400 text-xs">
                      <p className="font-semibold">Siap Dialokasikan</p>
                      <p className="text-[10px]">Tersedia untuk cucian yang selesai disetrika</p>
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-600">
                    Kapasitas: {rack.capacity_orders} kantong
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDeleteRack(rack.id, rack.code)}
                    disabled={isOccupied}
                    title={isOccupied ? 'Tidak bisa dihapus saat terisi' : 'Hapus rak'}
                    className={`p-1.5 rounded-lg transition ${
                      isOccupied
                        ? 'text-slate-300 cursor-not-allowed'
                        : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Tambah Rak */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-500" />
                Tambah Nomor Rak Fisik
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRack} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kode / Nomor Rak Fisik
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Contoh: RAK-A3 / GANTUNG-02"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tipe Rak
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400"
                  >
                    <option value="shelf">Rak Susun Lipat</option>
                    <option value="hanger">Gantungan Hanger</option>
                    <option value="shoe_rack">Rak Khusus Sepatu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kapasitas Kantong
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={capacityOrders}
                    onChange={(e) => setCapacityOrders(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Keterangan Lokasi Fisik di Outlet
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Posisi rak di outlet (misal: tingkat 3 dekat meja kasir)..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition"
                >
                  Simpan Rak
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
