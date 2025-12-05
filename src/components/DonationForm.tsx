'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function DonationForm() {
  const { language } = useLanguage();

  // Facebook page link
  const facebookLink = 'https://www.facebook.com/profile.php?id=61578107559971';
  
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-md w-full mx-4">
      <div className="bg-gradient-to-br from-thai-gold/10 to-thai-red/10 dark:from-black/60 dark:to-black/40 backdrop-blur-xl border border-thai-gold/30 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 hover:scale-105">
        
        {/* Header */}
        <div className="bg-gradient-thai p-4 text-white">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span className="text-2xl">💝</span>
            {language === 'th' ? 'สนับสนุนเรา' : 'Support Us'}
          </h3>
          <p className="text-sm text-white/90 mt-1">
            {language === 'th' 
              ? 'ติดตามและสนับสนุนเราบน Facebook' 
              : 'Follow and support us on Facebook'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Description */}
          <p className="text-sm text-ig-text dark:text-gray-300 leading-relaxed">
            {language === 'th'
              ? 'ติดตามเพจ Facebook ของเรา เพื่อรับข้อมูลข่าวสาร อัปเดต และกิจกรรมต่างๆ' 
              : 'Follow our Facebook page for updates, news, and exclusive events'}
          </p>

          {/* Facebook Button */}
          <a
            href={facebookLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gradient-to-r from-[#1877F2] to-[#0A66C2] hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>{language === 'th' ? 'ติดตามบน Facebook' : 'Follow on Facebook'}</span>
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
          {language === 'th' ? 'สามารถปิดได้โดยรีเฟรชหน้า' : 'Close by refreshing the page'}
        </div>
      </div>
    </div>
  );
}
