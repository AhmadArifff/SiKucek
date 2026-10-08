# 20. Standar Basis Data Supabase PostgreSQL (SiKucek)

> **Rujukan Tata Kelola Basis Data**: Pedoman desain skema, migrasi aman, Row Level Security (RLS), dan integrasi Supabase Storage untuk sistem SiKucek.

---

## 1. Koneksi Dual-URL Supabase

Konfigurasi koneksi database wajib memisahkan antara connection pooling dan direct DDL migration:

1. **`DATABASE_URL` (Port 6543 - Transaction/Session Pooler)**:
   - Digunakan untuk koneksi serverless runtime (Next.js SSR, Express, background worker) guna mencegah kehabisan koneksi (*connection exhaustion*).
2. **`DIRECT_URL` (Port 5432 - Direct Connection)**:
   - Digunakan khusus saat menjalankan eksekusi script migrasi DDL SQL atau `prisma db push` / `prisma migrate`.

---

## 2. Prinsip Zero-Hardcode & Config Vault (`app_settings`)

Dilarang keras menaruh nilai konfigurasi bisnis atau kunci API secara hardcode di kode aplikasi:

1. **Tabel `public.app_settings`**:
   - Menyimpan seluruh parameter operasional: kredensial Midtrans, profil outlet, aturan minimal kg, skema poin streak, dan template pesan WhatsApp.
2. **Isolasi Rahasia (`is_secret = TRUE`)**:
   - Seluruh baris dengan `is_secret = TRUE` (misal Midtrans Server Key) dilindungi RLS ketat sehingga **TIDAK BISA DIBACA** oleh query client anonim atau pelanggan.
   - Hanya Service Role atau backend endpoint terautentikasi yang berhak mengakses nilai rahasia ini.

---

## 3. Row Level Security (RLS) Mandatory Gate

Seluruh tabel publik di Supabase wajib mengaktifkan RLS (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`):

1. **`profiles`**: Pengguna hanya dapat membaca dan memperbarui profil mereka sendiri.
2. **`orders`**:
   - Kasir dan Admin dapat membaca dan memperbarui seluruh pesanan outlet.
   - Pelanggan terdaftar hanya dapat melihat pesanan dengan `customer_id = auth.uid()`.
   - **Pelacakan Publik (Guest Tracking)**: Pelacakan anonim diizinkan secara selektif melalui pencocokan token `tracking_code`.
3. **`order_qc_photos`**: Foto kondisi awal pakaian dapat dilihat oleh publik/pelanggan yang memegang tracking code untuk transparansi QC.

---

## 4. Standar Supabase Storage Bucket (`qc-photos`)

1. **Kompresi Client-side WebP**:
   - Kamera kasir/operator wajib me-resize gambar ke lebar maksimal 1200px dan mengompresi ke format WebP dengan kualitas 0.8 (< 500 KB) sebelum mengunggah.
2. **Pola Penamaan Berkas**:
   - `qc-photos/order_{order_id}_{timestamp}_{random}.webp`
3. **Pembersihan Berkas Yatim**:
   - Jika order dibatalkan saat input awal, berkas sementara di storage wajib dihapus untuk menghemat kuota 1 GB gratis Supabase.

---

## 5. Konvensi Penamaan & Kolom Wajib

- **Nama Tabel**: Huruf kecil, jamak, snake_case (contoh: `orders`, `order_items`, `marketing_campaigns`, `racks`).
- **Primary Key**: UUID v4 menggunakan `DEFAULT gen_random_uuid()`.
- **Kolom Audit**: Setiap tabel transaksi wajib memiliki `created_at TIMESTAMPTZ DEFAULT NOW()` dan `updated_at TIMESTAMPTZ DEFAULT NOW()`.
- **Trigger `updated_at`**: Wajib dipasang pada seluruh tabel yang dapat dimutasi.
