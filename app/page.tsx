"use client";

import { useEffect, useState, useMemo } from "react";
import { Stock } from "@/types/stock";
import StockCard from "@/components/StockCard";
import Footer from "@/components/Footer"; // <-- Impor footer elegan

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
    <main className="h-screen bg-neutral-950 text-white flex flex-col overflow-hidden font-sans selection:bg-emerald-500 selection:text-neutral-950">
      {/* Top Navbar Minimalis & Elegan */}
      <header className="border-b border-neutral-800/80 bg-neutral-900/60 backdrop-blur-md px-6 py-3 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-500 font-black text-xs text-neutral-950 flex items-center justify-center shadow-lg shadow-emerald-500/20">IDX</div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white">Indonesia Market Heatmap</h1>
            <p className="text-[11px] text-neutral-400">Real-time IDX Stock Terminal</p>
          </div>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari kode atau nama saham..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded-lg pl-3 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 w-48 sm:w-60 transition"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "marketCap" | "change" | "volume")}
            className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-300 focus:outline-none focus:border-emerald-500 transition cursor-pointer"
          >
            <option value="marketCap">Urut: Market Cap</option>
            <option value="change">Urut: % Perubahan</option>
            <option value="volume">Urut: Volume</option>
          </select>
        </div>
      </header>

      {/* Filter Quick Pills Bar */}
      <div className="px-6 py-2.5 border-b border-neutral-800/80 bg-neutral-900/30 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
        {QUICK_FILTERS.map((filter) => {
          const isActive = selectedFilter === filter;
          let badgeStyle = "bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-white";

          if (isActive) {
            if (filter.includes("Gainers")) badgeStyle = "bg-emerald-500 text-neutral-950 font-bold border-emerald-500 shadow-md shadow-emerald-500/10";
            else if (filter.includes("Losers")) badgeStyle = "bg-rose-500 text-white font-bold border-rose-500 shadow-md shadow-rose-500/10";
            else if (filter.includes("Active")) badgeStyle = "bg-amber-400 text-neutral-950 font-bold border-amber-400 shadow-md shadow-amber-400/10";
            else if (filter.includes("Editor")) badgeStyle = "bg-purple-500 text-white font-bold border-purple-500 shadow-md shadow-purple-500/10";
            else badgeStyle = "bg-emerald-500 text-neutral-950 font-bold border-emerald-500 shadow-md shadow-emerald-500/10";
          }

          return (
            <button key={filter} onClick={() => setSelectedFilter(filter)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap border ${badgeStyle}`}>
              {filter}
            </button>
          );
        })}
      </div>

      {/* Canvas Heatmap Grid View */}
      <div className="flex-1 p-3 md:p-4 overflow-y-auto">
        {loading ? (
          <div className="flex h-full items-center justify-center flex-col gap-3">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-neutral-400">Memuat data pasar saham Indonesia...</p>
          </div>
        ) : filteredAndSortedStocks.length === 0 ? (
          <div className="flex h-full items-center justify-center flex-col gap-2 text-neutral-500 text-xs">
            <p>Tidak ada saham yang sesuai dengan filter atau pencarian.</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2 auto-rows-[78px]">
            {filteredAndSortedStocks.map((stock) => (
              <StockCard key={stock.symbol} stock={stock} />
            ))}
          </div>
        )}
      </div>

      {/* Footer Elegan */}
      <Footer />
    </main>
  );
}
