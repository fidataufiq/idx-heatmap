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
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-neutral-400">Memuat profil & analisis {symbol.toUpperCase()}...</p>
        </div>
      </div>
    );
  }

  if (error || !stock) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
        <h1 className="text-xl font-bold text-rose-500 mb-2">Saham Tidak Ditemukan</h1>
        <p className="text-sm text-neutral-400 mb-6">{error || `Data untuk simbol ${symbol.toUpperCase()} tidak tersedia.`}</p>
        <Link href="/" className="bg-emerald-500 text-neutral-950 font-bold px-4 py-2 rounded-lg text-sm transition hover:bg-emerald-400">
          Kembali ke Heatmap
        </Link>
      </div>
    );
  }

  const isPositive = stock.change >= 0;

  // Formatter Konsensus Analis Berwarna
  const getRecommendationBadge = (key?: string) => {
    switch (key?.toLowerCase()) {
      case "buy":
      case "strong_buy":
        return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-lg text-xs font-bold uppercase">Beli (Buy)</span>;
      case "hold":
        return <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-lg text-xs font-bold uppercase">Tahan (Hold)</span>;
      case "sell":
      case "underperform":
      case "strong_sell":
        return <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 px-3 py-1 rounded-lg text-xs font-bold uppercase">Jual (Sell)</span>;
      default:
        return <span className="bg-neutral-800 text-neutral-400 px-3 py-1 rounded-lg text-xs font-bold">Netral / Belum Ada Data</span>;
    }
  };

  const trend = stock.recommendationTrend;
  const totalVotes = trend ? trend.strongBuy + trend.buy + trend.hold + trend.sell + trend.strongSell : 0;

  // Hitung Potensi Imbal Hasil berdasarkan Target Price Rata-rata
  const upsidePotential = stock.targetMeanPrice && stock.price > 0 ? (((stock.targetMeanPrice - stock.price) / stock.price) * 100).toFixed(1) : null;

  return (
    <div className="flex flex-col flex-1 w-full bg-neutral-950 text-white font-sans selection:bg-emerald-500 selection:text-neutral-950">
      <main className="flex-1">
        {/* Header Navigasi Sub-Bar */}
        <header className="border-b border-neutral-800 bg-neutral-900/90 backdrop-blur px-6 py-3.5 flex items-center justify-between sticky top-14 z-30">
          <Link href="/" className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5">
            ← Kembali ke Heatmap
          </Link>
          <div className="text-xs text-neutral-400 bg-neutral-800/80 px-3 py-1 rounded-full border border-neutral-700">{stock.exchange} • Real-time Data</div>
        </header>

        {/* Main Container */}
        <div className="max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col gap-6">
          {/* Hero Stock Header */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <span className="text-3xl md:text-4xl font-black tracking-tight text-white">{stock.symbol}</span>
                <span className={`text-xs md:text-sm font-bold px-2.5 py-1 rounded-lg ${isPositive ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/20 text-rose-400 border border-rose-500/30"}`}>
                  {isPositive ? "+" : ""}
                  {stock.change.toFixed(2)}%
                </span>
                {stock.sector && <span className="text-xs bg-neutral-800 text-neutral-300 px-2.5 py-1 rounded-md border border-neutral-700">{stock.sector}</span>}
              </div>
              <h1 className="text-base md:text-lg text-neutral-300 font-medium">{stock.name}</h1>
              <p className="text-xs text-neutral-400">
                Industri: <span className="text-neutral-200">{stock.industry}</span> | Lokasi:{" "}
                <span className="text-neutral-200">
                  {stock.city ? `${stock.city}, ` : ""}
                  {stock.country}
                </span>
              </p>
            </div>

            <div className="text-left lg:text-right bg-neutral-950/60 p-4 rounded-xl border border-neutral-800 w-full lg:w-auto">
              <p className="text-xs text-neutral-400 mb-1">Harga Saat Ini</p>
              <p className="text-3xl md:text-4xl font-extrabold text-white">Rp {stock.price.toLocaleString("id-ID")}</p>
              <p className="text-xs text-neutral-400 mt-1">Volume: {(stock.volume / 1000000).toFixed(2)} Juta Lembar</p>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Market Cap */}
            <div className="relative group bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">Market Cap</span>
                <span className="text-[10px] text-neutral-400 hover:text-emerald-400 cursor-help font-mono w-4 h-4 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">?</span>
              </div>
              <span className="text-sm font-bold mt-2 truncate text-white">Rp {(stock.marketCap / 1e9).toLocaleString("id-ID", { maximumFractionDigits: 1 })} Miliar</span>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-52 p-2.5 bg-neutral-950/95 border border-neutral-700/80 rounded-xl shadow-2xl backdrop-blur-md z-30 text-[10px] text-neutral-300 leading-snug">
                <p className="font-bold text-emerald-400 mb-1">Market Capitalization</p>
                Total nilai pasar seluruh saham perusahaan (Harga Saham × Jumlah Saham Beredar).
              </div>
            </div>

            {/* P/E Ratio */}
            <div className="relative group bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">P/E Ratio</span>
                <span className="text-[10px] text-neutral-400 hover:text-emerald-400 cursor-help font-mono w-4 h-4 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">?</span>
              </div>
              <span className="text-sm font-bold mt-2 text-white">{stock.trailingPE ? stock.trailingPE.toFixed(2) : "N/A"}</span>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-52 p-2.5 bg-neutral-950/95 border border-neutral-700/80 rounded-xl shadow-2xl backdrop-blur-md z-30 text-[10px] text-neutral-300 leading-snug">
                <p className="font-bold text-emerald-400 mb-1">Price to Earnings Ratio</p>
                Rasio valuasi harga saham terhadap laba bersih per lembar (EPS). Semakin kecil biasanya semakin murah.
              </div>
            </div>

            {/* PBV */}
            <div className="relative group bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">PBV</span>
                <span className="text-[10px] text-neutral-400 hover:text-emerald-400 cursor-help font-mono w-4 h-4 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">?</span>
              </div>
              <span className="text-sm font-bold mt-2 text-white">{stock.priceToBook ? stock.priceToBook.toFixed(2) : "N/A"}</span>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-52 p-2.5 bg-neutral-950/95 border border-neutral-700/80 rounded-xl shadow-2xl backdrop-blur-md z-30 text-[10px] text-neutral-300 leading-snug">
                <p className="font-bold text-emerald-400 mb-1">Price to Book Value</p>
                Membandingkan harga saham dengan nilai buku ekuitas perusahaan. PBV &lt; 1 sering dianggap undervalued.
              </div>
            </div>

            {/* 52W High */}
            <div className="relative group bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">52W High</span>
                <span className="text-[10px] text-neutral-400 hover:text-emerald-400 cursor-help font-mono w-4 h-4 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">?</span>
              </div>
              <span className="text-sm font-bold mt-2 text-emerald-400">Rp {stock.fiftyTwoWeekHigh ? stock.fiftyTwoWeekHigh.toLocaleString("id-ID") : "N/A"}</span>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-52 p-2.5 bg-neutral-950/95 border border-neutral-700/80 rounded-xl shadow-2xl backdrop-blur-md z-30 text-[10px] text-neutral-300 leading-snug">
                <p className="font-bold text-emerald-400 mb-1">52-Week High</p>
                Harga tertinggi saham ini dalam rentang waktu 1 tahun (52 minggu) terakhir.
              </div>
            </div>

            {/* 52W Low */}
            <div className="relative group bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">52W Low</span>
                <span className="text-[10px] text-neutral-400 hover:text-emerald-400 cursor-help font-mono w-4 h-4 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">?</span>
              </div>
              <span className="text-sm font-bold mt-2 text-rose-400">Rp {stock.fiftyTwoWeekLow ? stock.fiftyTwoWeekLow.toLocaleString("id-ID") : "N/A"}</span>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-52 p-2.5 bg-neutral-950/95 border border-neutral-700/80 rounded-xl shadow-2xl backdrop-blur-md z-30 text-[10px] text-neutral-300 leading-snug">
                <p className="font-bold text-rose-400 mb-1">52-Week Low</p>
                Harga terendah saham ini dalam rentang waktu 1 tahun (52 minggu) terakhir.
              </div>
            </div>

            {/* Dividend Yield */}
            <div className="relative group bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">Dividend Yield</span>
                <span className="text-[10px] text-neutral-400 hover:text-emerald-400 cursor-help font-mono w-4 h-4 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">?</span>
              </div>
              <span className="text-sm font-bold mt-2 text-white">{stock.dividendYield ? `${(stock.dividendYield * 100).toFixed(2)}%` : "N/A"}</span>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-52 p-2.5 bg-neutral-950/95 border border-neutral-700/80 rounded-xl shadow-2xl backdrop-blur-md z-30 text-[10px] text-neutral-300 leading-snug">
                <p className="font-bold text-emerald-400 mb-1">Dividend Yield</p>
                Persentase imbal hasil dividen tahunan yang dibagikan emiten dibandingkan terhadap harga saham saat ini.
              </div>
            </div>
          </div>

          {/* Interactive TradingView Chart */}
          <StockChart symbol={stock.symbol} />

          {/* Widget Konsensus Analis & Target Harga */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl flex flex-col lg:flex-row justify-between gap-6">
            <div className="lg:w-1/3 space-y-3 border-b lg:border-b-0 lg:border-r border-neutral-800 pb-4 lg:pb-0 lg:pr-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <span>🎯</span> Konsensus Analis
                    </h2>

                    {/* Tooltip Disclaimer Tanda Seru (!) */}
                    <div className="relative group/tooltip inline-block">
                      <button
                        type="button"
                        className="text-neutral-400 hover:text-amber-400 text-xs font-mono w-4 h-4 rounded-full bg-neutral-800 hover:bg-neutral-700 border border-neutral-700/80 flex items-center justify-center transition-colors cursor-help"
                        aria-label="Disclaimer Data"
                      >
                        !
                      </button>

                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/tooltip:block w-64 p-3 bg-neutral-950/95 border border-neutral-700/80 rounded-xl shadow-2xl backdrop-blur-md z-30 text-[11px] leading-snug text-neutral-300">
                        <p className="font-semibold text-amber-400 mb-1 flex items-center gap-1">
                          <span>⚠️</span> Disclaimer Finansial
                        </p>
                        <p className="text-neutral-400 text-[10px]">Data disarikan secara otomatis dari agregator finansial murni untuk referensi analitis dan edukasi, bukan merupakan rekomendasi atau ajakan jual-beli efek.</p>
                      </div>
                    </div>
                  </div>

                  {getRecommendationBadge(stock.recommendationKey)}
                </div>

                <p className="text-xs text-neutral-400">
                  Rangkuman riset independen dari <span className="text-white font-semibold">{stock.numberOfAnalystOpinions || 0} analis</span> sekuritas.
                </p>

                {stock.targetMeanPrice && (
                  <div className="bg-neutral-950/70 p-4 rounded-xl border border-neutral-800 mt-4 space-y-1">
                    <span className="text-[11px] text-neutral-400 block">Target Harga Rata-rata (12 Bulan):</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold text-emerald-400">Rp {stock.targetMeanPrice.toLocaleString("id-ID")}</span>
                      {upsidePotential && (
                        <span className={`text-xs font-bold ${Number(upsidePotential) >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                          ({Number(upsidePotential) >= 0 ? "+" : ""}
                          {upsidePotential}%)
                        </span>
                      )}
                    </div>
                    {stock.targetHighPrice && stock.targetLowPrice && (
                      <div className="flex justify-between text-[10px] text-neutral-400 pt-1 border-t border-neutral-800/80 mt-2">
                        <span>Low: Rp {stock.targetLowPrice.toLocaleString("id-ID")}</span>
                        <span>High: Rp {stock.targetHighPrice.toLocaleString("id-ID")}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Breakdown Visualisasi Suara Analis Berwarna */}
            <div className="lg:w-2/3 flex flex-col justify-center gap-3">
              <span className="text-xs font-semibold text-neutral-300">Sebaran Rekomendasi Analis:</span>

              {totalVotes > 0 ? (
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between text-neutral-400 mb-1">
                      <span>Sangat Beli (Strong Buy)</span>
                      <span className="font-mono text-emerald-400 font-bold">{trend?.strongBuy} Analis</span>
                    </div>
                    <div className="w-full h-2.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                      <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${((trend?.strongBuy || 0) / totalVotes) * 100}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-neutral-400 mb-1">
                      <span>Beli (Buy)</span>
                      <span className="font-mono text-emerald-300 font-bold">{trend?.buy} Analis</span>
                    </div>
                    <div className="w-full h-2.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                      <div className="h-full bg-emerald-400 transition-all duration-500" style={{ width: `${((trend?.buy || 0) / totalVotes) * 100}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-neutral-400 mb-1">
                      <span>Tahan (Hold)</span>
                      <span className="font-mono text-amber-400 font-bold">{trend?.hold} Analis</span>
                    </div>
                    <div className="w-full h-2.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                      <div className="h-full bg-amber-400 transition-all duration-500" style={{ width: `${((trend?.hold || 0) / totalVotes) * 100}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-neutral-400 mb-1">
                      <span>Jual (Sell) / Underperform</span>
                      <span className="font-mono text-rose-400 font-bold">{(trend?.sell || 0) + (trend?.strongSell || 0)} Analis</span>
                    </div>
                    <div className="w-full h-2.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                      <div className="h-full bg-rose-500 transition-all duration-500" style={{ width: `${(((trend?.sell || 0) + (trend?.strongSell || 0)) / totalVotes) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-neutral-950/40 p-6 rounded-xl border border-neutral-800 text-xs text-neutral-400 text-center">Rincian suara analis belum tersedia untuk emiten ini dari sumber data pasar global.</div>
              )}
            </div>
          </div>

          {/* Berita Spesifik Emiten */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white border-b border-neutral-800 pb-3 flex items-center gap-2">
              <span>📰</span> Berita & Kabar Terkini Menyorot {stock.symbol}
            </h2>

            {stock.news && stock.news.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stock.news.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-neutral-950/60 border border-neutral-800 hover:border-emerald-500/50 p-4 rounded-xl flex flex-col justify-between transition hover:-translate-y-0.5 shadow"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] text-neutral-400 font-mono">
                        <span className="bg-neutral-800 text-emerald-400 px-2 py-0.5 rounded font-bold">{item.source}</span>
                        <span>{item.pubDate}</span>
                      </div>
                      <h3 className="text-xs font-bold text-neutral-200 group-hover:text-emerald-300 transition line-clamp-3 leading-snug">{item.title}</h3>
                    </div>
                    <div className="mt-3 pt-2 border-t border-neutral-800/60 text-[10px] text-emerald-400 text-right font-semibold">Baca Artikel ↗</div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-400 italic">Belum ada berita terbaru khusus emiten {stock.symbol}.</p>
            )}
          </div>

          {/* Profile & Detailed Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <h2 className="text-base font-bold text-white mb-4 border-b border-neutral-800 pb-2 flex items-center gap-2">
                  <span>🏢</span> Deskripsi & Profil Perusahaan
                </h2>
                <p className="text-sm text-neutral-300 leading-relaxed text-justify mb-4">{stock.description}</p>
              </div>
              {stock.website && (
                <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between">
                  <span className="text-xs text-neutral-400">Situs Resmi Emiten:</span>
                  <a href={stock.website} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-emerald-400 hover:underline truncate max-w-[280px]">
                    {stock.website} ↗
                  </a>
                </div>
              )}
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <h2 className="text-base font-bold text-white mb-4 border-b border-neutral-800 pb-2 flex items-center gap-2">
                  <span>📊</span> Statistik Pasar Lengkap
                </h2>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center border-b border-neutral-800/50 pb-2">
                    <span className="text-neutral-400">Forward P/E</span>
                    <span className="font-semibold text-white">{stock.forwardPE ? stock.forwardPE.toFixed(2) : "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-neutral-800/50 pb-2">
                    <span className="text-neutral-400">Beta (Volatilitas)</span>
                    <span className="font-semibold text-white">{stock.beta ? stock.beta.toFixed(2) : "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-neutral-800/50 pb-2">
                    <span className="text-neutral-400">EBITDA</span>
                    <span className="font-semibold text-white">{stock.ebitda ? `Rp ${(stock.ebitda / 1e9).toLocaleString("id-ID", { maximumFractionDigits: 0 })} M` : "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-neutral-800/50 pb-2">
                    <span className="text-neutral-400">Profit Margin</span>
                    <span className="font-semibold text-emerald-400">{stock.profitMargins ? `${(stock.profitMargins * 100).toFixed(2)}%` : "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Jumlah Karyawan</span>
                    <span className="font-semibold text-white">{stock.fullTimeEmployees ? stock.fullTimeEmployees.toLocaleString("id-ID") : "N/A"} Orang</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
