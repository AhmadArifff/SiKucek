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
// 1. BUBBLE FIELD (DETERMINISTIK & LOOP-SAFE SESUAI NASKAH BAB 8)
// =============================================================================
const BubbleField: React.FC<{ count?: number; seed?: string }> = ({
  count = 45,
  seed = 'sikucek-panoramic',
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const t = frame / durationInFrames;

  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      {Array.from({ length: count }, (_, i) => {
        const size = 12 + random(`${seed}-s-${i}`) * 60;
        const x = random(`${seed}-x-${i}`) * width;
        const cycles = 1 + Math.floor(random(`${seed}-c-${i}`) * 3);
        const phase = (t * cycles + random(`${seed}-o-${i}`)) % 1;
        const y = height + size - phase * (height + size * 2);
        const sway = Math.sin(2 * Math.PI * t * (cycles + 1) + i) * 18;
        const opacity = 0.12 + random(`${seed}-op-${i}`) * 0.4;

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
              border: '1.5px solid rgba(255, 255, 255, 0.7)',
              background:
                'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.75) 0%, rgba(56, 189, 248, 0.25) 55%, rgba(255, 255, 255, 0.05) 100%)',
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
// 2. MASKOT SI KUCEK (VECTOR RIGGED EMBER BIRU TOSKA CERIA)
// =============================================================================
interface MascotProps {
  x: number;
  y: number;
  scale?: number;
  rotation?: number;
  action?: 'idle' | 'magnify' | 'thumbsup' | 'cheer' | 'jump';
}

const MascotSiKucek: React.FC<MascotProps> = ({
  x,
  y,
  scale = 1,
  rotation = 0,
  action = 'idle',
}) => {
  const frame = useCurrentFrame();
  const breath = Math.sin(frame * 0.12) * 3.5;
  const jumpOffset = action === 'jump' ? -Math.abs(Math.sin(frame * 0.2)) * 25 : 0;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + jumpOffset,
        transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
        transformOrigin: 'center bottom',
        zIndex: 25,
        filter: 'drop-shadow(0 14px 28px rgba(14, 165, 233, 0.35))',
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
            <linearGradient id="pBucketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="60%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>
          <ellipse cx="70" cy="18" rx="62" ry="13" fill="#bae6fd" stroke="#ffffff" strokeWidth="2.5" />
          <ellipse cx="70" cy="17" rx="56" ry="10" fill="#0284c7" />
          <path
            d="M 18,18 L 30,105 C 31,114 46,118 70,118 C 94,118 109,114 110,105 L 122,18 Z"
            fill="url(#pBucketGrad)"
            stroke="#ffffff"
            strokeWidth="3"
          />
          <path d="M 26,55 Q 70,65 114,55" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="2.5" fill="none" />
          <path d="M 29,82 Q 70,92 111,82" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="2.5" fill="none" />
          <path d="M 14,24 C 14,-8 126,-8 126,24" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" fill="none" />
          <ellipse cx="52" cy="50" rx="6.5" ry="9" fill="#0f172a" />
          <circle cx="50" cy="47" r="3" fill="#ffffff" />
          <ellipse cx="88" cy="50" rx="6.5" ry="9" fill="#0f172a" />
          <circle cx="86" cy="47" r="3" fill="#ffffff" />
          <ellipse cx="42" cy="57" rx="6" ry="3.5" fill="#f43f5e" opacity="0.5" />
          <ellipse cx="98" cy="57" rx="6" ry="3.5" fill="#f43f5e" opacity="0.5" />
          <path d="M 60,58 Q 70,70 80,58" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="#e11d48" />
        </svg>

        {action === 'magnify' && (
          <div style={{ position: 'absolute', right: -16, top: 38, transform: 'rotate(-15deg)' }}>
            <span style={{ fontSize: 34 }}>🔍</span>
          </div>
        )}
        {(action === 'thumbsup' || action === 'cheer' || action === 'jump') && (
          <div style={{ position: 'absolute', right: -14, top: 32 }}>
            <span style={{ fontSize: 32 }}>👍</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: -10 }}>
        <div style={{ width: 24, height: 16, borderRadius: '10px 10px 6px 6px', background: '#0d9488', border: '1.5px solid #ffffff' }} />
        <div style={{ width: 24, height: 16, borderRadius: '10px 10px 6px 6px', background: '#0d9488', border: '1.5px solid #ffffff' }} />
      </div>
    </div>
  );
};

// =============================================================================
// 3. TABLET POS FRAME (PERANGKAT KASIR BUDI DI SISI KANAN)
// =============================================================================
const TabletFrame: React.FC<{ children: React.ReactNode; width?: number; height?: number }> = ({
  children,
  width = 820,
  height = 540,
}) => {
  return (
    <div
      style={{
        width,
        height,
        background: '#0f172a',
        borderRadius: 34,
        padding: '14px 18px',
        boxShadow:
          '0 25px 70px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 7,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 70,
          height: 4,
          background: '#334155',
          borderRadius: 2,
        }}
      />
      <div
        style={{
          flex: 1,
          background: '#ffffff',
          borderRadius: 22,
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
// 4. SMARTPHONE RETINA FRAME (PONSEL RANI KUSUMA)
// =============================================================================
const PhoneFrame: React.FC<{ children: React.ReactNode; width?: number; height?: number }> = ({
  children,
  width = 360,
  height = 640,
}) => {
  return (
    <div
      style={{
        width,
        height,
        background: '#0f172a',
        borderRadius: 44,
        padding: '12px 12px',
        boxShadow:
          '0 25px 65px rgba(14, 165, 233, 0.35), 0 0 0 2px rgba(255, 255, 255, 0.25), inset 0 2px 6px rgba(255, 255, 255, 0.2)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 90,
          height: 22,
          background: '#000000',
          borderRadius: 12,
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 8px',
        }}
      >
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0284c7' }} />
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#1e293b' }} />
      </div>

      <div
        style={{
          flex: 1,
          background: '#f8fafc',
          borderRadius: 34,
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
// 5. KOMPONEN UTAMA: HERO BACKGROUND PANORAMIK SEIMBANG (1920x1080)
// =============================================================================
export const HeroBackground: React.FC = () => {
  const frame = useCurrentFrame();

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
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
        overflow: 'hidden',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Gelembung Sabun Ambient di Seluruh Layar */}
      <BubbleField count={50} seed="sikucek-main-loop" />

      {/* Radiant Glowing Orbs di Kiri dan Kanan */}
      <div
        style={{
          position: 'absolute',
          top: -80,
          left: '10%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.28) 0%, rgba(56, 189, 248, 0) 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -100,
          right: '8%',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.25) 0%, rgba(14, 165, 233, 0) 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      {/* ======================================================================= */}
      {/* KANVAS PANORAMIK 2 ZONA: KIRI (FISIK/OUTLET) & KANAN (DIGITAL/DEVICE)    */}
      {/* ======================================================================= */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          padding: '40px 60px 100px 60px',
          gap: 40,
          alignItems: 'center',
          zIndex: 10,
        }}
      >
        {/* ===================================================================== */}
        {/* ZONA KIRI: DUNIA FISIK & OPERASIONAL OUTLET (TIMBANGAN, RAK, MESIN)    */}
        {/* ===================================================================== */}
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {/* SCENE 1: Meja Kasir & Timbangan Awal */}
          {frame < 90 && (
            <div
              style={{
                width: '100%',
                maxWidth: 620,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(16px)',
                borderRadius: 28,
                padding: 30,
                boxShadow: '0 20px 50px rgba(15, 23, 42, 0.12)',
                border: '2px solid rgba(255, 255, 255, 0.95)',
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                opacity: interpolate(frame, [0, 15, 75, 90], [0, 1, 1, 0]),
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 32 }}>🏪</span>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a' }}>
                    Meja Kasir SiKucek Sukolilo
                  </h3>
                  <p style={{ fontSize: 13, color: '#64748b' }}>
                    Pelanggan <strong>Rani Kusuma</strong> tiba membawa cucian
                  </p>
                </div>
              </div>

              {/* Timbangan Digital Presisi */}
              <div
                style={{
                  background: '#0f172a',
                  borderRadius: 20,
                  padding: 24,
                  textAlign: 'center',
                  boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.6)',
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 800, color: '#94a3b8', letterSpacing: 1 }}>
                  TIMBANGAN DIGITAL RESMI OUTLET
                </div>
                <div style={{ fontSize: 52, fontWeight: 900, fontFamily: 'monospace', color: '#38bdf8', margin: '8px 0' }}>
                  0.00 <span style={{ fontSize: 24 }}>KG</span>
                </div>
                <div style={{ fontSize: 12, color: '#10b981', fontWeight: 800 }}>
                  ● STATUS TARE: SIAP TERIMA CUCIAN
                </div>
              </div>

              <div style={{ display: 'flex', gap: 14 }}>
                <div style={{ flex: 1, background: '#f1f5f9', padding: 14, borderRadius: 14, textAlign: 'center' }}>
                  <div style={{ fontSize: 24 }}>🧺</div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#1e293b', marginTop: 4 }}>
                    1 Tas Laundry Kiloan
                  </div>
                </div>
                <div style={{ flex: 1, background: '#f1f5f9', padding: 14, borderRadius: 14, textAlign: 'center' }}>
                  <div style={{ fontSize: 24 }}>👔</div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#1e293b', marginTop: 4 }}>
                    2 Pcs Kemeja Satuan
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCENE 2: Timbangan Mengukur Beban Pakaian (0.00 -> 3.20 KG) */}
          {frame >= 90 && frame < 300 && (
            <div
              style={{
                width: '100%',
                maxWidth: 620,
                background: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(16px)',
                borderRadius: 28,
                padding: 30,
                boxShadow: '0 20px 50px rgba(15, 23, 42, 0.12)',
                border: '2px solid rgba(255, 255, 255, 0.95)',
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                opacity: interpolate(frame, [90, 105, 285, 300], [0, 1, 1, 0]),
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 900, color: '#0ea5e9' }}>
                  ⚖️ PROSES PENIMBANGAN FISIK
                </span>
                <span style={{ background: '#dcfce7', color: '#15803d', fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 8 }}>
                  Akurat Sensor Load Cell
                </span>
              </div>

              {/* Timbangan Digital Display */}
              <div
                style={{
                  background: '#0f172a',
                  borderRadius: 20,
                  padding: 24,
                  textAlign: 'center',
                  boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.6)',
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 800, color: '#94a3b8' }}>BERAT RIIL PAKAIAN</div>
                <div style={{ fontSize: 60, fontWeight: 900, fontFamily: 'monospace', color: '#38bdf8', margin: '6px 0' }}>
                  {frame > 140 ? '3.20' : '1.45'} <span style={{ fontSize: 26 }}>KG</span>
                </div>
                <div style={{ fontSize: 12, color: '#38bdf8', fontWeight: 800 }}>
                  Cuci Kering Setrika 2 Hari @ Rp7.000 = Rp22.400
                </div>
              </div>

              {/* Satuan Kemeja Fisik */}
              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 16, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 32 }}>👔</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: '#0f172a' }}>2 Kemeja Satuan</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>Rp5.000 x 2 = Rp10.000</div>
                  </div>
                </div>
                <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: 13, fontWeight: 900, padding: '6px 14px', borderRadius: 10 }}>
                  2 Pcs
                </span>
              </div>

              {/* Total Nota Fisik */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f0f9ff', borderRadius: 14, border: '1px solid #bae6fd' }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#0369a1' }}>TOTAL NOTA:</span>
                <span style={{ fontSize: 24, fontWeight: 900, color: '#0284c7', fontFamily: 'monospace' }}>
                  Rp32.400
                </span>
              </div>
            </div>
          )}

          {/* SCENE 3: Kemeja Fisik dengan Sobek 3cm Disorot Laser WebRTC */}
          {frame >= 300 && frame < 510 && (
            <div
              style={{
                width: '100%',
                maxWidth: 620,
                background: 'rgba(15, 23, 42, 0.95)',
                color: '#ffffff',
                borderRadius: 28,
                padding: 30,
                boxShadow: '0 25px 60px rgba(15, 23, 42, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                position: 'relative',
                overflow: 'hidden',
                opacity: interpolate(frame, [300, 315, 495, 510], [0, 1, 1, 0]),
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 900, color: '#38bdf8' }}>
                  👔 INSPEKSI FISIK: KEMEJA RANI
                </span>
                <span style={{ background: '#f43f5e', color: '#ffffff', fontSize: 11, fontWeight: 900, padding: '4px 10px', borderRadius: 8 }}>
                  BUKTI KONDISI AWAL
                </span>
              </div>

              {/* Visual Kemeja dengan Sobek Kerah */}
              <div
                style={{
                  height: 240,
                  background: '#1e293b',
                  borderRadius: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  border: '2px dashed rgba(56, 189, 248, 0.4)',
                }}
              >
                <span style={{ fontSize: 80 }}>👔</span>
                <div style={{ background: '#f43f5e', color: '#ffffff', fontSize: 12, fontWeight: 900, padding: '6px 14px', borderRadius: 20, marginTop: 8 }}>
                  ⚠️ Kerah Kanan Sobek 3 cm
                </div>

                {/* Laser Scanning Cyan Beam */}
                <div
                  style={{
                    position: 'absolute',
                    top: `${40 + Math.sin(frame * 0.1) * 30}%`,
                    left: '15%',
                    width: '70%',
                    height: 2,
                    background: '#38bdf8',
                    boxShadow: '0 0 12px #38bdf8, 0 0 24px #38bdf8',
                  }}
                />
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: 14, borderRadius: 14, fontSize: 12, color: '#94a3b8' }}>
                📸 Foto otomatis diunggah ke cloud bucket <strong>qc-photos</strong> (WebP 412 KB). Mencegah sengketa ganti rugi!
              </div>

              <MascotSiKucek x={520} y={100} scale={0.7} action="magnify" />
            </div>
          )}

          {/* SCENE 4: Kasir QRIS & Pembayaran Lunas */}
          {frame >= 510 && frame < 630 && (
            <div
              style={{
                width: '100%',
                maxWidth: 620,
                background: '#ffffff',
                borderRadius: 28,
                padding: 32,
                boxShadow: '0 25px 60px rgba(15, 23, 42, 0.18)',
                textAlign: 'center',
                opacity: interpolate(frame, [510, 525, 615, 630], [0, 1, 1, 0]),
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 900, color: '#0ea5e9' }}>
                PEMBAYARAN RESMI QRIS
              </div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', fontFamily: 'monospace', margin: '10px 0' }}>
                Rp32.400
              </div>

              {/* Barcode Box */}
              <div
                style={{
                  width: 220,
                  height: 220,
                  margin: '16px auto',
                  background: '#f8fafc',
                  border: '2px solid #0f172a',
                  borderRadius: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <span style={{ fontSize: 110 }}>🏁</span>
                {frame > 565 && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(16, 185, 129, 0.94)',
                      borderRadius: 18,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                    }}
                  >
                    <span style={{ fontSize: 54 }}>✓</span>
                    <strong style={{ fontSize: 22, fontWeight: 900 }}>LUNAS</strong>
                  </div>
                )}
              </div>

              <div style={{ fontSize: 13, color: '#64748b' }}>
                No. Order: <strong style={{ color: '#0284c7' }}>SKC-261026-0042</strong>
              </div>
            </div>
          )}

          {/* SCENE 5: Peta Arsitektur Sistem Otomasi SiKucek */}
          {frame >= 630 && frame < 840 && (
            <div
              style={{
                width: '100%',
                maxWidth: 620,
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(16px)',
                borderRadius: 28,
                padding: 26,
                boxShadow: '0 25px 60px rgba(15, 23, 42, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                opacity: interpolate(frame, [630, 645, 825, 840], [0, 1, 1, 0]),
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 900, color: '#0ea5e9', marginBottom: 6 }}>
                ⚡ DI BALIK LAYAR: AUTOMATION PIPELINE
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f8fafc', padding: 12, borderRadius: 14 }}>
                <span style={{ fontSize: 24 }}>🖥️</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 900 }}>1. Kasir POS Simpan Order</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Data tervalidasi Zod Schema</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f8fafc', padding: 12, borderRadius: 14 }}>
                <span style={{ fontSize: 24 }}>🗄️</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 900 }}>2. Database Supabase PostgreSQL</div>
                  <div style={{ fontSize: 11, color: '#10b981' }}>RLS Policy • Storage Bucket qc-photos</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f8fafc', padding: 12, borderRadius: 14 }}>
                <span style={{ fontSize: 24 }}>⚡</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 900 }}>3. Database Trigger Antrean WA</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Tabel public.whatsapp_queue</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#ecfdf5', padding: 12, borderRadius: 14, border: '1.5px solid #a7f3d0' }}>
                <span style={{ fontSize: 24 }}>🤖</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: '#047857' }}>4. Worker Baileys Terkirim Otomatis</div>
                  <div style={{ fontSize: 11, color: '#059669', fontWeight: 700 }}>Terkirim dalam 6 detik ke ponsel pelanggan!</div>
                </div>
              </div>
            </div>
          )}

          {/* SCENE 6: Drum Mesin Cuci Berputar 1200 RPM (Proses Fisik Nyata) */}
          {frame >= 840 && frame < 1050 && (
            <div
              style={{
                width: '100%',
                maxWidth: 620,
                background: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(16px)',
                borderRadius: 28,
                padding: 30,
                boxShadow: '0 25px 60px rgba(15, 23, 42, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: 16,
                opacity: interpolate(frame, [840, 855, 1035, 1050], [0, 1, 1, 0]),
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 900, color: '#0ea5e9' }}>
                  🌀 PROSES PENCUCIAN &amp; SANITASI
                </span>
                <span style={{ background: '#0f172a', color: '#38bdf8', fontSize: 11, fontWeight: 900, padding: '4px 10px', borderRadius: 8 }}>
                  1200 RPM • 40°C
                </span>
              </div>

              {/* Drum Mesin Cuci Berputar */}
              <div
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, #38bdf8 0%, #0284c7 100%)',
                  border: '8px solid #e2e8f0',
                  boxShadow: '0 15px 40px rgba(14, 165, 233, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `rotate(${frame * 12}deg)`,
                }}
              >
                <span style={{ fontSize: 72 }}>👕</span>
              </div>

              <div style={{ fontSize: 14, fontWeight: 800, color: '#1e293b' }}>
                Ozon Higienis &amp; Setrika Uap Lavender
              </div>
              <p style={{ fontSize: 12, color: '#64748b', maxWidth: 420 }}>
                Status di PWA bergerak maju secara sinkron dengan mesin di outlet tanpa perlu refresh halaman.
              </p>
            </div>
          )}

          {/* SCENE 7: Rak Fisik Outlet (RAK B-02 Menyala LED Hijau) */}
          {frame >= 1050 && frame < 1200 && (
            <div
              style={{
                width: '100%',
                maxWidth: 620,
                background: '#ffffff',
                borderRadius: 28,
                padding: 30,
                boxShadow: '0 25px 60px rgba(15, 23, 42, 0.18)',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                opacity: interpolate(frame, [1050, 1065, 1185, 1200], [0, 1, 1, 0]),
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 900, color: '#0ea5e9' }}>
                  📦 RAK PENYIMPANAN FISIK OUTLET
                </span>
                <span style={{ background: '#dcfce7', color: '#15803d', fontSize: 11, fontWeight: 900, padding: '4px 10px', borderRadius: 8 }}>
                  Anti-Tertukar
                </span>
              </div>

              {/* Grid 4 Slot Rak Fisik */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div style={{ background: '#f8fafc', padding: 18, borderRadius: 16, border: '1.5px solid #e2e8f0', textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: '#64748b', fontWeight: 800 }}>SLOT RAK A-01</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#94a3b8', marginTop: 4 }}>Tersedia</div>
                </div>

                {/* RAK B-02 Terpilih & Menyala Hijau */}
                <div
                  style={{
                    background: '#ecfdf5',
                    padding: 18,
                    borderRadius: 16,
                    border: '2.5px solid #10b981',
                    textAlign: 'center',
                    boxShadow: '0 10px 25px rgba(16, 185, 129, 0.25)',
                  }}
                >
                  <div style={{ fontSize: 12, color: '#047857', fontWeight: 800 }}>SLOT RAK B-02</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#047857', marginTop: 4 }}>
                    ✓ CUCIAN RANI
                  </div>
                  <div style={{ fontSize: 10, color: '#059669', marginTop: 2 }}>Siap Ambil (Packing Rapi)</div>
                </div>

                <div style={{ background: '#f8fafc', padding: 18, borderRadius: 16, border: '1.5px solid #e2e8f0', textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: '#64748b', fontWeight: 800 }}>SLOT RAK B-03</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#94a3b8', marginTop: 4 }}>Tersedia</div>
                </div>
                <div style={{ background: '#f8fafc', padding: 18, borderRadius: 16, border: '1.5px solid #e2e8f0', textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: '#64748b', fontWeight: 800 }}>SLOT RAK C-01</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#94a3b8', marginTop: 4 }}>Tersedia</div>
                </div>
              </div>

              <div style={{ fontSize: 12, color: '#64748b', textAlign: 'center' }}>
                Wajib input lokasi rak sebelum status berubah jadi <strong>Ready</strong> (PRD Bab 10.5).
              </div>
            </div>
          )}

          {/* SCENE 8: Maskot Si Kucek Melompat Gembira dengan Kupon */}
          {frame >= 1200 && frame < 1380 && (
            <div
              style={{
                width: '100%',
                maxWidth: 620,
                textAlign: 'center',
                opacity: interpolate(frame, [1200, 1215, 1365, 1380], [0, 1, 1, 0]),
              }}
            >
              <MascotSiKucek x={310} y={160} scale={1.3} action="jump" />
              <div
                style={{
                  marginTop: 180,
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: '#ffffff',
                  padding: 24,
                  borderRadius: 24,
                  boxShadow: '0 20px 50px rgba(245, 158, 11, 0.35)',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 900, letterSpacing: 0.5 }}>
                  🎉 5 STEMPEL LENGKAP TERCAPAI!
                </div>
                <h3 style={{ fontSize: 24, fontWeight: 900, margin: '8px 0' }}>
                  Gratis Cuci Kiloan Maksimal 5 Kg
                </h3>
                <p style={{ fontSize: 12, opacity: 0.9 }}>
                  Otomatis memotong porsi kiloan pesanan berikutnya (PRD 10.4).
                </p>
              </div>
            </div>
          )}

          {/* SCENE 9: Outro Sisi Kiri */}
          {frame >= 1380 && (
            <div
              style={{
                textAlign: 'center',
                opacity: interpolate(frame, [1380, 1400, 1485, 1500], [0, 1, 1, 0]),
              }}
            >
              <MascotSiKucek x={310} y={120} scale={1.4} action="cheer" />
            </div>
          )}
        </div>

        {/* ===================================================================== */}
        {/* ZONA KANAN: DUNIA DIGITAL (TABLET POS KASIR & SMARTPHONE PWA RANI)    */}
        {/* ===================================================================== */}
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {/* SCENE 1 & 2: Tablet POS Kasir Budi */}
          {frame < 300 && (
            <div
              style={{
                opacity: interpolate(frame, [0, 15, 285, 300], [0, 1, 1, 0]),
              }}
            >
              <TabletFrame width={820} height={530}>
                {/* Header POS */}
                <div style={{ padding: '14px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#0ea5e9' }} />
                    <span style={{ fontSize: 14, fontWeight: 900, color: '#0f172a' }}>
                      SiKucek POS • Order Baru (/orders/new)
                    </span>
                  </div>
                  <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 6 }}>
                    Kasir: Budi
                  </span>
                </div>

                {/* Form Intake Hybrid */}
                <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 18 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ background: '#f0f9ff', padding: 12, borderRadius: 14, border: '1px solid #bae6fd' }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: '#0284c7' }}>PELANGGAN:</div>
                      <div style={{ fontSize: 15, fontWeight: 900, color: '#0f172a' }}>
                        {frame > 30 ? 'Rani Kusuma (0857 1122 3345)' : 'Ketik nomor WA...'}
                      </div>
                      <span style={{ background: '#fef3c7', color: '#92400e', fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 4 }}>
                        Tier Busa Baru (4/5 Stempel)
                      </span>
                    </div>

                    <div style={{ background: '#ffffff', padding: 12, borderRadius: 14, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 900 }}>Cuci Kering Setrika 2 Hari</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>Rp7.000 / Kg</div>
                      </div>
                      <span style={{ background: '#0f172a', color: '#38bdf8', padding: '6px 12px', borderRadius: 8, fontFamily: 'monospace', fontWeight: 900 }}>
                        {frame > 140 ? '3.20' : '0.00'} KG
                      </span>
                    </div>

                    <div style={{ background: '#ffffff', padding: 12, borderRadius: 14, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 900 }}>Kemeja (Satuan)</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>Rp5.000 / Pcs</div>
                      </div>
                      <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: 8, fontWeight: 900 }}>
                        {frame > 180 ? '2' : '0'} pcs
                      </span>
                    </div>
                  </div>

                  {/* Panel Total */}
                  <div style={{ background: '#f8fafc', padding: 18, borderRadius: 16, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b' }}>TOTAL PEMBAYARAN:</div>
                      <div style={{ fontSize: 28, fontWeight: 900, color: '#0284c7', fontFamily: 'monospace', margin: '10px 0' }}>
                        Rp32.400
                      </div>
                      <div style={{ fontSize: 11, color: '#475569' }}>
                        Kiloan Rp22.400 + Satuan Rp10.000
                      </div>
                    </div>
                    <div style={{ background: '#0ea5e9', color: '#ffffff', textAlign: 'center', padding: 10, borderRadius: 10, fontWeight: 900, fontSize: 13 }}>
                      Lanjut ke Foto QC WebRTC ➔
                    </div>
                  </div>
                </div>
              </TabletFrame>
            </div>
          )}

          {/* SCENE 3: Viewfinder Kamera QC di Tablet POS */}
          {frame >= 300 && frame < 510 && (
            <div
              style={{
                opacity: interpolate(frame, [300, 315, 495, 510], [0, 1, 1, 0]),
              }}
            >
              <TabletFrame width={820} height={530}>
                <div style={{ padding: '14px 20px', background: '#0f172a', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 900, color: '#38bdf8' }}>
                    📸 Viewfinder Kamera QC WebRTC
                  </span>
                  <span style={{ background: '#f43f5e', color: '#ffffff', fontSize: 10, fontWeight: 900, padding: '2px 8px', borderRadius: 6 }}>
                    Cacat Terdeteksi
                  </span>
                </div>
                <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 18, flex: 1 }}>
                  <div style={{ background: '#1e293b', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', position: 'relative' }}>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: 64 }}>👔</span>
                      <div style={{ fontSize: 12, fontWeight: 800, color: '#f87171', marginTop: 4 }}>
                        Kerah Kanan Sobek 3 cm
                      </div>
                    </div>
                    {frame > 370 && (
                      <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(15, 23, 42, 0.85)', color: '#10b981', padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 800 }}>
                        ✓ WebP 412 KB (qc-photos)
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 900, color: '#64748b', marginBottom: 6 }}>JENIS CACAT:</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                        <span style={{ background: '#f43f5e', color: '#ffffff', padding: '4px 10px', borderRadius: 14, fontSize: 11, fontWeight: 800 }}>
                          ✓ Robek (Torn)
                        </span>
                        <span style={{ background: '#f1f5f9', color: '#64748b', padding: '4px 10px', borderRadius: 14, fontSize: 11 }}>
                          Noda
                        </span>
                      </div>
                      <div style={{ background: '#f8fafc', padding: 10, borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }}>
                        Catatan: Kerah kanan sobek 3 cm sebelum cuci.
                      </div>
                    </div>
                    <div style={{ background: '#10b981', color: '#ffffff', textAlign: 'center', padding: 10, borderRadius: 10, fontWeight: 900, fontSize: 13 }}>
                      Simpan Bukti &amp; Bayar QRIS ➔
                    </div>
                  </div>
                </div>
              </TabletFrame>
            </div>
          )}

          {/* SCENE 4: Ponsel Rani Memindai Bayar QRIS */}
          {frame >= 510 && frame < 630 && (
            <div
              style={{
                opacity: interpolate(frame, [510, 525, 615, 630], [0, 1, 1, 0]),
              }}
            >
              <PhoneFrame width={360} height={580}>
                <div style={{ padding: 24, textAlign: 'center', marginTop: 40 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#16a34a' }}>
                    Pembayaran QRIS SiKucek
                  </div>
                  <div style={{ fontSize: 30, fontWeight: 900, color: '#0f172a', margin: '14px 0' }}>
                    Bayar Rp32.400
                  </div>
                  <div style={{ background: '#dcfce7', color: '#15803d', padding: '12px 18px', borderRadius: 14, fontSize: 13, fontWeight: 800 }}>
                    ✓ Pembayaran Berhasil Diproses
                  </div>
                  <p style={{ fontSize: 11, color: '#64748b', marginTop: 20 }}>
                    Nomor Pesanan: <strong>SKC-261026-0042</strong>
                  </p>
                </div>
              </PhoneFrame>
            </div>
          )}

          {/* SCENE 5: Notifikasi WhatsApp Masuk ke Ponsel Rani */}
          {frame >= 630 && frame < 840 && (
            <div
              style={{
                opacity: interpolate(frame, [630, 645, 825, 840], [0, 1, 1, 0]),
              }}
            >
              <PhoneFrame width={380} height={600}>
                <div style={{ background: '#075e54', padding: '16px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#25d366' }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 900 }}>SiKucek Official</div>
                    <div style={{ fontSize: 11, opacity: 0.8 }}>Online • WhatsApp Gateway</div>
                  </div>
                </div>
                <div style={{ padding: 16 }}>
                  <div style={{ background: '#ffffff', padding: 16, borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', fontSize: 12, lineHeight: 1.5 }}>
                    Halo <strong>Kak Rani Kusuma</strong>! 🧺
                    <br /><br />
                    Terima kasih sudah mencuci di SiKucek.
                    <br />
                    No. Pesanan: <strong style={{ color: '#0284c7' }}>SKC-261026-0042</strong>
                    <br />
                    Total: <strong>Rp32.400 (LUNAS)</strong>
                    <br /><br />
                    Pantau proses cucian Kakak secara transparan di:
                    <div style={{ color: '#0284c7', fontWeight: 900, marginTop: 4 }}>
                      👉 sikucek.app/track/KCK-7F3A9Q
                    </div>
                  </div>
                </div>
              </PhoneFrame>
            </div>
          )}

          {/* SCENE 6: PWA Pelacakan Publik 7 Tahap Rani */}
          {frame >= 840 && frame < 1050 && (
            <div
              style={{
                opacity: interpolate(frame, [840, 855, 1035, 1050], [0, 1, 1, 0]),
              }}
            >
              <PhoneFrame width={380} height={620}>
                <div style={{ padding: '14px 18px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 900, color: '#0ea5e9' }}>
                    SiKucek. <span style={{ color: '#94a3b8', fontSize: 11 }}>PWA Track</span>
                  </span>
                  <span style={{ background: '#dcfce7', color: '#15803d', fontSize: 10, fontWeight: 900, padding: '2px 8px', borderRadius: 6 }}>
                    LUNAS
                  </span>
                </div>
                <div style={{ padding: 18 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b' }}>KODE LACAK RESI:</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', fontFamily: 'monospace' }}>
                    KCK-7F3A9Q
                  </div>

                  <div style={{ margin: '14px 0', background: '#f0f9ff', padding: 12, borderRadius: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 900, color: '#0284c7', marginBottom: 6 }}>
                      STATUS REAL-TIME:
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 800 }}>
                      <span style={{ color: '#10b981' }}>✓ Diterima</span>
                      <span style={{ color: frame > 900 ? '#10b981' : '#0ea5e9' }}>
                        {frame > 900 ? '✓ Cuci' : '● Cuci'}
                      </span>
                      <span style={{ color: frame > 960 ? '#10b981' : '#0ea5e9' }}>
                        {frame > 960 ? '✓ Kering' : '● Kering'}
                      </span>
                      <span style={{ color: frame > 1010 ? '#10b981' : '#94a3b8' }}>
                        {frame > 1010 ? '✓ Setrika' : '○ Setrika'}
                      </span>
                    </div>
                  </div>

                  <div style={{ background: '#ffffff', padding: 12, borderRadius: 14, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 11, fontWeight: 900, color: '#f43f5e', marginBottom: 4 }}>
                      ⚠️ BUKTI FOTO CACAT AWAL:
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 24 }}>👔</span>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 800 }}>Kerah Kanan Sobek 3 cm</div>
                        <div style={{ fontSize: 10, color: '#64748b' }}>Kondisi awal sebelum dicuci</div>
                      </div>
                    </div>
                  </div>
                </div>
              </PhoneFrame>
            </div>
          )}

          {/* SCENE 7: Notifikasi Siap Ambil di RAK B-02 */}
          {frame >= 1050 && frame < 1200 && (
            <div
              style={{
                opacity: interpolate(frame, [1050, 1065, 1185, 1200], [0, 1, 1, 0]),
              }}
            >
              <PhoneFrame width={380} height={580}>
                <div style={{ padding: 24, textAlign: 'center', marginTop: 30 }}>
                  <div style={{ fontSize: 52 }}>🎉</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#15803d', margin: '12px 0' }}>
                    Cucian Kakak Siap Diambil!
                  </div>
                  <div
                    style={{
                      background: '#dcfce7',
                      border: '2px solid #86efac',
                      padding: 18,
                      borderRadius: 18,
                      color: '#166534',
                      fontWeight: 900,
                      fontSize: 24,
                    }}
                  >
                    📍 RAK B-02
                  </div>
                  <p style={{ fontSize: 12, color: '#64748b', marginTop: 14, lineHeight: 1.5 }}>
                    Sudah rapi terlipat, wangi lavender &amp; siap diambil di outlet Sukolilo.
                  </p>
                </div>
              </PhoneFrame>
            </div>
          )}

          {/* SCENE 8: Kartu Stempel Loyalti 5/5 & Kupon Gratis */}
          {frame >= 1200 && frame < 1380 && (
            <div
              style={{
                opacity: interpolate(frame, [1200, 1215, 1365, 1380], [0, 1, 1, 0]),
              }}
            >
              <PhoneFrame width={390} height={640}>
                <div style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <span style={{ fontSize: 15, fontWeight: 900, color: '#0f172a' }}>
                      SiKucek Member Club
                    </span>
                    <span style={{ background: '#fef3c7', color: '#b45309', fontSize: 11, fontWeight: 900, padding: '3px 10px', borderRadius: 8 }}>
                      {frame > 1300 ? '140 Poin' : '120 Poin'}
                    </span>
                  </div>

                  <div style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', borderRadius: 20, padding: 20, color: '#ffffff' }}>
                    <div style={{ fontSize: 11, fontWeight: 800, opacity: 0.85 }}>KARTU STEMPEL LOYALTI</div>
                    <div style={{ fontSize: 15, fontWeight: 900, margin: '4px 0 12px 0' }}>
                      {frame > 1250 ? '🎉 5/5 Stempel Terkumpul Penuh!' : '4/5 Stempel Terkumpul'}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🪙</div>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🪙</div>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🪙</div>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🪙</div>
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
                        }}
                      >
                        {frame > 1250 ? '🪙' : '5'}
                      </div>
                    </div>
                  </div>

                  {frame > 1260 && (
                    <div style={{ marginTop: 14, background: '#ecfdf5', border: '2px solid #a7f3d0', borderRadius: 16, padding: 14, textAlign: 'center' }}>
                      <div style={{ fontSize: 11, fontWeight: 900, color: '#047857' }}>🎁 KUPON REWARD:</div>
                      <div style={{ fontSize: 14, fontWeight: 900, color: '#065f46', marginTop: 2 }}>
                        Gratis Cuci Kiloan Maksimal 5 Kg
                      </div>
                    </div>
                  )}

                  <div style={{ marginTop: 14, background: '#f8fafc', padding: 12, borderRadius: 14, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 800 }}>Daily Check-in Hari ke-3</div>
                      <div style={{ fontSize: 10, color: '#b45309' }}>+20 Poin Si Kucek</div>
                    </div>
                    <span style={{ background: '#0ea5e9', color: '#ffffff', fontSize: 11, fontWeight: 900, padding: '5px 12px', borderRadius: 8 }}>
                      {frame > 1300 ? '✓ Diklaim' : 'Klaim'}
                    </span>
                  </div>
                </div>
              </PhoneFrame>
            </div>
          )}

          {/* SCENE 9: Outro Sisi Kanan */}
          {frame >= 1380 && (
            <div
              style={{
                textAlign: 'center',
                opacity: interpolate(frame, [1380, 1400, 1485, 1500], [0, 1, 1, 0]),
              }}
            >
              <h2 style={{ fontSize: 44, fontWeight: 900, color: '#0f172a', letterSpacing: -1 }}>
                SiKucek.
              </h2>
              <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '6px 20px', borderRadius: 20, fontSize: 14, fontWeight: 800, margin: '10px 0' }}>
                Solusi Laundry Pintar, Cepat, Higienis, dan Transparan
              </div>
              <p style={{ fontSize: 13, color: '#64748b', maxWidth: 440 }}>
                Antar cucian Anda sekarang atau lacak progres secara publik tanpa login!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================================= */}
      {/* 4. PITA TAKARIR SINEMATIK (SUBTITLE RIBBON 50 DETIK)                    */}
      {/* ======================================================================= */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(15, 23, 42, 0.9)',
          color: '#ffffff',
          padding: '10px 28px',
          borderRadius: 30,
          border: '1.5px solid rgba(56, 189, 248, 0.45)',
          boxShadow: '0 15px 35px rgba(15, 23, 42, 0.35)',
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
