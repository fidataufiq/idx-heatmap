import { NextResponse } from "next/server";

interface TwelveDataQuote {
  code?: number;
  message?: string;
  close?: string;
  price?: string;
  percent_change?: string;
}

export async function GET() {
  const apiKey = process.env.TWELVEDATA_API_KEY || "demo";

  // Simbol instrumen di Twelve Data
  const symbols = "JKSE,DJI,N225,STI,XAU/USD,WTI";
  const url = `https://api.twelvedata.com/quote?symbol=${symbols}&apikey=${apiKey}`;

  try {
    const response = await fetch(url, { next: { revalidate: 15 } });
    const json = (await response.json()) as Record<string, TwelveDataQuote>;

    // Validasi jika API Key salah atau mencapai limit
    if (json.code && typeof json.code === "number" && json.code >= 400) {
      return NextResponse.json(
        {
          success: false,
          error: json.message || "Gagal mengambil data dari Twelve Data API. Periksa API Key Anda.",
        },
        { status: 400 },
      );
    }

    // Helper dengan tipe data TwelveDataQuote yang aman dari ESLint
    const parseData = (symData: TwelveDataQuote) => {
      if (!symData || symData.code) return { price: 0, change: 0, trend: [0, 0] };
      const price = parseFloat(symData.close || symData.price || "0");
      const change = parseFloat(symData.percent_change || "0");
      const prevClose = price / (1 + change / 100);
      return {
        price,
        change,
        trend: [prevClose, price],
      };
    };

    const getDataFor = (sym: string) => {
      const item = (json[sym] || json[sym.replace("/", "")] || {}) as TwelveDataQuote;
      return parseData(item);
    };

    const ihsgData = getDataFor("JKSE");
    const djiData = getDataFor("DJI");
    const n225Data = getDataFor("N225");
    const stiData = getDataFor("STI");
    const goldData = getDataFor("XAU/USD");
    const oilData = getDataFor("WTI");

    const indices = [
      {
        symbol: "IHSG",
        name: "Indeks Harga Saham Gabungan",
        region: "Indonesia",
        ...ihsgData,
      },
      {
        symbol: "DJI",
        name: "Dow Jones Industrial Average",
        region: "USA",
        ...djiData,
      },
      {
        symbol: "N225",
        name: "Nikkei 225 Tokyo",
        region: "Japan",
        ...n225Data,
      },
      {
        symbol: "STI",
        name: "Straits Times Singapore",
        region: "Singapore",
        ...stiData,
      },
    ];

    const commodities = [
      {
        name: "Gold (Emas Spot)",
        unit: "USD/oz",
        ...goldData,
      },
      {
        name: "Crude Oil (Minyak WTI)",
        unit: "USD/bbl",
        ...oilData,
      },
    ];

    return NextResponse.json({
      success: true,
      data: {
        indices,
        commodities,
      },
    });
  } catch (error) {
    console.error("Twelve Data API Error:", error);
    return NextResponse.json({ success: false, error: "Kesalahan koneksi ke server Twelve Data" }, { status: 500 });
  }
}
