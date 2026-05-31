'use client';

import React from 'react';
import { weddingConfig } from '@/config/wedding';

export default function SlideHosts() {
  return (
    <section className="slide-card">
      <div className="slide-inner-frame">
        <span className="text-xs text-[var(--accent-color)] tracking-[0.3em] font-semibold uppercase mt-2" style={{ fontFamily: 'var(--font-serif)' }}>
          In the Name of God
        </span>

        <div className="flex-1 flex flex-col justify-center items-center gap-6 w-full text-center">
          <div className="rtl-content flex flex-col gap-1 mt-4">
            <p className="text-sm text-gray-400 font-light" style={{ fontFamily: 'var(--font-cairo)' }}>
              بكل حب ومودة، يتشرف كل من
            </p>
            
            <h3 className="text-2xl font-bold text-[var(--primary-color)] mt-3">
              {weddingConfig.hosts.groomParentsAr}
            </h3>
            
            <span className="text-xs text-gray-400 my-1 font-light">&</span>
            
            <h3 className="text-2xl font-bold text-[var(--primary-color)]">
              {weddingConfig.hosts.brideParentsAr}
            </h3>
          </div>

          <div className="w-8 h-[1px] bg-[var(--accent-color)] opacity-30 my-2" />

          <div className="rtl-content flex flex-col gap-2">
            <p className="text-sm text-gray-500 max-w-xs font-light leading-relaxed" style={{ fontFamily: 'var(--font-cairo)' }}>
              بدعوتكم لحضور حفل زفاف ولديهما الغاليين
            </p>
            
            <div className="text-3xl font-extrabold text-[var(--primary-color)] mt-2 font-arabic flex items-center justify-center gap-4">
              <span className="gold-gradient-text">{weddingConfig.couple.groomNameAr}</span>
              <span className="text-sm font-light text-gray-400">&</span>
              <span className="gold-gradient-text">{weddingConfig.couple.brideNameAr}</span>
            </div>
          </div>
        </div>

        <div className="w-10 h-0.5 bg-[var(--accent-color)] opacity-40 mb-4" />
      </div>
    </section>
  );
}
