import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex flex-col flex-1 w-full bg-neutral-950 text-white font-mono selection:bg-neutral-800 selection:text-white">
      {/* Sub-Header Navigasi Sticky (Menempel di bawah Header Global) */}
      <div className="sticky top-12 z-40 border-b border-neutral-800 bg-neutral-950 px-3 sm:px-4 py-2 flex items-center justify-between">
        <Link href="/" className="text-neutral-400 hover:text-white text-xs transition flex items-center gap-1.5">
          ← Kembali ke Heatmap
        </Link>
        <div className="text-[10px] text-neutral-400 bg-neutral-900 px-2.5 py-0.5 rounded border border-neutral-800">Tentang Proyek & Sistem</div>
      </div>

      {/* Main Content Area */}
      <main className="w-full px-3 sm:px-4 py-6 md:py-8 flex-1 flex flex-col gap-6">
        {/* Visual Hero Section dengan Logo Glow Animasi */}
        <div className="relative overflow-hidden bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Latar Belakang Decorative Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              IDX Market Heatmap Terminal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Sistem Visualisasi Saham Real-Time</h1>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans">
              MapIDX adalah terminal analitik saham Indonesia berbasis web dengan antarmuka <span className="text-white font-mono font-semibold">High-Density Grid</span>. Dirancang untuk memberikan proyeksi pergerakan pasar saham secara
              instan, intuitif, dan responsif dalam satu panel layar tanpa hambatan.
            </p>
          </div>

          {/* Logo Badge Card dengan Animasi Pulse Glow */}
          <div className="relative shrink-0 self-center md:self-auto">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur-lg opacity-75 animate-pulse"></div>
            <div className="relative h-24 w-24 sm:h-28 sm:w-28 bg-neutral-950 border border-neutral-800 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-2xl">
              <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black text-sm shadow-sm">IDX</div>
              <span className="font-bold text-xs text-white tracking-wider mt-1">
                Map<span className="text-emerald-500">IDX</span>
              </span>
              <span className="text-[8px] text-neutral-500">v1.0.0 PRO</span>
            </div>
          </div>
        </div>

        {/* Section: Pengembang & Inspirasi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card: Pengembang & Misi */}
          <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-5 flex flex-col justify-between hover:border-neutral-700 transition">
            <div>
              <h2 className="text-xs font-bold text-white mb-2 flex items-center gap-2 uppercase tracking-wider">
                <span className="text-emerald-400">⚡</span> Misi Pengembangan
              </h2>
              <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                Dikembangkan secara independen dengan fokus pada penyajian data finansial yang bersih, ultra-cepat, dan terstruktur. Misi utama proyek ini adalah menghadirkan terminal visualisasi pasar saham yang dapat diakses dengan mudah
                oleh investor dan trader ritel Indonesia.
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-neutral-800/80 flex items-center gap-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-[11px] font-bold px-3 py-1.5 rounded border border-neutral-800 transition flex items-center gap-1.5"
              >
                <span>GitHub</span> ↗
              </a>
              <a
                href="https://saweria.co"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-950/40 hover:bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold px-3 py-1.5 rounded transition flex items-center gap-1.5"
              >
                <span>☕ Dukung Proyek</span>
              </a>
            </div>
          </div>

          {/* Card: Inspirasi UI */}
          <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-5 flex flex-col justify-between hover:border-neutral-700 transition">
            <div>
              <h2 className="text-xs font-bold text-white mb-2 flex items-center gap-2 uppercase tracking-wider">
                <span className="text-emerald-400">💡</span> Filosofi Desain
              </h2>
              <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                Terinspirasi oleh antarmuka finansial terkemuka dunia seperti <span className="text-white font-mono">TradingView Stock Heatmap</span> dan <span className="text-white font-mono">Finviz Market Map</span>. Mengadopsi bahasa
                desain <span className="text-white font-mono">Vercel Monochrome Precision</span> dengan kontras tajam, bebas ornamen berlebihan, dan responsif di semua perangkat.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-neutral-800/80 text-[10px] text-neutral-500">Optimalisasi kepadatan satu layar (*single-viewport high density*).</div>
          </div>
        </div>

        {/* Section: Arsitektur & Teknologi */}
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-5 sm:p-6 space-y-4">
          <h2 className="text-xs font-bold text-white border-b border-neutral-800 pb-2.5 flex items-center gap-2 uppercase tracking-wider">
            <span className="text-emerald-400">⚙️</span> Arsitektur & Perangkat Lunak
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="p-3 bg-neutral-950/80 border border-neutral-800/80 rounded-lg hover:border-neutral-700 transition">
              <div className="text-[10px] font-bold text-emerald-400 mb-0.5">Framework</div>
              <div className="text-xs font-bold text-white">Next.js (App Router)</div>
              <div className="text-[10px] text-neutral-500 mt-1">TypeScript & Server Components</div>
            </div>

            <div className="p-3 bg-neutral-950/80 border border-neutral-800/80 rounded-lg hover:border-neutral-700 transition">
              <div className="text-[10px] font-bold text-emerald-400 mb-0.5">Styling</div>
              <div className="text-xs font-bold text-white">Tailwind CSS</div>
              <div className="text-[10px] text-neutral-500 mt-1">High-density Monochrome Dark Theme</div>
            </div>

            <div className="p-3 bg-neutral-950/80 border border-neutral-800/80 rounded-lg hover:border-neutral-700 transition">
              <div className="text-[10px] font-bold text-emerald-400 mb-0.5">Market Data Engine</div>
              <div className="text-xs font-bold text-white">Yahoo Finance API</div>
              <div className="text-[10px] text-neutral-500 mt-1">Library `yahoo-finance2` + Node-Cache</div>
            </div>

            <div className="p-3 bg-neutral-950/80 border border-neutral-800/80 rounded-lg hover:border-neutral-700 transition">
              <div className="text-[10px] font-bold text-emerald-400 mb-0.5">Chart Engine</div>
              <div className="text-xs font-bold text-white">TradingView Widget</div>
              <div className="text-[10px] text-neutral-500 mt-1">Embed Interactive Charting</div>
            </div>

            <div className="p-3 bg-neutral-950/80 border border-neutral-800/80 rounded-lg hover:border-neutral-700 transition">
              <div className="text-[10px] font-bold text-emerald-400 mb-0.5">AI Coding Assistant</div>
              <div className="text-xs font-bold text-white">Google Gemini Agent</div>
              <div className="text-[10px] text-neutral-500 mt-1">Pengembangan & Pengujian Kode</div>
            </div>

            <div className="p-3 bg-neutral-950/80 border border-neutral-800/80 rounded-lg hover:border-neutral-700 transition">
              <div className="text-[10px] font-bold text-emerald-400 mb-0.5">Infrastructure</div>
              <div className="text-xs font-bold text-white">Vercel Platform</div>
              <div className="text-[10px] text-neutral-500 mt-1">Edge Deployment Global</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
