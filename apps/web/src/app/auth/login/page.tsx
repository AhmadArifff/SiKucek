'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/image';
import NextLink from 'next/link';
import Image from 'next/image';
import {
  MessageCircle,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  RotateCcw,
} from 'lucide-react';
import {
  loginWithPhone,
  saveCustomerSession,
  DEMO_PRESET_CUSTOMERS,
  type CustomerSession,
} from '../../../lib/customer-auth';

export default function CustomerLoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('8829');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const clean = phoneNumber.replace(/\D/g, '');
    if (clean.length < 9) {
      setErrorMsg('Harap masukkan nomor WhatsApp yang valid (minimal 10 digit).');
      return;
    }

    setLoading(true);
    // Simulate OTP generation
    setTimeout(() => {
      const generated = Math.floor(1000 + Math.random() * 9000).toString();
      setSimulatedOtp(generated);
      setOtpStep(true);
      setLoading(false);
      setCountdown(60);
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (otpCode !== simulatedOtp && otpCode !== '1234' && otpCode !== '8829') {
      setErrorMsg(`Kode verifikasi tidak sesuai. Gunakan kode demo: ${simulatedOtp}`);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      loginWithPhone(phoneNumber, customerName);
      setLoading(false);
      router.push('/app');
    }, 500);
  };

  const handleQuickDemoLogin = (preset: CustomerSession) => {
    saveCustomerSession(preset);
    router.push('/app');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50/60 flex flex-col justify-between text-slate-800">
      {/* Top Header */}
      <header className="px-4 py-4 sm:px-8 border-b border-sky-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <NextLink href="/" className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-sky-400 shadow-sm">
              <Image
                src="/logo-sikucek.jpg"
                alt="Logo SiKucek"
                fill
                className="object-cover"
                priority
              />
            </div>
            <span className="font-extrabold text-lg bg-gradient-to-r from-sky-600 to-sky-700 bg-clip-text text-transparent">
              SiKucek
            </span>
          </NextLink>

          <NextLink
            href="/#tracking-bar"
            className="flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-800 px-3 py-1.5 rounded-xl hover:bg-sky-50 transition"
          >
            <Search className="w-3.5 h-3.5" />
            Lacak Resi Tanpa Login
          </NextLink>
        </div>
      </header>

      {/* Main Login Form Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xl shadow-sky-100/50">
            {/* Mascot & Greeting */}
            <div className="text-center mb-6">
              <div className="relative w-16 h-16 mx-auto mb-3 rounded-2xl overflow-hidden border-2 border-sky-300 shadow-md shadow-sky-200">
                <Image
                  src="/logo-sikucek.jpg"
                  alt="Maskot Si Kucek"
                  fill
                  className="object-cover"
                />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {otpStep ? 'Verifikasi Kode OTP' : 'Masuk ke Portal Pelanggan'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {otpStep
                  ? `Kode verifikasi 4-digit telah disimulasikan untuk ${phoneNumber}`
                  : 'Akses stamp card digital, dompet kupon gratis 5 kg, dan pantau cucian Anda.'}
              </p>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {!otpStep ? (
              /* Step 1: Input WhatsApp Phone Number */
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nomor WhatsApp Aktif
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <MessageCircle className="w-4 h-4 text-emerald-500" />
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Contoh: 0812-3456-7890"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nama Panggilan (Opsional jika baru)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Contoh: Rani Maharani"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-black text-sm rounded-2xl shadow-md shadow-sky-200 transition active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    'Memproses...'
                  ) : (
                    <>
                      Kirim Kode OTP via WhatsApp
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Step 2: Input OTP Verification */
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-center">
                  <span className="text-[11px] font-bold text-amber-800 block">
                    Mode Simulasi Kode OTP:
                  </span>
                  <span className="text-xl font-mono font-black text-amber-900 tracking-widest">
                    {simulatedOtp}
                  </span>
                  <p className="text-[10px] text-amber-700 mt-0.5">
                    (Masukkan kode 4 digit di atas atau klik auto-fill)
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 text-center">
                    Masukkan 4 Digit Kode
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Contoh: 8829"
                    required
                    autoFocus
                    className="w-full text-center text-2xl font-mono font-black tracking-widest py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                  <button
                    type="button"
                    onClick={() => setOtpCode(simulatedOtp)}
                    className="text-sky-600 hover:text-sky-700 font-bold hover:underline"
                  >
                    Auto-fill Kode
                  </button>
                  <button
                    type="button"
                    onClick={() => setOtpStep(false)}
                    className="text-slate-500 hover:text-slate-700 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Ganti Nomor
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-black text-sm rounded-2xl shadow-md shadow-sky-200 transition active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    'Memverifikasi...'
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-sky-200" />
                      Verifikasi & Masuk Dashboard
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Quick Demo Login Preset Buttons */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-1.5 mb-3 text-xs font-black text-slate-600">
                <Sparkles className="w-4 h-4 text-amber-500" />
                1-Klik Demo Login Cepat (Pengujian):
              </div>
              <div className="space-y-2">
                {DEMO_PRESET_CUSTOMERS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleQuickDemoLogin(preset)}
                    className="w-full text-left p-3 rounded-2xl border border-sky-100 hover:border-sky-300 bg-sky-50/40 hover:bg-sky-50 transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-white border border-sky-200 flex items-center justify-center font-black text-sky-700 text-xs shadow-sm">
                        {preset.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-black text-slate-800">
                            {preset.name}
                          </p>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-white border border-slate-200 text-slate-600">
                            {preset.tierLabel}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {preset.phone} &bull; {preset.pointsBalance} Poin
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-sky-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Security Note */}
          <div className="mt-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-500" />
            <span>Koneksi aman SSL &bull; Tanpa password rumit</span>
          </div>
        </div>
      </main>

      {/* Footer minimal */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-sky-50 bg-white/50">
        &copy; {new Date().getFullYear()} SiKucek Laundry Operating System. Solusi Cepat, Higienis &amp; Transparan.
      </footer>
    </div>
  );
}
