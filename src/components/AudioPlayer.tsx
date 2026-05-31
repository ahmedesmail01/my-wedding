'use client';

import React, { useEffect, useRef, useState } from 'react';
import { weddingConfig } from '@/config/wedding';

interface AudioPlayerProps {
  isPlaying: boolean;
  onTogglePlay: (playState: boolean) => void;
}

export default function AudioPlayer({ isPlaying, onTogglePlay }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initialize HTML5 Audio safely on client mount
    const audio = new Audio(weddingConfig.audio.url);
    audio.loop = true;
    audioRef.current = audio;

    // Custom visibility change listener to pause music when screen locks or tab switches
    const handleVisibilityChange = () => {
      if (!audioRef.current) return;
      if (document.hidden) {
        audioRef.current.pause();
      } else if (isPlaying) {
        audioRef.current.play().catch(() => {
          // fail silently if browser blocks play
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Sync state between parent prop and actual HTML5 Audio player
  useEffect(() => {
    if (!audioRef.current || !mounted) return;

    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log("Autoplay blocked by browser. Awaiting user interaction.", err);
          onTogglePlay(false);
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, mounted]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering slide snap clicks
    onTogglePlay(!isPlaying);
  };

  if (!mounted) return null;

  return (
    <button
      onClick={handleToggle}
      className={`glass-panel fixed top-6 right-6 z-50 flex items-center justify-center w-11 h-11 rounded-full cursor-pointer transition-all duration-300 border border-[rgba(212,175,55,0.3)] shadow-md hover:scale-105 active:scale-95 ${
        isPlaying ? 'audio-playing border-[var(--accent-color)] animate-pulse-gold' : 'audio-paused opacity-70'
      }`}
      aria-label={isPlaying ? 'Pause music' : 'Play music'}
      title={isPlaying ? `Now Playing: ${weddingConfig.audio.title}` : 'Play background music'}
    >
      <div className="flex items-center gap-1">
        {isPlaying ? (
          /* Sleek glowing dynamic equalizer animation */
          <div className="eq-container">
            <span className="eq-bar"></span>
            <span className="eq-bar"></span>
            <span className="eq-bar"></span>
            <span className="eq-bar"></span>
          </div>
        ) : (
          /* Muted custom SVG speaker note */
          <svg
            className="w-4 h-4 text-gray-500 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
            />
          </svg>
        )}
      </div>
    </button>
  );
}
