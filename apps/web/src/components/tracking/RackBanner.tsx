import React from 'react';
import { MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

interface RackBannerProps {
  rackLocation?: string;
  isReady: boolean;
  isCompleted: boolean;
}

export default function RackBanner({ rackLocation, isReady, isCompleted }: RackBannerProps) {
  if (!isReady && !isCompleted) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 text-white rounded-3xl p-5 sm:p-6 shadow-xl shadow-emerald-500/20 border border-emerald-400/40 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 shadow-inner">
            <MapPin className="w-6 h-6 text-emerald-100 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-100 bg-white/20 px-2.5 py-0.5 rounded-full">
                {isCompleted ? 'Riwayat Pengambilan' : 'Cucian Siap Diambil'}
              </span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <h4 className="text-lg sm:text-xl font-black tracking-tight text-white mt-1">
              {isCompleted ? (
                'Pakaian Telah Selesai Diserahkan'
              ) : (
                <>
                  Lokasi Rak Pengambilan:{' '}
                  <span className="underline decoration-amber-300 decoration-wavy underline-offset-4">
                    {rackLocation || 'RAK KASIR UTAMA'}
                  </span>
                </>
              )}
            </h4>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl leading-relaxed">
              {isCompleted
                ? 'Terima kasih telah mempercayakan cucian Anda di SiKucek! Dapatkan stempel loyalti tambahan untuk cucian berikutnya.'
                : `Pakaian Anda telah selesai dipacking rapi dan diletakkan di ${rackLocation || 'Rak Kasir'}. Tunjukkan kode resi ini saat mengambil pakaian di outlet.`}
            </p>
          </div>
        </div>

        {/* Rack Badge */}
        {!isCompleted && rackLocation && (
          <div className="bg-white text-emerald-800 rounded-2xl px-5 py-3 text-center shrink-0 shadow-lg border border-emerald-100">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Nomor Rak Fisik
            </span>
            <span className="text-2xl font-black font-mono tracking-wider text-emerald-700">
              {rackLocation}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
