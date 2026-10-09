'use client';

import React, { useState } from 'react';
import { formatRupiah } from '@sikucek/shared';
import { getAppSettings } from '../../lib/settings-store';
import {
  QrCode,
  X,
  CheckCircle2,
  Sparkles,
  Smartphone,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface QrisPaymentModalProps {
  isOpen: boolean;
  orderNumber: string;
  trackingCode: string;
  customerName: string;
  finalAmount: number;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export function QrisPaymentModal({
  isOpen,
  orderNumber,
  trackingCode,
  customerName,
  finalAmount,
  onClose,
  onPaymentSuccess,
}: QrisPaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const settings = getAppSettings();

  if (!isOpen) return null;

  const handleSimulateWebhookSuccess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-sky-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-sm">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Pembayaran QRIS Midtrans
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                {orderNumber} &bull; {trackingCode}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 text-center space-y-4">
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Total Tagihan Cucian
            </span>
            <p className="text-3xl font-black font-mono text-sky-600 mt-0.5">
              {formatRupiah(finalAmount)}
            </p>
            <p className="text-xs text-slate-600 font-semibold mt-1">
              Atas Nama: {customerName}
            </p>
          </div>

          {/* QRIS Code Showcase Box */}
          <div className="bg-white p-4 rounded-3xl border-2 border-dashed border-sky-300 max-w-[240px] mx-auto shadow-sm space-y-2">
            <div className="aspect-square bg-slate-50 rounded-2xl flex flex-col items-center justify-center p-3 relative overflow-hidden border border-slate-200">
              {/* Stylized QRIS Pattern Simulation */}
              <div className="w-36 h-36 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-2.5 flex flex-col justify-between shadow-inner">
                <div className="flex justify-between">
                  <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                    <div className="w-4 h-4 bg-slate-900 rounded-sm" />
                  </div>
                  <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                    <div className="w-4 h-4 bg-slate-900 rounded-sm" />
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="px-2 py-0.5 bg-sky-500 text-white text-[8px] font-black tracking-widest rounded uppercase">
                    QRIS
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                    <div className="w-4 h-4 bg-slate-900 rounded-sm" />
                  </div>
                  <div className="w-6 h-6 border-2 border-white rounded-md" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              <span>BCA</span> &bull; <span>GoPay</span> &bull; <span>OVO</span> &bull; <span>Dana</span>
            </div>
          </div>

          {/* Config Badge Info */}
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 text-[11px] text-slate-600 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {settings.midtrans.is_production ? 'Production API' : 'Midtrans Sandbox (Zero Cost)'}
              </span>
            </div>
            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
              {settings.midtrans.simulation_mode ? 'Simulasi Siap' : 'Live Gateway'}
            </span>
          </div>

          {/* Action Simulation Button */}
          <button
            type="button"
            onClick={handleSimulateWebhookSuccess}
            disabled={isProcessing}
            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg shadow-emerald-200 transition active:scale-95 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Memproses Webhook Pembayaran...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Simulasikan Pembayaran Berhasil (Lunas)</span>
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-500">
          Status transaksi akan otomatis berubah menjadi LUNAS setelah pembayaran terverifikasi.
        </div>
      </div>
    </div>
  );
}
