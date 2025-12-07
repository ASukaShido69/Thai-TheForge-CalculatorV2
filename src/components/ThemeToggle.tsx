'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // ปุ่มจะแสดงเมื่อ scroll อยู่ที่บนสุด หรือกำลังขึ้น
      // จะซ่อนเมื่อกำลังลงและออกไปจากบนสุด
      if (currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // กำลังลง - ซ่อน
        setIsVisible(false);
      } else {
        // กำลังขึ้น - แสดง
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <button
      onClick={toggleTheme}
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-gradient-to-r from-thai-gold/20 to-thai-red/20 dark:from-black/40 dark:to-black/20 backdrop-blur-lg border border-thai-gold/30 dark:border-white/10 hover:from-thai-gold/40 hover:to-thai-red/30 dark:hover:from-black/60 dark:hover:to-black/40 hover:scale-105 transition-all duration-300 shadow-lg group flex items-center gap-2 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0 pointer-events-none'
      }`}
      aria-label="Toggle theme"
      title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
    >
      {theme === 'light' ? (
        <>
          <svg
            className="w-5 h-5 text-thai-gold group-hover:rotate-180 transition-transform duration-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
          <span className="text-sm font-semibold text-thai-gold hidden sm:inline">Dark</span>
        </>
      ) : (
        <>
          <svg
            className="w-5 h-5 text-thai-gold group-hover:rotate-180 transition-transform duration-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-semibold text-thai-gold hidden sm:inline">Light</span>
        </>
      )}
    </button>
  );
}
