"use client";

import { HELP_SECTIONS } from "@/data/helpData";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-neutral-950/60 font-mono transition-opacity">
      {/* Backdrop Area untuk Menutup Drawer saat diklik di luar */}
      <div className="fixed inset-0" onClick={onClose}></div>

      {/* Slide-over Drawer Panel dari Sisi Kanan */}
      <div className="relative z-10 bg-neutral-900 border-l border-neutral-800 w-full max-w-xl h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 p-4 bg-neutral-950 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-xs">?</div>
            <div>
              <h3 className="font-extrabold text-white text-xs sm:text-sm uppercase tracking-wider">System Manual & Documentation</h3>
              <p className="text-[10px] text-neutral-400 font-sans">Panduan Lengkap & Cara Pakai MapIDX Terminal (Bahasa Sederhana)</p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white text-xs bg-neutral-800 hover:bg-neutral-700 px-2.5 py-1 rounded transition cursor-pointer border border-neutral-700">
            ✕ Tutup
          </button>
        </div>

        {/* Drawer Content Area (Scrollable - Memuat Semua Isi Bantuan) */}
        <div className="p-4 sm:p-6 space-y-6 text-xs text-neutral-300 font-sans leading-relaxed overflow-y-auto flex-1">
          {HELP_SECTIONS.map((section) => (
            <div key={section.id} className="space-y-3 border-b border-neutral-800/80 pb-6 last:border-b-0 last:pb-0">
              <div className="flex items-center gap-2">
                <span className="text-base">{section.icon}</span>
                <div>
                  <h4 className="font-bold text-white text-xs font-mono uppercase text-emerald-400">{section.title}</h4>
                  <p className="text-[10px] text-neutral-400">{section.subtitle}</p>
                </div>
              </div>

              {section.content.map((item, idx) => (
                <div key={idx} className="bg-neutral-950/60 p-3.5 rounded-xl border border-neutral-800/60 space-y-2">
                  <h5 className="font-bold text-neutral-200 text-xs font-sans">{item.heading}</h5>
                  <p className="text-neutral-300 text-[11px] leading-normal">{item.description}</p>

                  {/* Bullet Points jika ada */}
                  {item.bullets && (
                    <ul className="list-disc pl-5 space-y-1.5 text-neutral-300 font-sans text-[11px] pt-1">
                      {item.bullets.map((bullet, bIdx) => (
                        <li key={bIdx}>{bullet}</li>
                      ))}
                    </ul>
                  )}

                  {/* Langkah-langkah jika ada */}
                  {item.steps && (
                    <div className="space-y-1.5 pt-1">
                      {item.steps.map((step, sIdx) => (
                        <div key={sIdx} className="bg-neutral-900 p-2 rounded border border-neutral-800 text-[11px] text-neutral-300">
                          {step}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Kotak Catatan / Callout jika ada */}
                  {item.callout && (
                    <div className="bg-amber-950/30 border border-amber-500/30 p-2.5 rounded-lg mt-2 text-[11px]">
                      <span className="font-bold text-amber-400 block mb-0.5">⚠️ {item.callout.title}</span>
                      <span className="text-neutral-300">{item.callout.desc}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Drawer Footer */}
        <div className="border-t border-neutral-800 p-4 bg-neutral-950 flex items-center justify-between text-[11px] font-mono shrink-0">
          <span className="text-neutral-500">MapIDX Engine v2.5</span>
          <button onClick={onClose} className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-extrabold px-5 py-1.5 rounded-lg transition cursor-pointer">
            Tutup Panel
          </button>
        </div>
      </div>
    </div>
  );
}
