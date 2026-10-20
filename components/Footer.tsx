import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-800/80 bg-neutral-900/60 backdrop-blur-md px-6 py-4 text-xs text-neutral-400 shrink-0">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Branding & Status */}
        <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="font-bold text-neutral-200">MapIDX Terminal</span>
          </div>
          <span className="hidden sm:inline text-neutral-700">|</span>
          <span className="text-[11px] text-neutral-400">Real-time Heatmap & Analytics • © 2026</span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-4 text-[11px]">
          <Link href="/news" className="text-emerald-400 hover:text-emerald-300 transition font-medium flex items-center gap-1">
            <span>📰</span> Berita Saham
          </Link>
          <span className="text-neutral-700">•</span>
          <Link href="/about" className="hover:text-emerald-400 transition font-medium">
            Tentang Aplikasi
          </Link>
          <span className="text-neutral-700">•</span>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
            GitHub
          </a>
          <span className="text-neutral-700">•</span>
          <a href="https://saweria.co" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 transition font-medium">
            ☕ Traktir
          </a>
        </div>
      </div>
    </footer>
  );
}
