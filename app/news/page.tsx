"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  category: string;
}

const NEWS_CATEGORIES = ["Semua Berita", "🔥 Terhangat & Populer", "🚨 Makro & Kebijakan", "📈 Market & IHSG", "🏦 Perbankan & Finansial", "⛏️ Energi & Komoditas", "🛍️ Konsumer & Otomotif", "💻 Teknologi & BUMN"];

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastFetchTime, setLastFetchTime] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua Berita");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const loadNewsData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setLoading(true);
    }
    setError("");
    try {
      const res = await fetch("/api/news");
      const json = await res.json();
      if (json.success) {
        setNews(json.data);
        const now = new Date();
        setLastFetchTime(
          now.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }) + " WIB",
        );
      } else {
        setError(json.error || "Gagal memuat berita");
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan koneksi jaringan");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function initFetch() {
      try {
        const res = await fetch("/api/news");
        const json = await res.json();
        if (!ignore) {
          if (json.success) {
            setNews(json.data);
            const now = new Date();
            setLastFetchTime(
              now.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }) + " WIB",
            );
          } else {
            setError(json.error || "Gagal memuat berita");
          }
        }
      } catch (err) {
        if (!ignore) {
          console.error(err);
          setError("Terjadi kesalahan koneksi jaringan");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    initFetch();

    return () => {
      ignore = true;
    };
  }, []);

  // Filter Pintar: Mencegah Kategori Sepi dengan Pencocokan Fleksibel Multi-Kata Kunci
  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      const title = item.title.toLowerCase();
      const cat = item.category.toLowerCase();
      const source = item.source.toLowerCase();
      const query = searchQuery.toLowerCase();

      // Pencarian Kata Kunci
      if (query && !title.includes(query) && !source.includes(query) && !cat.includes(query)) {
        return false;
      }

      if (selectedCategory === "Semua Berita") return true;

      if (selectedCategory === "🔥 Terhangat & Populer") {
        return true; // Menampilkan seluruh feed berita terbaru tanpa terpotong
      }

      if (selectedCategory === "🚨 Makro & Kebijakan") {
        return cat.includes("makro") || /bi|suku bunga|inflasi|pajak|pemerintah|ekonomi|rupiah|fed|menteri|dpr|kebijakan|fiskal|anggaran/i.test(title);
      }

      if (selectedCategory === "📈 Market & IHSG") {
        return cat.includes("market") || /ihsg|saham|indeks|dividen|bursa|ipo|cuan|laba|rugi|emiten|investor|trader|reksadana|bonds/i.test(title);
      }

      if (selectedCategory === "🏦 Perbankan & Finansial") {
        return cat.includes("finansial") || cat.includes("bank") || /bank|bbca|bbri|bmri|bbni|bsea|kredit|pinjol|fintech|bca|mandiri|bni|bri|asuransi|multifinance/i.test(title);
      }

      if (selectedCategory === "⛏️ Energi & Komoditas") {
        return cat.includes("energi") || cat.includes("tambang") || /minyak|batu bara|batubara|nikel|emas|pln|pertamina|cpo|sawit|tembaga|gas|komoditas/i.test(title);
      }

      if (selectedCategory === "🛍️ Konsumer & Otomotif") {
        return cat.includes("konsumer") || cat.includes("otomotif") || /mobil|motor|ev|listrik|retail|pangan|fmcg|belanja|harga|diskon|saham|pabrik|ekspor|impor/i.test(title);
      }

      if (selectedCategory === "💻 Teknologi & BUMN") {
        return cat.includes("tekno") || /digital|telco|isat|tlkm|goto|bumn|telkom|xl|smartfren|startup|ai|teknologi|siber/i.test(title);
      }

      return true;
    });
  }, [news, selectedCategory, searchQuery]);

  return (
    <div className="flex flex-col flex-1 w-full bg-neutral-950 text-white font-mono selection:bg-neutral-800 selection:text-white">
      {/* Sub-Header Navigasi Sticky */}
      <div className="sticky top-12 z-40 border-b border-neutral-800 bg-neutral-950 px-3 sm:px-4 py-2 flex items-center justify-between gap-2">
        <Link href="/" className="text-neutral-400 hover:text-white text-xs transition flex items-center gap-1.5 shrink-0">
          ← Kembali ke Heatmap
        </Link>

        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Cari berita..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 font-mono w-36 sm:w-52 transition"
          />
          <div className="hidden sm:flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[10px] text-emerald-400 font-bold shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Live Feed
          </div>
        </div>
      </div>

      {/* Filter Quick Pills Bar - Kategori Ringkas & Pasti Padat Berita */}
      <div className="px-3 sm:px-4 py-1.5 border-b border-neutral-800 bg-neutral-950 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
        {NEWS_CATEGORIES.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-2.5 py-0.5 rounded text-[11px] font-mono transition-all whitespace-nowrap border shrink-0 ${
                isActive ? "bg-neutral-100 text-neutral-950 font-bold border-neutral-100 shadow-sm" : "bg-neutral-900/80 text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-white"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Main Container */}
      <main className="w-full px-3 sm:px-4 py-4 sm:py-5 flex-1 flex flex-col gap-4">
        {/* Sub-Banner Header */}
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span>📰</span> Live Stream Sentimen & Kabar Pasar
            </h1>
            <p className="text-[11px] text-neutral-400 font-sans">
              Menampilkan <strong className="text-emerald-400">{filteredNews.length}</strong> dari {news.length} artikel berita terverifikasi
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-neutral-400 shrink-0">
            <span>
              Pembaruan: <strong className="text-emerald-400">{lastFetchTime || "Memuat..."}</strong>
            </span>
            <button
              onClick={() => loadNewsData(true)}
              disabled={loading}
              className="bg-neutral-900 hover:bg-neutral-800 text-neutral-200 font-semibold px-2.5 py-1 rounded border border-neutral-800 text-[10px] transition flex items-center gap-1 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 py-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-neutral-900/30 border border-neutral-800/60 rounded-xl p-4 h-36 animate-pulse flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="h-3 bg-neutral-800 rounded w-1/3"></div>
                  <div className="h-3 bg-neutral-800/60 rounded w-full"></div>
                  <div className="h-3 bg-neutral-800/60 rounded w-4/5"></div>
                </div>
                <div className="h-2.5 bg-neutral-800/40 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && <div className="bg-rose-950/30 border border-rose-500/30 text-rose-400 p-6 rounded-xl text-center text-xs">⚠️ {error}</div>}

        {/* Fallback Jika Tidak Ada Berita */}
        {!loading && !error && filteredNews.length === 0 && (
          <div className="flex h-48 items-center justify-center flex-col gap-2 text-neutral-500 text-xs font-mono">
            <p>Tidak ada berita yang cocok untuk pencarian ini.</p>
            <button
              onClick={() => {
                setSelectedCategory("Semua Berita");
                setSearchQuery("");
              }}
              className="text-emerald-400 underline hover:text-emerald-300"
            >
              Tampilkan Semua Berita
            </button>
          </div>
        )}

        {/* News Grid Padat Multi-Kolom */}
        {!loading && !error && filteredNews.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredNews.map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-neutral-900/40 border border-neutral-800 hover:border-emerald-500/50 rounded-xl p-3.5 flex flex-col justify-between transition-all duration-200 hover:scale-[1.01] hover:bg-neutral-900/70 overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.2 rounded truncate max-w-[130px]">{item.category || "Finansial"}</span>
                    <span className="text-[10px] text-neutral-500 shrink-0">{item.pubDate}</span>
                  </div>

                  <h2 className="text-xs font-semibold text-neutral-200 group-hover:text-emerald-300 transition-colors line-clamp-3 leading-snug">{item.title}</h2>
                </div>

                <div className="mt-3 pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-neutral-400 truncate max-w-[140px] bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800">📰 {item.source}</span>
                  <span className="text-emerald-400 font-bold group-hover:translate-x-0.5 transition-transform">Baca ↗</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
