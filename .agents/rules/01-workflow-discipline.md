# 01-Workflow Discipline: OODA Loop & Separation of Duty

Dokumen ini mengatur tata tertib proses kerja seluruh agent guna mencegah bias kognitif dan fenomena **Echo-Chamber Hallucination**.

---

## 1. Siklus OODA (Observe -> Orient -> Decide -> Act)

Setiap tugas wajib melalui 4 fase berurutan:
1. **Observe (Pengamatan)**:
   - Baca file yang relevan (`view_file`), periksa skema database PostgreSQL, dan identifikasi seksi [PRD.md](../../PRD.md) yang terkait.
2. **Orient (Orientasi & Analisis)**:
   - Cek `established_constraints` pada `.agents/02-session-state/active-session.json`.
   - Cek apakah bug/solusi serupa sudah pernah tercatat di `.agents/04-case-bank/`.
3. **Decide (Keputusan & Rencana)**:
   - Buat rencana terstruktur (`implementation_plan.md`) sebelum menulis kode jika perubahan melibatkan lebih dari 1 file atau memengaruhi skema database.
4. **Act (Tindakan & Verifikasi)**:
   - Tulis kode menggunakan edit tools presisi (`replace_file_content` / `multi_replace_file_content`).
   - Uji kompilasi TypeScript (`npm run type-check`) dan lakukan tes HTTP/browser.

---

## 2. Separation of Duty (Pemisahan Peran Tegas: No Self-Review)

- **Builder** (`backend-engineer`, `frontend-engineer`) fokus mengeksekusi logika teknis, query database, dan antarmuka.
- **Reviewer** (`qa-engineer`, `tech-critic`) menguji kode secara independen dari kacamata pengujian tepi (*edge-case testing*), integritas data, dan heuristik UX.
- **Prinsip Dasar**: Builder tidak boleh menjadi penilai akhir atas kodenya sendiri. Pernyataan *"kode ini sudah saya cek dan tidak ada bug"* dari builder dianggap **tidak sah** sebelum diverifikasi oleh QA.

---

## 3. Circuit Breaker Pengerjaan Ulang (*Rework Circuit Breaker*)

- Jika suatu fitur atau perbaikan mengalami siklus revisi (Builder $\leftrightarrow$ Reviewer) sebanyak **$\ge$ 3 kali berturut-turut** karena gagal uji atau regresi:
  1. Hentikan eksekusi otomatis seketika (*circuit breaker tripped*).
  2. Buka peran `deadlock-fallback-resolver` untuk memetakan akar penyebab konflik.
  3. Alihkan ke `escalation-gate` untuk meminta klarifikasi atau keputusan desain langsung dari manusia (*Human-in-the-Loop*).
  4. Dilarang melakukan loop revisi tanpa akhir (*infinite looping*) yang menghabiskan token dan mengacaukan riwayat kode.

---

## 4. Single Door Policy & Human-in-the-Loop
- Pengguna hanya perlu memberikan instruksi secara alami tanpa perlu menyebutkan nama-nama agen internal.
- `triage-router` yang mendistribusikan pekerjaan ke sub-agen di balik layar.
- Segala aksi destruktif (menghapus tabel, mengubah skema produksi secara *breaking*, atau hard reset git) wajib meminta konfirmasi pengguna terlebih dahulu.

---

## 5. Protokol Pemisahan Dokumentasi: Fitur Baru vs Perbaikan Bug (*Clean PRD Policy*)

- **Fitur Baru (New Feature)**:
  - Wajib dicatat di `PRD.md` (spesifikasi fungsional, UI/UX, dan model bisnis baru).
  - Wajib dicatat di `.agents/knowledge/prd-index-map.md`, `AGENTS.md`, dan `.agents/02-session-state/active-session.json`.
- **Perbaikan Bug (Bug Fix / Technical Patch)**:
  - **HANYA dicatat di `.agents/`** (`.agents/04-case-bank/cases/`, `.agents/knowledge/bug-cases.md`, dan `active-session.json`).
  - **DILARANG KERAS** menambahkan log penanganan bug teknis atau patching ke dalam `PRD.md` agar `PRD.md` tetap bersih, ramping, dan terstruktur sebagai dokumen produk arsitektural.

---

## 6. Protokol Kolaborasi Tim SiKucek & Auto-Push Branch `dev` (*Team Delivery Protocol*)

> ⚠️ **PENEGASAN TIM & BRANCH `dev`**: Seluruh pengembangan SiKucek berpusat di branch `dev`. Mengingat pengembangan dilakukan secara tim multi-developer, protokol sinkronisasi git bersifat **WAJIB** untuk mencegah code conflict.

Setiap pengerjaan teknis pada proyek ini wajib mengikuti tahapan sinkronisasi teratur:
0. **Tahap 0: Sinkronisasi Awal Lintas Pengembang (Pre-Development Pull-Rebase)**:
   - Sebelum menganalisis tugas atau menulis rencana, jalankan `git pull --rebase origin dev` untuk mengunduh pembaruan terbaru dari anggota tim lain.
   - Cek `git log -n 5 --oneline` untuk memverifikasi riwayat commit terkini.
1. **Tahap 1: Perlindungan Berkas Referensi Benchmark (`active-session.json`)**:
   - Berkas `.agents/02-session-state/active-session.json` adalah data referensi adopsi arsitektur dari sistem saudara (`E-Comerce-BucketFlowers`).
   - Dilarang keras memodifikasi, menimpa, atau mereset berkas ini. Perlakukan sebagai berkas *strictly read-only*.
2. **Tahap 2: Rencana & Verifikasi Kualitas**:
   - Builder menyusun kode sesuai PRD SiKucek.
   - Reviewer menguji kualitas (0 error kompilasi TypeScript, tidak ada tombol/link mati, kepatuhan anti-slop).
3. **Tahap 3: Otomatis Commit, Pull-Rebase Sebelum Push, & Push ke Origin `dev`**:
   - **3.1. Commit Lokal**: Stage perubahan (`git add .`) dan buat commit lokal terstruktur (`feat: ...`, `fix: ...`, `docs: ...`).
   - **3.2. Tarik Remote Terbaru (Pre-Push Pull-Rebase)**: Jalankan `git pull --rebase origin dev` sebelum melakukan push untuk menyelaraskan commit di atas commit terbaru rekan tim.
   - **3.3. Resolusi Konflik Cerdas & Re-Verifikasi**:
     - Jika terdeteksi konflik: Agen/developer mengidentifikasi file terdampak, membedah marker konflik, dan menyelesaikannya dengan cermat tanpa menghilangkan logika sah rekan tim.
     - Lanjutkan rebase (`git add .` dan `git rebase --continue`).
     - Jalankan ulang type-check dan tes untuk memastikan tidak ada regresi pasca-resolusi konflik.
   - **3.4. Push Bersih ke Origin Dev**: Eksekusi `git push origin dev`. Pastikan working tree bersih.

---

## 7. Arsitektur Hub-and-Spoke Sinkronisasi Pengetahuan dengan Induk `agentic AI`

- **Induk (`..\agentic AI`)**: Pusat pengetahuan master.
- **Anak (`E-Comerce-BucketFlowers`)**: Mengadopsi default dari induk, lalu menyesuaikannya (*customization*) dengan konteks lokal.
- **Sinkronisasi Balik**: Setiap kali child project menyelesaikan bug penting (di `04-case-bank/cases/`) atau melahirkan workflow baru yang bermanfaat universal, artefak tersebut disinkronkan kembali ke `.agents` induk `agentic AI`.
- **Tujuan**: Induk `agentic AI` terus bertambah pintar seiring waktu. Saat proyek baru dibuat di masa depan, proyek tersebut langsung mengadopsi induk yang telah belajar dari seluruh pengalaman proyek-proyek sebelumnya!
