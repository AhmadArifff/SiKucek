# Naskah Video Hero SiKucek untuk Remotion

*Judul kerja: Satu Cucian, Satu Perjalanan Transparan. Sumber: PRD SiKucek v1.0.0. Pembaca utama: agents produksi.*

## 1. Ringkasan

Video latar hero section berdurasi 50 detik yang mengikuti satu cucian milik Rani, dari meja kasir sampai kupon gratis. Satu cerita menunjukkan alur pengguna (kasir dan pelanggan), cara kerja sistem (database, antrean WhatsApp, worker), dan nilai jual utama: foto QC anti sengketa, pelacakan tanpa login, lokasi rak fisik, dan stempel loyalti.

Gaya: product film sinematik. Semua layar aplikasi dibuat ulang 1:1 dari desain nyata, kamera bergerak halus seperti dolly, cahaya lembut, bayangan realistis, teks di layar seminimal mungkin.

Dua varian dari satu kode:

| Varian | Fungsi | Isi |
| --- | --- | --- |
| `clean` (utama) | Latar hero | Tanpa caption, tanpa audio, area kiri dibiarkan tenang supaya headline HTML terbaca |
| `story` (opsional) | Sosial media, landing kedua | Caption, CTA akhir, musik, narasi |

## 2. Bisakah dengan Remotion? Jawaban Jujur

Bisa. Remotion merender komponen React frame demi frame, jadi sangat kuat untuk UI aplikasi yang nyata, animasi data, perangkat 3D, dan transisi sinematik. Yang tidak bisa: Remotion tidak memotret dunia fisik. Maka kata realistis dibagi tiga tingkat:

| Tingkat | Isi | Status |
| --- | --- | --- |
| A. Realistis ala product film | UI replika 1:1, parallax kamera, depth of field (blur lapisan belakang), motion blur, bayangan lembut, grain halus, pantulan cahaya pada kaca perangkat | Wajib |
| B. Perangkat 3D | Tablet dan ponsel model GLB lewat `@remotion/three`, cahaya environment, bayangan kontak | Disarankan |
| C. Footage nyata | Cutaway tangan, mesin cuci, rak, dari footage asli atau stok, dipadukan lewat `OffthreadVideo` | Opsional, butuh aset di luar kode |

Rekomendasi: kerjakan A dan B. Tambahkan C hanya jika ada anggaran footage.

## 3. Spesifikasi Output

| Item | Nilai |
| --- | --- |
| Composition utama | `HeroBG`, 1920x1080, 30 fps, 1500 frame (50 detik) |
| Composition mobile | `HeroBG-Mobile`, 1080x1920 (9:16), konten sama, layout disusun ulang |
| Poster | Still frame 0 dan frame 1380 |
| Ekspor | MP4 H.264 yuv420p, WebM VP9, poster JPG. Target MP4 desktop di bawah 8 MB, mobile 720p di bawah 4 MB |
| Audio | `clean`: tanpa audio (autoplay browser mewajibkan muted). `story`: musik 100 sampai 110 BPM dan SFX |
| Loop | Frame terakhir identik dengan frame pertama (gradien dan gelembung) |
| Safe zone desktop | Kolom kiri 0 sampai 42% lebar: latar tenang dan blur, tanpa detail UI. Aksi utama di 45 sampai 100% |
| Safe zone mobile | 40% atas tenang untuk headline. Aksi di 60% bawah |

## 4. Aturan Wajib untuk Agents

1. Semua data mengikuti tabel bab 5. Seluruhnya fiktif.
2. Jangan tampilkan Project ID, URL Supabase, key, password, connection string, atau kata Sandbox. Diagram arsitektur memakai label generik.
3. Hanya fitur P0 dan P1 yang ditampilkan. Cetak thermal, web push, dan mode offline (P2) jangan diklaim.
4. Tanpa em dash di teks mana pun (aturan QA di PRD). Kontras minimal WCAG AA. Tap target pada UI yang ditampilkan minimal 44px.
5. Warna hanya dari token PRD: Sky 500 `#0EA5E9`, Sky 400 `#38BDF8`, Sky 600 `#0284C7`, Sky 700 `#0369A1`, putih dan Sky 50 `#F0F9FF`, Rose 400 `#FB7185`, Rose 500 `#F43F5E`, Amber 500 `#F59E0B`, Amber 400 `#FBBF24`, Slate 900 `#0F172A`. Status: Received amber, Washing/Drying/Ironing sky, Ready emerald, Completed slate, QC Issue rose.
6. Font: Plus Jakarta Sans untuk judul dan teks, JetBrains Mono untuk berat dan rupiah (tabular numbers).
7. `logo-sikucek.jpg` dan `text-sikucek.jpg` adalah JPG tanpa transparansi. Buat cutout PNG transparan sebelum dikomposit. Jangan ubah proporsi atau warna maskot.
8. Maskot hanya muncul di titik yang ditetapkan PRD bab 2.3 (splash, QC, siap ambil, stempel) agar tidak berlebihan.
9. Tampilan chat dibuat generik bergaya aplikasi pesan, tanpa logo merek pihak ketiga. QRIS ditulis sebagai teks metode bayar saja.
10. Aturan Remotion: dilarang `Math.random` (gunakan `random(seed)` dari `remotion`), dilarang CSS transition atau CSS animation (tidak sinkron dengan render per frame), semua gerak lewat `useCurrentFrame`, `interpolate`, `spring`.

## 5. Data Tunggal (Single Source of Truth)

| Elemen | Nilai |
| --- | --- |
| Tanggal cerita | Senin, 26 Oktober 2026 |
| Pelanggan | Rani Kusuma, WA 0857 1122 3345, Tier Busa Baru, 4 dari 5 stempel, 120 poin |
| Kasir | Budi |
| Nomor order | `SKC-261026-0042` |
| Kode lacak | `KCK-7F3A9Q` (tautan `sikucek.app/track/KCK-7F3A9Q`) |
| Layanan kiloan | Cuci Kering Setrika 2 Hari, Rp7.000/kg, berat riil 3.20 kg (di atas minimum 2.0 kg, jadi ditagih 3.20 kg) |
| Layanan satuan | Kemeja, 2 pcs @ Rp5.000 |
| Perhitungan | Kiloan 3.20 x 7.000 = Rp22.400. Satuan 2 x 5.000 = Rp10.000. Total bersih Rp32.400 |
| Pembayaran | QRIS, status LUNAS |
| Estimasi selesai | 28 Okt 2026 |
| Cacat QC | Kerah kemeja, tipe Robek (`torn`), catatan: Kerah kanan sobek 3 cm. WebP 412 KB |
| Rak | `RAK-B02` di POS dan WhatsApp, banner PWA: RAK B-02 |
| Hasil loyalti | Stempel ke-5 terisi, Kupon Gratis Cuci Kiloan Maksimal 5 Kg terbit. Check-in hari ke-3: +20 poin (120 jadi 140) |

## 6. Struktur Timeline (30 fps)

| Scene | Waktu | Frame | Tujuan |
| --- | --- | --- | --- |
| S1 Hook | 0:00 sampai 0:03 | 0 sampai 90 | Suasana segar, meja kasir |
| S2 Intake kasir | 0:03 sampai 0:10 | 90 sampai 300 | Order hybrid kiloan dan satuan |
| S3 Foto QC | 0:10 sampai 0:17 | 300 sampai 510 | Bukti kondisi pakaian |
| S4 Pembayaran | 0:17 sampai 0:21 | 510 sampai 630 | QRIS dan order terbit |
| S5 Di balik layar | 0:21 sampai 0:28 | 630 sampai 840 | Cara kerja sistem dan notifikasi |
| S6 Pelacakan | 0:28 sampai 0:35 | 840 sampai 1050 | Tracking publik dan galeri QC |
| S7 Siap ambil | 0:35 sampai 0:40 | 1050 sampai 1200 | Wajib rak, notifikasi siap ambil |
| S8 Loyalti | 0:40 sampai 0:46 | 1200 sampai 1380 | Stempel, kupon, check-in |
| S9 Outro dan loop | 0:46 sampai 0:50 | 1380 sampai 1500 | Logotype, tagline, kembali ke frame 0 |

Transisi antar scene 12 frame lewat `TransitionSeries`. Agar total tetap 1500 frame setelah overlap, durasi tiap sequence = durasi tabel + 12 frame (kecuali scene terakhir). Hitung total memakai `calculateMetadata`, jangan ditulis manual.

## 7. Naskah Scene demi Scene

### S1 Hook (0:00 sampai 0:03)

- **Visual:** Gradien Sky 400 ke Sky 50. Gelembung sabun naik dengan highlight pantulan. Satu gelembung besar pecah menjadi wipe yang menyingkap meja kasir tampak atas: kain putih bersih, timbangan digital, tablet POS, dua kemeja terlipat (satu dengan kerah sobek kecil), tas laundry.
- **Kamera:** Top-down, dolly maju pelan skala 1.00 ke 1.06, tilt 4 derajat.
- **Caption (story):** Cuci cepat. Tanpa was-was.
- **SFX:** Ambience gelembung, satu pop.
- **Implementasi:** `BubbleField` deterministik dan loop-safe (kode di bab 8).

### S2 Intake kasir (0:03 sampai 0:10)

- **Visual:** Kamera mendorong masuk ke layar tablet POS halaman `/orders/new`. Indikator sentuhan berupa lingkaran ripple, bukan kursor mouse.
- **0:03 sampai 0:04.2:** Nomor WA diketik huruf demi huruf. Kartu autocomplete meluncur: Rani Kusuma, badge Tier Busa Baru, empat koin emas terisi dari lima slot.
- **0:04.2 sampai 0:06:** Pilih Cuci Kering Setrika 2 Hari @ Rp7.000/kg. Inset timbangan digital menghitung 0.00 ke 3.20 kg dengan sedikit overshoot, kolom berat terisi 3.20.
- **0:06 sampai 0:08:** Grid ikon satuan, tap Kemeja dua kali, stepper menjadi 2 pcs.
- **0:08 sampai 0:10:** Panel kalkulasi (JetBrains Mono, tabular) menghitung naik: Kiloan Rp22.400, Satuan Rp10.000, Total Rp32.400. Catatan muncul: Pisahkan baju putih.
- **Caption (story):** Kiloan dan satuan, satu nota.
- **SFX:** Ketukan tap halus, tick timbangan.

### S3 Foto QC (0:10 sampai 0:17)

- **Visual:** Kamera berayun dari tablet ke kemeja lalu kembali ke layar. Layar membuka Ambil Foto Kondisi Pakaian dengan viewfinder langsung yang menampilkan kerah sobek.
- **0:10 sampai 0:12:** Kotak fokus menyempit, flash rana, gambar membeku.
- **0:12 sampai 0:14:** Thumbnail terbang ke slot galeri. Chip jenis cacat muncul: Robek (terpilih, Rose), Noda Membandel, Luntur Awal, Kancing Hilang, Lainnya. Catatan diketik: Kerah kanan sobek 3 cm.
- **0:14 sampai 0:17:** Toast Terkompresi WebP 412 KB, progress bar unggah ke penyimpanan foto QC lalu centang emerald. Maskot Si Kucek dengan kaca pembesar muncul di pojok kartu foto (PRD 2.3 poin 3).
- **Caption (story):** Difoto sebelum dicuci. Nol sengketa.
- **SFX:** Shutter, ping sukses.

### S4 Pembayaran (0:17 sampai 0:21)

- **Visual:** Modal pembayaran, metode QRIS dipilih. Kode QR terbentuk dari kotak-kotak kecil. Ponsel masuk dari kanan, bracket pemindai mengunci, layar ponsel menampilkan Bayar Rp32.400.
- **Akhir scene:** QR larut menjadi stempel LUNAS emerald disertai ledakan gelembung. Tombol Simpan dan Terbitkan Pesanan ditekan, nomor `SKC-261026-0042` muncul.
- **Caption (story):** Bayar QRIS, langsung lunas.
- **SFX:** Beep pindai, chime lunas.

### S5 Di balik layar (0:21 sampai 0:28)

- **Visual:** Layar tablet ditarik mundur lewat wipe gelembung menjadi peta sistem bergaya kartu kaca lembut di atas latar Sky 50 bertitik. Simpul berurutan: Kasir POS, Database (chip: Aman dengan RLS, Penyimpanan foto QC), Trigger, Antrean WhatsApp, Worker, Ponsel pelanggan.
- **Gerak data:** Paket cahaya bergerak sepanjang kurva (`@remotion/paths`: `evolvePath`, `getPointAtLength`). Baris antrean berubah dari `pending` (amber) ke `sent` (emerald). Chip penghitung: Terkirim dalam 6 detik (batas PRD 15 detik).
- **Klimaks:** Ponsel mendarat di tengah, gelembung chat menampilkan: Halo Kak Rani! Terima kasih sudah mencuci di SiKucek. Nomor Pesanan: SKC-261026-0042. Tautan `sikucek.app/track/KCK-7F3A9Q`.
- **Chip tambahan (story):** Tarif dan template pesan bisa diubah tanpa deploy ulang (Pusat Konfigurasi).
- **Caption (story):** Di balik layar, nota terkirim otomatis.
- **SFX:** Whoosh paket data, notifikasi pesan.

### S6 Pelacakan (0:28 sampai 0:35)

- **Visual:** Ponsel Rani dengan sedikit goyangan tangan (noise halus dari `@remotion/noise`). Tautan diketuk, PWA `/track/KCK-7F3A9Q` terbuka: logotype dengan gelembung, kartu ringkasan, stepper tujuh tahap.
- **0:28 sampai 0:29.5:** Header, kartu ringkasan, badge Received amber.
- **0:29.5 sampai 0:32.5:** Layar terbelah. Kanan: POS Budi, tombol Geser Status ditekan berulang. Kiri: stepper maju Washing, Drying, Ironing, Packing QC, ikon gelembung bergerak, badge sky. Antar tahap ada wipe lingkaran seperti jendela mesin cuci berisi busa. Jam kecil menandai Hari 1 dan Hari 2.
- **0:32.5 sampai 0:35:** Gulir ke Galeri Bukti QC, tap thumbnail, lightbox zoom pada kerah sobek berlabel Kondisi awal. Rincian nota menampilkan LUNAS.
- **Caption (story):** Pantau tiap tahap. Tanpa login.
- **SFX:** Klik status, whoosh busa.

### S7 Siap ambil (0:35 sampai 0:40)

- **Visual:** POS `/orders/[id]`, tombol Siap Ambil ditekan. Modal lokasi rak muncul. Percobaan konfirmasi tanpa rak: modal bergetar, pesan Pilih lokasi rak dulu (menunjukkan aturan wajib rak PRD 10.5).
- **Lanjutan:** Pilih RAK-B02, konfirmasi, badge berubah Ready emerald, penghitung Notifikasi terkirim 9 detik.
- **Potong ke ponsel Rani:** Pesan: Kabar gembira Kak Rani! Pakaian Kakak di SiKucek sudah SELESAI. Lokasi Pengambilan: RAK-B02. Lalu banner PWA hijau: Pakaian Anda berada di RAK B-02.
- **Penutup scene:** Si Kucek memegang kemeja bersih berkilau di samping label Rak B-02 (PRD 2.3 poin 5), kilau bintang emas.
- **Caption (story):** Bajumu menunggu di Rak B-02.
- **SFX:** Getar penolakan, chime siap.

### S8 Loyalti (0:40 sampai 0:46)

- **Visual:** Serah terima tas di meja kasir, Budi menekan Selesai Diambil. Beralih ke PWA `/app`: kartu stempel lima slot, empat koin terisi.
- **Aksi:** Slot kelima distempel dengan efek hentak dan percikan koin. Kartu penuh, Si Kucek melompat gembira. Kartu kupon berputar masuk: Kupon Gratis Cuci Kiloan Maksimal 5 Kg, catatan Berlaku untuk komponen kiloan.
- **Check-in:** Tombol gelembung Klaim Poin Hari Ini (+20 Poin) ditekan, partikel gelembung meletup, bintang emas hari ke-3 menyala, poin 120 menghitung ke 140.
- **Caption (story):** Lima stempel, cuci gratis.
- **SFX:** Stamp thunk, chime koin, pop gelembung.

### S9 Outro dan loop (0:46 sampai 0:50)

- **Visual:** Semua elemen UI mengecil menjadi satu gelembung besar. Kamera menarik mundur menyingkap logotype `text-sikucek` dengan maskot di sisinya, gelembung mengambang. Tagline: Solusi Laundry Pintar, Cepat, Higienis, dan Transparan.
- **Loop:** 15 frame terakhir cross-dissolve ke keadaan frame 0 (gradien dan gelembung saja).
- **CTA (story):** Antar Sekarang atau Cek Cucian.

## 8. Blueprint Teknis Remotion

Letakkan sebagai workspace `apps/video` di monorepo Turborepo (sesuai PRD). Tailwind memakai versi 3 lewat paket `@remotion/tailwind`; dokumentasi Remotion menyediakan jalur v3 dan template `create-video --tailwind`. Semua paket `remotion` dan `@remotion/*` harus satu versi persis, tanpa tanda `^`.

```
apps/video/
  public/ (aset: cutout PNG, foto kerah, frame perangkat, audio)
  src/
    Root.tsx
    style.css
    compositions/HeroBG.tsx
    scenes/ S1Hook.tsx ... S9Outro.tsx
    ui/ (replika POS, PWA, WhatsApp, stepper, stamp card)
    fx/ BubbleField.tsx, Typewriter.tsx, CameraRig.tsx, GrainOverlay.tsx
    data/story.ts (data tunggal bab 5)
  tailwind.config.js
  remotion.config.ts
```

Dependensi: `remotion`, `@remotion/cli`, `@remotion/tailwind`, `tailwindcss@3`, `@remotion/transitions`, `@remotion/paths`, `@remotion/noise`, `@remotion/motion-blur`, `@remotion/google-fonts`. Opsional tingkat B: `@remotion/three`, `three`, `@react-three/fiber`.

```ts
// remotion.config.ts
import {Config} from '@remotion/cli/config';
import {enableTailwind} from '@remotion/tailwind';

Config.overrideWebpackConfig((current) => enableTailwind(current));
```

```js
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {extend: {fontFamily: {sans: ['Plus Jakarta Sans', 'sans-serif'], mono: ['JetBrains Mono', 'monospace']}}},
  plugins: [],
};
```

```css
/* src/style.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```tsx
// src/Root.tsx
import './style.css';
import type {FC} from 'react';
import {Composition} from 'remotion';
import {HeroBG} from './compositions/HeroBG';

export const RemotionRoot: FC = () => (
  <>
    <Composition id='HeroBG' component={HeroBG} width={1920} height={1080} fps={30} durationInFrames={1500} defaultProps={{variant: 'clean' as const}} />
    <Composition id='HeroBG-Mobile' component={HeroBG} width={1080} height={1920} fps={30} durationInFrames={1500} defaultProps={{variant: 'clean' as const}} />
  </>
);
```

```tsx
// src/fx/BubbleField.tsx  (deterministik dan loop-safe)
import type {FC} from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';

export const BubbleField: FC<{count?: number; seed?: string}> = ({count = 60, seed = 'sikucek'}) => {
  const frame = useCurrentFrame();
  const {width, height, durationInFrames} = useVideoConfig();
  const t = frame / durationInFrames;

  return (
    <AbsoluteFill className='overflow-hidden'>
      {Array.from({length: count}, (_, i) => {
        const size = 12 + random(`${seed}-s-${i}`) * 70;
        const x = random(`${seed}-x-${i}`) * width;
        const cycles = 1 + Math.floor(random(`${seed}-c-${i}`) * 3); // bilangan bulat = loop mulus
        const phase = (t * cycles + random(`${seed}-o-${i}`)) % 1;
        const y = height + size - phase * (height + size * 2);
        const sway = Math.sin(2 * Math.PI * t * (cycles + 1) + i) * 14;
        return (
          <div
            key={i}
            className='absolute rounded-full border border-white/60 bg-white/20'
            style={{left: x + sway, top: y, width: size, height: size}}
          />
        );
      })}
    </AbsoluteFill>
  );
};
```

```tsx
// src/fx/Typewriter.tsx
import type {FC} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';

export const Typewriter: FC<{text: string; start: number; cps?: number}> = ({text, start, cps = 12}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const n = Math.max(0, Math.min(text.length, Math.floor(((frame - start) / fps) * cps)));
  return <span className='font-mono tabular-nums'>{text.slice(0, n)}</span>;
};
```

**Prinsip gerak (agar terasa mahal):** `spring` dengan damping 14 sampai 20 untuk elemen UI, `Easing.bezier(0.22, 1, 0.36, 1)` untuk kamera, jeda 3 sampai 5 frame antar elemen berurutan (stagger), `CameraMotionBlur` hanya pada gerakan kamera cepat (S3 dan S5), grain dengan opasitas 3 sampai 5%, bayangan berlapis dua (kontak tajam dan ambient lebar), blur 2 sampai 4px pada lapisan latar untuk depth of field. Font dimuat lewat `@remotion/google-fonts` (`loadFont()` di level modul). Gambar memakai `<Img>` dan `staticFile()`.

**Masalah umum dan akar penyebabnya:**

| Gejala | Penyebab | Solusi |
| --- | --- | --- |
| Render tiap mesin berbeda hasil | Memakai `Math.random` atau `Date.now` | Ganti dengan `random(seed)` dan frame |
| Animasi di preview jalan, di render diam | CSS transition atau animation tidak terikat frame | Semua gerak lewat `interpolate` atau `spring` |
| Loop terlihat melompat | Gerak latar tidak periodik pada durasi total | Siklus bilangan bulat seperti `BubbleField` |
| Font berpindah saat render | Font belum siap | `loadFont()` dari `@remotion/google-fonts` |
| Render lambat | Blur dan shadow berat di banyak layer | Gabungkan layer, batasi `filter: blur`, turunkan `--concurrency` bila memori habis |

**Perintah render:**

```bash
pnpm --filter video exec remotion render HeroBG out/hero-bg.mp4 --codec=h264 --crf=18 --pixel-format=yuv420p --muted
pnpm --filter video exec remotion render HeroBG out/hero-bg.webm --codec=vp9 --muted
pnpm --filter video exec remotion still HeroBG out/hero-poster.jpg --frame=0
```

Periksa flag terbaru pada dokumentasi versi Remotion yang terpasang sebelum otomasi CI.

## 9. Daftar Aset

| Aset | Catatan |
| --- | --- |
| `logo-sikucek` cutout PNG | Dari JPG, background dihapus, tepi halus |
| `text-sikucek` cutout PNG | Sama, pertahankan outline navy |
| Foto atau render kemeja dengan kerah sobek | Macro, resolusi minimal 2000px, juga versi viewfinder |
| Model atau frame tablet dan ponsel | GLB untuk tingkat B, atau PNG berlapis refleksi |
| Replika UI | Idealnya impor komponen dari `packages/ui` agar identik dengan aplikasi |
| Ikon pakaian, rak, koin emas, bintang | Gaya konsisten dengan maskot |
| Audio (story) | Musik bebas royalti, SFX: gelembung, shutter, beep, stamp, koin, notifikasi |

## 10. Pemasangan di Hero (`apps/web`)

```tsx
<section className='relative isolate min-h-[100svh] overflow-hidden'>
  <video
    className='absolute inset-0 -z-10 h-full w-full object-cover'
    autoPlay muted loop playsInline preload='metadata'
    poster='/video/hero-poster.jpg'
  >
    <source src='/video/hero-bg.webm' type='video/webm' />
    <source src='/video/hero-bg.mp4' type='video/mp4' />
  </video>
  <div className='absolute inset-0 -z-10 bg-gradient-to-r from-sky-50/90 via-sky-50/50 to-transparent' />
  {/* headline, tagline, tombol Antar Sekarang dan Cek Cucian, Quick Tracking Bar */}
</section>
```

Tips performa: poster JPG sebagai LCP, video dimuat setelah first paint, fallback poster untuk `prefers-reduced-motion`, versi mobile 720p lewat `media` pada `source`, simpan di CDN dengan cache panjang agar aman untuk ribuan pengunjung.

## 11. Checklist QA

- [ ] Tepat 1500 frame, frame 0 dan frame 1499 menyatu mulus saat loop
- [ ] Semua angka cocok bab 5 (22.400 + 10.000 = 32.400)
- [ ] Tidak ada `Math.random`, CSS animation, atau font fallback saat render
- [ ] Tidak ada em dash, kontras AA, tap target 44px pada UI yang tampil
- [ ] Tidak ada kredensial, Project ID, URL Supabase, atau kata Sandbox
- [ ] Headline hero terbaca di atas video pada desktop dan mobile
- [ ] Ukuran file sesuai target, poster dan WebM tersedia
- [ ] Maskot hanya di titik PRD 2.3, proporsi dan warna asli

## 12. Pembagian Kerja Agents

| Agent | Tugas | Selesai jika |
| --- | --- | --- |
| Art Director | Cutout aset, token warna, referensi gerak, storyboard still per scene | Semua aset ada di `public/`, still S1 sampai S9 disetujui |
| UI Replica Dev | Komponen POS, PWA, chat, stepper, stamp card dari `packages/ui` | Tiap layar identik dengan aplikasi |
| Motion Dev | Scene S1 sampai S9, kamera, transisi, FX | Preview mulus 30 fps, data dari `story.ts` |
| Sound Designer (story) | Musik dan SFX tersinkron frame | Level audio seimbang, tanpa clipping |
| QA dan Render | Checklist bab 11, ekspor, ukuran, uji di hero | Semua kotak tercentang |

Urutan: Art Director, lalu UI Replica dan Motion paralel, lalu Sound, lalu QA dan Render.

## 13. Narasi Opsional (varian story)

| Scene | Narasi |
| --- | --- |
| S1 | Cucian numpuk? Tenang, ada Si Kucek. |
| S2 | Kasir timbang dan catat, kiloan dan satuan dalam satu nota. |
| S3 | Kondisi pakaian difoto sebelum dicuci, jadi tidak ada lagi debat soal sobekan. |
| S4 | Bayar QRIS, langsung lunas. |
| S5 | Di balik layar, data terkunci aman dan nota WhatsApp terkirim otomatis. |
| S6 | Pantau tiap tahap cucian dari satu tautan, tanpa login. |
| S7 | Selesai? Kamu langsung tahu rak tempat bajumu menunggu. |
| S8 | Setiap cucian jadi stempel. Lima stempel, cuci gratis. |
| S9 | SiKucek. Laundry pintar, cepat, higienis, dan transparan. |

## 14. Asumsi dan Pertanyaan Terbuka

- Asumsi: durasi 50 detik, hero tanpa audio, brand tetap ceria dan ramah sesuai PRD.
- Perlu keputusan: pakai tingkat B (perangkat 3D) atau cukup A? Ada anggaran footage nyata (tingkat C)?
- Jika hero terasa terlalu panjang, versi potong 20 detik: S2, S3, S6, S8 plus S1 dan S9.
