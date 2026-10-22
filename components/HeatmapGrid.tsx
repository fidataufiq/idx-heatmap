"use client";

import Link from "next/link";
import { Stock } from "@/types/stock";

interface HeatmapGridProps {
  stocks: Stock[];
}

export default function HeatmapGrid({ stocks }: HeatmapGridProps) {
  if (!stocks || stocks.length === 0) {
    return (
      <div className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl p-8 text-center text-neutral-400">
        <p className="text-sm">Tidak ada data saham yang tersedia untuk ditampilkan.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Grid Container Responsif & Seimbang */}
      <div className="grid grid-cols-2 min-[400px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
        {stocks.map((stock) => {
          const isPositive = stock.change >= 0;

          return (
            <Link
              key={stock.symbol}
              href={`/stock/${stock.symbol}`}
              className={`group relative flex flex-col justify-between rounded-xl p-2.5 sm:p-3 border transition-all duration-200 hover:scale-[1.01] hover:z-10 backdrop-blur-md ${
                isPositive ? "bg-emerald-950/25 border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-950/40" : "bg-rose-950/25 border-rose-500/30 hover:border-rose-500/60 hover:bg-rose-950/40"
              }`}
            >
              {/* Badge Editor's Pick */}
              {stock.isEditorPick && <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-neutral-950 font-mono font-bold text-[8px] px-1.5 py-0.2 rounded-full shadow z-10">PICK</span>}

              {/* Header Card: Kode Saham & Persentase Perubahan */}
              <div className="flex items-center justify-between gap-1 w-full">
                {/* Kode Saham: Ukuran Seimbang & Proporsional */}
                <span className="font-mono font-extrabold text-xs sm:text-xs md:text-sm text-white tracking-tight whitespace-nowrap">{stock.symbol}</span>

                {/* Badge Persentase */}
                <span
                  className={`font-mono font-semibold text-[9px] sm:text-[10px] px-1 py-0.5 rounded leading-none whitespace-nowrap ${
                    isPositive ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/15 text-rose-400 border border-rose-500/20"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {stock.change.toFixed(1)}%
                </span>
              </div>

              {/* Body Card: Harga Terakhir & Nama Emiten */}
              <div className="mt-2 flex flex-col gap-0.5">
                <span className="font-mono font-bold text-[11px] sm:text-xs text-neutral-200">Rp {stock.price.toLocaleString("id-ID")}</span>

                <span className="text-[9px] sm:text-[10px] text-neutral-400/80 truncate font-sans group-hover:text-neutral-300 transition-colors">{stock.name}</span>
              </div>

              {/* Tooltip Hover Informasi Tambahan (Desktop Only) */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:md:block w-48 p-2.5 bg-neutral-950/95 border border-neutral-800 rounded-xl shadow-2xl backdrop-blur-md z-30 pointer-events-none text-[10px] text-neutral-300 space-y-1">
                <div className="flex justify-between font-bold text-white border-b border-neutral-800/80 pb-1 font-mono">
                  <span>{stock.symbol}</span>
                  <span className={isPositive ? "text-emerald-400" : "text-rose-400"}>
                    {isPositive ? "+" : ""}
                    {stock.change.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Sektor:</span>
                  <span className="text-white font-medium truncate max-w-[90px]">{stock.sector || "IDX"}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Volume:</span>
                  <span className="text-white font-medium font-mono">{(stock.volume / 1000000).toFixed(1)}M</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
