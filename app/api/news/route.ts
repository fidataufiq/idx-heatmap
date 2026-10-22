import { NextResponse } from "next/server";
import Parser from "rss-parser";

const parser = new Parser();

interface CustomItem {
  title?: string;
  link?: string;
  pubDate?: string;
  creator?: string;
  author?: string;
}

// Fungsi penentu kategori berita berbasis kata kunci judul
function determineCategory(title: string): string {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("ihsg") || lowerTitle.includes("bursa") || lowerTitle.includes("indeks")) {
    return "IHSG & Pasar";
  } else if (lowerTitle.includes("bank") || lowerTitle.includes("bbca") || lowerTitle.includes("bbri") || lowerTitle.includes("bmri")) {
    return "Perbankan";
  } else if (lowerTitle.includes("laba") || lowerTitle.includes("dividen") || lowerTitle.includes("ipo") || lowerTitle.includes("saham")) {
    return "Emiten & Aksi";
  } else if (lowerTitle.includes("inflasi") || lowerTitle.includes("suku bunga") || lowerTitle.includes("bi") || lowerTitle.includes("rupiah")) {
    return "Ekonomi Makro";
  }
  return "Berita Utama";
}

// Fungsi pembersih nama sumber media berita
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

// Fungsi pembersih judul agar tidak mengulang nama sumber di ujungnya
function cleanTitle(title: string): string {
  if (title.includes(" - ")) {
    const parts = title.split(" - ");
    parts.pop(); // Hapus nama sumber di bagian belakang
    return parts.join(" - ").trim();
  }
  return title;
}

export async function GET() {
  try {
    const feed = await parser.parseURL("https://news.google.com/rss/search?q=saham+IHSG+Indonesia&hl=id&gl=ID&ceid=ID:id");

    const items = (feed.items || []) as CustomItem[];

    const newsItems = items.slice(0, 50).map((item) => {
      const rawTitle = item.title || "Tanpa Judul";
      const sourceName = cleanSource(item);
      const displayTitle = cleanTitle(rawTitle);
      const category = determineCategory(displayTitle);

      return {
        title: displayTitle,
        link: item.link || "#",
        pubDate: item.pubDate
          ? new Date(item.pubDate).toLocaleString("id-ID", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Baru saja",
        source: sourceName,
        category: category,
      };
    });

    return NextResponse.json({ success: true, data: newsItems });
  } catch (error) {
    console.error("Error fetching news feed:", error);
    return NextResponse.json({ success: false, error: "Gagal mengambil data berita" }, { status: 500 });
  }
}
