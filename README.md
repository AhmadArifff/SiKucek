# SiKucek

> **Smart Hybrid Laundry Operating System**  
> Solusi Laundry Pintar, Cepat, Higienis, dan Transparan berbasis Arsitektur Monorepo, POS Kasir, Quality Control Anti-Sengketa, Public Tracking PWA, Gamifikasi, dan Otomasi WhatsApp.

---

## 🧼 Gambaran Proyek

**SiKucek** adalah platform operasional laundry hybrid modern yang menggabungkan kemudahan kasir/operator di outlet dengan transparansi pelacakan real-time bagi pelanggan:

- **Layanan Hybrid**: Mendukung perhitungan kiloan (desimal kg) dan helai satuan dalam 1 nomor invoice.
- **Quality Control (QC) Foto Anti-Sengketa**: Kasir memotret kondisi pakaian bermasalah (robek, noda bandel, luntur awal) via kamera WebRTC langsung tersimpan ke Supabase Storage.
- **Public Tracking PWA**: Pelanggan dapat melacak tahapan mencuci secara real-time via kode unik tanpa dipaksa login.
- **Gamifikasi Retensi**: Stamp Card Digital (5 stempel = 1 kupon gratis kiloan 5 kg) & Daily Check-in Streak Reward.
- **Otomasi WhatsApp (Baileys Engine)**: Pengiriman nota digital dan notifikasi pakaian selesai di rak secara otomatis.
- **Arsitektur Zero-Hardcode**: Semua parameter bisnis, kredensial Midtrans, template pesan WA, dan profil outlet dikelola dinamis di database Supabase (`app_settings`).

---

## 🏛️ Arsitektur Monorepo (Turborepo)

```
SiKucek/
├── apps/
│   ├── web/                    # Portal Pelanggan PWA & Public Tracking (Next.js 15)
│   ├── pos/                    # Kasir, Operator Laundry, & Admin Panel (Next.js / Vite SPA)
│   └── worker/                 # WhatsApp Automation Engine (Node.js + Baileys)
├── packages/
│   ├── shared/                 # Zod Schemas, TypeScript DTOs, Enums, & Formatters
│   ├── ui/                     # Design System Komponen (Tailwind + Radix/Shadcn)
│   └── database/               # Supabase Migrations, SQL DDL, RLS, & Seeders
├── .agents/                    # Multi-Agent Governance & Enterprise Knowledge
├── AGENTS.md                   # Universal Agentic Entry File
├── PRD.md                      # Single Source of Truth Kebutuhan Produk (13 Bab)
├── LICENSE                     # MIT License
└── README.md
```

---

## 📚 Dokumentasi Utama

- 📖 **[PRD.md](./PRD.md)**: Product Requirements Document lengkap mencakup 13 Bab spesifikasi bisnis, alur fitur, peta situs, dan skema database Supabase.
- 🤖 **[AGENTS.md](./AGENTS.md)**: Pedoman tata kelola multi-agen, 22 peran spesialis, 14 expert personas DNA, dan aturan mutlak rekayasa.
- 🗺️ **[.agents/README.md](./.agents/README.md)**: Peta aturan kerja modular, SOP workflow, dan basis pengetahuan terverifikasi.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah lisensi **MIT License** - lihat berkas [LICENSE](./LICENSE) untuk rincian lengkap.
