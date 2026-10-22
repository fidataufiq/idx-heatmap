"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Stock } from "@/types/stock";

interface StockScreenerProps {
  stocks: Stock[];
}

const PRESET_FILTERS = [
  { id: "all", label: "Semua Saham", desc: "Seluruh emiten terdaftar" },
  { id: "undervalued", label: "💎 Undervalued (Murah)", desc: "PBV < 1.0x & PER < 15x" },
  { id: "high_dividend", label: "💰 High Dividend", desc: "Dividend Yield > 4%" },
  { id: "big_cap", label: "🏛️ Big Cap Leaders", desc: "Market Cap > Rp 50 Triliun" },
  { id: "growth_gainers", label: "🚀 Momentum Gainers", desc: "Kenaikan Harian > 2%" },
];

export default function StockScreener({ stocks }: StockScreenerProps) {
  const [selectedPreset, setSelectedPreset] = useState("all");
  const [maxPBV, setMaxPBV] = useState<number>(3);
  const [maxPE, setMaxPE] = useState<number>(25);
  const [minYield, setMinYield] = useState<number>(0);
  const [minMarketCap, setMinMarketCap] = useState<number>(0); // Dalam Miliar

  // Filter Logika Dinamis
  const filteredStocks = useMemo(() => {
    return stocks.filter((stock) => {
      // 1. Preset Quick Selection
      if (selectedPreset === "undervalued") {
        if ((stock.priceToBook || 99) > 1.2 || (stock.trailingPE || 99) > 15) return false;
      } else if (selectedPreset === "high_dividend") {
        if ((stock.dividendYield || 0) * 100 < 4) return false;
      } else if (selectedPreset === "big_cap") {
        if (stock.marketCap / 1e9 < 50000) return false; // > 50 Triliun
      } else if (selectedPreset === "growth_gainers") {
        if (stock.change < 2) return false;
      }

      // 2. Custom Manual Sliders
      const pe = stock.trailingPE ?? 999;
      const pbv = stock.priceToBook ?? 999;
      const divYield = (stock.dividendYield || 0) * 100;
      const capInBillion = stock.marketCap / 1e9;

      if (pbv > maxPBV) return false;
      if (pe > maxPE) return false;
      if (divYield < minYield) return false;
      if (capInBillion < minMarketCap) return false;

      return true;
    });
  }, [stocks, selectedPreset, maxPBV, maxPE, minYield, minMarketCap]);

  return (
    <div className="w-full font-mono flex flex-col gap-4 text-xs">
      {/* Preset Strategy Buttons */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-3 sm:p-4">
        <span className="text-[10px] font-bold text-neutral-400 block mb-2 uppercase tracking-wider">🎯 Presets Strategi Screening</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {PRESET_FILTERS.map((preset) => {
            const isActive = selectedPreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => setSelectedPreset(preset.id)}
                className={`p-2.5 rounded-lg border text-left transition ${
                  isActive ? "bg-emerald-500/10 border-emerald-500/50 text-white shadow-sm" : "bg-neutral-950 border-neutral-800/80 text-neutral-400 hover:border-neutral-700 hover:text-white"
                }`}
              >
                <div className="font-bold text-[11px] truncate">{preset.label}</div>
                <div className="text-[9px] text-neutral-500 mt-0.5 truncate">{preset.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Manual Sliders Controller */}
      <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-3.5 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-neutral-400">Maksimal PBV:</span>
            <span className="font-bold text-emerald-400">{maxPBV}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="10"
            step="0.5"
            value={maxPBV}
            onChange={(e) => {
              setSelectedPreset("custom");
              setMaxPBV(parseFloat(e.target.value));
            }}
            className="w-full accent-emerald-500 bg-neutral-800 h-1 rounded cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-neutral-400">Maksimal PER:</span>
            <span className="font-bold text-emerald-400">{maxPE}x</span>
          </div>
          <input
            type="range"
            min="5"
            max="50"
            step="1"
            value={maxPE}
            onChange={(e) => {
              setSelectedPreset("custom");
              setMaxPE(parseInt(e.target.value));
            }}
            className="w-full accent-emerald-500 bg-neutral-800 h-1 rounded cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-neutral-400">Minimal Dividend Yield:</span>
            <span className="font-bold text-emerald-400">{minYield}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="12"
            step="0.5"
            value={minYield}
            onChange={(e) => {
              setSelectedPreset("custom");
              setMinYield(parseFloat(e.target.value));
            }}
            className="w-full accent-emerald-500 bg-neutral-800 h-1 rounded cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-neutral-400">Min. Market Cap:</span>
            <span className="font-bold text-emerald-400">Rp {minMarketCap}T</span>
          </div>
          <input
            type="range"
            min="0"
            max="100000"
            step="5000"
            value={minMarketCap}
            onChange={(e) => {
              setSelectedPreset("custom");
              setMinMarketCap(parseInt(e.target.value));
            }}
            className="w-full accent-emerald-500 bg-neutral-800 h-1 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between bg-neutral-950 px-3 py-1.5 border border-neutral-800 rounded-lg text-[10px] text-neutral-400">
        <span>
          Menampilkan <strong className="text-emerald-400">{filteredStocks.length}</strong> emiten lolos screening
        </span>
        <button
          onClick={() => {
            setSelectedPreset("all");
            setMaxPBV(10);
            setMaxPE(50);
            setMinYield(0);
            setMinMarketCap(0);
          }}
          className="text-neutral-400 hover:text-white underline"
        >
          Reset Filter
        </button>
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto border border-neutral-800 rounded-xl bg-neutral-900/30">
        <table className="w-full text-left border-collapse text-[11px]">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-950 text-neutral-400 uppercase text-[9px]">
              <th className="p-3">Emiten</th>
              <th className="p-3">Harga</th>
              <th className="p-3">Kenaikan</th>
              <th className="p-3">PER</th>
              <th className="p-3">PBV</th>
              <th className="p-3">Div Yield</th>
              <th className="p-3">Market Cap</th>
              <th className="p-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60 font-mono">
            {filteredStocks.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-neutral-500">
                  Tidak ada emiten yang memenuhi kriteria screening ini.
                </td>
              </tr>
            ) : (
              filteredStocks.map((stock) => (
                <tr key={stock.symbol} className="hover:bg-neutral-900/80 transition">
                  <td className="p-3">
                    <div className="font-bold text-white">{stock.symbol}</div>
                    <div className="text-[9px] text-neutral-400 truncate max-w-[140px]">{stock.name}</div>
                  </td>
                  <td className="p-3 font-semibold text-white">Rp {stock.price.toLocaleString("id-ID")}</td>
                  <td className="p-3">
                    <span className={`font-bold ${stock.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {stock.change >= 0 ? "+" : ""}
                      {stock.change.toFixed(2)}%
                    </span>
                  </td>
                  <td className="p-3 text-neutral-300">{stock.trailingPE ? `${stock.trailingPE.toFixed(2)}x` : "N/A"}</td>
                  <td className="p-3 text-neutral-300">{stock.priceToBook ? `${stock.priceToBook.toFixed(2)}x` : "N/A"}</td>
                  <td className="p-3 text-emerald-400 font-bold">{stock.dividendYield ? `${(stock.dividendYield * 100).toFixed(2)}%` : "-"}</td>
                  <td className="p-3 text-neutral-400">Rp {(stock.marketCap / 1e9).toFixed(1)} M</td>
                  <td className="p-3 text-right">
                    <Link href={`/stock/${stock.symbol}`} className="bg-neutral-800 hover:bg-neutral-700 text-emerald-400 border border-neutral-700 px-2.5 py-1 rounded text-[10px] transition font-bold">
                      Analisis ↗
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
