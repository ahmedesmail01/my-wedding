'use client';

import React, { useState, useEffect } from 'react';
import { weddingConfig } from '@/config/wedding';

export default function SlideCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    completed: false
  });

  useEffect(() => {
    const parseDateSafe = (isoStr: string): number => {
      const t = new Date(isoStr).getTime();
      if (!isNaN(t)) return t;

      // Robust custom parser fallback for older Safari/iOS platforms
      const match = isoStr.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:Z|([+-])(\d{2}):(\d{2}))?$/);
      if (!match) return Date.now();

      const [, y, m, d, hr, min, sec, sign, tzH, tzM] = match;
      const utcTimestamp = Date.UTC(
        parseInt(y, 10),
        parseInt(m, 10) - 1,
        parseInt(d, 10),
        parseInt(hr, 10),
        parseInt(min, 10),
        parseInt(sec, 10)
      );

      if (sign && tzH && tzM) {
        const offsetMs = (parseInt(tzH, 10) * 60 + parseInt(tzM, 10)) * 60 * 1000;
        return sign === '+' ? utcTimestamp - offsetMs : utcTimestamp + offsetMs;
      }
      return utcTimestamp;
    };

    const calculateTime = () => {
      const targetDate = parseDateSafe(weddingConfig.event.dateTimeIso);
      const now = Date.now();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, completed: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, completed: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDownloadIcs = () => {
    const e = weddingConfig.event;
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Antigravity SaaS//NONSGML Wedding Invite//EN",
      "BEGIN:VEVENT",
      "UID:wedding-ahmed-marwa-2026",
      "DTSTAMP:20260601T000000Z",
      "DTSTART:20260829T170000Z", // UTC standard
      "DTEND:20260829T230000Z",
      `SUMMARY:${e.calendarTitle}`,
      `DESCRIPTION:${e.calendarDescription}`,
      `LOCATION:${e.venueNameEn}, ${e.venueAddressEn}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'wedding-invitation.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getGoogleCalendarUrl = () => {
    const e = weddingConfig.event;
    const title = encodeURIComponent(e.calendarTitle);
    const desc = encodeURIComponent(e.calendarDescription);
    const loc = encodeURIComponent(`${e.venueNameEn}, ${e.venueAddressEn}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20260829T170000Z/20260829T230000Z&details=${desc}&location=${loc}`;
  };

  return (
    <section className="slide-card">
      <div className="slide-inner-frame">
        <span className="text-xs text-[var(--accent-color)] tracking-[0.3em] font-semibold uppercase mt-2" style={{ fontFamily: 'var(--font-serif)' }}>
          Countdown
        </span>

        <div className="flex-1 flex flex-col justify-center items-center gap-7 w-full">
          <h3 className="rtl-content text-lg font-bold text-[var(--primary-color)]" style={{ fontFamily: 'var(--font-cairo)' }}>
            تبقّى على حلم العمر
          </h3>

          {/* Countdown Circular UI Slots */}
          <div className="flex items-center justify-center gap-3.5 w-full">
            {/* Days Box */}
            <div className="flex flex-col items-center gap-1.5 w-16 h-18 rounded-xl border border-[rgba(212,175,55,0.25)] glass-panel justify-center shadow-sm">
              <span className="text-xl font-bold text-[var(--primary-color)]" style={{ fontFamily: 'var(--font-serif)' }}>
                {timeLeft.days}
              </span>
              <span className="text-[10px] font-medium text-[var(--accent-color)]" style={{ fontFamily: 'var(--font-cairo)' }}>
                يوم
              </span>
            </div>

            {/* Hours Box */}
            <div className="flex flex-col items-center gap-1.5 w-16 h-18 rounded-xl border border-[rgba(212,175,55,0.25)] glass-panel justify-center shadow-sm">
              <span className="text-xl font-bold text-[var(--primary-color)]" style={{ fontFamily: 'var(--font-serif)' }}>
                {timeLeft.hours}
              </span>
              <span className="text-[10px] font-medium text-[var(--accent-color)]" style={{ fontFamily: 'var(--font-cairo)' }}>
                ساعة
              </span>
            </div>

            {/* Minutes Box */}
            <div className="flex flex-col items-center gap-1.5 w-16 h-18 rounded-xl border border-[rgba(212,175,55,0.25)] glass-panel justify-center shadow-sm">
              <span className="text-xl font-bold text-[var(--primary-color)]" style={{ fontFamily: 'var(--font-serif)' }}>
                {timeLeft.minutes}
              </span>
              <span className="text-[10px] font-medium text-[var(--accent-color)]" style={{ fontFamily: 'var(--font-cairo)' }}>
                دقيقة
              </span>
            </div>

            {/* Seconds Box */}
            <div className="flex flex-col items-center gap-1.5 w-16 h-18 rounded-xl border border-[rgba(212,175,55,0.25)] glass-panel justify-center shadow-sm">
              <span className="text-xl font-bold text-[var(--primary-color)]" style={{ fontFamily: 'var(--font-serif)' }}>
                {timeLeft.seconds}
              </span>
              <span className="text-[10px] font-medium text-[var(--accent-color)]" style={{ fontFamily: 'var(--font-cairo)' }}>
                ثانية
              </span>
            </div>
          </div>

          {/* Calendar Sync Buttons */}
          <div className="flex flex-col gap-3.5 w-full max-w-[240px] mt-2">
            <button
              onClick={handleDownloadIcs}
              className="w-full py-2.5 rounded-full bg-[var(--primary-color)] hover:bg-black text-[var(--bg-color)] border border-[var(--accent-color)] text-xs tracking-wider font-semibold cursor-pointer shadow-sm transition-all duration-300 flex items-center justify-center gap-2"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>ADD TO OUTLOOK / APPLE</span>
            </button>

            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-full glass-panel hover:bg-white text-[var(--primary-color)] border border-[rgba(212,175,55,0.3)] text-xs tracking-wider font-semibold cursor-pointer shadow-sm transition-all duration-300 flex items-center justify-center gap-2 text-center"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              <svg className="w-3.5 h-3.5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
              </svg>
              <span>ADD TO GOOGLE CALENDAR</span>
            </a>
          </div>
        </div>

        <div className="w-10 h-0.5 bg-[var(--accent-color)] opacity-40 mb-4" />
      </div>
    </section>
  );
}
