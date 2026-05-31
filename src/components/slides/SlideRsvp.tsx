'use client';

import React, { useState, useEffect } from 'react';
import { weddingConfig } from '@/config/wedding';

export default function SlideRsvp() {
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpAttending, setRsvpAttending] = useState<'yes' | 'no' | ''>('');
  const [rsvpGuests, setRsvpGuests] = useState(1);
  const [rsvpNote, setRsvpNote] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  useEffect(() => {
    const storedRsvp = localStorage.getItem('wedding_rsvp');
    if (storedRsvp) {
      setRsvpSubmitted(true);
    }
  }, []);

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName || !rsvpAttending) return;

    const rsvpData = {
      name: rsvpName,
      attending: rsvpAttending === 'yes',
      guestsCount: rsvpAttending === 'yes' ? rsvpGuests : 0,
      note: rsvpNote,
      date: new Date().toISOString().split('T')[0]
    };

    localStorage.setItem('wedding_rsvp', JSON.stringify(rsvpData));
    setRsvpSubmitted(true);

    console.log("Posting RSVP data to endpoint API...", rsvpData);
    if (weddingConfig.rsvp.sheetApiUrl) {
      fetch(weddingConfig.rsvp.sheetApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rsvpData)
      }).catch(err => console.error("Simulated webhook post error:", err));
    }
  };

  return (
    <section className="slide-card">
      <div className="slide-inner-frame">
        <span className="text-xs text-[var(--accent-color)] tracking-[0.3em] font-semibold uppercase mt-2" style={{ fontFamily: 'var(--font-serif)' }}>
          R.S.V.P
        </span>

        <div className="flex-1 flex flex-col justify-center items-center w-full mt-2">
          {rsvpSubmitted ? (
            /* Glowing Success Confirmation Screen */
            <div className="glass-panel w-full max-w-[310px] p-6 rounded-2xl border border-[rgba(212,175,55,0.25)] text-center animate-fade-in-scale flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center border border-green-200">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="rtl-content flex flex-col gap-2">
                <h4 className="text-lg font-bold text-green-700">تم تسجيل تأكيد حضورك</h4>
                <p className="text-xs text-gray-500 font-light leading-relaxed">
                  شكراً جزيلاً لتأكيد حضورك، نسعد بتواجدك ومشاركتنا ليلتنا السعيدة.
                </p>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('wedding_rsvp');
                  setRsvpSubmitted(false);
                }}
                className="text-[10px] text-gray-400 underline hover:text-[var(--accent-color)] cursor-pointer mt-1 font-medium"
                style={{ fontFamily: 'var(--font-cairo)' }}
              >
                تعديل الاستجابة / Edit Response
              </button>
            </div>
          ) : (
            /* Interactive RSVP Form */
            <form onSubmit={handleRsvpSubmit} className="w-full max-w-[310px] flex flex-col gap-3 px-1.5">
              <div className="text-center mb-1">
                <h3 className="rtl-content text-lg font-bold text-[var(--primary-color)]" style={{ fontFamily: 'var(--font-cairo)' }}>
                  تأكيد حضور الحفل
                </h3>
              </div>

              {/* Guest Name input */}
              <div>
                <label className="form-label" htmlFor="rsvp-name">الاسم الكريم</label>
                <input
                  type="text"
                  id="rsvp-name"
                  required
                  placeholder="فضلاً، أدخل اسمك الكامل"
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  className="form-input"
                />
              </div>

              {/* Attendance trigger button slots */}
              <div>
                <span className="form-label">هل ستشرفنا بالحضور؟</span>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setRsvpAttending('yes')}
                    className={`py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all duration-300 flex items-center justify-center gap-1.5 ${
                      rsvpAttending === 'yes'
                        ? 'bg-[var(--primary-color)] text-[var(--bg-color)] border-[var(--accent-color)] shadow-sm'
                        : 'bg-white/60 hover:bg-white text-gray-700 border-gray-200'
                    }`}
                    style={{ fontFamily: 'var(--font-cairo)' }}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${rsvpAttending === 'yes' ? 'bg-[var(--accent-color)] animate-ping' : 'bg-gray-300'}`} />
                    <span>نعم، بكل سرور</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRsvpAttending('no')}
                    className={`py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all duration-300 flex items-center justify-center gap-1.5 ${
                      rsvpAttending === 'no'
                        ? 'bg-red-950 text-red-100 border-red-800 shadow-sm'
                        : 'bg-white/60 hover:bg-white text-gray-700 border-gray-200'
                    }`}
                    style={{ fontFamily: 'var(--font-cairo)' }}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${rsvpAttending === 'no' ? 'bg-red-400' : 'bg-gray-300'}`} />
                    <span>أعتذر، لظروف</span>
                  </button>
                </div>
              </div>

              {/* Number of accompanying guests */}
              {rsvpAttending === 'yes' && (
                <div className="animate-fade-in-up">
                  <label className="form-label" htmlFor="rsvp-guests">عدد المرافقين</label>
                  <select
                    id="rsvp-guests"
                    value={rsvpGuests}
                    onChange={(e) => setRsvpGuests(Number(e.target.value))}
                    className="form-input cursor-pointer"
                  >
                    {Array.from({ length: weddingConfig.rsvp.maxGuestsPerInvite }).map((_, idx) => (
                      <option key={idx + 1} value={idx + 1}>
                        {idx === 0 ? "أنا فقط (بدون مرافقين)" : `${idx + 1} مرافقين`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Custom Note input */}
              <div>
                <label className="form-label" htmlFor="rsvp-note">تهنئة خاصة أو ملاحظة</label>
                <textarea
                  id="rsvp-note"
                  rows={2}
                  placeholder="تمنياتك الجميلة للعروسين..."
                  value={rsvpNote}
                  onChange={(e) => setRsvpNote(e.target.value)}
                  className="form-input resize-none py-2 h-14"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full py-2.5 mt-2 rounded-xl bg-[var(--primary-color)] hover:bg-black text-[var(--bg-color)] border border-[var(--accent-color)] text-sm tracking-wider font-semibold cursor-pointer shadow-md transition-all duration-300 text-center"
                style={{ fontFamily: 'var(--font-cairo)' }}
              >
                إرسال تأكيد الحضور
              </button>
            </form>
          )}
        </div>

        <div className="w-10 h-0.5 bg-[var(--accent-color)] opacity-40 mb-4" />
      </div>
    </section>
  );
}
