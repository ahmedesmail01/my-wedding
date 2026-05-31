'use client';

import React from 'react';
import { weddingConfig } from '@/config/wedding';

export default function SlideCalligraphy() {
  return (
    <section className="slide-card">
      <div className="slide-inner-frame animate-fade-in-scale">
        {/* Top divider */}
        <div className="w-10 h-0.5 bg-[var(--accent-color)] opacity-40 mt-4" />

        <div className="flex-1 flex flex-col justify-center items-center gap-6 w-full text-center">
          {/* Quranic Verse Calligraphic Style Frame */}
          <div className="rtl-content text-lg leading-relaxed text-[var(--primary-color)] max-w-xs font-semibold px-2 border-y border-[rgba(212,175,55,0.15)] py-6 whitespace-pre-line">
            {weddingConfig.quotes.arabic}
          </div>

          {/* English translation smaller muted script */}
          <p className="ltr-content text-xs text-gray-500 font-light max-w-xs italic leading-relaxed px-4 whitespace-pre-line mt-2">
            {weddingConfig.quotes.english}
          </p>
        </div>

        {/* Hint to scroll down */}
        <div className="flex flex-col items-center gap-2 mb-2 animate-float">
          <span className="text-[10px] text-gray-400 font-light tracking-[0.2em]" style={{ fontFamily: 'var(--font-cairo)' }}>
            اسحب للأعلى للتفاصيل
          </span>
          <svg className="w-4 h-4 text-[var(--accent-color)] opacity-60 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 10l7-7m0 0l7 7m-7-7v18" transform="rotate(180 12 12)" />
          </svg>
        </div>
      </div>
    </section>
  );
}
