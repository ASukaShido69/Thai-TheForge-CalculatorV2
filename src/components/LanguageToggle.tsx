'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-4 right-4 z-50 px-3 py-2 rounded-full bg-white/10 dark:bg-black/30 backdrop-blur-lg border border-white/20 dark:border-white/10 hover:scale-110 transition-all duration-300 shadow-lg font-semibold text-sm"
      aria-label="Toggle language"
    >
      <span className="bg-gradient-thai bg-clip-text text-transparent">
        {language === 'th' ? 'EN' : 'ไทย'}
      </span>
    </button>
  );
}
