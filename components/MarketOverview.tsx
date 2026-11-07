"use client";

import { useMemo, useState } from "react";
import { Stock } from "@/types/stock";

interface MarketOverviewProps {
  stocks: Stock[];
}

// 🏛️ Pemetaan Saham Berdasarkan Grup Konglomerasi Utama Indonesia
const CONGLOMERATE_GROUPS: { [groupName: string]: string[] } = {
  "Grup Barito (Prajogo Pangestu)": ["BREN", "TPIA", "BRPT", "CUAN", "PTRO"],
  "Grup Djarum (Hartono)": ["BBCA", "TOWR", "BELI", "RANC"],
  "Grup Salim": ["INDF", "ICBP", "AMMN", "LSIP", "SIMP", "META", "IMAS"],
  "Grup Astra (Jardine)": ["ASII", "UNTR", "AALI", "AUTO", "BNLI", "ASGR"],
  "Grup Adaro (Boy Thohir)": ["ADRO", "ADMR", "MBMA", "BESS"],
  "BUMN & Anak Usaha": ["BBRI", "BMRI", "BBNI", "TLKM", "PGAS", "PTBA", "ANTM", "TINS", "JSMR", "KAEF"],
  "Grup Bakrie": ["BUMI", "BRMS", "ENRG", "VKTR", "BNBR", "MDLN"],
  "Grup Sinarmas": ["INKP", "TKIM", "BSDE", "DSSA", "SMAR", "FREN"],
};

// 📰 Berita Singkat / Mini Flash Khusus Grup Konglomerat
const CONGLOMERATE_NEWS_FLASH = [
  { group: "Grup Barito", title: "Ekspansi kapasitas energi terbarukan dan energi hijau dorong akumulasi volume beli asing.", time: "10m lalu" },
  { group: "Grup Djarum", title: "BBCA catat pertumbuhan transaksi digital stabil di tengah ketatnya likuiditas perbankan.", time: "25m lalu" },
  { group: "Grup Salim", title: "Konsolidasi sektor hilirisasi pangan & komoditas pertahanan margin laba di kuartal berjalan.", time: "42m lalu" },
  { group: "Grup Astra", title: "Penjualan segmen otomotif roda empat dan alat berat (UNTR) pertahankan tren positif.", time: "1h lalu" },
  { group: "Grup Adaro", title: "Diversifikasi bisnis mineral hijau dan energi bersih terus dipercepat oleh manajemen.", time: "2h lalu" },
  { group: "BUMN & Anak Usaha", title: "Sektor perbankan pelat merah catat inflow stabil jelang rilis data pembagian dividen.", time: "3h lalu" },
];

export default function MarketOverview({ stocks }: MarketOverviewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");

  // Telemetri Sentimen Pasar BEI Real-Time
  const advancing = useMemo(() => stocks.filter((s) => s.change > 0), [stocks]);
  const declining = useMemo(() => stocks.filter((s) => s.change < 0), [stocks]);
  const unchanged = useMemo(() => stocks.filter((s) => s.change === 0), [stocks]);
  const totalStocks = stocks.length || 1;
  const bullRatio = Math.round((advancing.length / totalStocks) * 100);

  // Kalkulasi Performa Sektor Industri
  const sectorAnalytics = useMemo(() => {
    const map: {
      [key: string]: {
        totalChange: number;
        count: number;
        advancing: number;
        declining: number;
      };
    } = {};

    stocks.forEach((s) => {
      if (!map[s.sector]) {
        map[s.sector] = { totalChange: 0, count: 0, advancing: 0, declining: 0 };
      }
      map[s.sector].totalChange += s.change;
      map[s.sector].count += 1;
      if (s.change > 0) map[s.sector].advancing += 1;
      if (s.change < 0) map[s.sector].declining += 1;
    });

    return Object.keys(map)
      .map((sector) => ({
        sector,
        avgChange: map[sector].totalChange / map[sector].count,
        totalStocks: map[sector].count,
        advancing: map[sector].advancing,
        declining: map[sector].declining,
      }))
      .sort((a, b) => b.avgChange - a.avgChange);
  }, [stocks]);

  // Kalkulasi Performa per Grup Konglomerat
  const conglomerateMatrix = useMemo(() => {
    return Object.entries(CONGLOMERATE_GROUPS).map(([groupName, symbols]) => {
      const groupStocks = stocks.filter((s) => symbols.includes(s.symbol));
      const totalChange = groupStocks.reduce((acc, s) => acc + s.change, 0);
      const avgChange = groupStocks.length > 0 ? totalChange / groupStocks.length : 0;
      const groupAdvancing = groupStocks.filter((s) => s.change > 0).length;
      const groupDeclining = groupStocks.filter((s) => s.change < 0).length;

      return {
        groupName,
        stocks: groupStocks,
        avgChange,
        groupAdvancing,
        groupDeclining,
      };
    });
  }, [stocks]);

  return (
    <div className="w-full font-mono flex flex-col gap-4 text-xs selection:bg-neutral-800">
      {/* 1. TOP HEADER & TELEMETRI SENTIMEN */}
      <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 font-bold text-sm">📡</div>
          <div>
            <h3 className="font-extrabold text-white text-sm uppercase tracking-wider">IDX Market Intelligence & Conglomerate Radar</h3>
            <p className="text-[11px] text-neutral-400 font-sans mt-0.5">Pemantauan arus modal institusi, sentimen sektorial, dan pergerakan emiten konglomerasi BEI.</p>
          </div>
        </div>

        {/* Meteran Status Pasar Live */}
        <div className="flex items-center gap-4 bg-neutral-950 px-3.5 py-2 rounded-lg border border-neutral-800/80 text-xs w-full lg:w-auto justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className={`font-bold uppercase ${bullRatio >= 50 ? "text-emerald-400" : "text-rose-400"}`}>
              {bullRatio >= 50 ? "Bullish" : "Bearish"} ({bullRatio}%)
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-sans">
            <span className="text-emerald-400 font-semibold">🟢 {advancing.length} Advance</span>
            <span className="text-rose-400 font-semibold">🔴 {declining.length} Decline</span>
            <span className="text-neutral-500 font-semibold">⚪ {unchanged.length} Unchanged</span>
          </div>
        </div>
      </div>

      {/* 2. LAYOUT SPLIT UTAMA (Presisi Sejajar dari Atas ke Bawah) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* KOLOM KIRI (5 COLS): SEKTOR & NEWS FLASH REPUTATION */}
        <div className="lg:col-span-5 flex flex-col gap-4 h-full">
          {/* Sektor Industri Card List */}
          <div className="bg-neutral-900/30 border border-neutral-800 rounded-xl p-4 space-y-3 backdrop-blur-sm shrink-0">
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
              <h4 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                <span>📈</span> Performa Sektor Industri
              </h4>
              <button onClick={() => setSelectedCategory("Semua")} className={`text-[10px] px-2 py-0.5 rounded transition ${selectedCategory === "Semua" ? "bg-neutral-800 text-white font-bold" : "text-neutral-500 hover:text-white"}`}>
                Reset Filter
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[260px] overflow-y-auto pr-1 scrollbar-none">
              {sectorAnalytics.map((sec) => {
                const isPos = sec.avgChange >= 0;
                const isSelected = selectedCategory === sec.sector;
                return (
                  <div
                    key={sec.sector}
                    onClick={() => setSelectedCategory(sec.sector)}
                    className={`p-2.5 rounded-lg border transition cursor-pointer flex flex-col justify-between gap-2 ${
                      isSelected ? "bg-neutral-900 border-emerald-500/80 shadow-sm" : "bg-neutral-950/70 border-neutral-800/80 hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-neutral-200 text-xs leading-tight">{sec.sector}</span>
                      <span className={`font-extrabold shrink-0 text-xs ${isPos ? "text-emerald-400" : "text-rose-400"}`}>
                        {isPos ? "+" : ""}
                        {sec.avgChange.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-neutral-500 font-sans pt-1 border-t border-neutral-900">
                      <span>{sec.totalStocks} emiten</span>
                      <span>
                        <strong className="text-emerald-400">{sec.advancing}</strong>/<strong className="text-rose-400">{sec.declining}</strong>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mini News Flash (Meregang Sempurna Menutup Celah Bawah) */}
          <div className="bg-neutral-900/30 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between flex-1 backdrop-blur-sm min-h-[240px]">
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2 mb-3 shrink-0">
              <h4 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                <span>📰</span> Conglomerate News Flash
              </h4>
              <span className="text-[10px] text-emerald-400 font-mono">Live Stream</span>
            </div>

            <div className="space-y-2.5 overflow-y-auto pr-1 flex-1 max-h-[340px]">
              {CONGLOMERATE_NEWS_FLASH.map((item, idx) => (
                <div key={idx} className="p-2.5 bg-neutral-950/80 rounded-lg border border-neutral-800/60 space-y-1 hover:border-neutral-700 transition">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-500/20">{item.group}</span>
                    <span className="text-neutral-500 font-sans">{item.time}</span>
                  </div>
                  <p className="text-[11px] text-neutral-300 font-sans leading-snug">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KOLOM KANAN (7 COLS): MATRIKS GRUP KONGLOMERAT */}
        <div className="lg:col-span-7 h-full">
          <div className="bg-neutral-900/30 border border-neutral-800 rounded-xl p-4 space-y-3 backdrop-blur-sm h-full flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2.5">
              <h4 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                <span>🏛️</span> Matriks Pergerakan Grup Konglomerat BEI
              </h4>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">All-in-One Grid</span>
            </div>

            {/* Grid 2x4 Kartu Konglomerat */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
              {conglomerateMatrix.map((group) => {
                const isGroupPos = group.avgChange >= 0;
                const isSelected = selectedCategory === group.groupName;

                return (
                  <div
                    key={group.groupName}
                    onClick={() => setSelectedCategory(group.groupName)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between gap-3 ${
                      isSelected ? "bg-neutral-900 border-emerald-500/80 shadow-lg shadow-emerald-500/10" : "bg-neutral-950/70 border-neutral-800/80 hover:border-neutral-700"
                    }`}
                  >
                    {/* Header Card Grup */}
                    <div className="flex items-start justify-between border-b border-neutral-900 pb-2 gap-2">
                      <span className="font-bold text-white text-xs leading-tight">{group.groupName}</span>
                      <span
                        className={`font-extrabold text-xs shrink-0 px-2.5 py-0.5 rounded ${isGroupPos ? "bg-emerald-950/90 text-emerald-300 border border-emerald-500/30 shadow-sm" : "bg-rose-950/90 text-rose-300 border border-rose-500/30 shadow-sm"}`}
                      >
                        {isGroupPos ? "+" : ""}
                        {group.avgChange.toFixed(2)}%
                      </span>
                    </div>

                    {/* Deretan Ticker Saham */}
                    <div className="flex flex-wrap gap-1.5 min-h-[46px] items-center">
                      {group.stocks.map((s) => {
                        const isStockPos = s.change >= 0;
                        return (
                          <div
                            key={s.symbol}
                            className={`px-2 py-1 rounded text-xs font-bold font-mono border flex items-center gap-1.5 transition-transform hover:scale-105 ${
                              isStockPos ? "bg-emerald-950/60 text-emerald-300 border-emerald-500/40 shadow-sm" : "bg-rose-950/60 text-rose-300 border-rose-500/40 shadow-sm"
                            }`}
                          >
                            <span>{s.symbol}</span>
                            <span className="text-[10px] opacity-90 font-semibold">
                              {isStockPos ? "+" : ""}
                              {s.change}%
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Footer Rasio Emiten */}
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-900 text-[10px] text-neutral-400 font-sans">
                      <span>{group.stocks.length} Emiten Terdaftar</span>
                      <span>
                        <strong className="text-emerald-400">{group.groupAdvancing}</strong> Naik / <strong className="text-rose-400">{group.groupDeclining}</strong> Turun
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
