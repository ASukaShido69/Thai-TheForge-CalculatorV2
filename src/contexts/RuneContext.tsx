'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

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

type SecondaryTrait = {
  id: string;
  name: string;
  value: number;
};

type RuneState = {
  runeId: string;
  traitValues: Record<string, number>;
  selectedTraits?: string[];
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

interface RuneContextType {
  selectedRune: Rune | null;
  traitValues: Record<string, number>;
  selectedTraits: string[];
  secondaryTraits: { weapon?: SecondaryTrait[]; armor?: SecondaryTrait[] };
  savedRunes: SavedRune[];
  
  // Methods
  setSelectedRune: (rune: Rune | null) => void;
  handleTraitChange: (traitName: string, value: number) => void;
  toggleTrait: (traitName: string, rune: Rune | null) => void;
  handleSecondaryTraitToggle: (type: 'weapon' | 'armor', trait: Trait) => void;
  handleSecondaryTraitChange: (type: 'weapon' | 'armor', traitId: string, value: number) => void;
  handleSaveRune: (buildName: string) => boolean;
  handleLoadRune: (saved: SavedRune) => void;
  handleDeleteRune: (id: string) => boolean;
  reset: () => void;
}

const RuneContext = createContext<RuneContextType | undefined>(undefined);

export function RuneProvider({ children }: { children: ReactNode }) {
  const [selectedRune, setSelectedRune] = useState<Rune | null>(null);
  const [traitValues, setTraitValues] = useState<Record<string, number>>({});
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [secondaryTraits, setSecondaryTraits] = useState<{ weapon?: SecondaryTrait[]; armor?: SecondaryTrait[] }>({});
  const [savedRunes, setSavedRunes] = useState<SavedRune[]>([]);

  // Load saved runes from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('savedRunes');
    if (saved) {
      try {
        setSavedRunes(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse saved runes:', error);
      }
    }
  }, []);

  // Persist saved runes to localStorage
  React.useEffect(() => {
    localStorage.setItem('savedRunes', JSON.stringify(savedRunes));
  }, [savedRunes]);

  const handleSelectRune = useCallback((rune: Rune | null) => {
    setSelectedRune(rune);
    if (rune) {
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
    } else {
      setSelectedTraits([]);
      setTraitValues({});
    }
  }, []);

  const handleTraitChange = useCallback((traitName: string, value: number) => {
    setTraitValues((prev: Record<string, number>) => ({
      ...prev,
      [traitName]: value
    }));
  }, []);

  const toggleTrait = useCallback((traitName: string, rune: Rune | null) => {
    setSelectedTraits((prev: string[]) =>
      prev.includes(traitName)
        ? prev.filter((t: string) => t !== traitName)
        : [...prev, traitName]
    );

    if (rune && !selectedTraits.includes(traitName)) {
      const trait = rune.traits.find((t: Trait) => t.name === traitName);
      if (trait && trait.minValue !== null && traitValues[traitName] === undefined) {
        setTraitValues((curr: Record<string, number>) => ({ ...curr, [traitName]: trait.minValue! }));
      }
    }
  }, [selectedTraits, traitValues]);

  const handleSecondaryTraitToggle = useCallback((type: 'weapon' | 'armor', trait: Trait) => {
    setSecondaryTraits((prev: { weapon?: SecondaryTrait[]; armor?: SecondaryTrait[] }) => {
      const current = prev[type] || [];
      const exists = current.find((t: SecondaryTrait) => t.id === trait.id);

      if (exists) {
        return {
          ...prev,
          [type]: current.filter((t: SecondaryTrait) => t.id !== trait.id)
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
  }, []);

  const handleSecondaryTraitChange = useCallback((type: 'weapon' | 'armor', traitId: string, value: number) => {
    setSecondaryTraits((prev: { weapon?: SecondaryTrait[]; armor?: SecondaryTrait[] }) => {
      const current = prev[type] || [];
      return {
        ...prev,
        [type]: current.map((t: SecondaryTrait) => t.id === traitId ? { ...t, value } : t)
      };
    });
  }, []);

  const handleSaveRune = useCallback((buildName: string): boolean => {
    if (!selectedRune || !buildName.trim()) return false;

    const filteredTraitValues: Record<string, number> = {};
    selectedTraits.forEach((traitName: string) => {
      if (traitValues[traitName] !== undefined) {
        filteredTraitValues[traitName] = traitValues[traitName];
      }
    });

    const filteredSecondary: { weapon?: SecondaryTrait[]; armor?: SecondaryTrait[] } = {};
    if (secondaryTraits.weapon?.some((t: SecondaryTrait) => t.value > 0)) {
      filteredSecondary.weapon = secondaryTraits.weapon.filter((t: SecondaryTrait) => t.value > 0);
    }
    if (secondaryTraits.armor?.some((t: SecondaryTrait) => t.value > 0)) {
      filteredSecondary.armor = secondaryTraits.armor.filter((t: SecondaryTrait) => t.value > 0);
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

    setSavedRunes((prev: SavedRune[]) => [newSavedRune, ...prev]);
    return true;
  }, [selectedRune, selectedTraits, traitValues, secondaryTraits]);

  const handleLoadRune = useCallback((saved: SavedRune) => {
    // This would require rune data, so we'll just update the context state
    // The actual rune object would be fetched from the component
    setTraitValues(saved.runeState.traitValues);
    setSelectedTraits(saved.runeState.selectedTraits || []);
    setSecondaryTraits(saved.secondaryTraits || {});
  }, []);

  const handleDeleteRune = useCallback((id: string): boolean => {
    setSavedRunes((prev: SavedRune[]) => {
      const filtered = prev.filter((r: SavedRune) => r.id !== id);
      return filtered;
    });
    return true;
  }, []);

  const reset = useCallback(() => {
    setSelectedRune(null);
    setTraitValues({});
    setSelectedTraits([]);
    setSecondaryTraits({});
  }, []);

  const value: RuneContextType = {
    selectedRune,
    traitValues,
    selectedTraits,
    secondaryTraits,
    savedRunes,
    setSelectedRune: handleSelectRune,
    handleTraitChange,
    toggleTrait,
    handleSecondaryTraitToggle,
    handleSecondaryTraitChange,
    handleSaveRune,
    handleLoadRune,
    handleDeleteRune,
    reset
  };

  return (
    <RuneContext.Provider value={value}>
      {children}
    </RuneContext.Provider>
  );
}

export function useRune() {
  const context = useContext(RuneContext);
  if (!context) {
    throw new Error('useRune must be used within RuneProvider');
  }
  return context;
}
