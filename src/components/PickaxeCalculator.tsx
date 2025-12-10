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

// Flatten pickaxe data
const pickaxeData: Pickaxe[] = Object.values(pickaxeDataRaw).flat() as Pickaxe[];

// Get Miner Shard rune
const minerShardRune = (runeDataRaw as any).runes.primary.find(
  (r: any) => r.id === 'miner_shard'
) as Rune;

interface PickaxeCalculatorProps {
  onClose: () => void;
}

export default function PickaxeCalculator({ onClose }: PickaxeCalculatorProps) {
  const { t } = useLanguage();
  const [selectedPickaxe, setSelectedPickaxe] = useState<Pickaxe | null>(null);
  const [selectedTraits, setSelectedTraits] = useState<Record<string, number>>({});

  const handlePickaxeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pickaxe = pickaxeData.find((p) => p.id === e.target.value);
    setSelectedPickaxe(pickaxe || null);
  };

  const handleTraitValueChange = (traitName: string, value: number) => {
    setSelectedTraits((prev) => ({
      ...prev,
      [traitName]: value,
    }));
  };

  const calculateStats = () => {
    if (!selectedPickaxe) return null;

    let totalLuck = selectedPickaxe.luckBoost;
    let totalYield = 0;
    let totalSwiftMining = selectedPickaxe.miningSpeed;
    let totalMinePower = selectedPickaxe.minePower;

    // Apply trait bonuses
    Object.entries(selectedTraits).forEach(([traitName, value]) => {
      if (traitName === 'Luck') {
        totalLuck += value;
      } else if (traitName === 'Yield') {
        totalYield += value;
      } else if (traitName === 'Swift Mining') {
        totalSwiftMining += value;
      } else if (traitName === 'Mine Power') {
        totalMinePower += Math.round((selectedPickaxe.minePower * value) / 100);
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-zinc-900 via-yellow-900/20 to-zinc-900 rounded-2xl border border-yellow-500/30 w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-yellow-500/20 bg-zinc-900/80 backdrop-blur-xl">
          <h2 className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
            <img src="/pickaxe/pickaxe.png" alt="Pickaxe" className="w-8 h-8" />
            <span>Pickaxe Calculator (Miner Shard)</span>
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Pickaxe Selection */}
          <div className="bg-zinc-800/50 rounded-lg p-4 border border-yellow-500/20">
            <label className="block text-yellow-400 font-semibold mb-2">Select Pickaxe</label>
            <select
              className="w-full p-3 bg-zinc-900 border border-yellow-500/30 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
              onChange={handlePickaxeChange}
              value={selectedPickaxe?.id || ''}
            >
              <option value="">เลือก Pickaxe</option>
              {pickaxeData.map((pickaxe) => (
                <option key={pickaxe.id} value={pickaxe.id}>
                  {pickaxe.name} (MP: {pickaxe.minePower}, Luck: {pickaxe.luckBoost}%, Slots: {pickaxe.runeSlots})
                </option>
              ))}
            </select>
            {selectedPickaxe && (
              <div className="mt-3 text-sm text-zinc-300">
                <p className="text-yellow-400 font-semibold">{selectedPickaxe.name}</p>
                <p className="text-xs mt-1">{selectedPickaxe.description}</p>
                <p className="text-xs mt-1 text-zinc-400">Location: {selectedPickaxe.location}</p>
              </div>
            )}
          </div>

          {/* Rune Info */}
          <div className="bg-zinc-800/50 rounded-lg p-4 border border-yellow-500/20">
            <h3 className="text-yellow-400 font-semibold mb-3">Rune: {minerShardRune.name}</h3>
            <p className="text-sm text-zinc-300 mb-4">
              Type: <span className="text-purple-400">{minerShardRune.type}</span> | Rarity: <span className="text-orange-400">{minerShardRune.rarity}</span>
            </p>

            {/* Traits */}
            <div className="space-y-3">
              {minerShardRune.traits.map((trait) => (
                <div key={trait.name} className="bg-zinc-900/50 rounded-lg p-3 border border-yellow-500/10">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="text-white font-medium">{trait.name}</p>
                      <p className="text-xs text-zinc-400">{trait.description}</p>
                    </div>
                    {trait.minValue !== null && trait.maxValue !== null && (
                      <span className="text-xs text-yellow-400">
                        {trait.minValue}-{trait.maxValue}{trait.unit}
                      </span>
                    )}
                  </div>
                  {trait.minValue !== null && trait.maxValue !== null && (
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={trait.minValue}
                        max={trait.maxValue}
                        value={selectedTraits[trait.name] || trait.minValue}
                        onChange={(e) => handleTraitValueChange(trait.name, Number(e.target.value))}
                        className="flex-1 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                      />
                      <input
                        type="number"
                        min={trait.minValue}
                        max={trait.maxValue}
                        value={selectedTraits[trait.name] || trait.minValue}
                        onChange={(e) => handleTraitValueChange(trait.name, Number(e.target.value))}
                        className="w-16 p-1 bg-zinc-900 border border-yellow-500/30 rounded text-center text-white text-sm"
                      />
                      <span className="text-xs text-yellow-400 w-8">{trait.unit}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Results */}
          {stats && selectedPickaxe && (
            <div className="bg-gradient-to-br from-yellow-900/20 to-zinc-900/50 rounded-lg p-4 border border-yellow-500/30">
              <h3 className="text-yellow-400 font-bold text-lg mb-3">📊 Total Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-900/50 rounded p-3">
                  <p className="text-xs text-zinc-400">Total Mine Power</p>
                  <p className="text-2xl font-bold text-white">{stats.totalMinePower}</p>
                </div>
                <div className="bg-zinc-900/50 rounded p-3">
                  <p className="text-xs text-zinc-400">Total Luck Boost</p>
                  <p className="text-2xl font-bold text-green-400">{stats.totalLuck}%</p>
                </div>
                <div className="bg-zinc-900/50 rounded p-3">
                  <p className="text-xs text-zinc-400">Total Yield Chance</p>
                  <p className="text-2xl font-bold text-blue-400">{stats.totalYield}%</p>
                </div>
                <div className="bg-zinc-900/50 rounded p-3">
                  <p className="text-xs text-zinc-400">Swift Mining Bonus</p>
                  <p className="text-2xl font-bold text-purple-400">{stats.totalSwiftMining}%</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
