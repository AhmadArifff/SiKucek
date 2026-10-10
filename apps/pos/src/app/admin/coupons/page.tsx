'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Tag,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Calendar,
  Sparkles,
  Info,
  Power,
  Trash2,
  X,
} from 'lucide-react';
import { formatRupiah } from '@sikucek/shared';
import {
  getStoredCoupons,
  saveStoredCoupons,
  INITIAL_COUPONS,
} from '../../../lib/marketing-store';
import { Coupon, DiscountType } from '@sikucek/shared';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State for New Coupon
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<DiscountType>('fixed_amount');
  const [discountValue, setDiscountValue] = useState<number>(10000);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState<number | undefined>(undefined);
  const [minOrderAmount, setMinOrderAmount] = useState<number | undefined>(30000);
  const [validUntil, setValidUntil] = useState('2026-12-31');

  useEffect(() => {
    setCoupons(getStoredCoupons());
  }, []);

  const handleCopy = (couponCode: string) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(couponCode);
      setCopiedCode(couponCode);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const handleToggleStatus = (id: string) => {
    const updated = coupons.map((c) =>
      c.id === id ? { ...c, is_active: !c.is_active } : c
    );
    setCoupons(updated);
    saveStoredCoupons(updated);
    setToastMessage('Status keaktifan kupon berhasil diperbarui!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDelete = (id: string) => {
    if (confirm('Yakin ingin menghapus kupon ini dari master promo?')) {
      const updated = coupons.filter((c) => c.id !== id);
      setCoupons(updated);
      saveStoredCoupons(updated);
      setToastMessage('Kupon berhasil dihapus.');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !title.trim()) {
      alert('Kode kupon dan judul wajib diisi');
      return;
    }

    const newCoupon: Coupon = {
      id: `cp-${Date.now()}`,
      code: code.trim().toUpperCase(),
      title: title.trim(),
      description: description.trim() || 'Kupon promosi laundry SiKucek.',
      discount_type: discountType,
      discount_value: discountValue,
      max_discount_amount: maxDiscountAmount || null,
      min_order_amount: minOrderAmount || null,
      is_active: true,
      valid_from: new Date().toISOString().split('T')[0],
      valid_until: validUntil,
    };

    const updated = [newCoupon, ...coupons];
    setCoupons(updated);
    saveStoredCoupons(updated);

    // Reset Form
    setCode('');
    setTitle('');
    setDescription('');
    setDiscountValue(10000);
    setIsModalOpen(false);
    setToastMessage(`Kupon ${newCoupon.code} berhasil ditambahkan!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredCoupons = coupons.filter((c) => {
    if (filterStatus === 'active') return c.is_active;
    if (filterStatus === 'inactive') return !c.is_active;
    return true;
  });

  const activeCount = coupons.filter((c) => c.is_active).length;
  const freeKiloanCount = coupons.filter((c) => c.discount_type === 'free_kiloan').length;

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Master Kupon &amp; Promosi
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">
              Bab 10.4 &amp; 12
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500">
            Kelola kupon stempel gratis kiloan, voucher nominal, dan kode promo kampanye marketing
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl sm:rounded-2xl shadow-md shadow-sky-200 transition active:scale-95 w-full sm:w-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Buat Kupon Baru</span>
        </button>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 shadow-sm flex items-center gap-2 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate block">
            Total Kupon Terdaftar
          </span>
          <p className="text-lg sm:text-2xl font-black font-mono text-slate-900">{coupons.length}</p>
          <p className="text-[9px] sm:text-[10px] text-slate-500">Master voucher promo</p>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate block">
            Kupon Status Aktif
          </span>
          <p className="text-lg sm:text-2xl font-black font-mono text-emerald-600">{activeCount}</p>
          <p className="text-[9px] sm:text-[10px] text-slate-500">Dapat digunakan saat intake kasir</p>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate block">
            Kupon Hadiah Kiloan (Stamp)
          </span>
          <p className="text-lg sm:text-2xl font-black font-mono text-amber-600">{freeKiloanCount}</p>
          <p className="text-[9px] sm:text-[10px] text-slate-500">Aturan diskon khusus porsi kiloan</p>
        </div>
      </div>

      {/* Strict Rule Callout */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <p className="font-bold mb-0.5">Strict Rule Diskon Parsial (Bab 10.4):</p>
          <p>
            Kupon dengan tipe <strong>free_kiloan</strong> (misal kupon gratis 5 kg dari stamp card) <strong>hanya memotong tagihan porsi kiloan</strong>. Jika pesanan pelanggan adalah paket hybrid yang berisi pakaian satuan (bed cover, jas, sepatu), komponen satuan tersebut tetap ditagihkan penuh tanpa potongan.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: `Semua (${coupons.length})` },
            { id: 'active', label: `Aktif (${activeCount})` },
            { id: 'inactive', label: `Non-Aktif (${coupons.length - activeCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                filterStatus === tab.id
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Coupons List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCoupons.map((coupon) => {
          const isKiloan = coupon.discount_type === 'free_kiloan';

          return (
            <div
              key={coupon.id}
              className={`rounded-3xl p-5 border-2 transition flex flex-col justify-between ${
                coupon.is_active
                  ? isKiloan
                    ? 'border-amber-300 bg-gradient-to-br from-amber-50/60 to-white shadow-sm'
                    : 'border-slate-200 bg-white shadow-sm hover:border-sky-300'
                  : 'border-slate-200 bg-slate-50/60 opacity-60'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-xl">
                    <span className="font-mono font-black text-xs text-slate-900 tracking-wider">
                      {coupon.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(coupon.code)}
                      className="text-slate-400 hover:text-sky-600 transition"
                      title="Salin Kode Kupon"
                    >
                      {copiedCode === coupon.code ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      coupon.is_active
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {coupon.is_active ? 'Aktif' : 'Non-Aktif'}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {coupon.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {coupon.description}
                  </p>
                </div>

                {/* Discount Badge */}
                <div className="pt-1">
                  <span
                    className={`inline-block text-xs font-black px-3 py-1 rounded-xl ${
                      isKiloan
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : coupon.discount_type === 'percentage'
                        ? 'bg-sky-100 text-sky-900 border border-sky-300'
                        : 'bg-teal-100 text-teal-900 border border-teal-300'
                    }`}
                  >
                    {isKiloan
                      ? `Gratis Cuci Kiloan ${coupon.discount_value} Kg`
                      : coupon.discount_type === 'percentage'
                      ? `Diskon ${coupon.discount_value}%`
                      : `Potongan ${formatRupiah(coupon.discount_value)}`}
                  </span>
                </div>

                {/* Min Order & Expiry */}
                <div className="text-[11px] text-slate-500 space-y-1 pt-1">
                  {coupon.min_order_amount && (
                    <p>Min. Order: {formatRupiah(coupon.min_order_amount)}</p>
                  )}
                  <p className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    Berlaku s/d: {coupon.valid_until}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(coupon.id)}
                  className={`text-xs font-bold flex items-center gap-1.5 transition ${
                    coupon.is_active
                      ? 'text-amber-700 hover:text-amber-900'
                      : 'text-emerald-700 hover:text-emerald-900'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  {coupon.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(coupon.id)}
                  className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Hapus
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Buat Kupon Baru */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-sky-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center">
                  <Tag className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">
                  Buat Kupon Promosi Baru
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Kode Kupon (Alfanumerik Kapital):
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Contoh: JUMATBERKAH"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-sky-500 uppercase"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Judul Kupon:
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Diskon Jumat Berkah Rp 10.000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Deskripsi Singkat:
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Contoh: Khusus cuci hari Jumat minimal 3 kg"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Jenis Diskon:
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    <option value="fixed_amount">Potongan Nominal (Rp)</option>
                    <option value="free_kiloan">Gratis Cuci Kiloan (Kg)</option>
                    <option value="percentage">Persentase (%)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nilai Diskon:
                  </label>
                  <input
                    type="number"
                    step={discountType === 'free_kiloan' ? '0.5' : '1000'}
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Min. Order (Rp):
                  </label>
                  <input
                    type="number"
                    value={minOrderAmount || ''}
                    onChange={(e) => setMinOrderAmount(parseFloat(e.target.value) || undefined)}
                    placeholder="Kosongkan jika tidak ada"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Berlaku Sampai:
                  </label>
                  <input
                    type="date"
                    required
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold shadow-md shadow-sky-200 transition active:scale-95"
                >
                  Simpan Kupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
