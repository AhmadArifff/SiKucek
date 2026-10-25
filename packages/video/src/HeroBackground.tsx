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

// 24 Gelembung sabun terdistribusi dengan variasi ukuran dan kecepatan
const BUBBLES: Bubble[] = [
  { id: 1, xPercent: 8, baseY: 1100, size: 75, speed: 2.2, wiggleAmplitude: 25, wiggleFrequency: 1.5, hueShift: 195, opacity: 0.65 },
  { id: 2, xPercent: 18, baseY: 850, size: 45, speed: 1.8, wiggleAmplitude: 15, wiggleFrequency: 2, hueShift: 210, opacity: 0.5 },
  { id: 3, xPercent: 28, baseY: 1200, size: 110, speed: 2.6, wiggleAmplitude: 35, wiggleFrequency: 1.2, hueShift: 175, opacity: 0.7 },
  { id: 4, xPercent: 38, baseY: 950, size: 55, speed: 2.0, wiggleAmplitude: 20, wiggleFrequency: 2.2, hueShift: 220, opacity: 0.55 },
  { id: 5, xPercent: 48, baseY: 1350, size: 90, speed: 2.4, wiggleAmplitude: 30, wiggleFrequency: 1.4, hueShift: 190, opacity: 0.6 },
  { id: 6, xPercent: 58, baseY: 750, size: 40, speed: 1.6, wiggleAmplitude: 18, wiggleFrequency: 2.5, hueShift: 205, opacity: 0.45 },
  { id: 7, xPercent: 68, baseY: 1150, size: 85, speed: 2.3, wiggleAmplitude: 28, wiggleFrequency: 1.6, hueShift: 180, opacity: 0.65 },
  { id: 8, xPercent: 78, baseY: 900, size: 60, speed: 1.9, wiggleAmplitude: 22, wiggleFrequency: 1.8, hueShift: 215, opacity: 0.5 },
  { id: 9, xPercent: 88, baseY: 1250, size: 100, speed: 2.5, wiggleAmplitude: 32, wiggleFrequency: 1.3, hueShift: 195, opacity: 0.7 },
  { id: 10, xPercent: 94, baseY: 800, size: 50, speed: 1.7, wiggleAmplitude: 16, wiggleFrequency: 2.1, hueShift: 200, opacity: 0.5 },
  { id: 11, xPercent: 12, baseY: 1400, size: 65, speed: 2.1, wiggleAmplitude: 24, wiggleFrequency: 1.7, hueShift: 185, opacity: 0.6 },
  { id: 12, xPercent: 24, baseY: 650, size: 35, speed: 1.5, wiggleAmplitude: 14, wiggleFrequency: 2.6, hueShift: 225, opacity: 0.4 },
  { id: 13, xPercent: 34, baseY: 1300, size: 95, speed: 2.4, wiggleAmplitude: 29, wiggleFrequency: 1.5, hueShift: 170, opacity: 0.65 },
  { id: 14, xPercent: 44, baseY: 700, size: 45, speed: 1.8, wiggleAmplitude: 19, wiggleFrequency: 2.0, hueShift: 205, opacity: 0.5 },
  { id: 15, xPercent: 54, baseY: 1450, size: 80, speed: 2.2, wiggleAmplitude: 26, wiggleFrequency: 1.6, hueShift: 195, opacity: 0.6 },
  { id: 16, xPercent: 64, baseY: 600, size: 30, speed: 1.4, wiggleAmplitude: 12, wiggleFrequency: 2.8, hueShift: 215, opacity: 0.4 },
  { id: 17, xPercent: 74, baseY: 1380, size: 105, speed: 2.5, wiggleAmplitude: 34, wiggleFrequency: 1.4, hueShift: 180, opacity: 0.7 },
  { id: 18, xPercent: 84, baseY: 720, size: 50, speed: 1.9, wiggleAmplitude: 20, wiggleFrequency: 2.2, hueShift: 210, opacity: 0.55 },
  { id: 19, xPercent: 91, baseY: 1420, size: 70, speed: 2.1, wiggleAmplitude: 25, wiggleFrequency: 1.8, hueShift: 190, opacity: 0.6 },
  { id: 20, xPercent: 4, baseY: 780, size: 40, speed: 1.6, wiggleAmplitude: 15, wiggleFrequency: 2.4, hueShift: 200, opacity: 0.45 },
  { id: 21, xPercent: 30, baseY: 500, size: 85, speed: 2.3, wiggleAmplitude: 27, wiggleFrequency: 1.5, hueShift: 185, opacity: 0.6 },
  { id: 22, xPercent: 50, baseY: 450, size: 60, speed: 2.0, wiggleAmplitude: 21, wiggleFrequency: 1.9, hueShift: 210, opacity: 0.5 },
  { id: 23, xPercent: 70, baseY: 520, size: 75, speed: 2.2, wiggleAmplitude: 24, wiggleFrequency: 1.7, hueShift: 195, opacity: 0.6 },
  { id: 24, xPercent: 85, baseY: 480, size: 55, speed: 1.8, wiggleAmplitude: 18, wiggleFrequency: 2.3, hueShift: 180, opacity: 0.5 },
];

// Partikel kilau bintang (sparkles)
const SPARKLES = [
  { x: 150, y: 220, size: 28, delay: 0 },
  { x: 420, y: 380, size: 36, delay: 25 },
  { x: 780, y: 190, size: 24, delay: 50 },
  { x: 1100, y: 320, size: 40, delay: 75 },
  { x: 1450, y: 250, size: 32, delay: 100 },
  { x: 1720, y: 410, size: 26, delay: 125 },
  { x: 260, y: 620, size: 30, delay: 40 },
  { x: 920, y: 680, size: 34, delay: 90 },
  { x: 1350, y: 590, size: 28, delay: 140 },
  { x: 1600, y: 720, size: 38, delay: 65 },
];

export const HeroBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  // Fase siklus matematika 0 s.d 2*PI untuk menjamin seamless loop sempurna
  const cycleProgress = (frame / durationInFrames) * 2 * Math.PI;

  // Gerakan napas ambient glow
  const glowScale1 = 1 + 0.12 * Math.sin(cycleProgress);
  const glowScale2 = 1 + 0.15 * Math.sin(cycleProgress + Math.PI / 2);
  const glowTranslateX = 40 * Math.sin(cycleProgress);
  const glowTranslateY = 30 * Math.cos(cycleProgress);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#f8fafc',
        overflow: 'hidden',
        fontFamily: 'sans-serif',
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
          width: 900,
          height: 900,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.42) 0%, rgba(14, 165, 233, 0.15) 50%, transparent 75%)',
          filter: 'blur(70px)',
          transform: `scale(${glowScale1})`,
        }}
      />

      {/* Gradient B: Lavender & Soft Violet Aura di kanan tengah */}
      <div
        style={{
          position: 'absolute',
          top: 100 - glowTranslateY * 0.8,
          right: -200 - glowTranslateX * 0.8,
          width: 1050,
          height: 1050,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.28) 0%, rgba(224, 231, 255, 0.35) 45%, transparent 75%)',
          filter: 'blur(80px)',
          transform: `scale(${glowScale2})`,
        }}
      />

      {/* Gradient C: Coral Warm Fresh Glow di tengah bawah */}
      <div
        style={{
          position: 'absolute',
          bottom: -200,
          left: '30%',
          width: 850,
          height: 850,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(251, 146, 60, 0.22) 0%, rgba(254, 215, 170, 0.28) 40%, transparent 70%)',
          filter: 'blur(75px)',
          transform: `scale(${glowScale1 * 0.95})`,
        }}
      />

      {/* Gradient D: Fresh Teal Accent di kiri bawah */}
      <div
        style={{
          position: 'absolute',
          bottom: -100,
          left: -100,
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.25) 0%, transparent 70%)',
          filter: 'blur(65px)',
        }}
      />

      {/* ========================================================================= */}
      {/* 2. DYNAMIC WATER WAVE LAYERS                                              */}
      {/* ========================================================================= */}
      {/* Wave Layer 1: Gelombang Belakang (Teal-Sky) */}
      <svg
        viewBox="0 0 1920 320"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 280,
          opacity: 0.45,
        }}
      >
        <path
          d={`
            M 0,${160 + 25 * Math.sin(cycleProgress)}
            C ${480 + 30 * Math.cos(cycleProgress)},${100 + 35 * Math.sin(cycleProgress + 1)}
              ${960 + 20 * Math.sin(cycleProgress)},${220 + 30 * Math.cos(cycleProgress)}
              ${1440 + 35 * Math.cos(cycleProgress)},${120 + 25 * Math.sin(cycleProgress + 2)}
            C 1680,${150 + 20 * Math.sin(cycleProgress)}
              1800,${170 + 15 * Math.cos(cycleProgress)}
              1920,${160 + 25 * Math.sin(cycleProgress)}
            L 1920,320 L 0,320 Z
          `}
          fill="url(#waveGrad1)"
        />
        <defs>
          <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#0d9488" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.45" />
          </linearGradient>
        </defs>
      </svg>

      {/* Wave Layer 2: Gelombang Depan Berkilau (Translucent Cyan) */}
      <svg
        viewBox="0 0 1920 320"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 220,
          opacity: 0.55,
        }}
      >
        <path
          d={`
            M 0,${140 + 20 * Math.cos(cycleProgress + Math.PI)}
            C ${500 + 25 * Math.sin(cycleProgress + 1)},${180 + 30 * Math.sin(cycleProgress + 2)}
              ${1000 + 35 * Math.cos(cycleProgress)},${110 + 25 * Math.sin(cycleProgress + 3)}
              ${1500 + 20 * Math.sin(cycleProgress)},${160 + 20 * Math.cos(cycleProgress + 1)}
            C 1720,${140 + 18 * Math.cos(cycleProgress)}
              1840,${130 + 15 * Math.sin(cycleProgress)}
              1920,${140 + 20 * Math.cos(cycleProgress + Math.PI)}
            L 1920,320 L 0,320 Z
          `}
          fill="url(#waveGrad2)"
        />
        <defs>
          <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#2dd4bf" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.5" />
          </linearGradient>
        </defs>
      </svg>

      {/* ========================================================================= */}
      {/* 3. IRIDESCENT FLOATING SOAP BUBBLES (SEAMLESS LOOP)                       */}
      {/* ========================================================================= */}
      {BUBBLES.map((bubble) => {
        // Rentang tinggi total siklus perputaran gelembung
        const loopDistance = height + 350;
        const totalMovement = bubble.speed * 6.5 * frame;
        
        // Posisi Y modulo loop seamless
        const currentY =
          height + 150 - ((bubble.baseY + totalMovement) % loopDistance);

        // Goyangan horizontal (wiggle) alami menggunakan fungsi trigonometri
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

        // Efek squash & stretch mikro pada gelembung
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
            {/* Pantulan kilau cahaya specular utama (highlight sabit) */}
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
            {/* Titik kilau sekunder kecil */}
            <div
              style={{
                position: 'absolute',
                top: '36%',
                left: '16%',
                width: bubble.size * 0.08,
                height: bubble.size * 0.08,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.85)',
              }}
            />
          </div>
        );
      })}

      {/* ========================================================================= */}
      {/* 4. CLEANSING SPARKLE STARS (TWINKLE EFFECT)                               */}
      {/* ========================================================================= */}
      {SPARKLES.map((sp, idx) => {
        // Kedipan berkala yang mulus
        const sparklePhase = cycleProgress * 2 + (sp.delay / durationInFrames) * Math.PI * 2;
        const sparkleOpacity = Math.max(0, 0.3 + 0.6 * Math.sin(sparklePhase));
        const sparkleScale = Math.max(0.4, 0.7 + 0.35 * Math.sin(sparklePhase));
        const rotateDeg = 45 + (frame * 0.6 + idx * 30);

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: sp.x,
              top: sp.y,
              width: sp.size,
              height: sp.size,
              opacity: sparkleOpacity,
              transform: `scale(${sparkleScale}) rotate(${rotateDeg}deg)`,
              pointerEvents: 'none',
            }}
          >
            {/* Bentuk bintang 4 sudut kilau emas-amber lembut */}
            <svg viewBox="0 0 24 24" fill="none" style={{ width: '100%', height: '100%' }}>
              <path
                d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z"
                fill="url(#sparkleGold)"
              />
              <defs>
                <linearGradient id="sparkleGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.95" />
                  <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.75" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        );
      })}

      {/* ========================================================================= */}
      {/* 5. SOFT VIGNETTE OVERLAY                                                  */}
      {/* ========================================================================= */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 40%, transparent 60%, rgba(240, 249, 255, 0.35) 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
