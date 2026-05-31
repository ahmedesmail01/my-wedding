'use client';

import React, { useEffect, useState } from 'react';
import { weddingConfig } from '@/config/wedding';
import { DbGreeting } from '@/lib/db';

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Login Form fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard Data fields
  const [greetings, setGreetings] = useState<DbGreeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState({ text: '', type: 'success' });

  // Initial check on client mount
  useEffect(() => {
    setMounted(true);
    checkCurrentSession();
  }, []);

  const checkCurrentSession = async () => {
    try {
      const response = await fetch('/api/admin/greetings');
      if (response.ok) {
        const data = await response.json();
        setGreetings(data);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Session check failed:", err);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setIsLoggingIn(true);
    setLoginError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        // Authenticated successfully, load all greetings
        await checkCurrentSession();
      } else {
        const data = await response.json();
        setLoginError(data.error || "خطأ في تسجيل الدخول. يرجى المحاولة ثانية.");
      }
    } catch (err) {
      console.error("Login request error:", err);
      setLoginError("فشل الاتصال بالخادم. يرجى التحقق من الشبكة.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Helper trigger to display temporary notification toasts
  const triggerToast = (text: string, type: 'success' | 'error') => {
    setActionMessage({ text, type });
    setTimeout(() => {
      setActionMessage({ text: '', type: 'success' });
    }, 4000);
  };

  const handleApprove = async (id: number) => {
    try {
      const response = await fetch('/api/admin/greetings/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        // Optimistic UI state update: toggle approved to true
        setGreetings(prev =>
          prev.map(g => (g.id === id ? { ...g, approved: true } : g))
        );
        triggerToast("تمت الموافقة على مباركة الضيف وتفعيلها للعامة بنجاح", 'success');
      } else {
        triggerToast("فشل في تفعيل التهنئة. يرجى المحاولة ثانية.", 'error');
      }
    } catch (err) {
      console.error("Approve request error:", err);
      triggerToast("فشل الاتصال بالخادم.", 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف تهنئة هذا الضيف نهائياً؟")) return;

    try {
      const response = await fetch('/api/admin/greetings/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        // Optimistic UI state update: remove greeting by id
        setGreetings(prev => prev.filter(g => g.id !== id));
        triggerToast("تم حذف مباركة الضيف نهائياً بنجاح", 'success');
      } else {
        triggerToast("فشل في حذف التهنئة.", 'error');
      }
    } catch (err) {
      console.error("Delete request error:", err);
      triggerToast("فشل الاتصال بالخادم.", 'error');
    }
  };

  if (!mounted) return null;

  // Render Login Card Overlay if unauthorized
  if (!isAuthenticated) {
    return (
      <div 
        className="min-h-screen w-full flex items-center justify-center bg-zinc-950 p-6 flex-col gap-6"
        style={{ backgroundImage: 'radial-gradient(circle at center, #232d30 0%, #0d1213 100%)' }}
      >
        <form 
          onSubmit={handleLoginSubmit}
          className="glass-panel w-full max-w-sm p-8 rounded-3xl border border-[rgba(212,175,55,0.25)] flex flex-col gap-5 text-right relative z-10"
        >
          {/* Header Monogram logo mock */}
          <div className="flex flex-col items-center gap-2 text-center mb-2">
            <div className="w-16 h-16 rounded-full border border-[var(--accent-color)] flex items-center justify-center text-xl font-bold gold-gradient-text" style={{ fontFamily: 'var(--font-arabic)' }}>
              {weddingConfig.monogram.lettersAr}
            </div>
            <h2 className="text-xl font-bold text-gray-800 mt-2" style={{ fontFamily: 'var(--font-cairo)' }}>
              لوحة تحكم مباركات المدعوين
            </h2>
            <p className="text-xs text-gray-400 font-light" style={{ fontFamily: 'var(--font-cairo)' }}>
              أدخل بيانات المشرف لتصفح واعتماد التهاني
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-red-950/40 text-red-200 border border-red-800 text-xs text-right animate-fade-in-scale">
              {loginError}
            </div>
          )}

          {/* Username Input */}
          <div>
            <label className="form-label" htmlFor="username">اسم المستخدم</label>
            <input
              type="text"
              id="username"
              required
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input ltr:text-left"
              style={{ direction: 'ltr' }}
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="form-label" htmlFor="password">كلمة المرور</label>
            <input
              type="password"
              id="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              style={{ direction: 'ltr' }}
            />
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-3 mt-2 rounded-xl bg-[var(--primary-color)] hover:bg-black text-[var(--bg-color)] border border-[var(--accent-color)] text-sm font-bold cursor-pointer shadow-md transition-all duration-300 flex items-center justify-center gap-2"
            style={{ fontFamily: 'var(--font-cairo)' }}
          >
            {isLoggingIn ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>تسجيل الدخول</span>
            )}
          </button>
        </form>

        <a 
          href="/"
          className="text-xs text-gray-500 underline hover:text-[var(--accent-color)]"
          style={{ fontFamily: 'var(--font-cairo)' }}
        >
          العودة لصفحة الدعوة الرئيسية ←
        </a>
      </div>
    );
  }

  // Filter greetings
  const pendingGreetings = greetings.filter(g => !g.approved);
  const approvedGreetings = greetings.filter(g => g.approved);

  return (
    <main 
      className="min-h-screen w-full bg-[var(--bg-color)] p-6 lg:p-10 flex flex-col gap-6"
      style={{ fontFamily: 'var(--font-cairo)' }}
    >
      
      {/* Toast Notification */}
      {actionMessage.text && (
        <div 
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl border shadow-lg text-sm text-right animate-fade-in-up flex items-center gap-3 ${
            actionMessage.type === 'success' 
              ? 'bg-green-950/90 text-green-200 border-green-800' 
              : 'bg-red-950/90 text-red-200 border-red-800'
          }`}
        >
          <span>{actionMessage.text}</span>
          <span className={`w-2 h-2 rounded-full ${actionMessage.type === 'success' ? 'bg-green-400' : 'bg-red-400'}`} />
        </div>
      )}

      {/* Header Panel */}
      <header className="glass-panel w-full p-6 rounded-2xl border border-[rgba(212,175,55,0.2)] flex flex-col md:flex-row-reverse justify-between items-center gap-4">
        
        {/* Title */}
        <div className="text-right">
          <h1 className="text-2xl font-bold text-[var(--primary-color)]">
            لوحة الإشراف والمراجعة
          </h1>
          <p className="text-xs text-gray-500 font-light mt-1">
            إدارة مباركات وتهاني حفل زفاف {weddingConfig.monogram.titleAr}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white/60 hover:bg-white text-xs text-gray-600 transition-all cursor-pointer shadow-xs"
          >
            تصفح بطاقة الدعوة الرئيسية ←
          </a>
          <button
            onClick={() => {
              // Sign out simply by removing session cookie via browser mock reset or refresh
              document.cookie = "wedding_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              setIsAuthenticated(false);
            }}
            className="px-4 py-2 rounded-xl bg-red-950 hover:bg-red-900 border border-red-800 text-xs text-red-100 transition-all cursor-pointer shadow-xs"
          >
            تسجيل الخروج
          </button>
        </div>

      </header>

      {/* Statistics Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full">
        
        {/* Total Box */}
        <div className="glass-panel p-5 rounded-2xl border border-[rgba(212,175,55,0.15)] flex flex-col gap-1 text-right">
          <span className="text-xs text-gray-400 font-light">إجمالي المباركات</span>
          <span className="text-3xl font-extrabold text-[var(--primary-color)] font-serif mt-1">{greetings.length}</span>
        </div>

        {/* Pending Box */}
        <div className="glass-panel p-5 rounded-2xl border border-[rgba(212,175,55,0.15)] flex flex-col gap-1 text-right">
          <span className="text-xs text-gray-400 font-light">بانتظار الموافقة (قيد المراجعة)</span>
          <span className={`text-3xl font-extrabold font-serif mt-1 ${pendingGreetings.length > 0 ? 'text-amber-600 animate-pulse' : 'text-gray-500'}`}>
            {pendingGreetings.length}
          </span>
        </div>

        {/* Approved Box */}
        <div className="glass-panel p-5 rounded-2xl border border-[rgba(212,175,55,0.15)] flex flex-col gap-1 text-right">
          <span className="text-xs text-gray-400 font-light">المباركات المفعلة للعامة</span>
          <span className="text-3xl font-extrabold text-green-700 font-serif mt-1">{approvedGreetings.length}</span>
        </div>

      </section>

      {/* Main Column Listing Sections */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full items-start">
        
        {/* ====================================================
            COLUMN 1: PENDING QUEUE
           ==================================================== */}
        <div className="flex flex-col gap-4">
          
          <div className="flex justify-between items-center px-2 flex-row-reverse">
            <h3 className="text-lg font-bold text-[var(--primary-color)] flex items-center gap-2">
              <span>طابور المراجعة والاعتماد</span>
              <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-bold">
                {pendingGreetings.length}
              </span>
            </h3>
          </div>

          <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
            {pendingGreetings.length === 0 ? (
              <div className="glass-panel p-10 rounded-2xl text-center text-gray-400 font-light border border-[rgba(212,175,55,0.1)]">
                لا توجد تهاني معلقة قيد المراجعة حالياً. جميع تهاني الضيوف معتمدة!
              </div>
            ) : (
              pendingGreetings.map((g) => (
                <div 
                  key={g.id} 
                  className="glass-panel p-5 rounded-2xl border border-amber-200/50 shadow-xs flex flex-col gap-3 text-right animate-fade-in-scale"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-400 font-serif">
                      {new Date(g.created_at).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                    <span className="text-sm font-bold text-[var(--accent-color)]">{g.name}</span>
                  </div>
                  
                  <p className="text-sm text-gray-700 font-light leading-relaxed whitespace-pre-line border-y border-[rgba(212,175,55,0.05)] py-2">
                    {g.message}
                  </p>

                  <div className="flex justify-start gap-2.5 mt-1">
                    <button
                      onClick={() => handleApprove(g.id)}
                      className="px-4 py-1.5 rounded-lg bg-green-700 hover:bg-green-800 border border-green-600 text-xs text-green-50 font-semibold cursor-pointer shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>اعتماد وتفعيل</span>
                    </button>
                    
                    <button
                      onClick={() => handleDelete(g.id)}
                      className="px-4 py-1.5 rounded-lg bg-red-950 hover:bg-red-900 border border-red-800 text-xs text-red-100 transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>حذف التهنئة</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

        {/* ====================================================
            COLUMN 2: LIVE APPROVED LIST
           ==================================================== */}
        <div className="flex flex-col gap-4">
          
          <div className="flex justify-between items-center px-2 flex-row-reverse">
            <h3 className="text-lg font-bold text-[var(--primary-color)] flex items-center gap-2">
              <span>المباركات المفعلة للجمهور</span>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-bold">
                {approvedGreetings.length}
              </span>
            </h3>
          </div>

          <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
            {approvedGreetings.length === 0 ? (
              <div className="glass-panel p-10 rounded-2xl text-center text-gray-400 font-light border border-[rgba(212,175,55,0.1)]">
                لم يتم تفعيل أو نشر أي تهاني للجمهور حتى الآن.
              </div>
            ) : (
              approvedGreetings.map((g) => (
                <div 
                  key={g.id} 
                  className="glass-panel p-5 rounded-2xl border border-[rgba(212,175,55,0.1)] shadow-xs flex flex-col gap-3 text-right animate-fade-in-scale"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-400 font-serif">
                      {new Date(g.created_at).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                    <span className="text-sm font-bold text-gray-700">{g.name}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 font-light leading-relaxed whitespace-pre-line border-y border-[rgba(0,0,0,0.03)] py-2">
                    {g.message}
                  </p>

                  <div className="flex justify-start">
                    <button
                      onClick={() => handleDelete(g.id)}
                      className="px-4 py-1.5 rounded-lg border border-red-200 text-xs text-red-600 hover:bg-red-50 cursor-pointer shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>حذف / إيقاف النشر</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

      </section>

    </main>
  );
}
