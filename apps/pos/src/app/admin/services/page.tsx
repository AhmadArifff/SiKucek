'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Tag,
  PlusCircle,
  Scale,
  Shirt,
  Clock,
  CheckCircle2,
  AlertCircle,
  Power,
  Edit2,
  Trash2,
  Search,
  X,
  Sparkles,
} from 'lucide-react';
import { formatRupiah, formatKg } from '@sikucek/shared';
import {
  getStoredServices,
  saveStoredServices,
  PosServiceItem,
} from '../../../lib/services-store';

export default function AdminServicesPage() {
  const [services, setServices] = useState<PosServiceItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'kiloan' | 'satuan'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State for New Service
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'kiloan' | 'satuan'>('kiloan');
  const [unitName, setUnitName] = useState('kg');
  const [pricePerUnit, setPricePerUnit] = useState<number>(7000);
  const [minWeightKg, setMinWeightKg] = useState<number>(2.0);
  const [durationHours, setDurationHours] = useState<number>(48);
  const [description, setDescription] = useState('');

  useEffect(() => {
    setServices(getStoredServices());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleStatus = (id: string) => {
    const updated = services.map((s) =>
      s.id === id ? { ...s, is_active: !s.is_active } : s
    );
    setServices(updated);
    saveStoredServices(updated);
    showToast('Status keaktifan layanan diperbarui.');
  };

  const handleQuickPriceUpdate = (id: string, newPrice: number) => {
    if (isNaN(newPrice) || newPrice < 0) return;
    const updated = services.map((s) =>
      s.id === id ? { ...s, price_per_unit: newPrice } : s
    );
    setServices(updated);
    saveStoredServices(updated);
    showToast('Tarif harga layanan berhasil diubah.');
  };

  const handleDeleteService = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus layanan ini dari katalog?')) {
      const updated = services.filter((s) => s.id !== id);
      setServices(updated);
      saveStoredServices(updated);
      showToast('Layanan berhasil dihapus.');
    }
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newService: PosServiceItem = {
      id: `srv-${category}-${Date.now().toString(36)}`,
      name: name.trim(),
      category,
      unit_name: category === 'kiloan' ? 'kg' : unitName.trim() || 'pcs',
      price_per_unit: pricePerUnit,
      min_weight_kg: category === 'kiloan' ? minWeightKg : undefined,
      estimated_duration_hours: durationHours,
      is_active: true,
      description: description.trim() || undefined,
    };

    const updated = [newService, ...services];
    setServices(updated);
    saveStoredServices(updated);

    // Reset Form
    setName('');
    setDescription('');
    setIsModalOpen(false);
    showToast(`Layanan "${newService.name}" berhasil ditambahkan ke katalog.`);
  };

  const filteredServices = services.filter((s) => {
    if (activeTab === 'kiloan' && s.category !== 'kiloan') return false;
    if (activeTab === 'satuan' && s.category !== 'satuan') return false;
    if (searchQuery.trim()) {
      return s.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const kiloanCount = services.filter((s) => s.category === 'kiloan').length;
  const satuanCount = services.filter((s) => s.category === 'satuan').length;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Master Katalog Layanan &amp; Tarif
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">
              Khusus Owner
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Kelola harga cuci kiloan, pakaian satuan, durasi kerja, dan aturan berat minimal
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-2xl shadow-lg shadow-sky-200 transition active:scale-95 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          + Tambah Layanan Baru
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Total Layanan Terdaftar
          </span>
          <p className="text-2xl font-black font-mono text-slate-900">{services.length}</p>
          <p className="text-[10px] text-slate-600">Katalog aktif &amp; arsip</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Layanan Cuci Kiloan
            </span>
            <Scale className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-2xl font-black font-mono text-sky-600">{kiloanCount}</p>
          <p className="text-[10px] text-slate-600">Reguler, Express, Kilat</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Layanan Pakaian Satuan
            </span>
            <Shirt className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black font-mono text-amber-600">{satuanCount}</p>
          <p className="text-[10px] text-slate-600">Jas, Bedcover, Sepatu, Boneka</p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua ({services.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('kiloan')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'kiloan'
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              Cuci Kiloan ({kiloanCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('satuan')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'satuan'
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Shirt className="w-3.5 h-3.5" />
              Pakaian Satuan ({satuanCount})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama layanan..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
        </div>

        {/* Services Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-3 px-3">Nama Layanan</th>
                <th className="py-3 px-3">Kategori</th>
                <th className="py-3 px-3">Tarif Harga (Rp)</th>
                <th className="py-3 px-3 text-center">Durasi Kerja</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredServices.map((srv) => (
                <tr key={srv.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3">
                    <p className="font-bold text-slate-800">{srv.name}</p>
                    {srv.min_weight_kg && (
                      <span className="text-[10px] text-slate-600">
                        Min. berat: {formatKg(srv.min_weight_kg)}
                      </span>
                    )}
                    {srv.description && (
                      <p className="text-[10px] text-slate-600">{srv.description}</p>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        srv.category === 'kiloan'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {srv.category === 'kiloan' ? 'Kiloan' : 'Satuan'}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">
                    <div className="flex items-center gap-1.5">
                      <span>{formatRupiah(srv.price_per_unit)}</span>
                      <span className="text-[10px] text-slate-600 font-normal">
                        / {srv.unit_name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-slate-600">
                    <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {srv.estimated_duration_hours} Jam
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(srv.id)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition ${
                        srv.is_active
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      {srv.is_active ? 'Aktif' : 'Nonaktif'}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          const p = prompt(
                            `Ubah tarif untuk "${srv.name}" (Rp per ${srv.unit_name}):`,
                            srv.price_per_unit.toString()
                          );
                          if (p) handleQuickPriceUpdate(srv.id, parseInt(p, 10));
                        }}
                        title="Ubah Tarif"
                        className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteService(srv.id)}
                        title="Hapus Layanan"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Layanan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Tag className="w-5 h-5 text-sky-500" />
                Tambah Layanan Baru
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Layanan
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Cuci Karpet Tebal / Cuci Boneka Jumbo"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={category}
                    onChange={(e) => {
                      const cat = e.target.value as 'kiloan' | 'satuan';
                      setCategory(cat);
                      if (cat === 'kiloan') setUnitName('kg');
                      else setUnitName('pcs');
                    }}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400"
                  >
                    <option value="kiloan">Cuci Kiloan</option>
                    <option value="satuan">Pakaian Satuan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Satuan Unit
                  </label>
                  <input
                    type="text"
                    required
                    value={unitName}
                    onChange={(e) => setUnitName(e.target.value)}
                    placeholder="kg / pcs / pasang"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tarif Harga (Rp per unit)
                  </label>
                  <input
                    type="number"
                    step="500"
                    required
                    value={pricePerUnit}
                    onChange={(e) => setPricePerUnit(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Durasi Pengerjaan (Jam)
                  </label>
                  <input
                    type="number"
                    required
                    value={durationHours}
                    onChange={(e) => setDurationHours(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
              </div>

              {category === 'kiloan' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Minimum Berat Kiloan (Kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={minWeightKg}
                    onChange={(e) => setMinWeightKg(parseFloat(e.target.value) || 1)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Keterangan / Catatan Tambahan (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Instruksi khusus perlakuan kain..."
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
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl shadow-md transition"
                >
                  Simpan Layanan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
