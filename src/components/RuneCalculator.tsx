'use client';

import { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react';
import PickaxeCalculatorButton from './PickaxeCalculatorButton';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import runeDataRaw from '../data/rune.json';

// Types
type Trait = {
  name: string;
  description: string;
  minValue: number | null;
  maxValue: number | null;
  unit: string | null;
  [key: string]: any;
};

type Rune = {
  id: string;
  name: string;
  type: string;
  rarity?: string;
  obtainment?: string;
  traits: Trait[];
};

type RuneState = {
  runeId: string;
  traitValues: Record<string, number>;
  selectedTraits?: string[];
};

type SecondaryTrait = {
  id: string;
  name: string;
  value: number;
};

type ThirdTrait = {
  id: string;
  name: string;
  value: number;
};

type SavedRune = {
  id: string;
  name: string;
  runeState: RuneState;
  secondaryTraits?: {
    weapon?: SecondaryTrait[];
    armor?: SecondaryTrait[];
  };
  thirdTraits?: ThirdTrait[];
  timestamp: number;
  allRunes?: Array<{
    runeState: RuneState;
    secondaryTraits?: {
      weapon?: SecondaryTrait[];
      armor?: SecondaryTrait[];
    };
    thirdTraits?: ThirdTrait[];
  }>;
};

const runeData = runeDataRaw as { runes: { primary: Rune[]; secondary: { weapon: Trait[]; armor: Trait[] }; third: { universal: Trait[] } } };

const translations = {
  th: {
    'rune.calculator': 'คำนวณรูน',
    'rune.selectRune': 'เลือกรูน',
    'rune.editTraits': 'ปรับความสามารถหลัก',
    'rune.secondaryTraits': 'คุณสมบัติเสริม',
    'rune.weaponSecondary': '⚔️ คุณสมบัติอาวุธ',
    'rune.armorSecondary': '🛡️ คุณสมบัติเกราะ',
    'rune.thirdTraits': '✨ คุณสมบัติพิเศษ',
    'rune.universalTraits': '🌟 คุณสมบัติสากล',
    'rune.save': 'บันทึก',
    'rune.savedRunes': 'รูนที่บันทึกไว้',
    'rune.buildName': 'ชื่อ Build',
    'rune.saveBuild': 'บันทึก Build',
    'rune.cancel': 'ยกเลิก',
    'rune.load': 'โหลด',
    'rune.add': 'เพิ่ม',
    'rune.delete': 'ลบ',
    'rune.noRune': 'ยังไม่ได้เลือกรูน',
    'rune.selectTraits': 'เลือกคุณสมบัติ',
    'rune.rarityRare': 'หายาก',
    'rune.obtainedFrom': 'ได้จาก',
    'rune.unobtainable': 'หาไม่ได้ในเกมปัจจุบัน',
    'rune.primaryTraits': 'คุณสมบัติหลัก',
    'rune.fixedValue': 'ค่าคงที่',
    'rune.confirmDelete': 'ยืนยันการลบ',
    'rune.confirmDeleteMessage': 'คุณแน่ใจหรือไม่ว่าต้องการลบ Build นี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้',
    'rune.addRune': 'เพิ่มรูน',
    'rune.removeRune': 'ลบรูน',
    'rune.currentRunes': 'รูนที่เลือก',
    'rune.slot': 'ช่องที่',
    
    // Trait descriptions
    "Overall luck increase": "🍀 เพิ่มความโชคดี",
    "Chance to drop 1 extra ore from mines": "⛏️ มีโอกาสในการดรอปแร่เพิ่มอีก 1 แร่",
    "Faster mining": "⚡ ขุดแร่เร็วขึ้น",
    "Extra mine damage": "💪 พลังการขุดแร่เพิ่มมากขึ้น",
    "Freezes enemies for a short duration. Has a small chance to trigger and a short cooldown": "❄️ กักเก็บศัตรู ช่วงเวลาสั้น ๆ โอกาสเล็กน้อย คูลดาวน์ไว",
    "Deals 5-10% of weapon damage as fire per second for 1-2 seconds. 15-25% chance on hit": "🔥 เผาไหม้ 5-10% ของพลังอาวุธต่อวินาที 1-2 วินาที โอกาส 15-25% โจมตี",
    "Deals poison damage over time. Chance to apply on hit": "☠️ ทำดาเมจพิษ มีโอกาสเล็กน้อยเมื่อโจมตี",
    "Slows enemy movement and attack speed. Chance on hit": "❄️ ทำให้ศัตรูช้าลงและลดความเร็วโจมตี",
    "Cause an explosion at location of victim, dealing AOE damage": "💣 ระเบิดวงกว้างที่ตำแหน่งศัตรู สร้าง AOE ความเสียหาย",
    "Heal % of physical damage dealt on-hit": "💚 ดูดเลือดจากการโจมตีทางกายภาพ",
    "Reflect physical damage taken. Maximum damage given limits at 5% max health of user. 0.05 seconds cooldown": "🌿 สะท้อนความเสียหายที่รับ เสียหายสูงสุด 5% HP สูงสุด คูลดาวน์ 0.05 วินาที",
    "Boosts physical damage and movement speed for 4-7 seconds. Has 50-60 seconds cooldown. Activates when health is below 35%": "😡 โหมดบ้าคลั่ง เพิ่มความเสียหาย + ความเร็ว 4-7 วินาที คูลดาวน์ 50-60 วินาที ทำงานเมื่อ HP < 35%",
    "Reduces incoming damage with a chance per hit": "🛡️ บล็อกความเสียหายขาเข้า โอกาสต่อการโจมตี",
    "Deals poison damage around the user while health is below 35%. Has a cooldown": "🦠 ทำความเสียหายพิษรอบตัว ขณะ HP < 35% มีคูลดาวน์",
    "Increases attack speed": "⚡ เพิ่มความเร็วการโจมตี",
    "Increases the weapon's damage": "🗡️ เพิ่มพลังอาวุธ",
    "Increases the chance of landing a critical hit": "🎯 เพิ่มโอกาสคริติคอล",
    "Increases the damage of critical hits": "💥 เพิ่มความแรงคริติคอล",
    "Gives extra stun damage": "🔨 เพิ่มความเสียหายทำให้สตัน",
    "Grants more stamina": "💪 เพิ่มสแตมินามากขึ้น",
    "Reduces dash cooldown": "⚡ ลดเวลาในการแดชอีกครั้ง",
    "Grants extra health": "❤️ เพิ่มพลังชีวิต",
    "Extra movement speed": "🏃 เพิ่มความเร็วเคลื่อนไหว",
    "Increases dash invincibility duration": "👻 เพิ่มระยะเวลาอมตะเมื่อแดช",
    
  },
  en: {
    'rune.calculator': 'Rune Calculator',
    'rune.selectRune': 'Select Rune',
    'rune.editTraits': 'Edit Primary Traits',
    'rune.secondaryTraits': 'Secondary Traits',
    'rune.weaponSecondary': '⚔️ Weapon Traits',
    'rune.armorSecondary': '🛡️ Armor Traits',
    'rune.thirdTraits': '✨ Special Traits',
    'rune.universalTraits': '🌟 Universal Traits',
    'rune.save': 'Save',
    'rune.savedRunes': 'Saved Runes',
    'rune.buildName': 'Build Name',
    'rune.saveBuild': 'Save Build',
    'rune.cancel': 'Cancel',
    'rune.load': 'Load',
    'rune.add': 'Add',
    'rune.delete': 'Delete',
    'rune.noRune': 'No Rune Selected',
    'rune.selectTraits': 'Select Traits',
    'rune.rarityRare': 'Rare',
    'rune.obtainedFrom': 'Obtained from',
    'rune.unobtainable': 'Currently Unobtainable',
    'rune.primaryTraits': 'Primary Traits',
    'rune.fixedValue': 'Fixed',
    'rune.confirmDelete': 'Confirm Deletion',
    'rune.confirmDeleteMessage': 'Are you sure you want to delete this build? This action cannot be undone.',
    'rune.addRune': 'Add Rune',
    'rune.removeRune': 'Remove Rune',
    'rune.currentRunes': 'Selected Runes',
    'rune.slot': 'Slot',
    
    // Trait descriptions
    'Overall luck increase': 'Overall luck increase',
    'Chance to drop 1 extra ore from mines': 'Chance to drop 1 extra ore from mines',
    'Faster mining': 'Faster mining',
    'Extra mine damage': 'Extra mine damage',
    'Freezes enemies for a short duration. Has a small chance to trigger and a short cooldown': 'Freezes enemies for a short duration. Has a small chance to trigger and a short cooldown',
    'Deals 5-10% of weapon damage as fire per second for 1-2 seconds. 15-25% chance on hit': 'Deals 5-10% of weapon damage as fire per second for 1-2 seconds. 15-25% chance on hit',
    'Deals poison damage over time. Chance to apply on hit': 'Deals poison damage over time. Chance to apply on hit',
    'Slows enemy movement and attack speed. Chance on hit': 'Slows enemy movement and attack speed. Chance on hit',
    'Cause an explosion at location of victim, dealing AOE damage': 'Cause an explosion at location of victim, dealing AOE damage',
    'Heal % of physical damage dealt on-hit': 'Heal % of physical damage dealt on-hit',
    'Reflect physical damage taken. Maximum damage given limits at 5% max health of user. 0.05 seconds cooldown': 'Reflect physical damage taken. Maximum damage given limits at 5% max health of user. 0.05 seconds cooldown',
    'Boosts physical damage and movement speed for 4-7 seconds. Has 50-60 seconds cooldown. Activates when health is below 35%': 'Boosts physical damage and movement speed for 4-7 seconds. Has 50-60 seconds cooldown. Activates when health is below 35%',
    'Reduces incoming damage with a chance per hit': 'Reduces incoming damage with a chance per hit',
    'Deals poison damage around the user while health is below 35%. Has a cooldown': 'Deals poison damage around the user while health is below 35%. Has a cooldown',
    'Increases attack speed': 'Increases attack speed',
    'Increases the weapon\'s damage': 'Increases the weapon\'s damage',
    'Increases the chance of landing a critical hit': 'Increases the chance of landing a critical hit',
    'Increases the damage of critical hits': 'Increases the damage of critical hits',
    'Gives extra stun damage': 'Gives extra stun damage',
    'Grants more stamina': 'Grants more stamina',
    'Reduces dash cooldown': 'Reduces dash cooldown',
    'Grants extra health': 'Grants extra health',
    'Extra movement speed': 'Extra movement speed',
    'Increases dash invincibility duration': 'Increases dash invincibility duration',
    
  }
};

const SparklesIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const CloseIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const TrashIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M5 7.5C5 6.67157 5.67157 6 6.5 6H17.5C18.3284 6 19 6.67157 19 7.5V20.5C19 21.3284 18.3284 22 17.5 22H6.5C5.67157 22 5 21.3284 5 20.5V7.5Z" />
    <path d="M8.5 2C8.5 2 8.5 1 9.5 1H14.5C15.5 1 15.5 2 15.5 2H19.5C20.3284 2 21 2.67157 21 3.5V4.5H3V3.5C3 2.67157 3.67157 2 4.5 2H8.5Z" />
  </svg>
);

const PlusIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

interface RuneCalculatorProps {
  onRuneSelected?: (rune: RuneState, secondaryTraits?: { weapon?: SecondaryTrait[]; armor?: SecondaryTrait[] }) => void;
}

// Utility function for data validation
function validateRuneData(data: any): data is SavedRune {
  return (
    data &&
    typeof data.id === 'string' &&
    typeof data.name === 'string' &&
    data.runeState &&
    typeof data.runeState.runeId === 'string' &&
    typeof data.runeState.traitValues === 'object' &&
    typeof data.timestamp === 'number' &&
    Date.now() - data.timestamp > 0 // Check timestamp is valid
  );
}

function RuneCalculator({ onRuneSelected }: RuneCalculatorProps) {
  const { language } = useLanguage();
  const t = (key: string) => {
    const translationsTyped = translations as any;
    return translationsTyped[language]?.[key] || key;
  };

  const [isOpen, setIsOpen] = useState(false);
  const [selectedRunes, setSelectedRunes] = useState<Rune[]>([]);
  const [currentRuneIndex, setCurrentRuneIndex] = useState<number>(0);
  const [selectedTraits, setSelectedTraits] = useState<Record<number, string[]>>({});
  const [traitValues, setTraitValues] = useState<Record<number, Record<string, number>>>({});
  const [savedRunes, setSavedRunes] = useState<SavedRune[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [buildName, setBuildName] = useState('');
  const [showRuneInfo, setShowRuneInfo] = useState(false);
  const [secondaryTraits, setSecondaryTraits] = useState<Record<number, { weapon?: SecondaryTrait[]; armor?: SecondaryTrait[] }>>({});
  const [thirdTraits, setThirdTraits] = useState<Record<number, ThirdTrait[]>>({});
  const [activeTab, setActiveTab] = useState<'rune' | 'secondary' | 'third'>('rune');
  
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // ตั้งค่าเริ่มต้นให้ปุ่มอยู่มุมขวาล่าง (ใช้ top/left เพื่อรองรับลากได้จริงทุก device)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Detect mobile
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    
    const startX = Math.max(16, window.innerWidth - 88);
    const startY = Math.max(80, window.innerHeight - 140);
    setPosition({ x: startX, y: startY });
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('savedRunes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Validate and filter saved runes
        const validRunes = Array.isArray(parsed) 
          ? parsed.filter(validateRuneData)
          : [];
        setSavedRunes(validRunes);
      } catch (error) {
        console.error('Failed to load saved runes:', error);
        setSavedRunes([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savedRunes', JSON.stringify(savedRunes));
  }, [savedRunes]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isOpen) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const nextX = e.clientX - dragOffset.x;
      const nextY = e.clientY - dragOffset.y;
      setPosition({
        x: Math.max(8, Math.min(nextX, window.innerWidth - 72)),
        y: Math.max(60, Math.min(nextY, window.innerHeight - 72))
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleSelectRune = useCallback((rune: Rune) => {
    setSelectedRunes(prev => {
      const newRunes = [...prev];
      newRunes[currentRuneIndex] = rune;
      return newRunes;
    });
    
    const editableTraits = rune.traits
      .filter(t => t.minValue !== null && t.maxValue !== null)
      .map(t => t.name);
    setSelectedTraits(prev => ({ ...prev, [currentRuneIndex]: editableTraits }));
    
    const newValues: Record<string, number> = {};
    rune.traits.forEach(trait => {
      if (trait.minValue !== null) {
        newValues[trait.name] = trait.minValue;
      }
    });
    setTraitValues(prev => ({ ...prev, [currentRuneIndex]: newValues }));
    setActiveTab('rune');
  }, [currentRuneIndex]);

  const toggleTrait = useCallback((traitName: string) => {
    const currentTraits = selectedTraits[currentRuneIndex] || [];
    setSelectedTraits(prev => ({
      ...prev,
      [currentRuneIndex]: currentTraits.includes(traitName)
        ? currentTraits.filter(t => t !== traitName)
        : [...currentTraits, traitName]
    }));
    
    const selectedRune = selectedRunes[currentRuneIndex];
    const currentValues = traitValues[currentRuneIndex] || {};
    const trait = selectedRune?.traits.find(t => t.name === traitName);
    if (trait && trait.minValue !== null && currentValues[traitName] === undefined) {
      setTraitValues(prev => ({
        ...prev,
        [currentRuneIndex]: { ...currentValues, [traitName]: trait.minValue! }
      }));
    }
  }, [currentRuneIndex, selectedRunes, selectedTraits, traitValues]);

  const handleTraitChange = useCallback((traitName: string, value: number) => {
    const currentValues = traitValues[currentRuneIndex] || {};
    setTraitValues(prev => ({
      ...prev,
      [currentRuneIndex]: { ...currentValues, [traitName]: value }
    }));
  }, [currentRuneIndex, traitValues]);

  const handleSecondaryTraitToggle = useCallback((type: 'weapon' | 'armor', trait: Trait) => {
    setSecondaryTraits(prev => {
      const currentSecondary = prev[currentRuneIndex] || {};
      const current = currentSecondary[type] || [];
      const exists = current.find(t => t.id === trait.id);
      
      return {
        ...prev,
        [currentRuneIndex]: {
          ...currentSecondary,
          [type]: exists
            ? current.filter(t => t.id !== trait.id)
            : [...current, { id: trait.id, name: trait.name, value: trait.minValue ?? 0 }]
        }
      };
    });
  }, [currentRuneIndex]);

  const handleSecondaryTraitChange = useCallback((type: 'weapon' | 'armor', traitId: string, value: number) => {
    setSecondaryTraits(prev => {
      const currentSecondary = prev[currentRuneIndex] || {};
      const current = currentSecondary[type] || [];
      return {
        ...prev,
        [currentRuneIndex]: {
          ...currentSecondary,
          [type]: current.map(t => t.id === traitId ? { ...t, value } : t)
        }
      };
    });
  }, [currentRuneIndex]);

  const handleThirdTraitToggle = useCallback((trait: Trait) => {
    setThirdTraits(prev => {
      const current = prev[currentRuneIndex] || [];
      const exists = current.find(t => t.id === trait.id);
      
      return {
        ...prev,
        [currentRuneIndex]: exists
          ? current.filter(t => t.id !== trait.id)
          : [...current, { id: trait.id, name: trait.name, value: trait.minValue ?? 0 }]
      };
    });
  }, [currentRuneIndex]);

  const handleThirdTraitChange = useCallback((trait: Trait, value: number) => {
    const minVal = trait.minValue ?? 0;
    const maxVal = trait.maxValue ?? value;
    const clamped = Math.min(Math.max(value, minVal), maxVal);

    setThirdTraits(prev => {
      const current = prev[currentRuneIndex] || [];
      return {
        ...prev,
        [currentRuneIndex]: current.map(t => t.id === trait.id ? { ...t, value: clamped } : t)
      };
    });
  }, [currentRuneIndex]);

  const handleSaveRune = useCallback(() => {
    if (selectedRunes.length === 0 || !buildName.trim()) return;

    // บันทึกทุก rune ที่เลือก
    const allRunesData = selectedRunes.map((rune, index) => {
      const traits = selectedTraits[index] || [];
      const values = traitValues[index] || {};
      const secondary = secondaryTraits[index] || {};
      const third = thirdTraits[index] || [];

      const filteredTraitValues: Record<string, number> = {};
      traits.forEach((traitName: string) => {
        if (values[traitName] !== undefined) {
          filteredTraitValues[traitName] = values[traitName];
        }
      });

      const filteredSecondary: { weapon?: SecondaryTrait[]; armor?: SecondaryTrait[] } = {};
      if (secondary.weapon?.some((t: SecondaryTrait) => t.value > 0)) {
        filteredSecondary.weapon = secondary.weapon.filter((t: SecondaryTrait) => t.value > 0);
      }
      if (secondary.armor?.some((t: SecondaryTrait) => t.value > 0)) {
        filteredSecondary.armor = secondary.armor.filter((t: SecondaryTrait) => t.value > 0);
      }

      const filteredThird = third.filter((t: ThirdTrait) => t.value > 0);

      return {
        runeState: {
          runeId: rune.id,
          traitValues: filteredTraitValues,
          selectedTraits: traits
        },
        secondaryTraits: Object.keys(filteredSecondary).length > 0 ? filteredSecondary : undefined,
        thirdTraits: filteredThird.length > 0 ? filteredThird : undefined
      };
    });

    const newSavedRune: SavedRune = {
      id: Date.now().toString(),
      name: buildName,
      runeState: allRunesData[0].runeState,
      secondaryTraits: allRunesData[0].secondaryTraits,
      thirdTraits: allRunesData[0].thirdTraits,
      allRunes: allRunesData,
      timestamp: Date.now()
    };

    setSavedRunes(prev => [newSavedRune, ...prev]);
    setShowSaveDialog(false);
    setBuildName('');
  }, [selectedRunes, selectedTraits, traitValues, secondaryTraits, buildName]);

  const handleLoadRune = useCallback((saved: SavedRune) => {
    if (saved.allRunes && saved.allRunes.length > 0) {
      // Load multiple runes
      const loadedRunes: Rune[] = [];
      const loadedTraits: Record<number, string[]> = {};
      const loadedValues: Record<number, Record<string, number>> = {};
      const loadedSecondary: Record<number, { weapon?: SecondaryTrait[]; armor?: SecondaryTrait[] }> = {};
      const loadedThird: Record<number, ThirdTrait[]> = {};

      saved.allRunes.forEach((savedRuneData, index) => {
        const rune = runeData.runes.primary.find((r: Rune) => r.id === savedRuneData.runeState.runeId);
        if (rune) {
          loadedRunes[index] = rune;
          loadedTraits[index] = savedRuneData.runeState.selectedTraits || [];
          loadedValues[index] = savedRuneData.runeState.traitValues;
          if (savedRuneData.secondaryTraits) {
            loadedSecondary[index] = savedRuneData.secondaryTraits;
          }
          if (savedRuneData.thirdTraits) {
            loadedThird[index] = savedRuneData.thirdTraits;
          }
        }
      });

      setSelectedRunes(loadedRunes);
      setSelectedTraits(loadedTraits);
      setTraitValues(loadedValues);
      setSecondaryTraits(loadedSecondary);
      setThirdTraits(loadedThird);
      setCurrentRuneIndex(0);
    } else {
      // Load single rune (backward compatibility)
      const rune = runeData.runes.primary.find((r: Rune) => r.id === saved.runeState.runeId);
      if (rune) {
        setSelectedRunes([rune]);
        setSelectedTraits({ 0: saved.runeState.selectedTraits || [] });
        setTraitValues({ 0: saved.runeState.traitValues });
        setSecondaryTraits({ 0: saved.secondaryTraits || {} });
        setThirdTraits({ 0: saved.thirdTraits || [] });
        setCurrentRuneIndex(0);
        if (onRuneSelected) {
          onRuneSelected(saved.runeState, saved.secondaryTraits);
        }
      }
    }
  }, [onRuneSelected]);

  const handleAddRuneToCalculator = useCallback((saved: SavedRune) => {
    handleLoadRune(saved);
    setIsOpen(false);
  }, [handleLoadRune]);

  const handleDeleteRune = useCallback((id: string) => {
    // Set confirmation dialog to show
    setShowDeleteConfirm(id);
  }, []);

  const confirmDeleteRune = useCallback((id: string) => {
    setSavedRunes(prev => prev.filter(r => r.id !== id));
    setShowDeleteConfirm(null);
  }, []);

  const runes = runeData.runes.primary;
  const weaponSecondary = runeData.runes.secondary.weapon || [];
  const armorSecondary = runeData.runes.secondary.armor || [];
  const universalThird = runeData.runes.third?.universal || [];

  const getRuneImage = useCallback((runeName: string) => {
    const imageMap: Record<string, string> = {
      'Miner Shard': 'MinerShard', 'Frost Speck': 'FrostSpeck', 'Flame Spark': 'FlamingSpark',
      'Venom Crumb': 'VenomCrumb', 'Chill Dust': 'ChillDust', 'Blast Chip': 'BlastChip',
      'Drain Edge': 'DrainEdge', 'Briar Notch': 'BriarNotch', 'Rage Mark': 'RageMark',
      'Ward Patch': 'Ward_Patch', 'Rot Stitch': 'RotStitch',
    };
    const imageName = imageMap[runeName];
    return imageName ? `/rune/${imageName}.png` : null;
  }, []);

  return (
    <>
      {/* ปุ่ม SparklesIcon เดิม */}
      <button
        onMouseDown={handleMouseDown}
        onClick={() => !isDragging && setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          top: isMobile ? 'auto' : `${position.y}px`,
          bottom: isMobile ? '20px' : 'auto',
          left: isMobile ? 'auto' : `${position.x}px`,
          right: isMobile ? '20px' : 'auto',
          cursor: isDragging ? 'grabbing' : 'grab',
          zIndex: 40
        }}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center group"
        title={t('rune.calculator')}
      >
        <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform pointer-events-none" />
      </button>

      {/* ปุ่ม Pickaxe ใหม่ */}
      <PickaxeCalculatorButton />

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
          <div className="bg-gradient-to-br from-zinc-900 via-purple-900/20 to-zinc-900 rounded-2xl border border-purple-500/30 w-full max-w-2xl sm:max-w-4xl max-h-[85vh] shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-3 sm:p-6 border-b border-purple-500/20 bg-zinc-900/80 backdrop-blur-xl z-20 gap-2 flex-shrink-0 sticky top-0">
              <h2 className="text-base sm:text-2xl font-bold text-purple-400 flex items-center gap-2 min-w-0">
                <SparklesIcon className="w-4 h-4 sm:w-6 sm:h-6 flex-shrink-0" />
                <span className="truncate">{t('rune.calculator')}</span>
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors flex-shrink-0 p-1"
              >
                <CloseIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6 custom-scrollbar">
              <div className="flex gap-2 border-b border-purple-500/20 pb-3">
                <button
                  className={`px-3 sm:px-4 py-2 font-semibold border-b-2 text-xs sm:text-base whitespace-nowrap ${
                    !showRuneInfo
                      ? 'border-purple-500 text-purple-400'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200'
                  }`}
                  onClick={() => setShowRuneInfo(false)}
                >
                  {t('rune.calculator')}
                </button>
                <button
                  className={`px-3 sm:px-4 py-2 font-semibold border-b-2 text-xs sm:text-base whitespace-nowrap ${
                    showRuneInfo ? 'border-purple-500 text-purple-400' : 'border-transparent text-zinc-400 hover:text-zinc-200'
                  }`}
                  onClick={() => setShowRuneInfo(true)}
                >
                  {t('rune.savedRunes')} ({savedRunes.length})
                </button>
              </div>

              {!showRuneInfo && (
                <div className="space-y-4 sm:space-y-6">
                  {/* Current Runes Display */}
                  {selectedRunes.length > 0 && (
                    <div className="bg-zinc-800/50 rounded-lg p-3 border border-purple-500/30">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-purple-300">
                          {t('rune.currentRunes')} ({selectedRunes.length})
                        </h3>
                        <button
                          onClick={() => {
                            const newIndex = selectedRunes.length;
                            setCurrentRuneIndex(newIndex);
                          }}
                          className="px-2 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded text-xs font-medium transition-all flex items-center gap-1"
                        >
                          <PlusIcon className="w-3 h-3" />
                          {t('rune.addRune')}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedRunes.map((rune, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentRuneIndex(index)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-xs ${
                              currentRuneIndex === index
                                ? 'bg-purple-500/30 border-2 border-purple-500 text-purple-200'
                                : 'bg-zinc-700/50 border border-zinc-600 text-zinc-300 hover:bg-zinc-700'
                            }`}
                          >
                            <span className="font-semibold">{t('rune.slot')} {index + 1}</span>
                            <span className="text-[10px]">{rune.name}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRunes(prev => prev.filter((_, i) => i !== index));
                                setSelectedTraits(prev => {
                                  const newTraits = { ...prev };
                                  delete newTraits[index];
                                  return newTraits;
                                });
                                setTraitValues(prev => {
                                  const newValues = { ...prev };
                                  delete newValues[index];
                                  return newValues;
                                });
                                setSecondaryTraits(prev => {
                                  const newSecondary = { ...prev };
                                  delete newSecondary[index];
                                  return newSecondary;
                                });
                                if (currentRuneIndex === index) {
                                  setCurrentRuneIndex(Math.max(0, index - 1));
                                }
                              }}
                              className="ml-1 text-red-400 hover:text-red-300"
                            >
                              <CloseIcon className="w-3 h-3" />
                            </button>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm sm:text-lg font-semibold text-purple-300 mb-2 sm:mb-4">
                      {t('rune.selectRune')} {selectedRunes.length > 0 && `- ${t('rune.slot')} ${currentRuneIndex + 1}`}
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {runes.map(rune => {
                        const runeImage = getRuneImage(rune.name);
                        const isSelected = selectedRunes[currentRuneIndex]?.id === rune.id;
                        return (
                          <button
                            key={rune.id}
                            onClick={() => handleSelectRune(rune)}
                            className={`p-2 rounded-lg border-2 transition-all group ${
                              isSelected ? 'border-purple-500 bg-purple-500/20' : 'border-zinc-700 hover:border-purple-500/50'
                            }`}
                          >
                            {runeImage && (
                              <div className="relative w-full aspect-square mb-1 overflow-hidden rounded bg-zinc-800">
                                <Image src={runeImage} alt={rune.name} fill className="object-cover group-hover:scale-110 transition-transform" />
                              </div>
                            )}
                            <p className="text-[10px] sm:text-xs font-medium text-zinc-200 line-clamp-2">{rune.name}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {selectedRunes[currentRuneIndex] && (
                    <>
                      <div>
                        <h3 className="text-sm sm:text-base font-semibold text-cyan-300 mb-2">
                          {t('rune.selectTraits')} - {selectedRunes[currentRuneIndex].name}
                        </h3>
                        {selectedRunes[currentRuneIndex].obtainment && (
                          <p className="text-[11px] sm:text-xs text-zinc-400 mb-3 flex items-center gap-1">
                            <span className="text-purple-300">📍 {t('rune.obtainedFrom')}:</span>
                            <span className="text-zinc-300 break-words whitespace-normal">{selectedRunes[currentRuneIndex].obtainment}</span>
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {selectedRunes[currentRuneIndex].traits
                            .filter(t => t.minValue !== null && t.maxValue !== null)
                            .map(trait => (
                              <button
                                key={trait.name}
                                onClick={() => toggleTrait(trait.name)}
                                className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all ${
                                  (selectedTraits[currentRuneIndex] || []).includes(trait.name)
                                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                                    : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-cyan-500/30'
                                }`}
                              >
                                {(selectedTraits[currentRuneIndex] || []).includes(trait.name) ? '✓ ' : ''}{trait.name}
                              </button>
                            ))}
                        </div>
                      </div>

                      <div className="flex gap-2 border-b border-purple-500/20 pb-3">
                        <button
                          onClick={() => setActiveTab('rune')}
                          className={`px-3 py-2 font-semibold border-b-2 text-xs sm:text-sm ${
                            activeTab === 'rune' ? 'border-purple-500 text-purple-400' : 'border-transparent text-zinc-400'
                          }`}
                        >
                          {t('rune.editTraits')}
                        </button>
                        <button
                          onClick={() => setActiveTab('secondary')}
                          className={`px-3 py-2 font-semibold border-b-2 text-xs sm:text-sm ${
                            activeTab === 'secondary' ? 'border-purple-500 text-purple-400' : 'border-transparent text-zinc-400'
                          }`}
                        >
                          {t('rune.secondaryTraits')}
                        </button>
                        <button
                          onClick={() => setActiveTab('third')}
                          className={`px-3 py-2 font-semibold border-b-2 text-xs sm:text-sm whitespace-nowrap ${
                            activeTab === 'third' ? 'border-purple-500 text-purple-400' : 'border-transparent text-zinc-400'
                          }`}
                        >
                          {t('rune.thirdTraits')}
                        </button>
                      </div>

                      {activeTab === 'rune' && (
                        <div className="space-y-3">
                          {selectedRunes[currentRuneIndex].traits.map(trait => {
                            const isEditable = trait.minValue !== null && trait.maxValue !== null;
                            const isSelected = (selectedTraits[currentRuneIndex] || []).includes(trait.name);
                            
                            if (!isEditable) {
                              return (
                                <div key={trait.name} className="p-3 bg-zinc-800/30 rounded-lg border border-zinc-700/30">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-xs sm:text-sm text-zinc-300 break-words">{trait.name}</p>
                                      <p className="text-xs text-zinc-400 mt-1 break-words whitespace-normal">{t(trait.description)}</p>
                                    </div>
                                    <span className="text-zinc-500 text-xs flex-shrink-0 whitespace-nowrap">{t('rune.fixedValue')}</span>
                                  </div>
                                </div>
                              );
                            }

                            if (!isSelected) return null;

                            const currentValues = traitValues[currentRuneIndex] || {};
                            const currentValue = currentValues[trait.name] ?? trait.minValue ?? 0;
                            const maxVal = trait.maxValue ?? 100;
                            const minVal = trait.minValue ?? 0;
                            const hasProcChance = (trait as any).procChance;

                            return (
                              <div key={trait.name} className="p-3 bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-lg border border-purple-500/40 space-y-2 backdrop-blur-sm">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                      <label className="font-semibold text-xs sm:text-sm text-purple-200 break-words">
                                        {trait.name}
                                      </label>
                                      <span className="text-[9px] sm:text-[10px] text-purple-400/70 font-medium whitespace-nowrap">
                                        ({minVal}-{maxVal}{trait.unit})
                                      </span>
                                    </div>
                                    {hasProcChance && (
                                      <div className="text-[9px] sm:text-[10px] text-cyan-400 font-medium mb-1">
                                        ⚡ {language === 'th' ? 'โอกาส' : 'Chance'}: {hasProcChance}
                                      </div>
                                    )}
                                    <p className="text-xs text-zinc-400 break-words whitespace-normal">{t(trait.description)}</p>
                                  </div>
                                  <div className="flex-shrink-0 text-right">
                                    <span className="text-purple-300 font-bold text-sm sm:text-base">{currentValue}</span>
                                    {trait.unit && (
                                      <span className="text-purple-400/80 text-[10px] ml-0.5">{trait.unit}</span>
                                    )}
                                  </div>
                                </div>

                                {minVal !== null && maxVal !== null && (
                                  <>
                                    <div className="w-full bg-zinc-700 rounded-full h-2 overflow-hidden">
                                      <div
                                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all"
                                        style={{
                                          width: `${((currentValue - minVal) / (maxVal - minVal)) * 100}%`
                                        }}
                                      />
                                    </div>
                                    <div className="flex gap-2">
                                      <input
                                        type="range"
                                        min={minVal}
                                        max={maxVal}
                                        value={currentValue}
                                        onChange={e => handleTraitChange(trait.name, parseFloat(e.target.value))}
                                        className="flex-1 h-2 rounded-full appearance-none cursor-pointer bg-zinc-700 accent-purple-500"
                                      />
                                      <input
                                        type="number"
                                        min={minVal}
                                        max={maxVal}
                                        value={currentValue}
                                        onChange={e => handleTraitChange(trait.name, parseFloat(e.target.value) || minVal)}
                                        className="w-16 sm:w-20 px-2 py-1 bg-zinc-700 border border-zinc-600 rounded text-xs text-white text-center focus:outline-none focus:border-purple-500"
                                      />
                                    </div>
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {activeTab === 'secondary' && (
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-semibold text-cyan-400 mb-2">{t('rune.weaponSecondary')}</h4>
                            <div className="space-y-2">
                              {weaponSecondary.map(trait => {
                                const currentSecondary = secondaryTraits[currentRuneIndex] || {};
                                const secondary = currentSecondary.weapon?.find(t => t.id === trait.id);
                                const isEnabled = !!secondary;
                                const currentValue = secondary?.value ?? trait.minValue ?? 0;
                                const hasRange = trait.minValue !== null && trait.maxValue !== null;

                                return (
                                  <div key={trait.id} className="p-3 bg-gradient-to-r from-red-900/30 to-orange-900/30 rounded-lg border border-red-500/40 backdrop-blur-sm">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                          <button
                                            onClick={() => handleSecondaryTraitToggle('weapon', trait)}
                                            className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                                              isEnabled ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-zinc-700/50 text-zinc-400 hover:bg-zinc-700'
                                            }`}
                                          >
                                            {isEnabled ? '✓ ' : '○ '} {trait.name}
                                          </button>
                                          {hasRange && (
                                            <span className="text-[9px] text-red-400/70 font-medium whitespace-nowrap">
                                              ({trait.minValue}-{trait.maxValue}{trait.unit})
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-xs text-zinc-400 break-words whitespace-normal">{t(trait.description)}</p>
                                      </div>
                                      {isEnabled && (
                                        <div className="flex-shrink-0 text-right">
                                          <span className="text-red-300 font-bold text-sm">{currentValue}</span>
                                          {trait.unit && <span className="text-red-400/80 text-[10px] ml-0.5">{trait.unit}</span>}
                                        </div>
                                      )}
                                    </div>
                                    {isEnabled && trait.minValue !== null && trait.maxValue !== null && (
                                      <div className="flex gap-2">
                                        <input
                                          type="range"
                                          min={trait.minValue}
                                          max={trait.maxValue}
                                          value={currentValue}
                                          onChange={e => handleSecondaryTraitChange('weapon', trait.id, parseFloat(e.target.value))}
                                          className="flex-1 h-2 rounded-full appearance-none cursor-pointer bg-zinc-700 accent-cyan-500"
                                        />
                                        <input
                                          type="number"
                                          min={trait.minValue}
                                          max={trait.maxValue}
                                          value={currentValue}
                                          onChange={e => handleSecondaryTraitChange('weapon', trait.id, parseFloat(e.target.value) || trait.minValue || 0)}
                                          className="w-16 px-2 py-1 bg-zinc-700 border border-zinc-600 rounded text-xs text-white text-center focus:outline-none focus:border-cyan-500"
                                        />
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-blue-400 mb-2">{t('rune.armorSecondary')}</h4>
                            <div className="space-y-2">
                              {armorSecondary.map(trait => {
                                const currentSecondary = secondaryTraits[currentRuneIndex] || {};
                                const secondary = currentSecondary.armor?.find(t => t.id === trait.id);
                                const isEnabled = !!secondary;
                                const currentValue = secondary?.value ?? trait.minValue ?? 0;
                                const hasRange = trait.minValue !== null && trait.maxValue !== null;

                                return (
                                  <div key={trait.id} className="p-3 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-lg border border-blue-500/40 backdrop-blur-sm">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                          <button
                                            onClick={() => handleSecondaryTraitToggle('armor', trait)}
                                            className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                                              isEnabled ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-zinc-700/50 text-zinc-400 hover:bg-zinc-700'
                                            }`}
                                          >
                                            {isEnabled ? '✓ ' : '○ '} {trait.name}
                                          </button>
                                          {hasRange && (
                                            <span className="text-[9px] text-blue-400/70 font-medium whitespace-nowrap">
                                              ({trait.minValue}-{trait.maxValue}{trait.unit})
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-xs text-zinc-400 break-words whitespace-normal">{t(trait.description)}</p>
                                      </div>
                                      {isEnabled && (
                                        <div className="flex-shrink-0 text-right">
                                          <span className="text-blue-300 font-bold text-sm">{currentValue}</span>
                                          {trait.unit && <span className="text-blue-400/80 text-[10px] ml-0.5">{trait.unit}</span>}
                                        </div>
                                      )}
                                    </div>
                                    {isEnabled && trait.minValue !== null && trait.maxValue !== null && (
                                      <div className="flex gap-2">
                                        <input
                                          type="range"
                                          min={trait.minValue}
                                          max={trait.maxValue}
                                          value={currentValue}
                                          onChange={e => handleSecondaryTraitChange('armor', trait.id, parseFloat(e.target.value))}
                                          className="flex-1 h-2 rounded-full appearance-none cursor-pointer bg-zinc-700 accent-blue-500"
                                        />
                                        <input
                                          type="number"
                                          min={trait.minValue}
                                          max={trait.maxValue}
                                          value={currentValue}
                                          onChange={e => handleSecondaryTraitChange('armor', trait.id, parseFloat(e.target.value) || trait.minValue || 0)}
                                          className="w-16 px-2 py-1 bg-zinc-700 border border-zinc-600 rounded text-xs text-white text-center focus:outline-none focus:border-blue-500"
                                        />
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'third' && (
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-semibold text-cyan-400 mb-2">{t('rune.weaponSecondary')}</h4>
                            <div className="space-y-2">
                              {weaponSecondary.map(trait => {
                                const currentThird = thirdTraits[currentRuneIndex] || [];
                                const third = currentThird.find(t => t.id === trait.id);
                                const isEnabled = !!third;
                                const currentValue = third?.value ?? trait.minValue ?? 0;
                                const hasRange = trait.minValue !== null && trait.maxValue !== null;
                                const minValue = trait.minValue ?? 0;
                                const maxValue = trait.maxValue ?? minValue;

                                return (
                                  <div key={trait.id} className="p-3 bg-gradient-to-r from-red-900/30 to-orange-900/30 rounded-lg border border-red-500/40 backdrop-blur-sm">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                          <button
                                            onClick={() => handleThirdTraitToggle(trait)}
                                            className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                                              isEnabled ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-zinc-700/50 text-zinc-400 hover:bg-zinc-700'
                                            }`}
                                          >
                                            {isEnabled ? '✓ ' : '○ '} {trait.name}
                                          </button>
                                          {hasRange && (
                                            <span className="text-[9px] text-red-400/70 font-medium whitespace-nowrap">
                                              ({trait.minValue}-{trait.maxValue}{trait.unit})
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-xs text-zinc-400 break-words whitespace-normal">{t(trait.description)}</p>
                                      </div>
                                      {isEnabled && (
                                        <div className="flex-shrink-0 text-right">
                                          <span className="text-red-300 font-bold text-sm">{currentValue}</span>
                                          {trait.unit && <span className="text-red-400/80 text-[10px] ml-0.5">{trait.unit}</span>}
                                        </div>
                                      )}
                                    </div>
                                    {isEnabled && hasRange && (
                                      <div className="flex gap-2">
                                        <input
                                          type="range"
                                          min={minValue}
                                          max={maxValue}
                                          value={currentValue}
                                          onChange={e => handleThirdTraitChange(trait, parseFloat(e.target.value))}
                                          className="flex-1 h-2 rounded-full appearance-none cursor-pointer bg-zinc-700 accent-cyan-500"
                                        />
                                        <input
                                          type="number"
                                          min={minValue}
                                          max={maxValue}
                                          value={currentValue}
                                          onChange={e => handleThirdTraitChange(trait, parseFloat(e.target.value) || minValue)}
                                          className="w-16 px-2 py-1 bg-zinc-700 border border-zinc-600 rounded text-xs text-white text-center focus:outline-none focus:border-cyan-500"
                                        />
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-blue-400 mb-2">{t('rune.armorSecondary')}</h4>
                            <div className="space-y-2">
                              {armorSecondary.map(trait => {
                                const currentThird = thirdTraits[currentRuneIndex] || [];
                                const third = currentThird.find(t => t.id === trait.id);
                                const isEnabled = !!third;
                                const currentValue = third?.value ?? trait.minValue ?? 0;
                                const hasRange = trait.minValue !== null && trait.maxValue !== null;
                                const minValue = trait.minValue ?? 0;
                                const maxValue = trait.maxValue ?? minValue;

                                return (
                                  <div key={trait.id} className="p-3 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-lg border border-blue-500/40 backdrop-blur-sm">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                          <button
                                            onClick={() => handleThirdTraitToggle(trait)}
                                            className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                                              isEnabled ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-zinc-700/50 text-zinc-400 hover:bg-zinc-700'
                                            }`}
                                          >
                                            {isEnabled ? '✓ ' : '○ '} {trait.name}
                                          </button>
                                          {hasRange && (
                                            <span className="text-[9px] text-blue-400/70 font-medium whitespace-nowrap">
                                              ({trait.minValue}-{trait.maxValue}{trait.unit})
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-xs text-zinc-400 break-words whitespace-normal">{t(trait.description)}</p>
                                      </div>
                                      {isEnabled && (
                                        <div className="flex-shrink-0 text-right">
                                          <span className="text-blue-300 font-bold text-sm">{currentValue}</span>
                                          {trait.unit && <span className="text-blue-400/80 text-[10px] ml-0.5">{trait.unit}</span>}
                                        </div>
                                      )}
                                    </div>
                                    {isEnabled && hasRange && (
                                      <div className="flex gap-2">
                                        <input
                                          type="range"
                                          min={minValue}
                                          max={maxValue}
                                          value={currentValue}
                                          onChange={e => handleThirdTraitChange(trait, parseFloat(e.target.value))}
                                          className="flex-1 h-2 rounded-full appearance-none cursor-pointer bg-zinc-700 accent-blue-500"
                                        />
                                        <input
                                          type="number"
                                          min={minValue}
                                          max={maxValue}
                                          value={currentValue}
                                          onChange={e => handleThirdTraitChange(trait, parseFloat(e.target.value) || minValue)}
                                          className="w-16 px-2 py-1 bg-zinc-700 border border-zinc-600 rounded text-xs text-white text-center focus:outline-none focus:border-blue-500"
                                        />
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => setShowSaveDialog(true)}
                        className="w-full py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all text-sm sm:text-base"
                      >
                        {t('rune.saveBuild')}
                      </button>
                    </>
                  )}

                  {!selectedRunes[currentRuneIndex] && selectedRunes.length === 0 && (
                    <div className="text-center py-8 sm:py-12 text-zinc-400">
                      {t('rune.noRune')}
                    </div>
                  )}
                </div>
              )}

              {showRuneInfo && (
                <div className="space-y-3">
                  {savedRunes.length === 0 ? (
                    <div className="text-center py-8 text-zinc-400">{t('rune.noRune')}</div>
                  ) : (
                    savedRunes.map(saved => (
                      <div key={saved.id} className="p-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg space-y-2">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-xs sm:text-base text-zinc-100 break-words">{saved.name}</h4>
                            <p className="text-xs text-zinc-400">
                              {new Date(saved.timestamp).toLocaleString(language === 'th' ? 'th-TH' : 'en-US')}
                            </p>
                          </div>
                          <div className="flex gap-1 flex-shrink-0 flex-wrap justify-end">
                            <button
                              onClick={() => handleAddRuneToCalculator(saved)}
                              className="px-2 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded text-xs font-medium transition-all flex items-center gap-1"
                            >
                              <PlusIcon className="w-3 h-3" />
                              <span className="hidden sm:inline">{t('rune.add')}</span>
                            </button>
                            <button
                              onClick={() => handleLoadRune(saved)}
                              className="px-2 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded text-xs font-medium transition-all"
                            >
                              {t('rune.load')}
                            </button>
                            <button
                              onClick={() => handleDeleteRune(saved.id)}
                              className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-xs"
                              title={t('rune.delete')}
                            >
                              <TrashIcon className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                          {Object.entries(saved.runeState.traitValues).map(([name, value]) => (
                            <div key={name} className="bg-zinc-900/50 p-2 rounded break-words">
                              <span className="text-zinc-400">{name}:</span>
                              <span className="text-purple-400 ml-1 font-semibold">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {showSaveDialog && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-zinc-900 rounded-xl border border-purple-500/30 p-4 sm:p-6 max-w-sm w-full space-y-4">
                <h3 className="text-lg sm:text-xl font-bold text-purple-400">{t('rune.buildName')}</h3>
                <input
                  type="text"
                  value={buildName}
                  onChange={e => setBuildName(e.target.value)}
                  placeholder={t('rune.buildName')}
                  className="w-full px-3 sm:px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm sm:text-base text-white focus:outline-none focus:border-purple-500"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowSaveDialog(false)}
                    className="flex-1 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-all text-sm"
                  >
                    {t('rune.cancel')}
                  </button>
                  <button
                    onClick={handleSaveRune}
                    disabled={!buildName.trim()}
                    className="flex-1 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-zinc-700 text-white rounded-lg transition-all font-semibold text-sm"
                  >
                    {t('rune.save')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Dialog */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-zinc-900 rounded-xl border border-red-500/30 p-4 sm:p-6 max-w-sm w-full space-y-4">
                <h3 className="text-lg sm:text-xl font-bold text-red-400">{t('rune.confirmDelete')}</h3>
                <p className="text-sm text-zinc-300">{t('rune.confirmDeleteMessage')}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-all text-sm"
                  >
                    {t('rune.cancel')}
                  </button>
                  <button
                    onClick={() => confirmDeleteRune(showDeleteConfirm)}
                    className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all font-semibold text-sm"
                  >
                    {t('rune.delete')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.5);
        }
      `}</style>
    </>
  );
}

export default memo(RuneCalculator);
