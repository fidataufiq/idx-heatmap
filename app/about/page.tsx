import Link from "next/link";

const TECH_STACK = [
  {
    name: "Next.js App Router & TypeScript",
    role: "Framework & Type Safety",
    desc: "Menangani rute dinamis emiten, pemisahan logika server dan client, serta struktur tipe data yang terjaga seiring bertambahnya fitur.",
  },
  {
    name: "Tailwind CSS",
    role: "Dark Editorial Interface",
    desc: "Membangun permukaan gelap senyap dengan ruang napas yang lapang, hierarki teks yang jelas, dan kontras yang nyaman dipantau dalam waktu lama.",
  },
  {
    name: "Yahoo Finance & Cache Layer",
    role: "Market Telemetry & Sync",
    desc: "Menarik kuotasi saham, rasio valuasi, serta tanggal dividen dengan mekanisme cache dan sinkronisasi bertahap agar tetap cepat serta hemat permintaan.",
  },
  {
    name: "Fundamental Screener & Dividend Calendar",
    role: "Filter & Schedule Grid",
    desc: "Menyaring emiten berdasarkan PBV, PER, dividend yield, dan kapitalisasi pasar sekaligus memantau ex-date serta pay-date dalam satu tampilan.",
  },
  {
    name: "Sector & Conglomerate Overview",
    role: "Market Structure",
    desc: "Membantu melihat pergerakan relatif antar-emiten dan kelompok usaha di BEI tanpa perlu berpindah-pindah banyak tab.",
  },
  {
    name: "GitHub & Vercel Edge",
    role: "Deployment & Workflow",
    desc: "Mengelola riwayat perubahan kode secara tertib dan mendistribusikan aplikasi dengan latensi rendah serta konfigurasi environment yang aman.",
  },
];

const WORKFLOW_STEPS = [
  {
    num: "01",
    title: "Pindai Gambaran Pasar & Heatmap",
    body: "Mulai dari peta pergerakan untuk menangkap arah pasar secara cepat: emiten mana yang memimpin penguatan, saham mana yang tertekan, dan bagaimana sentimen bergerak di tiap sektor.",
  },
  {
    num: "02",
    title: "Saring Valuasi & Jadwal Dividen",
    body: "Gunakan preset strategi, slider parameter, atau tab kalender dividen untuk menyaring saham sesuai kriteria valuasi, ukuran kapitalisasi, maupun potensi pembagian dividen.",
  },
  {
    num: "03",
    title: "Bedah Detail Emiten Secara Menyeluruh",
    body: "Buka halaman detail emiten untuk membaca grafik interaktif, rentang harga 52 minggu, rasio profitabilitas, target konsensus analis, serta berita terkini dalam satu alur.",
  },
];

const ROADMAP_NOTES = [
  {
    label: "Fokus Saat Ini",
    title: "Kalender Dividen & Tata Letak Detail Emiten",
    body: "Menyempurnakan sinkronisasi tanggal dividen dari endpoint detail saham, meningkatkan kenyamanan tipografi pada grid emiten, dan menata ulang halaman detail agar seimbang.",
  },
  {
    label: "Iterasi Berikutnya",
    title: "Pengurutan Cepat & Pembanding Sektor",
    body: "Menambahkan urutan berdasarkan yield, valuasi, atau kapitalisasi pasar serta konteks perbandingan rasio terhadap rata-rata industri.",
  },
  {
    label: "Catatan Transparansi & Risiko",
    title: "Referensi Analitis, Bukan Nasihat Investasi",
    body: "Seluruh data harga, rasio, konsensus analis, dan jadwal dividen disajikan untuk kebutuhan informasi dan riset. Jika tanggal dividen belum tersedia pada feed, statusnya ditampilkan apa adanya tanpa rekayasa, dan setiap keputusan transaksi tetap berada di tangan masing-masing investor.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col flex-1 w-full min-h-screen bg-neutral-950 text-neutral-200 font-mono selection:bg-emerald-500 selection:text-black relative overflow-x-hidden">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[320px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Sub-Header Navigasi Sticky */}
      <header className="sticky top-12 z-40 border-b border-neutral-800/70 bg-neutral-950/90 backdrop-blur-md px-4 sm:px-8 lg:px-10 py-2.5 flex items-center justify-between w-full">
        <Link href="/" className="text-neutral-400 hover:text-emerald-400 text-xs transition flex items-center gap-1.5 group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          <span>Kembali ke Heatmap</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase bg-emerald-950/50 px-2.5 py-0.5 rounded border border-emerald-500/30">MAPIDX // ABOUT</span>
        </div>
      </header>

      {/* Main Full-Width Lapang */}
      <main className="w-full px-4 sm:px-8 lg:px-10 py-8 sm:py-10 flex-1 flex flex-col gap-10 relative z-10">
        {/* 1. HERO LAPANG (2 KOLOM ASIMETRIS BERSIH) */}
        <section className="border-b border-neutral-800/80 pb-9 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold text-emerald-400 tracking-wider uppercase">
              <span>●</span>
              <span>Terminal Telemetri Pasar Saham BEI</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-[1.1]">
              Visualisasi Pasar Saham yang <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Jernih, Lapang, dan Terukur</span>
            </h1>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans max-w-4xl">
              <strong className="font-mono text-white">MapIDX</strong> dibangun untuk menyederhanakan proses memantau saham-saham di Bursa Efek Indonesia. Daripada memecah informasi ke banyak halaman terpisah dengan tampilan yang bising,
              seluruh alur mulai dari heatmap pasar, penyaringan rasio fundamental, kalender dividen, hingga analisis detail emiten disatukan dalam ruang kerja gelap yang tenang dan mudah dipindai.
            </p>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans max-w-4xl">
              Setiap bagian dirancang dengan prinsip keterbacaan tinggi, ruang kosong yang cukup agar halaman tidak terasa sesak, serta penyajian data yang jujur terhadap ketersediaan informasi dari sumber pasar.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link href="/" className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs px-4 py-2.5 rounded-lg transition">
                Buka Heatmap →
              </Link>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 text-xs font-bold px-4 py-2.5 rounded-lg transition">
                GitHub ↗
              </a>
              <a href="https://saweria.co" target="_blank" rel="noopener noreferrer" className="bg-emerald-950/40 hover:bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-4 py-2.5 rounded-lg transition">
                Dukung Sistem
              </a>
            </div>
          </div>

          {/* Ringkasan Identitas Ringkas Tanpa Kotak Berlebihan */}
          <div className="lg:col-span-4 lg:border-l lg:border-neutral-800/80 lg:pl-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-extrabold text-white tracking-wide">
                  Map<span className="text-emerald-400">IDX</span>
                </div>
                <div className="text-xs text-neutral-400 font-sans">Equity Telemetry & Screener Workspace</div>
              </div>
              <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded">CORE v2.8</span>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3 pt-3 border-t border-neutral-800/70 text-xs">
              <div>
                <div className="text-[10px] text-neutral-500 font-sans">Cakupan</div>
                <div className="font-bold text-white mt-0.5">Emiten BEI / IDX</div>
              </div>
              <div>
                <div className="text-[10px] text-neutral-500 font-sans">Tata Letak</div>
                <div className="font-bold text-emerald-400 mt-0.5">Full-Bleed Dark</div>
              </div>
              <div>
                <div className="text-[10px] text-neutral-500 font-sans">Data Layer</div>
                <div className="font-bold text-white mt-0.5">Live + Server Cache</div>
              </div>
              <div>
                <div className="text-[10px] text-neutral-500 font-sans">Pendekatan</div>
                <div className="font-bold text-teal-300 mt-0.5">Clean & Modular</div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. MISI & FILOSOFI (2 KOLOM EDITORIAL BERSIH) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 border-b border-neutral-800/80 pb-10">
          <div className="space-y-3">
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">01 · Misi & Integritas Data</div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-sans">Mengutamakan Kejujuran Data di Atas Tampilan Semata</h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
              Alat bantu analisis pasar hanya berguna jika datanya dapat dipertanggungjawabkan. MapIDX menarik informasi harga, statistik finansial, serta jadwal dividen dari sumber data pasar tanpa mengisi kolom kosong dengan angka tiruan.
            </p>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans">
              Apabila tanggal ex-dividend atau payment date belum tersedia pada respons data emiten, sistem akan menampilkan status yang jelas sehingga pembaca tahu mana informasi yang sudah terkonfirmasi dan mana yang masih menunggu
              pembaruan.
            </p>
          </div>

          <div className="lg:border-l lg:border-neutral-800/80 lg:pl-12 space-y-3">
            <div className="text-[11px] font-bold text-teal-300 uppercase tracking-wider">02 · Filosofi Antarmuka</div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-sans">Kepadatan Informasi Tanpa Rasa Sesak</h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
              Desain gelap yang terlalu banyak dibatasi kotak-kotak tebal sering kali membuat halaman terlihat terpecah dan kaku. Di MapIDX, pemisahan antarbagian dibuat lebih halus melalui spasi, garis batas tipis, dan hierarki ukuran
              huruf yang tegas.
            </p>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans">Tujuannya sederhana: membantu mata berpindah dengan mulus dari ringkasan pasar ke angka-angka inti tanpa kelelahan visual.</p>
          </div>
        </section>

        {/* 3. ALUR RISET (3 KOLOM BERGARIS ATAS, BUKAN KARTU PENUH) */}
        <section className="border-b border-neutral-800/80 pb-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">03 · Alur Kerja</span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-sans mt-1">Dari Gambaran Pasar hingga Detail Emiten</h2>
            </div>
            <span className="text-xs text-neutral-400 font-sans">Struktur alur yang konsisten di seluruh modul</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {WORKFLOW_STEPS.map((step) => (
              <div key={step.num} className="border-t border-emerald-500/40 pt-4 space-y-2">
                <div className="text-xs font-bold text-emerald-400">{step.num}</div>
                <h3 className="text-sm sm:text-base font-bold text-white font-sans">{step.title}</h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. TUMPUKAN TEKNOLOGI (GRID 3 KOLOM BERSIH BERGARIS) */}
        <section className="border-b border-neutral-800/80 pb-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">04 · Teknologi & Arsitektur</span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-sans mt-1">Fondasi Teknis di Balik MapIDX</h2>
            </div>
            <span className="text-xs text-neutral-400 font-sans">Disusun agar ringan, terukur, dan mudah dikembangkan</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            {TECH_STACK.map((item) => (
              <div key={item.name} className="border-l-2 border-neutral-800 hover:border-emerald-400 transition pl-4 py-1 space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">{item.role}</div>
                <h3 className="text-sm font-bold text-white font-sans">{item.name}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. ARAH PENGEMBANGAN & CATATAN TRANSPARANSI */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-1">
          {ROADMAP_NOTES.map((note) => (
            <div key={note.title} className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{note.label}</div>
              <h3 className="text-sm font-bold text-white font-sans">{note.title}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">{note.body}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
