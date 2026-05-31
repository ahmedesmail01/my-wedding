'use client';

import React, { useState } from 'react';
import { weddingConfig } from '@/config/wedding';
import ButterflyParticles from './ButterflyParticles';

interface OpenInvitationCoverProps {
  onOpen: () => void;
}

export default function OpenInvitationCover({ onOpen }: OpenInvitationCoverProps) {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    setIsOpening(true);
    // Allow the fade/slide transition to play before unmounting (approx 800ms)
    setTimeout(() => {
      onOpen();
    }, 800);
  };

  return (
    <div
      className={`absolute inset-0 z-50 flex flex-col justify-between items-center p-8 bg-[var(--bg-color)] transition-all duration-700 ease-in-out ${
        isOpening ? 'opacity-0 translate-y-[-100%]' : 'opacity-100 translate-y-0'
      }`}
      style={{ overflow: 'hidden' }}
    >
      {/* Semi-transparent rising butterflies inside the cover for visual wow factor */}
      <ButterflyParticles />

      {/* Decorative Top Border Accents */}
      <div className="w-full flex justify-between opacity-30 pointer-events-none select-none">
        <svg className="w-16 h-16 text-[var(--accent-color)]" fill="currentColor" viewBox="0 0 100 100">
          <path d="M0,0 H100 V100 C100,50 50,0 0,0" transform="scale(1, 1)" />
        </svg>
        <svg className="w-16 h-16 text-[var(--accent-color)]" fill="currentColor" viewBox="0 0 100 100">
          <path d="M0,0 H100 V100 C100,50 50,0 0,0" transform="scale(-1, 1) translate(-100, 0)" />
        </svg>
      </div>

      {/* Main Luxury Monogram Frame */}
      <div className="flex-1 flex flex-col justify-center items-center gap-8 w-full max-w-sm animate-fade-in-scale relative z-10">
        
        {/* Monogram circular medallion with glowing golden borders */}
        <div className="relative flex items-center justify-center w-36 h-36 rounded-full border-2 border-[var(--accent-color)] glass-panel shadow-lg animate-float">
          
          {/* Decorative outer dash border spinning slowly */}
          <div 
            className="absolute inset-[-6px] rounded-full border border-dashed border-[var(--accent-color)] opacity-60"
            style={{ animation: 'spinSlow 20s linear infinite' }}
          />
          
          {/* Inner monogram letterings */}
          <div className="flex flex-col items-center">
            <span 
              className="text-4xl font-bold gold-gradient-text"
              style={{ fontFamily: "var(--font-arabic)" }}
            >
              {weddingConfig.monogram.lettersAr}
            </span>
            <span 
              className="text-xs tracking-[0.25em] text-[var(--accent-color)] font-medium mt-1 uppercase"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {weddingConfig.monogram.lettersEn}
            </span>
          </div>
        </div>

        {/* Invitation Welcome Details */}
        <div className="text-center flex flex-col gap-3">
          <span 
            className="text-[var(--accent-color)] text-sm tracking-[0.3em] font-medium uppercase"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Wedding Invitation
          </span>
          
          <h1 
            className="text-4xl font-bold text-[var(--primary-color)] mt-2"
            style={{ fontFamily: "var(--font-arabic)" }}
          >
            {weddingConfig.monogram.titleAr}
          </h1>

          <p 
            className="text-sm tracking-[0.1em] text-gray-500 font-light mt-1"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {weddingConfig.monogram.titleEn}
          </p>
        </div>
      </div>

      {/* Interactive Trigger Area with Pulsing Gold CTA */}
      <div className="w-full flex flex-col items-center gap-6 animate-fade-in-up pb-10 relative z-10">
        
        <p 
          className="text-xs text-gray-400 font-light tracking-wide rtl-content"
          style={{ fontFamily: "var(--font-cairo)" }}
        >
          انقر لفتح بطاقة الدعوة الموسيقية
        </p>

        <button
          onClick={handleOpen}
          className="px-8 py-3.5 rounded-full bg-[var(--primary-color)] hover:bg-black text-[var(--bg-color)] border border-[var(--accent-color)] text-sm tracking-[0.2em] font-medium transition-all duration-300 transform active:scale-95 cursor-pointer shadow-lg animate-pulse-gold flex items-center gap-3"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          <span>OPEN INVITATION</span>
          <span className="text-[var(--accent-color)]">|</span>
          <span style={{ fontFamily: "var(--font-cairo)" }}>فتح الدعوة</span>
        </button>

      </div>

      {/* Decorative Bottom Corner Accents */}
      <div className="w-full flex justify-between opacity-30 pointer-events-none select-none">
        <svg className="w-16 h-16 text-[var(--accent-color)]" fill="currentColor" viewBox="0 0 100 100">
          <path d="M0,0 H100 V100 C100,50 50,0 0,0" transform="scale(1, -1) translate(0, -100)" />
        </svg>
        <svg className="w-16 h-16 text-[var(--accent-color)]" fill="currentColor" viewBox="0 0 100 100">
          <path d="M0,0 H100 V100 C100,50 50,0 0,0" transform="scale(-1, -1) translate(-100, -100)" />
        </svg>
      </div>
    </div>
  );
}
