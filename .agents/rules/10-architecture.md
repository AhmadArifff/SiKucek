# 10. Arsitektur Monorepo & Standar Rekayasa (SiKucek)

> **Rujukan Tata Kelola Teknis**: Panduan arsitektur aplikasi SiKucek berbasis Turborepo, Next.js, Express/Node.js, dan Supabase PostgreSQL.

---

## 1. Topologi Monorepo (Turborepo + pnpm)

Proyek SiKucek menerapkan struktur monorepo terpisah secara modular namun terikat melalui pustaka bersama:

```
SiKucek/
├── apps/
│   ├── web/                    # Portal Pelanggan PWA & Public Tracking (Next.js 15 App Router)
│   ├── pos/                    # Kasir, Operator Laundry, & Admin Panel (Next.js / Vite SPA)
│   └── worker/                 # WhatsApp Automation Engine (Node.js + Baileys)
├── packages/
│   ├── shared/                 # Zod Schemas, TypeScript DTOs, Enums, & Formatters
│   ├── ui/                     # Reusable Design System Komponen (Tailwind + Radix/Shadcn)
│   └── database/               # Supabase Migrations, SQL DDL, RLS, & Seeders
├── .agents/                    # Multi-Agent Governance & Enterprise Knowledge
├── PRD.md                      # Single Source of Truth Kebutuhan Produk
├── package.json                # Root package.json (Workspaces apps/*, packages/*)
└── turbo.json                  # Turborepo Build Pipeline & Caching
```

---

## 2. Batasan Direktori Kerja (*Monorepo Path Guard*)

1. **Dilarang Membuat Direktori Baru di Root**:
   - Jangan membuat folder root seperti `src/`, `backend/`, `frontend/`, atau `models/`.
   - Kode portal pelanggan **WAJIB** berada di `apps/web/src/`.
   - Kode aplikasi kasir/operator **WAJIB** berada di `apps/pos/src/`.
   - Kode bot WhatsApp **WAJIB** berada di `apps/worker/src/`.
   - Kode kontrak tipe & Zod **WAJIB** berada di `packages/shared/src/`.
   - Kode DDL dan migrasi **WAJIB** berada di `packages/database/`.

2. **Pustaka Bersama (`packages/shared`)**:
   - Menghilangkan duplikasi antarmuka TypeScript antara client dan server.
   - Menyediakan `Result.ok(data)` dan `Result.fail(error)` (*Result Pattern*) untuk penanganan error konsisten tanpa nested *try-catch*.
   - Menyediakan utilitas format mata uang Rupiah (`formatRupiah`) dan format desimal berat kg (`formatKg`).

---

## 3. Pipeline Eksekusi Turborepo (`turbo.json`)

Setiap paket aplikasi harus mematuhi pipeline standar berikut:

* `pnpm dev`: Menjalankan seluruh aplikasi secara paralel (`apps/web` di port 3000, `apps/pos` di port 3001, `apps/worker` di latar belakang).
* `pnpm build`: Membangun bundle produksi dengan resolusi dependensi bertingkat (`^build`).
* `pnpm lint`: Memeriksa higienitas kode di seluruh workspace.
* `pnpm type-check`: Validasi tipe statis TypeScript tanpa kompilasi (`tsc --noEmit`).
* `pnpm kill:port`: Mematikan proses zombie di port 3000, 3001 jika aplikasi tertinggal di background.

---

## 4. Pola Rekayasa Aman (*Safe Logic Flow*)

1. **Guard Clause & Early Return**:
   - Hindari *pyramid of doom* (`if-else` bersarang). Periksa kondisi batas di awal fungsi; jika tidak memenuhi syarat langsung `return Result.fail(error)`.
2. **Resilient Mock Fallback (Midtrans)**:
   - Mengadopsi pola dari `E-Comerce-BucketFlowers`: Jika server Midtrans Sandbox mengalami gangguan atau outlet offline, sistem kasir membangkitkan simulasi token agar pengujian intake tidak pernah macet (*anti-freeze*).
3. **Idempotensi Webhook**:
   - Webhook pembayaran dan event order wajib menangani duplikasi payload tanpa memicu penambahan stempel ganda (*anti-double stamp*).

---

## 5. Strategi Percabangan Git (Git Branching Strategy)

- **Branch `dev` (Active Development)**: Seluruh pekerjaan implementasi modul baru, perbaikan bug, integrasi database, dan eksperimen harian **WAJIB** berada di branch `dev`.
- **Branch `main` (Production Release)**: Branch `main` diproteksi ketat dan hanya menerima penggabungan (*merge/PR*) dari `dev` saat seluruh fitur telah stabil dan lulus pengujian QA Delivery Gate.

