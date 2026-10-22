"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import HelpModal from "@/components/HelpModal";

export default function Header() {
  const pathname = usePathname();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-950 transition-all">
        <div className="w-full px-3 sm:px-4 h-12 flex items-center justify-between font-mono">
          {/* Sisi Kiri Mentok: Logo & Navigasi */}
          <div className="flex items-center gap-3">
            <Link href="/" className="group flex items-center gap-2 shrink-0 transition-transform active:scale-95">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/50 transition-all shadow-sm">
                <span className="font-black text-[10px] tracking-tighter">IDX</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xs tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  Map<span className="text-emerald-500">IDX</span>
                </span>
                <span className="text-[8px] font-semibold px-1 py-0.2 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">TERMINAL</span>
              </div>
            </Link>

            <div className="h-3.5 w-[1px] bg-neutral-800 shrink-0"></div>

            <nav className="flex items-center gap-1 bg-neutral-900 p-0.5 rounded border border-neutral-800">
              <Link
                href="/"
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                  pathname === "/" ? "bg-neutral-800 text-white shadow-sm border border-neutral-700" : "text-neutral-400 hover:text-white hover:bg-neutral-800/40"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${pathname === "/" ? "bg-emerald-400 animate-pulse" : "bg-neutral-600"}`}></span>
                Heatmap
              </Link>
              <Link
                href="/news"
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                  pathname === "/news" ? "bg-neutral-800 text-white shadow-sm border border-neutral-700" : "text-neutral-400 hover:text-white hover:bg-neutral-800/40"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${pathname === "/news" ? "bg-emerald-400 animate-pulse" : "bg-neutral-600"}`}></span>
                Berita
              </Link>
            </nav>
          </div>

          {/* Sisi Kanan Mentok: Status Live & Tombol Help ala Finviz */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Tombol Help */}
            <button
              onClick={() => setIsHelpOpen(true)}
              className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 px-2.5 py-0.5 rounded text-[11px] font-bold transition flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <span className="text-emerald-400 font-black">?</span>
              <span>Help</span>
            </button>

            {/* Indikator Status Pasar LIVE */}
            <div className="flex items-center gap-2 bg-emerald-950/30 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[9px] text-emerald-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="font-bold tracking-wider">LIVE</span>
            </div>
          </div>
        </div>
      </header>

      {/* Render Modal Bantuan */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
}
