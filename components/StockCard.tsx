"use client";

import Link from "next/link";
import { Stock } from "@/types/stock";

interface StockCardProps {
  stock: Stock;
}

export default function StockCard({ stock }: StockCardProps) {
  const isPositive = stock.change >= 0;

  const formattedPrice = stock.price > 10000 ? `${(stock.price / 1000).toFixed(0)}k` : stock.price.toLocaleString("id-ID");

  return (
    <Link
      href={`/stock/${stock.symbol}`}
      className={`group relative flex flex-col justify-between rounded-lg p-2 sm:p-2.5 border transition-all duration-150 overflow-hidden ${
        isPositive ? "bg-emerald-950/15 border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-950/30" : "bg-rose-950/15 border-rose-500/30 hover:border-rose-500/60 hover:bg-rose-950/30"
      }`}
    >
      {/* Baris Atas: Kode Saham, Badge Bintang, & Persentase Perubahan */}
      <div className="flex items-center justify-between gap-1 w-full">
        <div className="flex items-center gap-1 shrink-0">
          <span className="font-mono font-bold text-xs sm:text-sm text-white tracking-tight shrink-0 group-hover:text-emerald-400 transition-colors">{stock.symbol}</span>

          {/* Badge Bintang Pilihan Editor */}
          {stock.isEditorPick && (
            <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 font-mono font-bold text-[8px] px-1 py-0.5 rounded shrink-0 leading-none shadow-sm" title="Editor's Pick">
              ★
            </span>
          )}
        </div>

        {/* Badge Persentase */}
        <span
          className={`font-mono font-bold text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded leading-none whitespace-nowrap shadow-sm shrink-0 ${
            isPositive ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
          }`}
        >
          {isPositive ? "+" : ""}
          {stock.change.toFixed(1)}%
        </span>
      </div>

      {/* Bagian Tengah: Harga Saham */}
      <div className="my-1 text-center">
        <span className="font-mono font-bold text-xs sm:text-sm text-neutral-100 tracking-tight">Rp {formattedPrice}</span>
      </div>

      {/* Baris Bawah: Nama Perusahaan */}
      <div className="text-center">
        <span className="text-[8px] sm:text-[9px] text-neutral-400 truncate font-sans block">{stock.name}</span>
      </div>
    </Link>
  );
}
