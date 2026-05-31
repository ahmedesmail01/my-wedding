'use client';

import React from 'react';
import { weddingConfig } from '@/config/wedding';

export default function SlideVenue() {
  return (
    <section className="slide-card">
      <div className="slide-inner-frame">
        <span className="text-xs text-[var(--accent-color)] tracking-[0.3em] font-semibold uppercase mt-2" style={{ fontFamily: 'var(--font-serif)' }}>
          The Venue
        </span>

        <div className="flex-1 flex flex-col justify-center items-center gap-6 w-full text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.2)] select-none">
            <svg className="w-8 h-8 text-[var(--accent-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>

          <div className="rtl-content flex flex-col gap-1.5 mt-2">
            <h3 className="text-2xl font-bold text-[var(--primary-color)]">
              {weddingConfig.event.venueNameAr}
            </h3>
            <p className="text-sm text-gray-500 font-light mt-0.5" style={{ fontFamily: 'var(--font-cairo)' }}>
              {weddingConfig.event.venueAddressAr}
            </p>
          </div>

          <div className="ltr-content flex flex-col gap-1">
            <h4 className="text-sm font-semibold tracking-wider text-gray-700">
              {weddingConfig.event.venueNameEn}
            </h4>
            <p className="text-xs text-gray-400 font-light">
              {weddingConfig.event.venueAddressEn}
            </p>
          </div>

          <div className="w-12 h-[1px] bg-[var(--accent-color)] opacity-30 my-1" />

          <a
            href={weddingConfig.event.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-full bg-[var(--primary-color)] hover:bg-black text-[var(--bg-color)] border border-[var(--accent-color)] text-xs tracking-widest font-semibold cursor-pointer shadow-sm transition-all duration-300 flex items-center justify-center gap-2"
            style={{ fontFamily: 'var(--font-cairo)' }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2l6 3 5.447-2.724A1 1 0 0121 3.176v10.764a1 1 0 01-.553.894L15 18l-6 2z" />
            </svg>
            <span>تحديد موقع القاعة (Google Maps)</span>
          </a>
        </div>

        <div className="w-10 h-0.5 bg-[var(--accent-color)] opacity-40 mb-4" />
      </div>
    </section>
  );
}
