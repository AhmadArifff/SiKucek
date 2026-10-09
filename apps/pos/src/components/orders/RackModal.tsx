'use client';

import React, { useState } from 'react';
import { PackageCheck, X, Check, AlertCircle } from 'lucide-react';
import { INITIAL_RACKS } from '../../lib/orders-store';

interface RackModalProps {
  isOpen: boolean;
  orderNumber: string;
  customerName: string;
  onClose: () => void;
  onConfirm: (rackLocation: string) => void;
}

export function RackModal({
  isOpen,
  orderNumber,
  customerName,
  onClose,
  onConfirm,
}: RackModalProps) {
  const [selectedRack, setSelectedRack] = useState('');
  const [customRack, setCustomRack] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const finalRack = customRack.trim() || selectedRack.trim();
    if (!finalRack) {
      setErrorMessage('Nomor rak fisik WAJIB dipilih/diisi sebelum status pesanan diubah ke SIAP (Ready)!');
      return;
    }
    setErrorMessage(null);
    onConfirm(finalRack);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-amber-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
              <PackageCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Alokasi Rak Fisik (Siap Ambil)</h3>
              <p className="text-[11px] text-amber-700">Guardrail Wajib Bab 10.5 PRD SiKucek</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs text-slate-600">
            <p className="font-semibold text-slate-900">{customerName}</p>
            <p className="text-[11px] text-slate-500">Nomor Pesanan: {orderNumber}</p>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">
              Pilih Rak Penyimpanan Outlet:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {INITIAL_RACKS.map((rack) => (
                <button
                  type="button"
                  key={rack.code}
                  onClick={() => {
                    setSelectedRack(rack.code);
                    setCustomRack('');
                    setErrorMessage(null);
                  }}
                  className={`p-3 rounded-xl text-left border transition ${
                    selectedRack === rack.code && !customRack
                      ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-800">{rack.code}</p>
                  <p className="text-[10px] text-slate-500 truncate">{rack.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Atau Input Rak Kustom / Gantungan:
            </label>
            <input
              type="text"
              value={customRack}
              onChange={(e) => {
                setCustomRack(e.target.value.toUpperCase());
                setSelectedRack('');
                setErrorMessage(null);
              }}
              placeholder="Contoh: RAK-C3 atau GANTUNG-05"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 uppercase font-mono"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-md shadow-amber-200 transition"
          >
            <Check className="w-4 h-4" />
            Simpan & Tandai Siap Ambil
          </button>
        </div>
      </div>
    </div>
  );
}
