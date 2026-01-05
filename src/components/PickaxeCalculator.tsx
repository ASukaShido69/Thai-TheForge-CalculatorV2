'use client';

import { useState } from 'react';
import pickaxeDataRaw from '../data/pickaxe.json';
import runeDataRaw from '../data/rune.json';
import { useLanguage } from '@/contexts/LanguageContext';

// Types
type Trait = {
  name: string;
  description: string;
  minValue: number | null;
  maxValue: number | null;
  unit: string | null;
};

type Rune = {
  id: string;
  name: string;
  type: string;
  rarity: string;
  traits: Trait[];
};

type Pickaxe = {
  id: string;
  name: string;
  minePower: number;
  miningSpeed: number;
  luckBoost: number;
  runeSlots: number;
  cost: number;
  description: string;
  location: string;
};

type RuneSlot = {
  id: number;
  selectedRune: Rune | null;
  traitValues: Record<string, number>;
};

// Flatten pickaxe data
const pickaxeData: Pickaxe[] = Object.values(pickaxeDataRaw).flat() as Pickaxe[];

// Get Miner Shard rune
const minerShardRune = (runeDataRaw as any).runes.primary.find(
  (r: any) => r.id === 'miner_shard'
) as Rune;

const runeNamesTH: Record<string, string> = {
  'Miner Shard': 'รูนนักขุด',
};

const traitNamesTH: Record<string, string> = {
  'Luck': '🍀 โชค',
  'Yield': '💎 โอกาสได้แร่เพิ่ม',
  'Swift Mining': '⚡ ขุดเร็ว',
  'Mine Power': '⛏️ พลังการขุด',
};

// Map pickaxe names to image files
const getPickaxeImage = (name: string): string => {
  const imageMap: Record<string, string> = {
    'Stone Pickaxe': 'StonePick',
    'Bronze Pickaxe': 'BronzePick',
    'Iron Pickaxe': 'IronPick',
    'Golden Pickaxe': 'GoldenPick',
    "Stonewake's Pickaxe": 'StoneWakePick',
    'Platinum Pickaxe': 'PlatinumPick',
    'Titanium Pickaxe': 'TitaniumPick',
    'Mythril Pickaxe': 'MythrilPick',
    'Cobalt Pickaxe': 'CobaltPick',
    'Uranium Pickaxe': 'UraniumPick',
    'Lightite Pickaxe': 'LightitePick',
    'Magma Pickaxe': 'MagmaPick',
    'Demonic Pickaxe': 'DemonicPick',
    'Arcane Pickaxe': 'ArcanePick',
    'Tungsten Pickaxe': 'Tungsten_Pickaxe',
    'Aqua Pickaxe': 'Aqua_Pickaxe',
    'Mist Pickaxe': 'Mist_Pickaxe',
    'Snow Pickaxe': 'Snow_Pickaxe',
    'Frost Pickaxe': 'Frost_Pickaxe',
    'Void Pickaxe': 'Void_Pickaxe',
    'Prismatic Pickaxe': 'Prismatic_Pickaxe',
    'Dragon Head Pickaxe': 'dragonhead_pickaxe',
  };
  const imageName = imageMap[name];
  return imageName ? `/pickaxe/${imageName}.png` : '/pickaxe/pickaxe.png';
};

interface PickaxeCalculatorProps {
  onClose: () => void;
}

export default function PickaxeCalculator({ onClose }: PickaxeCalculatorProps) {
  const { language } = useLanguage();
  const [selectedPickaxe, setSelectedPickaxe] = useState<Pickaxe | null>(null);
  const [runeSlots, setRuneSlots] = useState<RuneSlot[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);

  const handlePickaxeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pickaxe = pickaxeData.find((p) => p.id === e.target.value);
    setSelectedPickaxe(pickaxe || null);
    
    // Initialize rune slots based on pickaxe's runeSlots
    if (pickaxe) {
      const slots: RuneSlot[] = Array.from({ length: pickaxe.runeSlots }, (_, i) => ({
        id: i,
        selectedRune: i === 0 ? minerShardRune : null,
        traitValues: {},
      }));
      setRuneSlots(slots);
    } else {
      setRuneSlots([]);
    }
  };

  const handleRuneChange = (slotId: number, runeId: string | null) => {
    setRuneSlots((prev) =>
      prev.map((slot) =>
        slot.id === slotId
          ? { ...slot, selectedRune: runeId ? minerShardRune : null, traitValues: {} }
          : slot
      )
    );
  };

  const handleTraitValueChange = (slotId: number, traitName: string, value: number) => {
    setRuneSlots((prev) =>
      prev.map((slot) =>
        slot.id === slotId
          ? { ...slot, traitValues: { ...slot.traitValues, [traitName]: value } }
          : slot
      )
    );
  };

  const calculateStats = () => {
    if (!selectedPickaxe) return null;

    let totalLuck = selectedPickaxe.luckBoost;
    let totalYield = 0;
    let totalSwiftMining = selectedPickaxe.miningSpeed;
    let totalMinePower = selectedPickaxe.minePower;

    // Apply trait bonuses from all rune slots
    runeSlots.forEach((slot) => {
      if (slot.selectedRune) {
        Object.entries(slot.traitValues).forEach(([traitName, value]) => {
          if (traitName === 'Luck') {
            totalLuck += value as number;
          } else if (traitName === 'Yield') {
            totalYield += value as number;
          } else if (traitName === 'Swift Mining') {
            totalSwiftMining += value as number;
          } else if (traitName === 'Mine Power') {
            totalMinePower += Math.round((selectedPickaxe.minePower * (value as number)) / 100);
          }
        });
      }
    });

    return {
      totalLuck,
      totalYield,
      totalSwiftMining,
      totalMinePower,
    };
  };

  const stats = calculateStats();

  const getRuneName = (name: string) => language === 'th' ? (runeNamesTH[name] || name) : name;
  const getTraitName = (name: string) => language === 'th' ? (traitNamesTH[name] || name) : name;

  if (isMinimized) {
    return (
      <div className="fixed bottom-24 right-24 z-40">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-gradient-to-br from-amber-600 to-yellow-700 text-white px-4 py-2 rounded-lg shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 border border-yellow-400/30"
        >
          <img src="/pickaxe/pickaxe.png" alt="Pickaxe" className="w-5 h-5" />
          <span className="font-semibold">{language === 'th' ? 'เครื่องคำนวณ Pickaxe' : 'Pickaxe Calculator'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 w-full max-w-2xl">
      <div className="bg-gradient-to-br from-zinc-900 via-amber-900/20 to-zinc-900 rounded-2xl border-2 border-amber-500/40 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-amber-500/30 bg-gradient-to-r from-amber-900/50 to-yellow-900/50 backdrop-blur-xl">
          <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
            <img src="/pickaxe/pickaxe.png" alt="Pickaxe" className="w-7 h-7" />
            <span>{language === 'th' ? '⛏️ เครื่องคำนวณ Pickaxe (รูนนักขุด)' : '⛏️ Pickaxe Calculator (Miner Shard)'}</span>
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setIsMinimized(true)}
              className="text-amber-400 hover:text-white transition-colors text-xl px-2"
              title="Minimize"
            >
              −
            </button>
            <button
              onClick={onClose}
              className="text-amber-400 hover:text-white transition-colors text-xl px-2"
              title="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {/* Pickaxe Selection */}
          <div className="bg-gradient-to-br from-amber-900/30 to-zinc-800/50 rounded-xl p-4 border border-amber-500/30 shadow-lg">
            <label className="block text-amber-400 font-bold mb-3 text-sm">
              {language === 'th' ? '⛏️ เลือก Pickaxe' : '⛏️ Select Pickaxe'}
            </label>
            <select
              className="w-full p-2.5 bg-zinc-900/80 border-2 border-amber-500/40 rounded-lg text-white focus:border-amber-400 focus:outline-none transition-colors text-sm"
              onChange={handlePickaxeChange}
              value={selectedPickaxe?.id || ''}
            >
              <option value="">{language === 'th' ? '-- เลือก Pickaxe --' : '-- Select Pickaxe --'}</option>
              {pickaxeData.map((pickaxe) => (
                <option key={pickaxe.id} value={pickaxe.id}>
                  {pickaxe.name} | MP: {pickaxe.minePower} | Luck: {pickaxe.luckBoost}% | Slots: {pickaxe.runeSlots}
                </option>
              ))}
            </select>
            {selectedPickaxe && (
              <div className="mt-3 p-3 bg-zinc-900/60 rounded-lg border border-amber-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <img src={getPickaxeImage(selectedPickaxe.name)} alt={selectedPickaxe.name} className="w-16 h-16 object-contain" />
                  <div>
                    <p className="text-amber-300 font-bold text-sm">{selectedPickaxe.name}</p>
                    <p className="text-xs text-zinc-400">
                      {language === 'th' ? 'สล็อตรูน' : 'Rune Slots'}: {selectedPickaxe.runeSlots} | 
                      {language === 'th' ? ' ราคา' : ' Price'}: {selectedPickaxe.cost} 💰
                    </p>
                  </div>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">{selectedPickaxe.description}</p>
              </div>
            )}
          </div>

          {/* Rune Slots */}
          {selectedPickaxe && runeSlots.length > 0 && (
            <div className="space-y-3">
              {runeSlots.map((slot) => (
                <div key={slot.id} className="bg-gradient-to-br from-purple-900/30 to-zinc-800/50 rounded-xl p-4 border border-purple-500/30 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-purple-400 font-bold text-sm flex items-center gap-2">
                      <img src="/rune/MinerShard.png" alt="Rune" className="w-6 h-6" />
                      {language === 'th' ? `รูนช่องที่ ${slot.id + 1}` : `Rune Slot ${slot.id + 1}`}
                    </h3>
                    <select
                      className="px-3 py-1 bg-zinc-900/80 border border-purple-500/40 rounded-lg text-white text-xs focus:border-purple-400 focus:outline-none"
                      value={slot.selectedRune ? 'miner_shard' : ''}
                      onChange={(e) => handleRuneChange(slot.id, e.target.value || null)}
                    >
                      <option value="">{language === 'th' ? '-- ไม่มี --' : '-- None --'}</option>
                      <option value="miner_shard">{getRuneName('Miner Shard')}</option>
                    </select>
                  </div>

                  {slot.selectedRune && (
                    <>
                      <div className="text-xs text-zinc-300 mb-3 flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-purple-500/30 rounded">{language === 'th' ? 'หลัก' : 'Primary'}</span>
                        <span className="px-2 py-0.5 bg-orange-500/30 rounded">{language === 'th' ? 'หายาก' : 'Rare'}</span>
                      </div>

                      {/* Traits */}
                      <div className="space-y-2">
                        {minerShardRune.traits.map((trait) => (
                          <div key={trait.name} className="bg-zinc-900/60 rounded-lg p-2.5 border border-purple-500/20">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <p className="text-white font-semibold text-xs">{getTraitName(trait.name)}</p>
                                <p className="text-xs text-zinc-400 mt-0.5">{trait.description}</p>
                              </div>
                              {trait.minValue !== null && trait.maxValue !== null && (
                                <span className="text-xs text-amber-400 font-mono ml-2">
                                  {trait.minValue}-{trait.maxValue}{trait.unit}
                                </span>
                              )}
                            </div>
                            {trait.minValue !== null && trait.maxValue !== null && (
                              <div className="flex items-center gap-2">
                                <input
                                  type="range"
                                  min={trait.minValue}
                                  max={trait.maxValue}
                                  value={slot.traitValues[trait.name] || trait.minValue}
                                  onChange={(e) => handleTraitValueChange(slot.id, trait.name, Number(e.target.value))}
                                  className="flex-1 h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                />
                                <input
                                  type="number"
                                  min={trait.minValue}
                                  max={trait.maxValue}
                                  value={slot.traitValues[trait.name] || trait.minValue}
                                  onChange={(e) => handleTraitValueChange(slot.id, trait.name, Number(e.target.value))}
                                  className="w-14 p-1 bg-zinc-900 border border-amber-500/40 rounded text-center text-white text-xs"
                                />
                                <span className="text-xs text-amber-400 w-6">{trait.unit}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Results */}
          {stats && selectedPickaxe && (
            <div className="bg-gradient-to-br from-emerald-900/30 to-zinc-900/50 rounded-xl p-4 border-2 border-emerald-500/40 shadow-lg">
              <h3 className="text-emerald-400 font-bold text-base mb-3 flex items-center gap-2">
                📊 {language === 'th' ? 'สถิติรวม' : 'Total Stats'}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-zinc-900/60 rounded-lg p-2.5 border border-amber-500/20">
                  <p className="text-xs text-zinc-400">{language === 'th' ? 'พลังขุดรวม' : 'Total Mine Power'}</p>
                  <p className="text-xl font-bold text-amber-400">⛏️ {stats.totalMinePower}</p>
                </div>
                <div className="bg-zinc-900/60 rounded-lg p-2.5 border border-green-500/20">
                  <p className="text-xs text-zinc-400">{language === 'th' ? 'โชครวม' : 'Total Luck'}</p>
                  <p className="text-xl font-bold text-green-400">🍀 {stats.totalLuck}%</p>
                </div>
                <div className="bg-zinc-900/60 rounded-lg p-2.5 border border-blue-500/20">
                  <p className="text-xs text-zinc-400">{language === 'th' ? 'ผลผลิตเพิ่ม' : 'Yield Bonus'}</p>
                  <p className="text-xl font-bold text-blue-400">💎 {stats.totalYield}%</p>
                </div>
                <div className="bg-zinc-900/60 rounded-lg p-2.5 border border-purple-500/20">
                  <p className="text-xs text-zinc-400">{language === 'th' ? 'ขุดเร็วขึ้น' : 'Swift Mining'}</p>
                  <p className="text-xl font-bold text-purple-400">⚡ {stats.totalSwiftMining}%</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
