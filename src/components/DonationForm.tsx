'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';

export default function DonationForm() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(true);

  // TikTok channel link
  const tiktokLink = 'http://tiktok.com/@subsomboonleo';
  
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-md w-full mx-4">
      <div className="bg-gradient-to-br from-thai-gold/10 to-thai-red/10 dark:from-black/60 dark:to-black/40 backdrop-blur-xl border border-thai-gold/30 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 hover:scale-105 relative group">
        
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 z-50 p-1.5 rounded-full bg-white/20 dark:bg-black/40 hover:bg-white/40 dark:hover:bg-black/60 transition-all duration-200 text-ig-text dark:text-white"
          aria-label="Close support"
          title={language === 'th' ? 'ปิด' : 'Close'}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="bg-gradient-thai p-4 text-white pr-12">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span className="text-2xl">💝</span>
            {language === 'th' ? 'สนับสนุนผม คนที่หล่อเท่' : 'Support Us'}
          </h3>
          <p className="text-sm text-white/90 mt-1">
            {language === 'th' 
              ? 'ด้วยการติดตามและสนับสนุนเราบน TikTok' 
              : 'Follow and support us on TikTok'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Description */}
          <p className="text-sm text-ig-text dark:text-gray-300 leading-relaxed">
            {language === 'th'
              ? 'ติดตามช่อง TikTok ของผมหน่อยนะค้าบเพื่อกำลัวใจเล็กๆน้อยๆ' 
              : 'Follow our TikTok channel for tutorials, updates, and fun content'}
          </p>

          {/* TikTok Button */}
          <a
            href={tiktokLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gradient-to-r from-black via-gray-900 to-black hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.68v13.67a2.4 2.4 0 0 1-2.4 2.4 2.4 2.4 0 0 1-2.4-2.4 2.4 2.4 0 0 1 2.4-2.4c.18 0 .37.02.55.05v-3.68a5.8 5.8 0 0 0-.55-.05A5.77 5.77 0 0 0 4 12.6a5.77 5.77 0 0 0 5.77 5.77 5.77 5.77 0 0 0 5.77-5.77V9.5a7.6 7.6 0 0 0 4.58 1.53V7.13a4.85 4.85 0 0 1-.36-.04z"/>
            </svg>
            <span>{language === 'th' ? 'ติดตามบน TikTok' : 'Follow on TikTok'}</span>
          </a>

          {/* Thank You Message */}
          <p className="text-xs text-ig-secondary dark:text-gray-500 text-center">
            {language === 'th'
              ? '🙏 ขอบคุณที่ติดตามและสนับสนุนเรา'
              : '🙏 Thank you for following and supporting us'}
          </p>
        </div>

        {/* Close Hint */}
        <div className="px-6 pb-3 text-xs text-ig-secondary dark:text-gray-500 text-center">
          {language === 'th' ? 'กดปุ่ม X เพื่อปิด' : 'Click X to close'}
        </div>
      </div>
    </div>
  );
}
