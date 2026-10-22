import { NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";
import { IDX_SYMBOLS, EDITOR_PICKS, getSectorBySymbol } from "@/config/stocks";
import { YahooQuoteResult } from "@/types/stock";

const yahooFinance = new YahooFinance();

export async function GET() {
  try {
    // Menghilangkan duplikat secara otomatis menggunakan Set
    const uniqueSymbols = Array.from(new Set(IDX_SYMBOLS));

    const results = await Promise.all(
      uniqueSymbols.map(async (symbol) => {
        try {
          const quote = (await yahooFinance.quote(symbol)) as unknown as YahooQuoteResult;
          return {
            symbol: symbol.replace(".JK", ""),
            name: quote?.shortName || quote?.longName || symbol,
            price: quote?.regularMarketPrice || 0,
            change: quote?.regularMarketChangePercent || 0,
            marketCap: quote?.marketCap || 0,
            volume: quote?.regularMarketVolume || 0,
            sector: getSectorBySymbol(symbol),
            isEditorPick: EDITOR_PICKS.includes(symbol),

            // --- Atribut Tambahan untuk Stock Screener Cerdas ---
            trailingPE: quote?.trailingPE ?? null,
            priceToBook: quote?.priceToBook ?? null,
            dividendYield: quote?.dividendYield ?? 0,
            fiftyTwoWeekHigh: quote?.fiftyTwoWeekHigh ?? null,
            fiftyTwoWeekLow: quote?.fiftyTwoWeekLow ?? null,
          };
        } catch {
          return null;
        }
      }),
    );

    const validStocks = results.filter((item): item is NonNullable<typeof item> => item !== null);

    return NextResponse.json({ success: true, count: validStocks.length, data: validStocks });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal mengambil data" }, { status: 500 });
  }
}
