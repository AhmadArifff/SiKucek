'use client';

import React, { useState } from 'react';
import { PublicOrderTracking } from '../../lib/tracking-store';
import { formatRupiah, formatKg, formatPaymentChannelName } from '@sikucek/shared';
import {
  Receipt,
  MessageCircle,
  Share2,
  Check,
  CreditCard,
  Banknote,
  QrCode,
  Tag,
  AlertTriangle,
} from 'lucide-react';

interface DigitalReceiptProps {
  order: PublicOrderTracking;
}

export default function DigitalReceipt({ order }: DigitalReceiptProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  const getWaMessageUrl = () => {
    const phone = '6281234567890'; // WhatsApp Kasir
    const message = encodeURIComponent(
      `Halo Kasir SiKucek, saya ingin menanyakan pesanan atas nama *${order.customerName}* (Kode Resi: *${order.trackingCode}*). Status saat ini: *${order.status}*. Link nota: ${
        typeof window !== 'undefined' ? window.location.href : ''
      }`
    );
    return `https://wa.me/${phone}?text=${message}`;
  };

  const isPaid = order.paymentStatus === 'paid';

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-sky-100 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-sky-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center shrink-0">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              Rincian Nota Transaksi
            </h3>
            <p className="text-xs text-slate-500">
              No. Invoice: <span className="font-mono font-semibold text-slate-700">{order.orderNumber}</span>
            </p>
          </div>
        </div>

        {/* Payment Status Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span
            className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
              isPaid
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}
          >
            {isPaid ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Lunas Terbayar
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                Belum Bayar
              </>
            )}
          </span>

          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full flex items-center gap-1.5">
            {order.paymentChannel === 'cash' ? (
              <Banknote className="w-3.5 h-3.5 text-slate-500" />
            ) : order.paymentChannel === 'midtrans_va' ? (
              <CreditCard className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <QrCode className="w-3.5 h-3.5 text-slate-500" />
            )}
            <span>{formatPaymentChannelName(order.paymentChannel)}</span>
          </span>
        </div>
      </div>

      {/* Items Table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[11px]">
              <th className="py-2.5">Layanan / Item</th>
              <th className="py-2.5 text-center">Jumlah / Bobot</th>
              <th className="py-2.5 text-right">Harga Satuan</th>
              <th className="py-2.5 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {order.items.map((it, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition">
                <td className="py-3">
                  <p className="font-bold text-slate-800">{it.name}</p>
                  <span className="text-[10px] text-slate-600 uppercase font-semibold">
                    {it.category === 'kiloan' ? 'Kiloan' : 'Satuan'}
                  </span>
                </td>
                <td className="py-3 text-center font-mono font-semibold text-slate-700">
                  {it.category === 'kiloan' ? formatKg(it.quantity) : `${it.quantity} pcs`}
                </td>
                <td className="py-3 text-right font-mono text-slate-600">
                  {formatRupiah(it.pricePerUnit)}
                </td>
                <td className="py-3 text-right font-mono font-bold text-slate-800">
                  {formatRupiah(it.subtotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Financial Summary */}
      <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-2.5 text-xs sm:text-sm">
        <div className="flex justify-between items-center text-slate-600">
          <span>Subtotal Kiloan:</span>
          <span className="font-mono font-semibold">{formatRupiah(order.kiloanSubtotal)}</span>
        </div>

        <div className="flex justify-between items-center text-slate-600">
          <span>Subtotal Satuan:</span>
          <span className="font-mono font-semibold">{formatRupiah(order.satuanSubtotal)}</span>
        </div>

        <div className="flex justify-between items-center text-slate-600 pt-1 border-t border-slate-200">
          <span>Subtotal Kotor:</span>
          <span className="font-mono font-semibold">{formatRupiah(order.grossAmount)}</span>
        </div>

        {order.discountAmount > 0 && (
          <div className="bg-amber-100/70 border border-amber-200 p-2.5 rounded-xl text-amber-900">
            <div className="flex justify-between items-center font-bold">
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-700" />
                Potongan Diskon Kupon:
              </span>
              <span className="font-mono text-rose-600">
                -{formatRupiah(order.discountAmount)}
              </span>
            </div>
            {order.discountExplanation && (
              <p className="text-[11px] text-amber-800 mt-0.5">
                {order.discountExplanation}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-base font-extrabold text-slate-900">
          <span>Total Tagihan Bersih:</span>
          <span className="text-lg sm:text-xl font-black font-mono text-sky-600">
            {formatRupiah(order.finalAmount)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
        <a
          href={getWaMessageUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-200 transition active:scale-95"
        >
          <MessageCircle className="w-4 h-4" />
          Hubungi Kasir via WhatsApp
        </a>

        <button
          type="button"
          onClick={handleShare}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 font-bold text-xs sm:text-sm transition active:scale-95"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              Tautan Berhasil Disalin!
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-sky-600" />
              Bagikan / Salin Tautan Resi
            </>
          )}
        </button>
      </div>
    </div>
  );
}
