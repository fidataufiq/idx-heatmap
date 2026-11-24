"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Stock } from "@/types/stock";

interface StockScreenerProps {
  stocks: Stock[];
}

type ScreenerTab = "screener" | "dividend_calendar";

export interface DividendScheduleItem {
  exDate?: string | number | Date;
  paymentDate?: string | number | Date;
  note?: string;
}

interface DetailDividendPayload {
  exDividendDate?: string | number | Date;
  dividendDate?: string | number | Date;
  exDate?: string | number | Date;
  paymentDate?: string | number | Date;
  divExDate?: string | number | Date;
  divPayDate?: string | number | Date;
}

interface StockWithDividendDates extends Stock, Omit<DetailDividendPayload, "dividendYield"> {}

const PRESET_FILTERS = [
  { id: "all", label: "Semua Saham", desc: "Seluruh emiten" },
  { id: "undervalued", label: "💎 Undervalued", desc: "PBV ≤ 1.2x & PER ≤ 15x" },
  { id: "high_dividend", label: "💰 High Dividend", desc: "Div Yield ≥ 4%" },
  { id: "big_cap", label: "🏛️ Big Cap", desc: "Market Cap ≥ Rp 50T" },
  { id: "growth_gainers", label: "🚀 Gainers", desc: "Kenaikan ≥ 2%" },
];

function parseValidDate(raw?: string | number | Date): Date | null {
  if (!raw) return null;
  if (raw instanceof Date) {
    return Number.isNaN(raw.getTime()) ? null : raw;
  }
  if (typeof raw === "number") {
    const ms = raw < 1e12 ? raw * 1000 : raw;
    const d = new Date(ms);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatShortDateID(raw?: string | number | Date): string | null {
  const date = parseValidDate(raw);
  if (!date) return null;
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
  });
}

function formatMarketCapCompact(marketCap: number): string {
  const trillion = marketCap / 1e12;
  if (trillion >= 1) return `${trillion.toFixed(1)}T`;
  const billion = marketCap / 1e9;
  return `${billion.toFixed(0)}M`;
}

function extractDividendFromDetail(data: DetailDividendPayload & { dividendYield?: number }): DividendScheduleItem | null {
  const exRaw = data.exDividendDate ?? data.dividendDate ?? data.exDate ?? data.divExDate;
  const payRaw = data.paymentDate ?? data.divPayDate;

  const validEx = parseValidDate(exRaw);
  const validPay = parseValidDate(payRaw);

  if (!validEx && !validPay) return null;

  return {
    exDate: validEx ? validEx.toISOString() : undefined,
    paymentDate: validPay ? validPay.toISOString() : undefined,
    note: "Yahoo Finance",
  };
}

export default function StockScreener({ stocks }: StockScreenerProps) {
  const [activeTab, setActiveTab] = useState<ScreenerTab>("screener");
  const [selectedPreset, setSelectedPreset] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter Fundamental
  const [maxPBV, setMaxPBV] = useState<number>(5);
  const [maxPE, setMaxPE] = useState<number>(30);
  const [minYield, setMinYield] = useState<number>(0);
  const [minMarketCapT, setMinMarketCapT] = useState<number>(0);

  // Filter & State Kalender Dividen
  const [onlyPayingDividend, setOnlyPayingDividend] = useState<boolean>(true);
  const [monthFilter, setMonthFilter] = useState<string>("all");
  const [fetchedSchedules, setFetchedSchedules] = useState<Record<string, DividendScheduleItem>>({});
  const [isSyncingDividends, setIsSyncingDividends] = useState<boolean>(false);
  const [syncProgress, setSyncProgress] = useState<{ done: number; total: number }>({
    done: 0,
    total: 0,
  });

  const fetchedRef = useRef<Set<string>>(new Set());

  const syncDividendSchedules = useCallback(
    async (forceAll = false) => {
      if (isSyncingDividends) return;

      const candidates = stocks
        .filter((s) => {
          const sym = s.symbol.toUpperCase();
          if (!forceAll && fetchedRef.current.has(sym)) return false;
          if (!forceAll && (s.dividendYield || 0) <= 0) return false;
          return true;
        })
        .slice(0, 30);

      if (candidates.length === 0) return;

      setIsSyncingDividends(true);
      setSyncProgress({ done: 0, total: candidates.length });

      const concurrency = 4;
      let index = 0;
      let completed = 0;

      const worker = async () => {
        while (index < candidates.length) {
          const current = candidates[index++];
          const sym = current.symbol.toUpperCase();
          fetchedRef.current.add(sym);

          try {
            const res = await fetch(`/api/stocks/${encodeURIComponent(current.symbol)}`);
            if (res.ok) {
              const json = await res.json();
              const payload: (DetailDividendPayload & { dividendYield?: number }) | undefined = json?.data ?? json;
              if (payload) {
                const parsed = extractDividendFromDetail(payload);
                if (parsed) {
                  setFetchedSchedules((prev) => ({
                    ...prev,
                    [sym]: parsed,
                  }));
                }
              }
            }
          } catch {
            // Abaikan error per emiten
          } finally {
            completed += 1;
            setSyncProgress({ done: completed, total: candidates.length });
          }
        }
      };

      await Promise.all(Array.from({ length: Math.min(concurrency, candidates.length) }, worker));
      setIsSyncingDividends(false);
    },
    [stocks, isSyncingDividends],
  );

  useEffect(() => {
    if (activeTab === "dividend_calendar" && fetchedRef.current.size === 0) {
      syncDividendSchedules(false);
    }
  }, [activeTab, syncDividendSchedules]);

  const enrichedStocks = useMemo(() => {
    return stocks.map((rawStock) => {
      const stock = rawStock as StockWithDividendDates;
      const sym = stock.symbol.toUpperCase();
      const fetched = fetchedSchedules[sym];

      const resolvedExDate = fetched?.exDate ?? stock.exDividendDate ?? stock.dividendDate ?? stock.exDate ?? stock.divExDate;

      const resolvedPaymentDate = fetched?.paymentDate ?? stock.paymentDate ?? stock.divPayDate;

      return {
        ...stock,
        resolvedExDate,
        resolvedPaymentDate,
      };
    });
  }, [stocks, fetchedSchedules]);

  const calendarStats = useMemo(() => {
    let withDates = 0;
    let yieldOnly = 0;

    for (const s of enrichedStocks) {
      const hasDate = Boolean(parseValidDate(s.resolvedExDate) || parseValidDate(s.resolvedPaymentDate));
      const hasYield = (s.dividendYield || 0) > 0;

      if (hasDate) withDates += 1;
      else if (hasYield) yieldOnly += 1;
    }

    return { withDates, yieldOnly };
  }, [enrichedStocks]);

  const filteredStocks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return enrichedStocks.filter((stock) => {
      if (q) {
        const matchSymbol = stock.symbol.toLowerCase().includes(q);
        const matchName = stock.name.toLowerCase().includes(q);
        const matchSector = (stock.sector || "").toLowerCase().includes(q);
        if (!matchSymbol && !matchName && !matchSector) return false;
      }

      if (activeTab === "screener") {
        if (selectedPreset === "undervalued") {
          if ((stock.priceToBook ?? 99) > 1.2 || (stock.trailingPE ?? 99) > 15) {
            return false;
          }
        } else if (selectedPreset === "high_dividend") {
          if ((stock.dividendYield || 0) * 100 < 4) return false;
        } else if (selectedPreset === "big_cap") {
          if (stock.marketCap / 1e12 < 50) return false;
        } else if (selectedPreset === "growth_gainers") {
          if (stock.change < 2) return false;
        }

        const pe = stock.trailingPE ?? 999;
        const pbv = stock.priceToBook ?? 999;
        const divYield = (stock.dividendYield || 0) * 100;
        const capInTrillion = stock.marketCap / 1e12;

        if (pbv > maxPBV) return false;
        if (pe > maxPE) return false;
        if (divYield < minYield) return false;
        if (capInTrillion < minMarketCapT) return false;

        return true;
      }

      const divYieldPct = (stock.dividendYield || 0) * 100;
      const exDateObj = parseValidDate(stock.resolvedExDate);
      const payDateObj = parseValidDate(stock.resolvedPaymentDate);
      const hasSchedule = Boolean(exDateObj || payDateObj);

      if (onlyPayingDividend && divYieldPct <= 0 && !hasSchedule) {
        return false;
      }

      if (monthFilter !== "all") {
        const refDate = exDateObj || payDateObj;
        if (!refDate) return false;
        if (String(refDate.getMonth() + 1) !== monthFilter) return false;
      }

      return true;
    });
  }, [enrichedStocks, searchQuery, activeTab, selectedPreset, maxPBV, maxPE, minYield, minMarketCapT, onlyPayingDividend, monthFilter]);

  const handleReset = () => {
    setSelectedPreset("all");
    setSearchQuery("");
    setMaxPBV(10);
    setMaxPE(50);
    setMinYield(0);
    setMinMarketCapT(0);
    setOnlyPayingDividend(true);
    setMonthFilter("all");
  };

  return (
    <div className="w-full font-mono flex flex-col gap-4 text-xs text-neutral-200">
      {/* Top Bar: Mode Switcher + Pencarian + Reset */}
      <div className="bg-neutral-900/55 border border-neutral-800/70 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 backdrop-blur-sm">
        <div className="inline-flex bg-neutral-950 p-1 rounded-lg border border-neutral-800/80 self-start">
          <button
            type="button"
            onClick={() => setActiveTab("screener")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "screener" ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm" : "text-neutral-400 hover:text-white border border-transparent"
            }`}
          >
            <span>🎛️</span> Screener
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("dividend_calendar")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "dividend_calendar" ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm" : "text-neutral-400 hover:text-white border border-transparent"
            }`}
          >
            <span>📅</span> Kalender Dividen
          </button>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kode atau nama emiten..."
            className="bg-neutral-950 border border-neutral-800/80 focus:border-emerald-500/60 outline-none rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-neutral-500 w-full md:w-60 transition"
          />
          <button type="button" onClick={handleReset} className="bg-neutral-950 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800/80 px-3 py-1.5 rounded-lg text-xs transition cursor-pointer shrink-0">
            Reset
          </button>
        </div>
      </div>

      {activeTab === "screener" ? (
        <>
          {/* Preset Strategi */}
          <div className="bg-neutral-900/40 border border-neutral-800/60 rounded-xl p-3 sm:p-3.5">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {PRESET_FILTERS.map((preset) => {
                const isActive = selectedPreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedPreset(preset.id)}
                    className={`px-3 py-2 rounded-lg border text-left transition cursor-pointer ${
                      isActive ? "bg-emerald-500/12 border-emerald-500/50 text-white" : "bg-neutral-950/75 border-neutral-800/60 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200"
                    }`}
                  >
                    <div className="font-bold text-xs truncate">{preset.label}</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5 truncate font-sans">{preset.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Kontrol Slider Fundamental */}
          <div className="bg-neutral-900/35 border border-neutral-800/60 rounded-xl p-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <div className="flex justify-between text-[11px] mb-1.5">
                <span className="text-neutral-400 font-sans">Maks. PBV</span>
                <span className="font-bold text-emerald-400">{maxPBV.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={maxPBV}
                onChange={(e) => {
                  setSelectedPreset("custom");
                  setMaxPBV(parseFloat(e.target.value));
                }}
                className="w-full accent-emerald-500 bg-neutral-800 h-1.5 rounded cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1.5">
                <span className="text-neutral-400 font-sans">Maks. PER</span>
                <span className="font-bold text-emerald-400">{maxPE}x</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={maxPE}
                onChange={(e) => {
                  setSelectedPreset("custom");
                  setMaxPE(parseInt(e.target.value, 10));
                }}
                className="w-full accent-emerald-500 bg-neutral-800 h-1.5 rounded cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1.5">
                <span className="text-neutral-400 font-sans">Min. Div Yield</span>
                <span className="font-bold text-emerald-400">{minYield.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={minYield}
                onChange={(e) => {
                  setSelectedPreset("custom");
                  setMinYield(parseFloat(e.target.value));
                }}
                className="w-full accent-emerald-500 bg-neutral-800 h-1.5 rounded cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1.5">
                <span className="text-neutral-400 font-sans">Min. Market Cap</span>
                <span className="font-bold text-emerald-400">Rp {minMarketCapT}T</span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                step="25"
                value={minMarketCapT}
                onChange={(e) => {
                  setSelectedPreset("custom");
                  setMinMarketCapT(parseInt(e.target.value, 10));
                }}
                className="w-full accent-emerald-500 bg-neutral-800 h-1.5 rounded cursor-pointer"
              />
            </div>
          </div>
        </>
      ) : (
        /* Toolbar Kalender Dividen */
        <div className="bg-neutral-900/40 border border-neutral-800/60 rounded-xl p-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="font-bold text-emerald-400">📅 KALENDER DIVIDEN</span>
            {isSyncingDividends && (
              <span className="text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-md animate-pulse">
                Sync {syncProgress.done}/{syncProgress.total}
              </span>
            )}
            <span className="bg-neutral-950 border border-neutral-800/70 px-2.5 py-0.5 rounded-md text-neutral-300">
              Bertanggal: <strong className="text-emerald-400">{calendarStats.withDates}</strong>
            </span>
            <span className="bg-neutral-950 border border-neutral-800/70 px-2.5 py-0.5 rounded-md text-neutral-300">
              Yield saja: <strong className="text-amber-300">{calendarStats.yieldOnly}</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={isSyncingDividends}
              onClick={() => syncDividendSchedules(false)}
              className="bg-neutral-950 hover:bg-neutral-800 disabled:opacity-50 text-emerald-400 border border-neutral-800/80 px-3 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer"
            >
              {isSyncingDividends ? "Memuat..." : "↻ Sync Tanggal"}
            </button>

            <label className="inline-flex items-center gap-2 text-[11px] text-neutral-300 bg-neutral-950 border border-neutral-800/80 px-3 py-1.5 rounded-lg cursor-pointer font-sans">
              <input type="checkbox" checked={onlyPayingDividend} onChange={(e) => setOnlyPayingDividend(e.target.checked)} className="accent-emerald-500 rounded cursor-pointer" />
              <span>Yield / terjadwal saja</span>
            </label>

            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              aria-label="Filter Bulan Dividen"
              className="bg-neutral-950 border border-neutral-800/80 text-neutral-200 rounded-lg px-2.5 py-1.5 text-[11px] outline-none focus:border-emerald-500/50 cursor-pointer"
            >
              <option value="all">Semua Bulan</option>
              <option value="1">Januari</option>
              <option value="2">Februari</option>
              <option value="3">Maret</option>
              <option value="4">April</option>
              <option value="5">Mei</option>
              <option value="6">Juni</option>
              <option value="7">Juli</option>
              <option value="8">Agustus</option>
              <option value="9">September</option>
              <option value="10">Oktober</option>
              <option value="11">November</option>
              <option value="12">Desember</option>
            </select>
          </div>
        </div>
      )}

      {/* Counter Bar */}
      <div className="flex items-center justify-between bg-neutral-950/85 px-3.5 py-2 border border-neutral-800/60 rounded-lg text-[11px] text-neutral-400">
        <span>
          Menampilkan <strong className="text-emerald-400">{filteredStocks.length}</strong> dari <strong className="text-neutral-200">{stocks.length}</strong> emiten
        </span>
        <span className="font-sans text-neutral-500 hidden sm:inline">Klik kartu untuk melihat analisis lengkap</span>
      </div>

      {/* Grid Kartu Elegan & Terbaca */}
      {filteredStocks.length === 0 ? (
        <div className="bg-neutral-900/30 border border-neutral-800/60 rounded-xl p-8 text-center text-xs text-neutral-400 font-sans">Tidak ada emiten yang cocok dengan filter saat ini.</div>
      ) : activeTab === "screener" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filteredStocks.map((stock) => {
            const isPos = stock.change >= 0;
            const divYieldPct = stock.dividendYield && stock.dividendYield > 0 ? `${(stock.dividendYield * 100).toFixed(1)}%` : "-";

            return (
              <Link
                key={stock.symbol}
                href={`/stock/${stock.symbol}`}
                className={`group rounded-xl p-3.5 border transition-all duration-150 flex flex-col justify-between gap-3 ${
                  isPos ? "bg-gradient-to-b from-emerald-950/20 to-neutral-950/80 border-emerald-500/25 hover:border-emerald-400/55" : "bg-gradient-to-b from-rose-950/20 to-neutral-950/80 border-rose-500/25 hover:border-rose-400/55"
                }`}
              >
                {/* Header Kartu */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-white group-hover:text-emerald-300 transition truncate">{stock.symbol}</div>
                    <div className="text-[11px] text-neutral-400 truncate font-sans mt-0.5">{stock.name}</div>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md shrink-0 ${isPos ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/25" : "bg-rose-500/15 text-rose-300 border border-rose-500/25"}`}>
                    {isPos ? "+" : ""}
                    {stock.change.toFixed(1)}%
                  </span>
                </div>

                {/* Harga & Market Cap */}
                <div className="flex items-baseline justify-between gap-2 pt-1">
                  <span className="text-sm font-bold text-neutral-100 truncate">Rp {stock.price.toLocaleString("id-ID")}</span>
                  <span className="text-[11px] text-neutral-400 shrink-0">Cap {formatMarketCapCompact(stock.marketCap)}</span>
                </div>

                {/* Metrik Fundamental */}
                <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-neutral-800/70 text-[11px]">
                  <div className="bg-neutral-950/70 rounded-lg px-2 py-1 border border-neutral-800/50">
                    <div className="text-[10px] text-neutral-500 font-sans">PER</div>
                    <div className="font-semibold text-neutral-200 truncate">{stock.trailingPE ? `${stock.trailingPE.toFixed(1)}x` : "-"}</div>
                  </div>
                  <div className="bg-neutral-950/70 rounded-lg px-2 py-1 border border-neutral-800/50">
                    <div className="text-[10px] text-neutral-500 font-sans">PBV</div>
                    <div className="font-semibold text-neutral-200 truncate">{stock.priceToBook ? `${stock.priceToBook.toFixed(1)}x` : "-"}</div>
                  </div>
                  <div className="bg-neutral-950/70 rounded-lg px-2 py-1 border border-neutral-800/50 text-right">
                    <div className="text-[10px] text-neutral-500 font-sans">Yield</div>
                    <div className="font-bold text-emerald-400 truncate">{divYieldPct}</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        /* Grid Kartu Kalender Dividen Elegan */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filteredStocks.map((stock) => {
            const divYieldPct = (stock.dividendYield || 0) * 100;
            const exShort = formatShortDateID(stock.resolvedExDate);
            const payShort = formatShortDateID(stock.resolvedPaymentDate);
            const hasDate = Boolean(exShort || payShort);

            return (
              <Link
                key={stock.symbol}
                href={`/stock/${stock.symbol}`}
                className="group rounded-xl p-3.5 bg-gradient-to-b from-neutral-900/55 to-neutral-950/85 border border-neutral-800/70 hover:border-emerald-500/45 transition-all duration-150 flex flex-col justify-between gap-3"
              >
                {/* Header Kartu */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-white group-hover:text-emerald-300 transition truncate">{stock.symbol}</div>
                    <div className="text-[11px] text-neutral-400 truncate font-sans mt-0.5">{stock.name}</div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/25 px-2 py-0.5 rounded-md shrink-0">{divYieldPct > 0 ? `${divYieldPct.toFixed(1)}%` : "-"}</span>
                </div>

                {/* Tanggal Ex & Pay */}
                <div className="grid grid-cols-2 gap-2 bg-neutral-950/85 p-2.5 rounded-lg border border-neutral-800/60">
                  <div>
                    <div className="text-[10px] text-neutral-500 font-sans">Ex-Date</div>
                    <div className="text-xs font-bold text-neutral-100 mt-0.5 truncate">{exShort ?? "Belum ada"}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-neutral-500 font-sans">Pay-Date</div>
                    <div className="text-xs font-bold text-neutral-100 mt-0.5 truncate">{payShort ?? "Belum ada"}</div>
                  </div>
                </div>

                {/* Status Footer */}
                <div className="flex items-center justify-between pt-0.5">
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-md truncate ${
                      hasDate
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/25"
                        : divYieldPct > 0
                          ? "bg-amber-500/10 text-amber-300 border border-amber-500/25"
                          : "bg-neutral-800/70 text-neutral-400 border border-neutral-700/50"
                    }`}
                  >
                    {hasDate ? "Jadwal Tersedia" : divYieldPct > 0 ? "Menunggu Tanggal" : "Non-Dividen"}
                  </span>
                  <span className="text-xs text-neutral-400 group-hover:text-emerald-400 transition">Detail ↗</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
