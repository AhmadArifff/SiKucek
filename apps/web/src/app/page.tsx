export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl shadow-sky-100 text-center border border-sky-100">
        <h1 className="text-3xl font-extrabold text-sky-600 mb-2">SiKucek</h1>
        <p className="text-slate-600 text-sm mb-6">
          Solusi Laundry Pintar, Cepat, Higienis, dan Transparan.
        </p>
        <div className="bg-sky-50 rounded-2xl p-4 border border-sky-200/60 mb-6">
          <p className="text-xs font-semibold text-sky-800 uppercase tracking-wider mb-2">
            Lacak Cucian Cepat
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Contoh: SKC-X7K9P"
              className="w-full px-4 py-2 text-sm rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-xl transition">
              Cari
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
