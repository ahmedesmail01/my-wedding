'use client';

import React, { useState, useEffect, useRef } from 'react';
import ButterflyParticles from './ButterflyParticles';
import AudioPlayer from './AudioPlayer';

// Import refactored modular slide panels
import SlideCalligraphy from './slides/SlideCalligraphy';
import SlideHosts from './slides/SlideHosts';
import SlideCouple from './slides/SlideCouple';
import SlideCountdown from './slides/SlideCountdown';
import SlideVenue from './slides/SlideVenue';
import SlideRsvp from './slides/SlideRsvp';
import SlideGuestbook from './slides/SlideGuestbook';

export default function WeddingInvitation() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [mounted, setMounted] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const totalSlides = 6;

  useEffect(() => {
    setMounted(true);
    // Auto-commence playback after cover gate transition completes
    const timer = setTimeout(() => {
      setIsPlaying(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Sync scroll snap positions to dynamic indicators
  const handleScroll = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const scrollTop = scroller.scrollTop;
    const clientHeight = scroller.clientHeight;
    const index = Math.round(scrollTop / clientHeight);

    if (index !== activeSlide && index >= 0 && index < totalSlides) {
      setActiveSlide(index);
    }
  };

  const scrollToSlide = (index: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    scroller.scrollTo({
      top: index * scroller.clientHeight,
      behavior: 'smooth'
    });
    setActiveSlide(index);
  };

  if (!mounted) return null;

  return (
    <div className="mobile-wrapper select-none">
      {/* Floating Canvas Particles */}
      <ButterflyParticles />

      {/* Floating Soundtrack Player */}
      <AudioPlayer isPlaying={isPlaying} onTogglePlay={setIsPlaying} />

      {/* Slide Indicators Navigation (Vertical Dot Overlays) */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-40 flex flex-col gap-3.5">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToSlide(i)}
            className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300 border border-[var(--accent-color)] ${activeSlide === i
              ? 'bg-[var(--accent-color)] scale-125 shadow-md shadow-[var(--accent-glow)]'
              : 'bg-transparent opacity-40 hover:opacity-100'
              }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Dynamic Slide Counter Tag (0X / 07) */}
      {/* <div className="glass-panel absolute left-6 top-6 z-40 px-3 py-1.5 rounded-full border border-[rgba(212,175,55,0.25)] flex items-center gap-1.5 text-xs text-[var(--accent-color)] font-medium">
        <span style={{ fontFamily: 'var(--font-serif)' }}>0{activeSlide + 1}</span>
        <span className="opacity-30">/</span>
        <span style={{ fontFamily: 'var(--font-serif)' }}>0{totalSlides}</span>
      </div> */}

      {/* Snap Scroller Container */}
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="slides-scroller relative top-6"
      >
        <SlideCalligraphy />
        <SlideHosts />
        <SlideCouple />
        <SlideCountdown />
        <SlideVenue />
        {/* <SlideRsvp /> */}
        <SlideGuestbook />
      </div>
    </div>
  );
}
