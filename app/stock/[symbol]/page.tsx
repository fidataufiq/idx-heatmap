import { Suspense } from "react";
import StockDetailClient from "@/components/StockDetailClient";

// Mengizinkan blocking route untuk akses params di Next.js 16
export const instant = false;

export default async function StockDetailPage({ params }: { params: Promise<{ symbol: string }> }) {
  const resolvedParams = await params;
  const symbol = resolvedParams.symbol;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-neutral-400">Memuat halaman detail saham...</p>
          </div>
        </div>
      }
    >
      <StockDetailClient symbol={symbol} />
    </Suspense>
  );
}
