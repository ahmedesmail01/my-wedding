'use client';

import React from 'react';
import { weddingConfig } from '@/config/wedding';

export default function SlideCouple() {
  return (
    <section className="slide-card">
      <div className="slide-inner-frame">
        <div className="w-full flex justify-center opacity-30 mt-2 select-none">
          <svg className="w-12 h-12 text-[var(--accent-color)]" fill="currentColor" viewBox="0 0 100 100">
            <path d="M50,0 C22,0 0,22 0,50 C0,78 22,100 50,100 C78,100 100,78 100,50 C100,22 78,0 50,0 Z M50,10 C72,10 90,28 90,50 C90,72 72,90 50,90 C28,90 10,72 10,50 C10,28 28,10 50,10 Z" />
          </svg>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center gap-5 w-full text-center">
          {/* Couple detailed English section */}
          <div className="ltr-content flex flex-col items-center gap-1.5">
            <h2 className="text-4xl font-extrabold text-[var(--primary-color)] tracking-wide gold-gradient-text">
              {weddingConfig.couple.groomNameEn}
            </h2>
            <span className="text-xs text-[var(--accent-color)] uppercase tracking-[0.2em] font-light my-0.5">and</span>
            <h2 className="text-4xl font-extrabold text-[var(--primary-color)] tracking-wide gold-gradient-text">
              {weddingConfig.couple.brideNameEn}
            </h2>
          </div>

          <div className="w-12 h-[1px] bg-[var(--accent-color)] opacity-30 my-1" />

          {/* Ceremony Date slots */}
          <div className="flex flex-col gap-2.5">
            <h4 className="rtl-content text-lg font-bold text-[var(--primary-color)] leading-snug">
              {weddingConfig.event.dateTextAr}
            </h4>
            <p className="ltr-content text-xs text-gray-500 font-light tracking-wide">
              {weddingConfig.event.dateTextEn}
            </p>
          </div>

          <div className="rtl-content mt-3 text-xs text-gray-400 font-light max-w-xs leading-relaxed" style={{ fontFamily: 'var(--font-cairo)' }}>
            {weddingConfig.event.welcomeTextAr}
          </div>
        </div>

        <div className="w-full flex justify-center opacity-30 mb-2 select-none">
          <svg className="w-12 h-12 text-[var(--accent-color)] rotate-180" fill="currentColor" viewBox="0 0 100 100">
            <path d="M50,0 C22,0 0,22 0,50 C0,78 22,100 50,100 C78,100 100,78 100,50 C100,22 78,0 50,0 Z M50,10 C72,10 90,28 90,50 C90,72 72,90 50,90 C28,90 10,72 10,50 C10,28 28,10 50,10 Z" />
          </svg>
        </div>
      </div>
    </section>
  );
}
