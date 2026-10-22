"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Stock } from "@/types/stock";

interface StockSignalsProps {
  stocks: Stock[];
}

const SIGNAL_TYPES = [
  { id: "all", label: "Semua Sinyal", desc: "Seluruh hasil pemindaian sistem" },
  { id: "breakout", label: "🚀 Breakout 52W", desc: "Mendekati level tertinggi 1 tahun" },
  { id: "value", label: "💎 Sector-Adjusted Value", desc: "Valuasi disesuaikan per sektor" },
  { id: "momentum", label: "🔥 Institutional Momentum", desc: "Lonjakan harga & volume tinggi" },
  { id: "dividend", label: "💰 High Dividend Yield", desc: "Dividend Yield > 4%" },
  { id: "correction", label: "⚠️ Oversold / Rebound", desc: "Peluang pantulan harga sehat" },
];

export default function StockSignals({ stocks }: StockSignalsProps) {
  const [activeSignal, setActiveSignal] = useState("all");
  // Toggle untuk menguji efektifitas Filter Institusional
  const [institutionalMode, setInstitutionalMode] = useState(true);

  // Algoritma Pemindaian Sinyal dengan 3 Peningkatan Institusional
  const analyzedStocks = useMemo(() => {
    return stocks.map((stock) => {
      const high52 = stock.fiftyTwoWeekHigh || stock.price * 1.2;
      const low52 = stock.fiftyTwoWeekLow || stock.price * 0.8;

      // 1. Hitung ADTV (Average Daily Trading Value) = Harga x Volume
      const adtv = stock.price * (stock.volume || 0);

      // Filter Likuiditas Institusional (Minimal transaksi Rp 2 Miliar per hari)
      const isLiquid = institutionalMode ? adtv >= 2_000_000_000 : true;

      // 2. Sektor-Adjusted Valuation (Bank diizinkan PBV lebih tinggi karena struktur asetnya)
      const isFinancial = stock.sector === "Financials";
      const maxPBV = isFinancial ? 2.5 : 1.3;
      const maxPER = isFinancial ? 20 : 15;

      const isValue = (stock.priceToBook || 99) <= maxPBV && (stock.trailingPE || 99) <= maxPER;
      const isBreakout = stock.price >= high52 * 0.95;

      // 3. Konfirmasi Volume Institusional (Volume besar & kenaikan positif)
      const isMomentum = stock.change > 2.0 && (stock.volume || 0) > 100_000;
      const isDividend = (stock.dividendYield || 0) * 100 >= 4;
      const isCorrection = stock.change < -2.0 && stock.price > low52 * 1.05;

      const signals = [];

      if (isLiquid) {
        if (isBreakout) signals.push({ type: "breakout", label: "Breakout 52W", color: "text-emerald-400 bg-emerald-950/50 border-emerald-500/30" });
        if (isValue) signals.push({ type: "value", label: isFinancial ? "Value (Banking Adjusted)" : "Deep Value", color: "text-teal-400 bg-teal-950/50 border-teal-500/30" });
        if (isMomentum) signals.push({ type: "momentum", label: "Inst. Momentum", color: "text-amber-400 bg-amber-950/50 border-amber-500/30" });
        if (isDividend) signals.push({ type: "dividend", label: "High Dividend", color: "text-blue-400 bg-blue-950/50 border-blue-500/30" });
        if (isCorrection) signals.push({ type: "correction", label: "Oversold Rebound", color: "text-purple-400 bg-purple-950/50 border-purple-500/30" });
      }

      if (signals.length === 0) {
        signals.push({
          type: "neutral",
          label: !isLiquid ? "⚠️ Low Liquidity (Filtered)" : "Konsolidasi",
          color: !isLiquid ? "text-neutral-500 bg-neutral-900/40 border-neutral-800 line-through" : "text-neutral-400 bg-neutral-900 border-neutral-800",
        });
      }

      return { ...stock, adtv, isLiquid, signals };
    });
  }, [stocks, institutionalMode]);

  // Filter Berdasarkan Kategori Sinyal Aktif
  const filteredStocks = useMemo(() => {
    if (activeSignal === "all") return analyzedStocks;
    return analyzedStocks.filter((s) => s.signals.some((sig) => sig.type === activeSignal));
  }, [analyzedStocks, activeSignal]);

  // Statistik Pengujian Efektifitas
  const stats = useMemo(() => {
    const totalProcessed = stocks.length;
    const passedLiquidity = analyzedStocks.filter((s) => s.isLiquid).length;
    const filteredOut = totalProcessed - passedLiquidity;
    return { totalProcessed, passedLiquidity, filteredOut };
  }, [stocks, analyzedStocks]);

  return (
    <div className="w-full font-mono flex flex-col gap-4 text-xs">
      {/* Control Panel: Sinyal & Uji Efektifitas Institusional */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-3.5 sm:p-4 flex flex-col gap-3 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
          <div>
            <h3 className="font-bold text-white text-xs flex items-center gap-1.5 uppercase tracking-wider">
              <span>⚡</span> Institutional Quantitative Signal Engine
            </h3>
            <p className="text-[10px] text-neutral-400 font-sans mt-0.5">Penyaringan otomatis dilengkapi Filter Likuiditas ADTV, Valuasi Sektoral, dan Volume Konfirmasi.</p>
          </div>

          {/* Panel Toggle Uji Efektifitas */}
          <div className="flex items-center gap-2 bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-800 shrink-0">
            <span className="text-[10px] text-neutral-400 font-bold">Mode Institusional:</span>
            <button
              onClick={() => setInstitutionalMode(!institutionalMode)}
              className={`px-2.5 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${institutionalMode ? "bg-emerald-500 text-neutral-950 shadow-sm" : "bg-neutral-800 text-neutral-400"}`}
            >
              {institutionalMode ? "ACTIVE (ON)" : "DISABLED (OFF)"}
            </button>
          </div>
        </div>

        {/* Live Effectiveness Test Stats Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-neutral-950 p-2.5 rounded-lg border border-neutral-800/80 text-[10px]">
          <div className="flex items-center justify-between sm:justify-start sm:gap-2">
            <span className="text-neutral-400">Total Dipindai:</span>
            <span className="font-bold text-white">{stats.totalProcessed} Emiten</span>
          </div>
          <div className="flex items-center justify-between sm:justify-start sm:gap-2">
            <span className="text-neutral-400">Lolos Filter Likuiditas:</span>
            <span className="font-bold text-emerald-400">{stats.passedLiquidity} Emiten</span>
          </div>
          <div className="flex items-center justify-between sm:justify-start sm:gap-2">
            <span className="text-neutral-400">Noise / Saham Tidak Likuid:</span>
            <span className="font-bold text-rose-400">{stats.filteredOut} Disaring</span>
          </div>
        </div>

        {/* Tombol Filter Sinyal (Pills) */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
          {SIGNAL_TYPES.map((sig) => {
            const isActive = activeSignal === sig.id;
            return (
              <button
                key={sig.id}
                onClick={() => setActiveSignal(sig.id)}
                className={`px-3 py-1.5 rounded-lg border text-left transition whitespace-nowrap cursor-pointer ${
                  isActive ? "bg-neutral-100 text-neutral-950 font-bold border-neutral-100 shadow-sm" : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white"
                }`}
              >
                <div className="text-[11px] font-bold">{sig.label}</div>
                <div className="text-[9px] opacity-75 font-normal">{sig.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Kartu Sinyal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filteredStocks.map((stock) => (
          <div
            key={stock.symbol}
            className={`bg-neutral-950 border rounded-xl p-4 flex flex-col justify-between gap-3 transition shadow-xl relative overflow-hidden group ${
              !stock.isLiquid ? "opacity-60 border-neutral-900" : "border-neutral-800 hover:border-neutral-700"
            }`}
          >
            {/* Garis Aksen Kiri */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${stock.isLiquid ? "bg-emerald-500" : "bg-neutral-700"}`}></div>

            {/* Header Card */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-black text-white tracking-wider font-mono">{stock.symbol}</span>
                <span className={`text-xs font-bold ${stock.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {stock.change >= 0 ? "+" : ""}
                  {stock.change.toFixed(2)}%
                </span>
              </div>
              <div className="text-[11px] text-neutral-300 font-sans truncate">{stock.name}</div>
            </div>

            {/* Badges Sinyal Terdeteksi */}
            <div className="flex flex-wrap gap-1.5">
              {stock.signals.map((sig, idx) => (
                <span key={idx} className={`text-[9px] font-bold px-2 py-0.5 rounded border font-mono ${sig.color}`}>
                  {sig.label}
                </span>
              ))}
            </div>

            {/* Metrik Finansial & ADTV */}
            <div className="bg-neutral-900/50 border border-neutral-900 rounded-lg p-2.5 space-y-1 text-[11px] font-mono">
              <div className="flex justify-between">
                <span className="text-neutral-400">Harga:</span>
                <span className="font-bold text-white">Rp {stock.price.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Valuasi PER/PBV:</span>
                <span className="text-neutral-300">
                  {stock.trailingPE ? `${stock.trailingPE.toFixed(1)}x` : "N/A"} / {stock.priceToBook ? `${stock.priceToBook.toFixed(1)}x` : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Nilai Transaksi (ADTV):</span>
                <span className={`font-bold ${stock.adtv >= 2_000_000_000 ? "text-emerald-400" : "text-neutral-500"}`}>Rp {(stock.adtv / 1e9).toFixed(1)} M/hari</span>
              </div>
            </div>

            {/* Tombol Detail */}
            <Link href={`/stock/${stock.symbol}`} className="w-full bg-neutral-900 hover:bg-neutral-800 text-emerald-400 border border-neutral-800 py-1.5 rounded-lg text-center text-[11px] font-bold transition block font-mono">
              Analisis Komplit ↗
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
