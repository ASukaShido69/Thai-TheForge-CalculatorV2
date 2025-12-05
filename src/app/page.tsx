'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-white via-ig-bg to-white dark:from-gray-950 dark:via-black dark:to-gray-950">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <div className="absolute inset-0 bg-gradient-thai-subtle"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFD700' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center space-y-8 fade-in">
          {/* Logo/Title */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter">
              <span className="gradient-thai-text font-thai-display">
                {t('home.title')}
              </span>
            </h1>
            <div className="h-1 w-32 mx-auto bg-gradient-thai rounded-full"></div>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-ig-text dark:text-gray-300 font-medium max-w-2xl mx-auto">
            {t('home.subtitle')}
          </p>

          {/* Description */}
          <p className="text-sm md:text-base text-ig-secondary dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
            {t('home.description')}
          </p>

          {/* CTA Button */}
          <div className="pt-4">
            <Link
              href="/calculator"
              className="btn-primary inline-flex items-center gap-3 px-8 py-4 bg-gradient-thai hover:opacity-90 text-white font-semibold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group"
            >
              <span className="relative z-10">{t('home.startCrafting')}</span>
              <svg
                className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 max-w-4xl mx-auto">
            {[
              {
                icon: '🎯',
                title: { th: 'คำนวณแม่นยำ', en: 'Accurate Calculation' },
                desc: { th: 'ระบบคำนวณที่แม่นยำ', en: 'Precise calculation system' },
              },
              {
                icon: '⚔️',
                title: { th: 'อาวุธและเกราะ', en: 'Weapons & Armor' },
                desc: { th: 'ครบทุกประเภท', en: 'All types available' },
              },
              {
                icon: '✨',
                title: { th: 'ใช้งานง่าย', en: 'Easy to Use' },
                desc: { th: 'อินเทอร์เฟซเรียบง่าย', en: 'Simple interface' },
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="glass p-6 rounded-2xl card-hover scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-lg mb-2 text-ig-text dark:text-gray-200">
                  {t('home.title') === 'เดอะฟอร์จ' ? feature.title.th : feature.title.en}
                </h3>
                <p className="text-sm text-ig-secondary dark:text-gray-400">
                  {t('home.title') === 'เดอะฟอร์จ' ? feature.desc.th : feature.desc.en}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Credits Section */}
        <div className="mt-20 glass p-6 rounded-2xl max-w-md w-full mx-auto slide-up">
          <h3 className="text-center text-sm font-semibold text-ig-secondary dark:text-gray-400 mb-3 uppercase tracking-wider">
            {t('home.credits')}
          </h3>
          <div className="text-center">
            <p className="text-sm text-ig-text dark:text-gray-300 mb-2">
              {t('home.developedBy')}
            </p>
            <p className="text-lg font-bold gradient-thai-text">
              Subsomboon Leo
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-ig-border dark:border-gray-800">
            <p className="text-xs text-center text-ig-secondary dark:text-gray-500">
              {t('home.title') === 'เดอะฟอร์จ' 
                ? 'สร้างด้วยความรักจากประเทศไทย 🇹🇭' 
                : 'Made with love from Thailand 🇹🇭'
              }
            </p>
          </div>
        </div>
      </main>

      {/* Decorative Elements */}
      <div className="fixed top-1/4 left-0 w-96 h-96 bg-thai-gold opacity-5 blur-3xl rounded-full pointer-events-none"></div>
      <div className="fixed bottom-1/4 right-0 w-96 h-96 bg-thai-red opacity-5 blur-3xl rounded-full pointer-events-none"></div>
    </div>
  );
}
