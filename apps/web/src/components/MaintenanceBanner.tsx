'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Phone, X, Clock } from 'lucide-react';

export default function MaintenanceBanner() {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [message, setMessage] = useState('');
  const [expectedEnd, setExpectedEnd] = useState('');
  const [supportPhone, setSupportPhone] = useState('081234567890');
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    try {
      // Check localStorage for POS settings bundle or maintenance flag
      const rawSettings = localStorage.getItem('sikucek_app_settings_v1');
      if (rawSettings) {
        const parsed = JSON.parse(rawSettings);
        if (parsed.maintenance?.is_maintenance_mode) {
          setIsMaintenance(true);
          setMessage(
            parsed.maintenance.maintenance_message ||
              'Outlet SiKucek sedang dalam pemeliharaan sistem rutin. Penerimaan cucian akan segera dibuka kembali.'
          );
          setExpectedEnd(parsed.maintenance.expected_end_at || '');
          setSupportPhone(parsed.maintenance.support_whatsapp || '081234567890');
        }
      }
    } catch {
      // Graceful fallback
    }
  }, []);

  if (!isMaintenance || isDismissed) return null;

  const waHref = `https://wa.me/${supportPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'Halo CS SiKucek, saya ingin menanyakan perihal operasional laundry saat masa pemeliharaan.'
  )}`;

  return (
    <aside aria-label="Pengumuman Pemeliharaan" className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5 text-center sm:text-left">
          <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-100" />
          </span>
          <div>
            <span className="font-black uppercase tracking-wider text-[11px] bg-white/20 px-2 py-0.5 rounded-full mr-2">
              Pemberitahuan Pemeliharaan
            </span>
            <span className="font-medium text-amber-50">{message}</span>
            {expectedEnd && (
              <span className="inline-flex items-center gap-1 font-bold text-amber-100 ml-2">
                <Clock className="w-3 h-3" /> Estimasi: {expectedEnd}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 bg-white text-amber-700 hover:bg-amber-50 font-bold rounded-lg transition text-xs flex items-center gap-1.5 shadow-sm"
          >
            <Phone className="w-3 h-3" />
            Bantuan WhatsApp
          </a>

          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="p-1 text-amber-100 hover:text-white rounded-md transition"
            title="Tutup pemberitahuan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
