'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Lock,
  User,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  KeyRound,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import {
  loginStaff,
  getStoredStaffUser,
  saveStoredStaffUser,
  DEMO_STAFF_USERS,
  StaffUser,
} from '../../lib/auth-store';

export default function StaffLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect to home
  useEffect(() => {
    const existing = getStoredStaffUser();
    if (existing) {
      router.push('/');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = loginStaff(identifier, password);
      setIsLoading(false);

      if (res.success && res.user) {
        router.push('/');
      } else {
        setErrorMessage(res.error || 'Autentikasi gagal. Silakan periksa kembali.');
      }
    }, 400);
  };

  const handleQuickLogin = (user: StaffUser) => {
    saveStoredStaffUser(user);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 flex items-center justify-center p-4">
      {/* Decorative Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="relative w-20 h-20 mx-auto rounded-3xl overflow-hidden border-2 border-sky-400 shadow-xl shadow-sky-500/20 bg-white">
            <Image
              src="/logo-sikucek.jpg"
              alt="Maskot Si Kucek"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl font-black text-white tracking-tight">
                SiKucek<span className="text-sky-400"> POS</span>
              </h1>
              <span className="text-[10px] font-black uppercase tracking-wider bg-sky-500 text-white px-2 py-0.5 rounded-full">
                Sistem Kasir &amp; Admin
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Portal Otentikasi Staf, Operator Mesin, &amp; Pemilik Outlet
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 space-y-5">
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs text-rose-700 font-medium animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email / Nomor WhatsApp / ID Staf
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Contoh: owner@sikucek.app"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                PIN Staf / Kata Sandi (Default: 123456)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan PIN 6 digit"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg shadow-sky-500/25 transition active:scale-95 flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Memverifikasi Sesi...' : 'Masuk ke Aplikasi Kasir'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Preset Buttons */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block text-center">
              Akses Cepat Pengujian (1-Klik):
            </span>

            <div className="space-y-2">
              {DEMO_STAFF_USERS.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleQuickLogin(user)}
                  className="w-full p-2.5 rounded-2xl border border-slate-200 hover:border-sky-400 bg-slate-50 hover:bg-sky-50/50 flex items-center justify-between transition text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${user.avatar_color}`}
                    >
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-sky-700">
                        {user.name}
                      </p>
                      <p className="text-[10px] text-slate-600">{user.role_title}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 group-hover:border-sky-300 group-hover:text-sky-600">
                    Pilih &rarr;
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Security Note Footer */}
        <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Sesi terenkripsi &amp; terlindungi hak akses role-based</span>
        </div>
      </div>
    </div>
  );
}
