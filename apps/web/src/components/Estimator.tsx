'use client';

import React, { useState, useMemo } from 'react';
import {
  formatRupiah,
  formatKg,
  calculateHybridBilling,
} from '@sikucek/shared';
import { Calculator, Sparkles, Plus, Minus, Tag, CheckCircle2, ArrowRight } from 'lucide-react';

interface SatuanCounterItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  icon: string;
}

const INITIAL_SATUAN: SatuanCounterItem[] = [
  { id: 'sat-kemeja', name: 'Kemeja / Blouse', price: 5000, quantity: 0, icon: '👔' },
  { id: 'sat-celana', name: 'Celana Jeans / Panjang', price: 7000, quantity: 0, icon: '👖' },
  { id: 'sat-bedcover', name: 'Bed Cover King Size', price: 25000, quantity: 0, icon: '🛏️' },
  { id: 'sat-jas', name: 'Jas / Blazer Formal', price: 20000, quantity: 0, icon: '🧥' },
  { id: 'sat-sepatu', name: 'Sepatu Sneakers / Canvas', price: 25000, quantity: 0, icon: '👟' },
];

export default function Estimator() {
  const [weightKg, setWeightKg] = useState<number>(3.5);
  const [kiloanRate, setKiloanRate] = useState<number>(7000); // 7000 reguler, 10000 express, 15000 kilat
  const [kiloanServiceName, setKiloanServiceName] = useState<string>('Reguler (2 Hari)');
  const [satuanItems, setSatuanItems] = useState<SatuanCounterItem[]>(INITIAL_SATUAN);
  const [useFreeKiloanCoupon, setUseFreeKiloanCoupon] = useState<boolean>(false);

  const handleKiloanChange = (rate: number, name: string) => {
    setKiloanRate(rate);
    setKiloanServiceName(name);
  };

  const updateQuantity = (id: string, delta: number) => {
    setSatuanItems((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          const nextQty = Math.max(0, it.quantity + delta);
          return { ...it, quantity: nextQty };
        }
        return it;
      })
    );
  };

  const calculation = useMemo(() => {
    return calculateHybridBilling({
      kiloanItems:
        weightKg > 0
          ? [
              {
                weightKg,
                pricePerKg: kiloanRate,
                minWeightKg: 2.0, // Business default 2 kg
              },
            ]
          : [],
      satuanItems: satuanItems
        .filter((it) => it.quantity > 0)
        .map((it) => ({
          quantity: it.quantity,
          pricePerUnit: it.price,
        })),
      appliedCoupon: useFreeKiloanCoupon
        ? {
            type: 'free_kiloan',
            value: 5.0, // Max 5 kg
          }
        : null,
    });
  }, [weightKg, kiloanRate, satuanItems, useFreeKiloanCoupon]);

  const totalPcs = satuanItems.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div className="relative glass-panel rounded-3xl sm:rounded-4xl p-5 sm:p-9 border border-sky-100/90 shadow-2xl shadow-sky-500/10 overflow-hidden">
      {/* Decorative ambient bubble glows */}
      <div className="absolute -top-16 -right-16 w-52 h-52 bg-gradient-to-br from-sky-300/20 to-teal-300/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-gradient-to-tr from-coral-300/15 to-gold-300/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-5 border-b border-sky-100/80">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/30 shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-heading font-black text-slate-900 tracking-tight">
                Kalkulator Biaya Hybrid
              </h3>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-200">
                <Sparkles className="w-3 h-3 text-sky-600" />
                Live Simulasi
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-sans">
              Hitung estimasi transparan kiloan dan satuan sebelum datang ke outlet SiKucek
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto shadow-sm">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Min. Kiloan: 2.00 Kg
        </span>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-9">
        {/* Left Side: Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Pilihan Layanan Kiloan */}
          <div>
            <label className="block text-xs font-heading font-black text-slate-800 uppercase tracking-wider mb-2.5">
              1. Pilih Kecepatan Layanan Kiloan
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { name: 'Reguler (2 Hari)', rate: 7000, desc: 'Rp 7.000 / kg', badge: 'Hemat' },
                { name: 'Express (1 Hari)', rate: 10000, desc: 'Rp 10.000 / kg', badge: 'Populer' },
                { name: 'Kilat (6 Jam)', rate: 15000, desc: 'Rp 15.000 / kg', badge: 'Super Cepat' },
              ].map((opt) => {
                const isSelected = kiloanRate === opt.rate;
                return (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => handleKiloanChange(opt.rate, opt.name)}
                    className={`relative p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-sky-500 bg-gradient-to-br from-sky-50 to-teal-50/40 text-sky-950 shadow-md shadow-sky-500/15 ring-2 ring-sky-400/30'
                        : 'border-slate-200 bg-white/70 hover:bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full inline-block mb-1 ${
                        isSelected
                          ? 'bg-sky-500 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {opt.badge}
                    </span>
                    <p className="font-heading font-black text-xs leading-tight truncate text-slate-900">
                      {opt.name}
                    </p>
                    <p className="text-[11px] font-mono text-slate-500 font-semibold mt-1 truncate">
                      {opt.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Slider Berat Kiloan */}
          <div className="bg-gradient-to-br from-sky-50/80 to-teal-50/50 rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-sky-100/90 shadow-sm">
            <div className="flex justify-between items-center mb-2.5">
              <div>
                <span className="text-xs font-heading font-black text-slate-800 uppercase tracking-wider block">
                  Estimasi Berat Cucian:
                </span>
                <span className="text-[11px] text-slate-500">Geser slider untuk simulasi</span>
              </div>
              <div className="bg-white px-3 py-1.5 rounded-xl border border-sky-200 shadow-sm">
                <span className="text-xl sm:text-2xl font-black text-sky-600 font-mono tracking-tight">
                  {formatKg(weightKg)}
                </span>
              </div>
            </div>

            <div className="py-2">
              <input
                type="range"
                min="0"
                max="15"
                step="0.5"
                value={weightKg}
                onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                className="w-full accent-sky-500 h-2.5 bg-sky-200/80 rounded-lg cursor-pointer transition-all"
              />
            </div>

            <div className="flex justify-between text-[10px] sm:text-[11px] text-slate-500 font-mono font-medium">
              <span>0 Kg (Tanpa Kiloan)</span>
              <span className="font-bold text-sky-700">2 Kg (Min)</span>
              <span>5 Kg</span>
              <span>10 Kg</span>
              <span>15 Kg</span>
            </div>

            {weightKg > 0 && weightKg < 2.0 && (
              <p className="text-[11px] text-amber-900 font-medium mt-3 bg-amber-50 p-2.5 rounded-xl border border-amber-200/90 flex items-center gap-1.5">
                <span className="font-bold">* Info:</span> Berat di bawah 2.0 kg tetap dihitung batas minimum tarif (2.00 kg).
              </p>
            )}
          </div>

          {/* 3. Pilihan Item Satuan */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="block text-xs font-heading font-black text-slate-800 uppercase tracking-wider">
                2. Tambah Pakaian Satuan (Opsional)
              </label>
              {totalPcs > 0 && (
                <span className="text-[11px] font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                  {totalPcs} item terpilih
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {satuanItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    item.quantity > 0
                      ? 'border-sky-400 bg-sky-50/50 shadow-sm'
                      : 'border-slate-200/80 bg-white/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl p-1.5 rounded-xl bg-slate-100 shrink-0">
                      {item.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono font-medium">
                        {formatRupiah(item.price)}/pcs
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      disabled={item.quantity === 0}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center disabled:opacity-25 disabled:cursor-not-allowed transition active:scale-95 cursor-pointer"
                      title="Kurang 1"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-xs font-black font-mono text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-7 h-7 rounded-lg bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center transition active:scale-95 shadow-sm shadow-sky-500/25 cursor-pointer"
                      title="Tambah 1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Toggle Kupon Loyalti Simulasi */}
          <div className="bg-amber-50/90 rounded-2xl sm:rounded-3xl p-4 border border-amber-200/90 shadow-sm">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={useFreeKiloanCoupon}
                onChange={(e) => setUseFreeKiloanCoupon(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-amber-500 focus:ring-amber-400 accent-amber-500 cursor-pointer"
              />
              <div>
                <span className="text-xs font-heading font-black text-amber-950 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-600" />
                  Simulasi Kupon Stempel: Gratis Cuci Kiloan Maksimal 5 Kg
                </span>
                <p className="text-[11px] text-amber-800/90 mt-1 leading-relaxed font-sans">
                  Aturan Khusus: Kupon hadiah stempel <strong>hanya memotong porsi tagihan kiloan</strong>. Porsi pakaian satuan tetap ditagih normal tanpa potongan.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Right Side: Detailed Summary Card */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-2xl shadow-sky-950/30 flex flex-col justify-between flex-1 relative overflow-hidden border border-white/10">
            {/* Background glow orb */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-sky-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-teal-500/15 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-5">
                <span className="text-xs font-heading font-black uppercase tracking-wider text-sky-200">
                  Rincian Estimasi Biaya
                </span>
                <span className="text-[10px] bg-white/15 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-sky-300 border border-white/10">
                  Hybrid Billing
                </span>
              </div>

              {/* Rincian Item */}
              <div className="space-y-3.5 text-xs sm:text-sm font-sans">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">
                    Kiloan ({kiloanServiceName}):
                  </span>
                  <span className="font-semibold font-mono text-white">
                    {formatKg(calculation.chargedKiloanWeight)} = {formatRupiah(calculation.kiloanSubtotal)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-300">
                    Satuan ({totalPcs} pcs):
                  </span>
                  <span className="font-semibold font-mono text-white">
                    {formatRupiah(calculation.satuanSubtotal)}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2.5 border-t border-white/10 text-slate-300">
                  <span>Subtotal Kotor:</span>
                  <span className="font-mono text-slate-200">{formatRupiah(calculation.grossAmount)}</span>
                </div>

                {calculation.discountAmount > 0 && (
                  <div className="bg-amber-400/15 rounded-xl p-3 border border-amber-300/30 space-y-1">
                    <div className="flex justify-between items-center text-amber-300 font-bold">
                      <span>Potongan Kupon:</span>
                      <span className="font-mono">-{formatRupiah(calculation.discountAmount)}</span>
                    </div>
                    <p className="text-[10px] text-amber-200 font-normal leading-tight">
                      {calculation.discountExplanation}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Total Akhir */}
            <div className="relative z-10 mt-8 pt-5 border-t border-white/15">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-sky-300 font-medium uppercase tracking-wider">
                    Total Estimasi Bersih
                  </p>
                  <p className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white mt-1">
                    {formatRupiah(calculation.finalAmount)}
                  </p>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                  <Calculator className="w-5 h-5 text-amber-300" />
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mt-3.5 leading-snug">
                * Estimasi riil akan dihitung otomatis saat pakaian ditimbang dan dicatat kasir di outlet SiKucek.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

