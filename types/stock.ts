export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  marketCap: number;
  volume: number;
  sector: string;
  isEditorPick?: boolean;

  // --- Atribut Tambahan untuk Stock Screener ---
  trailingPE?: number | null;
  priceToBook?: number | null;
  dividendYield?: number | null;
  fiftyTwoWeekHigh?: number | null;
  fiftyTwoWeekLow?: number | null;
}

export interface StockNewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
}

export interface RecommendationTrend {
  strongBuy: number;
  buy: number;
  hold: number;
  sell: number;
  strongSell: number;
}

export interface StockDetail {
  symbol: string;
  name: string;
  sector?: string;
  industry: string;
  exchange: string;
  currency: string;
  price: number;
  change: number;
  volume: number;
  marketCap: number;
  trailingPE?: number | null;
  forwardPE?: number | null;
  priceToBook?: number | null;
  fiftyTwoWeekHigh?: number | null;
  fiftyTwoWeekLow?: number | null;
  dividendYield?: number | null;
  beta?: number | null;
  ebitda?: number | null;
  profitMargins?: number | null;
  revenueGrowth?: number | null;
  fullTimeEmployees?: number | null;
  description: string;
  city?: string;
  country?: string;
  website?: string;

  // Rekomendasi Analis & Berita Emiten
  recommendationKey?: string;
  targetMeanPrice?: number | null;
  targetHighPrice?: number | null;
  targetLowPrice?: number | null;
  numberOfAnalystOpinions?: number;
  recommendationTrend?: RecommendationTrend | null;
  news?: StockNewsItem[];
}

export interface YahooQuoteResult {
  shortName?: string;
  longName?: string;
  regularMarketPrice?: number;
  regularMarketChangePercent?: number;
  marketCap?: number;
  regularMarketVolume?: number;
  currency?: string;
  exchange?: string;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  trailingPE?: number;
  priceToBook?: number; // Ditambahkan untuk backend route.ts
  dividendYield?: number; // Ditambahkan untuk backend route.ts
}
