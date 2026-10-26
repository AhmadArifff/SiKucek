import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
  interpolate,
  spring,
  random,
} from 'remotion';

// =============================================================================
// SUB-KOMPONEN 1: BUBBLE FIELD (DETERMINISTIK & LOOP-SAFE SESUAI NASKAH BAB 8)
// =============================================================================
const BubbleField: React.FC<{ count?: number; seed?: string }> = ({
  count = 50,
  seed = 'sikucek-master',
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const t = frame / durationInFrames;

  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      {Array.from({ length: count }, (_, i) => {
        const size = 10 + random(`${seed}-s-${i}`) * 65;
        const x = random(`${seed}-x-${i}`) * width;
        // Siklus bilangan bulat agar loop menyatu mulus di frame 0 dan 1499
        const cycles = 1 + Math.floor(random(`${seed}-c-${i}`) * 3);
        const phase = (t * cycles + random(`${seed}-o-${i}`)) % 1;
        const y = height + size - phase * (height + size * 2);
        const sway = Math.sin(2 * Math.PI * t * (cycles + 1) + i) * 16;
        const opacity = 0.15 + random(`${seed}-op-${i}`) * 0.45;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x + sway,
              top: y,
              width: size,
              height: size,
              borderRadius: '50%',
              border: '1.5px solid rgba(255, 255, 255, 0.75)',
              background:
                'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.7) 0%, rgba(56, 189, 248, 0.25) 60%, rgba(255, 255, 255, 0.05) 100%)',
              boxShadow: '0 4px 15px rgba(14, 165, 233, 0.15)',
              opacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// =============================================================================
// SUB-KOMPONEN 2: MASKOT SI KUCEK (VECTOR RIGGED EMBER BIRU TOSKA)
// =============================================================================
interface MascotProps {
  x: number;
  y: number;
  scale?: number;
  rotation?: number;
  action?: 'idle' | 'magnify' | 'thumbsup' | 'cheer';
}

const MascotSiKucek: React.FC<MascotProps> = ({
  x,
  y,
  scale = 1,
  rotation = 0,
  action = 'idle',
}) => {
  const frame = useCurrentFrame();
  const breath = Math.sin(frame * 0.1) * 3;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
        transformOrigin: 'center bottom',
        zIndex: 25,
        filter: 'drop-shadow(0 12px 25px rgba(14, 165, 233, 0.35))',
      }}
    >
      {/* Mahkota Busa Sabun */}
      <div style={{ position: 'relative', top: 12 + breath, left: -4 }}>
        <svg width="150" height="60" viewBox="0 0 150 60" fill="none">
          <ellipse cx="75" cy="38" rx="60" ry="18" fill="#ffffff" />
          <circle cx="42" cy="28" r="22" fill="#ffffff" />
          <circle cx="75" cy="20" r="25" fill="#ffffff" />
          <circle cx="108" cy="28" r="20" fill="#ffffff" />
          <ellipse cx="70" cy="14" rx="6" ry="3" fill="#e0f2fe" />
          <ellipse cx="40" cy="22" rx="5" ry="2.5" fill="#e0f2fe" />
          <ellipse cx="104" cy="22" rx="5" ry="2.5" fill="#e0f2fe" />
        </svg>
      </div>

      {/* Badan Ember */}
      <div style={{ position: 'relative', marginTop: -15 }}>
        <svg width="140" height="120" viewBox="0 0 140 120" fill="none">
          <defs>
            <linearGradient id="mBucketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="60%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>
          <ellipse cx="70" cy="18" rx="62" ry="13" fill="#bae6fd" stroke="#ffffff" strokeWidth="2.5" />
          <ellipse cx="70" cy="17" rx="56" ry="10" fill="#0284c7" />
          <path
            d="M 18,18 L 30,105 C 31,114 46,118 70,118 C 94,118 109,114 110,105 L 122,18 Z"
            fill="url(#mBucketGrad)"
            stroke="#ffffff"
            strokeWidth="3"
          />
          {/* Garis Aksen */}
          <path d="M 26,55 Q 70,65 114,55" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="2.5" fill="none" />
          <path d="M 29,82 Q 70,92 111,82" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="2.5" fill="none" />
          {/* Gagang */}
          <path d="M 14,24 C 14,-8 126,-8 126,24" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" fill="none" />
          {/* Mata & Senyum */}
          <ellipse cx="52" cy="50" rx="6.5" ry="9" fill="#0f172a" />
          <circle cx="50" cy="47" r="3" fill="#ffffff" />
          <ellipse cx="88" cy="50" rx="6.5" ry="9" fill="#0f172a" />
          <circle cx="86" cy="47" r="3" fill="#ffffff" />
          {/* Pipi Merona */}
          <ellipse cx="42" cy="57" rx="6" ry="3.5" fill="#f43f5e" opacity="0.5" />
          <ellipse cx="98" cy="57" rx="6" ry="3.5" fill="#f43f5e" opacity="0.5" />
          {/* Mulut Ceria */}
          <path d="M 60,58 Q 70,70 80,58" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="#e11d48" />
        </svg>

        {/* Aksesori Khusus Sesuai Action */}
        {action === 'magnify' && (
          <div style={{ position: 'absolute', right: -14, top: 40, transform: 'rotate(-15deg)' }}>
            <span style={{ fontSize: 32 }}>🔍</span>
          </div>
        )}
        {action === 'thumbsup' && (
          <div style={{ position: 'absolute', right: -12, top: 44, transform: 'rotate(10deg)' }}>
            <span style={{ fontSize: 30 }}>👍</span>
          </div>
        )}
        {action === 'cheer' && (
          <div style={{ position: 'absolute', right: -14, top: 20 }}>
            <span style={{ fontSize: 30 }}>✨</span>
          </div>
        )}
      </div>

      {/* Sepatu Bot Hijau Toska */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: -10 }}>
        <div style={{ width: 24, height: 16, borderRadius: '10px 10px 6px 6px', background: '#0d9488', border: '1.5px solid #ffffff' }} />
        <div style={{ width: 24, height: 16, borderRadius: '10px 10px 6px 6px', background: '#0d9488', border: '1.5px solid #ffffff' }} />
      </div>
    </div>
  );
};

// =============================================================================
// SUB-KOMPONEN 3: TABLET POS SHELL (FRAME TABLET RETINA DENGAN SHADOW MEWAH)
// =============================================================================
const TabletFrame: React.FC<{ children: React.ReactNode; width?: number; height?: number }> = ({
  children,
  width = 920,
  height = 580,
}) => {
  return (
    <div
      style={{
        width,
        height,
        background: '#0f172a',
        borderRadius: 36,
        padding: '16px 20px',
        boxShadow:
          '0 30px 80px rgba(15, 23, 42, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.15), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Notch & Kamera Depan Tablet */}
      <div
        style={{
          position: 'absolute',
          top: 8,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 80,
          height: 5,
          background: '#334155',
          borderRadius: 3,
        }}
      />
      {/* Layar Tablet */}
      <div
        style={{
          flex: 1,
          background: '#ffffff',
          borderRadius: 24,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {children}
      </div>
    </div>
  );
};

// =============================================================================
// SUB-KOMPONEN 4: SMARTPHONE SHELL (FRAME IPHONE 16 RETINA TINGKAT A)
// =============================================================================
const PhoneFrame: React.FC<{ children: React.ReactNode; width?: number; height?: number }> = ({
  children,
  width = 380,
  height = 700,
}) => {
  return (
    <div
      style={{
        width,
        height,
        background: '#0f172a',
        borderRadius: 48,
        padding: '14px 14px',
        boxShadow:
          '0 30px 75px rgba(14, 165, 233, 0.35), 0 0 0 2px rgba(255, 255, 255, 0.25), inset 0 2px 6px rgba(255, 255, 255, 0.2)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Dynamic Island Notch */}
      <div
        style={{
          position: 'absolute',
          top: 18,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 100,
          height: 24,
          background: '#000000',
          borderRadius: 14,
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 10px',
        }}
      >
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0284c7' }} />
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1e293b' }} />
      </div>

      {/* Layar Ponsel */}
      <div
        style={{
          flex: 1,
          background: '#f8fafc',
          borderRadius: 38,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {children}
      </div>
    </div>
  );
};

// =============================================================================
// KOMPONEN UTAMA: HERO BACKGROUND (50 DETIK / 1500 FRAME / 9 SCENES)
// =============================================================================
export const HeroBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Helper untuk spring animation
  const sp = (offset: number, config = { damping: 18, mass: 1 }) =>
    spring({ frame: Math.max(0, frame - offset), fps, config });

  // Current Scene Index (1 - 9)
  let currentScene = 1;
  if (frame >= 90 && frame < 300) currentScene = 2;
  else if (frame >= 300 && frame < 510) currentScene = 3;
  else if (frame >= 510 && frame < 630) currentScene = 4;
  else if (frame >= 630 && frame < 840) currentScene = 5;
  else if (frame >= 840 && frame < 1050) currentScene = 6;
  else if (frame >= 1050 && frame < 1200) currentScene = 7;
  else if (frame >= 1200 && frame < 1380) currentScene = 8;
  else if (frame >= 1380) currentScene = 9;

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 45%, #bae6fd 100%)',
        overflow: 'hidden',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* ======================================================================= */}
      {/* 1. LATAR BELAKANG GELEMBUNG SABUN MULTI-LAYER & RADIANT AURA            */}
      {/* ======================================================================= */}
      <BubbleField count={45} seed="sikucek-bg" />

      {/* Radiant Glowing Orbs */}
      <div
        style={{
          position: 'absolute',
          top: -100,
          right: '15%',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, rgba(56, 189, 248, 0) 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -150,
          right: '5%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.25) 0%, rgba(14, 165, 233, 0) 70%)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />

      {/* ======================================================================= */}
      {/* 2. SAFE ZONE DESKTOP (SISI KIRI 0 - 42% TENANG DAN BERSIH)              */}
      {/* ======================================================================= */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '42%',
          height: '100%',
          background:
            'linear-gradient(90deg, rgba(240, 249, 255, 0.92) 0%, rgba(240, 249, 255, 0.75) 75%, rgba(240, 249, 255, 0) 100%)',
          backdropFilter: 'blur(4px)',
          zIndex: 5,
          pointerEvents: 'none',
        }}
      />

      {/* ======================================================================= */}
      {/* 3. PANGGUNG AKSI UTAMA DI SISI KANAN (45% - 95% LEBAR LAYAR)            */}
      {/* ======================================================================= */}
      <div
        style={{
          position: 'absolute',
          left: '46%',
          top: 0,
          width: '52%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}
      >
        {/* --------------------------------------------------------------------- */}
        {/* SCENE 1: S1 HOOK (Frame 0 - 90 / 0s - 3s) Meja Kasir View             */}
        {/* --------------------------------------------------------------------- */}
        {frame < 90 && (
          <div
            style={{
              opacity: interpolate(frame, [0, 15, 75, 90], [0, 1, 1, 0]),
              transform: `scale(${interpolate(frame, [0, 90], [0.96, 1.02])})`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
            }}
          >
            {/* Meja Kasir Tampak Atas */}
            <div
              style={{
                width: 780,
                height: 480,
                background: '#ffffff',
                borderRadius: 32,
                border: '2px solid rgba(255, 255, 255, 0.9)',
                boxShadow: '0 25px 60px rgba(15, 23, 42, 0.15)',
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                padding: 32,
                gap: 24,
                position: 'relative',
              }}
            >
              {/* Sisi Kiri: Tablet Kasir Siap Pakai */}
              <div
                style={{
                  background: '#f8fafc',
                  borderRadius: 24,
                  border: '1.5px solid #e2e8f0',
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#0ea5e9' }} />
                  <span style={{ fontSize: 13, fontWeight: 900, color: '#0284c7' }}>
                    SiKucek POS v1.0 • Outlet Sukolilo
                  </span>
                </div>
                <div style={{ textAlign: 'center', margin: '30px 0' }}>
                  <div style={{ fontSize: 48 }}>🧺</div>
                  <h3 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', marginTop: 10 }}>
                    Siap Terima Cucian Baru
                  </h3>
                  <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                    Pelanggan: <strong style={{ color: '#0ea5e9' }}>Rani Kusuma</strong> tiba di kasir
                  </p>
                </div>
                <div
                  style={{
                    background: '#0ea5e9',
                    color: '#ffffff',
                    padding: '12px 20px',
                    borderRadius: 14,
                    textAlign: 'center',
                    fontWeight: 800,
                    fontSize: 14,
                  }}
                >
                  Mulai Pesanan Baru (+ Order)
                </div>
              </div>

              {/* Sisi Kanan: Timbangan Digital & Pakaian */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Timbangan Digital */}
                <div
                  style={{
                    background: '#0f172a',
                    color: '#38bdf8',
                    padding: 24,
                    borderRadius: 20,
                    boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', letterSpacing: 1 }}>
                    PRECISION DIGITAL SCALE
                  </div>
                  <div style={{ fontSize: 48, fontWeight: 900, fontFamily: 'monospace', margin: '8px 0' }}>
                    0.00 <span style={{ fontSize: 20 }}>KG</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#10b981', fontWeight: 700 }}>
                    ● TARE OK • SIAP TIMBANG
                  </div>
                </div>

                {/* Dua Kemeja Rani di Meja */}
                <div
                  style={{
                    background: '#f1f5f9',
                    borderRadius: 20,
                    padding: 20,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  <span style={{ fontSize: 36 }}>👔</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#1e293b' }}>
                      2 Pcs Kemeja + 1 Kantong Kiloan
                    </div>
                    <div style={{ fontSize: 12, color: '#f43f5e', fontWeight: 700, marginTop: 2 }}>
                      ⚠️ 1 Kemeja ada kerah sobek awal
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------------------- */}
        {/* SCENE 2: S2 INTAKE KASIR (Frame 90 - 300 / 3s - 10s) Hybrid Order     */}
        {/* --------------------------------------------------------------------- */}
        {frame >= 90 && frame < 300 && (
          <div
            style={{
              opacity: interpolate(frame, [90, 105, 285, 300], [0, 1, 1, 0]),
              transform: `scale(${interpolate(frame, [90, 110], [0.94, 1])})`,
            }}
          >
            <TabletFrame width={900} height={560}>
              {/* Header POS */}
              <div
                style={{
                  padding: '16px 24px',
                  background: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#0ea5e9' }} />
                  <span style={{ fontSize: 15, fontWeight: 900, color: '#0f172a' }}>
                    SiKucek POS • Order Baru (/orders/new)
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 8 }}>
                    Kasir: Budi
                  </span>
                  <span style={{ background: '#dcfce7', color: '#15803d', fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 8 }}>
                    Senin, 26 Okt 2026
                  </span>
                </div>
              </div>

              {/* Body Form Intake Hybrid */}
              <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 24 }}>
                {/* Kolom Kiri: Input Pelanggan & Layanan */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Autocomplete Pelanggan */}
                  <div style={{ background: '#f0f9ff', padding: 14, borderRadius: 16, border: '1.5px solid #bae6fd' }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#0284c7' }}>
                      PELANGGAN (0857 1122 3345)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                      <span style={{ fontSize: 16, fontWeight: 900, color: '#0f172a' }}>Rani Kusuma</span>
                      <span style={{ background: '#fef3c7', color: '#92400e', fontSize: 10, fontWeight: 900, padding: '2px 8px', borderRadius: 6 }}>
                        Tier Busa Baru (4/5 Stempel)
                      </span>
                    </div>
                  </div>

                  {/* Kiloan: Cuci Kering Setrika 2 Hari */}
                  <div style={{ background: '#ffffff', padding: 14, borderRadius: 16, border: '1.5px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 900, color: '#1e293b' }}>
                          Cuci Kering Setrika (2 Hari)
                        </div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>Rp7.000 / Kg</div>
                      </div>
                      <div
                        style={{
                          background: '#0f172a',
                          color: '#38bdf8',
                          padding: '6px 14px',
                          borderRadius: 10,
                          fontFamily: 'monospace',
                          fontSize: 18,
                          fontWeight: 900,
                        }}
                      >
                        {frame > 140 ? '3.20' : '0.00'} KG
                      </div>
                    </div>
                  </div>

                  {/* Satuan: Kemeja 2 Pcs */}
                  <div style={{ background: '#ffffff', padding: 14, borderRadius: 16, border: '1.5px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 900, color: '#1e293b' }}>Kemeja (Satuan)</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>Rp5.000 / Pcs</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: 8, fontWeight: 900, fontSize: 14 }}>
                          {frame > 180 ? '2' : '0'} pcs
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Catatan Khusus */}
                  <div style={{ fontSize: 11, color: '#475569', background: '#f8fafc', padding: '8px 12px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                    📝 Catatan: <strong>Pisahkan baju putih</strong>
                  </div>
                </div>

                {/* Kolom Kanan: Rincian Kalkulasi Tabular */}
                <div
                  style={{
                    background: '#f8fafc',
                    borderRadius: 20,
                    padding: 20,
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 900, color: '#64748b', marginBottom: 12 }}>
                      RINCIAN NOTA HYBRID
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                      <span style={{ color: '#475569' }}>Kiloan (3.20 kg @ 7k)</span>
                      <strong style={{ fontFamily: 'monospace' }}>Rp22.400</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                      <span style={{ color: '#475569' }}>Satuan (2 pcs @ 5k)</span>
                      <strong style={{ fontFamily: 'monospace' }}>Rp10.000</strong>
                    </div>
                    <div style={{ height: 1, background: '#cbd5e1', margin: '14px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>TOTAL BERSIH</span>
                      <span style={{ fontSize: 24, fontWeight: 900, color: '#0284c7', fontFamily: 'monospace' }}>
                        Rp32.400
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      background: '#0ea5e9',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: '12px',
                      borderRadius: 14,
                      fontWeight: 900,
                      fontSize: 14,
                    }}
                  >
                    Lanjut ke Foto Kondisi QC (WebRTC) ➔
                  </div>
                </div>
              </div>
            </TabletFrame>
          </div>
        )}

        {/* --------------------------------------------------------------------- */}
        {/* SCENE 3: S3 FOTO QC (Frame 300 - 510 / 10s - 17s) Viewfinder WebRTC   */}
        {/* --------------------------------------------------------------------- */}
        {frame >= 300 && frame < 510 && (
          <div
            style={{
              opacity: interpolate(frame, [300, 315, 495, 510], [0, 1, 1, 0]),
              transform: `scale(${interpolate(frame, [300, 320], [0.94, 1])})`,
            }}
          >
            <TabletFrame width={900} height={560}>
              <div style={{ padding: '16px 24px', background: '#0f172a', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 900, color: '#38bdf8' }}>
                  📸 Modul QC WebRTC • Foto Kondisi Awal Pakaian
                </span>
                <span style={{ background: '#f43f5e', color: '#ffffff', fontSize: 10, fontWeight: 900, padding: '3px 8px', borderRadius: 6 }}>
                  ANTI-SENGKETA
                </span>
              </div>

              <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, flex: 1 }}>
                {/* Viewfinder Kamera WebRTC */}
                <div
                  style={{
                    background: '#1e293b',
                    borderRadius: 20,
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Foto Kerah Kemeja Sobek */}
                  <div style={{ textAlign: 'center', color: '#ffffff' }}>
                    <div style={{ fontSize: 72 }}>👔</div>
                    <div style={{ fontSize: 14, fontWeight: 800, marginTop: 4, color: '#f87171' }}>
                      Sobek 3 cm pada Kerah Kanan
                    </div>
                  </div>

                  {/* Laser Scan & Bracket Fokus */}
                  <div
                    style={{
                      position: 'absolute',
                      width: 160,
                      height: 160,
                      border: '2px dashed #38bdf8',
                      borderRadius: 16,
                      animation: 'pulse 1s infinite',
                    }}
                  />
                  {/* Toast WebP 412 KB */}
                  {frame > 370 && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 14,
                        left: 14,
                        background: 'rgba(15, 23, 42, 0.85)',
                        color: '#10b981',
                        padding: '6px 12px',
                        borderRadius: 8,
                        fontSize: 11,
                        fontWeight: 800,
                      }}
                    >
                      ✓ Terkompresi WebP 412 KB (Bucket: qc-photos)
                    </div>
                  )}
                </div>

                {/* Tagging Cacat & Keterangan */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 900, color: '#64748b', marginBottom: 8 }}>
                      PILIH JENIS CACAT AWAL
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                      <span style={{ background: '#f43f5e', color: '#ffffff', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 900 }}>
                        ✓ Robek (Torn)
                      </span>
                      <span style={{ background: '#f1f5f9', color: '#64748b', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                        Noda Membandel
                      </span>
                      <span style={{ background: '#f1f5f9', color: '#64748b', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                        Luntur Awal
                      </span>
                      <span style={{ background: '#f1f5f9', color: '#64748b', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                        Kancing Hilang
                      </span>
                    </div>

                    <div style={{ background: '#f8fafc', padding: 14, borderRadius: 14, border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b' }}>CATATAN QC:</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginTop: 4 }}>
                        Kerah kanan sobek 3 cm sebelum dicuci.
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      background: '#10b981',
                      color: '#ffffff',
                      textAlign: 'center',
                      padding: 12,
                      borderRadius: 14,
                      fontWeight: 900,
                      fontSize: 14,
                    }}
                  >
                    Simpan Bukti QC &amp; Bayar ➔
                  </div>
                </div>
              </div>

              {/* Maskot Kaca Pembesar Si Kucek di Pojok */}
              <MascotSiKucek x={830} y={100} scale={0.7} action="magnify" />
            </TabletFrame>
          </div>
        )}

        {/* --------------------------------------------------------------------- */}
        {/* SCENE 4: S4 PEMBAYARAN QRIS (Frame 510 - 630 / 17s - 21s)             */}
        {/* --------------------------------------------------------------------- */}
        {frame >= 510 && frame < 630 && (
          <div
            style={{
              opacity: interpolate(frame, [510, 525, 615, 630], [0, 1, 1, 0]),
              display: 'flex',
              alignItems: 'center',
              gap: 40,
            }}
          >
            {/* Modal Pembayaran QRIS */}
            <div
              style={{
                width: 440,
                background: '#ffffff',
                borderRadius: 28,
                padding: 28,
                boxShadow: '0 25px 60px rgba(15, 23, 42, 0.25)',
                border: '2px solid #e2e8f0',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 900, color: '#0284c7', letterSpacing: 0.5 }}>
                PEMBAYARAN DIGITAL QRIS
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', fontFamily: 'monospace', margin: '8px 0' }}>
                Rp32.400
              </div>

              {/* Barcode QRIS Box */}
              <div
                style={{
                  width: 200,
                  height: 200,
                  margin: '16px auto',
                  background: '#f8fafc',
                  border: '2px solid #0f172a',
                  borderRadius: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <span style={{ fontSize: 100 }}>🏁</span>
                {frame > 560 && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(16, 185, 129, 0.92)',
                      borderRadius: 14,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                    }}
                  >
                    <span style={{ fontSize: 48 }}>✓</span>
                    <strong style={{ fontSize: 18, fontWeight: 900 }}>LUNAS</strong>
                  </div>
                )}
              </div>

              <div style={{ fontSize: 12, color: '#64748b' }}>
                No. Order: <strong style={{ color: '#0ea5e9' }}>SKC-261026-0042</strong>
              </div>
            </div>

            {/* Ponsel Pemindai QRIS */}
            <PhoneFrame width={320} height={520}>
              <div style={{ padding: 20, textAlign: 'center', marginTop: 40 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#16a34a' }}>Aplikasi Pembayaran QRIS</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: '14px 0' }}>
                  Bayar Rp32.400
                </div>
                <div style={{ background: '#dcfce7', color: '#15803d', padding: '10px 16px', borderRadius: 12, fontSize: 12, fontWeight: 800 }}>
                  ✓ Transaksi Berhasil
                </div>
              </div>
            </PhoneFrame>
          </div>
        )}

        {/* --------------------------------------------------------------------- */}
        {/* SCENE 5: S5 DI BALIK LAYAR (Frame 630 - 840 / 21s - 28s) Arsitektur   */}
        {/* --------------------------------------------------------------------- */}
        {frame >= 630 && frame < 840 && (
          <div
            style={{
              opacity: interpolate(frame, [630, 645, 825, 840], [0, 1, 1, 0]),
              display: 'flex',
              alignItems: 'center',
              gap: 30,
            }}
          >
            {/* Diagram Arsitektur Glassmorphism */}
            <div
              style={{
                width: 480,
                background: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(16px)',
                borderRadius: 28,
                padding: 24,
                boxShadow: '0 25px 60px rgba(15, 23, 42, 0.15)',
                border: '2px solid rgba(255, 255, 255, 0.8)',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 900, color: '#0ea5e9', marginBottom: 14 }}>
                ⚡ DI BALIK LAYAR: AUTOMATION ENGINE
              </div>

              {/* Node Pipeline */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f8fafc', padding: 10, borderRadius: 12 }}>
                  <span>🖥️</span>
                  <span style={{ fontSize: 12, fontWeight: 800 }}>1. Kasir POS Simpan Order</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f8fafc', padding: 10, borderRadius: 12 }}>
                  <span>🗄️</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800 }}>2. Database Supabase</div>
                    <div style={{ fontSize: 10, color: '#10b981' }}>RLS Policy • Bucket qc-photos</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f8fafc', padding: 10, borderRadius: 12 }}>
                  <span>⚡</span>
                  <span style={{ fontSize: 12, fontWeight: 800 }}>3. Database Trigger Antrean WA</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#ecfdf5', padding: 10, borderRadius: 12, border: '1px solid #a7f3d0' }}>
                  <span>🤖</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 900, color: '#047857' }}>4. Worker Baileys Terkirim</div>
                    <div style={{ fontSize: 10, color: '#059669' }}>Terkirim dalam 6 detik (Batas: 15s)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ponsel Rani Menerima Pesan Masuk WhatsApp */}
            <PhoneFrame width={360} height={580}>
              <div style={{ background: '#075e54', padding: '14px 16px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#25d366' }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 900 }}>SiKucek Official</div>
                  <div style={{ fontSize: 10, opacity: 0.8 }}>Online • Verified</div>
                </div>
              </div>
              <div style={{ padding: 16 }}>
                <div
                  style={{
                    background: '#ffffff',
                    padding: 14,
                    borderRadius: 14,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    fontSize: 12,
                    lineHeight: 1.5,
                    color: '#1e293b',
                  }}
                >
                  Halo <strong>Kak Rani Kusuma</strong>! 🧺
                  <br /><br />
                  Terima kasih sudah mencuci di SiKucek.
                  <br />
                  No. Pesanan: <strong style={{ color: '#0284c7' }}>SKC-261026-0042</strong>
                  <br />
                  Total: <strong>Rp32.400 (LUNAS)</strong>
                  <br /><br />
                  Pantau proses cucian Kakak secara transparan di:
                  <div style={{ color: '#0284c7', fontWeight: 800, marginTop: 4 }}>
                    👉 sikucek.app/track/KCK-7F3A9Q
                  </div>
                </div>
              </div>
            </PhoneFrame>
          </div>
        )}

        {/* --------------------------------------------------------------------- */}
        {/* SCENE 6: S6 PELACAKAN PUBLIK (Frame 840 - 1050 / 28s - 35s) PWA Lacak  */}
        {/* --------------------------------------------------------------------- */}
        {frame >= 840 && frame < 1050 && (
          <div
            style={{
              opacity: interpolate(frame, [840, 855, 1035, 1050], [0, 1, 1, 0]),
            }}
          >
            <PhoneFrame width={390} height={640}>
              {/* Header PWA */}
              <div style={{ padding: '14px 18px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 900, color: '#0ea5e9' }}>
                  SiKucek. <span style={{ color: '#94a3b8', fontSize: 10 }}>PWA Track</span>
                </span>
                <span style={{ background: '#dcfce7', color: '#15803d', fontSize: 10, fontWeight: 900, padding: '2px 8px', borderRadius: 6 }}>
                  LUNAS
                </span>
              </div>

              {/* Konten Pelacakan */}
              <div style={{ padding: 18, overflowY: 'hidden' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b' }}>KODE LACAK:</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', fontFamily: 'monospace' }}>
                  KCK-7F3A9Q
                </div>

                {/* Stepper 7 Tahap Animatif */}
                <div style={{ margin: '16px 0', background: '#f0f9ff', padding: 14, borderRadius: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 900, color: '#0284c7', marginBottom: 8 }}>
                    STATUS CUCIAN REAL-TIME:
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 800 }}>
                    <span style={{ color: '#10b981' }}>✓ Diterima</span>
                    <span style={{ color: frame > 900 ? '#10b981' : '#0ea5e9' }}>
                      {frame > 900 ? '✓ Cuci' : '● Cuci'}
                    </span>
                    <span style={{ color: frame > 950 ? '#10b981' : '#0ea5e9' }}>
                      {frame > 950 ? '✓ Kering' : '● Kering'}
                    </span>
                    <span style={{ color: frame > 1000 ? '#10b981' : '#94a3b8' }}>
                      {frame > 1000 ? '✓ Setrika' : '○ Setrika'}
                    </span>
                  </div>
                </div>

                {/* Galeri Bukti QC Foto Kerah Sobek */}
                <div style={{ background: '#ffffff', padding: 14, borderRadius: 16, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 11, fontWeight: 900, color: '#f43f5e', marginBottom: 6 }}>
                    ⚠️ BUKTI QC FOTO CACAT AWAL:
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 64, height: 64, background: '#1e293b', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                      👔
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#1e293b' }}>
                        Kerah Kemeja Kanan
                      </div>
                      <div style={{ fontSize: 10, color: '#f43f5e' }}>
                        Sobek 3 cm sebelum dicuci
                      </div>
                      <div style={{ fontSize: 9, color: '#94a3b8', marginTop: 2 }}>
                        Bebas Sengketa • Tersimpan di Cloud
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </PhoneFrame>
          </div>
        )}

        {/* --------------------------------------------------------------------- */}
        {/* SCENE 7: S7 SIAP AMBIL & VALIDASI RAK (Frame 1050 - 1200 / 35s - 40s) */}
        {/* --------------------------------------------------------------------- */}
        {frame >= 1050 && frame < 1200 && (
          <div
            style={{
              opacity: interpolate(frame, [1050, 1065, 1185, 1200], [0, 1, 1, 0]),
              display: 'flex',
              alignItems: 'center',
              gap: 30,
            }}
          >
            {/* Tablet Kasir: Modal Wajib Rak */}
            <div
              style={{
                width: 460,
                background: '#ffffff',
                borderRadius: 24,
                padding: 24,
                boxShadow: '0 25px 60px rgba(15, 23, 42, 0.2)',
                border: '2px solid #e2e8f0',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 900, color: '#0f172a', marginBottom: 12 }}>
                📦 Selesaikan Cucian &amp; Alokasi Rak
              </div>

              {/* Simulasi Rak Fisik B-02 */}
              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 16, border: '1.5px solid #cbd5e1', marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b' }}>PILIH SLOT RAK:</div>
                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  <div style={{ flex: 1, padding: 12, borderRadius: 12, background: '#10b981', color: '#ffffff', textAlign: 'center', fontWeight: 900 }}>
                    ✓ RAK B-02 (Dipilih)
                  </div>
                  <div style={{ flex: 1, padding: 12, borderRadius: 12, background: '#f1f5f9', color: '#94a3b8', textAlign: 'center', fontWeight: 700 }}>
                    RAK B-03
                  </div>
                </div>
              </div>

              <div style={{ background: '#0ea5e9', color: '#ffffff', textAlign: 'center', padding: 12, borderRadius: 12, fontWeight: 900 }}>
                Konfirmasi Siap Ambil &amp; Kirim WA ➔
              </div>
            </div>

            {/* Ponsel Rani Menerima Notifikasi Siap Ambil */}
            <PhoneFrame width={340} height={540}>
              <div style={{ padding: 20, textAlign: 'center', marginTop: 30 }}>
                <div style={{ fontSize: 48 }}>🎉</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: '#15803d', margin: '10px 0' }}>
                  Cucian Kakak Sudah Selesai!
                </div>
                <div
                  style={{
                    background: '#dcfce7',
                    border: '2px solid #86efac',
                    padding: 16,
                    borderRadius: 16,
                    color: '#166534',
                    fontWeight: 900,
                    fontSize: 20,
                  }}
                >
                  📍 LOKASI: RAK B-02
                </div>
                <p style={{ fontSize: 11, color: '#64748b', marginTop: 12 }}>
                  Silakan tunjukkan kode QR atau sebutkan Rak B-02 kepada kasir kami.
                </p>
              </div>
            </PhoneFrame>
          </div>
        )}

        {/* --------------------------------------------------------------------- */}
        {/* SCENE 8: S8 LOYALTI & HADIAH STEMPEL (Frame 1200 - 1380 / 40s - 46s)  */}
        {/* --------------------------------------------------------------------- */}
        {frame >= 1200 && frame < 1380 && (
          <div
            style={{
              opacity: interpolate(frame, [1200, 1215, 1365, 1380], [0, 1, 1, 0]),
            }}
          >
            <PhoneFrame width={400} height={660}>
              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <span style={{ fontSize: 14, fontWeight: 900, color: '#0f172a' }}>
                    SiKucek Member Club
                  </span>
                  <span style={{ background: '#fef3c7', color: '#b45309', fontSize: 11, fontWeight: 900, padding: '3px 10px', borderRadius: 8 }}>
                    {frame > 1300 ? '140 Poin' : '120 Poin'}
                  </span>
                </div>

                {/* Kartu Stempel Loyalti 5 Slot */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                    borderRadius: 20,
                    padding: 20,
                    color: '#ffffff',
                    boxShadow: '0 12px 30px rgba(2, 132, 199, 0.3)',
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 800, opacity: 0.85 }}>KARTU STEMPEL LOYALTI</div>
                  <div style={{ fontSize: 15, fontWeight: 900, margin: '4px 0 14px 0' }}>
                    {frame > 1250 ? '🎉 5/5 Stempel Terkumpul Penuh!' : '4/5 Stempel Terkumpul'}
                  </div>

                  {/* 5 Slot Koin */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🪙</div>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🪙</div>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🪙</div>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🪙</div>
                    {/* Slot ke-5 distempel */}
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: frame > 1250 ? '#fbbf24' : 'rgba(255,255,255,0.2)',
                        border: '2px dashed #ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20,
                        transform: `scale(${frame > 1250 ? 1.1 : 1})`,
                        transition: 'transform 0.3s ease',
                      }}
                    >
                      {frame > 1250 ? '🪙' : '5'}
                    </div>
                  </div>
                </div>

                {/* Hadiah Kupon Gratis Cuci 5 Kg */}
                {frame > 1260 && (
                  <div
                    style={{
                      marginTop: 16,
                      background: '#ecfdf5',
                      border: '2px solid #a7f3d0',
                      borderRadius: 16,
                      padding: 16,
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 900, color: '#047857' }}>
                      🎁 KUPON REWARD TERBIT:
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 900, color: '#065f46', marginTop: 4 }}>
                      Gratis Cuci Kiloan Maksimal 5 Kg
                    </div>
                    <div style={{ fontSize: 10, color: '#059669', marginTop: 2 }}>
                      (Otomatis memotong porsi kiloan berikutnya)
                    </div>
                  </div>
                )}

                {/* Daily Check-in Claim */}
                <div
                  style={{
                    marginTop: 16,
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 16,
                    padding: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#1e293b' }}>
                      Daily Check-in Hari ke-3
                    </div>
                    <div style={{ fontSize: 10, color: '#b45309', fontWeight: 700 }}>
                      +20 Poin Si Kucek
                    </div>
                  </div>
                  <span style={{ background: '#0ea5e9', color: '#ffffff', fontSize: 11, fontWeight: 900, padding: '6px 14px', borderRadius: 10 }}>
                    {frame > 1300 ? '✓ Diklaim' : 'Klaim'}
                  </span>
                </div>
              </div>
            </PhoneFrame>
          </div>
        )}

        {/* --------------------------------------------------------------------- */}
        {/* SCENE 9: S9 OUTRO & SEAMLESS LOOP (Frame 1380 - 1500 / 46s - 50s)     */}
        {/* --------------------------------------------------------------------- */}
        {frame >= 1380 && (
          <div
            style={{
              opacity: interpolate(frame, [1380, 1400, 1485, 1500], [0, 1, 1, 0]),
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 16,
            }}
          >
            <MascotSiKucek x={0} y={-80} scale={1.2} action="cheer" />
            <h2 style={{ fontSize: 36, fontWeight: 900, color: '#0f172a', letterSpacing: -1 }}>
              SiKucek.
            </h2>
            <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '6px 20px', borderRadius: 20, fontSize: 13, fontWeight: 800 }}>
              Solusi Laundry Pintar, Cepat, Higienis, dan Transparan
            </div>
            <p style={{ fontSize: 13, color: '#64748b', maxWidth: 440 }}>
              Antar cucian Anda sekarang atau lacak progres secara publik tanpa login!
            </p>
          </div>
        )}
      </div>

      {/* ======================================================================= */}
      {/* 4. CINEMATIC BOTTOM SUBTITLE RIBBON (PANDUAN 9 ADENGAN REAL-TIME)       */}
      {/* ======================================================================= */}
      <div
        style={{
          position: 'absolute',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(15, 23, 42, 0.88)',
          color: '#ffffff',
          padding: '10px 28px',
          borderRadius: 30,
          border: '1.5px solid rgba(56, 189, 248, 0.45)',
          boxShadow: '0 15px 35px rgba(15, 23, 42, 0.3)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          zIndex: 30,
        }}
      >
        <span style={{ fontSize: 18 }}>🎬</span>
        <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: 0.3 }}>
          {currentScene === 1 && 'S1: Suasana Meja Kasir & Kedatangan Pelanggan Rani Kusuma'}
          {currentScene === 2 && 'S2: Intake Kasir Hybrid - Timbang 3.20 Kg + 2 Kemeja (Rp32.400)'}
          {currentScene === 3 && 'S3: Bukti Foto WebRTC Kerah Sobek 3cm (Anti-Sengketa WebP 412KB)'}
          {currentScene === 4 && 'S4: Pembayaran QRIS Lunas & No. Order SKC-261026-0042 Terbit'}
          {currentScene === 5 && 'S5: Di Balik Layar - Database Supabase & Notifikasi WA 6 Detik'}
          {currentScene === 6 && 'S6: Pelacakan Publik PWA Tanpa Login - Stepper 7 Tahap & Galeri QC'}
          {currentScene === 7 && 'S7: Alokasi Wajib RAK B-02 & Pesan Siap Ambil Meluncur'}
          {currentScene === 8 && 'S8: Loyalti 5/5 Stempel Selesai, Klaim Gratis Cuci 5 Kg & Check-in'}
          {currentScene === 9 && 'S9: SiKucek - Solusi Laundry Pintar, Cepat, Higienis, & Transparan'}
        </span>
        <span
          style={{
            background: '#0ea5e9',
            color: '#ffffff',
            fontSize: 10,
            fontWeight: 900,
            padding: '3px 8px',
            borderRadius: 8,
            fontFamily: 'monospace',
          }}
        >
          {Math.floor(frame / 30)}s / 50s
        </span>
      </div>
    </AbsoluteFill>
  );
};
