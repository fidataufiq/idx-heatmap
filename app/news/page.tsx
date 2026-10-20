"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  category: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastFetchTime, setLastFetchTime] = useState<string>("");

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

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-between font-sans selection:bg-emerald-500 selection:text-neutral-950">
      {/* Header Navigation */}
      <header className="border-b border-neutral-800/80 bg-neutral-900/90 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <Link href="/" className="bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition border border-neutral-700/60 flex items-center gap-1.5">
          ← Kembali ke Heatmap
        </Link>

        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 rounded-full text-xs text-emerald-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Live RSS Aggregator Stream
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[1600px] w-full mx-auto p-4 sm:p-6 md:p-8 flex-1 flex flex-col gap-6">
        {/* Banner Informasif & Header */}
        <div className="bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-emerald-950/30 border border-neutral-800 rounded-2xl p-6 shadow-2xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-1.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-0.5 rounded-md">
              <span>📡</span> Feed Berita Pasar Terintegrasi
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">Kabar Pasar & Sentimen IHSG</h1>
            <p className="text-xs md:text-sm text-neutral-400 leading-relaxed">Kumpulan berita ekonomi makro, kebijakan bursa, dan pengumuman emiten terkini yang dikategorikan secara otomatis.</p>
          </div>

          {/* Kotak Informasi Sumber & Update */}
          <div className="bg-neutral-950/80 border border-neutral-800 p-4 rounded-xl text-xs text-neutral-300 w-full lg:w-auto shrink-0 flex flex-col gap-2 shadow-inner">
            <div className="flex items-center justify-between gap-4">
              <span className="text-neutral-500">Sumber Data:</span>
              <span className="font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">Google News RSS & Media Finansial</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-neutral-500">Frekuensi Update:</span>
              <span className="font-semibold text-neutral-200">Real-time / Auto Refresh</span>
            </div>
            <div className="flex items-center justify-between gap-4 pt-1 border-t border-neutral-800/80">
              <span className="text-neutral-500">Pembaruan Terakhir:</span>
              <span className="font-mono text-emerald-300 font-bold">{lastFetchTime || "Memuat..."}</span>
            </div>
            <button
              onClick={() => loadNewsData(true)}
              disabled={loading}
              className="mt-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold py-1.5 rounded-lg border border-neutral-700 text-[11px] transition flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <span>🔄</span> Refresh Berita Sekarang
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-neutral-900/40 border border-neutral-800/60 rounded-2xl p-5 h-48 animate-pulse flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="h-4 bg-neutral-800/80 rounded w-1/3"></div>
                  <div className="h-4 bg-neutral-800/60 rounded w-full"></div>
                  <div className="h-4 bg-neutral-800/60 rounded w-4/5"></div>
                </div>
                <div className="h-3 bg-neutral-800/40 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-8 rounded-2xl text-center text-sm font-medium">⚠️ {error}</div>}

        {/* News Grid (4 Kolom) */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {news.map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-gradient-to-b from-neutral-900/90 to-neutral-950/80 border border-neutral-800/80 hover:border-emerald-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/5 overflow-hidden"
              >
                {/* Akses Garis Kiri Glow */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div>
                  {/* Category Badge & Publish Time */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-md truncate max-w-[130px]">{item.category}</span>
                    <span className="text-[10px] font-mono text-neutral-500 shrink-0">{item.pubDate}</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xs md:text-sm font-bold text-neutral-200 group-hover:text-emerald-300 transition-colors line-clamp-3 leading-snug tracking-tight">{item.title}</h2>
                </div>

                {/* Footer Card: Media Source & Link */}
                <div className="mt-4 pt-3 border-t border-neutral-800/60 flex items-center justify-between text-[11px] font-medium">
                  <span className="text-[10px] font-semibold text-neutral-400 truncate max-w-[140px] bg-neutral-800/60 px-2 py-0.5 rounded border border-neutral-700/50">📰 {item.source}</span>
                  <span className="text-emerald-400 text-xs group-hover:translate-x-1 transition-transform">Baca ↗</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
