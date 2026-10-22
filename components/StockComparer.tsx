"use client";

import { useState } from "react";
import Link from "next/link";
import { Stock } from "@/types/stock";

interface StockComparerProps {
  stocks: Stock[];
}

export default function StockComparer({ stocks }: StockComparerProps) {
  // Default membandingkan 3 emiten perbankan raksasa
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>(["BBCA", "BBRI", "BMRI"]);
  const [searchQuery, setSearchQuery] = useState("");

  const addSymbol = (symbol: string) => {
    if (selectedSymbols.length < 4 && !selectedSymbols.includes(symbol)) {
      setSelectedSymbols([...selectedSymbols, symbol]);
    }
  };

  const removeSymbol = (symbol: string) => {
    if (selectedSymbols.length > 1) {
      setSelectedSymbols(selectedSymbols.filter((s) => s !== symbol));
    }
  };

  const comparedStocks = selectedSymbols.map((sym) => stocks.find((s) => s.symbol === sym)).filter((s): s is Stock => s !== undefined);

  const availableStocks = stocks.filter((s) => !selectedSymbols.includes(s.symbol) && (s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || s.name.toLowerCase().includes(searchQuery.toLowerCase())));

  return (
    <div className="w-full font-mono flex flex-col gap-4 text-xs">
      {/* Control Panel Atas */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-3.5 sm:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg">
        <div>
          <h3 className="font-bold text-white text-xs flex items-center gap-1.5 uppercase tracking-wider">
            <span>⚖️</span> Professional Head-to-Head Terminal Matrix
          </h3>
          <p className="text-[10px] text-neutral-400 font-sans mt-0.5">Analisis komparatif mendalam mencakup valuasi, dividen, kapitalisasi, dan rentang harga 52 minggu.</p>
        </div>

        {/* Kotak Pencarian Tambah Emiten */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Tambah emiten (mis. TLKM)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={selectedSymbols.length >= 4}
            className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 disabled:opacity-50"
          />
          {searchQuery && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-neutral-950 border border-neutral-800 rounded-lg shadow-2xl z-50 max-h-48 overflow-y-auto divide-y divide-neutral-800">
              {availableStocks.slice(0, 5).map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => {
                    addSymbol(stock.symbol);
                    setSearchQuery("");
                  }}
                  className="w-full text-left p-2 hover:bg-neutral-900 flex items-center justify-between"
                >
                  <span className="font-bold text-white">{stock.symbol}</span>
                  <span className="text-[10px] text-neutral-400 truncate max-w-[120px]">{stock.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Selected Emiten Pills Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Emiten Dibandingkan:</span>
        {selectedSymbols.map((sym) => (
          <div key={sym} className="bg-neutral-900 border border-neutral-700 text-white px-3 py-1 rounded-md flex items-center gap-2 text-xs font-bold shadow-sm">
            <span>{sym}</span>
            {selectedSymbols.length > 1 && (
              <button onClick={() => removeSymbol(sym)} className="text-neutral-500 hover:text-rose-400 transition cursor-pointer">
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Side-by-Side Professional Terminal Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {comparedStocks.map((stock) => {
          // Hitung posisi harga saat ini terhadap rentang 52 Minggu
          const high52 = stock.fiftyTwoWeekHigh || stock.price * 1.2;
          const low52 = stock.fiftyTwoWeekLow || stock.price * 0.8;
          const rangePosition = Math.min(Math.max(((stock.price - low52) / (high52 - low52)) * 100, 0), 100);

          return (
            <div key={stock.symbol} className="bg-neutral-950 border border-neutral-800 hover:border-neutral-700 rounded-xl p-4 flex flex-col justify-between gap-4 transition shadow-2xl relative overflow-hidden group">
              {/* Garis Aksen Terminal Glow */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>

              {/* 1. Identitas Emiten */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-black text-white tracking-wider font-mono">{stock.symbol}</span>
                  {selectedSymbols.length > 1 && (
                    <button onClick={() => removeSymbol(stock.symbol)} className="text-neutral-500 hover:text-rose-400 text-[10px] cursor-pointer font-mono">
                      Tutup
                    </button>
                  )}
                </div>
                <div className="text-[11px] text-neutral-300 font-sans font-medium truncate">{stock.name}</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[9px] text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800 font-mono">{stock.sector}</span>
                  {stock.isEditorPick && <span className="text-[9px] text-amber-400 bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-500/30 font-mono">★ Pilihan</span>}
                </div>
              </div>

              {/* 2. Harga Terkini & Perubahan */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-lg p-3 space-y-1">
                <div className="text-[10px] text-neutral-400">Harga Terkini</div>
                <div className="flex items-baseline justify-between font-mono">
                  <span className="text-base font-bold text-white">Rp {stock.price.toLocaleString("id-ID")}</span>
                  <span className={`text-xs font-bold ${stock.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {stock.change >= 0 ? "+" : ""}
                    {stock.change.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* 3. Metrik Valuasi & Fundamental Utama */}
              <div className="space-y-2 text-[11px] font-mono">
                <div className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider border-b border-neutral-900 pb-1">Valuasi & Imbal Hasil</div>

                <div className="flex items-center justify-between py-0.5">
                  <span className="text-neutral-400">PER (Trailing):</span>
                  <span className="font-bold text-white">{stock.trailingPE ? `${stock.trailingPE.toFixed(2)}x` : "N/A"}</span>
                </div>

                <div className="flex items-center justify-between py-0.5">
                  <span className="text-neutral-400">PBV (Book Value):</span>
                  <span className="font-bold text-white">{stock.priceToBook ? `${stock.priceToBook.toFixed(2)}x` : "N/A"}</span>
                </div>

                <div className="flex items-center justify-between py-0.5">
                  <span className="text-neutral-400">Dividend Yield:</span>
                  <span className="font-bold text-emerald-400">{stock.dividendYield ? `${(stock.dividendYield * 100).toFixed(2)}%` : "0.00%"}</span>
                </div>

                <div className="flex items-center justify-between py-0.5">
                  <span className="text-neutral-400">Market Cap:</span>
                  <span className="font-semibold text-neutral-300">Rp {(stock.marketCap / 1e9).toLocaleString("id-ID", { maximumFractionDigits: 0 })} M</span>
                </div>

                <div className="flex items-center justify-between py-0.5">
                  <span className="text-neutral-400">Volume Transaksi:</span>
                  <span className="font-semibold text-neutral-300">{stock.volume ? stock.volume.toLocaleString("id-ID") : "-"}</span>
                </div>
              </div>

              {/* 4. Rentang Posisi Harga 52 Minggu (Visual Bar) */}
              <div className="space-y-1.5 pt-2 border-t border-neutral-900 font-mono">
                <div className="flex justify-between text-[10px] text-neutral-400">
                  <span>Low: Rp {low52.toLocaleString("id-ID", { maximumFractionDigits: 0 })}</span>
                  <span>High: Rp {high52.toLocaleString("id-ID", { maximumFractionDigits: 0 })}</span>
                </div>
                {/* Progress Bar Range 52W */}
                <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden border border-neutral-800">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${rangePosition}%` }}></div>
                </div>
                <div className="text-[9px] text-neutral-500 text-right">
                  Posisi dalam rentang 52W: <strong className="text-neutral-300">{rangePosition.toFixed(0)}%</strong>
                </div>
              </div>

              {/* Tombol Aksi Menuju Lembar Detail Lengkap */}
              <Link href={`/stock/${stock.symbol}`} className="w-full mt-1 bg-neutral-900 hover:bg-neutral-800 text-emerald-400 border border-neutral-800 py-2 rounded-lg text-center text-[11px] font-bold transition block font-mono">
                Analisis & Berita Detail ↗
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
