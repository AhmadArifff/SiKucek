import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
  interpolate,
  spring,
} from 'remotion';

// =============================================================================
// SUB-KOMPONEN 1: MASKOT SI KUCEK (RIGGED VECTOR CHARACTER)
// =============================================================================
interface SiKucekCharProps {
  x: number;
  y: number;
  scale?: number;
  rotation?: number;
  action?: 'scan' | 'surf' | 'iron' | 'cheer';
  actionProgress?: number;
}

const SiKucekCharacter: React.FC<SiKucekCharProps> = ({
  x,
  y,
  scale = 1,
  rotation = 0,
  action = 'cheer',
  actionProgress = 0,
}) => {
  // Animasi napas & goyangan mahkota busa
  const breath = Math.sin(actionProgress * Math.PI * 2) * 4;
  const bubbleWiggle = Math.cos(actionProgress * Math.PI * 2) * 5;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
        transformOrigin: 'center bottom',
        zIndex: 10,
        filter: 'drop-shadow(0 15px 30px rgba(14, 165, 233, 0.35))',
      }}
    >
      {/* Mahkota Busa Sabun Putih di Atas Ember */}
      <div style={{ position: 'relative', top: 12 + breath * 0.5, left: -6 }}>
        <svg width="190" height="75" viewBox="0 0 190 75" fill="none">
          <ellipse cx="95" cy="48" rx="72" ry="22" fill="#ffffff" />
          <circle cx="55" cy="35" r="28" fill="#ffffff" />
          <circle cx="95" cy="26" r="32" fill="#ffffff" />
          <circle cx="135" cy="36" r="26" fill="#ffffff" />
          <circle cx="35" cy="46" r="20" fill="#ffffff" />
          <circle cx="155" cy="48" r="18" fill="#ffffff" />
          {/* Kilau Busa Sabun */}
          <ellipse cx="88" cy="18" rx="8" ry="4" fill="#e0f2fe" opacity="0.8" />
          <ellipse cx="50" cy="26" rx="6" ry="3" fill="#e0f2fe" opacity="0.8" />
          <ellipse cx="130" cy="28" rx="6" ry="3" fill="#e0f2fe" opacity="0.8" />
        </svg>
      </div>

      {/* Badan Ember Si Kucek (Trapesium Terbalik Biru Toska) */}
      <div style={{ position: 'relative', marginTop: -20 }}>
        <svg width="180" height="150" viewBox="0 0 180 150" fill="none">
          {/* Gradasi Ember */}
          <defs>
            <linearGradient id="bucketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#bae6fd" />
              <stop offset="50%" stopColor="#e0f2fe" />
              <stop offset="100%" stopColor="#7dd3fc" />
            </linearGradient>
          </defs>

          {/* Bibir Ember Atas */}
          <ellipse cx="90" cy="24" rx="78" ry="16" fill="url(#rimGrad)" stroke="#ffffff" strokeWidth="3" />
          <ellipse cx="90" cy="22" rx="70" ry="12" fill="#0284c7" />

          {/* Dinding Ember */}
          <path
            d="M 22,24 L 38,132 C 39,142 58,148 90,148 C 122,148 141,142 142,132 L 158,24 Z"
            fill="url(#bucketGrad)"
            stroke="#ffffff"
            strokeWidth="3.5"
          />

          {/* Garis Aksen Melengkung Ember */}
          <path d="M 32,70 Q 90,82 148,70" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="3" fill="none" />
          <path d="M 36,105 Q 90,116 144,105" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="3" fill="none" />

          {/* Gagang Logam Ember */}
          <path
            d="M 16,30 C 16,-12 164,-12 164,30"
            stroke="#e2e8f0"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />

          {/* ----------------- WAJAH SI KUCEK ----------------- */}
          {/* Mata Kiri */}
          <ellipse cx="68" cy="62" rx="8" ry="12" fill="#0f172a" />
          <circle cx="65" cy="58" r="4" fill="#ffffff" />
          <circle cx="70" cy="66" r="1.5" fill="#ffffff" />

          {/* Mata Kanan */}
          <ellipse cx="112" cy="62" rx="8" ry="12" fill="#0f172a" />
          <circle cx="109" cy="58" r="4" fill="#ffffff" />
          <circle cx="114" cy="66" r="1.5" fill="#ffffff" />

          {/* Pipi Merona Merah Muda */}
          <ellipse cx="54" cy="72" rx="8" ry="4.5" fill="#f43f5e" opacity="0.45" />
          <ellipse cx="126" cy="72" rx="8" ry="4.5" fill="#f43f5e" opacity="0.45" />

          {/* Senyum Ceria Manis */}
          <path
            d="M 76,74 Q 90,90 104,74"
            stroke="#0f172a"
            strokeWidth="4"
            strokeLinecap="round"
            fill="#e11d48"
          />
        </svg>
      </div>

      {/* Sepatu Bot Karet Si Kucek di Bawah */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 26, marginTop: -14 }}>
        <div
          style={{
            width: 32,
            height: 22,
            borderRadius: '14px 14px 8px 8px',
            background: '#0d9488',
            border: '2px solid #ffffff',
            boxShadow: '0 4px 10px rgba(13, 148, 136, 0.4)',
            transform: `rotate(${Math.sin(actionProgress * Math.PI * 4) * 8}deg)`,
          }}
        />
        <div
          style={{
            width: 32,
            height: 22,
            borderRadius: '14px 14px 8px 8px',
            background: '#0d9488',
            border: '2px solid #ffffff',
            boxShadow: '0 4px 10px rgba(13, 148, 136, 0.4)',
            transform: `rotate(${-Math.sin(actionProgress * Math.PI * 4) * 8}deg)`,
          }}
        />
      </div>

      {/* Aksesoris Tangan Berdasarkan Aksi */}
      {action === 'scan' && (
        <div
          style={{
            position: 'absolute',
            top: 65,
            right: -25,
            transform: `rotate(${10 + Math.sin(actionProgress * Math.PI * 4) * 8}deg)`,
            background: '#ffffff',
            padding: '8px 12px',
            borderRadius: 16,
            border: '2px solid #38bdf8',
            boxShadow: '0 8px 20px rgba(14, 165, 233, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span style={{ fontSize: 20 }}>📸</span>
          <span style={{ fontSize: 10, fontWeight: 900, color: '#0369a1' }}>QC CAM</span>
        </div>
      )}

      {action === 'iron' && (
        <div
          style={{
            position: 'absolute',
            top: 60,
            right: -30,
            transform: `rotate(${Math.sin(actionProgress * Math.PI * 3) * 15}deg)`,
            background: '#ffffff',
            padding: '8px 14px',
            borderRadius: 18,
            border: '2px solid #fb923c',
            boxShadow: '0 8px 20px rgba(249, 115, 22, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span style={{ fontSize: 22 }}>💨</span>
          <span style={{ fontSize: 10, fontWeight: 900, color: '#c2410c' }}>STEAM JET</span>
        </div>
      )}

      {action === 'cheer' && (
        <div
          style={{
            position: 'absolute',
            top: 25,
            right: -20,
            fontSize: 28,
            animation: 'bounce 1s infinite',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
          }}
        >
          👍
        </div>
      )}
    </div>
  );
};

// =============================================================================
// SUB-KOMPONEN 2: KARAKTER KIKO SI KAOS (THE JOURNEYING SHIRT)
// =============================================================================
interface ShirtProps {
  x: number;
  y: number;
  scale?: number;
  rotation?: number;
  mood: 'dirty' | 'washing' | 'steamed' | 'folded';
}

const KikoShirt: React.FC<ShirtProps> = ({
  x,
  y,
  scale = 1,
  rotation = 0,
  mood,
}) => {
  // Warna dan tekstur sesuai status mood
  const fillColor =
    mood === 'dirty'
      ? '#94a3b8'
      : mood === 'washing'
      ? '#38bdf8'
      : mood === 'steamed'
      ? '#38bdf8'
      : '#0ea5e9';

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
        zIndex: 9,
        filter:
          mood === 'steamed'
            ? 'drop-shadow(0 15px 35px rgba(56, 189, 248, 0.45))'
            : 'drop-shadow(0 10px 20px rgba(15, 23, 42, 0.15))',
      }}
    >
      {mood === 'folded' ? (
        // Tampilan Terlipat Rapi dengan Pita Hijau Wangi
        <div
          style={{
            width: 140,
            height: 105,
            background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
            borderRadius: 20,
            border: '4px solid #ffffff',
            boxShadow: '0 15px 30px rgba(2, 132, 199, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Pita Hijau Segar */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: 24,
              background: '#10b981',
              boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: 20,
              background: '#10b981',
              boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
            }}
          />
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              background: '#ffffff',
              padding: '4px 10px',
              borderRadius: 12,
              fontSize: 10,
              fontWeight: 900,
              color: '#047857',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            }}
          >
            ✓ RAPI &amp; WANGI
          </div>
        </div>
      ) : (
        // Tampilan Kaos Terbentang
        <div style={{ position: 'relative' }}>
          <svg width="150" height="150" viewBox="0 0 24 24" fill="none">
            <path
              d="M20.38 3.46L16 2 12 5.5 8 2 3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.5a2 2 0 0 0 1.98 1.67H6v9.14A2 2 0 0 0 8 22h8a2 2 0 0 0 2-2V10.86h1.16a2 2 0 0 0 1.98-1.67l.58-3.5a2 2 0 0 0-1.34-2.23z"
              fill={fillColor}
              stroke="#ffffff"
              strokeWidth="1.6"
            />
          </svg>

          {/* Bercak Kotoran Jika Dirty */}
          {mood === 'dirty' && (
            <>
              <div
                style={{
                  position: 'absolute',
                  top: 55,
                  left: 45,
                  width: 26,
                  height: 18,
                  borderRadius: '60% 40% 70% 30%',
                  background: '#713f12',
                  opacity: 0.85,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 85,
                  right: 48,
                  width: 22,
                  height: 22,
                  borderRadius: '40% 60% 50% 50%',
                  background: '#854d0e',
                  opacity: 0.85,
                }}
              />
              {/* Mata Sedih / Kusut */}
              <div style={{ position: 'absolute', top: 58, left: 62, display: 'flex', gap: 14 }}>
                <span style={{ fontSize: 13, fontWeight: 900, color: '#451a03' }}>&gt;</span>
                <span style={{ fontSize: 13, fontWeight: 900, color: '#451a03' }}>&lt;</span>
              </div>
            </>
          )}

          {/* Wajah Senang & Kilauan Jika Steamed / Washing */}
          {(mood === 'steamed' || mood === 'washing') && (
            <>
              <div style={{ position: 'absolute', top: 56, left: 60, display: 'flex', gap: 16 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ffffff' }} />
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ffffff' }} />
              </div>
              <div
                style={{
                  position: 'absolute',
                  top: 68,
                  left: 68,
                  width: 14,
                  height: 8,
                  borderRadius: '0 0 10px 10px',
                  background: '#ffffff',
                }}
              />
              {/* Bintang Kilau Emas */}
              <div style={{ position: 'absolute', top: 20, right: 18, fontSize: 26, filter: 'drop-shadow(0 0 8px #f59e0b)' }}>
                ✨
              </div>
              <div style={{ position: 'absolute', bottom: 35, left: 22, fontSize: 20, filter: 'drop-shadow(0 0 8px #f59e0b)' }}>
                ✨
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// KOMPONEN UTAMA: HERO FILM ANIMASI SINEMATIK SI KUCEK (360 FRAMES = 12 DETIK)
// =============================================================================
export const HeroBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  // Fase 4 Babak Cerita Film Animasi (masing-masing 90 frame = 3 detik)
  // Babak 1: 0 - 90   (Kedatangan Kiko & Scan QC WebRTC Transparan)
  // Babak 2: 90 - 180  (Pusaran Busa Ajaib & Cuci Deep Wash)
  // Babak 3: 180 - 270 (Spa Setrika Uap Lavender & Kinclong)
  // Babak 4: 270 - 360 (Rak Fisik Pintar A-02 & WhatsApp Notif Siap)
  const scene1Progress = interpolate(frame, [0, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scene2Progress = interpolate(frame, [90, 180], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scene3Progress = interpolate(frame, [180, 270], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scene4Progress = interpolate(frame, [270, 360], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Opasitas Babak
  const scene1Opacity = interpolate(frame, [0, 10, 80, 90], [1, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scene2Opacity = interpolate(frame, [80, 95, 170, 180], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scene3Opacity = interpolate(frame, [170, 185, 260, 270], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scene4Opacity = interpolate(frame, [260, 275, 350, 360], [0, 1, 1, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Gelombang Siklus Matematika
  const loopCycle = (frame / durationInFrames) * 2 * Math.PI;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#f8fafc',
        overflow: 'hidden',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* ======================================================================= */}
      {/* 1. ATMOSFERIC AMBIENT BACKGROUND GLOW (DINAMIS MENGIKUTI BABAK)         */}
      {/* ======================================================================= */}
      {/* Glow Kiri: Sky Blue */}
      <div
        style={{
          position: 'absolute',
          top: -150,
          left: -100,
          width: 900,
          height: 900,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.45) 0%, rgba(14, 165, 233, 0.15) 50%, transparent 75%)',
          filter: 'blur(90px)',
          transform: `scale(${1 + 0.1 * Math.sin(loopCycle)})`,
        }}
      />
      {/* Glow Tengah: Fresh Aqua / Warm Lavender */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '30%',
          width: 950,
          height: 950,
          borderRadius: '50%',
          background: frame < 180
            ? 'radial-gradient(circle, rgba(45, 212, 191, 0.35) 0%, rgba(56, 189, 248, 0.18) 50%, transparent 75%)'
            : 'radial-gradient(circle, rgba(251, 146, 60, 0.3) 0%, rgba(168, 85, 247, 0.22) 50%, transparent 75%)',
          filter: 'blur(95px)',
          transition: 'background 0.8s ease',
        }}
      />
      {/* Glow Kanan: Emerald Clean */}
      <div
        style={{
          position: 'absolute',
          bottom: -150,
          right: -100,
          width: 900,
          height: 900,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.35) 0%, rgba(14, 165, 233, 0.15) 50%, transparent 75%)',
          filter: 'blur(90px)',
        }}
      />

      {/* ======================================================================= */}
      {/* 2. BABAK 1: KEDATANGAN KIKO & QC WEBRTC SCAN (FRAMES 0 - 90)            */}
      {/* ======================================================================= */}
      {frame < 95 && (
        <div style={{ position: 'absolute', inset: 0, opacity: scene1Opacity }}>
          {/* Timbangan Digital Cerdas di Kiri */}
          <div
            style={{
              position: 'absolute',
              top: '48%',
              left: '26%',
              transform: 'translate(-50%, -50%)',
              width: 380,
              background: 'rgba(255, 255, 255, 0.94)',
              borderRadius: 36,
              border: '3px solid #38bdf8',
              boxShadow: '0 25px 60px rgba(14, 165, 233, 0.25)',
              padding: '24px 28px',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 900, color: '#0369a1', textTransform: 'uppercase' }}>
                ⚖️ Timbangan Digital SiKucek
              </span>
              <span style={{ background: '#059669', color: '#ffffff', fontSize: 10, fontWeight: 900, padding: '3px 8px', borderRadius: 10 }}>
                Kupon 5Kg Aktif!
              </span>
            </div>
            {/* Display Kiloan */}
            <div
              style={{
                background: '#0f172a',
                borderRadius: 20,
                padding: '12px 20px',
                color: '#38bdf8',
                fontSize: 38,
                fontWeight: 900,
                fontFamily: 'monospace',
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)',
              }}
            >
              {interpolate(scene1Progress, [0, 0.5, 1], [0.0, 3.2, 4.85]).toFixed(2)} KG
            </div>
            {/* Scanner Grid Laser */}
            <div
              style={{
                marginTop: 16,
                height: 120,
                background: '#f0f9ff',
                borderRadius: 20,
                border: '2px dashed #7dd3fc',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {/* Laser Scan Line Horizontal */}
              <div
                style={{
                  position: 'absolute',
                  top: 20 + Math.sin(frame * 0.2) * 45 + 40,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: 'linear-gradient(90deg, transparent, #0284c7, #38bdf8, #0284c7, transparent)',
                  boxShadow: '0 0 12px #38bdf8',
                }}
              />
              <span style={{ fontSize: 44 }}>🧺</span>
            </div>
            <div style={{ marginTop: 10, fontSize: 11, fontWeight: 800, color: '#047857' }}>
              ✓ 3 Bukti Foto QC Cacat Awal Tersimpan
            </div>
          </div>

          {/* Kiko si Kaos Masuk Meluncur dengan Ekspresi Kusut */}
          <KikoShirt
            x={interpolate(scene1Progress, [0, 0.4, 1], [180, 520, 620])}
            y={interpolate(scene1Progress, [0, 0.4, 1], [300, 480, 470])}
            scale={1.2}
            rotation={Math.sin(frame * 0.15) * 8}
            mood="dirty"
          />

          {/* Maskot Si Kucek Menyambut dengan Kamera QC */}
          <SiKucekCharacter
            x={interpolate(scene1Progress, [0, 0.3, 1], [1050, 880, 850])}
            y={480}
            scale={1.35}
            action="scan"
            actionProgress={scene1Progress}
          />
        </div>
      )}

      {/* ======================================================================= */}
      {/* 3. BABAK 2: PETUALANGAN PUSARAN AIR AJAIB & DEEP WASH (FRAMES 90 - 180) */}
      {/* ======================================================================= */}
      {frame >= 80 && frame < 185 && (
        <div style={{ position: 'absolute', inset: 0, opacity: scene2Opacity }}>
          {/* Giant Washing Vortex Lagoon di Tengah */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 580,
              height: 580,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(186, 230, 253, 0.8) 0%, rgba(14, 165, 233, 0.4) 60%, rgba(2, 132, 199, 0.8) 100%)',
              border: '14px solid #ffffff',
              boxShadow: '0 30px 80px rgba(2, 132, 199, 0.35), inset 0 0 60px rgba(56, 189, 248, 0.6)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Pusaran Air Berputar Cepat (1200 RPM) */}
            <div
              style={{
                position: 'absolute',
                width: 650,
                height: 650,
                borderRadius: '42%',
                background: 'conic-gradient(from 0deg, rgba(56, 189, 248, 0.5), rgba(13, 148, 136, 0.6), rgba(255, 255, 255, 0.9), rgba(56, 189, 248, 0.5))',
                transform: `rotate(${frame * 12}deg)`,
                filter: 'blur(4px)',
              }}
            />

            {/* Gelembung Sabun Mikro Berputar Beramai-ramai */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.95)',
                  boxShadow: '0 2px 8px rgba(14, 165, 233, 0.5)',
                  transform: `rotate(${deg + frame * 8}deg) translate(190px) rotate(-${deg + frame * 8}deg)`,
                }}
              />
            ))}

            {/* Kiko si Kaos Berenang Bahagia di Air Sabun (Noda Rontok Total!) */}
            <KikoShirt
              x={width * 0.5 + Math.cos(frame * 0.12) * 70}
              y={height * 0.5 + Math.sin(frame * 0.12) * 50}
              scale={1.35}
              rotation={Math.sin(frame * 0.2) * 20}
              mood="washing"
            />
          </div>

          {/* Si Kucek Berselancar Ceria di Samping Drum Air */}
          <SiKucekCharacter
            x={width * 0.5 + 320}
            y={480 + Math.sin(frame * 0.18) * 20}
            scale={1.3}
            action="surf"
            actionProgress={scene2Progress}
          />
        </div>
      )}

      {/* ======================================================================= */}
      {/* 4. BABAK 3: SPA SETRIKA UAP WANGI LAVENDER (FRAMES 180 - 270)           */}
      {/* ======================================================================= */}
      {frame >= 170 && frame < 275 && (
        <div style={{ position: 'absolute', inset: 0, opacity: scene3Opacity }}>
          {/* Efek Aura Kehangatan & Aroma Lavender */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 700,
              height: 480,
              background: 'radial-gradient(ellipse, rgba(254, 215, 170, 0.45) 0%, rgba(243, 232, 255, 0.5) 50%, transparent 80%)',
              borderRadius: '50%',
              filter: 'blur(40px)',
            }}
          />

          {/* Partikel Uap Hangat Lavender Mengepul Lembut */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: 300 - ((frame * 3 + i * 60) % 250),
                left: 700 + i * 50 + Math.sin(frame * 0.1 + i) * 30,
                width: 60 + i * 15,
                height: 60 + i * 15,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.75)',
                filter: 'blur(16px)',
              }}
            />
          ))}

          {/* Kiko si Kaos Melayang Santai Menerima Spa (Kinclong & Licin Rapi!) */}
          <KikoShirt
            x={760}
            y={460 + Math.sin(frame * 0.12) * 14}
            scale={1.5}
            rotation={Math.sin(frame * 0.08) * 6}
            mood="steamed"
          />

          {/* Si Kucek Memegang Jet Setrika Uap Presisi */}
          <SiKucekCharacter
            x={1080}
            y={470}
            scale={1.35}
            action="iron"
            actionProgress={scene3Progress}
          />

          {/* Banner Wangi Lavender */}
          <div
            style={{
              position: 'absolute',
              top: '25%',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '12px 28px',
              borderRadius: 30,
              border: '2px solid #fb923c',
              boxShadow: '0 15px 35px rgba(249, 115, 22, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span style={{ fontSize: 24 }}>🪻</span>
            <span style={{ fontSize: 14, fontWeight: 900, color: '#c2410c' }}>
              Aroma Lavender Segar &amp; 100% Anti-Kusut Presisi
            </span>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 5. BABAK 4: RAK PINTAR A-02 & WHATSAPP NOTIFIKASI SIAP (FRAMES 270 - 360) */}
      {/* ======================================================================= */}
      {frame >= 260 && (
        <div style={{ position: 'absolute', inset: 0, opacity: scene4Opacity }}>
          {/* Rak Fisik Cerdas SiKucek di Kiri */}
          <div
            style={{
              position: 'absolute',
              top: '48%',
              left: '32%',
              transform: 'translate(-50%, -50%)',
              width: 380,
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 36,
              border: '3px solid #10b981',
              boxShadow: '0 25px 60px rgba(16, 185, 129, 0.25)',
              padding: '24px 28px',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontSize: 13, fontWeight: 900, color: '#047857', textTransform: 'uppercase' }}>
                📍 Smart Physical Rack
              </span>
              <span style={{ background: '#dcfce7', color: '#047857', fontSize: 10, fontWeight: 900, padding: '3px 10px', borderRadius: 12 }}>
                ✓ Siap Diambil
              </span>
            </div>

            {/* Slot Rak Aktif */}
            <div
              style={{
                background: '#ffffff',
                border: '3px solid #10b981',
                borderRadius: 22,
                padding: '16px 20px',
                boxShadow: '0 10px 24px rgba(16, 185, 129, 0.2)',
                marginBottom: 16,
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 800, color: '#059669', textTransform: 'uppercase' }}>
                Nomor Rak Pakaian
              </div>
              <div style={{ fontSize: 36, fontWeight: 900, fontFamily: 'monospace', color: '#047857', margin: '4px 0' }}>
                RAK A-02
              </div>
              <span style={{ background: '#10b981', color: '#ffffff', fontSize: 11, fontWeight: 900, padding: '4px 12px', borderRadius: 12 }}>
                ✓ Selesai Dipacking Rapi
              </span>
            </div>

            {/* Kiko Terlipat Rapi Masuk ke Slot Rak */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <KikoShirt x={0} y={0} scale={1.1} mood="folded" />
            </div>
          </div>

          {/* Kartu Notifikasi WhatsApp Gateway Otomatis di Kanan */}
          <div
            style={{
              position: 'absolute',
              top: '48%',
              left: '70%',
              transform: `translate(-50%, -50%) translateY(${Math.sin(frame * 0.15) * 8}px)`,
              width: 420,
              background: '#ffffff',
              borderRadius: 32,
              border: '3px solid #22c55e',
              boxShadow: '0 25px 60px rgba(34, 197, 94, 0.3)',
              padding: '24px 28px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 26 }}>💬</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, color: '#16a34a' }}>
                  WhatsApp Gateway Si Kucek
                </div>
                <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700 }}>
                  Resmi • Terkirim Otomatis
                </div>
              </div>
              <span style={{ marginLeft: 'auto', background: '#dcfce7', color: '#15803d', fontSize: 10, fontWeight: 900, padding: '3px 8px', borderRadius: 8 }}>
                ✓✓ Delivered
              </span>
            </div>

            <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: 18, border: '1px solid #e2e8f0', fontSize: 12, fontWeight: 700, color: '#1e293b', lineHeight: 1.5 }}>
              &ldquo;Halo Kak! Cucian <strong style={{ color: '#047857' }}>SKC-B8D02</strong> telah SELESAI, wangi &amp; siap di <strong style={{ color: '#047857' }}>RAK A-02</strong>. Silakan mampir ambil ya! 🚀&rdquo;
            </div>

            {/* Stempel Emas 5/5 Loyalti */}
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, fontWeight: 900, color: '#b45309' }}>
                🎁 5/5 Stempel Selesai!
              </span>
              <span style={{ background: '#fef3c7', color: '#92400e', fontSize: 11, fontWeight: 900, padding: '4px 12px', borderRadius: 12, border: '1px solid #fde68a' }}>
                Klaim Gratis Cuci 5 Kg
              </span>
            </div>
          </div>

          {/* Si Kucek Melompat Ceria Mengacungkan Jempol di Tengah */}
          <SiKucekCharacter
            x={width * 0.51}
            y={480 + Math.sin(frame * 0.25) * 16}
            scale={1.4}
            action="cheer"
            actionProgress={scene4Progress}
          />
        </div>
      )}

      {/* ======================================================================= */}
      {/* 6. CINEMATIC BOTTOM SUBTITLE RIBBON (PANDUAN ALUR CERITA FILM ANIMASI)  */}
      {/* ======================================================================= */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(15, 23, 42, 0.88)',
          color: '#ffffff',
          padding: '12px 32px',
          borderRadius: 40,
          border: '2px solid rgba(56, 189, 248, 0.5)',
          boxShadow: '0 20px 45px rgba(15, 23, 42, 0.3)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          zIndex: 30,
        }}
      >
        <span style={{ fontSize: 20 }}>🎬</span>
        <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: 0.5 }}>
          {frame < 90 && 'Babak 1: Timbang Digital Akurat & Bukti Foto WebRTC Bebas Sengketa'}
          {frame >= 90 && frame < 180 && 'Babak 2: Pusaran Air Sabun 1200 RPM, Noda Rontok Total Tanpa Sisa'}
          {frame >= 180 && frame < 270 && 'Babak 3: Spa Setrika Uap Hangat, Wangi Lavender Segar & Licin Rapi'}
          {frame >= 270 && 'Babak 4: Alokasi Rak A-02 Siap Ambil & Notifikasi WA Otomatis Meluncur!'}
        </span>
        <span
          style={{
            background: '#0ea5e9',
            color: '#ffffff',
            fontSize: 10,
            fontWeight: 900,
            padding: '4px 10px',
            borderRadius: 12,
            fontFamily: 'monospace',
          }}
        >
          {Math.floor(frame / 30)}s / 12s
        </span>
      </div>

      {/* ======================================================================= */}
      {/* 7. FULL-BLEED SEAMLESS WATER WAVES (DASAR AIR ALAMI ANTI-BORDER KOTAK)  */}
      {/* ======================================================================= */}
      <svg
        viewBox="-120 0 2160 380"
        style={{
          position: 'absolute',
          bottom: -20,
          left: '-6%',
          width: '112%',
          height: 220,
          opacity: 0.6,
          pointerEvents: 'none',
          zIndex: 2,
        }}
      >
        <path
          d={`
            M -120,${200 + 35 * Math.sin(loopCycle)}
            C ${480 + 40 * Math.cos(loopCycle)},${120 + 45 * Math.sin(loopCycle + 1)}
              ${1000 + 30 * Math.sin(loopCycle)},${260 + 40 * Math.cos(loopCycle)}
              ${1500 + 45 * Math.cos(loopCycle)},${140 + 35 * Math.sin(loopCycle + 2)}
            C 1800,${180 + 30 * Math.sin(loopCycle)}
              1980,${220 + 25 * Math.cos(loopCycle)}
              2160,${200 + 35 * Math.sin(loopCycle)}
            L 2160,380 L -120,380 Z
          `}
          fill="url(#waveStory1)"
        />
        <defs>
          <linearGradient id="waveStory1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#0d9488" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.55" />
          </linearGradient>
        </defs>
      </svg>
    </AbsoluteFill>
  );
};
