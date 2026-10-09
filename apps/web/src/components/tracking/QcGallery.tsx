'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { TrackingQcPhoto } from '../../lib/tracking-store';
import { Camera, AlertCircle, X, ZoomIn, ShieldCheck } from 'lucide-react';

interface QcGalleryProps {
  photos: TrackingQcPhoto[];
}

export default function QcGallery({ photos }: QcGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<TrackingQcPhoto | null>(null);

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-sky-100 shadow-md">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-sky-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              Bukti Foto Quality Control (QC Awal)
            </h3>
            <p className="text-xs text-slate-500">
              Dokumentasi kondisi fisik pakaian sebelum proses cuci untuk transparansi anti-sengketa
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 bg-rose-50 text-rose-700 rounded-full border border-rose-200 hidden sm:inline-block">
          {photos.length} Foto Tercatat
        </span>
      </div>

      {photos.length === 0 ? (
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2.5">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-emerald-900">
            Kondisi Pakaian Prima & Bersih
          </p>
          <p className="text-xs text-emerald-700 mt-1 max-w-md mx-auto">
            Kasir tidak menemukan noda membandel, robek, atau kancing lepas pada pemeriksaan awal. Pakaian diproses dengan standar higienis SiKucek.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-200 hover:border-sky-400 bg-slate-50 hover:shadow-lg transition-all flex flex-col"
            >
              {/* Image Thumbnail with Overlay */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                <Image
                  src={item.photoUrl}
                  alt={item.issueLabel}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="bg-white/90 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5">
                    <ZoomIn className="w-3.5 h-3.5 text-sky-600" />
                    Perbesar Foto
                  </span>
                </div>

                {/* Badge Defect Type */}
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide bg-rose-500/95 text-white rounded-lg shadow-sm backdrop-blur-sm flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {item.issueLabel}
                  </span>
                </div>
              </div>

              {/* Caption */}
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-700 font-medium line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
                <span className="text-[10px] text-slate-600 font-mono mt-2 block">
                  Foto diambil saat penerimaan
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Zoom Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 relative flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 text-xs font-bold bg-rose-100 text-rose-800 rounded-lg">
                  {selectedPhoto.issueLabel}
                </span>
                <span className="text-xs text-slate-500">
                  Foto Bukti Pemeriksaan Kasir
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Image */}
            <div className="relative aspect-video w-full bg-slate-900 flex-1 min-h-[250px]">
              <Image
                src={selectedPhoto.photoUrl}
                alt={selectedPhoto.issueLabel}
                fill
                className="object-contain"
              />
            </div>

            {/* Modal Footer Description */}
            <div className="p-5 bg-slate-50 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Catatan Petugas Laundry:
              </p>
              <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                {selectedPhoto.description}
              </p>
              <p className="text-[11px] text-slate-600 mt-2">
                * Foto ini tersimpan secara permanen dalam database audit laundry untuk menjamin kejujuran dan rasa aman pelanggan.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
