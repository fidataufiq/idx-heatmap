"use client";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-neutral-950/60 font-mono transition-opacity">
      {/* Backdrop Area untuk Menutup Drawer saat diklik di luar */}
      <div className="fixed inset-0" onClick={onClose}></div>

      {/* Slide-over Drawer Panel dari Sisi Kanan (Tanpa blur berlebihan) */}
      <div className="relative z-10 bg-neutral-900 border-l border-neutral-800 w-full max-w-xl h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 p-4 bg-neutral-950 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-xs">?</div>
            <div>
              <h3 className="font-extrabold text-white text-xs sm:text-sm uppercase tracking-wider">System Manual & Documentation</h3>
              <p className="text-[10px] text-neutral-400 font-sans">Dokumentasi Modul & Metodologi MapIDX Terminal</p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white text-xs bg-neutral-800 hover:bg-neutral-700 px-2.5 py-1 rounded transition cursor-pointer border border-neutral-700">
            ✕ Tutup
          </button>
        </div>

        {/* Drawer Content Area (Scrollable) */}
        <div className="p-4 sm:p-6 space-y-6 text-xs text-neutral-300 font-sans leading-relaxed overflow-y-auto flex-1">
          {/* SECTION 1: RINGKASAN & TUJUAN PROJEK */}
          <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-4 space-y-2">
            <h4 className="font-bold text-white text-xs font-mono uppercase text-emerald-400 flex items-center gap-2">
              <span>🚀</span> Tentang MapIDX Terminal
            </h4>
            <p className="text-neutral-300 text-[11px] leading-normal">
              <strong>MapIDX</strong> adalah platform analisis data finansial <em>full-width</em> berkinerja tinggi berbasis <strong>Next.js 16 App Router</strong> dan <strong>Tailwind CSS</strong>. Dirancang untuk menyajikan data Bursa
              Efek Indonesia (BEI/IDX) secara <em>real-time</em>, presisi, dan intuitif.
            </p>
          </div>

          {/* SECTION 2: MODUL 1 - HEATMAP */}
          <div className="space-y-2 border-b border-neutral-800/80 pb-5">
            <h4 className="font-bold text-white text-xs font-mono uppercase text-emerald-400 flex items-center gap-2">
              <span>📊</span> Modul 1: Sectoral Heatmap & Visual Grid
            </h4>
            <p className="text-neutral-400 text-[11px]">Visualisasi pergerakan harga saham berbasis luas area kapitalisasi pasar (Market Cap Weighting):</p>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-300 font-mono text-[11px]">
              <li>
                <strong className="text-white">Proposi Blok:</strong> Ukuran kotak mencerminkan besar Market Cap emiten.
              </li>
              <li>
                <strong className="text-white">Pengodean Warna:</strong>
                <span className="text-emerald-400 ml-1">Hijau (+%)</span> untuk penguatan dan
                <span className="text-rose-400 ml-1">Merah (-%)</span> untuk koreksi.
              </li>
              <li>
                <strong className="text-white">Sector Quick Pills:</strong> Pemfilteran instan berdasarkan 10+ sektor industri.
              </li>
            </ul>
          </div>

          {/* SECTION 3: MODUL 2 - SCREENER */}
          <div className="space-y-2 border-b border-neutral-800/80 pb-5">
            <h4 className="font-bold text-white text-xs font-mono uppercase text-emerald-400 flex items-center gap-2">
              <span>🎯</span> Modul 2: Stock Screener Cerdas
            </h4>
            <p className="text-neutral-400 text-[11px]">Alat penyaring fundamental interaktif berbasis kriteria rasio:</p>
            <div className="grid grid-cols-1 gap-2 mt-2 font-mono text-[10px]">
              <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800">
                <span className="text-emerald-400 font-bold block mb-1">💎 Undervalued Strategy</span>
                Menyaring emiten dengan PBV &lt; 1.2x dan PER &lt; 15x.
              </div>
              <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800">
                <span className="text-emerald-400 font-bold block mb-1">💰 High Dividend Aristocrats</span>
                Menyaring emiten dengan Dividend Yield &gt; 4%.
              </div>
            </div>
          </div>

          {/* SECTION 4: MODUL 3 - KOMPARASI CARD */}
          <div className="space-y-2 border-b border-neutral-800/80 pb-5">
            <h4 className="font-bold text-white text-xs font-mono uppercase text-emerald-400 flex items-center gap-2">
              <span>⚖️</span> Modul 3: Komparasi Card Head-to-Head
            </h4>
            <p className="text-neutral-400 text-[11px]">
              Analisis berdampingan hingga 4 emiten lengkap dengan <strong className="text-white">Visual Range Bar 52 Minggu</strong> untuk memetakan posisi harga saat ini terhadap titik tertinggi dan terendah tahunan.
            </p>
          </div>

          {/* SECTION 5: MODUL 4 - AUTOMATED MARKET SIGNALS */}
          <div className="space-y-2 border-b border-neutral-800/80 pb-5">
            <h4 className="font-bold text-white text-xs font-mono uppercase text-emerald-400 flex items-center gap-2">
              <span>⚡</span> Modul 4: Sinyal Pasar Otomatis
            </h4>
            <p className="text-neutral-400 text-[11px]">Mesin kuantitatif kuantitatif berbasis 3 aturan institusional:</p>
            <ol className="list-decimal pl-5 space-y-1.5 text-neutral-300 font-mono text-[11px]">
              <li>
                <strong className="text-white">Filter Likuiditas ADTV:</strong> Menyaring emiten dengan nilai transaksi &ge; Rp 2 Miliar/hari.
              </li>
              <li>
                <strong className="text-white">Valuasi Sektoral:</strong> Ambang batas rasio PER/PBV yang disesuaikan per industri.
              </li>
              <li>
                <strong className="text-white">Konfirmasi Volume:</strong> Memastikan lonjakan momentum divalidasi oleh partisipasi volume pasar.
              </li>
            </ol>
          </div>

          {/* SECTION 6: MODUL 5 - NEWS ENGINE */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs font-mono uppercase text-emerald-400 flex items-center gap-2">
              <span>📰</span> Modul 5: Agregator Berita Finansial
            </h4>
            <p className="text-neutral-400 text-[11px]">Mengagregasi 50+ artikel berita harian dari sumber RSS terpercaya lengkap dengan sistem filter kategori dan pencarian kata kunci.</p>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="border-t border-neutral-800 p-4 bg-neutral-950 flex items-center justify-between text-[11px] font-mono shrink-0">
          <span className="text-neutral-500">MapIDX Engine v2.5</span>
          <button onClick={onClose} className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-extrabold px-5 py-1.5 rounded-lg transition cursor-pointer">
            Tutup Panel
          </button>
        </div>
      </div>
    </div>
  );
}
