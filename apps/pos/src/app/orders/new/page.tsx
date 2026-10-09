'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Scale,
  Shirt,
  Camera,
  Trash2,
  CreditCard,
  Banknote,
  QrCode,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Plus,
  Minus,
} from 'lucide-react';
import {
  formatRupiah,
  formatKg,
  calculateHybridOrderTotals,
  QC_ISSUE_LABELS,
  BUSINESS_DEFAULTS,
  type PaymentChannel,
} from '@sikucek/shared';
import {
  INITIAL_SERVICES,
  createPosOrder,
  type PosOrderItem,
  type PosQcPhoto,
} from '../../../lib/orders-store';
import { CameraModal } from '../../../components/qc/CameraModal';

export default function NewOrderPage() {
  const router = useRouter();

  // Form State: Customer Info
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');

  // Kiloan Component
  const kiloanServices = useMemo(
    () => INITIAL_SERVICES.filter((s) => s.category === 'kiloan'),
    []
  );
  const [selectedKiloanServiceId, setSelectedKiloanServiceId] = useState(kiloanServices[0]?.id || '');
  const [kiloanWeight, setKiloanWeight] = useState<number>(0);

  // Satuan Component (Item counts)
  const satuanServices = useMemo(
    () => INITIAL_SERVICES.filter((s) => s.category === 'satuan'),
    []
  );
  const [satuanQuantities, setSatuanQuantities] = useState<Record<string, number>>({});

  // QC Photos
  const [qcPhotos, setQcPhotos] = useState<PosQcPhoto[]>([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Payment State
  const [paymentChannel, setPaymentChannel] = useState<PaymentChannel>('cash');
  const [paidImmediately, setPaidImmediately] = useState(true);
  const [cashReceived, setCashReceived] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // Validation & Submit State
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculations
  const selectedKiloanService = kiloanServices.find((s) => s.id === selectedKiloanServiceId);
  const kiloanUnitPrice = selectedKiloanService?.price_per_unit || 7000;
  const minWeight = selectedKiloanService?.min_weight_kg || BUSINESS_DEFAULTS.DEFAULT_MIN_WEIGHT_KG;

  // Calculate Satuan Subtotal
  const satuanSubtotal = useMemo(() => {
    return Object.entries(satuanQuantities).reduce((acc, [serviceId, qty]) => {
      const srv = satuanServices.find((s) => s.id === serviceId);
      return acc + (srv ? srv.price_per_unit * qty : 0);
    }, 0);
  }, [satuanQuantities, satuanServices]);

  const totals = useMemo(() => {
    return calculateHybridOrderTotals({
      kiloan_weight_kg: kiloanWeight > 0 ? kiloanWeight : 0,
      kiloan_unit_price: kiloanUnitPrice,
      min_weight_kg: minWeight,
      satuan_subtotal: satuanSubtotal,
      discount_amount: discountAmount,
    });
  }, [kiloanWeight, kiloanUnitPrice, minWeight, satuanSubtotal, discountAmount]);

  const cashChange = Math.max(0, cashReceived - totals.final_amount);

  // Quick Satuan Adjustment
  const handleUpdateSatuanQty = (serviceId: string, delta: number) => {
    setSatuanQuantities((prev) => {
      const current = prev[serviceId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[serviceId];
        return copy;
      }
      return { ...prev, [serviceId]: next };
    });
  };

  // Add QC Photo
  const handleCaptureQcPhoto = (photo: PosQcPhoto) => {
    setQcPhotos((prev) => [...prev, photo]);
  };

  const handleRemoveQcPhoto = (photoId: string) => {
    setQcPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  // Submit Order
  const handleSubmitOrder = () => {
    setErrorMessage(null);

    // Validation
    if (!customerPhone.trim() || customerPhone.trim().length < 9) {
      setErrorMessage('Nomor WhatsApp pelanggan wajib diisi dengan benar (minimal 9 digit).');
      return;
    }
    if (!customerName.trim() || customerName.trim().length < 2) {
      setErrorMessage('Nama pelanggan wajib diisi (minimal 2 karakter).');
      return;
    }

    const hasKiloan = kiloanWeight > 0;
    const hasSatuan = Object.values(satuanQuantities).some((qty) => qty > 0);

    if (!hasKiloan && !hasSatuan) {
      setErrorMessage('Pesanan harus memiliki minimal 1 item (timbangan kiloan atau cucian satuan).');
      return;
    }

    // Build order items
    const items: PosOrderItem[] = [];
    if (hasKiloan && selectedKiloanService) {
      items.push({
        service_id: selectedKiloanService.id,
        service_name: selectedKiloanService.name,
        category: 'kiloan',
        quantity: totals.kiloan_weight_kg,
        price_per_unit: selectedKiloanService.price_per_unit,
        subtotal: totals.kiloan_subtotal,
      });
    }

    Object.entries(satuanQuantities).forEach(([serviceId, qty]) => {
      if (qty > 0) {
        const srv = satuanServices.find((s) => s.id === serviceId);
        if (srv) {
          items.push({
            service_id: srv.id,
            service_name: srv.name,
            category: 'satuan',
            quantity: qty,
            price_per_unit: srv.price_per_unit,
            subtotal: srv.price_per_unit * qty,
          });
        }
      }
    });

    setIsSubmitting(true);
    try {
      const order = createPosOrder({
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        items,
        qc_photos: qcPhotos,
        payment_channel: paymentChannel,
        paid_immediately: paidImmediately,
        cash_received: paidImmediately && paymentChannel === 'cash' ? cashReceived : undefined,
        notes: notes.trim() || undefined,
        discount_amount: discountAmount,
      });

      // Redirect to detail / receipt
      router.push(`/orders/${order.id}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menyimpan pesanan.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl hover:bg-slate-100 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Antrean
        </button>
        <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
          Form Intake Hybrid Kasir
        </span>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-xs font-medium animate-fadeIn">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Inputs: Customer, Kiloan, Satuan, QC) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Data Pelanggan */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center text-xs">
                1
              </span>
              Data Pelanggan
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nomor WhatsApp <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="081234567890"
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nama Pelanggan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nama lengkap atau panggilan"
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Layanan Kiloan */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center text-xs">
                  2
                </span>
                Komponen Cucian Kiloan (Timbangan)
              </h2>
              <Scale className="w-4 h-4 text-sky-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {kiloanServices.map((service) => (
                <button
                  type="button"
                  key={service.id}
                  onClick={() => setSelectedKiloanServiceId(service.id)}
                  className={`p-3 rounded-2xl border text-left transition ${
                    selectedKiloanServiceId === service.id
                      ? 'border-sky-500 bg-sky-50/60 ring-2 ring-sky-200'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-900">{service.name}</p>
                  <p className="text-xs text-sky-600 font-extrabold mt-1">
                    {formatRupiah(service.price_per_unit)}
                    <span className="text-[10px] text-slate-500 font-normal"> /kg</span>
                  </p>
                </button>
              ))}
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block">
                  Input Berat Timbangan Riil (Kg):
                </label>
                <p className="text-[11px] text-slate-500">
                  Minimal tagihan: {formatKg(minWeight)} (Bab 10.1 PRD)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  value={kiloanWeight || ''}
                  onChange={(e) => setKiloanWeight(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="w-28 px-3 py-2 text-base font-mono font-bold text-right border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-400 focus:outline-none"
                />
                <span className="text-xs font-bold text-slate-700">Kg</span>
              </div>
            </div>

            {kiloanWeight > 0 && (
              <div className="p-3 bg-sky-50/70 border border-sky-100 rounded-xl text-xs flex justify-between items-center text-sky-800">
                <span>
                  Berat Ditagih: <strong>{formatKg(totals.kiloan_charged_weight_kg)}</strong>
                  {totals.kiloan_charged_weight_kg > kiloanWeight && (
                    <span className="text-[10px] text-amber-700 ml-1.5 font-medium">
                      (Disesuaikan ke berat minimal {formatKg(minWeight)})
                    </span>
                  )}
                </span>
                <span className="font-bold text-sm text-sky-900 font-mono">
                  {formatRupiah(totals.kiloan_subtotal)}
                </span>
              </div>
            )}
          </div>

          {/* Card 3: Layanan Satuan */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center text-xs">
                  3
                </span>
                Komponen Cucian Satuan (Per Helai / Pasang)
              </h2>
              <Shirt className="w-4 h-4 text-sky-500" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {satuanServices.map((service) => {
                const qty = satuanQuantities[service.id] || 0;
                return (
                  <div
                    key={service.id}
                    className={`p-3 rounded-2xl border transition flex flex-col justify-between ${
                      qty > 0
                        ? 'border-sky-500 bg-sky-50/40 ring-1 ring-sky-300'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 leading-tight">{service.name}</p>
                      <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                        {formatRupiah(service.price_per_unit)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleUpdateSatuanQty(service.id, -1)}
                        disabled={qty === 0}
                        className="w-7 h-7 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold font-mono text-slate-900">{qty}</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateSatuanQty(service.id, 1)}
                        className="w-7 h-7 rounded-lg bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 4: Quality Control (QC) Foto Cacat Awal */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center text-xs">
                    4
                  </span>
                  Modul Quality Control (QC Foto Anti-Sengketa)
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Potret baju yang robek, luntur, atau kancing copot sebelum masuk mesin cuci
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCameraOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-200 transition"
              >
                <Camera className="w-4 h-4" />
                Ambil Foto QC
              </button>
            </div>

            {qcPhotos.length === 0 ? (
              <div className="p-6 border border-dashed border-slate-200 rounded-2xl text-center bg-slate-50">
                <p className="text-xs text-slate-500">
                  Belum ada foto cacat yang dilampirkan. Jika ada pakaian bermasalah, tekan tombol di atas.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {qcPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm group"
                  >
                    <img
                      src={photo.photo_url}
                      alt={photo.issue_type}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="p-2 bg-white">
                      <span className="text-[10px] font-bold text-rose-600 block truncate">
                        {QC_ISSUE_LABELS[photo.issue_type]}
                      </span>
                      {photo.description && (
                        <p className="text-[10px] text-slate-500 truncate">{photo.description}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveQcPhoto(photo.id)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-rose-600/90 hover:bg-rose-700 text-white flex items-center justify-center transition shadow"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Catatan Khusus Cucian (Opsional):
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Pisahkan pakaian putih, gunakan deterjen hipoalergenik"
                rows={2}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live Hybrid Calculation & Payment Summary */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-lg sticky top-20 space-y-5">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Ringkasan Tagihan (Hybrid)
            </h3>

            {/* Subtotal Items */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Kiloan ({formatKg(totals.kiloan_charged_weight_kg)}):</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {formatRupiah(totals.kiloan_subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Satuan:</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {formatRupiah(totals.satuan_subtotal)}
                </span>
              </div>
              {totals.discount_amount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Potongan Kupon / Diskon:</span>
                  <span className="font-semibold font-mono">
                    -{formatRupiah(totals.discount_amount)}
                  </span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
                <span className="font-bold text-slate-900">Total Tagihan Bersih:</span>
                <span className="text-xl font-extrabold text-sky-600 font-mono">
                  {formatRupiah(totals.final_amount)}
                </span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 block">Metode Pembayaran:</label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentChannel('cash')}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-2 transition ${
                    paymentChannel === 'cash'
                      ? 'border-sky-500 bg-sky-50 text-sky-700 font-bold ring-2 ring-sky-200'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Banknote className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs">Tunai (Cash)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentChannel('midtrans_qris')}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-2 transition ${
                    paymentChannel === 'midtrans_qris'
                      ? 'border-sky-500 bg-sky-50 text-sky-700 font-bold ring-2 ring-sky-200'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <QrCode className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs">QRIS Kasir</span>
                </button>
              </div>

              {/* Cash Change Calculation */}
              {paymentChannel === 'cash' && (
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-slate-600 font-medium">Uang Diterima:</label>
                    <input
                      type="number"
                      step="1000"
                      value={cashReceived || ''}
                      onChange={(e) => setCashReceived(parseFloat(e.target.value) || 0)}
                      placeholder="Nominal tunai"
                      className="w-32 px-2.5 py-1.5 text-xs text-right font-mono font-bold border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600">Kembalian:</span>
                    <span
                      className={`font-mono font-bold ${
                        cashChange >= 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {formatRupiah(cashChange)}
                    </span>
                  </div>
                </div>
              )}

              {/* Status Lunas Toggle */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs">
                <span className="font-medium text-slate-700">Pelunasan Saat Ini:</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paidImmediately}
                    onChange={(e) => setPaidImmediately(e.target.checked)}
                    className="w-4 h-4 text-sky-500 rounded focus:ring-sky-400"
                  />
                  <span className="font-bold text-slate-900">
                    {paidImmediately ? 'Lunas Sekarang' : 'Bayar Saat Ambil'}
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="button"
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
              className="w-full py-3.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-sky-200 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-5 h-5" />
              {isSubmitting ? 'Memproses Pesanan...' : 'Simpan & Terbitkan Pesanan'}
            </button>
          </div>
        </div>
      </div>

      {/* QC Camera Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCaptureQcPhoto}
      />
    </div>
  );
}
