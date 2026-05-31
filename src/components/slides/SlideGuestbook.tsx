'use client';

import React, { useState, useEffect } from 'react';
import { DbGreeting } from '@/lib/db';

export default function SlideGuestbook() {
  const [greetings, setGreetings] = useState<DbGreeting[]>([]);
  const [gbName, setGbName] = useState('');
  const [gbMessage, setGbMessage] = useState('');

  // Loading & submission status
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch approved greetings on component mount
  useEffect(() => {
    fetchGreetings();
  }, []);

  const fetchGreetings = async () => {
    try {
      const response = await fetch('/api/greetings');
      if (response.ok) {
        const data = await response.json();
        setGreetings(data);
      }
    } catch (err) {
      console.error("Failed to load greetings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGreetingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gbName.trim() || !gbMessage.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      const response = await fetch('/api/greetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: gbName.trim(),
          message: gbMessage.trim(),
        })
      });

      if (response.ok) {
        setGbName('');
        setGbMessage('');
        setSubmitSuccess(true);

        // Hide temporary toast banner after 6s
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 6000);
      } else {
        alert("عذراً، فشل إرسال مباركتك. يرجى المحاولة لاحقاً.");
      }
    } catch (err) {
      console.error("Submit greeting error:", err);
      alert("فشل الاتصال بالخادم. يرجى التحقق من الشبكة.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const dateObj = new Date(dateStr);
      return dateObj.toISOString().split('T')[0];
    } catch (e) {
      return dateStr;
    }
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
            {isLoading ? (
              /* Loading Spinner inside list */
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <span className="w-5 h-5 border-2 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin" />
                <span className="text-[10px] text-gray-400 font-light" style={{ fontFamily: 'var(--font-cairo)' }}>جاري تحميل مباركات الضيوف...</span>
              </div>
            ) : greetings.length === 0 ? (
              <p className="rtl-content text-xs text-gray-400 font-light py-4">لا توجد تهاني معتمدة بعد. كن أول من يهنئ!</p>
            ) : (
              greetings.map((g) => (
                <div
                  key={g.id}
                  className="glass-panel p-2.5 rounded-xl border border-[rgba(255,255,255,0.6)] shadow-xs animate-fade-in-scale text-right"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-gray-400" style={{ fontFamily: 'var(--font-serif)' }}>
                      {formatDate(g.created_at)}
                    </span>
                    <span className="text-xs font-bold text-[var(--accent-color)] rtl-content">{g.name}</span>
                  </div>
                  <p className="text-xs text-gray-600 rtl-content leading-relaxed font-light mt-0.5 whitespace-pre-line">
                    {g.message}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Submit Success Toast overlay */}
          {submitSuccess && (
            <div className="p-3.5 rounded-xl bg-green-950/40 text-green-200 border border-green-800 text-xs rtl-content leading-relaxed animate-fade-in-scale text-center max-w-[280px]">
              ✨ تم إرسال تهنئتك بنجاح! .
            </div>
          )}

          {/* Quick Greeting inputs form */}
          {!submitSuccess && (
            <form onSubmit={handleGreetingSubmit} className="w-full max-w-[310px] flex flex-col gap-2.5">
              <div>
                <input
                  type="text"
                  required
                  placeholder="اسمك الكريم"
                  maxLength={50}
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
                  maxLength={400}
                  value={gbMessage}
                  onChange={(e) => setGbMessage(e.target.value)}
                  className="form-input"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 rounded-xl bg-[var(--primary-color)] hover:bg-black text-[var(--bg-color)] border border-[var(--accent-color)] text-xs font-semibold cursor-pointer shadow-sm transition-all duration-300 text-center flex items-center justify-center gap-2"
                style={{ fontFamily: 'var(--font-cairo)' }}
              >
                {isSubmitting ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>إرسال التهنئة</span>
                )}
              </button>
            </form>
          )}
        </div>

        <div className="w-10 h-0.5 bg-[var(--accent-color)] opacity-40 mb-4" />
      </div>
    </section>
  );
}
