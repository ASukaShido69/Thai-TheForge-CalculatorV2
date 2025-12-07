'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();
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
      onClick={toggleLanguage}
      className={`fixed top-6 left-1/2 translate-x-14 z-50 px-4 py-2.5 rounded-full bg-gradient-to-r from-thai-blue/20 to-thai-gold/20 dark:from-black/40 dark:to-black/20 backdrop-blur-lg border border-thai-blue/30 dark:border-white/10 hover:from-thai-blue/40 hover:to-thai-gold/30 dark:hover:from-black/60 dark:hover:to-black/40 hover:scale-105 transition-all duration-300 shadow-lg font-bold text-sm ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0 pointer-events-none'
      }`}
      aria-label="Toggle language"
      title={language === 'th' ? 'Switch to English' : 'เปลี่ยนเป็นไทย'}
    >
      <span className="bg-gradient-thai bg-clip-text text-transparent">
        {language === 'th' ? 'EN' : 'ไทย'}
      </span>
    </button>
  );
}
