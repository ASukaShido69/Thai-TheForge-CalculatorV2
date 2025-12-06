'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
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
  [key: string]: any; // For complex traits with sub-properties
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

const runeData = runeDataRaw as { 
  runes: { 
    primary: Rune[];
    secondary: {
      weapon: Array<{
        id: string;
        name: string;
        type: string;
        description: string;
        minValue: number;
        maxValue: number;
        unit: string;
      }>;
      armor: Array<{
        id: string;
        name: string;
        type: string;
        description: string;
        minValue: number;
        maxValue: number;
        unit: string;
      }>;
    };
  } 
};

// Translations
const translations = {
  th: {
    'rune.calculator': '✨ รูนคำนวน',
    'rune.selectRune': '🎯 เลือกรูน',
    'rune.editTraits': '⚙️ แก้ไข Traits',
    'rune.save': '💾 บันทึก',
    'rune.saved': '📦 บันทึกรูน',
    'rune.savedRunes': '📚 รูนที่บันทึก',
    'rune.buildName': 'ชื่อ Build',
    'rune.saveBuild': 'บันทึก Build',
    'rune.cancel': 'ยกเลิก',
    'rune.load': 'โหลด',
    'rune.info': 'ข้อมูล',
    'rune.delete': 'ลบ',
    'rune.noRune': 'ไม่มีรูนที่เลือก',
    'rune.maxValue': 'ค่าสูงสุด',
    'rune.close': 'ปิด',
    'rune.description': 'รายละเอียด',
    'rune.comparison': 'การเปรียบเทียบกับ Ore',
    'rune.add': 'เพิ่ม',
    'rune.secondaryTraits': '⭐ Secondary Traits',
    'rune.weaponSecondary': '⚔️ Weapon Secondary Traits',
    'rune.armorSecondary': '🛡️ Armor Secondary Traits',
    'rune.addSecondary': '➕ เพิ่ม Secondary Trait',
    'rune.removeSecondary': 'ลบ',
    // Rune Names
    'rune.minerShard': '💎 Miner Shard',
    'rune.frostSpeck': '❄️ Frost Speck',
    'rune.flameSpark': '🔥 Flame Spark',
    'rune.venomCrumb': '☠️ Venom Crumb',
    'rune.chillDust': '🌨️ Chill Dust',
    'rune.blastChip': '💣 Blast Chip',
    'rune.drainEdge': '🩸 Drain Edge',
    'rune.briarNotch': '🌿 Briar Notch',
    'rune.rageMark': '😡 Rage Mark',
    'rune.wardPatch': '🛡️ Ward Patch',
    'rune.rotStitch': '🦠 Rot Stitch',
    // Primary Traits
    'trait.luck': '🍀 โชค',
    'trait.yield': '⛏️ ผลผลิต',
    'trait.swiftMining': '⚡ ขุดแร่เร็ว',
    'trait.minePower': '💪 พลังขุด',
    'trait.ice': '❄️ น้ำแข็ง',
    'trait.burn': '🔥 เผาไหม้',
    'trait.poison': '☠️ พิษ',
    'trait.snow': '🌨️ หิมะ',
    'trait.explosion': '💣 ระเบิด',
    'trait.heal': '💚 รักษา',
    'trait.thorns': '🌿 หนาม',
    'trait.berserk': '😡 บ้าคลั่ง',
    'trait.shield': '🛡️ โล่',
    'trait.toxicVeins': '🦠 เส้นพิษ',
    // Secondary Traits
    'trait.attackSpeed': '⚡ ความเร็วโจมตี',
    'trait.lethality': '🗡️ ความร้ายแรง',
    'trait.criticalChance': '🎯 โอกาสคริติคอล',
    'trait.criticalDamage': '💥 ความเสียหายคริติคอล',
    'trait.fracture': '🔨 ความเสียหายสตัน',
    'trait.endurance': '💪 ความอดทน',
    'trait.surge': '⚡ การพุ่ง',
    'trait.vitality': '❤️ พลังชีวิต',
    'trait.swiftness': '🏃 ความว่องไว',
    'trait.phase': '👻 ระยะเวลาไร้ตัว',
  },
  en: {
    'rune.calculator': 'Rune Calculator',
    'rune.selectRune': 'Select Rune',
    'rune.editTraits': 'Edit Traits',
    'rune.save': 'Save',
    'rune.saved': 'Saved Runes',
    'rune.buildName': 'Build Name',
    'rune.saveBuild': 'Save Build',
    'rune.cancel': 'Cancel',
    'rune.load': 'Load',
    'rune.info': 'Info',
    'rune.delete': 'Delete',
    'rune.noRune': 'No Rune Selected',
    'rune.maxValue': 'Max Value',
    'rune.close': 'Close',
    'rune.description': 'Description',
    'rune.comparison': 'Comparison with Ore',
    'rune.add': 'Add',
    'rune.secondaryTraits': 'Secondary Traits',
    'rune.weaponSecondary': 'Weapon Secondary Traits',
    'rune.armorSecondary': 'Armor Secondary Traits',
    'rune.addSecondary': 'Add Secondary Trait',
    'rune.removeSecondary': 'Remove',
    // Rune Names
    'rune.minerShard': '💎 Miner Shard',
    'rune.frostSpeck': '❄️ Frost Speck',
    'rune.flameSpark': '🔥 Flame Spark',
    'rune.venomCrumb': '☠️ Venom Crumb',
    'rune.chillDust': '🌨️ Chill Dust',
    'rune.blastChip': '💣 Blast Chip',
    'rune.drainEdge': '🩸 Drain Edge',
    'rune.briarNotch': '🌿 Briar Notch',
    'rune.rageMark': '😡 Rage Mark',
    'rune.wardPatch': '🛡️ Ward Patch',
    'rune.rotStitch': '🦠 Rot Stitch',
    // Primary Traits
    'trait.luck': '🍀 Luck',
    'trait.yield': '⛏️ Yield',
    'trait.swiftMining': '⚡ Swift Mining',
    'trait.minePower': '💪 Mine Power',
    'trait.ice': '❄️ Ice',
    'trait.burn': '🔥 Burn',
    'trait.poison': '☠️ Poison',
    'trait.snow': '🌨️ Snow',
    'trait.explosion': '💣 Explosion',
    'trait.heal': '💚 Heal',
    'trait.thorns': '🌿 Thorns',
    'trait.berserk': '😡 Berserk',
    'trait.shield': '🛡️ Shield',
    'trait.toxicVeins': '🦠 Toxic Veins',
    // Secondary Traits
    'trait.attackSpeed': '⚡ Attack Speed',
    'trait.lethality': '🗡️ Lethality',
    'trait.criticalChance': '🎯 Critical Chance',
    'trait.criticalDamage': '💥 Critical Damage',
    'trait.fracture': '🔨 Fracture',
    'trait.endurance': '💪 Endurance',
    'trait.surge': '⚡ Surge',
    'trait.vitality': '❤️ Vitality',
    'trait.swiftness': '🏃 Swiftness',
    'trait.phase': '👻 Phase',
  }
};

// Icons
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
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
  </svg>
);

interface RuneCalculatorProps {
  onRuneSelected?: (rune: RuneState, secondaryTraits?: { weapon?: SecondaryTrait[], armor?: SecondaryTrait[] }) => void;
}

export default function RuneCalculator({ onRuneSelected }: RuneCalculatorProps) {
  const { language } = useLanguage();
  const t = (key: string) => {
    const translationsTyped = translations as any;
    return translationsTyped[language]?.[key] || key;
  };

  // Helper function to get translated rune name
  const getRuneName = (runeId: string, defaultName: string) => {
    const key = `rune.${runeId}`;
    const translated = t(key);
    return translated !== key ? translated : defaultName;
  };

  // Helper function to get translated trait name
  const getTraitName = (traitName: string) => {
    const key = `trait.${traitName.toLowerCase().replace(/\s+/g, '')}`;
    const translated = t(key);
    if (translated !== key) {
      return translated;
    }
    // Fallback: try to match partial names
    const lowerTrait = traitName.toLowerCase();
    if (lowerTrait.includes('luck')) return t('trait.luck');
    if (lowerTrait.includes('yield')) return t('trait.yield');
    if (lowerTrait.includes('swift') && lowerTrait.includes('mining')) return t('trait.swiftMining');
    if (lowerTrait.includes('mine') && lowerTrait.includes('power')) return t('trait.minePower');
    if (lowerTrait.includes('ice')) return t('trait.ice');
    if (lowerTrait.includes('burn')) return t('trait.burn');
    if (lowerTrait.includes('poison')) return t('trait.poison');
    if (lowerTrait.includes('snow')) return t('trait.snow');
    if (lowerTrait.includes('explosion')) return t('trait.explosion');
    if (lowerTrait.includes('heal')) return t('trait.heal');
    if (lowerTrait.includes('thorn')) return t('trait.thorns');
    if (lowerTrait.includes('berserk')) return t('trait.berserk');
    if (lowerTrait.includes('shield')) return t('trait.shield');
    if (lowerTrait.includes('toxic')) return t('trait.toxicVeins');
    if (lowerTrait.includes('attack') && lowerTrait.includes('speed')) return t('trait.attackSpeed');
    if (lowerTrait.includes('lethality')) return t('trait.lethality');
    if (lowerTrait.includes('critical') && lowerTrait.includes('chance')) return t('trait.criticalChance');
    if (lowerTrait.includes('critical') && lowerTrait.includes('damage')) return t('trait.criticalDamage');
    if (lowerTrait.includes('fracture')) return t('trait.fracture');
    if (lowerTrait.includes('endurance')) return t('trait.endurance');
    if (lowerTrait.includes('surge')) return t('trait.surge');
    if (lowerTrait.includes('vitality')) return t('trait.vitality');
    if (lowerTrait.includes('swiftness')) return t('trait.swiftness');
    if (lowerTrait.includes('phase')) return t('trait.phase');
    return traitName;
  };

  const [isOpen, setIsOpen] = useState(false);
  const [selectedRune, setSelectedRune] = useState<Rune | null>(null);
  const [traitValues, setTraitValues] = useState<Record<string, number>>({});
  const [savedRunes, setSavedRunes] = useState<SavedRune[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [buildName, setBuildName] = useState('');
  const [showRuneInfo, setShowRuneInfo] = useState<SavedRune | null>(null);
  const [secondaryTraits, setSecondaryTraits] = useState<{
    weapon?: SecondaryTrait[];
    armor?: SecondaryTrait[];
  }>({});

  // Load saved runes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedRunes');
    if (saved) {
      setSavedRunes(JSON.parse(saved));
    }
  }, []);

  // Save runes to localStorage
  useEffect(() => {
    localStorage.setItem('savedRunes', JSON.stringify(savedRunes));
  }, [savedRunes]);

  const handleSelectRune = (rune: Rune) => {
    setSelectedRune(rune);
    // Initialize trait values with min values
    const newValues: Record<string, number> = {};
    rune.traits.forEach(trait => {
      if (trait.minValue !== null) {
        newValues[trait.name] = trait.minValue;
      }
    });
    setTraitValues(newValues);
  };

  const handleTraitChange = (traitName: string, value: number) => {
    setTraitValues(prev => ({
      ...prev,
      [traitName]: value
    }));
  };

  const handleSaveRune = () => {
    if (!selectedRune || !buildName.trim()) return;

    const newSavedRune: SavedRune = {
      id: Date.now().toString(),
      name: buildName,
      runeState: {
        runeId: selectedRune.id,
        traitValues: { ...traitValues }
      },
      secondaryTraits: Object.keys(secondaryTraits).length > 0 ? { ...secondaryTraits } : undefined,
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
      setSecondaryTraits(saved.secondaryTraits || {});
      if (onRuneSelected) {
        onRuneSelected(saved.runeState, saved.secondaryTraits);
      }
    }
  };

  const handleAddSecondaryTrait = (type: 'weapon' | 'armor', traitId: string) => {
    const secondaryData = type === 'weapon' 
      ? runeData.runes.secondary.weapon.find(t => t.id === traitId)
      : runeData.runes.secondary.armor.find(t => t.id === traitId);
    
    if (!secondaryData) return;

    const newTrait: SecondaryTrait = {
      id: traitId,
      name: secondaryData.name,
      value: secondaryData.minValue
    };

    setSecondaryTraits(prev => ({
      ...prev,
      [type]: [...(prev[type] || []), newTrait]
    }));
  };

  const handleRemoveSecondaryTrait = (type: 'weapon' | 'armor', index: number) => {
    setSecondaryTraits(prev => {
      const traits = prev[type] || [];
      const newTraits = traits.filter((_, i) => i !== index);
      return {
        ...prev,
        [type]: newTraits.length > 0 ? newTraits : undefined
      };
    });
  };

  const handleSecondaryTraitValueChange = (type: 'weapon' | 'armor', index: number, value: number) => {
    setSecondaryTraits(prev => {
      const traits = [...(prev[type] || [])];
      traits[index] = { ...traits[index], value };
      return {
        ...prev,
        [type]: traits
      };
    });
  };

  const handleAddRuneToCalculator = (saved: SavedRune) => {
    const rune = runeData.runes.primary.find(r => r.id === saved.runeState.runeId);
    if (rune) {
      setSelectedRune(rune);
      setTraitValues(saved.runeState.traitValues);
      setSecondaryTraits(saved.secondaryTraits || {});
      if (onRuneSelected) {
        onRuneSelected(saved.runeState, saved.secondaryTraits);
      }
      setIsOpen(false);
    }
  };

  const handleDeleteRune = (id: string) => {
    setSavedRunes(prev => prev.filter(r => r.id !== id));
  };

  const runes = runeData.runes.primary;

  const getRuneImage = (runeName: string) => {
    const imageMap: Record<string, string> = {
      'Miner Shard': 'MinerShard',
      'Frost Speck': 'FrostSpeck',
      'Flame Spark': 'FlamingSpark',
      'Venom Crumb': 'VenomCrumb',
      'Chill Dust': 'ChillDust',
      'Blast Chip': 'BlastChip',
      'Drain Edge': 'DrainEdge',
      'Briar Notch': 'BriarNotch',
      'Rage Mark': 'RageMark',
      'Ward Patch': 'Ward_Patch',
      'Rot Stitch': 'RotStitch',
    };
    const imageName = imageMap[runeName];
    return imageName ? `/rune/${imageName}.png` : null;
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center group"
        title={t('rune.calculator')}
      >
        <SparklesIcon className="w-6 h-6 group-hover:rotate-12 transition-transform" />
      </button>

      {/* Modal - Center */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-zinc-900 via-purple-900/20 to-zinc-900 rounded-2xl border border-purple-500/30 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-purple-500/20 sticky top-0 bg-zinc-900/50 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-purple-400 flex items-center gap-2">
                <SparklesIcon className="w-6 h-6" />
                {t('rune.calculator')}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Tabs */}
              <div className="flex gap-4 border-b border-purple-500/20">
                <button
                  className={`px-4 py-2 font-semibold border-b-2 transition-all ${
                    !showRuneInfo
                      ? 'border-purple-500 text-purple-400'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200'
                  }`}
                  onClick={() => setShowRuneInfo(null)}
                >
                  {t('rune.calculator')}
                </button>
                <button
                  className={`px-4 py-2 font-semibold border-b-2 transition-all ${
                    showRuneInfo
                      ? 'border-purple-500 text-purple-400'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200'
                  }`}
                  onClick={() => setShowRuneInfo({} as SavedRune)}
                >
                  {t('rune.savedRunes')} ({savedRunes.length})
                </button>
              </div>

              {/* Rune Calculator Tab */}
              {!showRuneInfo && (
                <div className="space-y-6">
                  {/* Step 1: Select Rune */}
                  <div>
                      <h3 className="text-lg font-semibold text-purple-300 mb-4 flex items-center gap-2">
                        {t('rune.selectRune')}
                      </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {runes.map(rune => {
                        const runeImage = getRuneImage(rune.name);
                        const isSelected = selectedRune?.id === rune.id;
                        return (
                          <button
                            key={rune.id}
                            onClick={() => handleSelectRune(rune)}
                            className={`p-3 rounded-xl border-2 transition-all group shadow-lg ${
                              isSelected
                                ? 'border-purple-500 bg-purple-500/20 shadow-purple-500/30 scale-105'
                                : 'border-zinc-700 hover:border-purple-500/50 hover:bg-zinc-800/50 hover:shadow-purple-500/20 hover:scale-102'
                            }`}
                          >
                            {runeImage && (
                              <div className="relative w-full aspect-square mb-2 overflow-hidden rounded-lg bg-zinc-800">
                                <Image
                                  src={runeImage}
                                  alt={rune.name}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform"
                                />
                              </div>
                            )}
                            <p className="text-sm font-medium text-zinc-200 line-clamp-2">
                              {getRuneName(rune.id, rune.name)}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 2: Edit Traits */}
                  {selectedRune && (
                    <div>
                      <h3 className="text-lg font-semibold text-purple-300 mb-4 flex items-center gap-2">
                        {t('rune.editTraits')} - {getRuneName(selectedRune.id, selectedRune.name)}
                      </h3>
                      <div className="space-y-4">
                        {selectedRune.traits.map(trait => {
                          const currentValue = traitValues[trait.name] ?? trait.minValue ?? 0;
                          const maxVal = trait.maxValue ?? 100;
                          const minVal = trait.minValue ?? 0;

                          return (
                            <div
                              key={trait.name}
                              className="p-4 bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 rounded-lg border border-zinc-700/50 space-y-3 shadow-lg hover:shadow-purple-500/10 transition-all"
                            >
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <label className="font-medium text-zinc-100">
                                    {getTraitName(trait.name)}
                                  </label>
                                  <span className="text-purple-400 font-semibold">
                                    {currentValue}
                                    {trait.unit ? ` ${trait.unit}` : ''}
                                  </span>
                                </div>
                                <p className="text-xs text-zinc-400">
                                  {trait.description}
                                </p>
                              </div>

                              {/* Progress Bar */}
                              {minVal !== null && maxVal !== null && (
                                <div className="w-full bg-zinc-700 rounded-full h-2 overflow-hidden">
                                  <div
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all"
                                    style={{
                                      width: `${((currentValue - minVal) / (maxVal - minVal)) * 100}%`
                                    }}
                                  />
                                </div>
                              )}

                              {/* Slider and Input */}
                              {minVal !== null && maxVal !== null && (
                                <div className="flex gap-3">
                                  <input
                                    type="range"
                                    min={minVal}
                                    max={maxVal}
                                    value={currentValue}
                                    onChange={e =>
                                      handleTraitChange(
                                        trait.name,
                                        parseFloat(e.target.value)
                                      )
                                    }
                                    className="flex-1 h-2 rounded-full appearance-none cursor-pointer bg-zinc-700 accent-purple-500"
                                  />
                                  <input
                                    type="number"
                                    min={minVal}
                                    max={maxVal}
                                    value={currentValue}
                                    onChange={e =>
                                      handleTraitChange(
                                        trait.name,
                                        parseFloat(e.target.value) || minVal
                                      )
                                    }
                                    className="w-20 px-3 py-1 bg-zinc-700 border border-zinc-600 rounded text-sm text-white text-center focus:outline-none focus:border-purple-500"
                                  />
                                </div>
                              )}

                              {minVal !== null && maxVal !== null && (
                                <div className="flex justify-between text-xs text-zinc-500">
                                  <span>{t('rune.maxValue')}: {maxVal}{trait.unit ? ` ${trait.unit}` : ''}</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Secondary Traits Section */}
                      <div className="mt-6 space-y-4">
                        <h3 className="text-lg font-semibold text-purple-300 mb-4 flex items-center gap-2">
                          {t('rune.secondaryTraits')}
                        </h3>

                        {/* Weapon Secondary Traits */}
                        <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                          <h4 className="text-md font-semibold text-red-300 mb-3">
                            {t('rune.weaponSecondary')}
                          </h4>
                          
                          {/* Existing Weapon Traits */}
                          {secondaryTraits.weapon && secondaryTraits.weapon.length > 0 && (
                            <div className="space-y-3 mb-3">
                              {secondaryTraits.weapon.map((trait, index) => {
                                const traitData = runeData.runes.secondary.weapon.find(t => t.id === trait.id);
                                if (!traitData) return null;
                                
                                return (
                                  <div key={index} className="p-3 bg-gradient-to-br from-zinc-900/50 to-red-900/10 rounded border border-red-500/30 shadow-md hover:shadow-red-500/20 transition-all">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="font-medium text-red-300">{getTraitName(trait.name)}</span>
                                      <button
                                        onClick={() => handleRemoveSecondaryTrait('weapon', index)}
                                        className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-xs transition-all"
                                      >
                                        {t('rune.removeSecondary')}
                                      </button>
                                    </div>
                                    <p className="text-xs text-zinc-400 mb-2">{traitData.description}</p>
                                    <div className="flex gap-3">
                                      <input
                                        type="range"
                                        min={traitData.minValue}
                                        max={traitData.maxValue}
                                        value={trait.value}
                                        onChange={e => handleSecondaryTraitValueChange('weapon', index, parseFloat(e.target.value))}
                                        className="flex-1 h-2 rounded-full appearance-none cursor-pointer bg-zinc-700 accent-red-500"
                                      />
                                      <input
                                        type="number"
                                        min={traitData.minValue}
                                        max={traitData.maxValue}
                                        value={trait.value}
                                        onChange={e => handleSecondaryTraitValueChange('weapon', index, parseFloat(e.target.value) || traitData.minValue)}
                                        className="w-20 px-3 py-1 bg-zinc-700 border border-zinc-600 rounded text-sm text-white text-center focus:outline-none focus:border-red-500"
                                      />
                                    </div>
                                    <div className="text-xs text-zinc-500 mt-1">
                                      {trait.value}{traitData.unit} (Max: {traitData.maxValue}{traitData.unit})
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Add Weapon Trait Dropdown */}
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                handleAddSecondaryTrait('weapon', e.target.value);
                                e.target.value = '';
                              }
                            }}
                            className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-sm text-white focus:outline-none focus:border-red-500"
                          >
                            <option value="">{t('rune.addSecondary')} ({t('rune.weaponSecondary')})</option>
                            {runeData.runes.secondary.weapon.map(trait => (
                              <option key={trait.id} value={trait.id}>
                                {trait.name} ({trait.minValue}-{trait.maxValue}{trait.unit})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Armor Secondary Traits */}
                        <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                          <h4 className="text-md font-semibold text-blue-300 mb-3">
                            {t('rune.armorSecondary')}
                          </h4>
                          
                          {/* Existing Armor Traits */}
                          {secondaryTraits.armor && secondaryTraits.armor.length > 0 && (
                            <div className="space-y-3 mb-3">
                              {secondaryTraits.armor.map((trait, index) => {
                                const traitData = runeData.runes.secondary.armor.find(t => t.id === trait.id);
                                if (!traitData) return null;
                                
                                return (
                                  <div key={index} className="p-3 bg-gradient-to-br from-zinc-900/50 to-blue-900/10 rounded border border-blue-500/30 shadow-md hover:shadow-blue-500/20 transition-all">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="font-medium text-blue-300">{getTraitName(trait.name)}</span>
                                      <button
                                        onClick={() => handleRemoveSecondaryTrait('armor', index)}
                                        className="px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded text-xs transition-all"
                                      >
                                        {t('rune.removeSecondary')}
                                      </button>
                                    </div>
                                    <p className="text-xs text-zinc-400 mb-2">{traitData.description}</p>
                                    <div className="flex gap-3">
                                      <input
                                        type="range"
                                        min={traitData.minValue}
                                        max={traitData.maxValue}
                                        value={trait.value}
                                        onChange={e => handleSecondaryTraitValueChange('armor', index, parseFloat(e.target.value))}
                                        className="flex-1 h-2 rounded-full appearance-none cursor-pointer bg-zinc-700 accent-blue-500"
                                      />
                                      <input
                                        type="number"
                                        min={traitData.minValue}
                                        max={traitData.maxValue}
                                        value={trait.value}
                                        onChange={e => handleSecondaryTraitValueChange('armor', index, parseFloat(e.target.value) || traitData.minValue)}
                                        className="w-20 px-3 py-1 bg-zinc-700 border border-zinc-600 rounded text-sm text-white text-center focus:outline-none focus:border-blue-500"
                                      />
                                    </div>
                                    <div className="text-xs text-zinc-500 mt-1">
                                      {trait.value}{traitData.unit} (Max: {traitData.maxValue}{traitData.unit})
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Add Armor Trait Dropdown */}
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                handleAddSecondaryTrait('armor', e.target.value);
                                e.target.value = '';
                              }
                            }}
                            className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-sm text-white focus:outline-none focus:border-blue-500"
                          >
                            <option value="">{t('rune.addSecondary')} ({t('rune.armorSecondary')})</option>
                            {runeData.runes.secondary.armor.map(trait => (
                              <option key={trait.id} value={trait.id}>
                                {trait.name} ({trait.minValue}-{trait.maxValue}{trait.unit})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Save Button */}
                      <button
                        onClick={() => setShowSaveDialog(true)}
                        className="mt-6 w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all"
                      >
                        {t('rune.saveBuild')}
                      </button>
                    </div>
                  )}

                  {!selectedRune && (
                    <div className="text-center py-12 text-zinc-400">
                      {t('rune.noRune')}
                    </div>
                  )}
                </div>
              )}

              {/* Saved Runes Tab */}
              {showRuneInfo && (
                <div className="space-y-4">
                  {savedRunes.length === 0 ? (
                    <div className="text-center py-12 text-zinc-400">
                      {t('rune.noRune')}
                    </div>
                  ) : (
                    savedRunes.map(saved => (
                      <div
                        key={saved.id}
                        className="p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-lg space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-zinc-100">
                              {(() => {
                                const rune = runeData.runes.primary.find(r => r.id === saved.runeState.runeId);
                                return rune ? `${getRuneName(rune.id, rune.name)} - ${saved.name}` : saved.name;
                              })()}
                            </h4>
                            <p className="text-xs text-zinc-400">
                              {new Date(saved.timestamp).toLocaleString(
                                language === 'th' ? 'th-TH' : 'en-US'
                              )}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAddRuneToCalculator(saved)}
                              className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded text-sm font-medium transition-all flex items-center gap-1"
                              title={language === 'th' ? 'เพิ่มไปยัง Calculator' : 'Add to Calculator'}
                            >
                              <PlusIcon className="w-4 h-4" />
                              {t('rune.add')}
                            </button>
                            <button
                              onClick={() => handleDeleteRune(saved.id)}
                              className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-sm font-medium transition-all"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                          {Object.entries(saved.runeState.traitValues).map(
                            ([name, value]) => {
                              const rune = runeData.runes.primary.find(r => r.id === saved.runeState.runeId);
                              const trait = rune?.traits.find(t => t.name === name);
                              return (
                                <div key={name} className="bg-zinc-900/50 p-2 rounded">
                                  <span className="text-zinc-400">{getTraitName(name)}:</span>
                                  <span className="text-purple-400 ml-1 font-semibold">
                                    {value}
                                  </span>
                                </div>
                              );
                            }
                          )}
                        </div>
                        
                        {/* Secondary Traits Display */}
                        {(saved.secondaryTraits?.weapon && saved.secondaryTraits.weapon.length > 0) || 
                         (saved.secondaryTraits?.armor && saved.secondaryTraits.armor.length > 0) ? (
                          <div className="mt-2 space-y-2">
                            {saved.secondaryTraits.weapon && saved.secondaryTraits.weapon.length > 0 && (
                              <div>
                                <div className="text-xs text-red-400 font-semibold mb-1">
                                  {t('rune.weaponSecondary')}:
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {saved.secondaryTraits.weapon.map((trait, idx) => (
                                    <div key={idx} className="bg-red-500/20 border border-red-500/30 px-2 py-1 rounded text-xs">
                                      <span className="text-red-300">{trait.name}:</span>
                                      <span className="text-red-400 ml-1 font-semibold">{trait.value}%</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {saved.secondaryTraits.armor && saved.secondaryTraits.armor.length > 0 && (
                              <div>
                                <div className="text-xs text-blue-400 font-semibold mb-1">
                                  {t('rune.armorSecondary')}:
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {saved.secondaryTraits.armor.map((trait, idx) => (
                                    <div key={idx} className="bg-blue-500/20 border border-blue-500/30 px-2 py-1 rounded text-xs">
                                      <span className="text-blue-300">{trait.name}:</span>
                                      <span className="text-blue-400 ml-1 font-semibold">{trait.value}%</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : null}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Save Dialog */}
          {showSaveDialog && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-zinc-900 rounded-xl border border-purple-500/30 p-6 max-w-md w-full space-y-4">
                <h3 className="text-xl font-bold text-purple-400">
                  {t('rune.buildName')}
                </h3>
                <input
                  type="text"
                  value={buildName}
                  onChange={e => setBuildName(e.target.value)}
                  placeholder={t('rune.buildName')}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  autoFocus
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSaveDialog(false)}
                    className="flex-1 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-all"
                  >
                    {t('rune.cancel')}
                  </button>
                  <button
                    onClick={handleSaveRune}
                    disabled={!buildName.trim()}
                    className="flex-1 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-zinc-700 text-white rounded-lg transition-all font-semibold"
                  >
                    {t('rune.save')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
