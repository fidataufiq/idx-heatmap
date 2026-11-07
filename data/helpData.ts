export interface HelpSection {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  content: {
    heading: string;
    description: string;
    bullets?: string[];
    steps?: string[];
    callout?: {
      title: string;
      desc: string;
    };
  }[];
}

export const HELP_SECTIONS: HelpSection[] = [
  {
    id: "overview",
    icon: "🚀",
    title: "Tentang MapIDX Terminal",
    subtitle: "Apa itu aplikasi ini?",
    content: [
      {
        heading: "Aplikasi Apa Sih Ini?",
        description:
          "Bayangkan Anda punya papan pantau canggih seperti di bursa saham sungguhan. MapIDX adalah tempat di mana Anda bisa melihat naik-turunnya harga saham perusahaan-perusahaan di Indonesia (seperti BBRI, Telkom, Astra, dll) secara langsung (real-time) tanpa ribet!",
      },
    ],
  },
  {
    id: "heatmap",
    icon: "📊",
    title: "Modul 1: Peta Warna Saham (Heatmap)",
    subtitle: "Kotak-kotak warna-warni penentu arah pasar",
    content: [
      {
        heading: "Cara Baca Kotak Warna-Warni:",
        description: "Di halaman utama, Anda akan melihat banyak kotak tersusun rapi. Masing-masing kotak punya arti penting:",
        bullets: [
          "🟫 Warna Hijau: Artinya saham perusahaan itu sedang naik harganya (lagi untung/cuan). Makin tua hijaunya, makin kencang naiknya!",
          "🟥 Warna Merah: Artinya saham perusahaan itu sedang turun harganya (lagi rugi/anjlok).",
          "📏 Ukuran Kotak: Makin besar kotaknya, berarti perusahaan itu punya 'modal pasar' (Market Cap) yang sangat besar. Contohnya bank besar seperti BCA atau BRI kotaknya pasti besar-besar.",
          "🔍 Sektor Industri: Anda bisa klik tombol filter di atas untuk melihat khusus saham di bidang perbankan saja, energi, pertambangan, atau makanan.",
        ],
      },
    ],
  },
  {
    id: "stock-detail",
    icon: "🎯",
    title: "Modul 2: Halaman Detail Saham",
    subtitle: "Melihat isi 'dapur' suatu perusahaan",
    content: [
      {
        heading: "Kalau Klik Salah Satu Saham, Dapat Apa?",
        description: "Jika Anda mengklik salah satu kotak saham (misalnya BBRI), Anda akan dibawa masuk ke halaman khusus yang membahas saham tersebut secara mendalam:",
        bullets: [
          "📈 Grafik Harga: Ada grafik interaktif dari TradingView untuk melihat pergerakan harga dari menit ke menit atau tahunan.",
          "💰 Harga & Valuasi: Menampilkan harga terakhir, nilai wajar (PER & PBV), hingga harga tertinggi dan terendah dalam 1 tahun terakhir.",
          "🎯 Kata Analis (Konsensus): Ada bocoran seberapa banyak ahli keuangan dunia yang menyarankan untuk 'Beli', 'Tahan', atau 'Jual' saham tersebut.",
          "📰 Berita Terkini: Berita-berita terbaru yang sedang menyoroti perusahaan tersebut agar Anda tidak ketinggalan informasi penting.",
        ],
      },
    ],
  },
  {
    id: "market-overview",
    icon: "🏛️",
    title: "Modul 3: Radar Konglomerat & Sektor",
    subtitle: "Memantau pergerakan juragan besar",
    content: [
      {
        heading: "Mengintip Grup Usaha Raksasa Indonesia:",
        description: "Di bagian Market Overview, saham-saham dikelompokkan berdasarkan pemilik atau grup konglomerasinya (seperti Grup Barito, Grup Djarum, Grup Salim, BUMN, dll):",
        bullets: [
          "👑 Rata-rata Performa Grup: Anda bisa langsung lihat apakah hari ini Grup Barito sedang kompak hijau atau kompak merah.",
          "⚡ Berita Kilat (Flash News): Informasi singkat apa saja yang sedang dilakukan oleh para konglomerat besar di bursa.",
        ],
      },
    ],
  },
  {
    id: "tips",
    icon: "💡",
    title: "Tips Kilat Penggunaan Terminal",
    subtitle: "Panduan cepat agar tidak bingung",
    content: [
      {
        heading: "Langkah Mudah Untuk Pemula:",
        description: "Ikuti alur santai ini saat pertama kali membuka aplikasi:",
        steps: [
          "1. Buka halaman utama untuk melihat sekilas apakah pasar hari ini mayoritas hijau (Bullish) atau merah (Bearish).",
          "2. Gunakan filter sektor di atas jika Anda ingin mencari saham di bidang tertentu saja.",
          "3. Klik salah satu saham yang menarik perhatian Anda untuk melihat grafik dan profil lengkapnya.",
          "4. Jika butuh panduan ini lagi, cukup klik tombol bantuan (?) di pojok layar!",
        ],
        callout: {
          title: "Catatan Penting!",
          desc: "Seluruh data harga di aplikasi ini bersifat real-time dari bursa. Namun, panduan ini murni untuk edukasi analisis dan bukan ajakan resmi membeli atau menjual saham tertentu ya!",
        },
      },
    ],
  },
];
