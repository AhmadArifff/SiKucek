'use client';

import React, { useState, useMemo } from 'react';
import {
  formatRupiah,
  formatKg,
  calculateHybridBilling,
} from '@sikucek/shared';
import { Calculator, Sparkles, Plus, Minus, Tag, CheckCircle2 } from 'lucide-react';

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

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xl shadow-sky-100/60">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-sky-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-200">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              Kalkulator Biaya Hybrid
            </h3>
            <p className="text-xs text-slate-500">
              Simulasi biaya transparan kiloan + satuan sebelum datang ke outlet
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Min. Cuci Kiloan 2.00 Kg
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Pilihan Layanan Kiloan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              1. Pilih Jenis Layanan Kiloan
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { name: 'Reguler (2 Hari)', rate: 7000, desc: 'Rp 7.000 / kg' },
                { name: 'Express (1 Hari)', rate: 10000, desc: 'Rp 10.000 / kg' },
                { name: 'Kilat (6 Jam)', rate: 15000, desc: 'Rp 15.000 / kg' },
              ].map((opt) => (
                <button
                  key={opt.name}
                  type="button"
                  onClick={() => handleKiloanChange(opt.rate, opt.name)}
                  className={`p-3 rounded-2xl text-left border text-xs sm:text-sm font-semibold transition ${
                    kiloanRate === opt.rate
                      ? 'border-sky-500 bg-sky-50/80 text-sky-800 ring-2 ring-sky-400/20'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60 text-slate-600'
                  }`}
                >
                  <p className="font-bold leading-tight">{opt.name}</p>
                  <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                    {opt.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Slider Berat Kiloan */}
          <div className="bg-sky-50/60 rounded-2xl p-4 sm:p-5 border border-sky-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-slate-700">
                Estimasi Berat Cucian:
              </span>
              <span className="text-xl font-extrabold text-sky-600 font-mono">
                {formatKg(weightKg)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="0.5"
              value={weightKg}
              onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
              className="w-full accent-sky-500 h-2 bg-sky-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-600 font-medium mt-1">
              <span>0 Kg (Tanpa Kiloan)</span>
              <span>2 Kg (Min)</span>
              <span>5 Kg</span>
              <span>10 Kg</span>
              <span>15 Kg</span>
            </div>
            {weightKg > 0 && weightKg < 2.0 && (
              <p className="text-[11px] text-amber-700 font-medium mt-2 bg-amber-50 p-2 rounded-lg border border-amber-200">
                * Berat di bawah 2.0 kg tetap dihitung batas minimum tarif (2.00 kg).
              </p>
            )}
          </div>

          {/* Pilihan Item Satuan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              2. Tambah Pakaian Satuan (Opsional)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {satuanItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:border-sky-300 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{item.name}</p>
                      <p className="text-[11px] text-slate-600">{formatRupiah(item.price)}/pcs</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      disabled={item.quantity === 0}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-5 text-center text-xs font-bold font-mono text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-7 h-7 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-700 flex items-center justify-center transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Toggle Kupon Loyalti Simulasi */}
          <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={useFreeKiloanCoupon}
                onChange={(e) => setUseFreeKiloanCoupon(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-amber-500 focus:ring-amber-400 accent-amber-500"
              />
              <div>
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-600" />
                  Simulasi Kupon Stempel: Gratis Cuci Kiloan Maksimal 5 Kg
                </span>
                <p className="text-[11px] text-amber-700 mt-0.5 leading-relaxed">
                  Aturan Khusus: Kupon hadiah stempel <strong>hanya memotong porsi tagihan kiloan</strong>. Porsi pakaian satuan tetap ditagih normal tanpa potongan.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Right Side: Detailed Summary Card */}
        <div className="lg:col-span-5">
          <div className="bg-gradient-to-br from-sky-600 to-sky-700 text-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-sky-600/25 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between border-b border-white/20 pb-4 mb-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-100">
                  Ringkasan Estimasi
                </span>
                <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-medium text-white">
                  Hybrid Billing
                </span>
              </div>

              {/* Rincian Item */}
              <div className="space-y-3.5 text-xs sm:text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-sky-100">
                    Kiloan ({kiloanServiceName}):
                  </span>
                  <span className="font-semibold font-mono">
                    {formatKg(calculation.chargedKiloanWeight)} = {formatRupiah(calculation.kiloanSubtotal)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sky-100">
                    Satuan ({satuanItems.reduce((acc, it) => acc + it.quantity, 0)} pcs):
                  </span>
                  <span className="font-semibold font-mono">
                    {formatRupiah(calculation.satuanSubtotal)}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-white/10 text-sky-200">
                  <span>Subtotal Kotor:</span>
                  <span className="font-mono">{formatRupiah(calculation.grossAmount)}</span>
                </div>

                {calculation.discountAmount > 0 && (
                  <div className="bg-amber-400/20 rounded-xl p-2.5 border border-amber-300/30">
                    <div className="flex justify-between items-center text-amber-200 font-bold">
                      <span>Potongan Kupon:</span>
                      <span className="font-mono">-{formatRupiah(calculation.discountAmount)}</span>
                    </div>
                    <p className="text-[10px] text-amber-100 mt-1 font-normal leading-tight">
                      {calculation.discountExplanation}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Total Akhir */}
            <div className="mt-8 pt-5 border-t border-white/20">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-sky-200 font-medium">
                    Total Estimasi Bersih
                  </p>
                  <p className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white mt-1">
                    {formatRupiah(calculation.finalAmount)}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
              </div>

              <p className="text-[11px] text-sky-100 mt-3 leading-snug">
                * Estimasi riil akan dihitung otomatis saat pakaian ditimbang dan dicatat kasir di outlet SiKucek.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
