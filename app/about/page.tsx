import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex flex-col flex-1 w-full min-h-screen bg-neutral-950 text-neutral-200 font-mono selection:bg-emerald-500 selection:text-black relative overflow-x-hidden">
      {/* Background Cyber Glow & Ambient Grids */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

      {/* Sub-Header Navigasi Sticky */}
      <div className="sticky top-12 z-40 border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md px-4 sm:px-6 py-2.5 flex items-center justify-between w-full">
        <Link href="/" className="text-neutral-400 hover:text-emerald-400 text-xs transition flex items-center gap-1.5 group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Kembali ke Heatmap
        </Link>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase bg-emerald-950/50 px-2.5 py-0.5 rounded border border-emerald-500/30">SECURE_NODE // SYS_ABOUT</span>
        </div>
      </div>

      {/* Main Content Area - Full Width without Screen Margins */}
      <main className="w-full py-6 md:py-8 flex-1 flex flex-col gap-4 relative z-10">
        {/* Visual Hero Section - Seamless Full-Width Container */}
        <div className="relative overflow-hidden bg-neutral-900/30 border-y border-neutral-800/80 px-4 sm:px-8 py-8 sm:py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 backdrop-blur-sm">
          <div className="relative z-10 max-w-3xl space-y-3.5">
            <div className="inline-flex items-center gap-2.5 bg-neutral-900/80 text-neutral-300 text-[10px] font-bold px-3 py-1 rounded-full border border-neutral-800">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              PROYEKSI TELEMETRI PASAR SAHAM
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Evolusi Visualisasi Pasar <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Tanpa Batas</span>
            </h1>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans max-w-2xl">
              <span className="text-white font-mono font-bold">MapIDX</span> dirancang bukan sekadar terminal, melainkan instrumen pemantauan tingkat institusional yang membedah arus modal, sentimen konglomerasi, dan struktur emiten BEI
              secara <span className="text-emerald-400 font-mono">real-time</span> dalam satu layar berdensitas tinggi.
            </p>
          </div>

          {/* Logo Badge Card dengan Efek Radar Sederhana */}
          <div className="relative shrink-0 self-center md:self-auto group">
            <div className="absolute -inset-2 rounded-2xl bg-emerald-500/10 blur-xl opacity-75 animate-pulse"></div>
            <div className="relative h-28 w-28 sm:h-32 sm:w-32 bg-neutral-950/90 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-2xl backdrop-blur-md transition-all">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black text-sm">⚡</div>
              <span className="font-bold text-sm text-white tracking-wider mt-1">
                Map<span className="text-emerald-400">IDX</span>
              </span>
              <span className="text-[9px] text-neutral-500 font-mono tracking-widest bg-neutral-900 px-2 py-0.5 rounded">CORE v2.8</span>
            </div>
          </div>
        </div>

        {/* Section: Dual Card - Simple Borderless Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 sm:px-6">
          {/* Card: Misi */}
          <div className="bg-neutral-900/30 rounded-2xl p-6 flex flex-col justify-between transition-colors hover:bg-neutral-900/40 space-y-4">
            <div className="space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-sm font-bold">🎯</div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">Misi & Integritas Data</h2>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Dibangun atas prinsip transparansi mutlak. Menolak keras penggunaan data tiruan (<span className="text-neutral-200">mockup</span>) pada instrumen vital, memastikan setiap angka persentase, matriks konglomerat, dan pergerakan
                emiten ditarik murni langsung dari bursa.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-800/60 flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
              >
                <span>💻 Repository</span> ↗
              </a>
              <a href="https://saweria.co" target="_blank" rel="noopener noreferrer" className="bg-emerald-950/40 hover:bg-emerald-950/70 text-emerald-400 text-[11px] font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5">
                <span>☕ Dukung Sistem</span>
              </a>
            </div>
          </div>

          {/* Card: Filosofi */}
          <div className="bg-neutral-900/30 rounded-2xl p-6 flex flex-col justify-between transition-colors hover:bg-neutral-900/40 space-y-4">
            <div className="space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 text-sm font-bold">👁️</div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">Filosofi Vercel-Monochrome</h2>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Terinspirasi oleh standar terminal profesional. Mengadopsi tata letak tingkat lanjut dengan kontras senyap, meminimalisir gangguan visual agar trader dapat fokus mengambil keputusan secara cepat dan presisi.
              </p>
            </div>
            <div className="pt-4 border-t border-neutral-800/60 text-[10px] text-neutral-500 flex items-center justify-between">
              <span>Single-viewport Density</span>
              <span className="text-emerald-400 font-bold">● Optimized</span>
            </div>
          </div>
        </div>

        {/* Section: Arsitektur Stack (Borderless Grid Card) */}
        <div className="px-4 sm:px-6 pt-2">
          <div className="bg-neutral-900/30 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="text-emerald-400">⚙️</span> Tumpukan Teknologi Sistem
              </h2>
              <span className="text-[10px] text-neutral-500">Stack Terverifikasi</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="p-3.5 bg-neutral-950/60 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-400">FRAMEWORK</span>
                  <span className="text-xs">⚡</span>
                </div>
                <div className="text-xs font-bold text-white">Next.js App Router</div>
                <div className="text-[10px] text-neutral-500">TypeScript & Server Components</div>
              </div>

              <div className="p-3.5 bg-neutral-950/60 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-400">STYLING</span>
                  <span className="text-xs">🎨</span>
                </div>
                <div className="text-xs font-bold text-white">Tailwind CSS</div>
                <div className="text-[10px] text-neutral-500">Monochrome Dark Precision</div>
              </div>

              <div className="p-3.5 bg-neutral-950/60 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-400">DATA FEED</span>
                  <span className="text-xs">📡</span>
                </div>
                <div className="text-xs font-bold text-white">IDX Live Engine</div>
                <div className="text-[10px] text-neutral-500">Real-time telemetry feed</div>
              </div>

              <div className="p-3.5 bg-neutral-950/60 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-400">ANALYTICS</span>
                  <span className="text-xs">🏛️</span>
                </div>
                <div className="text-xs font-bold text-white">Conglomerate Matrix</div>
                <div className="text-[10px] text-neutral-500">Barito, Djarum, Salim, Astra, dll</div>
              </div>

              <div className="p-3.5 bg-neutral-950/60 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-400">AI ASSISTANT</span>
                  <span className="text-xs">🤖</span>
                </div>
                <div className="text-xs font-bold text-white">Google Gemini Agent</div>
                <div className="text-[10px] text-neutral-500">Collaborative Engineering</div>
              </div>

              <div className="p-3.5 bg-neutral-950/60 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-400">INFRASTRUCTURE</span>
                  <span className="text-xs">☁️</span>
                </div>
                <div className="text-xs font-bold text-white">Vercel Edge Platform</div>
                <div className="text-[10px] text-neutral-500">Global Low Latency Cloud</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
