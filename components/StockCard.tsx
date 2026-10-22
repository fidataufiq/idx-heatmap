"use client";

import Link from "next/link";
import { Stock } from "@/types/stock";

interface StockCardProps {
  stock: Stock;
}

export default function StockCard({ stock }: StockCardProps) {
  const isPositive = stock.change >= 0;

  return (
    <Link
      href={`/stock/${stock.symbol}`}
      className={`group relative flex flex-col justify-between rounded-lg p-1.5 sm:p-2.5 border transition-all duration-200 hover:scale-[1.02] hover:z-10 backdrop-blur-md shadow-sm overflow-hidden ${
        isPositive ? "bg-emerald-950/30 border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-950/50" : "bg-rose-950/30 border-rose-500/30 hover:border-rose-500/60 hover:bg-rose-950/50"
      }`}
    >
      {/* Badge Editor's Pick */}
      {stock.isEditorPick && <span className="absolute -top-1 -right-1 bg-amber-500 text-neutral-950 font-mono font-bold text-[7px] px-1 rounded-full z-10">★</span>}

      {/* Baris Atas: Kode Saham & Persentase Perubahan */}
      <div className="flex items-center justify-between gap-0.5 w-full">
        <span className="font-mono font-bold text-[11px] sm:text-xs text-white tracking-tight truncate">{stock.symbol}</span>

        <span
          className={`font-mono font-semibold text-[8px] sm:text-[10px] px-1 py-0.2 rounded leading-none whitespace-nowrap ${
            isPositive ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
          }`}
        >
          {isPositive ? "+" : ""}
          {stock.change.toFixed(1)}%
        </span>
      </div>

      {/* Baris Bawah: Harga & Nama Perusahaan */}
      <div className="mt-1 flex flex-col justify-end truncate">
        <span className="font-mono font-semibold text-[10px] sm:text-xs text-neutral-200 truncate">{stock.price > 10000 ? `${(stock.price / 1000).toFixed(0)}k` : stock.price.toLocaleString("id-ID")}</span>

        <span className="text-[8px] sm:text-[9px] text-neutral-400/80 truncate font-sans">{stock.name}</span>
      </div>
    </Link>
  );
}
