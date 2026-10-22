import Link from "next/link";

// Konstanta statis untuk performa tinggi & kompatibel penuh Next.js 16 prerender
const CURRENT_YEAR = 2026;

export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-800 bg-neutral-950 py-2.5 px-3 sm:px-4 text-xs font-mono shrink-0">
      {/* Menggunakan w-full (tanpa max-w-7xl) agar mentok ke pojok kiri dan kanan */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Sisi Kiri Mentok: Branding & Copying */}
        <div className="flex items-center gap-2 text-[11px] text-neutral-400">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="font-bold text-white tracking-tight">MapIDX</span>
          </div>
          <span className="text-neutral-800">/</span>
          <span className="text-neutral-500 text-[10px]">Real-time Heatmap & Analytics • © {CURRENT_YEAR}</span>
        </div>

        {/* Sisi Kanan Mentok: Navigasi Tautan Terminal */}
        <div className="flex items-center gap-3 text-[10px] text-neutral-400">
          <Link href="/news" className="hover:text-white transition-colors">
            Berita
          </Link>
          <span className="text-neutral-800">•</span>
          <Link href="/about" className="hover:text-white transition-colors">
            Tentang
          </Link>
          <span className="text-neutral-800">•</span>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            GitHub
          </a>
          <span className="text-neutral-800">•</span>
          <a href="https://saweria.co" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors font-bold">
            Dukung
          </a>
        </div>
      </div>
    </footer>
  );
}
