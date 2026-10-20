"use client";

interface StockChartProps {
  symbol: string;
}

export default function StockChart({ symbol }: StockChartProps) {
  // Bersihkan simbol dari akhiran .JK jika ada (contoh: BBCA.JK -> BBCA)
  const cleanSymbol = symbol.replace(".JK", "").toUpperCase();

  // URL Widget TradingView Advanced Chart
  const tvUrl = `https://s.tradingview.com/widgetembed/?frameElementId=tradingview_chart&symbol=IDX%3A${cleanSymbol}&interval=D&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&theme=dark&style=1&timezone=Asia%2FJakarta&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=id&utm_source=localhost&utm_medium=widget&utm_campaign=chart&utm_term=IDX%3A${cleanSymbol}`;

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 md:p-6 shadow-xl flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Grafik Pergerakan Harga ({cleanSymbol})
        </h2>
        <span className="text-xs text-neutral-400 bg-neutral-800 px-2.5 py-1 rounded-md border border-neutral-700">TradingView Chart</span>
      </div>

      <div className="w-full h-[400px] md:h-125 rounded-xl overflow-hidden border border-neutral-800/80 bg-neutral-950">
        <iframe title={`TradingView Chart ${cleanSymbol}`} src={tvUrl} className="w-full h-full border-0" allowFullScreen></iframe>
      </div>
    </div>
  );
}
