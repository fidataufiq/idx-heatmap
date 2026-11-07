"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StockDetail } from "@/types/stock";
import StockChart from "@/components/StockChart";

interface StockDetailClientProps {
  symbol: string;
}

export default function StockDetailClient({ symbol }: StockDetailClientProps) {
  const [stock, setStock] = useState<StockDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await fetch(`/api/stocks/${symbol}`);
        const json = await res.json();
        if (json.success) {
          setStock(json.data);
        } else {
          setError(json.error || "Gagal memuat data");
        }
      } catch (err) {
        console.error(err);
        setError("Terjadi kesalahan koneksi jaringan");
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [symbol]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-3 bg-neutral-900/40 p-6 rounded-2xl border border-neutral-800/40 backdrop-blur-md">
          <div className="w-7 h-7 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-neutral-400 tracking-wider">SECURE_FETCH // Memuat profil {symbol.toUpperCase()}...</p>
        </div>
      </div>
    );
  }

  if (error || !stock) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 text-center font-mono">
        <div className="bg-neutral-900/60 border border-neutral-800/40 p-8 rounded-2xl max-w-md space-y-4 shadow-2xl">
          <span className="text-3xl">⚠️</span>
          <h1 className="text-base font-bold text-rose-400">Saham Tidak Ditemukan</h1>
          <p className="text-xs text-neutral-400 leading-relaxed font-sans">{error || `Data untuk simbol ${symbol.toUpperCase()} tidak tersedia di bursa saat ini.`}</p>
          <Link href="/" className="inline-block bg-neutral-800 hover:bg-neutral-700 text-emerald-400 border border-emerald-500/30 font-bold px-4 py-2 rounded-xl text-xs transition">
            ← Kembali ke Heatmap
          </Link>
        </div>
      </div>
    );
  }

  const isPositive = stock.change >= 0;

  // Formatter Konsensus Analis Berwarna
  const getRecommendationBadge = (key?: string) => {
    switch (key?.toLowerCase()) {
      case "buy":
      case "strong_buy":
        return <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">🟢 Beli (Buy)</span>;
      case "hold":
        return <span className="bg-amber-950/80 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">🟡 Tahan (Hold)</span>;
      case "sell":
      case "underperform":
      case "strong_sell":
        return <span className="bg-rose-950/80 text-rose-300 border border-rose-500/40 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">🔴 Jual (Sell)</span>;
      default:
        return <span className="bg-neutral-900 text-neutral-400 border border-neutral-800/40 px-3 py-1 rounded-full text-[10px] font-bold">⚪ Netral / Belum Ada Data</span>;
    }
  };

  const trend = stock.recommendationTrend;
  const totalVotes = trend ? trend.strongBuy + trend.buy + trend.hold + trend.sell + trend.strongSell : 0;

  // Hitung Potensi Imbal Hasil berdasarkan Target Price Rata-rata
  const upsidePotential = stock.targetMeanPrice && stock.price > 0 ? (((stock.targetMeanPrice - stock.price) / stock.price) * 100).toFixed(1) : null;

  return (
    <div className="flex flex-col flex-1 w-full bg-neutral-950 text-white font-mono selection:bg-emerald-500 selection:text-neutral-950 relative overflow-x-hidden">
      {/* Background Cyber Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Sub-Header Navigasi Sticky Full-Width Sempurna */}
      <header className="border-b border-neutral-800/30 bg-neutral-950/90 backdrop-blur-md px-4 sm:px-6 py-2.5 flex items-center justify-between sticky top-12 z-30 w-full shadow-sm">
        <Link href="/" className="text-neutral-400 hover:text-emerald-400 text-xs transition flex items-center gap-1.5 group font-mono">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Kembali ke Heatmap
        </Link>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase bg-emerald-950/50 px-2.5 py-0.5 rounded border border-emerald-500/30">
            {stock.exchange} {"// LIVE_TELEMETRY"}
          </span>
        </div>
      </header>

      {/* Main Full-Width Bento Grid Container dengan Jarak Atas (pt-10) yang Sangat Lega dan Nyaman */}
      <main className="w-full px-4 sm:px-6 pt-10 pb-10 flex-1 flex flex-col gap-6 relative z-10">
        {/* 1. HERO BENTO CARD: Ticker, Price & Volume Telemetry */}
        <div className="relative overflow-hidden bg-neutral-900/20 border border-neutral-800/30 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-3xl sm:text-4xl font-black tracking-tight text-white font-mono">{stock.symbol}</span>

              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-md border font-mono flex items-center gap-1 ${isPositive ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40" : "bg-rose-950/80 text-rose-300 border-rose-500/40"}`}
              >
                {isPositive ? "▲ +" : "▼ "}
                {stock.change.toFixed(2)}%
              </span>

              {stock.sector && <span className="text-[11px] bg-neutral-900/60 text-neutral-300 px-2.5 py-1 rounded-md border border-neutral-800/40">{stock.sector}</span>}
            </div>

            <h1 className="text-sm sm:text-base text-neutral-200 font-semibold font-sans">{stock.name}</h1>

            <p className="text-[11px] text-neutral-400 font-sans flex flex-wrap items-center gap-2">
              <span>
                Industri: <strong className="text-neutral-300">{stock.industry}</strong>
              </span>
              <span>•</span>
              <span>
                Lokasi:{" "}
                <strong className="text-neutral-300">
                  {stock.city ? `${stock.city}, ` : ""}
                  {stock.country}
                </strong>
              </span>
            </p>
          </div>

          {/* Price Showcase Card */}
          <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-800/40 w-full lg:w-auto min-w-[240px] flex flex-col justify-between">
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold block mb-1">Harga Terakhir</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">Rp {stock.price.toLocaleString("id-ID")}</div>
            <div className="text-[10px] text-neutral-400 font-sans mt-2 pt-2 border-t border-neutral-900/60 flex justify-between">
              <span>Volume Beredar:</span>
              <strong className="text-neutral-200 font-mono">{(stock.volume / 1000000).toFixed(2)}M Lembar</strong>
            </div>
          </div>
        </div>

        {/* 2. KEY METRICS BENTO GRID (6 Column Cards dengan Ikon & Tooltip Halus) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Market Cap */}
          <div className="relative group bg-neutral-900/20 border border-neutral-800/30 rounded-xl p-4 flex flex-col justify-between hover:border-neutral-700/50 transition">
            <div className="flex items-center justify-between text-[11px] text-neutral-400">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Market Cap
              </span>
              <span className="text-[9px] text-neutral-500 font-mono w-4 h-4 rounded bg-neutral-950 flex items-center justify-center border border-neutral-800/40 cursor-pointer">?</span>
            </div>
            <span className="text-xs sm:text-sm font-bold mt-2 truncate text-white">Rp {(stock.marketCap / 1e9).toLocaleString("id-ID", { maximumFractionDigits: 1 })}B</span>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 w-52 p-3 bg-neutral-900/95 border border-neutral-700/50 rounded-xl shadow-2xl backdrop-blur-xl z-50 text-[10px] text-neutral-300 leading-snug">
              <p className="font-bold text-emerald-400 mb-1">Market Capitalization</p>
              Total nilai pasar seluruh saham perusahaan (Harga Saham × Jumlah Saham Beredar).
            </div>
          </div>

          {/* P/E Ratio */}
          <div className="relative group bg-neutral-900/20 border border-neutral-800/30 rounded-xl p-4 flex flex-col justify-between hover:border-neutral-700/50 transition">
            <div className="flex items-center justify-between text-[11px] text-neutral-400">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                P/E Ratio
              </span>
              <span className="text-[9px] text-neutral-500 font-mono w-4 h-4 rounded bg-neutral-950 flex items-center justify-center border border-neutral-800/40 cursor-pointer">?</span>
            </div>
            <span className="text-xs sm:text-sm font-bold mt-2 text-white">{stock.trailingPE ? stock.trailingPE.toFixed(2) : "N/A"}</span>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 w-52 p-3 bg-neutral-900/95 border border-neutral-700/50 rounded-xl shadow-2xl backdrop-blur-xl z-50 text-[10px] text-neutral-300 leading-snug">
              <p className="font-bold text-amber-400 mb-1">Price to Earnings Ratio</p>
              Rasio valuasi harga saham terhadap laba bersih per lembar (EPS).
            </div>
          </div>

          {/* PBV */}
          <div className="relative group bg-neutral-900/20 border border-neutral-800/30 rounded-xl p-4 flex flex-col justify-between hover:border-neutral-700/50 transition">
            <div className="flex items-center justify-between text-[11px] text-neutral-400">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                PBV Ratio
              </span>
              <span className="text-[9px] text-neutral-500 font-mono w-4 h-4 rounded bg-neutral-950 flex items-center justify-center border border-neutral-800/40 cursor-pointer">?</span>
            </div>
            <span className="text-xs sm:text-sm font-bold mt-2 text-white">{stock.priceToBook ? stock.priceToBook.toFixed(2) : "N/A"}</span>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 w-52 p-3 bg-neutral-900/95 border border-neutral-700/50 rounded-xl shadow-2xl backdrop-blur-xl z-50 text-[10px] text-neutral-300 leading-snug">
              <p className="font-bold text-teal-400 mb-1">Price to Book Value</p>
              Membandingkan harga saham dengan nilai buku ekuitas perusahaan.
            </div>
          </div>

          {/* 52W High */}
          <div className="relative group bg-neutral-900/20 border border-neutral-800/30 rounded-xl p-4 flex flex-col justify-between hover:border-neutral-700/50 transition">
            <div className="flex items-center justify-between text-[11px] text-neutral-400">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                52W High
              </span>
              <span className="text-[9px] text-neutral-500 font-mono w-4 h-4 rounded bg-neutral-950 flex items-center justify-center border border-neutral-800/40 cursor-pointer">?</span>
            </div>
            <span className="text-xs sm:text-sm font-bold mt-2 text-emerald-400">Rp {stock.fiftyTwoWeekHigh ? stock.fiftyTwoWeekHigh.toLocaleString("id-ID") : "N/A"}</span>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 w-52 p-3 bg-neutral-900/95 border border-neutral-700/50 rounded-xl shadow-2xl backdrop-blur-xl z-50 text-[10px] text-neutral-300 leading-snug">
              <p className="font-bold text-emerald-400 mb-1">52-Week High</p>
              Harga tertinggi saham ini dalam rentang waktu 1 tahun terakhir.
            </div>
          </div>

          {/* 52W Low */}
          <div className="relative group bg-neutral-900/20 border border-neutral-800/30 rounded-xl p-4 flex flex-col justify-between hover:border-neutral-700/50 transition">
            <div className="flex items-center justify-between text-[11px] text-neutral-400">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
                52W Low
              </span>
              <span className="text-[9px] text-neutral-500 font-mono w-4 h-4 rounded bg-neutral-950 flex items-center justify-center border border-neutral-800/40 cursor-pointer">?</span>
            </div>
            <span className="text-xs sm:text-sm font-bold mt-2 text-rose-400">Rp {stock.fiftyTwoWeekLow ? stock.fiftyTwoWeekLow.toLocaleString("id-ID") : "N/A"}</span>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 w-52 p-3 bg-neutral-900/95 border border-neutral-700/50 rounded-xl shadow-2xl backdrop-blur-xl z-50 text-[10px] text-neutral-300 leading-snug">
              <p className="font-bold text-rose-400 mb-1">52-Week Low</p>
              Harga terendah saham ini dalam rentang waktu 1 tahun terakhir.
            </div>
          </div>

          {/* Dividend Yield */}
          <div className="relative group bg-neutral-900/20 border border-neutral-800/30 rounded-xl p-4 flex flex-col justify-between hover:border-neutral-700/50 transition">
            <div className="flex items-center justify-between text-[11px] text-neutral-400">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Div Yield
              </span>
              <span className="text-[9px] text-neutral-500 font-mono w-4 h-4 rounded bg-neutral-950 flex items-center justify-center border border-neutral-800/40 cursor-pointer">?</span>
            </div>
            <span className="text-xs sm:text-sm font-bold mt-2 text-cyan-400">{stock.dividendYield ? `${(stock.dividendYield * 100).toFixed(2)}%` : "N/A"}</span>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 w-52 p-3 bg-neutral-900/95 border border-neutral-700/50 rounded-xl shadow-2xl backdrop-blur-xl z-50 text-[10px] text-neutral-300 leading-snug">
              <p className="font-bold text-cyan-400 mb-1">Dividend Yield</p>
              Persentase imbal hasil dividen tahunan terhadap harga saham saat ini.
            </div>
          </div>
        </div>

        {/* 3. INTERACTIVE TRADINGVIEW CHART CONTAINER */}
        <div className="bg-neutral-900/20 border border-neutral-800/30 rounded-2xl p-4 backdrop-blur-md shadow-xl">
          <StockChart symbol={stock.symbol} />
        </div>

        {/* 4. ANALYST CONSENSUS & BREAKDOWN BENTO PANEL */}
        <div className="bg-neutral-900/20 border border-neutral-800/30 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-xl flex flex-col lg:flex-row justify-between gap-6">
          {/* Left Analyst Target Panel */}
          <div className="lg:w-1/3 space-y-4 border-b lg:border-b-0 lg:border-r border-neutral-800/40 pb-5 lg:pb-0 lg:pr-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span>🎯</span> Konsensus Analis
                  </h2>

                  {/* Tooltip Disclaimer */}
                  <div className="relative group/tooltip inline-block">
                    <button
                      type="button"
                      className="text-neutral-400 hover:text-amber-400 text-[10px] font-mono w-4 h-4 rounded-full bg-neutral-950 hover:bg-neutral-900 border border-neutral-800/40 flex items-center justify-center transition cursor-help"
                      aria-label="Disclaimer Data"
                    >
                      !
                    </button>

                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 opacity-0 translate-y-1 group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-0 pointer-events-none group-hover/tooltip:pointer-events-auto transition-all duration-200 w-64 p-3 bg-neutral-900/95 border border-neutral-700/50 rounded-xl shadow-2xl backdrop-blur-xl z-50 text-[11px] leading-snug text-neutral-300 font-sans">
                      <p className="font-semibold text-amber-400 mb-1 flex items-center gap-1">
                        <span>⚠️</span> Disclaimer Finansial
                      </p>
                      <p className="text-neutral-400 text-[10px]">Data konsensus disarikan secara otomatis murni sebagai referensi edukasi analitis.</p>
                    </div>
                  </div>
                </div>

                {getRecommendationBadge(stock.recommendationKey)}
              </div>

              <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                Riset independen dari <strong className="text-white font-mono">{stock.numberOfAnalystOpinions || 0} analis</strong> sekuritas terdaftar.
              </p>

              {stock.targetMeanPrice && (
                <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-800/40 mt-4 space-y-1">
                  <span className="text-[10px] text-neutral-400 block font-sans">Target Harga Rata-rata (12 Bulan):</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-emerald-400 font-mono">Rp {stock.targetMeanPrice.toLocaleString("id-ID")}</span>
                    {upsidePotential && (
                      <span className={`text-xs font-bold font-mono ${Number(upsidePotential) >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        ({Number(upsidePotential) >= 0 ? "+" : ""}
                        {upsidePotential}%)
                      </span>
                    )}
                  </div>
                  {stock.targetHighPrice && stock.targetLowPrice && (
                    <div className="flex justify-between text-[10px] text-neutral-400 pt-2 border-t border-neutral-900/60 mt-2 font-mono">
                      <span>Low: Rp {stock.targetLowPrice.toLocaleString("id-ID")}</span>
                      <span>High: Rp {stock.targetHighPrice.toLocaleString("id-ID")}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Progress Breakdown Bar Panel */}
          <div className="lg:w-2/3 flex flex-col justify-center gap-3">
            <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Sebaran Rekomendasi Analis:</span>

            {totalVotes > 0 ? (
              <div className="space-y-2.5 text-xs">
                <div>
                  <div className="flex justify-between text-neutral-400 mb-1 text-[11px]">
                    <span>Sangat Beli (Strong Buy)</span>
                    <span className="font-mono text-emerald-400 font-bold">{trend?.strongBuy} Analis</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-900/40">
                    <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${((trend?.strongBuy || 0) / totalVotes) * 100}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-neutral-400 mb-1 text-[11px]">
                    <span>Beli (Buy)</span>
                    <span className="font-mono text-emerald-300 font-bold">{trend?.buy} Analis</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-900/40">
                    <div className="h-full bg-emerald-400 transition-all duration-500" style={{ width: `${((trend?.buy || 0) / totalVotes) * 100}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-neutral-400 mb-1 text-[11px]">
                    <span>Tahan (Hold)</span>
                    <span className="font-mono text-amber-400 font-bold">{trend?.hold} Analis</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-900/40">
                    <div className="h-full bg-amber-400 transition-all duration-500" style={{ width: `${((trend?.hold || 0) / totalVotes) * 100}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-neutral-400 mb-1 text-[11px]">
                    <span>Jual (Sell) / Underperform</span>
                    <span className="font-mono text-rose-400 font-bold">{(trend?.sell || 0) + (trend?.strongSell || 0)} Analis</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-900/40">
                    <div className="h-full bg-rose-500 transition-all duration-500" style={{ width: `${(((trend?.sell || 0) + (trend?.strongSell || 0)) / totalVotes) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-neutral-950/60 p-5 rounded-xl border border-neutral-900/40 text-xs text-neutral-500 text-center font-sans">Rincian suara analis belum tersedia untuk emiten ini dari sumber data pasar.</div>
            )}
          </div>
        </div>

        {/* 5. EMITEN NEWS STREAM GRID */}
        <div className="bg-neutral-900/20 border border-neutral-800/30 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-xl space-y-4">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-neutral-800/40 pb-3 flex items-center gap-2">
            <span>📰</span> Kabar Stream & Sentimen Menyorot {stock.symbol}
          </h2>

          {stock.news && stock.news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {stock.news.map((item, idx) => (
                <a
                  key={idx}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-neutral-950/60 border border-neutral-800/40 hover:border-emerald-500/50 p-4 rounded-xl flex flex-col justify-between transition-all duration-200 hover:scale-[1.01]"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-neutral-400 font-mono">
                      <span className="bg-neutral-900 text-emerald-400 px-2 py-0.5 rounded border border-neutral-800/40 font-bold">{item.source}</span>
                      <span>{item.pubDate}</span>
                    </div>
                    <h3 className="text-xs font-bold text-neutral-200 group-hover:text-emerald-300 transition line-clamp-3 leading-snug font-sans">{item.title}</h3>
                  </div>
                  <div className="mt-3 pt-2 border-t border-neutral-900/60 text-[10px] text-emerald-400 text-right font-bold group-hover:translate-x-0.5 transition-transform">Baca Artikel ↗</div>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-xs text-neutral-500 italic font-sans">Belum ada berita terbaru khusus emiten {stock.symbol}.</p>
          )}
        </div>

        {/* 6. PROFILE & DETAILED FINANCIAL STATISTICS (SPLIT BENTO) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Description Card */}
          <div className="lg:col-span-2 bg-neutral-900/20 border border-neutral-800/30 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-3 border-b border-neutral-800/40 pb-2.5 flex items-center gap-2">
                <span>🏢</span> Profil & Deskripsi Bisnis Emiten
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed text-justify font-sans">{stock.description}</p>
            </div>
            {stock.website && (
              <div className="mt-6 pt-3 border-t border-neutral-900/60 flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-400">Website Resmi:</span>
                <a href={stock.website} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline truncate max-w-[280px] font-bold">
                  {stock.website} ↗
                </a>
              </div>
            )}
          </div>

          {/* Right Complete Financial Stats Table */}
          <div className="bg-neutral-900/20 border border-neutral-800/30 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-3 border-b border-neutral-800/40 pb-2.5 flex items-center gap-2">
                <span>📊</span> Telemetri Rasio Finansial
              </h2>
              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex justify-between items-center border-b border-neutral-900/60 pb-2">
                  <span className="text-neutral-400 font-sans">Forward P/E</span>
                  <span className="font-bold text-white">{stock.forwardPE ? stock.forwardPE.toFixed(2) : "N/A"}</span>
                </div>
                <div className="flex justify-between items-center border-b border-neutral-900/60 pb-2">
                  <span className="text-neutral-400 font-sans">Beta (Volatilitas)</span>
                  <span className="font-bold text-white">{stock.beta ? stock.beta.toFixed(2) : "N/A"}</span>
                </div>
                <div className="flex justify-between items-center border-b border-neutral-900/60 pb-2">
                  <span className="text-neutral-400 font-sans">EBITDA</span>
                  <span className="font-bold text-white">{stock.ebitda ? `Rp ${(stock.ebitda / 1e9).toLocaleString("id-ID", { maximumFractionDigits: 0 })}B` : "N/A"}</span>
                </div>
                <div className="flex justify-between items-center border-b border-neutral-900/60 pb-2">
                  <span className="text-neutral-400 font-sans">Profit Margin</span>
                  <span className="font-bold text-emerald-400">{stock.profitMargins ? `${(stock.profitMargins * 100).toFixed(2)}%` : "N/A"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 font-sans">Jumlah Karyawan</span>
                  <span className="font-bold text-white">{stock.fullTimeEmployees ? stock.fullTimeEmployees.toLocaleString("id-ID") : "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
