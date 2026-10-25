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
    <div className="relative bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white rounded-3xl sm:rounded-4xl p-5 sm:p-7 shadow-xl shadow-emerald-500/20 border border-emerald-400/30 overflow-hidden">
      {/* Decorative ambient bubble glows */}
      <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-12 -top-12 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 shadow-lg shadow-teal-900/20">
            <MapPin className="w-6 h-6 text-emerald-100 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-emerald-100 bg-white/20 px-3 py-0.5 rounded-full border border-white/20">
                {isCompleted ? 'Riwayat Pengambilan' : 'Cucian Siap Diambil'}
              </span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <h4 className="text-lg sm:text-2xl font-heading font-black tracking-tight text-white mt-1.5">
              {isCompleted ? (
                'Pakaian Telah Selesai Diserahkan'
              ) : (
                <>
                  Lokasi Rak Pengambilan:{' '}
                  <span className="underline decoration-amber-300 decoration-wavy underline-offset-4 font-mono">
                    {rackLocation || 'RAK KASIR UTAMA'}
                  </span>
                </>
              )}
            </h4>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl leading-relaxed font-sans">
              {isCompleted
                ? 'Terima kasih telah mempercayakan pakaian Anda di SiKucek. Kumpulkan terus stempel loyalti untuk cuci kiloan gratis berikutnya!'
                : `Pakaian Anda telah selesai dipacking rapi dan diletakkan di ${rackLocation || 'Rak Kasir'}. Tunjukkan nomor resi ini saat mengambil pakaian di outlet.`}
            </p>
          </div>
        </div>

        {/* Rack Badge */}
        {!isCompleted && rackLocation && (
          <div className="bg-white text-emerald-950 rounded-2xl sm:rounded-3xl px-6 py-3.5 text-center shrink-0 shadow-xl border border-emerald-100 self-start sm:self-auto">
            <span className="text-[10px] font-heading font-black text-slate-500 uppercase tracking-widest block">
              Nomor Rak Fisik
            </span>
            <span className="text-2xl sm:text-3xl font-black font-mono tracking-wider text-emerald-700 block mt-0.5">
              {rackLocation}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

