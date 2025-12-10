import React, { useState } from 'react';
import pickaxeData from '../data/pickaxe.json';
import runeData from '../data/rune.json';

// TODO: import traits/secondtraits if available

const minerShadRunes = runeData.filter((rune: any) => rune.name === 'Miner Shad');

export default function PickaxeCalculator() {
  const [selectedPickaxe, setSelectedPickaxe] = useState<any>(null);
  const [selectedRune, setSelectedRune] = useState<any>(minerShadRunes[0] || null);
  const [trait, setTrait] = useState('');
  const [secondTrait, setSecondTrait] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handlePickaxeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pickaxe = pickaxeData.find((p: any) => p.name === e.target.value);
    setSelectedPickaxe(pickaxe);
  };

  const handleTraitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTrait(e.target.value);
  };

  const handleSecondTraitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecondTrait(e.target.value);
  };

  // Example calculation logic
  const calculateResult = () => {
    // Replace with actual calculation logic
    return `Pickaxe: ${selectedPickaxe?.name || '-'} | Rune: ${selectedRune?.name || '-'} | Trait: ${trait} | SecondTrait: ${secondTrait}`;
  };

  return (
    <>
      <button
        className="rounded-full bg-yellow-500 p-2 shadow-lg hover:bg-yellow-600"
        style={{ width: 48, height: 48 }}
        onClick={() => setShowPopup(true)}
        title="Pickaxe Calculator"
      >
        <img src="/pickaxe/pickaxe.png" alt="Pickaxe" style={{ width: '100%', height: '100%' }} />
      </button>
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-500" onClick={() => setShowPopup(false)}>
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">Pickaxe Calculator (Miner Shad)</h2>
            <div className="mb-3">
              <label className="block mb-1">Pickaxe</label>
              <select className="w-full p-2 border rounded" onChange={handlePickaxeChange}>
                <option value="">เลือก Pickaxe</option>
                {pickaxeData.map((pickaxe: any) => (
                  <option key={pickaxe.name} value={pickaxe.name}>{pickaxe.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="block mb-1">Rune (Miner Shad)</label>
              <input className="w-full p-2 border rounded" value={selectedRune?.name || ''} disabled />
            </div>
            <div className="mb-3">
              <label className="block mb-1">Trait</label>
              <input className="w-full p-2 border rounded" value={trait} onChange={handleTraitChange} placeholder="กรอก Trait" />
            </div>
            <div className="mb-3">
              <label className="block mb-1">Second Trait</label>
              <input className="w-full p-2 border rounded" value={secondTrait} onChange={handleSecondTraitChange} placeholder="กรอก Second Trait" />
            </div>
            <div className="mt-4 p-3 bg-gray-100 rounded">
              <strong>รายละเอียด:</strong>
              <div className="mt-2 text-sm">
                {calculateResult()}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
