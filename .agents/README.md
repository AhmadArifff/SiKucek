# Peta Tata Kelola & Aturan Kerja SiKucek (.agents Rules Map)

Selamat datang di direktori tata kelola aturan, alur kerja, dan basis pengetahuan cerdas proyek **SiKucek (Smart Hybrid Laundry Operating System)**.

> [!NOTE]
> File auto-load utama yang dibaca otomatis di setiap sesi percakapan baru adalah [`AGENTS.md`](../AGENTS.md) di root workspace. File tersebut mendefinisikan hirarki 4-tier peran, siklus OODA, dan pointer ke direktori ini.

---

## 1. Aturan Mutlak (Selalu Aktif)

Setiap agen pengembang **WAJIB** tunduk pada dokumen berikut:
* **[00-core-guardrails.md](./rules/00-core-guardrails.md)**: Larangan keras hardcode kredensial rahasia, larangan mengubah skema database tanpa review, proteksi berkas benchmark `active-session.json` (strictly read-only), dan mandat `git pull --rebase origin dev` sebelum push.
* **[01-workflow-discipline.md](./rules/01-workflow-discipline.md)**: Siklus OODA (Observe -> Orient -> Decide -> Act), protokol kolaborasi tim branch `dev`, pembersihan berkas scratch (*Zero-Residual Scratch Rule*), dan adopsi pola arsitektur lintas sistem.

---

## 2. Peta Aturan Berdasarkan Area Kerja (*Task-Based Rules*)

| Jika Sedang Mengerjakan... | Buka & Patuhi Dokumen: | Cakupan Utama |
| :--- | :--- | :--- |
| **Arsitektur Monorepo & Apps** | **[10-architecture.md](./rules/10-architecture.md)** | Struktur `apps/web`, `apps/pos`, `apps/worker`, `packages/shared`, pipeline Turborepo. |
| **Database & Supabase** | **[20-database-supabase.md](./rules/20-database-supabase.md)** | 18 tabel PostgreSQL, RLS, Config Vault `app_settings`, dan bucket storage `qc-photos`. |
| **Antarmuka Web & POS** | **[30-frontend-sikucek.md](./rules/30-frontend-sikucek.md)** | Design DNA, token warna Sky/Coral/Gold, maskot Si Kucek, font Plus Jakarta Sans, micro-animations. |
| **Keamanan & Akses Pengguna** | **[40-security-rbac.md](./rules/40-security-rbac.md)** | RBAC (customer, cashier, washer, owner), proteksi IDOR, dan isolasi kunci Midtrans. |
| **Laporan & Rekap Kasir** | **[50-excel-reports.md](./rules/50-excel-reports.md)** | Rekap harian kasir, omzet tunai vs QRIS, dan ekspor data spreadsheet anti-OOM. |

---

## 3. Direktori Prosedur Kerja Baku (*Workflows*)

Saat menjalankan pekerjaan tertentu, gunakan prosedur baku berikut:
* **[workflows/task-review-protocol.md](./workflows/task-review-protocol.md)**: **[WAJIB]** Protokol Review Task Sebelum Development (Evaluasi 7 Pilar & Persetujuan Pengguna).
* **[workflows/new-prd-feature.md](./workflows/new-prd-feature.md)**: Siklus hidup pembuatan fitur berbasis PRD (PRD -> DB -> Types -> API/Components -> QA).
* **[workflows/db-migration-safe.md](./workflows/db-migration-safe.md)**: Prosedur migrasi skema database Supabase produksi tanpa downtime.
* **[workflows/anti-slop-verification.md](./workflows/anti-slop-verification.md)**: Verifikasi delivery gate 4-blok (bebas em dash, rasio kontras WCAG AA, tap target $\ge$ 44px).

---

## 4. Basis Pengetahuan & Peta Navigasi

* **[knowledge/prd-index-map.md](./knowledge/prd-index-map.md)**: Peta indeks cepat menghubungkan seluruh 13 Bab PRD ke tabel dan kode aplikasi.
* **[knowledge/hub-and-spoke-sync.md](./knowledge/hub-and-spoke-sync.md)**: Protokol hubungan sinkronisasi dengan Master Hub `agentic AI`.
* **[04-case-bank/](./04-case-bank/)**: Preseden solusi bug dan optimasi produksi yang telah tervalidasi.
