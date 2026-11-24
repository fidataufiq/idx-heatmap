"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StockDetail } from "@/types/stock";
import StockChart from "@/components/StockChart";

interface StockDetailClientProps {
  symbol: string;
}

interface ExtendedStockDetail extends StockDetail {
  exDividendDate?: string | number | Date | null;
  dividendDate?: string | number | Date | null;
}

function formatDividendDateID(raw?: string | number | Date | null): string | null {
  if (!raw) return null;
  const date = raw instanceof Date ? raw : new Date(raw);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function StockDetailClient({ symbol }: StockDetailClientProps) {
  const [stock, setStock] = useState<ExtendedStockDetail | null>(null);
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

  const upsidePotential = stock.targetMeanPrice && stock.price > 0 ? (((stock.targetMeanPrice - stock.price) / stock.price) * 100).toFixed(1) : null;

  const rangePosition =
    stock.fiftyTwoWeekLow && stock.fiftyTwoWeekHigh && stock.fiftyTwoWeekHigh > stock.fiftyTwoWeekLow ? Math.min(100, Math.max(0, ((stock.price - stock.fiftyTwoWeekLow) / (stock.fiftyTwoWeekHigh - stock.fiftyTwoWeekLow)) * 100)) : null;

  const exDateFormatted = formatDividendDateID(stock.exDividendDate);
  const payDateFormatted = formatDividendDateID(stock.dividendDate);

  return (
    <div className="flex flex-col flex-1 w-full bg-neutral-950 text-white font-mono selection:bg-emerald-500 selection:text-neutral-950 relative overflow-x-hidden">
      {/* Background Cyber Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Sub-Header Navigasi Sticky */}
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

      <main className="w-full px-4 sm:px-6 pt-8 pb-10 flex-1 flex flex-col gap-5 relative z-10">
        {/* 1. HEADER EMITEN & RINGKASAN HARGA ALA STOCKBIT */}
        <div className="bg-neutral-900/20 border border-neutral-800/30 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono">{stock.symbol}</h1>
              <span className="text-[11px] bg-neutral-900/80 text-neutral-300 px-2.5 py-0.5 rounded-md border border-neutral-800/60 font-sans">{stock.sector}</span>
              <span className="text-[11px] text-neutral-400 font-sans">
                {stock.city ? `${stock.city}, ` : ""}
                {stock.country}
              </span>
            </div>
            <p className="text-sm text-neutral-300 font-sans font-medium">{stock.name}</p>
            <p className="text-[11px] text-neutral-400 font-sans">
              Industri: <strong className="text-neutral-200">{stock.industry}</strong>
            </p>
          </div>

          {/* Blok Harga Utama & Perubahan */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-neutral-950/60 border border-neutral-800/40 rounded-xl p-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold block">Harga Terakhir</span>
              <div className="flex items-baseline gap-2.5 mt-0.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">Rp {stock.price.toLocaleString("id-ID")}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md border font-mono ${isPositive ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40" : "bg-rose-950/80 text-rose-300 border-rose-500/40"}`}>
                  {isPositive ? "▲ +" : "▼ "}
                  {stock.change.toFixed(2)}%
                </span>
              </div>
            </div>

            <div className="sm:border-l sm:border-neutral-800/60 sm:pl-4 text-[11px] space-y-1">
              <div className="text-neutral-400 font-sans">Volume</div>
              <div className="font-bold text-neutral-100 font-mono">{(stock.volume / 1000000).toFixed(2)}M Lembar</div>
            </div>
          </div>
        </div>

        {/* 2. AREA UTAMA ALA STOCKBIT: GRAFIK (KIRI) + KEY STATS, 52W RANGE & SNAPSHOT (KANAN) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
          {/* Grafik Interaktif */}
          <div className="xl:col-span-8 bg-neutral-900/20 border border-neutral-800/30 rounded-2xl p-4 backdrop-blur-md shadow-xl flex flex-col justify-between">
            <StockChart symbol={stock.symbol} />
          </div>

          {/* Panel Samping Padat: 52W Range + Key Statistics + Fundamental & Dividen Snapshot */}
          <div className="xl:col-span-4 flex flex-col gap-4 justify-between">
            {/* 52-Week Range Card */}
            <div className="bg-neutral-900/20 border border-neutral-800/30 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">Rentang Harga 52 Minggu</h2>
                {rangePosition !== null && <span className="text-[10px] font-mono text-emerald-400">{rangePosition.toFixed(0)}% dari Low</span>}
              </div>

              {rangePosition !== null ? (
                <div className="space-y-2 pt-1">
                  <div className="relative h-2 bg-neutral-950 rounded-full border border-neutral-800/60 overflow-visible">
                    <div className="h-full bg-gradient-to-r from-rose-500/70 via-amber-400/70 to-emerald-400 rounded-full" style={{ width: `${rangePosition}%` }} />
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white border-2 border-emerald-400 shadow" style={{ left: `${rangePosition}%` }} />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono pt-1">
                    <div>
                      <span className="text-neutral-500 block text-[10px] font-sans">52W Low</span>
                      <span className="text-rose-400 font-bold">Rp {stock.fiftyTwoWeekLow?.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-neutral-500 block text-[10px] font-sans">52W High</span>
                      <span className="text-emerald-400 font-bold">Rp {stock.fiftyTwoWeekHigh?.toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between text-xs font-mono text-neutral-400">
                  <span>Low: {stock.fiftyTwoWeekLow ? `Rp ${stock.fiftyTwoWeekLow.toLocaleString("id-ID")}` : "N/A"}</span>
                  <span>High: {stock.fiftyTwoWeekHigh ? `Rp ${stock.fiftyTwoWeekHigh.toLocaleString("id-ID")}` : "N/A"}</span>
                </div>
              )}
            </div>

            {/* Key Statistics Grid */}
            <div className="bg-neutral-900/20 border border-neutral-800/30 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl space-y-3">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-neutral-800/40 pb-2.5">Key Statistics</h2>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="relative group bg-neutral-950/60 border border-neutral-800/40 rounded-xl p-3">
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 font-sans">
                    <span>Market Cap</span>
                    <span className="font-mono text-[9px] text-neutral-500">?</span>
                  </div>
                  <div className="font-bold text-white font-mono mt-1 truncate">Rp {(stock.marketCap / 1e9).toLocaleString("id-ID", { maximumFractionDigits: 1 })}B</div>
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all w-48 p-2.5 bg-neutral-900/95 border border-neutral-700/50 rounded-xl shadow-2xl z-50 text-[10px] text-neutral-300 font-sans">
                    Total nilai pasar seluruh saham beredar (Harga × Jumlah Saham).
                  </div>
                </div>

                <div className="relative group bg-neutral-950/60 border border-neutral-800/40 rounded-xl p-3">
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 font-sans">
                    <span>P/E Ratio</span>
                    <span className="font-mono text-[9px] text-neutral-500">?</span>
                  </div>
                  <div className="font-bold text-amber-400 font-mono mt-1">{stock.trailingPE ? `${stock.trailingPE.toFixed(2)}x` : "N/A"}</div>
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all w-48 p-2.5 bg-neutral-900/95 border border-neutral-700/50 rounded-xl shadow-2xl z-50 text-[10px] text-neutral-300 font-sans">
                    Rasio harga saham terhadap laba bersih per lembar (EPS).
                  </div>
                </div>

                <div className="relative group bg-neutral-950/60 border border-neutral-800/40 rounded-xl p-3">
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 font-sans">
                    <span>PBV Ratio</span>
                    <span className="font-mono text-[9px] text-neutral-500">?</span>
                  </div>
                  <div className="font-bold text-teal-400 font-mono mt-1">{stock.priceToBook ? `${stock.priceToBook.toFixed(2)}x` : "N/A"}</div>
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all w-48 p-2.5 bg-neutral-900/95 border border-neutral-700/50 rounded-xl shadow-2xl z-50 text-[10px] text-neutral-300 font-sans">
                    Perbandingan harga saham dengan nilai buku ekuitas perusahaan.
                  </div>
                </div>

                <div className="relative group bg-neutral-950/60 border border-neutral-800/40 rounded-xl p-3">
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 font-sans">
                    <span>Div Yield</span>
                    <span className="font-mono text-[9px] text-neutral-500">?</span>
                  </div>
                  <div className="font-bold text-cyan-400 font-mono mt-1">{stock.dividendYield ? `${(stock.dividendYield * 100).toFixed(2)}%` : "N/A"}</div>
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all w-48 p-2.5 bg-neutral-900/95 border border-neutral-700/50 rounded-xl shadow-2xl z-50 text-[10px] text-neutral-300 font-sans">
                    Persentase imbal hasil dividen tahunan terhadap harga saham saat ini.
                  </div>
                </div>
              </div>
            </div>

            {/* Modul Pengisi Ruang di Bawah Key Statistics: Ringkasan Fundamental & Dividen */}
            <div className="bg-neutral-900/20 border border-neutral-800/30 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-800/40 pb-2.5">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">Quick Snapshot</h2>
                {stock.targetMeanPrice && <span className="text-[10px] font-mono text-emerald-400">Target Rp {stock.targetMeanPrice.toLocaleString("id-ID")}</span>}
              </div>

              <div className="space-y-2 text-[11px] font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 font-sans">Profit Margin</span>
                  <span className="font-bold text-emerald-400">{stock.profitMargins ? `${(stock.profitMargins * 100).toFixed(2)}%` : "N/A"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 font-sans">Forward P/E</span>
                  <span className="font-bold text-neutral-200">{stock.forwardPE ? `${stock.forwardPE.toFixed(2)}x` : "N/A"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 font-sans">Beta</span>
                  <span className="font-bold text-neutral-200">{stock.beta ? stock.beta.toFixed(2) : "N/A"}</span>
                </div>
                <div className="flex justify-between items-center pt-1.5 border-t border-neutral-800/50">
                  <span className="text-neutral-400 font-sans">Ex-Dividend Date</span>
                  <span className="font-bold text-cyan-300">{exDateFormatted ?? "Menunggu feed"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 font-sans">Dividend Pay Date</span>
                  <span className="font-bold text-cyan-300">{payDateFormatted ?? "Menunggu feed"}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-800/50 flex items-center justify-between gap-2 text-[10px] font-sans">
                <a href="#consensus-section" className="text-neutral-400 hover:text-emerald-400 transition">
                  Konsensus Analis ↓
                </a>
                <a href="#news-section" className="text-neutral-400 hover:text-emerald-400 transition">
                  Berita Emiten ↓
                </a>
                {stock.website && (
                  <a href={stock.website} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline font-medium">
                    Situs Resmi ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. KONSENSUS ANALIS & TARGET HARGA */}
        <div id="consensus-section" className="bg-neutral-900/20 border border-neutral-800/30 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-xl flex flex-col lg:flex-row justify-between gap-6 scroll-mt-24">
          <div className="lg:w-1/3 space-y-4 border-b lg:border-b-0 lg:border-r border-neutral-800/40 pb-5 lg:pb-0 lg:pr-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span>🎯</span> Konsensus Analis
                  </h2>

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
                    <div
                      className="h-full bg-rose-500 transition-all duration-500"
                      style={{
                        width: `${(((trend?.sell || 0) + (trend?.strongSell || 0)) / totalVotes) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-neutral-950/60 p-5 rounded-xl border border-neutral-900/40 text-xs text-neutral-500 text-center font-sans">Rincian suara analis belum tersedia untuk emiten ini dari sumber data pasar.</div>
            )}
          </div>
        </div>

        {/* 4. BERITA EMITEN */}
        <div id="news-section" className="bg-neutral-900/20 border border-neutral-800/30 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-xl space-y-4 scroll-mt-24">
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

        {/* 5. PROFIL BISNIS & TELEMETRI RASIO FINANSIAL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
