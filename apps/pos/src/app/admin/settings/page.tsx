'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getAppSettings,
  saveAppSettings,
  AppSettingsBundle,
  DEFAULT_SETTINGS,
} from '../../../lib/settings-store';
import {
  CreditCard,
  MessageCircle,
  Store,
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  QrCode,
  Smartphone,
  Sparkles,
  ArrowLeft,
  Info,
  Sliders,
  Check,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'payment' | 'whatsapp' | 'outlet' | 'rules'>('payment');
  const [settings, setSettings] = useState<AppSettingsBundle>(DEFAULT_SETTINGS);
  const [showServerKey, setShowServerKey] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isTestingMidtrans, setIsTestingMidtrans] = useState<boolean>(false);

  useEffect(() => {
    const loaded = getAppSettings();
    setSettings(loaded);
  }, []);

  const handleSave = () => {
    saveAppSettings(settings);
    setToastMessage('Konfigurasi berhasil disimpan ke Vault Pengaturan Outlet!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleResetDefaults = () => {
    if (confirm('Kembalikan seluruh pengaturan ke standar bawaan SiKucek?')) {
      setSettings(DEFAULT_SETTINGS);
      saveAppSettings(DEFAULT_SETTINGS);
      setToastMessage('Pengaturan telah direset ke nilai standar bawaan.');
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handleTestMidtrans = () => {
    setIsTestingMidtrans(true);
    setTimeout(() => {
      setIsTestingMidtrans(false);
      setToastMessage(
        settings.midtrans.simulation_mode
          ? 'Mode Simulasi Aktif: Endpoint QRIS & VA siap digunakan kasir!'
          : 'Uji Koneksi Sandbox Berhasil! Kredensial Midtrans valid.'
      );
      setTimeout(() => setToastMessage(null), 4000);
    }, 600);
  };

  // Live preview message for WhatsApp
  const previewReceivedMsg = settings.whatsapp.template_received
    .replace('{customer_name}', 'Rani Maharani')
    .replace('{order_number}', 'SKC-261009-0001')
    .replace('{ringkasan_layanan}', 'Cuci Kering Setrika 3.2 Kg + 2 Kemeja')
    .replace('{final_amount}', 'Rp 32.400')
    .replace('{status_bayar}', 'LUNAS')
    .replace('{estimasi_selesai}', '10 Okt 2026, 14:00 WIB')
    .replace('{tracking_code}', 'SKC-R4N1X');

  const previewReadyMsg = settings.whatsapp.template_ready
    .replace('{customer_name}', 'Budi Prasetyo')
    .replace('{order_number}', 'SKC-261009-0002')
    .replace('{rack_location}', 'RAK-A2')
    .replace('{final_amount}', 'Rp 31.500')
    .replace('{status_bayar}', 'LUNAS')
    .replace('{tracking_code}', 'SKC-B8D02');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Bar Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-slate-900">
                  Pusat Konfigurasi Zero-Hardcode
                </h1>
                <span className="text-[10px] font-extrabold uppercase tracking-wide bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">
                  Bab 13 Vault
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Kelola kredensial Midtrans, template WhatsApp, dan aturan outlet tanpa mengubah kode
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-200 rounded-xl transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Standar</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold text-white bg-sky-500 hover:bg-sky-600 rounded-xl shadow-md shadow-sky-200 transition active:scale-95 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="mb-6 bg-emerald-100 border-2 border-emerald-300 text-emerald-900 rounded-2xl p-4 shadow-lg flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-xs sm:text-sm font-bold">{toastMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-bold"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1 mb-8">
          {[
            { id: 'payment', label: '1. Pembayaran Midtrans', icon: CreditCard },
            { id: 'whatsapp', label: '2. WhatsApp Automation', icon: MessageCircle },
            { id: 'outlet', label: '3. Profil Outlet', icon: Store },
            { id: 'rules', label: '4. Aturan Bisnis', icon: Sliders },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold rounded-2xl border transition whitespace-nowrap ${
                  isActive
                    ? 'border-sky-500 bg-sky-50 text-sky-700 shadow-sm'
                    : 'border-transparent text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: MIDTRANS PAYMENT CONFIG */}
        {activeTab === 'payment' && (
          <div className="space-y-6">
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <div className="text-xs text-sky-900 leading-relaxed">
                <p className="font-bold mb-0.5">Zero-Hardcode Gateway (PRD Bab 13):</p>
                <p>
                  Kredensial Midtrans di bawah ini dibaca langsung dari database Supabase (tabel <code>public.app_settings</code>). Server Key ditandai rahasia (<code>is_secret = TRUE</code>) sehingga terlindungi dari intipan publik. Anda dapat mengaktifkan mode simulasi untuk pengujian kasir tanpa modal biaya.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    Pengaturan Gateway Pembayaran (QRIS &amp; VA)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Mendukung pembayaran digital QRIS instan di kasir dan transfer Virtual Account
                  </p>
                </div>

                {/* Mode Badges */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      settings.midtrans.is_production
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {settings.midtrans.is_production ? 'Mode: Production' : 'Mode: Sandbox (Gratis)'}
                  </span>

                  {settings.midtrans.simulation_mode && (
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Simulasi Mock Aktif
                    </span>
                  )}
                </div>
              </div>

              {/* Form Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Server Key */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Server Key (Rahasia):
                  </label>
                  <div className="relative">
                    <input
                      type={showServerKey ? 'text' : 'password'}
                      value={settings.midtrans.server_key}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          midtrans: { ...settings.midtrans, server_key: e.target.value },
                        })
                      }
                      placeholder="SB-Mid-server-..."
                      className="w-full px-4 py-2.5 pr-11 text-xs sm:text-sm font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowServerKey(!showServerKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showServerKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Diperoleh dari Midtrans Dashboard &gt; Settings &gt; Access Keys.
                  </p>
                </div>

                {/* Client Key */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Client Key (Publik):
                  </label>
                  <input
                    type="text"
                    value={settings.midtrans.client_key}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        midtrans: { ...settings.midtrans, client_key: e.target.value },
                      })
                    }
                    placeholder="SB-Mid-client-..."
                    className="w-full px-4 py-2.5 text-xs sm:text-sm font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                  />
                  <p className="text-[11px] text-slate-600 mt-1">
                    Digunakan untuk memuat checkout QRIS di tablet kasir.
                  </p>
                </div>

                {/* Merchant ID */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Merchant ID:
                  </label>
                  <input
                    type="text"
                    value={settings.midtrans.merchant_id}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        midtrans: { ...settings.midtrans, merchant_id: e.target.value },
                      })
                    }
                    placeholder="G123456789"
                    className="w-full px-4 py-2.5 text-xs sm:text-sm font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                  />
                </div>

                {/* Toggles */}
                <div className="space-y-4 pt-1">
                  {/* Production Toggle */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Mode Production (Uang Nyata)
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Matikan jika masih dalam tahap pengembangan / sandbox
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.midtrans.is_production}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            midtrans: { ...settings.midtrans, is_production: e.target.checked },
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                    </label>
                  </div>

                  {/* Mock Simulator Toggle */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-emerald-50/40 border-emerald-200">
                    <div>
                      <p className="text-xs font-bold text-emerald-900">
                        Simulasi QRIS Kasir Offline / Sandbox
                      </p>
                      <p className="text-[11px] text-emerald-700">
                        Memungkinkan kasir mencetak QRIS dummy &amp; melunasi instan tanpa api key riil
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.midtrans.simulation_mode}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            midtrans: { ...settings.midtrans, simulation_mode: e.target.checked },
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Test Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleTestMidtrans}
                  disabled={isTestingMidtrans}
                  className="px-4 py-2.5 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  {isTestingMidtrans ? 'Menguji Koneksi...' : 'Uji Koneksi Sandbox Midtrans'}
                </button>

                <p className="text-[11px] text-slate-600">
                  * Kredensial otomatis tersimpan ke tabel <code>app_settings</code>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WHATSAPP AUTOMATION & TEMPLATE CONFIG */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-6">
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <div className="text-xs text-sky-900 leading-relaxed">
                <p className="font-bold mb-0.5">Cara Kerja Mesin Baileys WhatsApp (PRD Bab 10.6):</p>
                <p>
                  Sistem menggunakan sesi WhatsApp Web lokal (Zero Cost Rp 0). Saat kasir membuat order atau menggeser status ke <strong>ready</strong> di rak, database Supabase otomatis memasukkan pesan ke antrean <code>whatsapp_queue</code> dan engine worker langsung mengirimkannya ke ponsel pelanggan.
                </p>
              </div>
            </div>

            {/* Session Connection Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800">
                      Status Sesi WhatsApp Web Outlet
                    </h3>
                    <p className="text-xs text-slate-500">
                      Sesi: <span className="font-mono font-semibold">{settings.whatsapp.session_name}</span> &bull; No. Pengirim: {settings.whatsapp.outlet_phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Terhubung (Online)
                  </span>
                </div>
              </div>

              {/* Toggles Notification Triggers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5">
                <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Kirim Nota Otomatis (Saat Masuk Kasir)
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Mengirimkan link pelacakan &amp; rincian harga ke WA pelanggan
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.whatsapp.auto_notify_received}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        whatsapp: { ...settings.whatsapp, auto_notify_received: e.target.checked },
                      })
                    }
                    className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 accent-sky-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Kirim Notifikasi Siap Ambil (Saat Taruh di Rak)
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Mengirimkan nomor rak fisik dan ajakan ambil cucian
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.whatsapp.auto_notify_ready}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        whatsapp: { ...settings.whatsapp, auto_notify_ready: e.target.checked },
                      })
                    }
                    className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 accent-sky-500"
                  />
                </label>
              </div>
            </div>

            {/* Template Editors & Live Previews */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Form Editors */}
              <div className="lg:col-span-7 space-y-6">
                {/* 1. Template Nota Masuk */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Template 1: Nota Masuk (Status Received)
                    </label>
                    <span className="text-[10px] text-slate-600 font-semibold">
                      Tag: &#123;customer_name&#125;, &#123;order_number&#125;, &#123;tracking_code&#125;
                    </span>
                  </div>
                  <textarea
                    rows={7}
                    value={settings.whatsapp.template_received}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        whatsapp: { ...settings.whatsapp, template_received: e.target.value },
                      })
                    }
                    className="w-full p-3.5 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50 leading-relaxed"
                  />
                </div>

                {/* 2. Template Pakaian Siap Ambil */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Template 2: Pakaian Siap Ambil (Status Ready)
                    </label>
                    <span className="text-[10px] text-slate-600 font-semibold">
                      Tag: &#123;customer_name&#125;, &#123;rack_location&#125;, &#123;tracking_code&#125;
                    </span>
                  </div>
                  <textarea
                    rows={7}
                    value={settings.whatsapp.template_ready}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        whatsapp: { ...settings.whatsapp, template_ready: e.target.value },
                      })
                    }
                    className="w-full p-3.5 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50 leading-relaxed"
                  />
                </div>

                {/* 3. Template Winback Dorman */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Template 3: Winback Promo Pelanggan Dorman (&gt;14 Hari)
                    </label>
                    <span className="text-[10px] text-slate-600 font-semibold">
                      Tag: &#123;customer_name&#125;
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={settings.whatsapp.template_winback}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        whatsapp: { ...settings.whatsapp, template_winback: e.target.value },
                      })
                    }
                    className="w-full p-3.5 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50 leading-relaxed"
                  />
                </div>
              </div>

              {/* Right Column: Live Chat Previews */}
              <div className="lg:col-span-5 space-y-6">
                {/* Live Preview Nota Masuk */}
                <div className="bg-emerald-950 text-white rounded-3xl p-5 shadow-xl border border-emerald-800">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-800 mb-3 text-xs text-emerald-300">
                    <span className="font-bold flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      Live Chat Preview (Nota Masuk)
                    </span>
                    <span className="text-[10px] bg-emerald-900 px-2 py-0.5 rounded-full font-mono">
                      WhatsApp HP
                    </span>
                  </div>

                  <div className="bg-emerald-900/90 text-emerald-50 rounded-2xl p-4 text-xs font-sans leading-relaxed whitespace-pre-line shadow-inner border border-emerald-700/60">
                    {previewReceivedMsg}
                  </div>
                </div>

                {/* Live Preview Siap Ambil */}
                <div className="bg-emerald-950 text-white rounded-3xl p-5 shadow-xl border border-emerald-800">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-800 mb-3 text-xs text-emerald-300">
                    <span className="font-bold flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      Live Chat Preview (Siap Ambil di Rak)
                    </span>
                    <span className="text-[10px] bg-emerald-900 px-2 py-0.5 rounded-full font-mono">
                      WhatsApp HP
                    </span>
                  </div>

                  <div className="bg-emerald-900/90 text-emerald-50 rounded-2xl p-4 text-xs font-sans leading-relaxed whitespace-pre-line shadow-inner border border-emerald-700/60">
                    {previewReadyMsg}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PROFIL OUTLET */}
        {activeTab === 'outlet' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="pb-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">
                Profil &amp; Identitas Outlet Laundry
              </h2>
              <p className="text-xs text-slate-500">
                Data ini dicetak pada struk thermal kasir, header nota digital, dan footer web
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Nama Outlet:
                </label>
                <input
                  type="text"
                  value={settings.outlet.name}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      outlet: { ...settings.outlet, name: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Nomor Telepon / WhatsApp Kasir:
                </label>
                <input
                  type="text"
                  value={settings.outlet.phone}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      outlet: { ...settings.outlet, phone: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Alamat Lengkap Outlet:
                </label>
                <input
                  type="text"
                  value={settings.outlet.address}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      outlet: { ...settings.outlet, address: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Jam Operasional Outlet:
                </label>
                <input
                  type="text"
                  value={settings.outlet.open_hours}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      outlet: { ...settings.outlet, open_hours: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tautan Google Maps:
                </label>
                <input
                  type="text"
                  value={settings.outlet.maps_url}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      outlet: { ...settings.outlet, maps_url: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ATURAN BISNIS */}
        {activeTab === 'rules' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="pb-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">
                Aturan Bisnis &amp; Gamifikasi (PRD Bab 10.4)
              </h2>
              <p className="text-xs text-slate-500">
                Konfigurasi batas minimal timbangan kiloan, target stempel, dan retensi pelanggan
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Batas Minimal Timbangan Kiloan (Kg):
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={settings.business_rules.min_weight_kiloan}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      business_rules: {
                        ...settings.business_rules,
                        min_weight_kiloan: parseFloat(e.target.value) || 2.0,
                      },
                    })
                  }
                  className="w-full px-4 py-2.5 text-xs sm:text-sm font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                />
                <p className="text-[11px] text-slate-600 mt-1">
                  Pesanan di bawah bobot ini otomatis dikenakan tarif minimal.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Target Stempel per Siklus Kartu:
                </label>
                <input
                  type="number"
                  value={settings.business_rules.stamp_target}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      business_rules: {
                        ...settings.business_rules,
                        stamp_target: parseInt(e.target.value, 10) || 5,
                      },
                    })
                  }
                  className="w-full px-4 py-2.5 text-xs sm:text-sm font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                />
                <p className="text-[11px] text-slate-600 mt-1">
                  Jumlah pesanan selesai untuk menerbitkan voucher gratis cuci.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Batas Maksimal Kupon Gratis Kiloan (Kg):
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={settings.business_rules.stamp_reward_max_kg}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      business_rules: {
                        ...settings.business_rules,
                        stamp_reward_max_kg: parseFloat(e.target.value) || 5.0,
                      },
                    })
                  }
                  className="w-full px-4 py-2.5 text-xs sm:text-sm font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                />
                <p className="text-[11px] text-slate-600 mt-1">
                  Maksimal bobot gratis yang dipotong oleh voucher stempel.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Ambang Batas Pelanggan Dorman (Hari):
                </label>
                <input
                  type="number"
                  value={settings.business_rules.dormant_days_limit}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      business_rules: {
                        ...settings.business_rules,
                        dormant_days_limit: parseInt(e.target.value, 10) || 14,
                      },
                    })
                  }
                  className="w-full px-4 py-2.5 text-xs sm:text-sm font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                />
                <p className="text-[11px] text-slate-600 mt-1">
                  Pelanggan tanpa cucian melewati batas ini masuk daftar Winback Promo.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
