'use client';

import React, { useState, useEffect } from 'react';
import { weddingConfig } from '@/config/wedding';

interface Greeting {
  name: string;
  message: string;
  date: string;
}

export default function SlideGuestbook() {
  const [greetings, setGreetings] = useState<Greeting[]>([]);
  const [gbName, setGbName] = useState('');
  const [gbMessage, setGbMessage] = useState('');

  useEffect(() => {
    const storedGreetings = localStorage.getItem('wedding_greetings');
    if (storedGreetings) {
      setGreetings(JSON.parse(storedGreetings));
    } else {
      setGreetings(weddingConfig.guestbook.initialGreetings);
    }
  }, []);

  const handleGreetingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gbName.trim() || !gbMessage.trim()) return;

    const newGreeting: Greeting = {
      name: gbName.trim(),
      message: gbMessage.trim(),
      date: new Date().toISOString().split('T')[0]
    };

    const updatedGreetings = [newGreeting, ...greetings];
    setGreetings(updatedGreetings);
    localStorage.setItem('wedding_greetings', JSON.stringify(updatedGreetings));

    setGbName('');
    setGbMessage('');
  };

  return (
    <section className="slide-card">
      <div className="slide-inner-frame">
        <span className="text-xs text-[var(--accent-color)] tracking-[0.3em] font-semibold uppercase mt-2" style={{ fontFamily: 'var(--font-serif)' }}>
          Guestbook
        </span>

        <div className="flex-1 flex flex-col justify-between items-center w-full mt-2 gap-4 max-h-[78%] overflow-hidden">
          <div className="text-center w-full">
            <h3 className="rtl-content text-lg font-bold text-[var(--primary-color)] mb-1" style={{ fontFamily: 'var(--font-cairo)' }}>
              دفتر مباركات العروسين
            </h3>
          </div>

          {/* Scrolling List of live congrats greetings */}
          <div className="flex-1 w-full overflow-y-auto max-h-[160px] flex flex-col gap-2.5 px-1 pr-2 border-y border-[rgba(212,175,55,0.1)] py-2 text-right">
            {greetings.length === 0 ? (
              <p className="rtl-content text-xs text-gray-400 font-light py-4">لا توجد تهاني بعد. كن أول من يهنئ!</p>
            ) : (
              greetings.map((g, idx) => (
                <div 
                  key={idx} 
                  className="glass-panel p-2.5 rounded-xl border border-[rgba(255,255,255,0.6)] shadow-xs animate-fade-in-scale text-right"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-gray-400" style={{ fontFamily: 'var(--font-serif)' }}>{g.date}</span>
                    <span className="text-xs font-bold text-[var(--accent-color)] rtl-content">{g.name}</span>
                  </div>
                  <p className="text-xs text-gray-600 rtl-content leading-relaxed font-light mt-0.5">
                    {g.message}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Quick Greeting inputs form */}
          <form onSubmit={handleGreetingSubmit} className="w-full max-w-[310px] flex flex-col gap-2.5">
            <div>
              <input
                type="text"
                required
                placeholder="اسمك الكريم"
                value={gbName}
                onChange={(e) => setGbName(e.target.value)}
                className="form-input"
              />
            </div>
            <div>
              <input
                type="text"
                required
                placeholder="اكتب مباركتك أو تهنئتك هنا..."
                value={gbMessage}
                onChange={(e) => setGbMessage(e.target.value)}
                className="form-input"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-[var(--primary-color)] hover:bg-black text-[var(--bg-color)] border border-[var(--accent-color)] text-xs font-semibold cursor-pointer shadow-sm transition-all duration-300 text-center"
              style={{ fontFamily: 'var(--font-cairo)' }}
            >
              إرسال التهنئة
            </button>
          </form>
        </div>

        <div className="w-10 h-0.5 bg-[var(--accent-color)] opacity-40 mb-4" />
      </div>
    </section>
  );
}
