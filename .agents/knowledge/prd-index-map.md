# Knowledge: Peta Navigasi PRD SiKucek (PRD Fast-Index Map)

> **Single Source of Truth Navigator**: Dokumen rujukan cepat bagi seluruh agen untuk memetakan kebutuhan bisnis di [PRD.md](../../PRD.md) terhadap tabel database Supabase dan modul aplikasi monorepo.

---

## 1. Peta Indeks 13 Bab PRD SiKucek

| Bab PRD | Modul & Fitur | Tabel Terkait di Supabase | Lokasi Kode Utama |
| :--- | :--- | :--- | :--- |
| **Bab 1** | Ringkasan Eksekutif & Filosofi Zero-Cost | `profiles`, `orders` | Root Workspace / Config |
| **Bab 2** | Identitas Brand & Integrasi Maskot | Aset: `logo-sikucek.jpg`, `text-sikucek.jpg` | `packages/ui`, `apps/web/src/components` |
| **Bab 3** | Arsitektur Monorepo Turborepo | Struktur Workspaces `apps/*`, `packages/*` | `package.json`, `turbo.json` |
| **Bab 4** | User Personas & Alur Perjalanan Pengguna | `profiles (role: customer, cashier)` | `apps/web`, `apps/pos` |
| **Bab 5** | Matriks Fitur Lengkap (MoSCoW P0, P1, P2) | Seluruh Tabel Inti | End-to-End Monorepo |
| **Bab 6** | Spesifikasi Desain UI/UX & Motion | Tokens Tailwind, Google Fonts | `packages/ui`, `apps/web/src/app/globals.css` |
| **Bab 7** | Skema Database Supabase & DDL SQL | 18 Tabel Inti PostgreSQL | `packages/database/migrations` |
| **Bab 8** | Roadmap Implementasi 5 Sprint | Sprint Planning & Deliverables | Project Management |
| **Bab 9** | Kriteria Sukses (QA Delivery Gate) | Anti-Slop R-01 s.d R-38 | `.agents/workflows/anti-slop-verification.md` |
| **Bab 10.1** | POS Order Intake Hybrid (Kiloan + Satuan) | `orders`, `order_items`, `services` | `apps/pos/src/app/orders/new` |
| **Bab 10.2** | Modul Quality Control (Foto Cacat Awal) | `order_qc_photos`, Bucket `qc-photos` | `apps/pos/src/components/qc/CameraModal.tsx` |
| **Bab 10.3** | Public Tracking PWA (Tanpa Wajib Login) | `orders`, `order_status_logs` | `apps/web/src/app/track/[code]` |
| **Bab 10.4** | Gamifikasi: Stamp Card & Daily Check-in | `loyalty_stamp_cards`, `daily_checkins` | `apps/web/src/app/app/page.tsx` |
| **Bab 10.5** | Manajemen Rak Fisik (Rack Locator) | `racks`, `orders.rack_location` | `apps/pos/src/components/orders/RackModal.tsx` |
| **Bab 10.6** | Worker Otomasi WhatsApp (Baileys Engine) | `whatsapp_queue` | `apps/worker/src/index.ts` |
| **Bab 11** | Struktur Peta Situs (Sitemap & Rute) | Routing Next.js App Router | `apps/web/src/app`, `apps/pos/src/app` |
| **Bab 12** | Mesin Pemasaran & Pelacakan Diskon ROI | `marketing_campaigns`, `marketing_banners`, `referral_logs` | `apps/pos/src/app/admin/marketing` |
| **Bab 13** | Arsitektur Zero-Hardcode & Config Vault | `app_settings` (Midtrans keys, templates) | `apps/pos/src/app/admin/settings` |

---

## 2. Aturan Navigasi untuk Agen

1. **Selalu Buka Bab Terkait Sebelum Mengedit Kode**: Jika ditugaskan membuat form order intake, wajib memeriksa Bab 10.1 dan Bab 11.2 terlebih dahulu.
2. **Kepatuhan Terhadap Logika Diskon Parsial (Bab 10.4)**: Voucher stempel gratis kiloan 5 kg dilarang keras memotong item satuan.
3. **Kepatuhan Terhadap Guardrail Rak (Bab 10.5)**: Status pesanan tidak boleh berubah ke `ready` jika `rack_location` belum diisi.
