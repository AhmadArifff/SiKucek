# 30. Standar Desain Antarmuka & Frontend UI/UX (SiKucek)

> **Rujukan Tata Kelola UI/UX**: Pedoman desain visual, identitas brand maskot, token warna, tipografi, dan mikro-interaksi untuk aplikasi web dan POS SiKucek.

---

## 1. Identitas Visual & Integrasi Aset Brand

Aplikasi SiKucek membawa nuansa bersih, ramah, segar, dan transparan. Dua aset grafis utama di *root* wajib diintegrasikan:

1. **Brand Mascot ("Si Kucek" - `logo-sikucek.jpg`)**:
   - Karakter ember kartun ceria berbusa sabun, memakai bot karet toska, memegang pakaian kotor yang disulap menjadi baju toska berkilau, dikelilingi gelembung air dan koin emas loyalti.
   - **Penempatan**:
     - *Splash Screen PWA & Hero Banner*: Memperkenalkan maskot sebagai sahabat laundry.
     - *Empty State*: Ilustrasi Si Kucek memegang keranjang kosong mengajak mencuci.
     - *Kartu QC Warning*: Si Kucek memeriksa pakaian dengan ekspresi teliti pada kartu foto cacat pakaian.
     - *Gamifikasi Loyalitas*: Animasi Si Kucek merayakan stempel ke-5 (klaim kupon cuci gratis 5 kg).
     - *Status Ready*: Si Kucek memegang baju bersih di samping nomor rak pengambilan.

2. **Typographic Logotype (`text-sikucek.jpg`)**:
   - Tipografi 3D *bubble comic* bergradasi biru cyan (#38BDF8 ke #0284C7), aksen busa sabun di atas huruf "S" dan "k", outline navy pekat, dan percikan gelembung air.
   - **Penempatan**: Header navigasi utama, kop nota cetak, invoice digital WhatsApp, dan Open Graph preview.

---

## 2. Design DNA & Palet Token Warna

Wajib menggunakan token warna CSS / Tailwind berikut:

| Token Warna | Nilai HEX | Penggunaan Fungsional |
|---|---|---|
| **Primary Fresh Cyan** | `#0EA5E9` & `#38BDF8` | Warna dominan air bersih, kesegaran, progress stepper aktif. |
| **Deep Clean Ocean** | `#0284C7` & `#0369A1` | Tombol CTA utama, judul penting, outline kontras. |
| **Foam Pure White** | `#FFFFFF` & `#F0F9FF` | Kartu konten, latar belakang gelembung, kanvas PWA. |
| **Bubble Coral (Rose)** | `#FB7185` & `#F43F5E` | Pipi Si Kucek, badge peringatan cacat pakaian (QC). |
| **Loyalty Gold (Amber)** | `#F59E0B` & `#FBBF24` | Koin reward, stempel loyalti aktif, bintang streak. |
| **Dark Navy Outline** | `#0F172A` | Teks keterbacaan tinggi standar WCAG AA (rasio kontras $\ge 4.5:1$). |

---

## 3. Tipografi & Hierarki Teks

1. **Font Judul & Branding**: `Plus Jakarta Sans` atau `Nunito` (font sans-serif bulat, modern, hangat, dan ramah).
2. **Font Teks Utama**: `Inter` atau `Plus Jakarta Sans` dengan `font-normal` (400) dan `font-medium` (500).
3. **Font Angka & Moneter**: `JetBrains Mono` atau angka tabular (`tabular-nums`) untuk berat kilogram dan nominal harga agar rata kanan rapi pada struk nota.

---

## 4. Mikro-Interaksi & Gerakan (Motion Personality)

1. **Soap Bubble Burst Animation**:
   - Efek partikel gelembung sabun meletup halus saat pelanggan menekan tombol *Klaim Check-in Harian* atau mencap stempel loyalti.
2. **Stepper Linimasa Gelembung (7 Tahap)**:
   - Indikator progres berpindah halus dengan transisi CSS saat status cucian maju dari Cuci ke Kering, Setrika, dan Siap Ambil.
3. **Confetti Celebration**:
   - Ledakan partikel confetti toska dan emas saat pelanggan menyelesaikan stempel ke-5 dan membuka voucher gratis kiloan.

---

## 5. Kepatuhan Filter Anti-Slop (Delivery Gate)

1. **Bebas Em Dash (R-02)**: Dilarang keras menggunakan karakter em dash panjang (`—`). Gunakan tanda minus standar (`-`) atau titik dua.
2. **Aksesibilitas Mobile (R-03 & R-25)**:
   - Area sentuh tombol (*tap target*) minimal 44px x 44px.
   - Tidak ada kebocoran overflow horizontal pada layar ponsel (lebar 360px s.d 430px).
3. **Status Penuh (Empty, Loading, Error)**:
   - Setiap tabel dan halaman wajib memiliki tampilan skeleton saat memuat, pesan ramah saat kosong, dan tombol muat ulang saat gagal.
