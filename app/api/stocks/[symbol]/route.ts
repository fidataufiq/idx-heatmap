import { NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";
import Parser from "rss-parser";
import NodeCache from "node-cache";
import { YahooQuoteResult } from "@/types/stock";

const yahooFinance = new YahooFinance();
const parser = new Parser();

// Inisialisasi Cache: Data disimpan di memori server selama 3 menit (180 detik)
const stockCache = new NodeCache({ stdTTL: 180, checkperiod: 60 });

interface CustomItem {
  title?: string;
  link?: string;
  pubDate?: string;
  creator?: string;
  author?: string;
}

function cleanSource(item: CustomItem): string {
  if (item.title && item.title.includes(" - ")) {
    const parts = item.title.split(" - ");
    const possibleSource = parts[parts.length - 1].trim();
    if (possibleSource.length > 0 && possibleSource.length < 30) {
      return possibleSource;
    }
  }
  return item.creator || item.author || "Portal Finansial";
}

function cleanTitle(title: string): string {
  if (title.includes(" - ")) {
    const parts = title.split(" - ");
    parts.pop();
    return parts.join(" - ").trim();
  }
  return title;
}

export async function GET(request: Request, { params }: { params: Promise<{ symbol: string }> }) {
  try {
    const resolvedParams = await params;
    const rawSymbol = resolvedParams.symbol.toUpperCase();
    const cleanSymbol = rawSymbol.replace(".JK", "");
    const symbol = `${cleanSymbol}.JK`;
    const cacheKey = `stock_detail_${cleanSymbol}`;

    // 1. Cek apakah data sudah ada di cache server (Instant Response)
    const cachedData = stockCache.get(cacheKey);
    if (cachedData) {
      return NextResponse.json({ success: true, data: cachedData, cached: true });
    }

    // 2. Jika belum ada di cache, lakukan fetch paralel ke Yahoo Finance & RSS Berita
    const [quoteResult, summary, newsFeed] = await Promise.all([
      yahooFinance.quote(symbol).catch(() => null),
      yahooFinance
        .quoteSummary(symbol, {
          modules: ["summaryProfile", "financialData", "defaultKeyStatistics", "summaryDetail", "recommendationTrend"],
        })
        .catch(() => null),
      parser.parseURL(`https://news.google.com/rss/search?q=saham+${cleanSymbol}+Indonesia&hl=id&gl=ID&ceid=ID:id`).catch(() => null),
    ]);

    if (!quoteResult) {
      return NextResponse.json({ success: false, error: `Saham dengan kode ${cleanSymbol} tidak ditemukan di IDX.` }, { status: 404 });
    }

    const quote = quoteResult as unknown as YahooQuoteResult;
    const profile = summary?.summaryProfile;
    const financial = summary?.financialData;
    const stats = summary?.defaultKeyStatistics;
    const details = summary?.summaryDetail;
    const recTrend = summary?.recommendationTrend?.trend?.[0];

    // Ekstraksi Berita Emiten
    const items = (newsFeed?.items || []) as CustomItem[];
    const stockNews = items.slice(0, 6).map((item) => {
      const rawTitle = item.title || "Tanpa Judul";
      return {
        title: cleanTitle(rawTitle),
        link: item.link || "#",
        pubDate: item.pubDate
          ? new Date(item.pubDate).toLocaleString("id-ID", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Baru saja",
        source: cleanSource(item),
      };
    });

    const detailData = {
      symbol: cleanSymbol,
      name: quote.shortName || quote.longName || cleanSymbol,
      sector: profile?.sector || "IDX Saham",
      industry: profile?.industry || "Industri Umum",
      exchange: quote.exchange || "IDX",
      currency: quote.currency || "IDR",
      price: quote.regularMarketPrice || details?.regularMarketPrice || 0,
      change: quote.regularMarketChangePercent || 0,
      marketCap: quote.marketCap || financial?.marketCap || details?.marketCap || 0,
      volume: quote.regularMarketVolume || details?.volume || 0,
      trailingPE: quote.trailingPE || details?.trailingPE || null,
      forwardPE: details?.forwardPE || null,
      priceToBook: stats?.priceToBook || null,
      fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh || stats?.fiftyTwoWeekHigh || details?.fiftyTwoWeekHigh || null,
      fiftyTwoWeekLow: quote.fiftyTwoWeekLow || stats?.fiftyTwoWeekLow || details?.fiftyTwoWeekLow || null,
      dividendYield: financial?.dividendYield || details?.dividendYield || null,
      beta: stats?.beta || details?.beta || null,
      ebitda: financial?.ebitda || null,
      profitMargins: financial?.profitMargins || null,
      description: profile?.longBusinessSummary || `Perusahaan ${quote.shortName || cleanSymbol} terdaftar di Bursa Efek Indonesia (IDX).`,
      website: profile?.website || "",
      fullTimeEmployees: profile?.fullTimeEmployees || null,
      country: profile?.country || "Indonesia",
      city: profile?.city || "",

      // Konsensus Analis
      recommendationKey: financial?.recommendationKey || "none",
      targetMeanPrice: financial?.targetMeanPrice || null,
      targetHighPrice: financial?.targetHighPrice || null,
      targetLowPrice: financial?.targetLowPrice || null,
      numberOfAnalystOpinions: financial?.numberOfAnalystOpinions || 0,
      recommendationTrend: recTrend
        ? {
            strongBuy: recTrend.strongBuy || 0,
            buy: recTrend.buy || 0,
            hold: recTrend.hold || 0,
            sell: recTrend.sell || 0,
            strongSell: recTrend.strongSell || 0,
          }
        : null,

      // Berita
      news: stockNews,
    };

    // 3. Simpan hasil fetch ke dalam cache sebelum dikembalikan ke client
    stockCache.set(cacheKey, detailData);

    return NextResponse.json({ success: true, data: detailData, cached: false });
  } catch (error) {
    console.error("Error fetching stock detail API:", error);
    return NextResponse.json({ success: false, error: "Gagal mengambil data detail saham" }, { status: 500 });
  }
}
