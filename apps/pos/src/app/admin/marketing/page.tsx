'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Image as ImageIcon,
  PlusCircle,
  Sparkles,
  Layers,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Power,
  X,
  Target,
  BarChart3,
  Percent,
} from 'lucide-react';
import { formatRupiah } from '@sikucek/shared';
import {
  getStoredCampaigns,
  saveStoredCampaigns,
  getStoredBanners,
  saveStoredBanners,
} from '../../../lib/marketing-store';
import { MarketingCampaign, MarketingBanner } from '@sikucek/shared';

export default function AdminMarketingPage() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'banners'>('campaigns');
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [banners, setBanners] = useState<MarketingBanner[]>([]);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State for Campaign
  const [cmpTitle, setCmpTitle] = useState('');
  const [cmpChannel, setCmpChannel] = useState<MarketingCampaign['channel']>('instagram_ads');
  const [cmpPromoCode, setCmpPromoCode] = useState('');
  const [cmpBudget, setCmpBudget] = useState<number>(300000);
  const [cmpStartsAt, setCmpStartsAt] = useState('2026-10-01');
  const [cmpEndsAt, setCmpEndsAt] = useState('2026-10-31');

  // Form State for Banner
  const [banTitle, setBanTitle] = useState('');
  const [banImageUrl, setBanImageUrl] = useState('');
  const [banActionUrl, setBanActionUrl] = useState('/#kalkulator');
  const [banSortOrder, setBanSortOrder] = useState<number>(1);

  useEffect(() => {
    setCampaigns(getStoredCampaigns());
    setBanners(getStoredBanners());
  }, []);

  // Compute Overall ROI Metrics
  const totalBudget = campaigns.reduce((acc, c) => acc + c.budget_amount, 0);
  const totalDiscounts = campaigns.reduce((acc, c) => acc + c.total_discount_given, 0);
  const totalRevenue = campaigns.reduce((acc, c) => acc + c.total_revenue_generated, 0);
  const totalInvestment = totalBudget + totalDiscounts;
  const overallRoiRatio =
    totalInvestment > 0 ? (totalRevenue / totalInvestment).toFixed(1) : '0.0';
  const netMarketingProfit = totalRevenue - totalInvestment;

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmpTitle.trim()) return;

    const newCampaign: MarketingCampaign = {
      id: `cmp-${Date.now()}`,
      title: cmpTitle.trim(),
      channel: cmpChannel,
      promo_code: cmpPromoCode.trim().toUpperCase() || null,
      budget_amount: cmpBudget,
      total_discount_given: 0,
      total_revenue_generated: 0,
      roi_ratio: 0.0,
      starts_at: cmpStartsAt,
      ends_at: cmpEndsAt,
      is_active: true,
    };

    const updated = [newCampaign, ...campaigns];
    setCampaigns(updated);
    saveStoredCampaigns(updated);

    setCmpTitle('');
    setCmpPromoCode('');
    setIsCampaignModalOpen(false);
    setToastMessage(`Kampanye "${newCampaign.title}" berhasil dibuat!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreateBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!banTitle.trim() || !banImageUrl.trim()) return;

    const newBanner: MarketingBanner = {
      id: `ban-${Date.now()}`,
      title: banTitle.trim(),
      image_url: banImageUrl.trim(),
      action_url: banActionUrl.trim() || null,
      sort_order: banSortOrder,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    const updated = [...banners, newBanner];
    setBanners(updated);
    saveStoredBanners(updated);

    setBanTitle('');
    setBanImageUrl('');
    setIsBannerModalOpen(false);
    setToastMessage(`Banner "${newBanner.title}" berhasil ditambahkan!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleCampaign = (id: string) => {
    const updated = campaigns.map((c) =>
      c.id === id ? { ...c, is_active: !c.is_active } : c
    );
    setCampaigns(updated);
    saveStoredCampaigns(updated);
    setToastMessage('Status kampanye diperbarui.');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleToggleBanner = (id: string) => {
    const updated = banners.map((b) =>
      b.id === id ? { ...b, is_active: !b.is_active } : b
    );
    setBanners(updated);
    saveStoredBanners(updated);
    setToastMessage('Status banner diperbarui.');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const getChannelBadge = (ch: MarketingCampaign['channel']) => {
    switch (ch) {
      case 'instagram_ads':
        return <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-[10px] font-bold">Instagram Ads</span>;
      case 'tiktok_organic':
        return <span className="bg-slate-900 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">TikTok Organic</span>;
      case 'brosur_kampus':
        return <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-[10px] font-bold">Brosur Kos Kampus</span>;
      case 'referral':
        return <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold">Program Referral</span>;
      case 'event_bazar':
        return <span className="bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full text-[10px] font-bold">Bazar / Event</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full text-[10px] font-bold">{ch}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Dashboard Marketing &amp; ROI
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">
              Bab 12 PRD
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500">
            Pelacakan efisiensi biaya promosi, rasio ROI omzet, dan manajemen banner aplikasi
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {activeTab === 'campaigns' ? (
            <button
              type="button"
              onClick={() => setIsCampaignModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl sm:rounded-2xl shadow-md shadow-sky-200 transition active:scale-95 w-full sm:w-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Buat Kampanye</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsBannerModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl sm:rounded-2xl shadow-md shadow-sky-200 transition active:scale-95 w-full sm:w-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Tambah Banner</span>
            </button>
          )}
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 shadow-sm flex items-center gap-2 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top ROI KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate block">
            Anggaran Promosi
          </span>
          <p className="text-base sm:text-2xl font-black font-mono text-slate-900 truncate">
            {formatRupiah(totalBudget)}
          </p>
          <p className="text-[9px] sm:text-[10px] text-slate-500 truncate">Modal iklan &amp; event</p>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate block">
            Diskon Diberikan
          </span>
          <p className="text-base sm:text-2xl font-black font-mono text-rose-600 truncate">
            {formatRupiah(totalDiscounts)}
          </p>
          <p className="text-[9px] sm:text-[10px] text-slate-500 truncate">Subsidi voucher promo</p>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate block">
            Omzet Kampanye
          </span>
          <p className="text-base sm:text-2xl font-black font-mono text-emerald-600 truncate">
            {formatRupiah(totalRevenue)}
          </p>
          <p className="text-[9px] sm:text-[10px] text-slate-500 truncate">Pendapatan laundry</p>
        </div>

        <div className="bg-gradient-to-br from-sky-500 to-sky-600 text-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-md shadow-sky-200 space-y-1">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-sky-100 flex items-center justify-between">
            <span className="truncate">Rasio ROI</span>
            <TrendingUp className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          </span>
          <p className="text-lg sm:text-2xl font-black font-mono truncate">{overallRoiRatio}x ROI</p>
          <p className="text-[9px] sm:text-[10px] text-sky-100 font-medium truncate">
            Laba: {formatRupiah(netMarketingProfit)}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-1.5 sm:gap-2 pb-1 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('campaigns')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-2xl border transition ${
            activeTab === 'campaigns'
              ? 'border-sky-500 bg-sky-50 text-sky-700 shadow-sm'
              : 'border-transparent text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analisis Kampanye ({campaigns.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('banners')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-2xl border transition ${
            activeTab === 'banners'
              ? 'border-sky-500 bg-sky-50 text-sky-700 shadow-sm'
              : 'border-transparent text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Banner Geser Web/PWA ({banners.length})</span>
        </button>
      </div>

      {/* TAB 1: CAMPAIGNS TABLE */}
      {activeTab === 'campaigns' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Kinerja Kampanye Pemasaran Multi-Channel
              </h3>
              <p className="text-xs text-slate-500">
                Setiap transaksi yang menggunakan kode promo kampanye otomatis tercatat ke tabel ini
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              {campaigns.filter((c) => c.is_active).length} Aktif
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Nama Kampanye</th>
                  <th className="py-3 px-4">Channel &amp; Kode</th>
                  <th className="py-3 px-4 text-right">Modal Anggaran</th>
                  <th className="py-3 px-4 text-right">Diskon Keluar</th>
                  <th className="py-3 px-4 text-right">Omzet Masuk</th>
                  <th className="py-3 px-4 text-center">ROI Ratio</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {campaigns.map((cmp) => {
                  const isHighRoi = cmp.roi_ratio >= 4.0;

                  return (
                    <tr key={cmp.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900">{cmp.title}</p>
                        <p className="text-[10px] text-slate-400">
                          {cmp.starts_at} s.d {cmp.ends_at}
                        </p>
                      </td>
                      <td className="py-3 px-4 space-y-1">
                        <div>{getChannelBadge(cmp.channel)}</div>
                        {cmp.promo_code && (
                          <span className="font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded text-[10px] block w-fit">
                            {cmp.promo_code}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-700">
                        {formatRupiah(cmp.budget_amount)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-rose-600">
                        {formatRupiah(cmp.total_discount_given)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                        {formatRupiah(cmp.total_revenue_generated)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`font-mono font-black text-xs px-2.5 py-1 rounded-xl ${
                            isHighRoi
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {cmp.roi_ratio.toFixed(1)}x
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            cmp.is_active
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {cmp.is_active ? 'Aktif' : 'Selesai'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleCampaign(cmp.id)}
                          className="text-xs font-semibold text-sky-600 hover:text-sky-800"
                        >
                          {cmp.is_active ? 'Tutup' : 'Buka'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: BANNERS GRID */}
      {activeTab === 'banners' && (
        <div className="space-y-4">
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-xs text-sky-900">
            Banner promosi di bawah ini ditampilkan di slider beranda pelanggan Web &amp; PWA SiKucek untuk menarik atensi pelanggan.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video w-full bg-slate-100">
                    <img
                      src={banner.image_url}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-slate-900/80 text-white rounded-md backdrop-blur-sm">
                        Urutan #{banner.sort_order}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {banner.title}
                    </h4>
                    {banner.action_url && (
                      <p className="text-[10px] text-sky-600 font-mono flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        Arah: {banner.action_url}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      banner.is_active
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {banner.is_active ? 'Tayang' : 'Disembunyikan'}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggleBanner(banner.id)}
                    className="text-xs font-bold text-slate-600 hover:text-sky-600 flex items-center gap-1"
                  >
                    <Power className="w-3.5 h-3.5" />
                    {banner.is_active ? 'Sembunyikan' : 'Tayangkan'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Buat Kampanye Baru */}
      {isCampaignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-sky-50/50">
              <h3 className="text-sm font-bold text-slate-800">
                Buat Kampanye Pemasaran Baru
              </h3>
              <button
                type="button"
                onClick={() => setIsCampaignModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Kampanye:
                </label>
                <input
                  type="text"
                  required
                  value={cmpTitle}
                  onChange={(e) => setCmpTitle(e.target.value)}
                  placeholder="Contoh: Iklan Meta Target Mahasiswa Kos"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Channel Pemasaran:
                  </label>
                  <select
                    value={cmpChannel}
                    onChange={(e) => setCmpChannel(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    <option value="instagram_ads">Instagram Ads</option>
                    <option value="tiktok_organic">TikTok Organic</option>
                    <option value="brosur_kampus">Brosur Kos Kampus</option>
                    <option value="referral">Program Referral</option>
                    <option value="event_bazar">Bazar / Event</option>
                    <option value="other">Channel Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Kode Promo Tracking:
                  </label>
                  <input
                    type="text"
                    value={cmpPromoCode}
                    onChange={(e) => setCmpPromoCode(e.target.value.toUpperCase())}
                    placeholder="Contoh: IGMHS26"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Anggaran Promosi (Rp):
                </label>
                <input
                  type="number"
                  required
                  value={cmpBudget}
                  onChange={(e) => setCmpBudget(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tanggal Mulai:
                  </label>
                  <input
                    type="date"
                    required
                    value={cmpStartsAt}
                    onChange={(e) => setCmpStartsAt(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tanggal Berakhir:
                  </label>
                  <input
                    type="date"
                    required
                    value={cmpEndsAt}
                    onChange={(e) => setCmpEndsAt(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCampaignModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold shadow-md shadow-sky-200 transition active:scale-95"
                >
                  Simpan Kampanye
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah Banner Baru */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-sky-50/50">
              <h3 className="text-sm font-bold text-slate-800">
                Tambah Banner Promosi Baru
              </h3>
              <button
                type="button"
                onClick={() => setIsBannerModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBanner} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Judul Banner Promosi:
                </label>
                <input
                  type="text"
                  required
                  value={banTitle}
                  onChange={(e) => setBanTitle(e.target.value)}
                  placeholder="Contoh: Diskon Kiloan 20% Sambut Ujian Semester"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  URL Gambar Banner:
                </label>
                <input
                  type="url"
                  required
                  value={banImageUrl}
                  onChange={(e) => setBanImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tautan Aksi (Action URL):
                  </label>
                  <input
                    type="text"
                    value={banActionUrl}
                    onChange={(e) => setBanActionUrl(e.target.value)}
                    placeholder="/#kalkulator atau /app"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Urutan Tayang:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={banSortOrder}
                    onChange={(e) => setBanSortOrder(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold shadow-md shadow-sky-200 transition active:scale-95"
                >
                  Simpan Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
