"use client";

import { useState } from "react";
import Link from "next/link";
import { Stock } from "@/types/stock";
import { getHeatmapColor, formatCurrency } from "@/utils/formatters";

interface StockCardProps {
  stock: Stock;
}

export default function StockCard({ stock }: StockCardProps) {
  const isPositive = stock.change >= 0;
  const [imgError, setImgError] = useState(false);

  // Bersihkan simbol untuk URL logo (contoh: BBCA.JK -> bbca)
  const cleanSymbol = stock.symbol.replace(".JK", "").toLowerCase();

  // Sumber logo publik menggunakan Clearbit atau fallback domain perusahaan
  const logoUrl = `https://logo.clearbit.com/${cleanSymbol}.co.id`;

  return (
    <Link
      href={`/stock/${stock.symbol}`}
      title={`${stock.name} (${stock.symbol})\nHarga: Rp ${stock.price.toLocaleString("id-ID")}\nPerubahan: ${isPositive ? "+" : ""}${stock.change.toFixed(2)}%\nSektor: ${stock.sector}`}
      className={`border rounded-lg p-2 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-xs hover:scale-[1.02] hover:border-neutral-500 overflow-hidden ${getHeatmapColor(stock.change)}`}
    >
      {/* Baris Atas: Logo / Inisial & Simbol */}
      <div className="flex justify-between items-center leading-tight">
        <div className="flex items-center gap-1.5 overflow-hidden">
          {!imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={stock.symbol} onError={() => setImgError(true)} className="w-4 h-4 rounded-full object-contain bg-white/10 shrink-0" />
          ) : (
            <div className="w-4 h-4 rounded-full bg-neutral-900/60 text-[9px] font-bold text-neutral-300 flex items-center justify-center shrink-0">{stock.symbol.charAt(0)}</div>
          )}
          <span className="font-bold text-xs tracking-tight truncate text-white">{stock.symbol}</span>
        </div>

        <span className="text-[10px] font-semibold tracking-tight shrink-0">
          {isPositive ? "+" : ""}
          {stock.change.toFixed(1)}%
        </span>
      </div>

      {/* Bagian Tengah: Harga Saham */}
      <div className="text-center my-auto">
        <p className="text-[11px] font-bold tracking-tight text-white/95">Rp {formatCurrency(stock.price)}</p>
      </div>

      {/* Bagian Bawah: Sektor Singkat */}
      <div className="text-[8px] text-neutral-300/80 truncate text-center font-medium">{stock.sector.split(" ")[0]}</div>
    </Link>
  );
}
