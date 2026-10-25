import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startRender() {
  console.log('🚀 Memulai proses bundling Remotion Video SiKucek...');
  const entryPoint = path.resolve(__dirname, '../src/index.ts');
  const outputDir = path.resolve(__dirname, '../../../apps/web/public/videos');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'hero-loop.mp4');
  const posterPath = path.join(outputDir, 'hero-poster.jpg');

  // Gunakan port khusus (3050) agar tidak konflik dengan Next.js dev server di port 3000
  const RENDER_PORT = 3050;

  const bundleLocation = await bundle({
    entryPoint,
    webpackOverride: (config) => config,
  });

  console.log('📦 Bundling selesai di:', bundleLocation);

  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: 'HeroBackground',
    port: RENDER_PORT,
  });

  console.log(`📸 Merender thumbnail poster statis frame 0 ke ${posterPath}...`);
  await renderStill({
    composition,
    serveUrl: bundleLocation,
    output: posterPath,
    frame: 0,
    imageFormat: 'jpeg',
    port: RENDER_PORT,
    gl: 'angle',
  });
  console.log('✅ Poster thumbnail selesai dibuat!');

  console.log(`🎬 Merender video MP4 "${composition.id}" (${composition.width}x${composition.height}, ${composition.fps}fps, ${composition.durationInFrames} frames)...`);

  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: 'h264',
    outputLocation: outputPath,
    imageFormat: 'jpeg',
    gl: 'angle',
    port: RENDER_PORT,
    onProgress: ({ progress }) => {
      const percent = Math.round(progress * 100);
      if (percent % 10 === 0) {
        process.stdout.write(`\r⏳ Progress Render Video: ${percent}%`);
      }
    },
  });

  console.log('\n✅ Video Berhasil Dirender!');
  console.log('📁 Lokasi video:', outputPath);
  console.log('📁 Lokasi poster:', posterPath);
}

startRender().catch((err) => {
  console.error('❌ Gagal merender video Remotion:', err);
  process.exit(1);
});

