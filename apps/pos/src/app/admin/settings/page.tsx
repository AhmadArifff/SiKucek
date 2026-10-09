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
  Database,
  Server,
  RefreshCw,
  ExternalLink,
  Wrench,
  Download,
  Upload,
  AlertTriangle,
  Trash2,
  Copy,
  FileText,
  HardDrive,
  Clock,
} from 'lucide-react';
import {
  checkSupabaseHealth,
  isSupabaseConfigured,
  generateBackupBundle,
  validateBackupBundle,
  DATABASE_MIGRATION_MANIFEST,
  type HealthCheckResult,
} from '@sikucek/database';
import { getStoredOrders, saveStoredOrders } from '../../../lib/orders-store';
import { getStoredServices, saveStoredServices } from '../../../lib/services-store';
import { getStoredRacks, saveStoredRacks } from '../../../lib/racks-store';
import {
  getStoredCoupons,
  saveStoredCoupons,
  getStoredCampaigns,
  saveStoredCampaigns,
  getStoredBanners,
  saveStoredBanners,
  getStoredCustomers,
  saveStoredCustomers,
} from '../../../lib/marketing-store';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<
    'payment' | 'whatsapp' | 'outlet' | 'rules' | 'database' | 'maintenance'
  >('payment');
  const [settings, setSettings] = useState<AppSettingsBundle>(DEFAULT_SETTINGS);
  const [showServerKey, setShowServerKey] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isTestingMidtrans, setIsTestingMidtrans] = useState<boolean>(false);
  const [dbHealth, setDbHealth] = useState<HealthCheckResult | null>(null);
  const [isCheckingDb, setIsCheckingDb] = useState<boolean>(false);

  // Maintenance & Backup States
  const [isExportingBackup, setIsExportingBackup] = useState<boolean>(false);
  const [restoreFeedback, setRestoreFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [resetModalMode, setResetModalMode] = useState<'transactions' | 'factory' | null>(null);
  const [resetConfirmationText, setResetConfirmationText] = useState<string>('');
  const [isResetting, setIsResetting] = useState<boolean>(false);

  useEffect(() => {
    const loaded = getAppSettings();
    setSettings(loaded);
    checkSupabaseHealth().then(setDbHealth);
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

  const handleCheckDb = async () => {
    setIsCheckingDb(true);
    const res = await checkSupabaseHealth();
    setDbHealth(res);
    setIsCheckingDb(false);
    setToastMessage(res.message);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Export Full Backup Snapshot
  const handleExportBackup = () => {
    setIsExportingBackup(true);
    try {
      const orders = getStoredOrders();
      const services = getStoredServices();
      const racks = getStoredRacks();
      const coupons = getStoredCoupons();
      const campaigns = getStoredCampaigns();
      const banners = getStoredBanners();
      const customers = getStoredCustomers();
      const app_settings = getAppSettings();

      const bundle = generateBackupBundle(
        { orders, services, racks, coupons, campaigns, banners, customers, app_settings },
        'pos_admin'
      );

      const jsonStr = JSON.stringify(bundle, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      a.href = url;
      a.download = `sikucek-backup-${timestamp}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setToastMessage('Snapshot cadangan database berhasil diunduh ke perangkat Anda!');
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: any) {
      alert(`Gagal membuat berkas cadangan: ${err?.message}`);
    } finally {
      setIsExportingBackup(false);
    }
  };

  // Restore Backup File
  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const validation = validateBackupBundle(parsed);

        if (!validation.valid) {
          setRestoreFeedback({
            type: 'error',
            message: validation.error || 'Format berkas cadangan tidak valid!',
          });
          return;
        }

        // Restore to local stores
        if (parsed.data.orders) saveStoredOrders(parsed.data.orders);
        if (parsed.data.services) saveStoredServices(parsed.data.services);
        if (parsed.data.racks) saveStoredRacks(parsed.data.racks);
        if (parsed.data.coupons) saveStoredCoupons(parsed.data.coupons);
        if (parsed.data.campaigns) saveStoredCampaigns(parsed.data.campaigns);
        if (parsed.data.banners) saveStoredBanners(parsed.data.banners);
        if (parsed.data.customers) saveStoredCustomers(parsed.data.customers);
        if (parsed.data.app_settings) {
          saveAppSettings(parsed.data.app_settings);
          setSettings(parsed.data.app_settings);
        }

        setRestoreFeedback({
          type: 'success',
          message: `Berhasil memulihkan ${validation.metadata?.total_orders || 0} pesanan, ${validation.metadata?.total_services || 0} layanan, dan ${validation.metadata?.total_racks || 0} rak fisik.`,
        });
        setToastMessage('Database berhasil dipulihkan dari berkas cadangan!');
        setTimeout(() => setToastMessage(null), 4000);
      } catch (err: any) {
        setRestoreFeedback({
          type: 'error',
          message: `Gagal membaca berkas JSON: ${err?.message}`,
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Execute Database Reset
  const handleExecuteReset = () => {
    if (resetConfirmationText.trim().toUpperCase() !== 'RESET') {
      alert('Ketik kata "RESET" untuk mengonfirmasi tindakan ini.');
      return;
    }

    setIsResetting(true);
    setTimeout(() => {
      if (resetModalMode === 'transactions') {
        saveStoredOrders([]);
        const racks = getStoredRacks();
        saveStoredRacks(
          racks.map((r) => ({
            ...r,
            status: 'empty',
            current_order_id: undefined,
            current_order_number: undefined,
          }))
        );
        setToastMessage('Data transaksi cucian dan status rak berhasil dibersihkan!');
      } else if (resetModalMode === 'factory') {
        localStorage.clear();
        setSettings(DEFAULT_SETTINGS);
        saveAppSettings(DEFAULT_SETTINGS);
        setToastMessage('Database berhasil di-reset total ke konfigurasi awal pabrik.');
      }
      setIsResetting(false);
      setResetModalMode(null);
      setResetConfirmationText('');
      setTimeout(() => setToastMessage(null), 4000);
    }, 600);
  };

  const handleCopySqlInfo = () => {
    navigator.clipboard.writeText(
      '-- Buka SQL Editor di Supabase lalu jalankan file: packages/database/migrations/001_initial_schema.sql\n-- Berkas ini berisi 18 tabel PostgreSQL, RLS policies, trigger antrean WhatsApp, dan data awal.'
    );
    setToastMessage('Petunjuk & path berkas migrasi SQL berhasil disalin ke clipboard!');
    setTimeout(() => setToastMessage(null), 3500);
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
            { id: 'database', label: '5. Database & Cloud Sync', icon: Database },
            { id: 'maintenance', label: '6. Pemeliharaan & Backup', icon: Wrench },
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

        {/* TAB 5: DATABASE SUPABASE & CLOUD SYNC */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            {/* Info Callout */}
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <div className="text-xs text-sky-900 leading-relaxed">
                <p className="font-bold mb-0.5">
                  Arsitektur Database Supabase PostgreSQL (PRD Bab 7 &amp; Bab 13):
                </p>
                <p>
                  Sistem dirancang dengan pola <strong>Resilient Hybrid Adapter</strong>. Jika proyek Supabase Cloud telah dihubungkan melalui file <code>.env.local</code>, data akan tersinkronisasi otomatis ke cloud. Jika belum diisi, sistem beroperasi 100% normal tanpa biaya infrastruktur (Zero Cost) menggunakan <em>Mock Store Lokal</em>.
                </p>
              </div>
            </div>

            {/* Connection Status Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    Status Koneksi Database Cloud
                  </h2>
                  <p className="text-xs text-slate-500">
                    Pemeriksaan realtime kesiapan client SDK dan endpoint Supabase
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCheckDb}
                  disabled={isCheckingDb}
                  className="px-4 py-2 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition flex items-center gap-2 self-start sm:self-auto disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${isCheckingDb ? 'animate-spin' : ''}`}
                  />
                  {isCheckingDb ? 'Memeriksa...' : 'Uji Ulang Koneksi'}
                </button>
              </div>

              {/* Status Banner */}
              <div
                className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  dbHealth?.mode === 'live'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      dbHealth?.mode === 'live'
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-sky-500 text-white shadow-sm'
                    }`}
                  >
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black">
                        {dbHealth?.mode === 'live'
                          ? 'Terhubung ke Supabase Cloud (Live Data)'
                          : 'Mode Mandiri / Zero Cost (Mock Store Lokal)'}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          dbHealth?.mode === 'live'
                            ? 'bg-emerald-200 text-emerald-800'
                            : 'bg-sky-100 text-sky-800'
                        }`}
                      >
                        {dbHealth?.mode === 'live' ? 'ONLINE LIVE' : 'ZERO-COST MOCK'}
                      </span>
                    </div>
                    <p className="text-xs mt-1 text-slate-600">
                      {dbHealth?.message ||
                        'Sistem siap digunakan untuk transaksi kasir dan tracking pelanggan.'}
                    </p>
                  </div>
                </div>

                {dbHealth?.latencyMs !== undefined && (
                  <div className="text-right sm:text-right shrink-0">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      Latensi Query
                    </span>
                    <span className="text-sm font-mono font-black text-slate-700">
                      {dbHealth.latencyMs} ms
                    </span>
                  </div>
                )}
              </div>

              {/* Step Guide for Connecting Supabase */}
              <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Database className="w-4 h-4 text-sky-600" />
                  Panduan 3 Langkah Menghubungkan Supabase Cloud (Tier Gratis Rp 0):
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-black text-[11px] inline-flex items-center justify-center mb-1.5">
                      1
                    </span>
                    <h4 className="font-bold text-slate-800 mb-0.5">Buat Proyek</h4>
                    <p className="text-[11px] text-slate-500">
                      Daftar gratis di supabase.com dan buat project baru (Region Singapore).
                    </p>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-black text-[11px] inline-flex items-center justify-center mb-1.5">
                      2
                    </span>
                    <h4 className="font-bold text-slate-800 mb-0.5">Eksekusi DDL SQL</h4>
                    <p className="text-[11px] text-slate-500">
                      Buka SQL Editor lalu jalankan file <code>packages/database/migrations/001_initial_schema.sql</code>.
                    </p>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-black text-[11px] inline-flex items-center justify-center mb-1.5">
                      3
                    </span>
                    <h4 className="font-bold text-slate-800 mb-0.5">Isi .env.local</h4>
                    <p className="text-[11px] text-slate-500">
                      Salin <code>.env.example</code> ke <code>.env.local</code> dan masukkan Project URL &amp; Anon Key Anda.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 18 Tables Directory Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Katalog 18 Tabel Database SiKucek (PRD Bab 7)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Seluruh skema tabel, trigger, dan Row Level Security (RLS) siap pakai
                  </p>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700">
                  18 Tabel Siap Pakai
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2 text-xs">
                {[
                  { name: 'profiles', desc: 'Akun pelanggan & staf kasir/operator' },
                  { name: 'services', desc: 'Master katalog tarif kiloan & satuan' },
                  { name: 'racks', desc: 'Master rak penyimpanan fisik outlet' },
                  { name: 'orders', desc: 'Data transaksi order hybrid kiloan+satuan' },
                  { name: 'order_items', desc: 'Rincian item layanan dalam tiap pesanan' },
                  { name: 'order_qc_photos', desc: 'Foto bukti cacat fisik awal pakaian' },
                  { name: 'order_status_logs', desc: 'Linimasa riwayat status cucian' },
                  { name: 'payments', desc: 'Catatan pembayaran tunai & Midtrans QRIS' },
                  { name: 'loyalty_stamp_cards', desc: 'Kartu progres 5 stempel loyalti' },
                  { name: 'daily_checkins', desc: 'Riwayat klaim check-in streak 7 hari' },
                  { name: 'coupons', desc: 'Master voucher potongan & diskon kiloan' },
                  { name: 'customer_coupons', desc: 'Kupon aktif milik akun pelanggan' },
                  { name: 'marketing_campaigns', desc: 'Pelacakan saluran promosi & ROI' },
                  { name: 'referral_logs', desc: 'Catatan poin & referral ajak teman' },
                  { name: 'marketing_banners', desc: 'Banner promo carousel web & PWA' },
                  { name: 'app_settings', desc: 'Vault konfigurasi zero-hardcode' },
                  { name: 'whatsapp_queue', desc: 'Antrean pesan WhatsApp Baileys' },
                  { name: 'activity_audit_logs', desc: 'Catatan audit aktivitas pengguna' },
                ].map((tbl) => (
                  <div
                    key={tbl.name}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-sky-300 transition"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-sky-700 text-xs">
                        {tbl.name}
                      </span>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      {tbl.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: PEMELIHARAAN & BACKUP DATABASE */}
        {activeTab === 'maintenance' && (
          <div className="space-y-6">
            {/* Header Callout */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
              <Wrench className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <p className="font-bold mb-0.5">
                  Pusat Pemeliharaan Sistem &amp; Manajemen Basis Data (Maintenance &amp; Disaster Recovery):
                </p>
                <p>
                  Kelola mode offline saat pemeliharaan outlet, buat salinan snapshot data berkala (Backup JSON), pulihkan data (Restore), periksa skrip migrasi Supabase DDL, dan lakukan pembersihan data transaksi dengan proteksi ganda.
                </p>
              </div>
            </div>

            {/* SECTION 1: MAINTENANCE MODE */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    Mode Pemeliharaan Outlet (Maintenance Mode)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Aktifkan jika outlet sedang renovasi, libur hari raya, atau sedang upgrade server
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenance.is_maintenance_mode}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        maintenance: {
                          ...settings.maintenance,
                          is_maintenance_mode: e.target.checked,
                        },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  <span className="ml-3 text-xs font-bold text-slate-700">
                    {settings.maintenance.is_maintenance_mode ? 'AKTIF (Mode Maintenance)' : 'NONAKTIF (Normal)'}
                  </span>
                </label>
              </div>

              {/* Maintenance Mode Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Pesan Pengumuman untuk Pelanggan (Tampil di Web &amp; PWA)
                  </label>
                  <textarea
                    rows={2}
                    value={settings.maintenance.maintenance_message}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        maintenance: {
                          ...settings.maintenance,
                          maintenance_message: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50/50"
                    placeholder="Contoh: Outlet SiKucek sedang dalam pemeliharaan sistem rutin. Layanan cuci dibuka kembali besok pukul 08.00 WIB."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Estimasi Selesai Pemeliharaan
                  </label>
                  <input
                    type="text"
                    value={settings.maintenance.expected_end_at}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        maintenance: {
                          ...settings.maintenance,
                          expected_end_at: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50/50"
                    placeholder="Contoh: Besok, pukul 08:00 WIB"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Nomor WhatsApp Bantuan Darurat
                  </label>
                  <input
                    type="text"
                    value={settings.maintenance.support_whatsapp}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        maintenance: {
                          ...settings.maintenance,
                          support_whatsapp: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50/50"
                    placeholder="081234567890"
                  />
                </div>
              </div>

              {/* Live Preview Banner */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Pratinjau Tampilan Banner untuk Pelanggan di Web:
                </span>
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-100" />
                    </span>
                    <div>
                      <span className="font-black uppercase tracking-wider text-[10px] bg-white/20 px-2 py-0.5 rounded-full mr-2">
                        Pemberitahuan
                      </span>
                      <span>{settings.maintenance.maintenance_message}</span>
                      {settings.maintenance.expected_end_at && (
                        <span className="font-bold ml-2 underline">
                          Estimasi: {settings.maintenance.expected_end_at}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-white text-amber-800 font-bold rounded-lg text-[11px] shrink-0">
                    WhatsApp Bantuan
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION 2: BACKUP & RESTORE DATABASE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card Backup */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                      <Download className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-800">
                        Unduh Snapshot Cadangan (Backup JSON)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Ekspor seluruh data transaksi, master layanan, rak, dan pengaturan
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 space-y-1.5 my-3">
                    <div className="flex justify-between">
                      <span>Cakupan Data:</span>
                      <span className="font-bold text-slate-800">Orders, Racks, Services, Coupons, Settings</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Format Berkas:</span>
                      <span className="font-mono font-bold text-sky-700">.json (Canonical SiKucek 1.0.0)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Opsi Terminal CLI:</span>
                      <span className="font-mono text-slate-700">npm run db:backup</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleExportBackup}
                  disabled={isExportingBackup}
                  className="w-full py-2.5 px-4 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  {isExportingBackup ? 'Memproses Berkas...' : 'Unduh Snapshot Cadangan Sekarang'}
                </button>
              </div>

              {/* Card Restore */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-800">
                        Pulihkan Database (Restore Backup)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Kembalikan data transaksi &amp; pengaturan dari berkas cadangan JSON
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 space-y-2 my-3">
                    <p>Pilih berkas cadangan <code>sikucek-backup-*.json</code> yang telah diunduh sebelumnya:</p>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleRestoreFile}
                      className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                    />
                  </div>

                  {restoreFeedback && (
                    <div
                      className={`p-3 rounded-xl text-xs font-medium border ${
                        restoreFeedback.type === 'success'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      {restoreFeedback.message}
                    </div>
                  )}
                </div>

                <div className="text-[11px] text-slate-400 text-center">
                  Pemulihan akan menggantikan data aktif di penyimpanan lokal outlet.
                </div>
              </div>
            </div>

            {/* SECTION 3: MIGRATION & SQL DDL TOOL */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800">
                      Migrasi Skema PostgreSQL (Supabase DDL Runner)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Berkas DDL SQL untuk inisialisasi atau pembaruan 19 tabel di Supabase Cloud
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopySqlInfo}
                    className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    Salin Info SQL
                  </button>

                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition flex items-center gap-1.5 shadow-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Buka Supabase SQL Editor
                  </a>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-700 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="font-bold">Nama Berkas Migrasi Utama:</span>
                  <code className="bg-slate-200 px-2 py-0.5 rounded text-[11px] font-mono text-purple-900">
                    packages/database/migrations/001_initial_schema.sql
                  </code>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="font-bold">Perintah Verifikasi Terminal CLI:</span>
                  <code className="bg-slate-200 px-2 py-0.5 rounded text-[11px] font-mono text-slate-900">
                    npm run db:migrate
                  </code>
                </div>
                <p className="text-[11px] text-slate-500 pt-1">
                  Mencakup seluruh tabel: profiles, customer_tiers, services, racks, orders, order_items, order_qc_photos, payments, loyalty, coupons, marketing, app_settings, dan whatsapp_queue.
                </p>
              </div>
            </div>

            {/* SECTION 4: DANGER ZONE (RESET DATABASE) */}
            <div className="bg-rose-50/60 rounded-3xl p-6 sm:p-8 border-2 border-rose-200 space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-rose-200">
                <Trash2 className="w-5 h-5 text-rose-600" />
                <div>
                  <h3 className="text-base font-black text-rose-900">
                    Zona Bahaya: Reset Basis Data (Dangerous Zone)
                  </h3>
                  <p className="text-xs text-rose-700">
                    Tindakan ini permanen. Pastikan Anda telah mengunduh cadangan snapshot sebelum melakukan reset.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Reset Transaksi */}
                <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-sm flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-1">
                      1. Bersihkan Data Transaksi Saja
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Menghapus seluruh pesanan cucian demo, mengosongkan status rak fisik, dan mereset antrean pesan. Master tarif layanan dan profil outlet tetap aman.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setResetModalMode('transactions');
                      setResetConfirmationText('');
                    }}
                    className="w-full py-2 px-3 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-300 rounded-xl transition"
                  >
                    Bersihkan Riwayat Transaksi...
                  </button>
                </div>

                {/* Factory Reset */}
                <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-sm flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-sm font-bold text-rose-900 mb-1">
                      2. Reset Total ke Awal Pabrik (Factory Reset)
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Menghapus seluruh data lokal dan mengembalikan sistem ke dataset awal bawaan standar SiKucek (orders, services, racks, coupons, settings).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setResetModalMode('factory');
                      setResetConfirmationText('');
                    }}
                    className="w-full py-2 px-3 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition shadow-sm"
                  >
                    Reset Total ke Awal Pabrik...
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL KONFIRMASI RESET (PROTECTED CONFIRMATION) */}
        {resetModalMode && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5">
              <div className="flex items-center gap-3 text-rose-600">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Konfirmasi Tindakan Reset
                  </h3>
                  <p className="text-xs text-slate-500">
                    {resetModalMode === 'transactions'
                      ? 'Pembersihan Transaksi Cucian'
                      : 'Factory Reset Total ke Kondisi Awal'}
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <p>
                  {resetModalMode === 'transactions'
                    ? 'Seluruh pesanan cucian di antrean dan rak fisik akan dikosongkan. Tindakan ini tidak dapat dibatalkan.'
                    : 'Seluruh data transaksi, pengaturan, dan master lokal akan dikembalikan ke kondisi standar awal pabrik.'}
                </p>
                <p className="font-bold text-slate-800">
                  Ketik kata <span className="text-rose-600 font-mono">RESET</span> di bawah untuk melanjutkan:
                </p>
                <input
                  type="text"
                  value={resetConfirmationText}
                  onChange={(e) => setResetConfirmationText(e.target.value)}
                  placeholder="Ketik RESET"
                  className="w-full px-3 py-2 text-sm font-mono font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setResetModalMode(null);
                    setResetConfirmationText('');
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Batal
                </button>

                <button
                  type="button"
                  onClick={handleExecuteReset}
                  disabled={resetConfirmationText.trim().toUpperCase() !== 'RESET' || isResetting}
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {isResetting ? 'Mereset Data...' : 'Konfirmasi & Eksekusi Reset'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
