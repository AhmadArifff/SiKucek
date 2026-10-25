import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
  interpolate,
} from 'remotion';

// Struktur data gelembung sabun
interface Bubble {
  id: number;
  xPercent: number;
  baseY: number;
  size: number;
  speed: number;
  wiggleAmplitude: number;
  wiggleFrequency: number;
  hueShift: number;
  opacity: number;
}

// 22 Gelembung sabun terdistribusi dengan variasi ukuran dan kecepatan
const BUBBLES: Bubble[] = [
  { id: 1, xPercent: 6, baseY: 1100, size: 70, speed: 2.2, wiggleAmplitude: 25, wiggleFrequency: 1.5, hueShift: 195, opacity: 0.65 },
  { id: 2, xPercent: 16, baseY: 850, size: 40, speed: 1.8, wiggleAmplitude: 15, wiggleFrequency: 2, hueShift: 210, opacity: 0.5 },
  { id: 3, xPercent: 26, baseY: 1200, size: 100, speed: 2.6, wiggleAmplitude: 35, wiggleFrequency: 1.2, hueShift: 175, opacity: 0.7 },
  { id: 4, xPercent: 36, baseY: 950, size: 50, speed: 2.0, wiggleAmplitude: 20, wiggleFrequency: 2.2, hueShift: 220, opacity: 0.55 },
  { id: 5, xPercent: 46, baseY: 1350, size: 85, speed: 2.4, wiggleAmplitude: 30, wiggleFrequency: 1.4, hueShift: 190, opacity: 0.6 },
  { id: 6, xPercent: 56, baseY: 750, size: 38, speed: 1.6, wiggleAmplitude: 18, wiggleFrequency: 2.5, hueShift: 205, opacity: 0.45 },
  { id: 7, xPercent: 66, baseY: 1150, size: 80, speed: 2.3, wiggleAmplitude: 28, wiggleFrequency: 1.6, hueShift: 180, opacity: 0.65 },
  { id: 8, xPercent: 76, baseY: 900, size: 55, speed: 1.9, wiggleAmplitude: 22, wiggleFrequency: 1.8, hueShift: 215, opacity: 0.5 },
  { id: 9, xPercent: 86, baseY: 1250, size: 95, speed: 2.5, wiggleAmplitude: 32, wiggleFrequency: 1.3, hueShift: 195, opacity: 0.7 },
  { id: 10, xPercent: 94, baseY: 800, size: 48, speed: 1.7, wiggleAmplitude: 16, wiggleFrequency: 2.1, hueShift: 200, opacity: 0.5 },
  { id: 11, xPercent: 12, baseY: 1400, size: 60, speed: 2.1, wiggleAmplitude: 24, wiggleFrequency: 1.7, hueShift: 185, opacity: 0.6 },
  { id: 12, xPercent: 22, baseY: 650, size: 32, speed: 1.5, wiggleAmplitude: 14, wiggleFrequency: 2.6, hueShift: 225, opacity: 0.4 },
  { id: 13, xPercent: 32, baseY: 1300, size: 90, speed: 2.4, wiggleAmplitude: 29, wiggleFrequency: 1.5, hueShift: 170, opacity: 0.65 },
  { id: 14, xPercent: 62, baseY: 600, size: 28, speed: 1.4, wiggleAmplitude: 12, wiggleFrequency: 2.8, hueShift: 215, opacity: 0.4 },
  { id: 15, xPercent: 72, baseY: 1380, size: 98, speed: 2.5, wiggleAmplitude: 34, wiggleFrequency: 1.4, hueShift: 180, opacity: 0.7 },
  { id: 16, xPercent: 82, baseY: 720, size: 46, speed: 1.9, wiggleAmplitude: 20, wiggleFrequency: 2.2, hueShift: 210, opacity: 0.55 },
  { id: 17, xPercent: 90, baseY: 1420, size: 65, speed: 2.1, wiggleAmplitude: 25, wiggleFrequency: 1.8, hueShift: 190, opacity: 0.6 },
  { id: 18, xPercent: 4, baseY: 780, size: 36, speed: 1.6, wiggleAmplitude: 15, wiggleFrequency: 2.4, hueShift: 200, opacity: 0.45 },
  { id: 19, xPercent: 28, baseY: 500, size: 80, speed: 2.3, wiggleAmplitude: 27, wiggleFrequency: 1.5, hueShift: 185, opacity: 0.6 },
  { id: 20, xPercent: 68, baseY: 520, size: 70, speed: 2.2, wiggleAmplitude: 24, wiggleFrequency: 1.7, hueShift: 195, opacity: 0.6 },
  { id: 21, xPercent: 84, baseY: 480, size: 52, speed: 1.8, wiggleAmplitude: 18, wiggleFrequency: 2.3, hueShift: 180, opacity: 0.5 },
  { id: 22, xPercent: 48, baseY: 450, size: 55, speed: 2.0, wiggleAmplitude: 21, wiggleFrequency: 1.9, hueShift: 210, opacity: 0.5 },
];

export const HeroBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  // Fase siklus matematika 0 s.d 2*PI untuk loop sempurna
  const cycleProgress = (frame / durationInFrames) * 2 * Math.PI;

  // Gerakan napas ambient glow
  const glowScale1 = 1 + 0.12 * Math.sin(cycleProgress);
  const glowScale2 = 1 + 0.15 * Math.sin(cycleProgress + Math.PI / 2);
  const glowTranslateX = 40 * Math.sin(cycleProgress);
  const glowTranslateY = 30 * Math.cos(cycleProgress);

  // =========================================================================
  // FASE STORYTELLING SIKLUS LAUNDRY (300 FRAMES = 10 DETIK)
  // Fase 1: 0 - 100 (Washing & QC Foto)
  // Fase 2: 100 - 200 (Drying & Setrika Uap)
  // Fase 3: 200 - 300 (Ready & Rak Fisik)
  // =========================================================================
  const stage1Opacity = interpolate(
    frame,
    [0, 15, 85, 100],
    [1, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const stage2Opacity = interpolate(
    frame,
    [85, 100, 115, 185, 200],
    [0, 1, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const stage3Opacity = interpolate(
    frame,
    [185, 200, 215, 285, 300],
    [0, 1, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Perputaran drum cuci pada tahap 1
  const washingRotation = frame * 4.5;
  // Goyangan pakaian pada tahap pengeringan
  const dryingFloatY = 18 * Math.sin(frame * 0.12);
  const dryingRotation = 8 * Math.sin(frame * 0.08);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#f8fafc',
        overflow: 'hidden',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* ========================================================================= */}
      {/* 1. RADIANT AMBIENT BACKGROUND GLOWS                                       */}
      {/* ========================================================================= */}
      {/* Gradient A: Sky Cyan Aura di kiri atas */}
      <div
        style={{
          position: 'absolute',
          top: -150 + glowTranslateY,
          left: -150 + glowTranslateX,
          width: 950,
          height: 950,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.45) 0%, rgba(14, 165, 233, 0.18) 50%, transparent 75%)',
          filter: 'blur(75px)',
          transform: `scale(${glowScale1})`,
        }}
      />

      {/* Gradient B: Lavender & Soft Violet Aura di kanan tengah */}
      <div
        style={{
          position: 'absolute',
          top: 80 - glowTranslateY * 0.8,
          right: -180 - glowTranslateX * 0.8,
          width: 1100,
          height: 1100,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.32) 0%, rgba(224, 231, 255, 0.38) 45%, transparent 75%)',
          filter: 'blur(85px)',
          transform: `scale(${glowScale2})`,
        }}
      />

      {/* Gradient C: Coral Warm Fresh Glow di tengah */}
      <div
        style={{
          position: 'absolute',
          bottom: -150,
          left: '28%',
          width: 900,
          height: 900,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(251, 146, 60, 0.25) 0%, rgba(254, 215, 170, 0.3) 40%, transparent 70%)',
          filter: 'blur(80px)',
          transform: `scale(${glowScale1 * 0.95})`,
        }}
      />

      {/* ========================================================================= */}
      {/* 2. STORYTELLING VISUAL CENTERPIECE (SIKLUS LAUNDRY 3 TAHAP)               */}
      {/* ========================================================================= */}
      <div
        style={{
          position: 'absolute',
          top: '38%',
          right: '8%',
          transform: 'translateY(-50%)',
          width: 480,
          height: 480,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        {/* Halo Lingkaran Cahaya Modern */}
        <div
          style={{
            position: 'absolute',
            width: 420,
            height: 420,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.85) 0%, rgba(224, 242, 254, 0.45) 50%, transparent 75%)',
            boxShadow: '0 20px 50px rgba(14, 165, 233, 0.15)',
            border: '2px dashed rgba(56, 189, 248, 0.3)',
            animation: 'spin 40s linear infinite',
          }}
        />

        {/* --------------------------------------------------------------------- */}
        {/* TAHAP 1: WASHING CYCLE (Baju Berputar di Pusaran Air & Busa)           */}
        {/* --------------------------------------------------------------------- */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: stage1Opacity,
            transition: 'opacity 0.4s ease',
          }}
        >
          {/* Drum Putaran Air */}
          <div
            style={{
              position: 'relative',
              width: 250,
              height: 250,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(186, 230, 253, 0.6) 0%, rgba(14, 165, 233, 0.25) 70%)',
              border: '6px solid rgba(255, 255, 255, 0.9)',
              boxShadow: '0 15px 35px rgba(2, 132, 199, 0.25), inset 0 0 30px rgba(56, 189, 248, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {/* Pusaran Air Berputar */}
            <div
              style={{
                position: 'absolute',
                width: 280,
                height: 280,
                borderRadius: '42%',
                background: 'conic-gradient(from 0deg, rgba(56, 189, 248, 0.3), rgba(13, 148, 136, 0.4), rgba(56, 189, 248, 0.6), rgba(255, 255, 255, 0.7), rgba(56, 189, 248, 0.3))',
                transform: `rotate(${washingRotation}deg)`,
                filter: 'blur(3px)',
              }}
            />

            {/* Ilustrasi Baju yang Sedang Dicuci Bersih */}
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                transform: `rotate(${-washingRotation * 0.6}deg) scale(1.15)`,
                filter: 'drop-shadow(0 8px 16px rgba(15, 23, 42, 0.15))',
              }}
            >
              <svg width="110" height="110" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20.38 3.46L16 2 12 5.5 8 2 3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.5a2 2 0 0 0 1.98 1.67H6v9.14A2 2 0 0 0 8 22h8a2 2 0 0 0 2-2V10.86h1.16a2 2 0 0 0 1.98-1.67l.58-3.5a2 2 0 0 0-1.34-2.23z"
                  fill="#38bdf8"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                <circle cx="12" cy="11" r="2.5" fill="#ffffff" opacity="0.8" />
                <circle cx="12" cy="16" r="2.5" fill="#ffffff" opacity="0.8" />
              </svg>
            </div>

            {/* Busa Sabun Mikro di Sekitar Baju */}
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.95)',
                  boxShadow: '0 2px 6px rgba(14, 165, 233, 0.3)',
                  transform: `rotate(${deg + washingRotation}deg) translate(80px) rotate(-${deg + washingRotation}deg)`,
                }}
              />
            ))}
          </div>

          {/* Banner Sinematik Layanan Tahap 1 */}
          <div
            style={{
              marginTop: 22,
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(12px)',
              padding: '10px 24px',
              borderRadius: 30,
              border: '2px solid rgba(56, 189, 248, 0.5)',
              boxShadow: '0 12px 28px rgba(14, 165, 233, 0.2)',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
              <span style={{ fontSize: 18 }}>💧</span>
              <span style={{ fontWeight: 900, fontSize: 13, color: '#0369a1', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                Tahap 1: Pencucian &amp; Foto QC
              </span>
            </div>
            <p style={{ margin: '3px 0 0 0', fontSize: 11, fontWeight: 700, color: '#475569' }}>
              Deterjen ramah serat kain &amp; dokumentasi kondisi awal WebRTC
            </p>
          </div>
        </div>

        {/* --------------------------------------------------------------------- */}
        {/* TAHAP 2: DRYING & STEAM PRESS (Pengeringan & Setrika Uap Presisi)      */}
        {/* --------------------------------------------------------------------- */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: stage2Opacity,
            transition: 'opacity 0.4s ease',
          }}
        >
          {/* Efek Hawa Hangat & Setrika Uap */}
          <div
            style={{
              position: 'relative',
              width: 250,
              height: 250,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(254, 215, 170, 0.5) 0%, rgba(249, 115, 22, 0.18) 70%)',
              border: '6px solid rgba(255, 255, 255, 0.9)',
              boxShadow: '0 15px 35px rgba(249, 115, 22, 0.2), inset 0 0 30px rgba(251, 146, 60, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Gelombang Uap Hangat */}
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                style={{
                  position: 'absolute',
                  width: 140 + num * 40,
                  height: 140 + num * 40,
                  borderRadius: '50%',
                  border: '2px solid rgba(251, 146, 60, 0.25)',
                  transform: `scale(${1 + 0.08 * Math.sin(frame * 0.1 + num)})`,
                }}
              />
            ))}

            {/* Baju Kinclong Mengering Melayang Halus */}
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                transform: `translateY(${dryingFloatY}px) rotate(${dryingRotation}deg) scale(1.2)`,
                filter: 'drop-shadow(0 12px 24px rgba(249, 115, 22, 0.25))',
              }}
            >
              <svg width="115" height="115" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20.38 3.46L16 2 12 5.5 8 2 3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.5a2 2 0 0 0 1.98 1.67H6v9.14A2 2 0 0 0 8 22h8a2 2 0 0 0 2-2V10.86h1.16a2 2 0 0 0 1.98-1.67l.58-3.5a2 2 0 0 0-1.34-2.23z"
                  fill="#fb923c"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              </svg>
              {/* Kilauan Kinclong */}
              <div
                style={{
                  position: 'absolute',
                  top: 20,
                  right: 15,
                  fontSize: 22,
                  filter: 'drop-shadow(0 2px 8px #f59e0b)',
                }}
              >
                ✨
              </div>
            </div>
          </div>

          {/* Banner Sinematik Layanan Tahap 2 */}
          <div
            style={{
              marginTop: 22,
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(12px)',
              padding: '10px 24px',
              borderRadius: 30,
              border: '2px solid rgba(251, 146, 60, 0.5)',
              boxShadow: '0 12px 28px rgba(249, 115, 22, 0.2)',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
              <span style={{ fontSize: 18 }}>💨</span>
              <span style={{ fontWeight: 900, fontSize: 13, color: '#c2410c', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                Tahap 2: Pengeringan &amp; Setrika Uap
              </span>
            </div>
            <p style={{ margin: '3px 0 0 0', fontSize: 11, fontWeight: 700, color: '#475569' }}>
              Bebas bau apek, serat halus &amp; wangi lavender tahan lama
            </p>
          </div>
        </div>

        {/* --------------------------------------------------------------------- */}
        {/* TAHAP 3: READY & SMART RACK (Pakaian Rapi di Rak & WhatsApp Siap)     */}
        {/* --------------------------------------------------------------------- */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: stage3Opacity,
            transition: 'opacity 0.4s ease',
          }}
        >
          {/* Rak Fisik & Pakaian Packing Rapi */}
          <div
            style={{
              position: 'relative',
              width: 250,
              height: 250,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(167, 243, 208, 0.6) 0%, rgba(16, 185, 129, 0.22) 70%)',
              border: '6px solid rgba(255, 255, 255, 0.95)',
              boxShadow: '0 15px 35px rgba(5, 150, 105, 0.25), inset 0 0 30px rgba(52, 211, 153, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {/* Box Rak Fisik Modern */}
            <div
              style={{
                background: '#ffffff',
                padding: '8px 20px',
                borderRadius: 16,
                border: '2px solid #10b981',
                boxShadow: '0 8px 20px rgba(16, 185, 129, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span style={{ fontSize: 18 }}>📍</span>
              <span style={{ fontWeight: 900, fontFamily: 'monospace', fontSize: 18, color: '#047857' }}>
                RAK B-02
              </span>
            </div>

            {/* Badge Siap Ambil */}
            <div
              style={{
                background: '#10b981',
                color: '#ffffff',
                fontSize: 12,
                fontWeight: 900,
                padding: '4px 14px',
                borderRadius: 20,
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>✓</span>
              <span>Siap Diambil</span>
            </div>
          </div>

          {/* Banner Sinematik Layanan Tahap 3 */}
          <div
            style={{
              marginTop: 22,
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(12px)',
              padding: '10px 24px',
              borderRadius: 30,
              border: '2px solid rgba(16, 185, 129, 0.5)',
              boxShadow: '0 12px 28px rgba(16, 185, 129, 0.2)',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
              <span style={{ fontSize: 18 }}>✨</span>
              <span style={{ fontWeight: 900, fontSize: 13, color: '#047857', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                Tahap 3: Alokasi Rak &amp; WA Siap
              </span>
            </div>
            <p style={{ margin: '3px 0 0 0', fontSize: 11, fontWeight: 700, color: '#475569' }}>
              Nomor rak tertera transparan &amp; nota digital otomatis terkirim
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. DYNAMIC FULL-BLEED WATER WAVES (ANTI-BORDER KOTAK)                     */}
      {/* Gelombang dibuat melebar melampaui kanvas (-120 s.d 2160) agar tidak ada   */}
      {/* potongan tepi kiri, kanan, atau bawah!                                     */}
      {/* ========================================================================= */}
      {/* Wave Layer 1: Gelombang Belakang (Teal-Sky) */}
      <svg
        viewBox="-120 0 2160 380"
        style={{
          position: 'absolute',
          bottom: -20,
          left: '-6%',
          width: '112%',
          height: 360,
          opacity: 0.5,
          pointerEvents: 'none',
        }}
      >
        <path
          d={`
            M -120,${200 + 35 * Math.sin(cycleProgress)}
            C ${480 + 40 * Math.cos(cycleProgress)},${120 + 45 * Math.sin(cycleProgress + 1)}
              ${1000 + 30 * Math.sin(cycleProgress)},${260 + 40 * Math.cos(cycleProgress)}
              ${1500 + 45 * Math.cos(cycleProgress)},${140 + 35 * Math.sin(cycleProgress + 2)}
            C 1800,${180 + 30 * Math.sin(cycleProgress)}
              1980,${220 + 25 * Math.cos(cycleProgress)}
              2160,${200 + 35 * Math.sin(cycleProgress)}
            L 2160,380 L -120,380 Z
          `}
          fill="url(#waveFull1)"
        />
        <defs>
          <linearGradient id="waveFull1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#0d9488" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.5" />
          </linearGradient>
        </defs>
      </svg>

      {/* Wave Layer 2: Gelombang Depan Berkilau (Translucent Cyan to Seamless Bottom) */}
      <svg
        viewBox="-120 0 2160 380"
        style={{
          position: 'absolute',
          bottom: -25,
          left: '-6%',
          width: '112%',
          height: 300,
          opacity: 0.65,
          pointerEvents: 'none',
        }}
      >
        <path
          d={`
            M -120,${180 + 30 * Math.cos(cycleProgress + Math.PI)}
            C ${520 + 35 * Math.sin(cycleProgress + 1)},${220 + 40 * Math.sin(cycleProgress + 2)}
              ${1050 + 45 * Math.cos(cycleProgress)},${140 + 35 * Math.sin(cycleProgress + 3)}
              ${1550 + 30 * Math.sin(cycleProgress)},${200 + 30 * Math.cos(cycleProgress + 1)}
            C 1820,${170 + 25 * Math.cos(cycleProgress)}
              2000,${160 + 20 * Math.sin(cycleProgress)}
              2160,${180 + 30 * Math.cos(cycleProgress + Math.PI)}
            L 2160,380 L -120,380 Z
          `}
          fill="url(#waveFull2)"
        />
        <defs>
          <linearGradient id="waveFull2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.55" />
            <stop offset="50%" stopColor="#2dd4bf" stopOpacity="0.48" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.58" />
          </linearGradient>
        </defs>
      </svg>

      {/* Gradasi Memudar di Bagian Bawah Gelombang Air (Seamless Blend ke Section Bawah) */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 70,
          background: 'linear-gradient(to bottom, rgba(248, 250, 252, 0) 0%, #f8fafc 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ========================================================================= */}
      {/* 4. IRIDESCENT FLOATING SOAP BUBBLES                                       */}
      {/* ========================================================================= */}
      {BUBBLES.map((bubble) => {
        const loopDistance = height + 350;
        const totalMovement = bubble.speed * 4.5 * frame;
        const currentY = height + 150 - ((bubble.baseY + totalMovement) % loopDistance);

        const wiggleX =
          bubble.wiggleAmplitude *
          Math.sin(cycleProgress * bubble.wiggleFrequency + bubble.id);

        const currentX = (bubble.xPercent / 100) * width + wiggleX;

        // Fade in di bagian bawah dan fade out halus di bagian atas layar
        const fadeIn = interpolate(currentY, [height - 100, height + 80], [bubble.opacity, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const currentOpacity = interpolate(currentY, [-50, 150], [0, fadeIn], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        const scaleX = 1 + 0.04 * Math.sin(cycleProgress * 2 + bubble.id);
        const scaleY = 1 - 0.04 * Math.sin(cycleProgress * 2 + bubble.id);

        return (
          <div
            key={bubble.id}
            style={{
              position: 'absolute',
              left: currentX,
              top: currentY,
              width: bubble.size,
              height: bubble.size,
              borderRadius: '50%',
              opacity: currentOpacity,
              transform: `scale(${scaleX}, ${scaleY})`,
              background: `radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.35) 25%, hsla(${bubble.hueShift}, 90%, 65%, 0.22) 55%, hsla(${bubble.hueShift + 35}, 85%, 60%, 0.38) 85%, rgba(255, 255, 255, 0.6) 100%)`,
              boxShadow: `
                inset -3px -3px 8px rgba(14, 165, 233, 0.35),
                inset 3px 3px 6px rgba(255, 255, 255, 0.8),
                0 6px 16px rgba(56, 189, 248, 0.2)
              `,
              backdropFilter: 'blur(1px)',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '18%',
                left: '22%',
                width: bubble.size * 0.28,
                height: bubble.size * 0.16,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.9)',
                transform: 'rotate(-40deg)',
                filter: 'blur(0.5px)',
              }}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
