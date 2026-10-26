import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
  interpolate,
} from 'remotion';

// Struktur data gelembung sabun atmosferik
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

// 26 Gelembung sabun tersebar merata di seluruh bentang 1920px
const BUBBLES: Bubble[] = [
  { id: 1, xPercent: 5, baseY: 1100, size: 70, speed: 2.2, wiggleAmplitude: 25, wiggleFrequency: 1.5, hueShift: 195, opacity: 0.55 },
  { id: 2, xPercent: 12, baseY: 850, size: 40, speed: 1.8, wiggleAmplitude: 15, wiggleFrequency: 2.0, hueShift: 210, opacity: 0.45 },
  { id: 3, xPercent: 19, baseY: 1250, size: 90, speed: 2.5, wiggleAmplitude: 30, wiggleFrequency: 1.3, hueShift: 175, opacity: 0.6 },
  { id: 4, xPercent: 26, baseY: 950, size: 48, speed: 2.0, wiggleAmplitude: 20, wiggleFrequency: 2.2, hueShift: 220, opacity: 0.5 },
  { id: 5, xPercent: 33, baseY: 1350, size: 75, speed: 2.4, wiggleAmplitude: 28, wiggleFrequency: 1.4, hueShift: 190, opacity: 0.55 },
  { id: 6, xPercent: 40, baseY: 750, size: 38, speed: 1.6, wiggleAmplitude: 18, wiggleFrequency: 2.5, hueShift: 205, opacity: 0.4 },
  { id: 7, xPercent: 47, baseY: 1150, size: 80, speed: 2.3, wiggleAmplitude: 26, wiggleFrequency: 1.6, hueShift: 180, opacity: 0.6 },
  { id: 8, xPercent: 53, baseY: 900, size: 52, speed: 1.9, wiggleAmplitude: 22, wiggleFrequency: 1.8, hueShift: 215, opacity: 0.45 },
  { id: 9, xPercent: 60, baseY: 1280, size: 85, speed: 2.5, wiggleAmplitude: 32, wiggleFrequency: 1.3, hueShift: 195, opacity: 0.65 },
  { id: 10, xPercent: 67, baseY: 800, size: 45, speed: 1.7, wiggleAmplitude: 16, wiggleFrequency: 2.1, hueShift: 200, opacity: 0.45 },
  { id: 11, xPercent: 74, baseY: 1400, size: 60, speed: 2.1, wiggleAmplitude: 24, wiggleFrequency: 1.7, hueShift: 185, opacity: 0.55 },
  { id: 12, xPercent: 81, baseY: 650, size: 32, speed: 1.5, wiggleAmplitude: 14, wiggleFrequency: 2.6, hueShift: 225, opacity: 0.38 },
  { id: 13, xPercent: 88, baseY: 1300, size: 95, speed: 2.4, wiggleAmplitude: 29, wiggleFrequency: 1.5, hueShift: 170, opacity: 0.6 },
  { id: 14, xPercent: 95, baseY: 600, size: 28, speed: 1.4, wiggleAmplitude: 12, wiggleFrequency: 2.8, hueShift: 215, opacity: 0.38 },
  { id: 15, xPercent: 8, baseY: 720, size: 42, speed: 1.9, wiggleAmplitude: 18, wiggleFrequency: 2.2, hueShift: 210, opacity: 0.48 },
  { id: 16, xPercent: 23, baseY: 1420, size: 68, speed: 2.1, wiggleAmplitude: 25, wiggleFrequency: 1.8, hueShift: 190, opacity: 0.55 },
  { id: 17, xPercent: 48, baseY: 550, size: 34, speed: 1.6, wiggleAmplitude: 15, wiggleFrequency: 2.4, hueShift: 200, opacity: 0.4 },
  { id: 18, xPercent: 71, baseY: 500, size: 70, speed: 2.3, wiggleAmplitude: 27, wiggleFrequency: 1.5, hueShift: 185, opacity: 0.55 },
  { id: 19, xPercent: 85, baseY: 520, size: 65, speed: 2.2, wiggleAmplitude: 24, wiggleFrequency: 1.7, hueShift: 195, opacity: 0.55 },
  { id: 20, xPercent: 92, baseY: 480, size: 50, speed: 1.8, wiggleAmplitude: 18, wiggleFrequency: 2.3, hueShift: 180, opacity: 0.48 },
];

export const HeroBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  // Siklus matematika 0 s.d 2*PI untuk loop sempurna 10 detik (300 frames)
  const cycleProgress = (frame / durationInFrames) * 2 * Math.PI;

  // Gerakan napas ambient glow
  const glowScale1 = 1 + 0.12 * Math.sin(cycleProgress);
  const glowScale2 = 1 + 0.15 * Math.sin(cycleProgress + Math.PI / 2);
  const glowTranslateX = 35 * Math.sin(cycleProgress);
  const glowTranslateY = 25 * Math.cos(cycleProgress);

  // =========================================================================
  // FASE STORYTELLING SIKLUS LAUNDRY (300 FRAMES = 10 DETIK)
  // Fase 1: 0 - 100 (Washing & Intake QC Scan)
  // Fase 2: 100 - 200 (Deep Washing Cyclone & Steam Press)
  // Fase 3: 200 - 300 (Smart Rack Locator & WhatsApp Dispatch)
  // =========================================================================
  const isPhase1 = frame >= 0 && frame < 100;
  const isPhase2 = frame >= 100 && frame < 200;
  const isPhase3 = frame >= 200 && frame <= 300;

  // Derajat sorotan masing-masing zona
  const zone1Highlight = interpolate(frame, [0, 20, 80, 100], [0.95, 1, 1, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const zone2Highlight = interpolate(frame, [80, 110, 180, 205], [0.6, 1, 1, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const zone3Highlight = interpolate(frame, [185, 215, 285, 300], [0.6, 1, 1, 0.95], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Animasi Mesin Cuci
  const drumRotation = frame * 6.5;
  const waterSwirlRotation = frame * 4.2;

  // Animasi Laser Scan WebRTC (Naik-Turun di Timbangan Kiri)
  const laserY = 85 + 60 * Math.sin(frame * 0.14);

  // Animasi Goyangan Baju & Kilauan
  const shirtFloatY = 12 * Math.sin(frame * 0.12);

  // Animasi Notifikasi WhatsApp (Meluncur Halus)
  const waCardY = isPhase3 ? 6 * Math.sin(frame * 0.15) : 0;
  const waCardScale = isPhase3 ? 1.02 : 0.98;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#f8fafc',
        overflow: 'hidden',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* ========================================================================= */}
      {/* 1. RADIANT AMBIENT BACKGROUND GLOWS (MENYEBAR DI SELURUH LEBAR 1920PX)   */}
      {/* ========================================================================= */}
      {/* Glow Kiri: Sky Blue Aura */}
      <div
        style={{
          position: 'absolute',
          top: -100 + glowTranslateY,
          left: -80 + glowTranslateX,
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.38) 0%, rgba(14, 165, 233, 0.12) 50%, transparent 75%)',
          filter: 'blur(75px)',
          transform: `scale(${glowScale1})`,
        }}
      />

      {/* Glow Tengah: Warm Fresh Amber-Coral & Cyan Vortex Aura */}
      <div
        style={{
          position: 'absolute',
          top: 40 - glowTranslateY * 0.6,
          left: '30%',
          width: 900,
          height: 900,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.25) 0%, rgba(251, 146, 60, 0.18) 45%, transparent 75%)',
          filter: 'blur(85px)',
          transform: `scale(${glowScale2})`,
        }}
      />

      {/* Glow Kanan: Lavender Violet & Emerald Clean Aura */}
      <div
        style={{
          position: 'absolute',
          top: -80 - glowTranslateY * 0.7,
          right: -80 - glowTranslateX * 0.7,
          width: 820,
          height: 820,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, rgba(16, 185, 129, 0.2) 50%, transparent 75%)',
          filter: 'blur(80px)',
          transform: `scale(${glowScale1 * 0.96})`,
        }}
      />

      {/* ========================================================================= */}
      {/* 2. TOP PANORAMIC PROCESS CONNECTOR RIBBON                                */}
      {/* Menghubungkan seluruh kanvas dari Kiri -> Tengah -> Kanan                */}
      {/* ========================================================================= */}
      <div
        style={{
          position: 'absolute',
          top: 45,
          left: '5%',
          right: '5%',
          height: 52,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10,
        }}
      >
        {/* Step Indicator 1: Intake & QC Scan */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: isPhase1 ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.78)',
            border: isPhase1 ? '2px solid #0ea5e9' : '1px solid rgba(226, 232, 240, 0.85)',
            padding: '6px 16px',
            borderRadius: 24,
            boxShadow: isPhase1 ? '0 8px 20px rgba(14, 165, 233, 0.22)' : '0 3px 10px rgba(15, 23, 42, 0.04)',
            transform: isPhase1 ? 'scale(1.04)' : 'scale(0.97)',
            transition: 'all 0.35s ease',
          }}
        >
          <span style={{ fontSize: 18 }}>📸</span>
          <div>
            <div style={{ fontSize: 10, fontWeight: 900, color: isPhase1 ? '#0284c7' : '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Tahap 1 • Intake &amp; QC
            </div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a' }}>
              Timbang &amp; Foto WebRTC
            </div>
          </div>
          {isPhase1 && (
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#0ea5e9', display: 'inline-block', boxShadow: '0 0 8px #0ea5e9' }} />
          )}
        </div>

        {/* Connecting Flow Line 1 to 2 */}
        <div
          style={{
            flex: 1,
            height: 3,
            margin: '0 16px',
            background: 'rgba(203, 213, 225, 0.6)',
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: `${Math.min(100, Math.max(0, (frame / 100) * 100))}%`,
              background: 'linear-gradient(90deg, #0ea5e9, #0d9488)',
              boxShadow: '0 0 6px #0ea5e9',
            }}
          />
        </div>

        {/* Step Indicator 2: Washing & Steam */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: isPhase2 ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.78)',
            border: isPhase2 ? '2px solid #f97316' : '1px solid rgba(226, 232, 240, 0.85)',
            padding: '6px 16px',
            borderRadius: 24,
            boxShadow: isPhase2 ? '0 8px 20px rgba(249, 115, 22, 0.22)' : '0 3px 10px rgba(15, 23, 42, 0.04)',
            transform: isPhase2 ? 'scale(1.04)' : 'scale(0.97)',
            transition: 'all 0.35s ease',
          }}
        >
          <span style={{ fontSize: 18 }}>🌀</span>
          <div>
            <div style={{ fontSize: 10, fontWeight: 900, color: isPhase2 ? '#ea580c' : '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Tahap 2 • Eco-Wash &amp; Steam
            </div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a' }}>
              Sanitasi &amp; Setrika Presisi
            </div>
          </div>
          {isPhase2 && (
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#f97316', display: 'inline-block', boxShadow: '0 0 8px #f97316' }} />
          )}
        </div>

        {/* Connecting Flow Line 2 to 3 */}
        <div
          style={{
            flex: 1,
            height: 3,
            margin: '0 16px',
            background: 'rgba(203, 213, 225, 0.6)',
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: `${Math.min(100, Math.max(0, ((frame - 100) / 100) * 100))}%`,
              background: 'linear-gradient(90deg, #f97316, #10b981)',
              boxShadow: '0 0 6px #10b981',
            }}
          />
        </div>

        {/* Step Indicator 3: Ready Rack & WhatsApp */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: isPhase3 ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.78)',
            border: isPhase3 ? '2px solid #10b981' : '1px solid rgba(226, 232, 240, 0.85)',
            padding: '6px 16px',
            borderRadius: 24,
            boxShadow: isPhase3 ? '0 8px 20px rgba(16, 185, 129, 0.22)' : '0 3px 10px rgba(15, 23, 42, 0.04)',
            transform: isPhase3 ? 'scale(1.04)' : 'scale(0.97)',
            transition: 'all 0.35s ease',
          }}
        >
          <span style={{ fontSize: 18 }}>📍</span>
          <div>
            <div style={{ fontSize: 10, fontWeight: 900, color: isPhase3 ? '#059669' : '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Tahap 3 • Rak &amp; WA Notif
            </div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a' }}>
              Alokasi Fisik &amp; Pesan Siap
            </div>
          </div>
          {isPhase3 && (
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SIMULASI PABRIK LAUNDRY CERDAS (3 ZONA PENUH MEMANFAATKAN 100% RUANG)   */}
      {/* ========================================================================= */}
      <div
        style={{
          position: 'absolute',
          top: 125,
          left: '4%',
          right: '4%',
          bottom: 140,
          display: 'grid',
          gridTemplateColumns: '1fr 1.15fr 1fr',
          gap: 28,
          alignItems: 'center',
          zIndex: 5,
        }}
      >
        {/* ----------------------------------------------------------------------- */}
        {/* ZONA KIRI: SMART INTAKE & WEBRTC QC SCANNER                             */}
        {/* ----------------------------------------------------------------------- */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: zone1Highlight,
            transform: `scale(${0.96 + zone1Highlight * 0.05})`,
            transition: 'all 0.4s ease',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 440,
              background: 'rgba(255, 255, 255, 0.94)',
              borderRadius: 32,
              border: isPhase1 ? '3px solid #38bdf8' : '2px solid rgba(226, 232, 240, 0.9)',
              boxShadow: isPhase1 ? '0 20px 50px rgba(14, 165, 233, 0.22)' : '0 10px 25px rgba(15, 23, 42, 0.06)',
              padding: '20px 24px',
              backdropFilter: 'blur(16px)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Header Modul Kiri */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 15 }}>⚖️</span>
                <span style={{ fontSize: 12, fontWeight: 900, color: '#0369a1', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Timbangan Pintar &amp; QC
                </span>
              </div>
              <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: 10, fontWeight: 900, padding: '2px 8px', borderRadius: 16 }}>
                Live Precision
              </span>
            </div>

            {/* Display Bobot Kiloan Digital */}
            <div
              style={{
                background: '#0f172a',
                borderRadius: 16,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid #334155',
                boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.5)',
                marginBottom: 14,
              }}
            >
              <div>
                <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
                  Total Berat Cucian
                </div>
                <div style={{ fontSize: 30, fontWeight: 900, color: '#38bdf8', fontFamily: 'monospace', letterSpacing: 1 }}>
                  4.85 <span style={{ fontSize: 15, color: '#94a3b8' }}>KG</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ background: '#059669', color: '#ffffff', fontSize: 9, fontWeight: 900, padding: '3px 8px', borderRadius: 10 }}>
                  ✓ Kupon 5Kg Aktif!
                </span>
                <div style={{ fontSize: 9, color: '#cbd5e1', marginTop: 3, fontWeight: 700 }}>
                  Potongan Otomatis Rp 0
                </div>
              </div>
            </div>

            {/* Scanner WebRTC Viewport (Keranjang Baju + Laser Scan) */}
            <div
              style={{
                position: 'relative',
                height: 155,
                background: 'radial-gradient(circle, #f0f9ff 0%, #e0f2fe 100%)',
                borderRadius: 20,
                border: '2px dashed #7dd3fc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {/* Grid Garis Scan */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'radial-gradient(rgba(14, 165, 233, 0.25) 1px, transparent 1px)',
                  backgroundSize: '14px 14px',
                }}
              />

              {/* Sinar Laser Horizontal Bergerak */}
              <div
                style={{
                  position: 'absolute',
                  top: laserY,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: 'linear-gradient(90deg, transparent 0%, #0284c7 20%, #38bdf8 50%, #0284c7 80%, transparent 100%)',
                  boxShadow: '0 0 10px #38bdf8',
                  zIndex: 3,
                }}
              />

              {/* Keranjang Laundry & Pakaian */}
              <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                <span style={{ fontSize: 56, filter: 'drop-shadow(0 8px 12px rgba(14, 165, 233, 0.25))' }}>
                  🧺
                </span>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#0369a1', marginTop: 1 }}>
                  Keranjang Pakaian Si Kucek
                </div>
              </div>

              {/* Label Kamera AI QC di Pojok */}
              <div
                style={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  background: 'rgba(15, 23, 42, 0.8)',
                  color: '#ffffff',
                  fontSize: 8,
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  zIndex: 4,
                }}
              >
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                <span>WebRTC QC Cam: ZERO DEFECT</span>
              </div>
            </div>

            {/* Footer Status Kiri */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, fontSize: 10, fontWeight: 700, color: '#475569' }}>
              <span>📸 Foto Cacat Awal: 3 Bukti</span>
              <span style={{ color: '#059669', fontWeight: 900 }}>✓ Tersimpan di Cloud</span>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* ZONA TENGAH: THE WASHING CORE (MESIN CUCI FUTURISTIS GLASSMORPHIC)      */}
        {/* ----------------------------------------------------------------------- */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: zone2Highlight,
            transform: `scale(${0.98 + zone2Highlight * 0.04})`,
            transition: 'all 0.4s ease',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 480,
              background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 249, 255, 0.92) 100%)',
              borderRadius: 40,
              border: isPhase2 ? '4px solid #f97316' : '3px solid rgba(255, 255, 255, 0.95)',
              boxShadow: isPhase2
                ? '0 25px 70px rgba(249, 115, 22, 0.28), 0 0 35px rgba(56, 189, 248, 0.25)'
                : '0 16px 40px rgba(14, 165, 233, 0.15)',
              padding: '22px 26px',
              backdropFilter: 'blur(20px)',
              position: 'relative',
              textAlign: 'center',
            }}
          >
            {/* Top Control Bar Mesin Cuci */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: 10, fontWeight: 900, color: '#f97316', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  ECO-WASH TURBO JET
                </span>
                <div style={{ fontSize: 14, fontWeight: 900, color: '#0f172a' }}>
                  SiKucek Smart Drum v2.4
                </div>
              </div>

              {/* Digital LED Dial Display */}
              <div
                style={{
                  background: '#0f172a',
                  padding: '5px 14px',
                  borderRadius: 16,
                  border: '1px solid #334155',
                  color: '#38bdf8',
                  fontFamily: 'monospace',
                  fontWeight: 900,
                  fontSize: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 6px #22c55e' }} />
                <span>1200 RPM • 40°C</span>
              </div>
            </div>

            {/* Giant Transparent Glass Washing Drum */}
            <div
              style={{
                position: 'relative',
                width: 255,
                height: 255,
                margin: '0 auto',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(224, 242, 254, 0.8) 0%, rgba(14, 165, 233, 0.3) 65%, #0284c7 100%)',
                border: '8px solid #ffffff',
                boxShadow: '0 16px 40px rgba(2, 132, 199, 0.35), inset 0 0 35px rgba(56, 189, 248, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {/* Dynamic Water Swirl Vortex */}
              <div
                style={{
                  position: 'absolute',
                  width: 290,
                  height: 290,
                  borderRadius: '43%',
                  background: 'conic-gradient(from 0deg, rgba(56, 189, 248, 0.4), rgba(13, 148, 136, 0.5), rgba(249, 115, 22, 0.3), rgba(255, 255, 255, 0.8), rgba(56, 189, 248, 0.4))',
                  transform: `rotate(${waterSwirlRotation}deg)`,
                  filter: 'blur(2.5px)',
                }}
              />

              {/* Inner Rotating Drum Grid */}
              <div
                style={{
                  position: 'absolute',
                  width: 205,
                  height: 205,
                  borderRadius: '50%',
                  border: '2px dashed rgba(255, 255, 255, 0.7)',
                  transform: `rotate(${drumRotation}deg)`,
                }}
              />

              {/* Pakaian Berputar & Melayang Halus di Air */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 3,
                  transform: `rotate(${-drumRotation * 0.4}deg) translateY(${shirtFloatY}px) scale(1.15)`,
                  filter: 'drop-shadow(0 10px 20px rgba(15, 23, 42, 0.25))',
                }}
              >
                <svg width="100" height="100" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20.38 3.46L16 2 12 5.5 8 2 3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.5a2 2 0 0 0 1.98 1.67H6v9.14A2 2 0 0 0 8 22h8a2 2 0 0 0 2-2V10.86h1.16a2 2 0 0 0 1.98-1.67l.58-3.5a2 2 0 0 0-1.34-2.23z"
                    fill={isPhase2 ? '#fb923c' : '#38bdf8'}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  <circle cx="12" cy="11" r="2.2" fill="#ffffff" opacity="0.85" />
                  <circle cx="12" cy="16" r="2.2" fill="#ffffff" opacity="0.85" />
                </svg>
                {/* Kilauan Bintang Kinclong */}
                <div style={{ position: 'absolute', top: -4, right: -4, fontSize: 22, filter: 'drop-shadow(0 0 8px #fbbf24)' }}>
                  ✨
                </div>
              </div>

              {/* Busa Sabun Mikro Berputar Melingkar */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.95)',
                    boxShadow: '0 2px 6px rgba(14, 165, 233, 0.4)',
                    transform: `rotate(${deg + drumRotation}deg) translate(92px) rotate(-${deg + drumRotation}deg)`,
                  }}
                />
              ))}

              {/* Refleksi Kilau Kaca Luar */}
              <div
                style={{
                  position: 'absolute',
                  top: '12%',
                  left: '18%',
                  width: '35%',
                  height: '25%',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, transparent 80%)',
                  transform: 'rotate(-30deg)',
                  pointerEvents: 'none',
                }}
              />
            </div>

            {/* Banner Status Bawah Mesin Cuci */}
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#0369a1' }}>
                💧 Air Ozon Suci
              </span>
              <span style={{ color: '#cbd5e1' }}>•</span>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#c2410c' }}>
                💨 Setrika Uap Lavender
              </span>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* ZONA KANAN: INTELLIGENT RACK LOCATOR & WHATSAPP DISPATCH                */}
        {/* ----------------------------------------------------------------------- */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: zone3Highlight,
            transform: `scale(${0.96 + zone3Highlight * 0.05})`,
            transition: 'all 0.4s ease',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 440,
              background: 'rgba(255, 255, 255, 0.94)',
              borderRadius: 32,
              border: isPhase3 ? '3px solid #10b981' : '2px solid rgba(226, 232, 240, 0.9)',
              boxShadow: isPhase3 ? '0 20px 50px rgba(16, 185, 129, 0.25)' : '0 10px 25px rgba(15, 23, 42, 0.06)',
              padding: '20px 24px',
              backdropFilter: 'blur(16px)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Header Modul Kanan */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 15 }}>📦</span>
                <span style={{ fontSize: 12, fontWeight: 900, color: '#047857', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Alokasi Rak &amp; WA Siap
                </span>
              </div>
              <span style={{ background: '#dcfce7', color: '#047857', fontSize: 10, fontWeight: 900, padding: '2px 8px', borderRadius: 16 }}>
                100% Siap Ambil
              </span>
            </div>

            {/* Shelf Display Rak Fisik Bertingkat */}
            <div
              style={{
                background: 'linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%)',
                borderRadius: 16,
                border: '2px solid #a7f3d0',
                padding: '12px 14px',
                marginBottom: 12,
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {/* Slot Rak Aktif Terisi */}
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: 14,
                    padding: '10px 12px',
                    border: '2px solid #10b981',
                    boxShadow: '0 6px 14px rgba(16, 185, 129, 0.2)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 8, fontWeight: 900, color: '#059669', textTransform: 'uppercase' }}>
                    Lokasi Cucian Anda
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 900, fontFamily: 'monospace', color: '#047857', margin: '3px 0' }}>
                    RAK A-02
                  </div>
                  <span style={{ background: '#10b981', color: '#ffffff', fontSize: 9, fontWeight: 900, padding: '2px 8px', borderRadius: 10 }}>
                    ✓ Selesai Dipacking
                  </span>
                </div>

                {/* Slot Rak Tetangga */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: 14,
                    padding: '10px 12px',
                    border: '1px solid #cbd5e1',
                    textAlign: 'center',
                    opacity: 0.8,
                  }}
                >
                  <div style={{ fontSize: 8, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                    Kapasitas Slot
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'monospace', color: '#475569', margin: '3px 0' }}>
                    RAK A-03
                  </div>
                  <span style={{ background: '#f1f5f9', color: '#475569', fontSize: 8, fontWeight: 800, padding: '2px 6px', borderRadius: 8 }}>
                    Tersedia
                  </span>
                </div>
              </div>
            </div>

            {/* Kartu Notifikasi WhatsApp Otomatis (Live Dispatch) */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: 16,
                border: '2px solid #86efac',
                padding: '12px 14px',
                boxShadow: '0 8px 18px rgba(16, 185, 129, 0.15)',
                transform: `translateY(${waCardY}px) scale(${waCardScale})`,
                transition: 'transform 0.3s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 14 }}>💬</span>
                <span style={{ fontSize: 10, fontWeight: 900, color: '#16a34a' }}>
                  WhatsApp Gateway Si Kucek
                </span>
                <span style={{ marginLeft: 'auto', fontSize: 9, color: '#94a3b8', fontWeight: 700 }}>
                  Baru Saja
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: '#1e293b', lineHeight: 1.4 }}>
                &ldquo;Halo Kak! Cucian <strong style={{ color: '#047857' }}>SKC-B8D02</strong> telah SELESAI, wangi lavender &amp; siap di <strong style={{ color: '#047857' }}>RAK A-02</strong>. Silakan mampir ya! 🚀&rdquo;
              </p>
              <div style={{ textAlign: 'right', marginTop: 3, fontSize: 9, color: '#0284c7', fontWeight: 900 }}>
                ✓✓ Terkirim Otomatis
              </div>
            </div>

            {/* Badge Loyalti Stempel Si Kucek */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: 14 }}>🎁</span>
                <span style={{ fontSize: 10, fontWeight: 900, color: '#b45309' }}>
                  Kupon Stempel: 5/5 Terkumpul
                </span>
              </div>
              <span style={{ background: '#fef3c7', color: '#92400e', fontSize: 9, fontWeight: 900, padding: '2px 6px', borderRadius: 8 }}>
                Klaim Gratis Cuci 5Kg
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. DYNAMIC FULL-BLEED WATER WAVES (ANTI-BORDER KOTAK)                     */}
      {/* ========================================================================= */}
      {/* Wave Layer 1: Gelombang Belakang (Teal-Sky) */}
      <svg
        viewBox="-120 0 2160 380"
        style={{
          position: 'absolute',
          bottom: -20,
          left: '-6%',
          width: '112%',
          height: 240,
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
          height: 200,
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
          height: 50,
          background: 'linear-gradient(to bottom, rgba(248, 250, 252, 0) 0%, #f8fafc 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ========================================================================= */}
      {/* 5. IRIDESCENT FLOATING SOAP BUBBLES (DI SELURUH 1920PX)                   */}
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
              zIndex: 6,
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
