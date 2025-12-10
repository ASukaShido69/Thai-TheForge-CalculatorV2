'use client';

import { useState } from 'react';
import PickaxeCalculator from './PickaxeCalculator';

export default function PickaxeCalculatorButton() {
  const [show, setShow] = useState(false);

  return (
    <>
      <button
        className="fixed z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center group"
        style={{ bottom: 24, right: 24 }}
        title="เครื่องคำนวณ Pickaxe"
        onClick={() => setShow(true)}
      >
        <img src="/pickaxe/pickaxe.png" alt="Pickaxe" className="w-8 h-8 group-hover:rotate-12 transition-transform" />
      </button>
      {show && <PickaxeCalculator onClose={() => setShow(false)} />}
    </>
  );
}
