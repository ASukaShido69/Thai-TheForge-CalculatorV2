'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CompareTutorialPage() {
  const { language } = useLanguage();

  const t = (en: string, th: string) => (language === 'th' ? th : en);

  const steps = [
    {
      title: t('Open Compare Mode', 'เปิดโหมดเปรียบเทียบ'),
      body: t('Go to the Calculator and toggle Compare Mode. The right column switches to your saved builds list.', 'ไปที่หน้า Calculator แล้วเปิดโหมดเปรียบเทียบ คอลัมน์ขวาจะเปลี่ยนเป็นรายการโครงสร้างที่บันทึกไว้'),
    },
    {
      title: t('Select up to 4 builds', 'เลือกได้สูงสุด 4 โครงสร้าง'),
      body: t('Click a saved build to select it. Selected builds highlight in yellow and show a check badge.', 'คลิกโครงสร้างที่ต้องการเพื่อเลือก โครงสร้างที่เลือกแล้วจะขึ้นสีเหลืองพร้อมสัญลักษณ์ถูก'),
    },
    {
      title: t('Load or inspect a build', 'โหลดหรือดูรายละเอียดโครงสร้าง'),
      body: t('Use the down-arrow to load a build into the calculator, or the info button to view its composition, traits, and predicted items.', 'กดปุ่มลูกศรลงเพื่อโหลดโครงสร้างเข้าสู่เครื่องคิดเลข หรือกดปุ่มข้อมูลเพื่อดูองค์ประกอบ คุณสมบัติ และไอเทมที่คาดว่าจะได้'),
    },
    {
      title: t('Compare side by side', 'เปรียบเทียบเคียงข้างกัน'),
      body: t('When 2–4 builds are selected, a comparison grid appears below showing multipliers, predicted odds, and key traits for each.', 'เมื่อเลือก 2–4 โครงสร้าง ตารางเปรียบเทียบจะปรากฏด้านล่าง แสดงตัวคูณ โอกาสออก และ Traits สำคัญของแต่ละโครงสร้าง'),
    },
    {
      title: t('Save new builds', 'บันทึกโครงสร้างใหม่'),
      body: t('Back in the calculator, adjust ores and runes, then press “Save Build” to store another setup for later comparison.', 'กลับไปที่หน้า Calculator ปรับแร่และรูน แล้วกด "บันทึกโครงสร้าง" เพื่อเก็บโครงสร้างใหม่ไว้เปรียบเทียบภายหลัง'),
    },
  ];

  const quickTips = [
    t('Tip: Tap the info button on any build to see its exact composition and trait roll odds.', 'ทิป: กดปุ่มข้อมูลของโครงสร้างใดก็ได้เพื่อดูองค์ประกอบและโอกาสการติด Traits แบบละเอียด'),
    t('Tip: Use favorites to surface your top ores when creating new builds to compare.', 'ทิป: ปักหมุดแร่ที่ชอบไว้ จะได้เลือกเร็วเมื่อสร้างโครงสร้างใหม่เพื่อเปรียบเทียบ'),
    t('Tip: Enhancement levels affect multiplier—set them before saving a build.', 'ทิป: เลเวลเสริมมีผลต่อค่าตัวคูณ ตั้งค่าให้เรียบร้อยก่อนกดบันทึกโครงสร้าง'),
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0b0f1a] via-[#0d0f24] to-[#0b0f1a] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute right-0 bottom-10 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute left-1/3 top-1/4 h-32 w-32 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-10 sm:py-14 space-y-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-amber-200">
              {t('Guide', 'คู่มือ')} · Compare Mode
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-white">
                {t('How to Use Compare Mode', 'วิธีใช้งานโหมดเปรียบเทียบ')}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-zinc-300 max-w-3xl">
                {t('Follow these steps to compare saved builds and pick the best result for your forge.', 'ทำตามขั้นตอนนี้เพื่อเปรียบเทียบโครงสร้างที่บันทึกไว้และเลือกผลลัพธ์ที่ดีที่สุดสำหรับการตีของคุณ')}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/calculator"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:border-white/30 hover:bg-white/5 transition"
              >
                ⛏️ {t('Back to Calculator', 'กลับสู่หน้า Calculator')}
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500 px-4 py-2 text-sm font-semibold text-black shadow-lg shadow-amber-500/30 hover:brightness-110 transition"
              >
                🏠 {t('Home', 'หน้าหลัก')}
              </Link>
            </div>
          </div>

          <div className="w-full sm:w-60 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 shadow-lg shadow-emerald-500/20">
            <div className="flex items-center justify-between text-emerald-200 text-sm font-semibold mb-2">
              <span>Quick Win</span>
              <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">30s</span>
            </div>
            <p className="text-sm text-emerald-50/90 leading-relaxed">
              {t('Turn on Compare Mode, select 2–4 builds, then scroll to the comparison grid to spot the best odds.', 'เปิดโหมดเปรียบเทียบ เลือก 2–4 โครงสร้าง แล้วเลื่อนดูตารางเปรียบเทียบเพื่อเห็นโอกาสที่ดีที่สุด')}
            </p>
          </div>
        </header>

        <div className="grid gap-4 sm:gap-5">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 shadow-lg shadow-black/30"
            >
              <div className="pointer-events-none absolute -right-10 top-0 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl" />
              <div className="flex items-start gap-4 relative z-10">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/80 to-blue-500/70 text-white text-lg font-bold shadow-lg shadow-purple-500/30">
                  {idx + 1}
                </div>
                <div className="space-y-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-white">{step.title}</h2>
                  <p className="text-sm text-zinc-200 leading-relaxed">{step.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-amber-400/40 bg-amber-500/10 p-5 shadow-lg shadow-amber-500/20">
            <h3 className="text-lg font-bold text-amber-100 mb-2">
              {t('Tip: Save before comparing', 'เคล็ดไม่ลับ: บันทึกก่อนเปรียบเทียบ')}
            </h3>
            <p className="text-sm text-amber-50/90 leading-relaxed">
              {t(
                'Use the “Save Build” button in the calculator after you set ores, runes, and enhancements. Then open Compare Mode to pick multiple builds.',
                'หลังจากตั้งค่าแร่ รูน และเลเวลเสริมแล้ว ให้กด "บันทึกโครงสร้าง" ในหน้าเว็ปคำนวณ จากนั้นเปิดโหมดเปรียบเทียบเพื่อเลือกหลายโครงสร้าง'
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20 space-y-3">
            <h3 className="text-lg font-bold text-white">
              {t('Quick reminders', 'ทวนสั้น ๆ')}
            </h3>
            <ul className="space-y-2 text-sm text-zinc-200">
              {quickTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-0.5 text-amber-300">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
