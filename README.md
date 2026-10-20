# 📈 IDX Market Heatmap & Terminal

Aplikasi web visualisasi saham Indonesia (_Indonesia Stock Exchange / IDX_) bergaya **High-Density Grid Terminal** ala TradingView dan Finviz. Dirancang dengan pendekatan _Clean Architecture_, antarmuka minimalis, serta performa tinggi untuk memantau pergerakan pasar saham secara _real-time_.

---

## ✨ Fitur Utama

- **🔥 200+ Saham IDX Bersih & Terverifikasi**: Mencakup seluruh saham _blue chip_, sektor perbankan, energi, teknologi, konsumer, hingga properti tanpa duplikasi data.
- **⚡ Filter Cepat & Pengurutan Presisi**:
  - **Quick Filters**: `🔥 Top Gainers`, `❄️ Top Losers`, `⚡ Most Active`, `⭐ Pilihan Editor`, serta filter berbasis Sektor.
  - **Sorting**: Pengurutan berdasarkan _Market Capitalization_, _% Perubahan Harga_, dan _Volume Transaksi_.
- **📊 Halaman Detail Saham Mendalam (`/stock/[symbol]`)**:
  - **Grafik Interaktif TradingView**: Grafik _Candlestick real-time_ dengan kontrol rentang waktu penuh.
  - **Metrik Utama dengan Tooltip**: Informasi _Market Cap_, _P/E Ratio_, _52W High/Low_, _Dividend Yield_, _Karyawan_, dan _Beta_ dilengkapi penjelasan edukatif saat di-_hover_.
  - **Profil Perusahaan**: Deskripsi lengkap bisnis, informasi bursa, serta tautan langsung ke situs resmi emiten.
- **🎨 Design & UI/UX Superior**:
  - **Dark Mode Modern**: Visualisasi warna kontras lembut (Hijau/Merah/Spiritual Dark Neutral) yang nyaman di mata untuk penggunaan durasi panjang (_desktop setup / multi-monitor_).
  - **Fully Responsive**: Tampilan optimal di perangkat mobile, tablet, hingga layar desktop lebar.
- **ℹ️ Halaman Informasi Khusus (`/about`)**: Memuat rincian arsitektur teknologi, profil pengembang, sumber data, serta tautan dukungan (_Saweria / Traktir Kopi_).

---

## 🛠️ Stack Teknologi

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack, React Server Components)
- **Bahasa Pemrograman**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Data Provider**: `yahoo-finance2` (Yahoo Finance API Integrator)
- **Chart Component**: [TradingView Advanced Chart Widget](https://www.tradingview.com/)
- **Deployment & Hosting**: [Vercel](https://vercel.com/)

---

## 📁 Struktur Proyek (Clean Architecture)

```text
idx-heatmap/
├── src/
│   ├── app/
│   │   ├── about/
│   │   │   └── page.tsx              # Halaman About / Profil Pengembang
│   │   ├── api/
│   │   │   └── stocks/               # API Routes untuk fetching data Yahoo Finance
│   │   │       ├── route.ts
│   │   │       └── [symbol]/
│   │   │           └── route.ts
│   │   ├── stock/
│   │   │   └── [symbol]/
│   │   │       └── page.tsx          # Dynamic Route Detail Saham (Server Component)
│   │   ├── layout.tsx
│   │   └── page.tsx                  # Halaman Utama Heatmap Grid
│   ├── components/
│   │   ├── Footer.tsx                # Komponen Footer Elegan & Navigasi
│   │   ├── StockCard.tsx             # Komponen Kartu Saham Grid
│   │   ├── StockChart.tsx            # Embed TradingView Chart Widget
│   │   └── StockDetailClient.tsx     # Komponen Client Detail Saham
│   ├── types/
│   │   └── stock.ts                  # Definisi Antarmuka TypeScript
│   └── utils/
│       └── formatters.ts             # Utility Konversi Warna & Mata Uang
├── public/
├── package.json
├── tsconfig.json
└── README.md
```

🚀 Panduan Memulai (Local Development)

1. Prasyarat
   Pastikan Anda sudah menginstal Node.js (versi 18.x atau lebih baru) dan npm.

2. Kloning Repositori
   Bash
   git clone [https://github.com/username-anda/idx-heatmap.git](https://github.com/username-anda/idx-heatmap.git)
   cd idx-heatmap
3. Instal Dependensi
   Bash
   npm install
4. Jalankan Server Pengembang
   Bash
   npm run dev
   Buka browser dan akses http://localhost:3000 untuk melihat aplikasi.

5. Build untuk Produksi
   Bash
   npm run build
   npm run start
   ☕ Dukungan & Kontribusi
   Proyek ini dibangun secara terbuka. Jika Anda menyukai aplikasi ini atau ingin mendukung pengembangannya, Anda dapat memberikan apresiasi melalui:

🌟 Star repositori ini di GitHub

☕ Traktir kopi via Saweria

⚖️ Penafian (Disclaimer)
Data finansial dalam aplikasi ini diperoleh secara real-time melalui Yahoo Finance API dan diperuntukkan sebagai alat bantu visualisasi informasi semata. Seluruh informasi di dalamnya bukan merupakan ajakan, rekomendasi, atau panduan mutlak untuk membeli atau menjual saham tertentu (Disclaimer On).

---
