export default function PosHomePage() {
  return (
    <main className="p-6 max-w-5xl mx-auto">
      <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-sky-600">SiKucek POS</h1>
          <p className="text-xs text-slate-500">Mode Kasir & Operator Laundry</p>
        </div>
        <div className="flex gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            Outlet Aktif
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700 mb-2">Order Baru (Hybrid)</h2>
          <p className="text-xs text-slate-500 mb-4">Input cucian kiloan, item satuan, dan foto QC cacat kain.</p>
          <button className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-medium text-sm rounded-xl transition">
            + Tambah Order Baru
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700 mb-2">Alokasi Rak (Ready)</h2>
          <p className="text-xs text-slate-500 mb-4">Pindahkan cucian yang sudah dipacking ke rak fisik.</p>
          <button className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm rounded-xl transition">
            Kelola Rak Penyimpanan
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700 mb-2">Daftar Cucian Masuk</h2>
          <p className="text-xs text-slate-500 mb-4">Pantau antrean cuci, pengeringan, dan setrika uap.</p>
          <button className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-medium text-sm rounded-xl transition">
            Lihat Antrean
          </button>
        </div>
      </div>
    </main>
  );
}
