export function getHeatmapColor(change: number): string {
  if (change >= 5) return "bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white";
  if (change > 0) return "bg-emerald-900/90 hover:bg-emerald-800 border-emerald-700/60 text-emerald-100";
  if (change === 0) return "bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-300";
  if (change <= -5) return "bg-rose-600 hover:bg-rose-500 border-rose-500 text-white";
  return "bg-rose-900/90 hover:bg-rose-800 border-rose-700/60 text-rose-100";
}

export function formatCurrency(amount: number): string {
  return amount > 1000 ? amount.toLocaleString("id-ID") : amount.toString();
}
