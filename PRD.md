# PRD: SiKucek (Smart Hybrid Laundry Operating System)

**Product Name:** SiKucek  
**Tagline:** Solusi Laundry Pintar, Cepat, Higienis, dan Transparan  
**Author:** Antigravity Product & Architecture Team  
**Date:** 2026-10-08  
**Version:** v1.0.0 (Monorepo Blueprint)  
**Status:** Approved for Development  

---

## 1. Executive Summary

SiKucek adalah platform operasional laundry modern berbasis arsitektur **Monorepo (Turborepo)** yang memadukan operasional kasir (Point of Sales / POS), quality control pakaian anti-sengketa (foto kondisi fisik masuk ke Supabase Storage), pelacakan progres cucian real-time via PWA, serta retensi pelanggan berbasis gamifikasi (Stamp Card Digital & Daily Check-in Streak).

Sistem dirancang dengan prinsip **Zero Infrastructure Cost** pada fase pengembangan: memanfaatkan Next.js PWA, Supabase PostgreSQL & Storage, Midtrans Sandbox (QRIS & Virtual Account), dan engine pengirim notifikasi WhatsApp otomatis berbasis Node.js Baileys yang terhubung ke database.

---

## 2. Brand Identity & Visual Assets Specification

Aplikasi SiKucek memiliki DNA visual yang ceria, ramah (*friendly*), bersih, dan terpercaya. Dua aset grafis utama yang telah disediakan wajib diintegrasikan ke dalam seluruh ekosistem aplikasi:

### 2.1 Aset Visual Utama

| Aset File | Tipe Aset | Deskripsi Karakteristik & Visual |
|---|---|---|
| `logo-sikucek.jpg` | **Brand Mascot ("Si Kucek")** | Karakter ember kartun ceria berwarna toska/cyan yang mengenakan sepatu bot karet, bermahkota busa sabun melimpah, memiliki sikat di bagian belakang, mata besar berbinar, memegang pakaian kotor di tangan kanan yang disulap menjadi pakaian toska bersih berkilau di tangan kiri, dikelilingi gelembung air, kilau bintang emas (*sparkle*), dan koin emas loyalti. |
| `text-sikucek.jpg` | **Typographic Logotype** | Tipografi 3D bernuansa *bubble comic* dengan gradasi biru muda ke cyan pekat, diberi aksen busa sabun lembut di atas huruf "S" dan "k", outline navy gelap yang tegas, highlight kilau air, serta percikan gelembung sabun di sekeliling teks. |

### 2.2 Design DNA & Color Palette Token

Berdasarkan ekstraksi warna dari aset `logo-sikucek.jpg` dan `text-sikucek.jpg`, sistem UI/UX menggunakan palet token berikut:

- **Primary Fresh Cyan:** `#0EA5E9` (Sky 500) dan `#38BDF8` (Sky 400) - Merepresentasikan air bersih, kesegaran, dan kebersihan.
- **Deep Clean Ocean:** `#0284C7` (Sky 600) dan `#0369A1` (Sky 700) - Digunakan untuk tombol utama, teks judul penting, dan outline kontras.
- **Foam Pure White:** `#FFFFFF` dan `#F0F9FF` (Sky 50) - Latar belakang kartu, gelembung busa, dan kanvas utama.
- **Bubble Blush (Coral/Pink):** `#FB7185` (Rose 400) dan `#F43F5E` (Rose 500) - Pipi merona Si Kucek, badge status pakaian bermasalah (QC warning), dan tag urgent/ekspres.
- **Loyalty Gold (Sparkle & Coin):** `#F59E0B` (Amber 500) dan `#FBBF24` (Amber 400) - Koin reward, stempel loyalti aktif, bintang streak harian, dan voucher diskon.
- **Dark Navy Outline:** `#0F172A` (Slate 900) - Teks keterbacaan tinggi berstandar WCAG AA dan garis tepi komponen bergaya playful modern.

### 2.3 Matriks Penempatan Maskot ("Si Kucek") pada Antarmuka (UI/UX)

1. **Splash Screen & Header PWA Pelanggan**:
   - Menampilkan `text-sikucek.jpg` sebagai identitas header dengan animasi gelembung melayang halus.
2. **Empty State (Belum Ada Cucian / Keranjang Kosong)**:
   - Menampilkan ilustrasi Si Kucek memegang ember kosong dengan teks ramah: *"Keranjang cucian masih kosong nih! Yuk masukkan cucianmu biar Si Kucek cuci sampai kinclong!"*
3. **Quality Control Warning (Deteksi Cacat Pakaian)**:
   - Si Kucek dengan gestur teliti (kaca pembesar/mata fokus) pada kartu foto kerusakan kain untuk menandakan proses QC yang transparan.
4. **Gamifikasi & Stempel Loyalti**:
   - Setiap stempel yang terisi menampilkan koin emas Si Kucek berkilau. Saat mencapai 5 stempel, animasi Si Kucek melompat gembira merayakan kupon gratis cuci kiloan.
5. **Ready to Pick-up (Siap Ambil)**:
   - Si Kucek memegang baju bersih berkilau di samping nomor rak penyimpanan (misal: "Rak A-03").

---

## 3. Arsitektur Monorepo (Turborepo & pnpm)

Sistem dibangun dalam satu repository tunggal (*monorepo*) dengan pembagian paket kerja independen namun saling terhubung melalui *shared contract*:

```
SiKucek/
├── apps/
│   ├── web/                    # Portal Pelanggan PWA & Public Tracking (Next.js App Router)
│   ├── pos/                    # Kasir & Operator Laundry Dashboard (Next.js / Vite SPA)
│   └── worker/                 # WhatsApp Automation Engine (Node.js + Baileys)
├── packages/
│   ├── shared/                 # Zod Schemas, TypeScript Types, Enums, DTOs & Formatters
│   ├── ui/                     # Design System Komponen (Tailwind, Radix/Shadcn, Mascot UI)
│   └── database/               # Supabase Client, Migrations, Seed Data & DDL SQL
├── logo-sikucek.jpg            # Brand Asset Maskot
├── text-sikucek.jpg            # Brand Asset Logotype
├── package.json                # Root package.json (pnpm workspaces)
├── turbo.json                  # Turborepo Build & Pipeline Configuration
└── PRD.md                      # Dokumentasi Kebutuhan Produk
```

### 3.1 Peran dan Batasan Setiap Aplikasi

1. **`apps/web` (Customer Portal & PWA Tracking)**:
   - **Teknologi:** Next.js (React 19), Tailwind CSS, Lucide Icons, Shadcn UI primitives.
   - **Fitur Utama:**
     - Landing page informatif harga kiloan & satuan.
     - Public Tracking tanpa login wajib: Cukup input nomor resi / scan QR / klik tautan WA.
     - Galeri foto QC kondisi awal pakaian sebelum dicuci (mencegah sengketa).
     - Dashboard Pelanggan (Login via No WhatsApp OTP / Supabase Auth).
     - Gamifikasi: Stamp Card (5 stempel = voucher cuci gratis 5 kg) dan Daily Check-in streak reward.
     - Katalog voucher & penukaran poin.
2. **`apps/pos` (Kasir & Operator Laundry Portal)**:
   - **Teknologi:** Next.js / Vite SPA, Tailwind CSS, TanStack Table, WebRTC Camera API.
   - **Fitur Utama:**
     - Kasir Order Intake: Input berat kiloan (desimal kg) dan counter helai pakaian satuan secara hybrid dalam satu transaksi.
     - Modul Kamera Langsung: Ambil foto pakaian bernoda/robek langsung dari tablet/webcam dan otomatis upload ke Supabase Storage bucket `qc-photos`.
     - Manajemen Status Tahapan Cucian: *Received* -> *Washing* -> *Drying* -> *Ironing* -> *Packing QC* -> *Ready* -> *Completed*.
     - Penempatan Rak: Alokasi rak fisik (contoh: "RAK-B02") saat status berubah menjadi *Ready*.
     - Integrasi Pembayaran: Cetak QRIS Midtrans instan di layar kasir atau terima uang tunai (*Cash*).
     - Struk Digital & Cetak Nota Kasir (Thermal Bluetooth Printer 58mm/80mm).
3. **`apps/worker` (WhatsApp Automation Engine)**:
   - **Teknologi:** Node.js, TypeScript, Baileys Library (WhatsApp Web API).
   - **Fitur Utama:**
     - Berjalan di server/laptop lokal pengembang.
     - Menyimak antrean tabel `whatsapp_queue` secara realtime via Supabase Realtime Listener atau polling interval pendek.
     - Mengirim pesan terformat ramah otomatis lengkap dengan rincian nota digital, link foto QC, dan lokasi rak pengambilan.
4. **`packages/shared`**:
   - Berisi Zod validation schema untuk order creation, webhook verification, dan format currency IDR / format berat kg.
5. **`packages/database`**:
   - Berisi script migrasi SQL, konfigurasi Row Level Security (RLS), dan utility query database Supabase.

---

## 4. User Personas & Alur Perjalanan Pengguna (User Journey)

### 4.1 Persona Pelanggan (Rani, 24 Tahun - Mahasiswi / Pekerja Kantoran)
- **Goal:** Ingin mencuci baju cepat tanpa takut baju kesayangan rusak, hilang, atau tertukar.
- **Pain Point:** Sering mengalami baju kelunturan atau kancing copot tapi laundry tidak mau mengaku. Lupa mengambil baju tepat waktu.
- **Workflow:** Membawa cucian ke SiKucek -> Menerima link WA -> Melihat foto QC baju -> Memantau progres cucian lewat PWA -> Ambil baju di rak saat dapat notifikasi WA -> Mendapatkan stempel loyalti.

### 4.2 Persona Kasir & Operator (Budi, 28 Tahun - Kasir SiKucek)
- **Goal:** Menimbang, mencatat pakaian satuan, memotret pakaian robek dengan cepat tanpa antrean panjang.
- **Pain Point:** Repot membedakan nota kiloan dan satuan. Bingung mencari lokasi tumpukan baju saat pelanggan datang mengambil.
- **Workflow:** Buka tablet POS SiKucek -> Masukkan no HP pelanggan -> Timbang kiloan (3.2 kg) -> Tambah 2 kemeja satuan -> Foto kerah kemeja yang robek -> Terbitkan QRIS -> Pakaian masuk ke mesin cuci.

---

## 5. Matriks Fitur Lengkap & Prioritas (MoSCoW Framework)

### 5.1 Must Have (P0 - Fondasi Inti)

1. **Hybrid Service Ordering Engine**:
   - Mendukung pencampuran layanan Kiloan (dihitung per kg dengan desimal 2 digit, misal 2.45 kg) dan Satuan (baju, celana, selimut, bed cover) dalam 1 nomor invoice.
   - Perhitungan otomatis subtotal kiloan, subtotal satuan, diskon, dan total tagihan bersih.
2. **Quality Control (QC) Photo & Dispute Prevention**:
   - Kasir dapat mengambil foto langsung via antarmuka POS menggunakan kamera HP/tablet.
   - Unggah otomatis ke Supabase Storage (Bucket: `qc-photos`).
   - Tagging jenis cacat: Robek (*torn*), Luntur (*color_faded*), Noda Bandel (*stain*), Kancing Lepas (*missing_button*).
   - Foto tampil di portal tracking pelanggan sebagai bukti awal sebelum proses pencucian.
3. **Public Order Tracking Engine (Tanpa Wajib Login)**:
   - Halaman `https://sikucek.app/track/[tracking_code]`.
   - Menampilkan status tahapan mencuci dengan progress bar visual bertema maskot Si Kucek.
   - Menampilkan informasi nomor rak fisik saat status *Ready*.
4. **Sistem Pembayaran Hybrid (Cash + Midtrans Sandbox)**:
   - Kasir dapat memilih pembayaran Tunai (langsung lunas) atau QRIS/VA Midtrans.
   - Endpoint webhook Midtrans untuk memperbarui status transaksi secara real-time dan aman (idempoten).
5. **Database Supabase & Row Level Security (RLS)**:
   - Seluruh tabel dilindungi RLS sehingga data pelanggan tidak dapat diakses pihak luar tanpa hak otorisasi.
6. **WhatsApp Notification Worker**:
   - Notifikasi otomatis saat pesanan dibuat (Nota Masuk).
   - Notifikasi otomatis saat pesanan siap diambil (Lengkap dengan nomor rak penyimpanan).

### 5.2 Should Have (P1 - Gamifikasi & Retensi)

1. **Digital Stamp Card (5 Stempel = 1 Kupon Gratis Kiloan)**:
   - Setiap pesanan berstatus *completed* memberikan 1 stempel digital.
   - Setelah 5 stempel terkumpul, sistem otomatis menerbitkan 1 user coupon: "Gratis Cuci Kiloan Maksimal 5 Kg".
   - **Logika Diskon Parsial:** Jika pesanan berupa kombinasi (kiloan + satuan), kupon hanya memotong subtotal porsi kiloan hingga batas 5 kg. Porsi satuan tetap ditagihkan penuh.
2. **Daily Check-in Streak Reward**:
   - Pelanggan yang membuka PWA setiap hari dapat mengklaim poin harian (misal: Hari 1 = 10 poin, Hari 2 = 15 poin, dst).
   - Poin dapat dikonversi menjadi voucher potongan harga ongkir atau potongan langsung.
3. **Penyimpanan Rak Fisik (Rack Locator)**:
   - Kasir wajib menginput lokasi rak sebelum menandai pesanan *Ready* (contoh: "RAK-A1", "GANTUNG-03").
   - Mencegah staf mencari-cari bungkusan cucian di tumpukan plastik.

### 5.3 Could Have (P2 - Fasilitas Tambahan)

1. **Web Push Notification PWA**:
   - Notifikasi browser di smartphone pelanggan saat cucian berpindah tahap tanpa bergantung hanya pada WhatsApp.
2. **Cetak Thermal Printer Bluetooth**:
   - Integrasi cetak struk nota kertas via Web Bluetooth API langsung dari browser Chrome kasir.
3. **Mode Offline Ringan Kasir**:
   - Antrean simpan lokal (IndexedDB) jika koneksi internet outlet mengalami gangguan sementara.

---

## 6. Spesifikasi Desain Antarmuka (UI/UX Guidelines)

Mengacu pada prinsip **Rich Aesthetics & Dynamic Design**:

1. **Tipografi**:
   - Header & Branding: Plus Jakarta Sans / Nunito (Font bulat, modern, bersih, ramah).
   - Data Angka & Moneter: JetBrains Mono / Inter Tabular Numbers untuk berat kiloan dan nominal Rupiah agar rapi.
2. **Komponen Visual**:
   - Kartu Order bergaya *Soft Glassmorphism* dengan bayangan lembut (*subtle cyan glow*).
   - Progress Stepper interaktif: Ikon animasi gelembung bergerak saat cucian berpindah dari Cuci ke Kering dan Setrika.
   - Tag status semantik yang tegas:
     - `Received`: Kuning Amber
     - `Washing / Drying / Ironing`: Biru Sky
     - `Ready`: Hijau Zamrud (*Emerald*)
     - `Completed`: Slate Neutral
     - `QC Issue`: Merah Coral (*Rose*)
3. **Micro-Animations**:
   - Efek partikel gelembung sabun meletup halus (*soap bubble burst*) ketika pelanggan mengklik tombol klaim Daily Check-in atau mencap stempel loyalti.
   - Transisi halaman tanpa kedipan (*smooth page layout transitions*).

---

## 7. Skema Data & Relasi Database (Supabase PostgreSQL)

### 7.1 Spesifikasi Instance Supabase Cloud (Live Production Instance)

Sistem SiKucek terhubung ke instance cloud database Supabase PostgreSQL terkelola (*managed cloud database*) dengan spesifikasi arsitektur berikut:

| Parameter Konfigurasi | Nilai Konfigurasi / Spesifikasi | Keterangan & Peran Arsitektur |
|---|---|---|
| **Penyedia Layanan (Provider)** | Supabase Cloud (AWS Infrastructure) | Layanan database PostgreSQL terdistribusi dengan High Availability |
| **Wilayah (Region)** | Tokyo (`ap-northeast-1` / `aws-0-ap-northeast-1`) | Latensi rendah ke Indonesia (kisaran 60 - 90 ms) |
| **Project Reference ID** | `nvnuezmzbtcgpzqulwbw` | Identifier unik instance Supabase SiKucek |
| **Project URL Endpoint** | `https://nvnuezmzbtcgpzqulwbw.supabase.co` | RESTful & Real-time Webhook API Endpoint |
| **Shared Pooler Host** | `aws-0-ap-northeast-1.pooler.supabase.com` | Supavisor Connection Pooler untuk arsitektur serverless |
| **Port Transaksi (Pooler)** | `6543` | Transaction Mode (direkomendasikan untuk Next.js App Router & serverless API) |
| **Port Sesi (Direct Session)** | `5432` | Session Mode (digunakan untuk migrasi skema DDL, fungsi trigger, dan worker persisten) |
| **Nama Database** | `postgres` | Default primary database name |
| **Nama Pengguna (User)** | `postgres.nvnuezmzbtcgpzqulwbw` | Tenant-specific database superuser role |
| **Connection URI (Pooler)** | `postgresql://postgres.nvnuezmzbtcgpzqulwbw:[YOUR-PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres` | URI transaksi pooling dengan protokol SSL aktif |
| **Connection URI (Direct)** | `postgresql://postgres.nvnuezmzbtcgpzqulwbw:[YOUR-PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres` | URI koneksi langsung untuk skrip DDL dan tools database |
| **Agent Skills Toolkit** | `npx skills add supabase/agent-skills` | Terpasang di `.agents/skills/supabase` & `supabase-postgres-best-practices` |
| **Protokol Password & Rahasia** | Terproteksi di `.env.local` / Config Vault | Password aktual diisolasi ketat dari version control publik sesuai Bab 13.3 |

### 7.2 Katalog 18 Tabel Inti PostgreSQL

Struktur tabel dioptimalkan untuk performa tinggi, integritas data, zero-hardcode architecture, dan isolasi RLS:

| Nama Tabel | Deskripsi & Tujuan |
|---|---|
| `profiles` | Data profil terhubung dengan `auth.users`, mencakup role (owner, cashier, washer, customer), referral code, dan saldo poin. |
| `customer_tiers` | Master tingkatan loyalitas pelanggan (Busa Baru, Wangi Segar, Kinclong Sultan) dengan hak istimewa diskon permanen. |
| `services` | Master data katalog dinamis: Kiloan Reguler/Express, Satuan Baju, Celana, Bed Cover, Jas, Sepatu. |
| `racks` | Master data rak penyimpanan fisik di outlet (misal: RAK-A1, RAK-A2, GANTUNG-01) untuk validasi alokasi rak. |
| `orders` | Header transaksi: nomor pesanan, tracking code publik, nominal kiloan & satuan, status, dan rak fisik. |
| `order_items` | Detail item per pesanan (mencatat berat kg atau kuantitas pcs, harga satuan, dan catatan khusus). |
| `order_qc_photos` | URL foto bukti kondisi pakaian sebelum cuci di Supabase Storage beserta klasifikasi jenis cacat. |
| `order_status_logs` | Audit trail riwayat tahapan pengerjaan untuk menampilkan linimasa pelacakan pelanggan. |
| `payments` | Riwayat pembayaran kasir (Tunai) dan callback webhook Midtrans (QRIS/VA). |
| `loyalty_stamp_cards` | Progres stempel pelanggan (0 sampai 5 stempel per siklus kartu). |
| `loyalty_stamps` | Catatan riwayat stempel yang terikat pada `order_id` unik (anti-duplikasi stempel). |
| `daily_checkins` | Catatan klaim check-in harian dan perhitungan streak berturut-turut. |
| `coupons` & `user_coupons` | Master kupon promosi dan kupon milik pelanggan (termasuk kupon gratis kiloan 5 kg). |
| `marketing_campaigns` | Pelacakan program promosi multi-channel (Instagram, TikTok, Brosur, Event), batas kuota, dan anggaran diskon. |
| `marketing_banners` | Konten banner promosi geser (*carousel*) dinamis di halaman muka web dan PWA. |
| `referral_logs` | Pelacakan program ajak teman (pencatatan pemberi referensi, penerima, dan eksekusi reward poin). |
| `app_settings` | **Pusat Konfigurasi Zero-Hardcode:** Kunci API Midtrans, template WhatsApp, aturan bisnis, dan profil outlet. |
| `whatsapp_queue` | Antrean pesan keluar untuk dieksekusi secara otomatis oleh background worker Baileys. |

---

## 8. Rencana Tahapan Rilis (Roadmap Implementasi)

| Tahap | Fokus Pekerjaan | Deliverables Utama |
|---|---|---|
| **Sprint 1 (Setup & Database)** | Inisialisasi Monorepo Turborepo, pnpm workspaces, DDL Supabase, & Storage setup. | Struktur folder monorepo, skema database siap pakai di Supabase, shared types Zod. |
| **Sprint 2 (POS Kasir & QC)** | Pembuatan aplikasi `apps/pos` (Penerimaan pakaian, timbangan hybrid, modul kamera QC foto). | Kasir dapat membuat order hybrid, ambil foto cacat pakaian, simpan ke database. |
| **Sprint 3 (Customer Web & Tracking)** | Pembuatan aplikasi `apps/web` (Halaman publik tracking resi, linimasa status, galeri foto QC). | Pelanggan dapat melacak status cucian secara real-time via kode unik dan melihat foto QC. |
| **Sprint 4 (Pembayaran & Notifikasi)** | Integrasi Midtrans Sandbox (QRIS) dan setup background worker Baileys WhatsApp. | Pembayaran QRIS otomatis update order status; pesan WhatsApp nota dan siap ambil terkirim otomatis. |
| **Sprint 5 (Gamifikasi & Polishing)** | Implementasi Stamp Card Digital, Daily Check-in Streak, kupon parsial, dan audit UI/UX. | Sistem loyalti aktif, animasi maskot terpasang, siap uji coba end-to-end. |

---

## 9. Kriteria Keberhasilan & Uji Kualitas (Quality Assurance Gate)

Sebelum dinyatakan selesai, aplikasi wajib memenuhi kriteria berikut:
1. **Zero Dispute:** Foto QC tersimpan jelas dengan resolusi optimal (kompresi WebP client-side di bawah 500KB) dan dapat diakses pelanggan.
2. **Akurasi Diskon:** Kupon gratis kiloan 5 kg tidak pernah memotong komponen biaya cucian satuan pada transaksi hybrid.
3. **Respon Cepat:** Halaman tracking PWA memuat dalam waktu di bawah 1.5 detik pada jaringan 4G mobile.
4. **Notifikasi Tepat Sasaran:** Pesan WhatsApp otomatis terkirim maksimal 15 detik setelah kasir menaruh pakaian di rak dan memperbarui status menjadi *Ready*.
5. **Kepatuhan Bebas Slop:** Bebas dari karakter em dash terlarang, kontras warna lulus WCAG AA, dan navigasi ramah sentuhan layar ponsel (tap target minimal 44px).

---

## 10. Spesifikasi Detail Alur & Logika Fungsional Fitur

Bab ini mendefinisikan rancangan fungsional secara terperinci (input, validasi, rumus perhitungan, alur UI, dan penanganan edge cases) untuk setiap modul aplikasi:

### 10.1 Modul Kasir & POS Order Intake (`apps/pos`)

* **Tujuan:** Memproses penerimaan pakaian pelanggan secara cepat, akurat, dan fleksibel (kiloan, satuan, atau hybrid).
* **Alur Pengguna (User Flow):**
  1. Kasir membuka form order baru di tablet/komputer kasir.
  2. Kasir memasukkan nomor WhatsApp pelanggan. Jika nomor sudah terdaftar, sistem otomatis menampilkan nama pelanggan dan saldo stempel/poin. Jika belum terdaftar, kasir memasukkan nama pelanggan baru.
  3. **Input Komponen Kiloan (Opsional):** Kasir memilih jenis layanan kiloan (misal: "Cuci Kering Setrika 2 Hari @ Rp7.000/kg") dan memasukkan berat riil hasil timbangan (misal: `2.45` kg).
  4. **Input Komponen Satuan (Opsional):** Kasir menambahkan item khusus melalui tombol cepat/pencarian (misal: Kemeja @ Rp5.000 x 2 pcs, Bed Cover @ Rp25.000 x 1 pcs).
  5. Kasir dapat melampirkan catatan khusus cucian (misal: "Pisahkan baju putih", "Jangan pakai pewangi menyengat").
  6. Sistem menghitung subtotal secara langsung (*live calculation*).
  7. Kasir memilih metode pembayaran:
     - **Tunai (Cash):** Kasir memasukkan jumlah uang tunai yang diterima, sistem menampilkan nominal uang kembalian.
     - **QRIS / Midtrans:** Sistem menerbitkan kode QR dinamis di layar kasir untuk discan oleh pelanggan.
  8. Tombol "Simpan & Proses Pesanan" ditekan -> sistem menerbitkan nomor order (`SKC-YYMMDD-XXXX`), kode pelacakan publik (`tracking_code`), dan mencetak struk/mengirim nota digital.

* **Rumus Perhitungan Tagihan (Hybrid Calculation Formula):**
  ```text
  Berat Ditagih = MAX(Berat Riil, Minimum Berat Layanan)
  Subtotal Kiloan = Berat Ditagih * Harga Satuan Kiloan
  Subtotal Satuan = SUM(Jumlah Item Satuan * Harga Satuan per Item)
  Total Kotor = Subtotal Kiloan + Subtotal Satuan
  Diskon = Nilai Kupon / Promo (jika ada)
  Total Bersih (Final Amount) = Total Kotor - Diskon
  ```

---

### 10.2 Modul Quality Control & Foto Cacat Awal (`apps/pos` & Supabase Storage)

* **Tujuan:** Mencegah sengketa komplain pelanggan mengenai pakaian rusak, bernoda permanen, atau kancing lepas sebelum masuk mesin cuci.
* **Alur Pengguna (User Flow):**
  1. Pada form order atau halaman detail cucian, kasir/operator menekan tombol "Ambil Foto Kondisi Pakaian".
  2. Browser/aplikasi meminta izin akses kamera perangkat melalui WebRTC API (`navigator.mediaDevices.getUserMedia`).
  3. Kasir membidik bagian pakaian yang bermasalah (misal: sobek di lengan baju atau kancing hilang) dan mengambil foto.
  4. **Kompresi Client-side:** Foto otomatis di-resize dan dikompresi ke format WebP dengan batas maksimal lebar 1200px dan ukuran berkas di bawah 500 KB sebelum diunggah (menghemat kuota Supabase Storage).
  5. Kasir memilih kategori cacat (*issue type*):
     - `torn` (Sobek / Jahitan Lepas)
     - `stain` (Noda Membandel / Jamur)
     - `color_faded` (Luntur Awal)
     - `missing_button` (Kancing Hilang)
     - `other` (Lain-lain)
  6. Kasir dapat menambahkan keterangan singkat (misal: "Saku celana kiri ada sobekan 3 cm").
  7. Foto terunggah ke Supabase Storage bucket `qc-photos` dan tautan publiknya tersimpan di tabel `order_qc_photos`.
  8. Pelanggan dapat melihat foto ini kapan saja melalui portal tracking publik.

---

### 10.3 Modul Pelacakan Publik PWA (`apps/web`)

* **Tujuan:** Memberikan transparansi penuh kepada pelanggan tanpa perlu login akun atau mengunduh aplikasi native.
* **Akses:** Halaman publik `https://sikucek.app/track/[tracking_code]`.
* **Komponen & Informasi yang Ditampilkan:**
  1. **Header Identitas:** Menampilkan logotype `text-sikucek.jpg` dengan animasi gelembung segar.
  2. **Kartu Ringkasan:** Nomor Pesanan, Nama Pelanggan, Tanggal Masuk, dan Estimasi Tanggal Selesai.
  3. **Stepper Linimasa Interaktif (Visual Progress Bar):**
     - Diterima di Kasir (*Received*)
     - Proses Pencucian (*Washing*)
     - Proses Pengeringan (*Drying*)
     - Proses Setrika Uap (*Ironing*)
     - Pengecekan Akhir & Packing (*Packing & QC*)
     - Siap Diambil (*Ready*)
     - Selesai Diambil (*Completed*)
  4. **Kartu Lokasi Rak Fisik:**
     - Tampil khusus saat status pesanan berada pada posisi `ready`.
     - Menampilkan nomor rak penyimpanan yang jelas (misal: **RAK B-02**) agar pelanggan mudah mengarahkan kasir saat mengambil pakaian.
  5. **Galeri Bukti Quality Control:**
     - Menampilkan thumbnail foto pakaian bermasalah yang dipotret kasir saat awal masuk.
     - Pelanggan dapat mengklik foto untuk melihat tampilan penuh (*lightbox zoom*).
  6. **Rincian Nota Transaksi:**
     - Berat kiloan, daftar item satuan, subtotal, potongan kupon, dan status pelunasan (Lunas / Belum Lunas).
  7. **Tombol Bantuan WhatsApp:**
     - Tautan langsung ke WhatsApp kasir/outlet jika pelanggan memiliki pertanyaan seputar cuciannya.

---

### 10.4 Modul Gamifikasi: Stamp Card Digital & Daily Check-in (`apps/web`)

* **Tujuan:** Meningkatkan frekuensi pemesanan berulang (*repeat order*) dan retensi pelanggan.
* **Spesifikasi Stamp Card Digital:**
  - Setiap kali pesanan pelanggan berstatus `completed`, sistem secara otomatis menambahkan 1 stempel ke kartu pengguna.
  - Kartu stempel memiliki 5 slot lingkaran bergambar maskot Si Kucek.
  - Saat stempel ke-5 berhasil terisi:
    1. Kartu dinyatakan penuh dan counter siklus bertambah 1 (`cards_completed = cards_completed + 1`).
    2. Stempel aktif direset kembali ke 0.
    3. Sistem secara otomatis menerbitkan 1 voucher reward di akun pelanggan: "Kupon Gratis Cuci Kiloan Maksimal 5 Kg".
  - **Aturan Diskon Parsial Kupon (Strict Business Rule):**
    - Kupon ini **HANYA** memotong porsi tagihan kiloan dan **TIDAK BOLEH** memotong porsi tagihan satuan.
    - *Contoh Kasus:* Pelanggan membuat pesanan hybrid berupa Kiloan 6 kg (@ Rp7.000 = Rp42.000) dan Satuan 1 Bed Cover (Rp25.000). Total tagihan kotor: Rp67.000.
    - Nilai potongan kupon: `MIN(6 kg, 5 kg) * Rp7.000 = Rp35.000`.
    - Sisa tagihan kiloan: `Rp42.000 - Rp35.000 = Rp7.000`.
    - Tagihan satuan: Tetap Rp25.000.
    - Total tagihan yang harus dibayar: `Rp7.000 + Rp25.000 = Rp32.000`.

* **Spesifikasi Daily Check-in Streak:**
  - Pelanggan yang login ke PWA dapat mengklaim poin harian sekali setiap 24 jam kalender.
  - Tampilan berupa tombol gelembung sabun berkilau dengan maskot Si Kucek. Saat diklik, tombol mengeluarkan efek partikel gelembung meletup (*burst animation*).
  - Skema Perolehan Poin Streak:
    - Hari ke-1 berturut-turut: +10 Poin
    - Hari ke-2 berturut-turut: +15 Poin
    - Hari ke-3 berturut-turut: +20 Poin
    - Hari ke-4 berturut-turut: +25 Poin
    - Hari ke-5 berturut-turut: +30 Poin
    - Hari ke-6 berturut-turut: +35 Poin
    - Hari ke-7 berturut-turut: +50 Poin (Bonus Spesial)
  - Jika pelanggan melewati 1 hari tanpa check-in, hitungan streak direset kembali ke Hari ke-1.
  - Poin yang terkumpul dapat ditukarkan di katalog voucher (misal: 100 poin = voucher diskon Rp5.000).

---

### 10.5 Modul Manajemen Rak Fisik (Rack Locator - `apps/pos`)

* **Tujuan:** Menghilangkan kebiasaan kasir membongkar tumpukan plastik cucian saat pelanggan datang mengambil pakaian.
* **Aturan Operasional (Operational Guardrail):**
  - Ketika pakaian selesai dipacking oleh operator dan siap ditaruh di rak penyimpanan, kasir/operator wajib mengisi field `rack_location` (misal: "RAK-A1", "RAK-C3", "GANTUNG-05").
  - Sistem menerapkan validasi ketat: status pesanan **TIDAK DAPAT** diubah menjadi `ready` jika kolom `rack_location` masih kosong.
  - Nilai rak ini otomatis dimasukkan ke dalam pesan WhatsApp siap ambil dan tampil di kartu pelacakan PWA pelanggan.

---

### 10.6 Modul Background Worker Notifikasi WhatsApp (`apps/worker`)

* **Tujuan:** Mengirimkan nota transaksi dan notifikasi pakaian selesai secara otomatis tanpa biaya API pihak ketiga berbayar pada fase pengembangan.
* **Teknologi:** Node.js, TypeScript, pustaka Baileys (koneksi sesi WhatsApp Web lokal).
* **Mekanisme Kerja Antrean (Queue Lifecycle):**
  1. Database Supabase mendeteksi perubahan status pesanan melalui trigger database dan memasukkan baris baru ke tabel `whatsapp_queue` dengan status `pending`.
  2. Worker Baileys yang berjalan di komputer lokal menyimak tabel `whatsapp_queue` secara real-time.
  3. Worker mengambil pesan `pending`, memvalidasi format nomor tujuan (konversi otomatis 08xx menjadi 628xx), lalu mengirimkan pesan WhatsApp.
  4. Jika pengiriman sukses: kolom `status` diubah menjadi `sent` dan `sent_at` diisi waktu saat ini.
  5. Jika gagal (misal koneksi internet terputus): `attempts` bertambah 1. Sistem melakukan percobaan ulang hingga maksimal 3 kali sebelum menandai status sebagai `failed`.

* **Template Pesan Terstandarisasi:**
  - **Pesan 1: Nota Masuk (Status `received`):**
    ```text
    Halo Kak {customer_name}! Terima kasih sudah mencuci di SiKucek.
    
    Nomor Pesanan: {order_number}
    Layanan: {ringkasan_layanan}
    Total Tagihan: {final_amount} ({status_bayar})
    Estimasi Selesai: {estimasi_selesai}
    
    Pantau proses cucian & foto kondisi pakaian Kakak di sini:
    https://sikucek.app/track/{tracking_code}
    
    Si Kucek siap bikin pakaian Kakak wangi, bersih, dan kinclong!
    ```
  - **Pesan 2: Pakaian Siap Ambil (Status `ready`):**
    ```text
    Kabar gembira Kak {customer_name}! Pakaian Kakak di SiKucek sudah SELESAI, bersih, wangi, dan rapi dipacking.
    
    Nomor Pesanan: {order_number}
    Lokasi Pengambilan: {rack_location}
    Total Pembayaran: {final_amount} ({status_bayar})
    
    Silakan ambil pakaian Kakak di kasir dengan menyebutkan nomor rak di atas atau tunjukkan tautan nota ini:
    https://sikucek.app/track/{tracking_code}
    
    Sampai jumpa di SiKucek!
    ```

---

## 11. Struktur Halaman & Peta Situs (Sitemap & Page Breakdown)

Untuk memastikan implementasi antarmuka pada kedua aplikasi (`apps/web` dan `apps/pos`) berjalan terstruktur, berikut adalah perancangan lengkap seluruh halaman:

### 11.1 Peta Situs Portal Pelanggan & PWA (`apps/web`)

```
apps/web/
├── / (Landing Page Publik & Estimator Biaya)
├── /track/[tracking_code] (Halaman Pelacakan Publik & Bukti QC)
├── /auth/login (Login / Verifikasi No WhatsApp)
└── /app/ (Dashboard Pelanggan - Memerlukan Login)
    ├── /app (Beranda Loyalitas, Stamp Card, & Daily Check-in)
    ├── /app/coupons (Dompet Kupon Saya & Tukar Poin)
    ├── /app/orders (Riwayat Seluruh Cucian Saya)
    └── /app/profile (Pengaturan Akun & Kontak)
```

#### Rincian Komponen per Halaman `apps/web`:

1. **Halaman Beranda Publik (`/`)**:
   - **Hero Section:** Menampilkan identitas visual `text-sikucek.jpg`, ilustrasi maskot `logo-sikucek.jpg`, tagline ramah, tombol aksi utama (*Antar Sekarang / Cek Cucian*).
   - **Widget Cek Resi Cepat (Quick Tracking Bar):** Input kolom tunggal di mana pengunjung cukup mengetikkan kode resi / nomor tracking untuk langsung diarahkan ke halaman status cucian tanpa login.
   - **Kalkulator Biaya Interaktif (Live Estimator):** Slider interaktif untuk memilih estimasi berat kiloan dan counter item satuan (baju, celana, bed cover) guna melihat simulasi estimasi biaya sebelum datang ke outlet.
   - **Daftar Tarif Layanan (Service Catalog):** Kartu tarif transparan untuk layanan kiloan reguler, express, serta tarif satuan per helai pakaian.
   - **Bagian Keunggulan ("Kenapa SiKucek?"):** Tiga kartu pilar: *Foto QC Anti-Sengketa*, *Deterjen Higienis Ramah Kain*, dan *Program Stempel Cuci Gratis*.
   - **Footer:** Jam operasional outlet, peta lokasi outlet, tautan chat WhatsApp kasir, dan hak cipta.

2. **Halaman Pelacakan Publik & Bukti QC (`/track/[tracking_code]`)**:
   - **Header Ringkas:** Logo SiKucek + Badge status terkini dengan pewarnaan dinamis.
   - **Kartu Ringkasan Cucian:** Nomor pesanan, nama pelanggan, tanggal masuk, dan estimasi waktu selesai.
   - **Visual Stepper Linimasa (7 Tahap):** Indikator progres bernuansa gelembung air yang menandai posisi cucian (*Received -> Washing -> Drying -> Ironing -> Packing QC -> Ready -> Completed*).
   - **Banner Lokasi Rak Fisik:** Kotak informasi tebal berlatar hijau lembut yang hanya muncul saat status bernilai `ready`: *"Pakaian Anda berada di RAK B-02. Tunjukkan nota ini saat pengambilan."*
   - **Galeri Foto Quality Control:** Grid thumbnail foto kondisi awal pakaian yang difoto kasir saat penerimaan. Jika diklik, membuka modal zoom (*lightbox*) untuk melihat titik sobek/luntur secara transparan.
   - **Rincian Nota Digital:** Tabel transparan rincian berat kiloan, item satuan, potongan diskon voucher, total akhir, dan status pelunasan (*LUNAS* / *BELUM BAYAR*).
   - **Tombol Aksi Cepat:** Tombol *Hubungi Kasir via WhatsApp* dan tombol *Bagikan Nota*.

3. **Halaman Dashboard Pelanggan & Gamifikasi (`/app`)**:
   - **Header Profil:** Sapaan nama pelanggan, tier loyalitas, dan saldo total poin reward.
   - **Kartu Interaktif Stamp Card Digital:**
     - Menampilkan visual 5 slot stempel melingkar bertema maskot Si Kucek.
     - Slot yang sudah terisi menampilkan cap koin emas berkilau.
     - Slot ke-5 memiliki indikator hadiah: *"Voucher Cuci Kiloan Gratis 5 Kg"*.
     - Progress bar dinamis (misal: "3 dari 5 cucian terselesaikan").
   - **Modul Daily Check-in Streak:**
     - Tombol gelembung sabun interaktif bertuliskan *"Klaim Poin Hari Ini (+X Poin)"*.
     - Efek animasi partikel gelembung meletup ketika tombol ditekan.
     - Linimasa 7 hari streak dengan ikon bintang emas.
   - **Widget Cucian Aktif:** Tautan cepat menuju pesanan cucian yang sedang diproses.

4. **Halaman Dompet Kupon (`/app/coupons`)**:
   - Daftar voucher aktif milik pengguna (voucher gratis 5 kg dari hasil 5 stempel, voucher potongan harga dari penukaran poin check-in).
   - Informasi masa berlaku kupon, syarat ketentuan (hanya berlaku untuk komponen kiloan), dan kode voucher unik.
   - Tab "Katalog Penukaran Poin": Daftar kupon yang dapat ditukarkan menggunakan saldo poin yang terkumpul.

---

### 11.2 Peta Situs Aplikasi Kasir & Operator Laundry (`apps/pos`)

```
apps/pos/
├── /login (Autentikasi Kasir & Staff)
├── / (Dashboard Operasional & Antrean Cucian)
├── /orders/new (Form Intake Pesanan Hybrid & Kamera QC)
├── /orders/[id] (Detail Pesanan, Geser Status, & Alokasi Rak)
├── /orders/[id]/receipt (Tampilan Cetak Nota Kasir & Thermal)
└── /admin/ (Area Pemilik / Manager Outlet)
    ├── /admin/services (Master Data Katalog Kiloan & Satuan)
    ├── /admin/coupons (Manajemen Kupon & Promo)
    ├── /admin/marketing (Dashboard Kampanye, Diskon ROI, & Banner Web/PWA)
    ├── /admin/customers (CRM Pelanggan, Segmentasi Dorman >14 Hari, & WA Blast)
    ├── /admin/racks (Master Data Rak Penyimpanan Outlet)
    ├── /admin/settings (Pusat Konfigurasi Zero-Hardcode: Midtrans, WA Template, Profil)
    └── /admin/reports (Laporan Omzet, Berat, & Rekap Transaksi)
```

#### Rincian Komponen per Halaman `apps/pos`:

1. **Halaman Login Staf (`/login`)**:
   - Form otentikasi aman berbasis Supabase Auth dengan validasi role (`cashier`, `washer`, `ironer`, `owner`).
   - Sesi terlindungi (*Protected Route*) yang memblokir akses publik ke data outlet.

2. **Halaman Dashboard Operasional & Antrean (`/`)**:
   - **Statistik Cepat (Top KPI Cards):**
     - Order Baru Hari Ini (Count)
     - Total Berat Kiloan Hari Ini (Kg)
     - Cucian Siap Ambil di Rak (Count)
     - Total Omzet Kasir Hari Ini (Rp Tunai & QRIS)
   - **Tab Antrean Cucian (Workflow Kanban):**
     - Tab 1: *Antrean Cuci* (Status `received`)
     - Tab 2: *Sedang Dicuci & Kering* (Status `washing` & `drying`)
     - Tab 3: *Sedang Disetrika* (Status `ironing`)
     - Tab 4: *Siap Ambil di Rak* (Status `ready` dilengkapi informasi nomor rak)
     - Tab 5: *Selesai Diambil* (Status `completed`)
   - **Bilah Pencarian Cepat:** Mencari berdasarkan nomor order, nama pelanggan, nomor WhatsApp, atau lokasi rak.
   - **Tombol Utama Cepat:** Tombol mencolok bertuliskan *"+ Terima Cucian Baru"* di sudut kanan atas.

3. **Halaman Form Intake Pesanan Baru Hybrid (`/orders/new`)**:
   - **Bagian 1 - Identitas Pelanggan:**
     - Input nomor WhatsApp (dengan fitur *auto-complete* mencari profil pelanggan lama).
     - Input nama pelanggan (otomatis terisi jika nomor sudah ada di database).
   - **Bagian 2 - Komponen Kiloan:**
     - Dropdown pilihan layanan kiloan (Reguler 2 Hari, Express 1 Hari, Kilat 6 Jam).
     - Input berat hasil timbangan dalam satuan kilogram (desimal 2 digit, misal: `3.45`).
   - **Bagian 3 - Komponen Satuan:**
     - Grid tombol cepat bergambar ikon jenis pakaian (Kemeja, Celana Jeans, Jas, Selimut, Bed Cover, Boneka).
     - Stepper tombol `+` dan `-` untuk menyesuaikan kuantitas helai pakaian.
   - **Bagian 4 - Modul Kamera QC Foto (Pencegah Sengketa):**
     - Tombol *"Buka Kamera Tablet / HP"*.
     - Jendela pratinjau kamera langsung (WebRTC).
     - Tombol jepret foto -> otomatis dikompresi ke WebP (< 500 KB).
     - Pilihan jenis cacat: *Robek*, *Noda Membandel*, *Luntur Awal*, *Kancing Hilang*, atau *Lainnya*.
     - Kolom catatan deskripsi cacat.
   - **Bagian 5 - Kalkulasi Tagihan & Kupon:**
     - Tampilan rincian otomatis: Subtotal Kiloan + Subtotal Satuan - Kupon Potongan = Total Bersih.
     - Pilihan input kode kupon pelanggan.
   - **Bagian 6 - Modal Pembayaran:**
     - Pilihan metode: *Tunai* (dengan input jumlah uang dan kalkulasi kembalian otomatis) atau *QRIS Midtrans* (menampilkan QR code dinamis).
     - Tombol *"Simpan & Terbitkan Pesanan"*.

4. **Halaman Detail Pesanan & Update Status (`/orders/[id]`)**:
   - Menampilkan seluruh detail pakaian, daftar item satuan, berat kiloan, dan foto bukti QC.
   - **Tombol Aksi Geser Status:** Operator cukup mengklik satu tombol untuk memajukan status ke tahap berikutnya (misal: dari *Cuci* ke *Kering*, lalu ke *Setrika*).
   - **Modal Wajib Lokasi Rak (Saat Status Diubah ke `Ready`):**
     - Pilihan dropdown dari master data rak aktif (misal: `RAK-A3`).
     - Status tidak dapat berubah ke `ready` tanpa pengisian kolom ini.
     - Perubahan status otomatis memicu trigger pengiriman pesan WhatsApp siap ambil ke pelanggan.
   - **Tombol Cetak Struk:** Mencetak nota ke printer thermal Bluetooth (format kertas 58mm atau 80mm).

5. **Halaman Manajemen Pemasaran & Diskon (`/admin/marketing`)**:
   - **Pelacakan Kampanye & ROI Diskon:** Tabel performa promo (Instagram, TikTok, Brosur Kampus, Referral), menampilkan: total voucher terpakai, total nominal diskon yang diberikan, dan omzet kotor yang berhasil ditarik (*Return on Ad Spend / ROAS*).
   - **Pengelola Banner Promosi Dinamis:** Form unggah foto banner geser (*carousel*) untuk halaman landing web dan PWA (judul, gambar, link target, toggle aktif/nonaktif).
   - **Manajemen Program Referral:** Konfigurasi reward ajak teman (jumlah poin untuk pengajak dan diskon untuk teman yang diajak).

6. **Halaman CRM & Segmentasi Pelanggan (`/admin/customers`)**:
   - Filter pelanggan pintar: *Semua*, *Pelanggan Loyalis* ($\ge 5$ order), dan *Pelanggan Dorman* (tidak mencuci selama $>14$ hari).
   - **Tombol WhatsApp Broadcast Winback:** Mengirim pesan otomatis ramah ("Kak, baju kotornya udah numpuk belum? Ada diskon 15% khusus hari ini!") kepada pelanggan yang sudah lama tidak mencuci.

7. **Halaman Pusat Konfigurasi Zero-Hardcode (`/admin/settings`)**:
   - **Konfigurasi Payment Gateway:** Form input Midtrans Server Key, Client Key, Merchant ID, dan Toggle Mode (Sandbox vs Production).
   - **Konfigurasi Profil Outlet:** Nama outlet, no HP WhatsApp kasir/CS, alamat lengkap, link Google Maps, tautan Instagram & TikTok.
   - **Aturan Bisnis Dinamis:** Minimal berat kiloan, target jumlah stempel loyalti (default 5), maksimal kg gratis dari kupon stempel (default 5.0 kg), dan ambang batas hari pelanggan dorman (default 14 hari).
   - **Editor Template Pesan WhatsApp:** Editor teks untuk pesan Nota Diterima, Pesan Siap Ambil, dan Pesan Winback lengkap dengan variabel dinamis `{customer_name}`, `{order_number}`, dan `{rack_location}`.

8. **Halaman Master Rak & Katalog Layanan (`/admin/racks` & `/admin/services`)**:
   - Tambah/edit nama rak fisik penyimpanan dan tarif layanan kiloan/satuan tanpa sentuh kode program.

9. **Halaman Laporan & Rekap Transaksi (`/admin/reports`)**:
   - Filter rentang tanggal fleksibel (Hari ini, 7 hari terakhir, Bulan ini).
   - Rekap total transaksi, total berat cucian (kg), perbandingan pendapatan tunai vs nontunai (QRIS), dan daftar pesanan yang belum lunas.

---

### 11.3 Matriks Hak Akses Halaman (Role-Based Access Matrix)

| Rute Halaman | Pengunjung Anonim | Pelanggan Terdaftar | Kasir / Operator | Pemilik (Owner) |
|---|---|---|---|---|
| `/` (Landing Page Web) | Ya | Ya | Ya | Ya |
| `/track/[tracking_code]` | Ya (Akses Publik) | Ya | Ya | Ya |
| `/app/*` (Dashboard Pelanggan) | Tidak (Harus Login) | Ya | Ya | Ya |
| `/login` (POS Kasir) | Ya | Ya | Ya | Ya |
| `/orders/*` (Operasional Kasir) | Tidak | Tidak | Ya | Ya |
| `/admin/reports` (Laporan) | Tidak | Tidak | Baca Saja | Penuh |
| `/admin/marketing` (Promosi & CRM) | Tidak | Tidak | Baca Saja | Penuh |
| `/admin/settings` (Config Vault) | Tidak | Tidak | Dilarang | Penuh (Owner Only) |

---

## 12. Mesin Pemasaran, Pelacakan Promosi & Retensi (Marketing Engine)

Agar SiKucek dapat berkembang (*scale up*) dan memiliki daya tarik pemasaran yang tinggi, sistem dilengkapi dengan mesin pemasaran bawaan yang terukur (*data-driven marketing*):

### 12.1 Pelacakan Saluran Promosi & Analisis ROI Diskon

Setiap promosi atau voucher yang diterbitkan dapat dilacak sumber salurannya (*marketing attribution*):
* **Atribusi Saluran:** Admin dapat menandai sumber kampanye: `instagram_ads`, `tiktok_organic`, `brosur_kampus`, `event_bazar`, atau `referral`.
* **Metrik Efektivitas Kampanye (Diskon ROI):**
  $$\text{Rasio Efektivitas Promo} = \frac{\text{Total Omzet dari Kode Promo}}{\text{Total Nilai Diskon Diberikan}}$$
  *Contoh:* Diskon yang diberikan sebesar Rp200.000 berhasil menghasilkan omzet cucian sebesar Rp1.800.000 (Rasio 9x). Data ini tercatat otomatis di tabel `marketing_campaigns`.

### 12.2 Program Referral (Ajak Teman Cuci)

1. **Kode Unik Pelanggan:** Setiap pelanggan yang terdaftar memiliki kode referensi pribadi (misal: `RANI-KUCEK`).
2. **Keuntungan Dua Arah (Win-Win Incentive):**
   - **Teman Baru yang Diajak:** Mendapatkan diskon 10% pada pesanan pertama mereka saat memasukkan kode referral di kasir atau PWA.
   - **Pelanggan yang Mengajak:** Otomatis mendapatkan tambahan **50 Poin Loyalti** setelah pesanan pertama temannya berstatus `completed`.
3. **Pencegahan Fraud (Anti-Abuse Guard):**
   - Satu nomor WhatsApp teman baru hanya dapat menggunakan kode referral satu kali seumur hidup.
   - Poin pengajak baru cair jika order teman telah lunas dan selesai diambil.

### 12.3 Banner Promosi Dinamis (Carousel Web & PWA)

Pengunjung web dan PWA dapat melihat banner informasi promo terbaru:
* Dikelola melalui antarmuka admin di `/admin/marketing` dan disimpan di tabel `marketing_banners`.
* Admin dapat menentukan gambar banner, judul teks, tanggal aktif, dan tautan aksi (misal: langsung menuju kalkulator harga atau chat WhatsApp).
* Pergantian banner tidak membutuhkan kompilasi atau deploy ulang aplikasi (*zero code change*).

### 12.4 Mesin Retensi & WhatsApp Broadcast Winback (Dormant Recovery)

Laundry sering kehilangan pelanggan karena lupa atau berganti tempat:
* **Deteksi Otomatis:** Sistem mendeteksi pelanggan yang tidak melakukan transaksi selama $\ge 14$ hari sejak pesanan terakhirnya.
* **Segmentasi CRM:** Halaman `/admin/customers` menampilkan tab khusus *"Pelanggan Dorman"* beserta tombol aksi cepat.
* **Eksekusi Broadcast:** Pemilik/kasir dapat memilih mengirim pesan reminder ramah via worker Baileys yang menyertakan voucher potongan harga eksklusif untuk mengajak mereka mencuci kembali.

### 12.5 Tingkatan Loyalitas Pelanggan (Customer Tiers)

Pelanggan dikelompokkan secara otomatis berdasarkan total akumulasi pesanan selesai:
1. **Tier Busa Baru (0 - 4 pesanan):** Pelanggan reguler dengan akses standar stamp card & daily check-in.
2. **Tier Wangi Segar (5 - 14 pesanan):** Pelanggan setia yang otomatis mendapatkan diskon tetap 5% untuk layanan kiloan.
3. **Tier Kinclong Sultan (15+ pesanan):** Pelanggan VIP yang mendapatkan diskon tetap 10% untuk layanan kiloan serta prioritas pengerjaan express.

---

## 13. Arsitektur Zero-Hardcode & Konfigurasi Dinamis di Supabase (Config Vault)

Sesuai kebutuhan sistem yang dinamis dan fleksibel, **seluruh konfigurasi, kunci API, aturan bisnis, dan template teks disimpan di database Supabase**, bukan di dalam kode program (*zero-hardcode architecture*).

### 13.1 Struktur Tabel `app_settings`

Tabel `app_settings` menggunakan pola data terstruktur dengan pemisahan akses keamanan:

```sql
CREATE TABLE public.app_settings (
    key VARCHAR(100) PRIMARY KEY,                    -- Identifier unik konfigurasi
    category VARCHAR(50) NOT NULL,                   -- 'payment', 'outlet', 'business_rules', 'whatsapp'
    value JSONB NOT NULL,                            -- Nilai konfigurasi fleksibel
    description TEXT,                                -- Keterangan fungsi konfigurasi
    is_secret BOOLEAN DEFAULT FALSE NOT NULL,        -- TRUE: Hanya terbaca oleh server / service role
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

### 13.2 Rincian Konfigurasi Dinamis yang Disimpan di Supabase

| Kunci Konfigurasi (`key`) | Kategori | Tipe Data & Contoh Nilai | Deskripsi & Tujuan |
|---|---|---|---|
| `payment_midtrans` | `payment` | `{"server_key": "SB-Mid-server-...", "client_key": "SB-Mid-client-...", "merchant_id": "G12345", "is_production": false}` | Kredensial Midtrans Sandbox / Produksi. Memiliki `is_secret = true` sehingga terlindungi aman dari akses publik. |
| `outlet_profile` | `outlet` | `{"name": "SiKucek Laundry", "phone": "081234567890", "address": "Jl. Mawar No. 12", "open_hours": "07.00 - 21.00", "maps_url": "https://maps.google.com/..."}` | Profil outlet untuk header nota, footer web, dan informasi kontak publik. |
| `business_rules` | `business_rules` | `{"min_weight_kiloan": 2.0, "stamp_target": 5, "stamp_reward_max_kg": 5.0, "dormant_days_limit": 14}` | Parameter aturan bisnis yang dapat diubah owner kapan saja tanpa perlu redeploy. |
| `streak_rewards` | `business_rules` | `{"day_1": 10, "day_2": 15, "day_3": 20, "day_4": 25, "day_5": 30, "day_6": 35, "day_7": 50}` | Skema pemberian poin check-in harian. |
| `wa_template_received` | `whatsapp` | `{"template": "Halo Kak {customer_name}! Pesanan {order_number} sudah kami terima. Pantau di: {tracking_url}"}` | Format pesan WhatsApp nota masuk. |
| `wa_template_ready` | `whatsapp` | `{"template": "Halo Kak {customer_name}! Pakaian di {order_number} sudah SELESAI di rak {rack_location}. Nota: {tracking_url}"}` | Format pesan WhatsApp pakaian siap ambil. |
| `wa_template_winback` | `whatsapp` | `{"template": "Halo Kak {customer_name}! Kangen nih sama baju Kakak. Khusus hari ini ada diskon dengan kode: {promo_code}!"}` | Format pesan WhatsApp broadcast ajakan mencuci kembali. |

### 13.3 Protokol Keamanan Kredensial (Secret Isolation Protocol)

1. **Row Level Security (RLS) Terkunci:**
   - Kolom dengan `is_secret = TRUE` (seperti Midtrans Server Key) **DIBLOKIR TOTAL** dari query anonim maupun pelanggan biasa via kebijakan Supabase RLS.
   - Hanya API backend (`apps/worker` atau Next.js Server Route dengan Supabase Service Role Key) yang dapat membaca kunci rahasia ini.
2. **Kemudahan Pergantian Kunci (Zero Downtime Config Rotation):**
   - Ketika ingin beralih dari Midtrans Sandbox ke Midtrans Production, pemilik cukup mengedit nilai di halaman `/admin/settings` atau Supabase Table Editor tanpa perlu menyentuh file `.env` ataupun melakukan build ulang (*redeploy*) aplikasi di Vercel.

### 13.4 Spesifikasi Environment Variables Monorepo (Supabase & Database Vault)

Untuk menghubungkan seluruh workspace (`apps/web`, `apps/pos`, `apps/worker`, dan `packages/database`) ke instance Supabase Cloud secara aman dan deterministik, sistem mendefinisikan standar variabel lingkungan (*environment variables*) pada berkas `.env.local`:

| Nama Variabel Lingkungan | Contoh Nilai / Format | Target Workspace | Keterangan & Tingkat Sensitivitas |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://nvnuezmzbtcgpzqulwbw.supabase.co` | `apps/web`, `apps/pos` | URL REST/Realtime publik instance Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsIn...` | `apps/web`, `apps/pos` | Kunci anonim publik untuk query aman berpagar RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsIn...` | `apps/worker`, server API | **Rahasia Tinggi (Secret):** Bypass RLS untuk sinkronisasi antrean & pembayaran |
| `DATABASE_URL` | `postgresql://postgres.nvnuezmzbtcgpzqulwbw:[PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres` | Seluruh workspace | Connection string port 6543 (Transaction Pooler) untuk query operasional serverless |
| `DIRECT_URL` | `postgresql://postgres.nvnuezmzbtcgpzqulwbw:[PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres` | `packages/database` | Connection string port 5432 (Session Mode) khusus eksekusi migrasi DDL & triggers |

> **Catatan Keamanan & Git Guard:**  
> Berkas `.env.local` yang memuat password riil telah didaftarkan dalam `.gitignore` di tingkat root maupun sub-folder monorepo. Template kosong yang aman didokumentasikan pada [.env.example](./.env.example).




