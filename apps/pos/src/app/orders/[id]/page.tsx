'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Printer,
  ChevronRight,
  MapPin,
  Clock,
  Phone,
  User,
  ShieldAlert,
  CheckCircle,
  X,
  ExternalLink,
  QrCode,
} from 'lucide-react';
import {
  formatRupiah,
  formatKg,
  ORDER_STATUS,
  QC_ISSUE_LABELS,
  type OrderStatus,
} from '@sikucek/shared';
import {
  getStoredOrders,
  updatePosOrderStatus,
  updatePosOrderPayment,
  type PosOrder,
  type PosQcPhoto,
} from '../../../lib/orders-store';
import { RackModal } from '../../../components/orders/RackModal';
import { QrisPaymentModal } from '../../../components/payment/QrisPaymentModal';

const STATUS_PIPELINE: { status: OrderStatus; label: string }[] = [
  { status: 'received', label: 'Diterima' },
  { status: 'washing', label: 'Pencucian' },
  { status: 'drying', label: 'Pengeringan' },
  { status: 'ironing', label: 'Setrika Uap' },
  { status: 'packing_qc', label: 'Packing & QC' },
  { status: 'ready', label: 'Siap di Rak' },
  { status: 'completed', label: 'Selesai Diambil' },
];

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<PosOrder | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<PosQcPhoto | null>(null);
  const [isRackModalOpen, setIsRackModalOpen] = useState(false);
  const [isQrisModalOpen, setIsQrisModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConfirmQrisPayment = () => {
    if (!order) return;
    const res = updatePosOrderPayment(order.id, 'midtrans_qris', 'paid');
    if (res.success && res.order) {
      setOrder(res.order);
      setIsQrisModalOpen(false);
    }
  };

  useEffect(() => {
    const orders = getStoredOrders();
    const found = orders.find((o) => o.id === orderId);
    if (found) {
      setOrder(found);
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center space-y-4">
        <p className="text-sm text-slate-500">Memuat data pesanan...</p>
        <button
          onClick={() => router.push('/')}
          className="text-xs text-sky-600 font-bold hover:underline"
        >
          Kembali ke Dasbor
        </button>
      </div>
    );
  }

  const currentStatusIdx = STATUS_PIPELINE.findIndex((p) => p.status === order.status);
  const nextStatus =
    currentStatusIdx >= 0 && currentStatusIdx < STATUS_PIPELINE.length - 1
      ? STATUS_PIPELINE[currentStatusIdx + 1]?.status
      : null;

  const handleAdvanceStatus = () => {
    setErrorMessage(null);
    if (!nextStatus) return;

    // Guardrail Bab 10.5: Jika status berikutnya adalah READY, buka RackModal
    if (nextStatus === ORDER_STATUS.READY) {
      setIsRackModalOpen(true);
      return;
    }

    const res = updatePosOrderStatus(order.id, nextStatus);
    if (res.success && res.order) {
      setOrder(res.order);
    } else if (res.error) {
      setErrorMessage(res.error);
    }
  };

  const handleConfirmRack = (rackLocation: string) => {
    const res = updatePosOrderStatus(order.id, ORDER_STATUS.READY, rackLocation);
    if (res.success && res.order) {
      setOrder(res.order);
    } else if (res.error) {
      setErrorMessage(res.error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 sm:px-3 py-1.5 rounded-xl hover:bg-slate-100 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Antrean</span>
        </button>

        <div className="flex items-center gap-2">
          <Link
            href={`/orders/${order.id}/receipt`}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow"
          >
            <Printer className="w-4 h-4" />
            <span>Nota Thermal</span>
          </Link>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 sm:p-4 bg-rose-50 border border-rose-200 rounded-xl sm:rounded-2xl text-rose-700 text-xs font-medium">
          {errorMessage}
        </div>
      )}

      {/* Main Order Card */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-4 sm:space-y-6">
        {/* Order Header Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 font-mono">
                {order.order_number}
              </h1>
              <span className="text-[11px] sm:text-xs font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200 px-2 sm:px-2.5 py-0.5 rounded-full">
                Tracking: {order.tracking_code}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
              Diterima pada: {new Date(order.created_at).toLocaleString('id-ID')}
            </p>
          </div>

          <div className="flex flex-row sm:flex-col justify-between items-center sm:items-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            <div>
              <span className="text-[10px] sm:text-xs text-slate-500 block sm:text-right">Total Pembayaran:</span>
              <span className="text-lg sm:text-2xl font-extrabold text-sky-600 font-mono">
                {formatRupiah(order.final_amount)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 mt-0 sm:mt-1">
              <span
                className={`text-[10px] sm:text-[11px] font-bold uppercase px-2 sm:px-2.5 py-0.5 rounded-full ${
                  order.payment_status === 'paid'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {order.payment_status === 'paid' ? 'LUNAS' : 'BELUM BAYAR'}
              </span>

              {order.payment_status !== 'paid' && (
                <button
                  type="button"
                  onClick={() => setIsQrisModalOpen(true)}
                  className="px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold bg-sky-500 hover:bg-sky-600 text-white rounded-full shadow-sm transition flex items-center gap-1 active:scale-95"
                >
                  <QrCode className="w-3 h-3" />
                  Bayar QRIS
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Status Stepper Progression */}
        <div className="space-y-2.5 sm:space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider">
              Tahapan Pengerjaan Cucian
            </h2>
            {order.rack_location && (
              <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-0.5 sm:py-1 bg-amber-50 border border-amber-200 text-amber-900 text-[11px] sm:text-xs font-extrabold rounded-full">
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600" />
                Lokasi: {order.rack_location}
              </span>
            )}
          </div>

          {/* Stepper Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 sm:gap-2">
            {STATUS_PIPELINE.map((p, idx) => {
              const isPast = idx < currentStatusIdx;
              const isCurrent = idx === currentStatusIdx;
              return (
                <div
                  key={p.status}
                  className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border text-center transition ${
                    isCurrent
                      ? 'border-sky-500 bg-sky-500 text-white font-bold shadow-md shadow-sky-200'
                      : isPast
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-800 font-medium'
                      : 'border-slate-200 bg-slate-50 text-slate-400'
                  }`}
                >
                  <p className="text-[10px] sm:text-[11px] leading-tight">{p.label}</p>
                </div>
              );
            })}
          </div>

          {/* Action Advance Status */}
          {nextStatus && (
            <div className="pt-2 flex justify-stretch sm:justify-end">
              <button
                type="button"
                onClick={handleAdvanceStatus}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 sm:py-2.5 bg-sky-500 hover:bg-sky-600 active:scale-98 text-white font-bold text-xs rounded-xl shadow-md shadow-sky-200 transition"
              >
                <span>
                  Lanjutkan Status ke:{' '}
                  <strong>
                    {STATUS_PIPELINE.find((p) => p.status === nextStatus)?.label}
                  </strong>
                </span>
                <ChevronRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          )}
        </div>

        {/* Customer & Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
          {/* Customer Card */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <User className="w-4 h-4 text-sky-500" />
              Informasi Pelanggan
            </h3>
            <div className="text-xs space-y-1.5 text-slate-600">
              <p className="font-bold text-slate-900 text-sm">{order.customer_name}</p>
              <p className="flex items-center gap-1.5 font-mono">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {order.customer_phone}
              </p>
              {order.notes && (
                <p className="mt-2 text-[11px] bg-white p-2 rounded-lg border border-slate-200 text-slate-700 italic">
                  &ldquo;{order.notes}&rdquo;
                </p>
              )}
            </div>
          </div>

          {/* Items Breakdown */}
          <div className="md:col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-slate-800">Rincian Cucian Hybrid</h3>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-200 text-xs"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{item.service_name}</p>
                    <p className="text-[11px] text-slate-500">
                      {item.category === 'kiloan' ? formatKg(item.quantity) : `${item.quantity} pcs`}{' '}
                      @ {formatRupiah(item.price_per_unit)}
                    </p>
                  </div>
                  <span className="font-bold font-mono text-slate-900">
                    {formatRupiah(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quality Control (QC) Photos Section */}
        {order.qc_photos.length > 0 && (
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <h3 className="text-xs font-bold text-slate-900">
                Bukti Foto Quality Control (QC) Pakaian Cacat Awal
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {order.qc_photos.map((photo) => (
                <button
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:ring-2 hover:ring-sky-400 transition text-left group"
                >
                  <img
                    src={photo.photo_url}
                    alt={photo.issue_type}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition"
                  />
                  <div className="p-2">
                    <span className="text-[10px] font-bold text-rose-600 block truncate">
                      {QC_ISSUE_LABELS[photo.issue_type]}
                    </span>
                    {photo.description && (
                      <p className="text-[10px] text-slate-500 truncate">{photo.description}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Zoom Modal for QC Photos */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h4 className="text-xs font-bold text-rose-600">
                Detail Bukti QC: {QC_ISSUE_LABELS[selectedPhoto.issue_type]}
              </h4>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <img
                src={selectedPhoto.photo_url}
                alt="Zoom Bukti QC"
                className="w-full rounded-2xl object-cover max-h-96"
              />
              {selectedPhoto.description && (
                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedPhoto.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rack Allocation Modal */}
      <RackModal
        isOpen={isRackModalOpen}
        orderNumber={order.order_number}
        customerName={order.customer_name}
        onClose={() => setIsRackModalOpen(false)}
        onConfirm={handleConfirmRack}
      />

      {/* QRIS Payment Modal */}
      <QrisPaymentModal
        isOpen={isQrisModalOpen}
        orderNumber={order.order_number}
        trackingCode={order.tracking_code}
        customerName={order.customer_name}
        finalAmount={order.final_amount}
        onClose={() => setIsQrisModalOpen(false)}
        onPaymentSuccess={handleConfirmQrisPayment}
      />
    </div>
  );
}
