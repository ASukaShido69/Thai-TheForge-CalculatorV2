'use client';

import { useState, useEffect, useRef } from 'react';
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

type SavedRune = {
  id: string;
  name: string;
  runeState: RuneState;
  secondaryTraits?: {
    weapon?: SecondaryTrait[];
    armor?: SecondaryTrait[];
  };
  timestamp: number;
};

const runeData = runeDataRaw as { runes: { primary: Rune[]; secondary: { weapon: Trait[]; armor: Trait[] } } };

const translations = {
  th: {
    'rune.calculator': 'รูนคำนวน',
    'rune.selectRune': 'เลือกรูน',
    'rune.editTraits': 'แก้ไขความสามารถหลักหลัก',
    'rune.secondaryTraits': 'ความสามารถที่สอง',
    'rune.weaponSecondary': 'ความสามารถจำพวกอาวุธ',
    'rune.armorSecondary': 'ความสามารถจำพวกเกราะ',
    'rune.save': 'บันทึก',
    'rune.savedRunes': 'รูนที่บันทึก',
    'rune.buildName': 'ชื่อ Build',
    'rune.saveBuild': 'บันทึก Build',
    'rune.cancel': 'ยกเลิก',
    'rune.load': 'โหลด',
    'rune.add': 'เพิ่ม',
    'rune.delete': 'ลบ',
    'rune.noRune': 'ไม่มีรูนที่เลือก',
    'rune.selectTraits': 'เลือก Traits',
  },
  en: {
    'rune.calculator': 'Rune Calculator',
    'rune.selectRune': 'Select Rune',
    'rune.editTraits': 'Edit Primary Traits',
    'rune.secondaryTraits': 'Secondary Traits',
    'rune.weaponSecondary': 'Weapon Traits',
    'rune.armorSecondary': 'Armor Traits',
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

export default function RuneCalculator({ onRuneSelected }: RuneCalculatorProps) {
  const { language } = useLanguage();
  const t = (key: string) => {
    const translationsTyped = translations as any;
    return translationsTyped[language]?.[key] || key;
  };

  const [isOpen, setIsOpen] = useState(false);
  const [selectedRune, setSelectedRune] = useState<Rune | null>(null);
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [traitValues, setTraitValues] = useState<Record<string, number>>({});
  const [savedRunes, setSavedRunes] = useState<SavedRune[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [buildName, setBuildName] = useState('');
  const [showRuneInfo, setShowRuneInfo] = useState(false);
  const [secondaryTraits, setSecondaryTraits] = useState<{ weapon?: SecondaryTrait[]; armor?: SecondaryTrait[] }>({});
  const [activeTab, setActiveTab] = useState<'rune' | 'secondary'>('rune');
  
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // ตั้งค่าเริ่มต้นให้ปุ่มอยู่มุมขวาล่าง (ใช้ top/left เพื่อรองรับลากได้จริงทุก device)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const startX = Math.max(16, window.innerWidth - 88);
    const startY = Math.max(80, window.innerHeight - 140);
    setPosition({ x: startX, y: startY });
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('savedRunes');
    if (saved) {
      setSavedRunes(JSON.parse(saved));
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

  const handleSelectRune = (rune: Rune) => {
    setSelectedRune(rune);
    const editableTraits = rune.traits
      .filter(t => t.minValue !== null && t.maxValue !== null)
      .map(t => t.name);
    setSelectedTraits(editableTraits);
    
    const newValues: Record<string, number> = {};
    rune.traits.forEach(trait => {
      if (trait.minValue !== null) {
        newValues[trait.name] = trait.minValue;
      }
    });
    setTraitValues(newValues);
    setActiveTab('rune');
  };

  const toggleTrait = (traitName: string) => {
    setSelectedTraits(prev =>
      prev.includes(traitName)
        ? prev.filter(t => t !== traitName)
        : [...prev, traitName]
    );
    // ถ้าเพิ่งเปิดการเลือก trait ที่ยังไม่มีค่า ให้ใส่ค่าต่ำสุดไว้ก่อน
    const trait = selectedRune?.traits.find(t => t.name === traitName);
    if (trait && trait.minValue !== null && traitValues[traitName] === undefined) {
      setTraitValues(curr => ({ ...curr, [traitName]: trait.minValue! }));
    }
  };

  const handleTraitChange = (traitName: string, value: number) => {
    setTraitValues(prev => ({
      ...prev,
      [traitName]: value
    }));
  };

  const handleSecondaryTraitToggle = (type: 'weapon' | 'armor', trait: Trait) => {
    setSecondaryTraits(prev => {
      const current = prev[type] || [];
      const exists = current.find(t => t.id === trait.id);
      
      if (exists) {
        return {
          ...prev,
          [type]: current.filter(t => t.id !== trait.id)
        };
      } else {
        return {
          ...prev,
          [type]: [...current, {
            id: trait.id,
            name: trait.name,
            value: trait.minValue ?? 0
          }]
        };
      }
    });
  };

  const handleSecondaryTraitChange = (type: 'weapon' | 'armor', traitId: string, value: number) => {
    setSecondaryTraits(prev => {
      const current = prev[type] || [];
      return {
        ...prev,
        [type]: current.map(t => t.id === traitId ? { ...t, value } : t)
      };
    });
  };

  const handleSaveRune = () => {
    if (!selectedRune || !buildName.trim()) return;

    // บันทึกเฉพาะ Traits หลักที่ติ๊กเลือก
    const filteredTraitValues: Record<string, number> = {};
    selectedTraits.forEach(traitName => {
      if (traitValues[traitName] !== undefined) {
        filteredTraitValues[traitName] = traitValues[traitName];
      }
    });

    const filteredSecondary: { weapon?: SecondaryTrait[]; armor?: SecondaryTrait[] } = {};
    if (secondaryTraits.weapon?.some(t => t.value > 0)) {
      filteredSecondary.weapon = secondaryTraits.weapon.filter(t => t.value > 0);
    }
    if (secondaryTraits.armor?.some(t => t.value > 0)) {
      filteredSecondary.armor = secondaryTraits.armor.filter(t => t.value > 0);
    }

    const newSavedRune: SavedRune = {
      id: Date.now().toString(),
      name: buildName,
      runeState: {
        runeId: selectedRune.id,
        traitValues: filteredTraitValues,
        selectedTraits: [...selectedTraits]
      },
      secondaryTraits: Object.keys(filteredSecondary).length > 0 ? filteredSecondary : undefined,
      timestamp: Date.now()
    };

    setSavedRunes(prev => [newSavedRune, ...prev]);
    setShowSaveDialog(false);
    setBuildName('');
  };

  const handleLoadRune = (saved: SavedRune) => {
    const rune = runeData.runes.primary.find(r => r.id === saved.runeState.runeId);
    if (rune) {
      setSelectedRune(rune);
      setTraitValues(saved.runeState.traitValues);
      setSelectedTraits(saved.runeState.selectedTraits || []);
      setSecondaryTraits(saved.secondaryTraits || {});
      if (onRuneSelected) {
        onRuneSelected(saved.runeState, saved.secondaryTraits);
      }
    }
  };

  const handleAddRuneToCalculator = (saved: SavedRune) => {
    handleLoadRune(saved);
    setIsOpen(false);
  };

  const handleDeleteRune = (id: string) => {
    setSavedRunes(prev => prev.filter(r => r.id !== id));
  };

  const runes = runeData.runes.primary;
  const weaponSecondary = runeData.runes.secondary.weapon || [];
  const armorSecondary = runeData.runes.secondary.armor || [];

  const getRuneImage = (runeName: string) => {
    const imageMap: Record<string, string> = {
      'Miner Shard': 'MinerShard', 'Frost Speck': 'FrostSpeck', 'Flame Spark': 'FlamingSpark',
      'Venom Crumb': 'VenomCrumb', 'Chill Dust': 'ChillDust', 'Blast Chip': 'BlastChip',
      'Drain Edge': 'DrainEdge', 'Briar Notch': 'BriarNotch', 'Rage Mark': 'RageMark',
      'Ward Patch': 'Ward_Patch', 'Rot Stitch': 'RotStitch',
    };
    const imageName = imageMap[runeName];
    return imageName ? `/rune/${imageName}.png` : null;
  };

  return (
    <>
      <button
        onMouseDown={handleMouseDown}
        onClick={() => !isDragging && setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          top: `${position.y}px`,
          left: `${position.x}px`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        className="z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center group"
        title={t('rune.calculator')}
      >
        <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform pointer-events-none" />
      </button>

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
                  <div>
                    <h3 className="text-sm sm:text-lg font-semibold text-purple-300 mb-2 sm:mb-4">
                      {t('rune.selectRune')}
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {runes.map(rune => {
                        const runeImage = getRuneImage(rune.name);
                        const isSelected = selectedRune?.id === rune.id;
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

                  {selectedRune && (
                    <>
                      <div>
                        <h3 className="text-sm sm:text-base font-semibold text-cyan-300 mb-2">
                          {t('rune.selectTraits')} - {selectedRune.name}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedRune.traits
                            .filter(t => t.minValue !== null && t.maxValue !== null)
                            .map(trait => (
                              <button
                                key={trait.name}
                                onClick={() => toggleTrait(trait.name)}
                                className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all ${
                                  selectedTraits.includes(trait.name)
                                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                                    : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-cyan-500/30'
                                }`}
                              >
                                {selectedTraits.includes(trait.name) ? '✓ ' : ''}{trait.name}
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
                      </div>

                      {activeTab === 'rune' && (
                        <div className="space-y-3">
                          {selectedRune.traits.map(trait => {
                            const isEditable = trait.minValue !== null && trait.maxValue !== null;
                            const isSelected = selectedTraits.includes(trait.name);
                            
                            if (!isEditable) {
                              return (
                                <div key={trait.name} className="p-3 bg-zinc-800/30 rounded-lg border border-zinc-700/30">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-xs sm:text-sm text-zinc-300 break-words">{trait.name}</p>
                                      <p className="text-xs text-zinc-400 mt-1 break-words whitespace-normal">{trait.description}</p>
                                    </div>
                                    <span className="text-zinc-500 text-xs flex-shrink-0 whitespace-nowrap">ตายตัว</span>
                                  </div>
                                </div>
                              );
                            }

                            if (!isSelected) return null;

                            const currentValue = traitValues[trait.name] ?? trait.minValue ?? 0;
                            const maxVal = trait.maxValue ?? 100;
                            const minVal = trait.minValue ?? 0;

                            return (
                              <div key={trait.name} className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50 space-y-2">
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                  <label className="font-medium text-xs sm:text-sm text-zinc-100 flex-1 min-w-0 break-words">
                                    {trait.name}
                                  </label>
                                  <span className="text-purple-400 font-semibold text-xs sm:text-sm flex-shrink-0">
                                    {currentValue}
                                    {trait.unit ? ` ${trait.unit}` : ''}
                                  </span>
                                </div>
                                    <p className="text-xs text-zinc-400 break-words whitespace-normal">{trait.description}</p>

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
                                const secondary = secondaryTraits.weapon?.find(t => t.id === trait.id);
                                const isEnabled = !!secondary;
                                const currentValue = secondary?.value ?? trait.minValue ?? 0;

                                return (
                                  <div key={trait.id} className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                                    <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                                      <button
                                        onClick={() => handleSecondaryTraitToggle('weapon', trait)}
                                        className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                                          isEnabled ? 'bg-cyan-500/20 text-cyan-400' : 'bg-zinc-700/50 text-zinc-400 hover:bg-zinc-700'
                                        }`}
                                      >
                                        {isEnabled ? '✓ ' : '○ '} {trait.name}
                                      </button>
                                      {isEnabled && (
                                        <span className="text-cyan-400 font-semibold text-xs">
                                          {currentValue}
                                          {trait.unit ? ` ${trait.unit}` : ''}
                                        </span>
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
                                    <p className="text-xs text-zinc-400 mt-1 break-words whitespace-normal">{trait.description}</p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-blue-400 mb-2">{t('rune.armorSecondary')}</h4>
                            <div className="space-y-2">
                              {armorSecondary.map(trait => {
                                const secondary = secondaryTraits.armor?.find(t => t.id === trait.id);
                                const isEnabled = !!secondary;
                                const currentValue = secondary?.value ?? trait.minValue ?? 0;

                                return (
                                  <div key={trait.id} className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                                    <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                                      <button
                                        onClick={() => handleSecondaryTraitToggle('armor', trait)}
                                        className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                                          isEnabled ? 'bg-blue-500/20 text-blue-400' : 'bg-zinc-700/50 text-zinc-400 hover:bg-zinc-700'
                                        }`}
                                      >
                                        {isEnabled ? '✓ ' : '○ '} {trait.name}
                                      </button>
                                      {isEnabled && (
                                        <span className="text-blue-400 font-semibold text-xs">
                                          {currentValue}
                                          {trait.unit ? ` ${trait.unit}` : ''}
                                        </span>
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
                                    <p className="text-xs text-zinc-400 mt-1 break-words">{trait.description}</p>
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

                  {!selectedRune && (
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
