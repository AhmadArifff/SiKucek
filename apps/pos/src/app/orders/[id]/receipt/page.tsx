'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Printer, ArrowLeft } from 'lucide-react';
import { formatRupiah, formatKg } from '@sikucek/shared';
import { getStoredOrders, type PosOrder } from '../../../../lib/orders-store';

export default function ReceiptPrintPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<PosOrder | null>(null);

  useEffect(() => {
    const orders = getStoredOrders();
    const found = orders.find((o) => o.id === orderId);
    if (found) {
      setOrder(found);
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="p-8 text-center text-xs text-slate-500">
        Memuat struk nota...
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 flex flex-col items-center">
      {/* Action Bar (Hidden on Print) */}
      <div className="print:hidden w-full max-w-sm mb-4 flex items-center justify-between">
        <button
          onClick={() => router.push(`/orders/${order.id}`)}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl hover:bg-slate-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl shadow-md transition"
        >
          <Printer className="w-4 h-4" />
          Cetak Nota (Print)
        </button>
      </div>

      {/* Thermal Paper Slip Container (58mm / 80mm format) */}
      <div className="w-full max-w-[340px] bg-white p-5 rounded-xl shadow-lg border border-slate-200 text-slate-900 font-mono text-[11px] leading-relaxed print:shadow-none print:border-none print:p-0 print:m-0 print:w-full">
        {/* Header */}
        <div className="text-center pb-3 border-b border-dashed border-slate-400 space-y-1">
          <h1 className="text-base font-extrabold uppercase tracking-wider">SIKUCEK LAUNDRY</h1>
          <p className="text-[10px] text-slate-600">Solusi Laundry Pintar & Higienis</p>
          <p className="text-[10px] text-slate-600">Jl. Margonda Raya No. 12, Depok</p>
          <p className="text-[10px] text-slate-600">WhatsApp: 0812-3456-7890</p>
        </div>

        {/* Order Meta */}
        <div className="py-2.5 border-b border-dashed border-slate-400 space-y-1 text-[10px]">
          <div className="flex justify-between">
            <span>No Nota:</span>
            <span className="font-bold">{order.order_number}</span>
          </div>
          <div className="flex justify-between">
            <span>Tanggal:</span>
            <span>{new Date(order.created_at).toLocaleDateString('id-ID')}</span>
          </div>
          <div className="flex justify-between">
            <span>Pelanggan:</span>
            <span className="font-bold truncate max-w-[150px]">{order.customer_name}</span>
          </div>
          <div className="flex justify-between">
            <span>No HP:</span>
            <span>{order.customer_phone}</span>
          </div>
          {order.rack_location && (
            <div className="flex justify-between font-bold text-slate-900 bg-slate-100 p-1 rounded">
              <span>LOKASI RAK:</span>
              <span>{order.rack_location}</span>
            </div>
          )}
        </div>

        {/* Items */}
        <div className="py-2.5 border-b border-dashed border-slate-400 space-y-2">
          {order.items.map((item, idx) => (
            <div key={idx} className="space-y-0.5">
              <div className="flex justify-between font-semibold">
                <span className="truncate max-w-[200px]">{item.service_name}</span>
                <span>{formatRupiah(item.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 pl-2">
                <span>
                  {item.category === 'kiloan' ? formatKg(item.quantity) : `${item.quantity} pcs`}{' '}
                  x {formatRupiah(item.price_per_unit)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="py-2.5 border-b border-dashed border-slate-400 space-y-1 text-[11px]">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatRupiah(order.gross_amount)}</span>
          </div>
          {order.discount_amount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>Diskon Kupon:</span>
              <span>-{formatRupiah(order.discount_amount)}</span>
            </div>
          )}
          <div className="flex justify-between font-extrabold text-sm pt-1 border-t border-slate-200">
            <span>TOTAL:</span>
            <span>{formatRupiah(order.final_amount)}</span>
          </div>
          <div className="flex justify-between pt-1">
            <span>Status Bayar:</span>
            <span className="font-bold uppercase">
              {order.payment_status === 'paid' ? 'LUNAS' : 'BELUM BAYAR'}
            </span>
          </div>
          {order.cash_received && order.cash_received > 0 && (
            <>
              <div className="flex justify-between text-[10px] text-slate-600">
                <span>Tunai Diterima:</span>
                <span>{formatRupiah(order.cash_received)}</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-600">
                <span>Kembalian:</span>
                <span>{formatRupiah(order.cash_change || 0)}</span>
              </div>
            </>
          )}
        </div>

        {/* Tracking Code & QR link */}
        <div className="py-3 text-center space-y-1.5 border-b border-dashed border-slate-400">
          <p className="text-[10px] text-slate-600">Lacak Cucian & Foto QC Anda di:</p>
          <p className="text-xs font-bold text-sky-700 underline">
            sikucek.app/track/{order.tracking_code}
          </p>
          <p className="text-[9px] text-slate-400">Kode Unik: {order.tracking_code}</p>
        </div>

        {/* Footer */}
        <div className="pt-3 text-center text-[10px] text-slate-500 space-y-1">
          <p>Terima kasih sudah mempercayakan cucian Anda pada SiKucek!</p>
          <p className="text-[9px]">Simpan nota ini saat pengambilan pakaian.</p>
        </div>
      </div>
    </div>
  );
}
