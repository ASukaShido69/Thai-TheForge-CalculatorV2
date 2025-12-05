'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'th' | 'en';

interface Translations {
  [key: string]: {
    th: string;
    en: string;
  };
}

const translations: Translations = {
  // Home Page
  'home.title': { th: 'เดอะฟอร์จ', en: 'The Forge' },
  'home.subtitle': { th: 'คำนวณและสร้างอาวุธที่สมบูรณ์แบบ', en: 'Calculate and craft the perfect gear' },
  'home.description': { th: 'เครื่องมือคำนวณขั้นสูงสำหรับการสร้างอาวุธและเกราะ ค้นหาคุณสมบัติแร่ คำนวณโอกาส และสร้างเกียร์ที่ยอดเยี่ยมที่สุด', en: 'Advanced calculator for crafting weapons and armor. Discover ore traits, calculate odds, and forge the ultimate gear.' },
  'home.startCrafting': { th: 'เริ่มสร้าง', en: 'Start Crafting' },
  'home.credits': { th: 'เครดิต', en: 'Credits' },
  'home.developedBy': { th: 'พัฒนาโดย', en: 'Developed by' },
  
  // Calculator Page
  'calc.title': { th: 'เครื่องคำนวณ', en: 'Calculator' },
  'calc.forgeChances': { th: 'โอกาสตีเหล็ก', en: 'Forge Chances' },
  'calc.selectOres': { th: 'เลือกแร่', en: 'Select Ores' },
  'calc.multiplier': { th: 'ตัวคูณ', en: 'Multiplier' },
  'calc.predictedItem': { th: 'ไอเทมที่คาดการณ์', en: 'Predicted Item' },
  'calc.activeTraits': { th: 'คุณสมบัติพิเศษ', en: 'Active Traits' },
  'calc.weapon': { th: 'อาวุธ', en: 'Weapon' },
  'calc.armor': { th: 'เกราะ', en: 'Armor' },
  'calc.clear': { th: 'ล้างข้อมูล', en: 'Clear' },
  'calc.searchOres': { th: 'ค้นหาแร่...', en: 'Search ores...' },
  'calc.empty': { th: 'ว่าง', en: 'Empty' },
  'calc.damage': { th: 'ความเสียหาย', en: 'Damage' },
  'calc.defense': { th: 'ป้องกัน', en: 'Defense' },
  'calc.price': { th: 'ราคา', en: 'Price' },
  'calc.viewTraits': { th: 'ดูคุณสมบัติ', en: 'View Traits' },
  'calc.noTraits': { th: 'ไม่มีคุณสมบัติที่ใช้งาน', en: 'No active traits' },
  'calc.backToHome': { th: 'กลับหน้าหลัก', en: 'Back to Home' },
  'calc.favoriteOres': { th: 'แร่โปรด', en: 'Favorite Ores' },
  'calc.savedBuilds': { th: 'บิลด์ที่บันทึก', en: 'Saved Builds' },
  'calc.saveBuild': { th: 'บันทึกบิลด์', en: 'Save Build' },
  'calc.compareBuilds': { th: 'เปรียบเทียบบิลด์', en: 'Compare Builds' },
  'calc.buildName': { th: 'ชื่อบิลด์', en: 'Build Name' },
  'calc.composition': { th: 'ส่วนผสม', en: 'Composition' },
  
  // Common
  'common.loading': { th: 'กำลังโหลด...', en: 'Loading...' },
  'common.error': { th: 'เกิดข้อผิดพลาด', en: 'Error' },
  'common.save': { th: 'บันทึก', en: 'Save' },
  'common.cancel': { th: 'ยกเลิก', en: 'Cancel' },
};

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('th');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === 'th' ? 'en' : 'th';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
