"use client";

import { useEffect, useState, useMemo } from "react";
import { Stock } from "@/types/stock";
import StockCard from "@/components/StockCard";
import StockScreener from "@/components/StockScreener";
import StockComparer from "@/components/StockComparer";
import StockSignals from "@/components/StockSignals"; // 1. Impor komponen Sinyal

const QUICK_FILTERS = [
  "All",
  "🔥 Top Gainers",
  "❄️ Top Losers",
  "⚡ Most Active",
  "⭐ Pilihan Editor",
  "Financials",
  "Energy & Mining",
  "Infrastructure & Telco",
  "Consumer & Health",
  "Retail & Automotive",
  "Technology & Digital",
  "Property & Real Estate",
  "Basic Materials & Industrial",
];

export default function Home() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"marketCap" | "change" | "volume">("marketCap");
  const [viewMode, setViewMode] = useState<"heatmap" | "screener" | "komparasi" | "signals">("heatmap"); // 2. Tambah mode signals

  useEffect(() => {
    async function fetchStocks() {
      try {
        const res = await fetch("/api/stocks");
        const json = await res.json();
        if (json.success) setStocks(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStocks();
  }, []);

  const filteredAndSortedStocks = useMemo(() => {
    const result = stocks.filter((s) => {
      const matchesSearch = s.symbol.toLowerCase().includes(search.toLowerCase()) || s.name.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedFilter === "🔥 Top Gainers") return s.change > 0;
      if (selectedFilter === "❄️ Top Losers") return s.change < 0;
      if (selectedFilter === "⚡ Most Active") return s.volume > 0;
      if (selectedFilter === "⭐ Pilihan Editor") return !!s.isEditorPick;
      if (selectedFilter !== "All") return s.sector === selectedFilter;

      return true;
    });

    return result.sort((a, b) => {
      if (selectedFilter === "🔥 Top Gainers") return b.change - a.change;
      if (selectedFilter === "❄️ Top Losers") return a.change - b.change;
      if (selectedFilter === "⚡ Most Active") return b.volume - a.volume;

      if (sortBy === "marketCap") return b.marketCap - a.marketCap;
      if (sortBy === "change") return b.change - a.change;
      return b.volume - a.volume;
    });
  }, [stocks, search, selectedFilter, sortBy]);

  return (
    <div className="flex flex-col flex-1 w-full bg-neutral-950 text-white selection:bg-neutral-800 selection:text-white font-mono">
      {/* Sub-Header Navigasi Sticky dengan 4 Mode */}
      <div className="sticky top-12 z-40 border-b border-neutral-800 bg-neutral-950 px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        {/* Switcher 4 Mode Display */}
        <div className="flex items-center gap-1 bg-neutral-900 p-0.5 rounded border border-neutral-800 overflow-x-auto">
          <button
            onClick={() => setViewMode("heatmap")}
            className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition cursor-pointer whitespace-nowrap ${
              viewMode === "heatmap" ? "bg-neutral-800 text-white shadow-sm border border-neutral-700/60" : "text-neutral-400 hover:text-white"
            }`}
          >
            📊 Heatmap
          </button>
          <button
            onClick={() => setViewMode("screener")}
            className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition cursor-pointer whitespace-nowrap ${
              viewMode === "screener" ? "bg-neutral-800 text-white shadow-sm border border-neutral-700/60" : "text-neutral-400 hover:text-white"
            }`}
          >
            🎯 Screener
          </button>
          <button
            onClick={() => setViewMode("komparasi")}
            className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition cursor-pointer whitespace-nowrap ${
              viewMode === "komparasi" ? "bg-neutral-800 text-white shadow-sm border border-neutral-700/60" : "text-neutral-400 hover:text-white"
            }`}
          >
            ⚖️ Komparasi
          </button>
          <button
            onClick={() => setViewMode("signals")}
            className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition cursor-pointer whitespace-nowrap ${
              viewMode === "signals" ? "bg-neutral-800 text-white shadow-sm border border-neutral-700/60" : "text-neutral-400 hover:text-white"
            }`}
          >
            ⚡ Sinyal Pasar
          </button>
        </div>

        {/* Input Pencarian */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Cari emiten (BBCA)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 font-mono w-36 sm:w-48 transition"
          />
          {viewMode === "heatmap" && (
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "marketCap" | "change" | "volume")}
              className="bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-xs text-neutral-300 focus:outline-none focus:border-neutral-600 font-mono transition cursor-pointer"
            >
              <option value="marketCap">Market Cap</option>
              <option value="change">% Perubahan</option>
              <option value="volume">Volume</option>
            </select>
          )}
        </div>
      </div>

      {/* Quick Filters Khusus Heatmap */}
      {viewMode === "heatmap" && (
        <div className="px-3 sm:px-4 py-1.5 border-b border-neutral-800 bg-neutral-950 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
          {QUICK_FILTERS.map((filter) => {
            const isActive = selectedFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-2.5 py-0.5 rounded text-[11px] font-mono transition-all whitespace-nowrap border shrink-0 cursor-pointer ${
                  isActive ? "bg-neutral-100 text-neutral-950 font-bold border-neutral-100 shadow-sm" : "bg-neutral-900/80 text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-white"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 p-3 sm:p-4 overflow-y-auto">
        {loading ? (
          <div className="flex h-64 items-center justify-center flex-col gap-3 font-mono">
            <div className="w-5 h-5 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-neutral-400">Memuat data pasar saham Indonesia...</p>
          </div>
        ) : viewMode === "heatmap" ? (
          filteredAndSortedStocks.length === 0 ? (
            <div className="flex h-64 items-center justify-center flex-col gap-2 text-neutral-500 text-xs font-mono">
              <p>Tidak ada saham yang sesuai dengan filter atau pencarian.</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2 auto-rows-[78px]">
              {filteredAndSortedStocks.map((stock) => (
                <StockCard key={stock.symbol} stock={stock} />
              ))}
            </div>
          )
        ) : viewMode === "screener" ? (
          <StockScreener stocks={stocks} />
        ) : viewMode === "komparasi" ? (
          <StockComparer stocks={stocks} />
        ) : (
          <StockSignals stocks={stocks} />
        )}
      </div>
    </div>
  );
}
