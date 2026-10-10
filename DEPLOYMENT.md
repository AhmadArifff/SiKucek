# Panduan Deployment Vercel: SiKucek (Smart Hybrid Laundry)

Dokumen ini memandu proses deployment online proyek monorepo SiKucek ke **Vercel** secara gratis (*Hobby Tier Rp 0*), sehingga aplikasi kasir (`apps/pos`) dan portal pelanggan (`apps/web`) dapat langsung diakses publik melalui browser smartphone, tablet, maupun laptop.

---

## 1. Arsitektur Deployment Monorepo di Vercel

Karena SiKucek dibangun menggunakan arsitektur monorepo Turborepo, kita akan membuat **2 Proyek di Vercel** dari satu repositori GitHub yang sama (`https://github.com/AhmadArifff/SiKucek`):

| Nama Proyek Vercel | Target Workspace | Root Directory | Contoh Domain Hasil Rilis |
|---|---|---|---|
| **`sikucek-web`** | Portal Pelanggan & Public Tracking | `apps/web` | `https://sikucek-web.vercel.app` |
| **`sikucek-pos`** | Dashboard Kasir & Admin Outlet | `apps/pos` | `https://sikucek-pos.vercel.app` |

---

## 2. Kredensial Environment Variables (Wajib Disalin ke Vercel)

Kedua proyek Vercel di atas membutuhkan 4 variabel lingkungan yang sama agar terhubung langsung ke database Supabase Cloud live:

| Nama Variable | Nilai Konfigurasi (Value) |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://nvnuezmzbtcgpzqulwbw.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52bnVlem16YnRjZ3B6cXVsd2J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1Nzk0ODUsImV4cCI6MjEwNzE1NTQ4NX0.XEqUec3ep7x0vaihXsShdowkjLrltiTojXyLKYilFW4` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52bnVlem16YnRjZ3B6cXVsd2J3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTU3OTQ4NSwiZXhwIjoyMTA3MTU1NDg1fQ.icheQScEtDm4vf8hKhP1qjdvJg4QxjUSaf3v71w89Wk` |
| `DATABASE_URL` | `postgresql://postgres.nvnuezmzbtcgpzqulwbw:2nJVtf5FVCZbDCkq@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres` |

---

## 3. Langkah Demi Langkah Deployment ke Vercel

### Langkah A: Deploy Portal Pelanggan (`sikucek-web`)

1. Buka dashboard Vercel Anda di: [https://vercel.com/new](https://vercel.com/new) (Login menggunakan akun GitHub Anda).
2. Cari repositori **`AhmadArifff/SiKucek`**, lalu klik tombol **Import**.
3. Pada halaman **Configure Project**:
   - **Project Name**: `sikucek-web`
   - **Framework Preset**: Pilih `Next.js`
   - **Root Directory**: Klik tombol **Edit**, pilih folder `apps/web`, lalu klik **Continue**.
     > *Penting: Pastikan opsi "Include source files outside of the Root Directory" tetap tercentang secara default.*
4. Buka accordion **Environment Variables**, lalu tambahkan ke-4 variabel pada tabel di atas.
5. Klik tombol **Deploy**.
6. Tunggu sekitar 1 - 2 menit hingga build selesai. Anda akan mendapatkan URL publik (misal: `https://sikucek-web.vercel.app`).

---

### Langkah B: Deploy Aplikasi Kasir & POS (`sikucek-pos`)

1. Kembali ke dashboard utama Vercel, klik tombol **Add New...** -> **Project** ([https://vercel.com/new](https://vercel.com/new)).
2. Pilih kembali repositori **`AhmadArifff/SiKucek`**, lalu klik **Import**.
3. Pada halaman **Configure Project**:
   - **Project Name**: `sikucek-pos`
   - **Framework Preset**: Pilih `Next.js`
   - **Root Directory**: Klik tombol **Edit**, pilih folder `apps/pos`, lalu klik **Continue**.
4. Buka accordion **Environment Variables**, lalu tambahkan ke-4 variabel pada tabel di atas.
5. Klik tombol **Deploy**.
6. Tunggu proses build selesai. Anda akan mendapatkan URL publik untuk kasir (misal: `https://sikucek-pos.vercel.app`).

---

## 4. Cara Pengujian Setelah Live di Internet (Testing Matrix)

Setelah kedua URL Vercel aktif:

1. **Uji Coba Kasir Online (`sikucek-pos`)**:
   - Buka URL `sikucek-pos.vercel.app` di smartphone atau laptop.
   - Buka `/admin/services` untuk melihat katalog tarif live dari Supabase.
   - Buka `/orders/new` untuk membuat transaksi cucian baru (kiloan + satuan).
   - Klik **Ambil Foto Kondisi Pakaian** untuk memverifikasi kamera smartphone dan upload foto QC ke Supabase Storage bucket `qc-photos`.
   - Pilih nomor rak penyimpanan (misal: `RAK-A1`) lalu simpan pesanan. Catat kode pelacakannya (contoh: `SKC-A1B2C`).

2. **Uji Coba Pelanggan Online (`sikucek-web`)**:
   - Buka URL `sikucek-web.vercel.app` di smartphone pelanggan.
   - Masukkan kode pelacakan di form tracking muka atau langsung buka `/track/[kode_pelacakan]`.
   - Verifikasi bahwa linimasa status, rincian biaya, nomor rak, dan galeri foto QC tampil dengan jernih.
   - Buka `/auth/login` untuk mencoba klaim daily check-in dan melihat stamp card loyalti.

---

## 5. Sinkronisasi Otomatis Setiap Commit (CI/CD)

Setiap kali ada pembaruan kode yang di-push ke branch `dev` atau `main` di GitHub, Vercel secara otomatis akan mendeteksi perubahan dan melakukan re-deploy (*automatic continuous deployment*) dalam 1 menit tanpa downtime.
