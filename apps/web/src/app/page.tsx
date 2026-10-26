'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Estimator from '../components/Estimator';
import Footer from '../components/Footer';
import {
  Search,
  Camera,
  MapPin,
  Gift,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  Shirt,
  Tag,
  Sparkles,
  Zap,
  Clock,
  ChevronRight,
  Check,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [trackingCode, setTrackingCode] = useState<string>('');
  
  // Perilaku Kursor Responsif:
  // Kalo GERAK -> isUserActive = true (Teks MUNCUL dengan animasi bertingkat / staggered)
  // Kalo DIEM  -> isUserActive = false (Teks MEMUDAR transparan, VIDEO TER-HIGHLIGHT 100%)
  const [isUserActive, setIsUserActive] = useState<boolean>(true);
  const [isLocked, setIsLocked] = useState<'none' | 'video' | 'text'>('none');
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const idleTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Inisialisasi timer idle awal saat pertama kali mount
  React.useEffect(() => {
    // Beri waktu 3.5 detik di awal agar user melihat teks awal, lalu jika diam, video otomatis memukau tersorot
    idleTimerRef.current = setTimeout(() => {
      if (isLocked === 'none' && !isInputFocused) {
        setIsUserActive(false);
      }
    }, 3500);

    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, [isLocked, isInputFocused]);

  const handleHeroMouseMove = () => {
    if (isLocked !== 'none') return;
    
    // Saat kursor GERAK: Teks LANGSUNG MUNCUL dengan animasi profesional!
    setIsUserActive(true);

    // Reset idle timer: saat kursor DIEM selama 2 detik, teks memudar transparan & video ter-highlight penuh
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    if (!isInputFocused) {
      idleTimerRef.current = setTimeout(() => {
        setIsUserActive(false);
      }, 2000);
    }
  };

  const handleHeroMouseLeave = () => {
    if (isLocked !== 'none') return;
    // Saat kursor meninggalkan section hero (misalnya kursor keluar window),
    // teks kembali ditampilkan agar user tetap bisa menavigasi dengan mudah
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    setIsUserActive(true);
  };

  const showText = isLocked === 'text' || (isLocked === 'none' && isUserActive);
  const highlightVideo = isLocked === 'video' || (isLocked === 'none' && !isUserActive);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = trackingCode.trim().toUpperCase();
    if (clean) {
      router.push(`/track/${clean}`);
    }
  };

  const setPresetCode = (code: string) => {
    setTrackingCode(code);
    router.push(`/track/${code}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 text-slate-900 overflow-x-hidden">
      <Navbar />

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION DENGAN LATAR VIDEO REMOTION & KURSOR DINAMIS PROFESIONAL  */}
        {/* ========================================================================= */}
        <section
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={handleHeroMouseLeave}
          className="relative pt-8 sm:pt-14 pb-20 sm:pb-28 min-h-[680px] sm:min-h-[760px] flex flex-col justify-center overflow-hidden bg-slate-50 transition-colors duration-500"
        >
          {/* Background Video Layer (Rendered with Remotion) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              poster="/videos/hero-poster.jpg"
              className={`w-full h-full object-cover transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                highlightVideo
                  ? 'opacity-100 scale-[1.02] filter brightness-105 saturate-110'
                  : 'opacity-65 scale-100 filter brightness-100'
              }`}
            >
              <source src="/videos/hero-loop.mp4" type="video/mp4" />
            </video>
            {/* Latar Overlay Halus: memudar saat kursor diam sehingga video ter-highlight penuh */}
            <div
              className={`absolute inset-0 bg-gradient-to-r from-white/95 via-sky-50/85 to-white/90 backdrop-blur-[0.5px] transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                highlightVideo ? 'opacity-0' : 'opacity-100'
              }`}
            />
          </div>

          {/* Animated Ambient Floating Accents */}
          <div className="absolute top-12 left-8 w-64 h-64 bg-sky-300/20 rounded-full blur-3xl pointer-events-none z-0" />
          <div className="absolute top-1/2 right-10 w-80 h-80 bg-purple-300/15 rounded-full blur-3xl pointer-events-none z-0" />
          <div className="absolute bottom-6 left-1/3 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl pointer-events-none z-0" />

          {/* Floating Interactive State Pill Controller */}
          <div className="absolute top-4 right-4 sm:right-8 z-30">
            <div
              className={`px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-heading font-black transition-all shadow-md flex items-center gap-2 backdrop-blur-md border ${
                highlightVideo
                  ? 'bg-sky-500/90 text-white border-sky-300 shadow-sky-500/30'
                  : 'bg-white/90 text-slate-700 border-slate-200/90 shadow-xs'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  highlightVideo ? 'bg-amber-300 animate-ping' : 'bg-emerald-500 animate-pulse'
                }`}
              />
              <span>
                {highlightVideo
                  ? '✨ Kursor Diam: Video Sedang Disorot'
                  : '🟢 Kursor Aktif: Teks Ditampilkan'}
              </span>

              {isLocked !== 'none' ? (
                <button
                  type="button"
                  onClick={() => setIsLocked('none')}
                  className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-all uppercase tracking-wider bg-amber-400 text-slate-950 shadow-xs hover:bg-amber-300 cursor-pointer"
                >
                  Buka Kunci
                </button>
              ) : (
                <div className="flex items-center gap-1 ml-1">
                  <button
                    type="button"
                    onClick={() => setIsLocked('video')}
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold transition-all uppercase tracking-wider bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-sky-800 cursor-pointer"
                  >
                    Sorot Video
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLocked('text')}
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold transition-all uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    Kunci Teks
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Floating Cinematic Hint Pill: Muncul anggun saat kursor diam & video disorot */}
          <div
            className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-30 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              highlightVideo
                ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
            }`}
          >
            <div
              onClick={() => {
                setIsLocked('none');
                setIsUserActive(true);
              }}
              className="group cursor-pointer px-4 py-2 rounded-full bg-slate-900/85 hover:bg-slate-900 text-white shadow-xl shadow-sky-500/20 border border-sky-400/40 backdrop-blur-md flex items-center gap-2.5 text-xs font-heading font-bold transition hover:scale-105 active:scale-95"
            >
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-400" />
              </span>
              <span>🎬 Mode Sorot Video: Gerakkan kursor untuk memunculkan teks</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-mono group-hover:bg-sky-400 group-hover:text-slate-950 transition">
                Buka Menu
              </span>
            </div>
          </div>

          {/* Content Hero Section: MUNCUL saat kursor gerak, MEMUDAR transparan saat kursor diam */}
          <div
            className={`max-w-6xl mx-auto px-4 sm:px-6 relative z-10 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              showText
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Headline, Description, Quick Tracker */}
              <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
                {/* Micro Badge */}
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/95 border border-sky-200/90 shadow-xs shadow-sky-100 backdrop-blur-md transform transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    showText
                      ? 'opacity-100 translate-y-0 scale-100 delay-0'
                      : 'opacity-0 -translate-y-3 scale-95 delay-0'
                  }`}
                >
                  <span className="flex h-2 w-2 rounded-full bg-sky-500 animate-ping" />
                  <span className="text-xs font-bold font-heading text-sky-800">
                    Sistem Operasi Laundry Generasi Baru
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-sky-100 text-sky-700">
                    v1.0 Live
                  </span>
                </div>

                {/* Main Hero Headline */}
                <h1
                  className={`text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-slate-950 tracking-tight leading-[1.16] transform transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    showText
                      ? 'opacity-100 translate-y-0 filter-none delay-[60ms]'
                      : 'opacity-0 translate-y-4 blur-[2px] delay-0'
                  }`}
                >
                  Laundry Bersih, Higienis, &amp; <span className="text-shimmer">Transparan</span> Tanpa Drama
                </h1>

                {/* Subtitle */}
                <p
                  className={`text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal transform transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    showText
                      ? 'opacity-100 translate-y-0 delay-[120ms]'
                      : 'opacity-0 translate-y-4 blur-[1px] delay-0'
                  }`}
                >
                  Pantau proses cucian secara real-time dari timbangan hingga nomor rak fisik. Dilengkapi bukti foto Quality Control (QC) anti-sengketa &amp; diskon loyalti stempel otomatis!
                </p>

                {/* Quick Tracking Search Bar */}
                <div
                  id="tracking-bar"
                  className={`pt-1 transform transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    showText
                      ? 'opacity-100 translate-y-0 scale-100 delay-[180ms]'
                      : 'opacity-0 translate-y-5 scale-[0.98] delay-0'
                  }`}
                >
                  <div className="bg-white/95 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl sm:rounded-full border border-sky-200/90 shadow-lg shadow-sky-500/10 max-w-2xl mx-auto lg:mx-0 transition-all focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-100">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-1.5">
                      <div className="relative flex-1 w-full flex items-center">
                        <Search className="w-5 h-5 text-sky-500 absolute left-3.5 shrink-0 pointer-events-none" />
                        <input
                          type="text"
                          value={trackingCode}
                          onFocus={() => setIsInputFocused(true)}
                          onBlur={() => setIsInputFocused(false)}
                          onChange={(e) => setTrackingCode(e.target.value)}
                          placeholder="Ketik no. resi (contoh: SKC-B8D02)"
                          className="w-full pl-10 pr-3 py-2.5 text-sm sm:text-base font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-sans placeholder:font-normal placeholder:tracking-normal placeholder:normal-case placeholder:text-xs sm:placeholder:text-sm bg-transparent border-none focus:outline-none uppercase font-mono tracking-wider"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-heading font-black text-white bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 rounded-xl sm:rounded-full shadow-md shadow-sky-500/25 flex items-center justify-center gap-2 whitespace-nowrap shrink-0 transition active:scale-95 cursor-pointer"
                      >
                        <span>Lacak Sekarang</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  </div>

                  {/* Preset Demo Code Chips */}
                  <div
                    className={`flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2 mt-2.5 text-xs text-slate-600 transform transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      showText
                        ? 'opacity-100 translate-y-0 delay-[220ms]'
                        : 'opacity-0 translate-y-3 delay-0'
                    }`}
                  >
                    <span className="font-bold text-slate-400 text-[11px] uppercase tracking-wider shrink-0">Demo:</span>
                    <button
                      type="button"
                      onClick={() => setPresetCode('SKC-B8D02')}
                      className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-800 font-semibold font-mono text-[11px] rounded-full border border-emerald-200/90 shadow-xs transition hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>SKC-B8D02 (Rak A2)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPresetCode('SKC-R4N1X')}
                      className="px-2.5 py-1 bg-white hover:bg-sky-50 text-sky-800 font-semibold font-mono text-[11px] rounded-full border border-sky-200/90 shadow-xs transition hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                      <span>SKC-R4N1X (Foto QC)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPresetCode('SKC-DEMO01')}
                      className="px-2.5 py-1 bg-white hover:bg-amber-50 text-amber-800 font-semibold font-mono text-[11px] rounded-full border border-amber-200/90 shadow-xs transition hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span>SKC-DEMO01 (Kupon 5Kg)</span>
                    </button>
                  </div>
                </div>

                {/* Key Metrics Stats */}
                <div
                  className={`pt-3 grid grid-cols-3 gap-2.5 sm:gap-4 border-t border-sky-100/90 max-w-lg mx-auto lg:mx-0 transform transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    showText
                      ? 'opacity-100 translate-y-0 scale-100 delay-[260ms]'
                      : 'opacity-0 translate-y-4 scale-95 delay-0'
                  }`}
                >
                  <div className="glass-panel p-2.5 sm:p-3 rounded-2xl text-center border border-white">
                    <p className="text-lg sm:text-xl font-black font-heading text-sky-600">100%</p>
                    <p className="text-[10px] sm:text-[11px] font-bold text-slate-600 mt-0.5">Transparansi QC</p>
                  </div>
                  <div className="glass-panel p-2.5 sm:p-3 rounded-2xl text-center border border-white">
                    <p className="text-lg sm:text-xl font-black font-heading text-amber-600">5 Stempel</p>
                    <p className="text-[10px] sm:text-[11px] font-bold text-slate-600 mt-0.5">Gratis 5 Kg</p>
                  </div>
                  <div className="glass-panel p-2.5 sm:p-3 rounded-2xl text-center border border-white">
                    <p className="text-lg sm:text-xl font-black font-heading text-emerald-600">0 Biaya</p>
                    <p className="text-[10px] sm:text-[11px] font-bold text-slate-600 mt-0.5">Pelacakan Publik</p>
                  </div>
                </div>
              </div>

              {/* Right Column: 3D Mascot Showcase Card */}
              <div className="lg:col-span-5 flex justify-center">
                <div
                  className={`relative w-full max-w-xs sm:max-w-sm transform transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    showText
                      ? 'opacity-100 translate-y-0 scale-100 rotate-0 delay-[140ms]'
                      : 'opacity-0 translate-y-6 scale-95 rotate-1 blur-[1px] delay-0'
                  }`}
                >
                  {/* Floating Mascot Card */}
                  <div className="glass-panel rounded-3xl p-4 sm:p-5 shadow-xl shadow-sky-400/15 relative z-10 text-center border-2 border-white/90 hover:shadow-glow-cyan transition-shadow duration-300">
                    {/* Visual Mascot Container */}
                    <div className="relative w-32 h-32 sm:w-36 sm:h-36 mx-auto rounded-2xl overflow-hidden border-2 border-white shadow-md shadow-sky-100 mb-2.5 group">
                      <Image
                        src="/logo-sikucek.jpg"
                        alt="Maskot Si Kucek"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-sky-950/20 via-transparent to-transparent pointer-events-none" />
                    </div>

                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-extrabold">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        Sahabat Pakaian Anda
                      </div>
                      <h3 className="text-base sm:text-lg font-black font-heading text-slate-900">
                        Kenalkan Si Kucek!
                      </h3>
                      <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed px-2 line-clamp-2">
                        Maskot ceria yang siap menyulap pakaian kotor Anda menjadi wangi lavender segar, higienis, dan kinclong rapi.
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100/80 grid grid-cols-2 gap-2 text-slate-700">
                      <div className="flex items-center gap-1.5 justify-center font-bold text-emerald-700 bg-emerald-50/80 p-1.5 rounded-xl text-[10px] sm:text-[11px]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                        <span>Deterjen Higienis</span>
                      </div>
                      <div className="flex items-center gap-1.5 justify-center font-bold text-sky-700 bg-sky-50/80 p-1.5 rounded-xl text-[10px] sm:text-[11px]">
                        <CheckCircle2 className="w-3 h-3 text-sky-500 flex-shrink-0" />
                        <span>Setrika Uap Presisi</span>
                      </div>
                    </div>
                  </div>

                  {/* Playful Floating Badges */}
                  <div className="absolute -top-2 -right-2 sm:-right-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[10px] sm:text-[11px] px-2.5 py-1 rounded-full shadow-md shadow-amber-300/40 border-2 border-white rotate-3 z-20 animate-pulse">
                    🎁 Gratis Cuci 5 Kg!
                  </div>
                  <div className="absolute -bottom-2 -left-2 sm:-left-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-[10px] sm:text-[11px] px-2.5 py-1 rounded-full shadow-md shadow-emerald-300/40 border-2 border-white -rotate-3 z-20">
                    📍 Cek Nomor Rak Instan
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seamless Bottom Gradient Blend: Menjamin air menyatu alami ke section berikutnya tanpa garis potong kotak */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 via-slate-50/70 to-transparent pointer-events-none z-10" />
        </section>

        {/* ========================================================================= */}
        {/* 2. REALTIME SOCIAL PROOF TICKER                                           */}
        {/* ========================================================================= */}
        <section className="bg-white/80 border-b border-sky-100/60 py-3.5 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-slate-800 font-bold">Live Status Outlet Sleman:</span>
                <span className="text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full font-bold">
                  Buka • 07.00 - 21.00 WIB
                </span>
              </div>
              <div className="hidden md:flex items-center gap-6 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-sky-500" /> 18+ Cucian Selesai Hari Ini
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-amber-500" /> 140+ Member Stamp Card
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-rose-500" /> 0 Sengketa Pakaian
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. BENTO GRID KEUNGGULAN (4 PILAR SIKUCEK)                                 */}
        {/* ========================================================================= */}
        <section id="keunggulan" className="py-16 sm:py-24 bg-slate-50/50 border-b border-sky-100/80 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-widest border border-sky-200">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                Standar Higienis &amp; Transparan
              </div>
              <h2 className="text-2xl sm:text-4xl font-heading font-black text-slate-950 mt-3">
                Mengapa Pelanggan Memilih SiKucek?
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2.5">
                Kami menghilangkan drama pakaian tertukar, luntur, dan robek dengan standardisasi alur digital modern.
              </p>
            </div>

            {/* Asymmetric Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Bento 1: Large Card - Foto QC Kamera Anti-Sengketa */}
              <div className="md:col-span-7 glass-panel glass-card-hover rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-white">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-200 mb-5">
                    <Camera className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                    Pilar Anti-Sengketa
                  </span>
                  <h3 className="text-xl sm:text-2xl font-heading font-black text-slate-900 mt-1">
                    Foto Kondisi Awal Kain (QC WebRTC)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed max-w-lg">
                    Jika ada kancing lepas, noda luntur, atau sobek sebelum dicuci, kasir langsung memotretnya via kamera WebRTC. Foto tersimpan transparan di link pelacakan Anda.
                  </p>
                </div>

                {/* Simulated Camera Viewfinder UI */}
                <div className="mt-6 bg-slate-950/90 rounded-2xl p-4 text-white relative overflow-hidden border border-slate-800 shadow-inner">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                    <span className="flex items-center gap-1.5 text-rose-400">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      REC • WEBRTC QC CAM
                    </span>
                    <span>1200x800 WEBP</span>
                  </div>
                  <div className="h-28 sm:h-36 rounded-xl bg-slate-900 relative flex items-center justify-center border border-slate-800/80">
                    {/* Viewfinder Crosshair */}
                    <div className="w-16 h-16 border-2 border-dashed border-rose-400/60 rounded-xl flex items-center justify-center">
                      <div className="w-2 h-2 bg-rose-500 rounded-full" />
                    </div>
                    <div className="absolute bottom-2 left-3 bg-rose-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      Deteksi: Sobek Saku Celana (3cm)
                    </div>
                  </div>
                </div>
              </div>

              {/* Bento 2: Medium Card - Nomor Rak Fisik Tertera */}
              <div className="md:col-span-5 glass-panel glass-card-hover rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-white">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center shadow-lg shadow-teal-200 mb-5">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
                    Pengambilan Cepat
                  </span>
                  <h3 className="text-xl sm:text-2xl font-heading font-black text-slate-900 mt-1">
                    Alokasi Rak Fisik Presisi
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    Saat cucian selesai dipacking, sistem kasir wajib menempatkan pakaian ke rak bernomor (misal: RAK-B02). Anda tinggal sebut nomor rak saat mengambil.
                  </p>
                </div>

                {/* Visual Rack Preview Box */}
                <div className="mt-6 bg-emerald-50 rounded-2xl p-4 border border-emerald-200/80 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Lokasi Rak Ambil</p>
                    <p className="text-2xl font-black font-mono text-emerald-700">RAK B-02</p>
                  </div>
                  <div className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Siap Diambil</span>
                  </div>
                </div>
              </div>

              {/* Bento 3: Medium Card - Stamp Card 5 Slot */}
              <div className="md:col-span-5 glass-panel glass-card-hover rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-white">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-200 mb-5">
                    <Gift className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                    Gamifikasi Retensi
                  </span>
                  <h3 className="text-xl sm:text-2xl font-heading font-black text-slate-900 mt-1">
                    Stamp Card (5 Stempel = Gratis 5 Kg)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    Setiap transaksi selesai otomatis menambah 1 stempel digital. Kumpulkan 5 stempel untuk klaim kupon cuci kiloan gratis hingga 5 kg!
                  </p>
                </div>

                {/* Stamp Card Visual Slots */}
                <div className="mt-6 bg-amber-50/80 rounded-2xl p-4 border border-amber-200/80">
                  <div className="flex items-center justify-between gap-1.5">
                    {[1, 2, 3, 4].map((slot) => (
                      <div key={slot} className="w-10 h-10 rounded-full bg-amber-400 border-2 border-white shadow-md flex items-center justify-center text-xs font-black text-slate-900">
                        ✓
                      </div>
                    ))}
                    <div className="w-11 h-11 rounded-full bg-amber-200 border-2 border-dashed border-amber-500 flex items-center justify-center text-xs font-bold text-amber-800 animate-pulse">
                      🎁 5Kg
                    </div>
                  </div>
                </div>
              </div>

              {/* Bento 4: Wide Card - Otomasi WhatsApp Baileys Engine */}
              <div className="md:col-span-7 glass-panel glass-card-hover rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-white">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 text-white flex items-center justify-center shadow-lg shadow-sky-200 mb-5">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                    Tanpa Wajib Download Aplikasi
                  </span>
                  <h3 className="text-xl sm:text-2xl font-heading font-black text-slate-900 mt-1">
                    Notifikasi WhatsApp Otomatis
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed max-w-lg">
                    Nota digital saat cucian masuk dan kabar gembira saat pakaian siap di rak otomatis terkirim ke WhatsApp Anda tanpa jeda waktu.
                  </p>
                </div>

                {/* Simulated WhatsApp Chat Bubble */}
                <div className="mt-6 bg-[#EFEAE2] rounded-2xl p-4 border border-[#DAD3C8] max-w-md">
                  <div className="bg-white rounded-xl p-3 shadow-sm text-xs text-slate-800 space-y-1 relative">
                    <p className="font-bold text-sky-800">SiKucek Laundry Sleman</p>
                    <p>Halo Kak! Pakaian Anda di order <strong>#SKC-B8D02</strong> sudah SELESAI di <strong>RAK B-02</strong>. Bersih, wangi, dan rapi dipacking!</p>
                    <p className="text-[10px] text-sky-600 underline font-mono">https://sikucek.app/track/SKC-B8D02</p>
                    <span className="text-[9px] text-slate-400 float-right">14:30 ✓✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. LIVE INTERACTIVE COST ESTIMATOR                                        */}
        {/* ========================================================================= */}
        <section id="kalkulator" className="py-16 sm:py-24 bg-white border-b border-sky-100/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-widest border border-amber-200">
                <Tag className="w-3.5 h-3.5 text-amber-600" />
                Transparansi Biaya
              </div>
              <h2 className="text-2xl sm:text-4xl font-heading font-black text-slate-950 mt-3">
                Kalkulator Estimasi Biaya Cucian
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2.5">
                Geser timbangan kiloan dan tambahkan pakaian satuan untuk mengetahui estimasi pengeluaran Anda secara instan.
              </p>
            </div>

            <Estimator />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. TARIF RESMI LAYANAN KILOAN & SATUAN                                   */}
        {/* ========================================================================= */}
        <section id="layanan" className="py-16 sm:py-24 bg-slate-50/50 border-b border-sky-100/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-widest border border-sky-200">
                <Shirt className="w-3.5 h-3.5 text-sky-600" />
                Daftar Harga Transparan
              </div>
              <h2 className="text-2xl sm:text-4xl font-heading font-black text-slate-950 mt-3">
                Tarif Kiloan &amp; Satuan Resmi
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2.5">
                Bersahabat untuk mahasiswa, kos, dan keluarga dengan garansi pewangi tahan lama.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Box Kiloan */}
              <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white shadow-xl shadow-sky-100">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-200">
                      <Shirt className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-heading font-black text-slate-900">
                        Paket Cuci Kiloan
                      </h3>
                      <p className="text-xs text-slate-500">Min. order 2.0 kg • Cuci, Kering &amp; Setrika Uap</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold font-mono">
                    Populer
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { name: 'Cuci Kering Setrika Reguler', duration: '48 Jam (2 Hari)', price: 'Rp 7.000 / kg', desc: 'Pilihan hemat harian pakaian santai' },
                    { name: 'Cuci Kering Setrika Express', duration: '24 Jam (1 Hari)', price: 'Rp 10.000 / kg', desc: 'Prioritas pengerjaan 1 hari selesai' },
                    { name: 'Cuci Kering Lipat Saja', duration: '48 Jam (2 Hari)', price: 'Rp 5.000 / kg', desc: 'Cocok untuk handuk, sprei, selimut tipis' },
                    { name: 'Setrika Uap Saja', duration: '48 Jam (2 Hari)', price: 'Rp 4.500 / kg', desc: 'Pakaian sudah dicuci sendiri di kos/rumah' },
                  ].map((srv, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white border border-sky-100/80 hover:border-sky-300 transition-all flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-bold text-slate-900 font-heading">{srv.name}</p>
                        <p className="text-xs text-slate-500">{srv.desc} • <span className="text-sky-700 font-semibold">{srv.duration}</span></p>
                      </div>
                      <span className="text-sm font-black font-mono text-sky-700 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200">
                        {srv.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box Satuan */}
              <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white shadow-xl shadow-amber-100">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-200">
                      <Tag className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-heading font-black text-slate-900">
                        Perawatan Pakaian Satuan
                      </h3>
                      <p className="text-xs text-slate-500">Kain formal, bed cover, tas &amp; alas kaki</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold font-mono">
                    Spesial
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { name: 'Kemeja Formal / Blus', unit: 'per pcs', price: 'Rp 6.000', desc: 'Kerah kaku rapi, hanger khusus' },
                    { name: 'Celana Jeans / Bahan Panjang', unit: 'per pcs', price: 'Rp 7.000', desc: 'Anti kusut & lipatan presisi' },
                    { name: 'Jas / Blazer Eksekutif', unit: 'per pcs', price: 'Rp 25.000', desc: 'Perawatan dry-clean steam halus' },
                    { name: 'Bed Cover King / Jumbo', unit: 'per pcs', price: 'Rp 30.000', desc: 'Pengeringan total anti bau apek' },
                    { name: 'Sepatu Sneakers / Canvas', unit: 'per pasang', price: 'Rp 25.000', desc: 'Deep cleaning sol & deep deodorizer' },
                  ].map((srv, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white border border-amber-100/80 hover:border-amber-300 transition-all flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-bold text-slate-900 font-heading">{srv.name}</p>
                        <p className="text-xs text-slate-500">{srv.desc} • <span className="text-amber-700 font-semibold">{srv.unit}</span></p>
                      </div>
                      <span className="text-sm font-black font-mono text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                        {srv.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. CALLOUT RETENSI & GAMIFIKASI PWA                                      */}
        {/* ========================================================================= */}
        <section className="py-16 sm:py-20 bg-gradient-to-r from-sky-600 via-sky-500 to-sky-700 text-white relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
              <div className="space-y-3 max-w-xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Program Retensi Pelanggan Setia
                </span>
                <h3 className="text-2xl sm:text-4xl font-heading font-black leading-tight">
                  Kumpulkan 5 Stempel &amp; Klaim Hadiah Gratis 5 Kg
                </h3>
                <p className="text-xs sm:text-sm text-sky-100 leading-relaxed font-normal">
                  Cukup login dengan nomor WhatsApp Anda di PWA SiKucek. Dapatkan poin streak harian, stempel otomatis saat cucian selesai, dan penukaran kupon diskon langsung.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/app"
                  className="px-6 py-3.5 bg-white hover:bg-sky-50 text-sky-800 font-heading font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl shadow-sky-900/30 transition hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <Gift className="w-4 h-4 text-amber-500" />
                  Buka Stamp Card PWA
                </Link>
                <Link
                  href="/track/SKC-DEMO01"
                  className="px-5 py-3.5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm rounded-2xl transition border border-white/30 backdrop-blur-md"
                >
                  Lihat Nota Kupon Demo
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
