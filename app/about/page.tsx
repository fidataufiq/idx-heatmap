import Link from "next/link";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-between font-sans selection:bg-emerald-500 selection:text-neutral-950">
      {/* Header Navigation */}
      <header className="border-b border-neutral-800 bg-neutral-900/90 backdrop-blur px-6 py-4 flex items-center justify-between">
        <Link href="/" className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition">
          ← Kembali ke Heatmap
        </Link>
        <div className="text-xs text-neutral-400 bg-neutral-800/80 px-3 py-1 rounded-full border border-neutral-700">Tentang Proyek & Pengembang</div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-4xl w-full mx-auto p-6 md:p-10 flex flex-col gap-10 flex-1">
        {/* Title / Hero */}
        <div className="border-b border-neutral-800 pb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            IDX Market Heatmap Terminal
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3">Tentang Aplikasi</h1>
          <p className="text-sm md:text-base text-neutral-400 leading-relaxed max-w-2xl">
            Aplikasi heatmap saham Indonesia berbasis web dengan tampilan *High-Density Grid* ala TradingView, dirancang untuk memberikan gambaran cepat pergerakan pasar saham IDX secara real-time, intuitif, dan responsif.
          </p>
        </div>

        {/* Section: Pengembang & Inspirasi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <span>👨‍💻</span> Pengembang & Misi
              </h2>
              <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                Dikembangkan secara independen dengan fokus pada penyajian data finansial yang bersih, modern, dan bebas hambatan (*frictionless*). Misi utama proyek ini adalah menyediakan terminal analisis saham yang visual dan mudah
                diakses bagi investor serta trader ritel Indonesia.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition flex items-center gap-2 border border-neutral-700"
              >
                <span>GitHub Repository</span> ↗
              </a>
              <a
                href="https://saweria.co"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold px-3.5 py-2 rounded-xl transition flex items-center gap-2"
              >
                <span>☕ Traktir Kopi</span>
              </a>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <span>💡</span> Inspirasi Rancang Bangun
              </h2>
              <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                Terinspirasi langsung oleh antarmuka antarbangsa **TradingView Stock Heatmap** dan **Finviz Market Map**, digabungkan dengan tren desain dark-mode modern, minimalis, serta penataan metrik keuangan ala terminal finansial
                profesional.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-800/80 text-[11px] text-neutral-500">Desain mengutamakan efisiensi satu layar (*single-viewport density*) dan kecepatan muat data.</div>
          </div>
        </div>

        {/* Section: Teknologi & Stack */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 shadow-xl">
          <h2 className="text-base font-bold text-white mb-6 border-b border-neutral-800 pb-3 flex items-center gap-2">
            <span>⚙️</span> Arsitektur & Teknologi Terkait
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-neutral-950/60 border border-neutral-800/80 rounded-xl">
              <div className="text-xs font-bold text-emerald-400 mb-1">Framework & Runtime</div>
              <div className="text-sm font-semibold text-white">Next.js (App Router)</div>
              <div className="text-[11px] text-neutral-400 mt-1">TypeScript & Node.js runtime</div>
            </div>

            <div className="p-4 bg-neutral-950/60 border border-neutral-800/80 rounded-xl">
              <div className="text-xs font-bold text-emerald-400 mb-1">Styling & UI</div>
              <div className="text-sm font-semibold text-white">Tailwind CSS</div>
              <div className="text-[11px] text-neutral-400 mt-1">High-density Dark Mode UI</div>
            </div>

            <div className="p-4 bg-neutral-950/60 border border-neutral-800/80 rounded-xl">
              <div className="text-xs font-bold text-emerald-400 mb-1">Sumber Data Finansial</div>
              <div className="text-sm font-semibold text-white">Yahoo Finance API</div>
              <div className="text-[11px] text-neutral-400 mt-1">Lib `yahoo-finance2` v3</div>
            </div>

            <div className="p-4 bg-neutral-950/60 border border-neutral-800/80 rounded-xl">
              <div className="text-xs font-bold text-emerald-400 mb-1">Visualisasi Interactive Chart</div>
              <div className="text-sm font-semibold text-white">TradingView Widget</div>
              <div className="text-[11px] text-neutral-400 mt-1">Embed Widget Iframe Real-time</div>
            </div>

            <div className="p-4 bg-neutral-950/60 border border-neutral-800/80 rounded-xl">
              <div className="text-xs font-bold text-emerald-400 mb-1">AI Assistant & Pair Programming</div>
              <div className="text-sm font-semibold text-white">Google Gemini Agent</div>
              <div className="text-[11px] text-neutral-400 mt-1">Pengembangan kode & debug</div>
            </div>

            <div className="p-4 bg-neutral-950/60 border border-neutral-800/80 rounded-xl">
              <div className="text-xs font-bold text-emerald-400 mb-1">Infrastruktur & Deploy</div>
              <div className="text-sm font-semibold text-white">Vercel Edge Platform</div>
              <div className="text-[11px] text-neutral-400 mt-1">Automated Global Deployment</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}
