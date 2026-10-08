# AGENTS.md: Universal Multi-Agent Governance & PRD System (SiKucek)

> **Universal Agentic Entry File**: File ini dibaca secara otomatis pada setiap awal sesi percakapan (*session start*) dan prompt baru di lingkungan Antigravity, Claude Code, Codex, dan Cursor. File ini mengunci tata kelola arsitektur monorepo SiKucek, 4-tier hirarki peran, kedaulatan 13 Bab [PRD.md](./PRD.md), aturan mutlak [RULES.md](./.agents/rules/00-core-guardrails.md), serta integrasi database Supabase PostgreSQL.

---

## 1. Identitas Proyek & Fondasi Arsitektur Monorepo

- **Nama Proyek**: SiKucek (Smart Hybrid Laundry Operating System)
- **Tagline**: Solusi Laundry Pintar, Cepat, Higienis, dan Transparan
- **Arsitektur**: Monorepo berbasis Turborepo dan pnpm workspaces:
  - **Portal Pelanggan & PWA (`apps/web`)**: Next.js 15 (App Router), React 19, Tailwind CSS, Lucide Icons, Shadcn UI, Public Tracking tanpa login wajib, modul gamifikasi (Stamp Card & Daily Check-in).
  - **Aplikasi Kasir & Operator (`apps/pos`)**: Next.js / Vite SPA, TanStack Table, modul kamera WebRTC langsung untuk foto QC pakaian cacat, alokasi rak fisik, cetak nota thermal Bluetooth.
  - **WhatsApp Automation Engine (`apps/worker`)**: Node.js, TypeScript, pustaka Baileys untuk mengirim nota masuk dan pesan pengambilan pakaian siap di rak.
  - **Pustaka Bersama (`packages/shared`)**: Tipe data TypeScript kanonikal, Zod validation schemas, Result Pattern (`Result.ok()`, `Result.fail()`), dan formatters IDR/Kg.
  - **Pustaka Basis Data (`packages/database`)**: Migrasi DDL SQL Supabase, RLS policies, trigger database, dan seeders master data.
  - **Pusat Tata Kelola Multi-Agen (`.agents/`)**: Aturan rekayasa, alur kerja OODA, 14 expert personas DNA, dan knowledge base.

### Larangan Keras Halusinasi Direktori (*Monorepo Path Guard*):
- **JANGAN PERNAH** membuat folder root baru seperti `src/`, `backend/`, `frontend/`, atau `models/`.
- Seluruh kode portal pelanggan **WAJIB** berada di dalam `apps/web/src/`.
- Seluruh kode aplikasi kasir/operator **WAJIB** berada di dalam `apps/pos/src/`.
- Seluruh kode bot WhatsApp **WAJIB** berada di dalam `apps/worker/src/`.
- Seluruh tipe bersama **WAJIB** berada di dalam `packages/shared/src/`.
- Seluruh berkas tes sementara **WAJIB** disimpan di `.gemini/antigravity-ide/brain/.../scratch/` dan **DILARANG** ditinggalkan di direktori kerja git (*Zero-Residual Scratch Rule*).

### Kebijakan Git Branching Strategy:
- **Branch `dev` (Aktif)**: Seluruh proses pengembangan fitur, perbaikan bug, dan pengujian harian **WAJIB** berada di branch `dev`.
- **Branch `main` (Produksi)**: Branch `main` **HANYA** digunakan untuk rilis produksi (*production release*) yang sudah stabil, teruji, dan lulus verifikasi QA Delivery Gate.


---

## 2. 4-Tier Hirarki Peran (22 Spesialis) & 14 Expert Personas DNA

Proyek ini mengadopsi tata kelola multi-agen dari Master Hub (`agentic AI`):

1. **Generalist Tier (Koordinasi & Dekomposisi)**:
   - `triage-router` (Gerbang utama instruksi, persona Jeff Bezos & Paul Graham).
   - `problem-decomposer` (Memecah kebutuhan fitur menjadi sub-tugas independen).
   - `goal-tracker` (Single source of truth pelacak status sub-tugas).
   - `domain-retriever` (Menarik konteks teknis dari codebase & PRD.md).
   - `synthesis-voice` (Merangkum respon multi-agen menjadi jawaban akhir yang solutif).
2. **Specific Tier: Builders (Pelaksana Teknis)**:
   - `backend-engineer` (API, skema DB Supabase, RLS, result pattern, guard clauses).
   - `frontend-engineer` (Next.js 15, Tailwind CSS, PWA, Lucide icons, responsive layout).
   - `ui-ux-designer` (Design DNA, palet Sky/Coral/Gold, maskot Si Kucek, micro-interactions).
   - `copywriter` (Microcopy ramah, template pesan WhatsApp, copy deck informatif).
3. **Specific Tier: Reviewers (Penguji Kualitas - No Self-Review)**:
   - `qa-engineer` (Boundary testing, anti-slop gate, E2E browser automation).
   - `security-engineer` (Validasi RLS, sanitasi input, proteksi kredensial rahasia).
   - `tech-critic` (Devil's advocate, menantang asumsi, memeriksa halusinasi teknis).
4. **Governance & Metacognitive Tier**:
   - `policy-schema-enforcer` (Penegak aturan skema JSON/Zod dan kedaulatan aturan PRD.md).
   - `escalation-gate` (Pencegat aksi destruktif untuk konfirmasi pengguna - Human-in-the-Loop).

---

## 3. Peta Navigasi Cepat 13 Bab PRD ([PRD.md](./PRD.md))

Setiap agen wajib membaca indeks ini sebelum mengeksekusi tugas:

| Bab PRD | Modul & Fitur | Tabel Database Supabase Terkait | Lokasi Kode Utama |
| :--- | :--- | :--- | :--- |
| **Bab 1** | Ringkasan Eksekutif & Zero-Cost Infrastructure | `profiles`, `orders` | Workspace Config |
| **Bab 2** | Identitas Brand & Integrasi Maskot | Aset: `logo-sikucek.jpg`, `text-sikucek.jpg` | `packages/ui`, `apps/web/src` |
| **Bab 3** | Arsitektur Monorepo Turborepo | Workspaces: `apps/*`, `packages/*` | `package.json`, `turbo.json` |
| **Bab 4** | User Personas & Alur Perjalanan Pengguna | `profiles (customer, cashier)` | `apps/web`, `apps/pos` |
| **Bab 5** | Matriks Fitur Lengkap (MoSCoW P0, P1, P2) | Seluruh Tabel Inti | End-to-End Apps |
| **Bab 6** | Desain UI/UX & Motion Personality | Token Tailwind, Micro-animations | `packages/ui`, `apps/web/src/app` |
| **Bab 7** | Skema Database Supabase & DDL SQL | 18 Tabel PostgreSQL | `packages/database` |
| **Bab 8** | Roadmap Implementasi 5 Sprint | Sprint Planning & Deliverables | Project Management |
| **Bab 9** | Kriteria Sukses (QA Delivery Gate) | Anti-Slop R-01 s.d R-38 | `.agents/workflows/` |
| **Bab 10.1**| POS Order Intake Hybrid (Kiloan + Satuan) | `orders`, `order_items`, `services` | `apps/pos/src/app/orders/new` |
| **Bab 10.2**| Modul QC Foto Cacat Awal (WebRTC) | `order_qc_photos`, Bucket `qc-photos` | `apps/pos/src/components/qc` |
| **Bab 10.3**| Public Tracking PWA Tanpa Login | `orders`, `order_status_logs` | `apps/web/src/app/track/[code]`|
| **Bab 10.4**| Gamifikasi: Stamp Card & Daily Check-in | `loyalty_stamp_cards`, `daily_checkins` | `apps/web/src/app/app` |
| **Bab 10.5**| Manajemen Rak Fisik (Rack Locator) | `racks`, `orders.rack_location` | `apps/pos/src/components/orders`|
| **Bab 10.6**| WhatsApp Automation Engine (Baileys) | `whatsapp_queue` | `apps/worker/src` |
| **Bab 11** | Peta Situs (Sitemap & Rute Lengkap) | Next.js App Router Structure | `apps/web/src/app`, `apps/pos/src/app` |
| **Bab 12** | Mesin Pemasaran, Diskon ROI, & Referral | `marketing_campaigns`, `referral_logs` | `apps/pos/src/app/admin/marketing` |
| **Bab 13** | Arsitektur Zero-Hardcode & Config Vault | `app_settings` (Kunci Midtrans, Rules) | `apps/pos/src/app/admin/settings` |

---

## 4. Aturan Operasional Utama & Guardrails Bisnis

1. **Prinsip Zero-Hardcode (Bab 13)**:
   - Dilarang keras menaruh kunci API Midtrans, alamat outlet, aturan berat kiloan, atau template pesan di dalam kode program. Seluruhnya wajib dibaca dari tabel `public.app_settings` di Supabase.
   - Kolom `is_secret = TRUE` wajib diisolasi hanya untuk Service Role dan backend.
2. **Logika Diskon Parsial Kupon Stempel (Bab 10.4)**:
   - Voucher hadiah stempel "Gratis Cuci Kiloan Maksimal 5 Kg" **HANYA MEMOTONG PORSI KILOAN**. Porsi pakaian satuan tetap ditagihkan penuh tanpa potongan.
3. **Guardrail Wajib Nomor Rak (Bab 10.5)**:
   - Operator kasir **DILARANG MENGUBAH STATUS MENJADI READY** sebelum mengisi field `rack_location`.
4. **Resilient Mock Fallback untuk Midtrans**:
   - Jika koneksi internet outlet offline atau Midtrans Sandbox mengalami gangguan, sistem kasir otomatis menyediakan simulation token agar penerimaan cucian tidak terhenti.
5. **Reviewer Independence (No Self-Review)**:
   - Builder dilarang mereview kodenya sendiri. Setiap artefak wajib melalui verifikasi independen oleh `qa-engineer` atau `tech-critic`.
6. **Bebas Em Dash (R-02)**:
   - Larangan mutlak penggunaan karakter em dash panjang (`—`). Gunakan tanda minus biasa (`-`) atau titik dua.
7. **Pre-Push & Pre-Dev Git Pull Mandate (Kolaborasi Tim)**:
   - Sebelum mulai mengembangkan fitur dan sebelum melakukan `git push` ke GitHub, agen dan developer **WAJIB** menjalankan `git pull --rebase origin dev` untuk mencegah konflik kode dengan anggota tim lain.
8. **Protected Benchmark Reference File (`active-session.json`)**:
   - Berkas `.agents/02-session-state/active-session.json` adalah data referensi benchmark dari sistem saudara (`E-Comerce-BucketFlowers`) yang diadopsi sebagai acuan logika bisnis, arsitektur menu, dan riwayat milestone.
   - **DILARANG MENGUBAH / MERESET / MENGHAPUS** file `.agents/02-session-state/active-session.json` dalam prompt atau sesi apa pun. Berkas ini berstatus **Strictly Read-Only**.
9. **Prinsip Adopsi Arsitektur Lintas Sistem (External Context Adoption)**:
   - Segala referensi di luar konteks laundry pada direktori `.agents/` (seperti resep BOM, custom studio, atau case bank) adalah referensi adopsi pola rekayasa yang sah dari sistem saudara dan dipertahankan sebagai panduan solusi bagi tim pengembang SiKucek.

---

## 5. Hub-and-Spoke Governance (Child Spoke 3)

- **Master Hub**: `C:\Users\ASUS\Documents\Web Dev\improving\agentic AI`
- **Child Spoke 1**: `C:\Users\ASUS\Documents\Web Dev\improving\E-Comerce-BucketFlowers`
- **Child Spoke 3**: Repositori ini (`c:\Users\ASUS\Documents\Web Dev\improving\SiKucek`)
- Seluruh bug fixes bernilai umum yang ditemukan di SiKucek wajib didokumentasikan di `.agents/04-case-bank/` dan disinkronkan kembali (*upstream*) ke Master Hub.
