'use client';

import { useState, useEffect, useMemo, memo, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

import oresDataRaw from '../../data/ores.json';
import weaponOddsRaw from '../../data/weaponOdds.json';
import armorOddsRaw from '../../data/armorOdds.json';
import forgeDataRaw from '../../data/forgeData.json';

// Custom hook to detect mobile devices
function useIsMobile(breakpoint: number = 1024) {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    
    checkMobile();
    
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 150);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [breakpoint]);
  
  return isMobile;
}

// Icons
const HeartIcon = ({ className, filled }: { className?: string, filled?: boolean }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const BookmarkIcon = ({ className, filled }: { className?: string, filled?: boolean }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const CompareIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 6L4 12L9 18" />
    <path d="M15 6L20 12L15 18" />
    <line x1="4" y1="12" x2="20" y2="12" />
  </svg>
);

const SaveIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

const TrashIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M5 7.5C5 6.67157 5.67157 6 6.5 6H17.5C18.3284 6 19 6.67157 19 7.5V20.5C19 21.3284 18.3284 22 17.5 22H6.5C5.67157 22 5 21.3284 5 20.5V7.5Z" />
    <path d="M8.5 2C8.5 2 8.5 1 9.5 1H14.5C15.5 1 15.5 2 15.5 2H19.5C20.3284 2 21 2.67157 21 3.5V4.5H3V3.5C3 2.67157 3.67157 2 4.5 2H8.5Z" />
  </svg>
);

const CloseIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    <path d="M19 12l.75 2.25L22 15l-2.25.75L19 18l-.75-2.25L16 15l2.25-.75L19 12z" />
  </svg>
);

const InfoIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 16v-4m0-4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// --- Types ---
type Trait = {
  maxStat: number;
  description: string;
};

type OreData = {
  rarity: string;
  multiplier: number;
  traitType: string | null;
  traits: Trait[];
};

type SlotItem = {
  name: string;
  count: number;
};

type OresData = Record<string, OreData>;
type OddsData = Record<string, Record<string, number>>;
type ForgeData = {
  weapons: Record<string, number>;
  armor: Record<string, number>;
  weaponStats?: Record<string, number>;
  armorStats?: Record<string, number>;
};

type SavedBuild = {
  id: string;
  name: string;
  craftType: 'Weapon' | 'Armor';
  slots: (SlotItem | null)[];
  results: any;
  timestamp: number;
  predictedItem?: string;
  predictedChance?: number;
  multiplier?: number;
  imageUrl?: string;
};

const ores: OresData = oresDataRaw as unknown as OresData;
const weaponOdds: OddsData = weaponOddsRaw;
const armorOdds: OddsData = armorOddsRaw;
const forgeData: ForgeData = forgeDataRaw as ForgeData;

// --- Helper Functions ---
function calculateCombinedMultiplier(selectedOres: Record<string, number>) {
  let totalMultiplier = 0, totalCount = 0;
  for (const [ore, count] of Object.entries(selectedOres)) {
    if (!ores[ore]) continue;
    totalMultiplier += ores[ore].multiplier * count;
    totalCount += count;
  }
  return totalCount ? totalMultiplier / totalCount : 0;
}

function calculateTransferredStat(x: number) {
  let y = 4.5 * x - 35; 
  if (y < 0) y = 0; 
  if (y > 100) y = 100; 
  return y / 100;
}

function getItemChancesWithTraits(selectedOres: Record<string, number>, craftType: string = "Weapon") {
  const oddsDict = craftType === "Weapon" ? weaponOdds : armorOdds;
  const combinedMultiplier = calculateCombinedMultiplier(selectedOres);
  const totalCount = Object.values(selectedOres).reduce((a, b) => a + b, 0);
  
  if (totalCount === 0) return { combinedMultiplier: 0, totalCount: 0, composition: {}, odds: {}, traits: [], rarity: 'Unknown' };
  if (totalCount < 3) {
    return { combinedMultiplier, totalCount, composition: {}, odds: {}, traits: [], rarity: 'Unknown' };
  }

  const MAX_ODDS_ORE_COUNT = 55; 
  
  let oddsKey = totalCount > MAX_ODDS_ORE_COUNT ? MAX_ODDS_ORE_COUNT.toString() : totalCount.toString();
  
  if (!oddsDict[oddsKey]) {
      const keys = Object.keys(oddsDict).map(Number).filter(k => k >= 3);
      if (keys.length === 0) {
        return { combinedMultiplier, totalCount, composition: {}, odds: {}, traits: [], rarity: 'Unknown' };
      }
      const maxKey = Math.max(...keys);
      oddsKey = maxKey.toString();
  }

  const odds = oddsDict[oddsKey] || {};

  const composition: Record<string, number> = {};
  for (const [ore, count] of Object.entries(selectedOres)) {
    composition[ore] = (count / totalCount * 100);
  }

  const traits: { ore: string, lines: { percentage: string; description: string; mergedPercentage: string | null }[] }[] = [];
  for (const [oreName, pct] of Object.entries(composition)) {
    const oreData = ores[oreName];
    if (!oreData || !Array.isArray(oreData.traits)) continue;
    if (oreData.traitType !== "All" && oreData.traitType !== craftType) continue;
    if (pct < 10) continue;

    const transferredFraction = calculateTransferredStat(pct);
    const oreTraitParts: { percentage: string; description: string; mergedPercentage: string | null }[] = [];

    for (let i = 0; i < oreData.traits.length; i++) {
      const t1 = oreData.traits[i];
      if (typeof t1.maxStat !== "number") continue;
      const percentage = (transferredFraction * t1.maxStat).toFixed(2);
      let description = t1.description;
      let mergedPercentage: string | null = null;
      
      // Don't merge AOE Explosion - keep it separate from chance
      const isAOEExplosion = t1.description.includes("💣 AOE Explosion");
      const shouldMerge = !isAOEExplosion
        && t1.description.trim().match(/(with|of|for|per|to|in)$/i)
        && oreData.traits[i + 1] && typeof oreData.traits[i + 1].maxStat === "number";
      
      if (shouldMerge) {
        const t2 = oreData.traits[i + 1];
        mergedPercentage = (transferredFraction * t2.maxStat).toFixed(2);
        description += ` ${t2.description}`;
        i++;
      }
      
      // Store as object to preserve data for translation
      const line = {
        percentage,
        description,
        mergedPercentage
      };
      oreTraitParts.push(line);
    }
    if (oreTraitParts.length) traits.push({ ore: oreName, lines: oreTraitParts });
  }

  const highestOre = Object.entries(composition).reduce((a, b) => b[1] > a[1] ? b : a, ["", 0])[0];
  const rarity = ores[highestOre]?.rarity || "Unknown";

  const sortedOdds = Object.fromEntries(
    Object.entries(odds).filter(([k, v]) => v > 0).sort((a, b) => b[1] - a[1])
  );

  return { combinedMultiplier, totalCount, composition, odds: sortedOdds, traits, rarity };
}

const IMAGE_VERSION = '2';

function addImageVersion(imagePath: string): string {
  return `${imagePath}?v=${IMAGE_VERSION}`;
}

function getOreImagePath(oreName: string): string | null {
  const imageMap: Record<string, string> = {
    "Stone Ore": "stone", "Sand Stone": "sand_stone", "Copper Ore": "cooper",
    "Iron Ore": "iron", "Tin Ore": "tin", "Silver Ore": "silver",
    "Gold Ore": "gold", "Mushroomite Ore": "mushroomite", "Platinum Ore": "platinum",
    "Bananite Ore": "bananite", "Cardboardite Ore": "cardboardite", "Aite Ore": "aite",
    "Poopite Ore": "poopite", "Cobalt Ore": "cobalt", "Titanium Ore": "titanium",
    "Lapis Lazuli Ore": "lapis_lazuli", "Volcanic Rock": "volcanic", "Quartz Ore": "quartz",
    "Amethyst Ore": "amethyst", "Topaz Ore": "topaz", "Diamond Ore": "diamond",
    "Sapphire Ore": "sapphirew", "Cuprite Ore": "cuprite", "Obsidian Ore": "obsidian",
    "Emerald Ore": "emerald", "Ruby Ore": "ruby", "Rivalite Ore": "rivalite",
    "Uranium Ore": "uranium", "Mythril Ore": "mythril", "Eye Ore": "eye",
    "Fireite Ore": "fireite", "Magmaite Ore": "magmaite", "Lightite Ore": "lightite",
    "Demonite Ore": "demonite", "Darkryte Ore": "darkryte", "Magenta Crystal Ore": "magenta_crystal",
    "Crimson Crystal Ore": "crimson_crystal", "Green Crystal Ore": "green_crystal",
    "Orange Crystal Ore": "orange_crystal", "Blue Crystal Ore": "blue_crystal",
    "Rainbow Crystal Ore": "rainbow_crystal", "Arcane Crystal Ore": "arcane_crystal",
  };

  const imageName = imageMap[oreName];
  if (imageName) {
    return addImageVersion(`/ores/${imageName}.png`);
  }
  return null;
}

function getArmorItemsByCategory(): Record<string, Array<{name: string, image: string, categoryKey: string}>> {
  const createArmorItem = (name: string, image: string, categoryKey: string) => ({
    name,
    image: addImageVersion(`/items/${image}.png`),
    categoryKey
  });
  
  return {
    "Light": [
      createArmorItem("Light Helmet", "light_helmet", "Light Helmet"),
      createArmorItem("Light Leggings", "light_leggings", "Light Leggings"),
      createArmorItem("Light Chestplate", "light_chestplate", "Light Chestplate"),
    ],
    "Medium": [
      createArmorItem("Medium Helmet", "medium_helmet", "Medium Helmet"),
      createArmorItem("Medium Leggings", "medium_leggings", "Medium Leggings"),
      createArmorItem("Medium Chestplate", "medium_chestplate", "Medium Chestplate"),
      createArmorItem("Samurai Helmet", "samurai_helmet", "Medium Helmet"),
      createArmorItem("Samurai Leggings", "samurai_leggings", "Medium Leggings"),
      createArmorItem("Samurai Chestplate", "samurai_chestplate", "Medium Chestplate"),
    ],
    "Heavy": [
      createArmorItem("Knight Helmet", "knight_helmet", "Heavy Helmet"),
      createArmorItem("Dark Knight Helmet", "dark_knight_helmet", "Heavy Helmet"),
      createArmorItem("Knight Leggings", "knight_leggings", "Heavy Leggings"),
      createArmorItem("Dark Knight Leggings", "dark_knight_leggings", "Heavy Leggings"),
      createArmorItem("Knight Chestplate", "knight_chestplate", "Heavy Chestplate"),
      createArmorItem("Dark Knight Chestplate", "dark_knight_chestplate", "Heavy Chestplate"),
    ],
  };
}

function getWeaponItemsByCategory(): Record<string, Array<{name: string, image: string, categoryKey: string}>> {
  const createWeaponItem = (name: string, image: string, categoryKey: string) => ({
    name,
    image: addImageVersion(`/weapons/${image}.png`),
    categoryKey
  });
  
  return {
    "Dagger": [
      createWeaponItem("Dagger", "dagger", "Dagger"),
      createWeaponItem("Gladius Dagger", "gladius_dagger", "Dagger"),
      createWeaponItem("Hook", "hook", "Dagger"),
    ],
    "Great Sword": [
      createWeaponItem("Crusader Sword", "crusader", "Great Sword"),
      createWeaponItem("Long Sword", "long_sword", "Great Sword"),
    ],
    "Great Axe": [
      createWeaponItem("Double Battle Axe", "double_battle_axe", "Great Axe"),
      createWeaponItem("Scythe", "scythe", "Great Axe"),
    ],
    "Katana": [
      createWeaponItem("Uchigatana", "uchigatana", "Katana"),
      createWeaponItem("Tachi", "tachi", "Katana"),
    ],
    "Straight Sword": [
      createWeaponItem("Falchion", "falchion", "Straight Sword"),
      createWeaponItem("Cutlass", "cutlass", "Straight Sword"),
      createWeaponItem("Rapier", "rapier", "Straight Sword"),
      createWeaponItem("Chaos", "chaos", "Straight Sword"),
    ],
    "Gauntlet": [
      createWeaponItem("Ironhand", "ironhand", "Gauntlet"),
      createWeaponItem("Relevator", "relevator", "Gauntlet"),
    ],
    "Colossal Sword": [
      createWeaponItem("Great Sword", "great_sword", "Colossal Sword"),
      createWeaponItem("Hammer", "hammer", "Colossal Sword"),
      createWeaponItem("Skull Crusher", "skull_crusher", "Colossal Sword"),
      createWeaponItem("Dragon Slayer", "dragon_slayer", "Colossal Sword"),
    ],
  };
}

function getItemChance(itemName: string, categoryKey: string, categoryChance: number, craftType: "Weapon" | "Armor" = "Armor"): { chance: number, ratio: string } {
  if (craftType === "Armor") {
    const fullChanceItems = [
      "Light Helmet", "Light Leggings", "Light Chestplate",
      "Medium Helmet", "Medium Leggings", "Medium Chestplate",
      "Knight Helmet", "Knight Leggings", "Knight Chestplate"
    ];
    
    const halfChanceItems = [
      "Samurai Helmet", "Samurai Leggings", "Samurai Chestplate",
      "Dark Knight Helmet", "Dark Knight Leggings", "Dark Knight Chestplate"
    ];
    
    if (fullChanceItems.includes(itemName)) {
      return { chance: categoryChance * 1.0, ratio: "1/1" };
    } else if (halfChanceItems.includes(itemName)) {
      return { chance: categoryChance * 0.5, ratio: "1/2" };
    }
  } else if (craftType === "Weapon") {
    const fullChanceItems = [
      "Dagger", "Crusader Sword", "Double Battle Axe", "Uchigatana", 
      "Falchion", "Ironhand", "Great Sword"
    ];
    
    const halfChanceItems = ["Long Sword", "Cutlass"];
    const quarterChanceItems = ["Gladius Dagger", "Scythe", "Tachi", "Rapier", "Relevator", "Hammer"];
    const eighthChanceItems = ["Skull Crusher"];
    const sixteenthChanceItems = ["Hook", "Chaos", "Dragon Slayer"];
    
    if (fullChanceItems.includes(itemName)) {
      return { chance: categoryChance * 1.0, ratio: "1/1" };
    } else if (halfChanceItems.includes(itemName)) {
      return { chance: categoryChance * 0.5, ratio: "1/2" };
    } else if (quarterChanceItems.includes(itemName)) {
      return { chance: categoryChance * 0.25, ratio: "1/4" };
    } else if (eighthChanceItems.includes(itemName)) {
      return { chance: categoryChance * 0.125, ratio: "1/8" };
    } else if (sixteenthChanceItems.includes(itemName)) {
      return { chance: categoryChance * 0.0625, ratio: "1/16" };
    }
  }
  
  return { chance: 0, ratio: "0/0" };
}

function getPossibleItemImagesWithChances(categoryName: string, categoryChance: number, craftType: "Weapon" | "Armor"): Array<{image: string, ratio: string, name: string, chance: number, categoryKey: string}> {
  if (craftType === "Weapon") {
    const weaponByCategory = getWeaponItemsByCategory();
    const allItems = Object.values(weaponByCategory).flat();
    const categoryItems = allItems.filter(item => item.categoryKey === categoryName);
    
    return categoryItems.map(item => {
      const { chance, ratio } = getItemChance(item.name, item.categoryKey, categoryChance, "Weapon");
      return {
        image: item.image,
        ratio: ratio,
        name: item.name,
        chance: chance,
        categoryKey: item.categoryKey
      };
    });
  } else {
    const armorByCategory = getArmorItemsByCategory();
    const allItems = Object.values(armorByCategory).flat();
    const categoryItems = allItems.filter(item => item.categoryKey === categoryName);
    
    return categoryItems.map(item => {
      const { chance, ratio } = getItemChance(item.name, item.categoryKey, categoryChance, "Armor");
      return {
        image: item.image,
        ratio: ratio,
        name: item.name,
        chance: chance,
        categoryKey: item.categoryKey
      };
    });
  }
}

function getItemImageByName(itemName: string, craftType: "Weapon" | "Armor"): string | null {
  if (craftType === "Weapon") {
    const weaponByCategory = getWeaponItemsByCategory();
    const allItems = Object.values(weaponByCategory).flat();
    const item = allItems.find(i => i.name === itemName);
    return item?.image || null;
  } else {
    const armorByCategory = getArmorItemsByCategory();
    const allItems = Object.values(armorByCategory).flat();
    const item = allItems.find(i => i.name === itemName);
    return item?.image || null;
  }
}

function calculateMasterworkPrice(itemName: string, multiplier: number, craftType: "Weapon" | "Armor"): number | null {
  const priceData = craftType === "Weapon" ? forgeData.weapons : forgeData.armor;
  const basePrice = priceData[itemName];
  
  if (!basePrice) return null;
  
  const priceWithMultiplier = basePrice * multiplier;
  const finalPrice = priceWithMultiplier;
  
  return finalPrice;
}

function calculateMasterworkStat(itemName: string, multiplier: number, craftType: "Weapon" | "Armor"): number | null {
  const statsData = craftType === "Weapon" ? forgeData.weaponStats : forgeData.armorStats;
  if (!statsData) return null;
  
  const baseStat = statsData[itemName];
  if (baseStat === undefined) return null;
  
  const finalStat = (baseStat * multiplier) * 2;
  return finalStat;
}

// --- Components ---

const RarityColors: Record<string, string> = {
    "Common": "border-slate-400 text-slate-300",
    "Uncommon": "border-green-400 text-green-300",
    "Rare": "border-blue-400 text-blue-300",
    "Epic": "border-purple-400 text-purple-300",
    "Legendary": "border-yellow-400 text-yellow-300",
    "Mythical": "border-red-400 text-red-300",
    "Divine": "border-pink-400 text-pink-300",
    "Unknown": "border-gray-600 text-gray-400"
};

const RarityBg: Record<string, string> = {
    "Common": "bg-slate-500/10",
    "Uncommon": "bg-green-500/10",
    "Rare": "bg-blue-500/10",
    "Epic": "bg-purple-500/10",
    "Legendary": "bg-yellow-500/10",
    "Mythical": "bg-red-500/10",
    "Divine": "bg-pink-500/10",
    "Unknown": "bg-gray-800/20"
};

const WEAPON_TYPES = [
    "Dagger", "Straight Sword", "Gauntlet", "Katana", "Great Sword", "Great Axe", "Colossal Sword"
];

const ARMOR_TYPES = [
    "Light Helmet", "Light Leggings", "Light Chestplate",
    "Medium Helmet", "Medium Leggings", "Medium Chestplate",
    "Heavy Helmet", "Heavy Leggings", "Heavy Chestplate"
];

// Translations
const translations = {
  th: {
    forgeChances: "เปอร์เซ็นต์ของแต่ละไอเทม ✨",
    selectOres: "เลือกแร่ที่ต้องการวิเคราะห์ 💎",
    multiplier: "ค่าตัวคูณ 📈",
    predictedItem: "รายการไอเทมที่คาดว่าจะได้รับ 🛡️",
    activeTraits: "คุณสมบัติพิเศษที่ได้ ⭐",
    weapon: "อาวุธ ⚔️",
    armor: "ชุดเกราะ 🛡️",
    clear: "ล้างข้อมูลทั้งหมด 🗑️",
    searchOres: "ค้นหาแร่... 🔎",
    empty: "ว่างเปล่า ⬜",
    damage: "ค่าความเสียหายโดยประมาณ (Damage) 💥",
    defense: "ค่าการป้องกันโดยประมาณ (Defense) 🛡️",
    price: "ราคา / มูลค่า โดยประมาณ 💰",
    backToHome: "กลับสู่หน้าหลัก 🏠",
    favoriteOres: "แร่ที่ชื่นชอบ ❤️",
    addToFavorites: "เพิ่มในรายการแร่ที่ชื่นชอบ ➕",
    removeFromFavorites: "ลบออกจากรายการแร่ที่ชื่นชอบ ➖",
    savedBuilds: "โครงสร้างที่บันทึกไว้ 📂",
    saveBuild: "บันทึกโครงสร้างนี้ 💾",
    compareBuilds: "เปรียบเทียบโครงสร้าง ⚖️",
    buildName: "ชื่อโครงสร้าง 📜",
    save: "บันทึก ✅",
    cancel: "ยกเลิก ❌",
    noBuildsSaved: "ไม่มีโครงสร้างที่ถูกบันทึกไว้ 😔",
    selectToCompare: "เลือกโครงสร้างเพื่อทำการเปรียบเทียบ ➡️",
    comparing: "กำลังเปรียบเทียบ 🔄",
    stopComparing: "ยุติการเปรียบเทียบ 🛑",
    composition: "องค์ประกอบของแร่ 🧱",
    loadBuild: "โหลดโครงสร้างนี้ 📥",
    chance: "โอกาส 🍀",
    traits: "คุณสมบัติพิเศษ ✨",
    
    // Weapon types
    "Dagger": "มีดสั้น 🗡️",
    "Straight Sword": "ดาบตรง 🗡️",
    "Gauntlet": "สนับมือ/ถุงมือ 🥊",
    "Katana": "ดาบคาตานะ 🗡️",
    "Great Sword": "ดาบใหญ่ 🗡️",
    "Great Axe": "ขวานใหญ่ 🪓",
    "Colossal Sword": "ดาบยักษ์ ⚔️",
    
    // Armor types
    "Light Helmet": "เกราะศีรษะแบบเบา ⛑️",
    "Light Leggings": "เกราะขาแบบเบา 👖",
    "Light Chestplate": "เกราะอกแบบเบา 👕",
    "Medium Helmet": "เกราะศีรษะแบบกลาง ⛑️",
    "Medium Leggings": "เกราะขาแบบกลาง 👖",
    "Medium Chestplate": "เกราะอกแบบกลาง 🧥",
    "Heavy Helmet": "เกราะศีรษะแบบหนัก 👑",
    "Heavy Leggings": "เกราะขาแบบหนัก 🛡️",
    "Heavy Chestplate": "เกราะอกแบบหนัก 🛡️",
    
    // Trait descriptions
    "💪 Extra defense on Armor": "💪 เพิ่มเกราะ (สูงสุด 30%)",
    "15% poison for 5s when below 35% HP": "สร้างความเสียหายพิษ 15% ศัตรูเดินหนี เป็นเวลา 5 วินาที ทำให้ศัตรูหวาดกลัว มีคูลดาวน์ 15 วินาที และจะทำงานเมื่อพลังชีวิตต่ำกว่า 15%",
    "🟢 15% Poison Damage when Below 35% HP": "🟢 ความเสียหายพิษเมื่อพลังชีวิตต่ำกว่า 35% ศัตรูเดินหนี เป็นเวลา 5 วินาที มีคูลดาวน์ 15 วินาที (สูงสุด 15%)",
    "💥 Crit Chance on Weapons": "💥 โอกาสคริติคอลของอาวุธ (สูงสุด 20%)",
    "⚡ max HP AOE Damage on Armor": "⚡ ความเสียหาย AOE สูงสุดของ HP บนเกราะ (สูงสุด 5%)",
    "⚔️ Weapon Damage": "⚔️ ความเสียหายของอาวุธ (สูงสุด 15%)",
    "❤️ Health": "❤️ ลดชีวิต (สูงสุด -10%)",
    "🔥 Burn Damage on Weapons with": "🔥 ความเสียหายเผาไหม้บนอาวุธ (สูงสุด 20%)",
    "🎯 chance": "🎯 โอกาส (สูงสุด 30-35%)",
    "💣 AOE Explosion on Weapons with": "💣 ความเสียหายระเบิด AOE บนอาวุธ (สูงสุด 50%)",
    "⚡ Bonus Movement Speed": "⚡ ความเร็วการเคลื่อนที่เพิ่มเติม (สูงสุด 15%)",
    "🔥 to Burn Enemy when Damage is Taken.": "🔥 เผาศัตรูเมื่อได้รับความเสียหาย (สูงสุด 25%)",
    "🏃 Chance to Dodge Damage (Negate Fully)": "🏃 โอกาสในการหลีกเลี่ยงความเสียหาย (สูงสุด 15%)",
    "maxStatLabel": "ค่าสูงสุด",
    "maxObtained": "ได้รับ:",
    "maxObtainedLabel": "ได้รับ",
  },
  en: {
    forgeChances: "Forge Chances",
    selectOres: "Select Ores",
    multiplier: "Multiplier",
    predictedItem: "Predicted Item",
    activeTraits: "Active Traits",
    weapon: "Weapon",
    armor: "Armor",
    clear: "Clear",
    searchOres: "Search ores...",
    empty: "Empty",
    damage: "Damage",
    defense: "Defense",
    price: "Price",
    backToHome: "Back to Home",
    favoriteOres: "Favorite Ores",
    addToFavorites: "Add to Favorites",
    removeFromFavorites: "Remove from Favorites",
    savedBuilds: "Saved Builds",
    saveBuild: "Save Build",
    compareBuilds: "Compare Builds",
    buildName: "Build Name",
    save: "Save",
    cancel: "Cancel",
    noBuildsSaved: "No builds saved yet",
    selectToCompare: "Select to Compare",
    comparing: "Comparing",
    stopComparing: "Stop Comparing",
    composition: "Composition",
    // Keep English names as is
    "Dagger": "Dagger",
    "Straight Sword": "Straight Sword",
    "Gauntlet": "Gauntlet",
    "Katana": "Katana",
    "Great Sword": "Great Sword",
    "Great Axe": "Great Axe",
    "Colossal Sword": "Colossal Sword",
    "Light Helmet": "Light Helmet",
    "Light Leggings": "Light Leggings",
    "Light Chestplate": "Light Chestplate",
    "Medium Helmet": "Medium Helmet",
    "Medium Leggings": "Medium Leggings",
    "Medium Chestplate": "Medium Chestplate",
    "Heavy Helmet": "Heavy Helmet",
    "Heavy Leggings": "Heavy Leggings",
    "Heavy Chestplate": "Heavy Chestplate",
    
    // Trait descriptions
    "💪 Extra defense on Armor": "💪 Extra defense on Armor (Max 15)",
    "🟢 Poison Damage when Below 35% HP": "🟢 Poison Damage when Below 35% HP (Max 15%)",
    "💥 Crit Chance on Weapons": "💥 Crit Chance on Weapons (Max 20%)",
    "⚡ max HP AOE Damage on Armor": "⚡ max HP AOE Damage on Armor (Max 5%)",
    "⚔️ Weapon Damage": "⚔️ Weapon Damage (Max 15)",
    "❤️ Health": "❤️ Reduces Health (Max -10%)",
    "🔥 Burn Damage on Weapons with": "🔥 Burn Damage on Weapons (Max 20%)",
    "🎯 chance": "🎯 Chance (Max 30-35%)",
    "💣 AOE Explosion on Weapons with": "💣 AOE Explosion Damage on Weapons (Max 50%)",
    "⚡ Bonus Movement Speed": "⚡ Bonus Movement Speed (Max 15%)",
    "🔥 to Burn Enemy when Damage is Taken.": "🔥 Burn Enemy when Damage is Taken (Max 25%)",
    "🏃 Chance to Dodge Damage (Negate Fully)": "🏃 Chance to Dodge Damage (Max 15%)",
    "maxStatLabel": "Max Value",
    "maxObtained": "Obtained:",
    "maxObtainedLabel": "Obtained",
  }
};

const SlotButton = memo(({ slot, index, onRemoveOne, onRemoveAll, isMobile = false }: { slot: SlotItem | null, index: number, onRemoveOne: (i: number) => void, onRemoveAll: (i: number) => void, isMobile?: boolean }) => {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  if (!slot) {
    return (
      <button className={`relative border-2 border-dashed border-zinc-700/50 bg-zinc-900/30 rounded-xl backdrop-blur-sm ${
        isMobile ? 'w-full aspect-square' : 'w-20 h-20 sm:w-24 sm:h-24'
      } flex items-center justify-center group hover:border-zinc-600/50 transition-all`}>
        <span className="text-zinc-600 text-xs font-mali">ว่าง</span>
      </button>
    );
  }

  const oreImage = getOreImagePath(slot.name);
  
  const handlePointerDown = () => {
    holdTimeoutRef.current = setTimeout(() => {
      setIsHolding(true);
      setProgress(0);
      
      const startTime = Date.now();
      const duration = 750;
      
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min(elapsed / duration, 1);
        setProgress(newProgress);
        
        if (newProgress >= 1) {
          if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
          setIsHolding(false);
          setProgress(0);
          onRemoveAll(index);
        }
      }, 16);
    }, 150);
  };

  const handlePointerUp = () => {
    if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    
    if (!isHolding && progress === 0) {
      onRemoveOne(index);
    }
    
    setIsHolding(false);
    setProgress(0);
  };

  return (
    <button
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className={`relative border-2 ${RarityColors[ores[slot.name].rarity]} ${RarityBg[ores[slot.name].rarity]} rounded-xl backdrop-blur-sm ${
        isMobile ? 'w-full aspect-square' : 'w-20 h-20 sm:w-24 sm:h-24'
      } flex flex-col items-start justify-start p-2 group hover:brightness-125 transition-all overflow-hidden cursor-pointer`}
    >
      {oreImage && (
        <div className="absolute inset-0 opacity-60">
          <Image src={oreImage} alt={slot.name} fill className="object-cover" />
        </div>
      )}
      
      <span className="relative z-10 text-white text-[8px] sm:text-[9px] font-mali font-semibold leading-tight drop-shadow-lg">
        {slot.name}
      </span>
      <span className="absolute bottom-1 right-1 z-10 text-white font-mali font-bold text-sm sm:text-base drop-shadow-lg">
        ×{slot.count}
      </span>
      
      {isHolding && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
          <div className="relative w-12 h-12">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
              <circle 
                cx="24" cy="24" r="20" fill="none" stroke="white" strokeWidth="3"
                strokeDasharray={`${progress * 125.6} 125.6`}
                className="transition-all duration-100"
              />
            </svg>
            <TrashIcon className="absolute inset-0 m-auto w-6 h-6 text-white" />
          </div>
        </div>
      )}
    </button>
  );
});

export default function Calculator() {
  const { language } = useLanguage();
  const t = (key: string) => {
    const translationsTyped = translations as any;
    return translationsTyped[language]?.[key] || key;
  };
  
  const [slots, setSlots] = useState<(SlotItem | null)[]>([null, null, null, null]);
  const [craftType, setCraftType] = useState<"Weapon" | "Armor">("Weapon");
  const [searchTerm, setSearchTerm] = useState("");
  const [favoriteOres, setFavoriteOres] = useState<string[]>([]);
  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [buildName, setBuildName] = useState("");
  const [showCompareMode, setShowCompareMode] = useState(false);
  const [selectedBuildsForCompare, setSelectedBuildsForCompare] = useState<string[]>([]);
  const [showBuildInfo, setShowBuildInfo] = useState<string | null>(null);
  
  const isMobile = useIsMobile();

  const loadBuildToCalculator = useCallback((build: SavedBuild) => {
    setSlots([...build.slots]);
    setCraftType(build.craftType);
  }, []);

  // Load favorites and builds from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteOres');
    if (savedFavorites) {
      setFavoriteOres(JSON.parse(savedFavorites));
    }
    
    const savedBuildsData = localStorage.getItem('savedBuilds');
    if (savedBuildsData) {
      setSavedBuilds(JSON.parse(savedBuildsData));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favoriteOres', JSON.stringify(favoriteOres));
  }, [favoriteOres]);

  // Save builds to localStorage
  useEffect(() => {
    localStorage.setItem('savedBuilds', JSON.stringify(savedBuilds));
  }, [savedBuilds]);

  const filteredOreNames = useMemo(() => {
    const names = Object.keys(ores).filter(name => {
      if (!name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      return getOreImagePath(name) !== null;
    });
    
    // Sort: favorites first, then by multiplier
    return names.sort((a, b) => {
      const aFav = favoriteOres.includes(a);
      const bFav = favoriteOres.includes(b);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      
      const diff = ores[b].multiplier - ores[a].multiplier;
      return diff !== 0 ? diff : a.localeCompare(b);
    });
  }, [searchTerm, favoriteOres]);

  const results = useMemo(() => {
    const selected: Record<string, number> = {};
    let count = 0;
    slots.forEach(slot => {
        if (slot) {
            selected[slot.name] = (selected[slot.name] || 0) + slot.count;
            count += slot.count;
        }
    });

    if (count === 0) {
        return null;
    }

    return getItemChancesWithTraits(selected, craftType);
  }, [slots, craftType]);

  const addOreToSlot = useCallback((oreName: string) => {
    setSlots(prev => {
      const existingIndex = prev.findIndex(s => s?.name === oreName);
      
      if (existingIndex !== -1) {
        const newSlots = [...prev];
        const current = newSlots[existingIndex]!;
        newSlots[existingIndex] = { ...current, count: current.count + 1 };
        return newSlots;
      }

      const emptyIndex = prev.findIndex(s => s === null);
      if (emptyIndex !== -1) {
        const newSlots = [...prev];
        newSlots[emptyIndex] = { name: oreName, count: 1 };
        return newSlots;
      }
      return prev;
    });
  }, []);

  const removeOneOreFromSlot = useCallback((index: number) => {
    setSlots(prev => {
      const newSlots = [...prev];
      const slot = newSlots[index];
      if (slot) {
        if (slot.count > 1) {
          newSlots[index] = { ...slot, count: slot.count - 1 };
        } else {
          newSlots[index] = null;
        }
      }
      return newSlots;
    });
  }, []);

  const removeAllOresFromSlot = useCallback((index: number) => {
    setSlots(prev => {
      const newSlots = [...prev];
      newSlots[index] = null;
      return newSlots;
    });
  }, []);

  const clearAll = useCallback(() => {
    setSlots([null, null, null, null]);
  }, []);

  const toggleFavorite = (oreName: string) => {
    setFavoriteOres(prev => {
      if (prev.includes(oreName)) {
        return prev.filter(o => o !== oreName);
      } else {
        return [...prev, oreName];
      }
    });
  };

  const handleSaveBuild = () => {
    if (!buildName.trim() || !results) return;
    
    const currentTypes = craftType === "Weapon" ? WEAPON_TYPES : ARMOR_TYPES;
    const sortedItems = currentTypes
      .map(type => ({ type, pct: results.odds?.[type] || 0 }))
      .sort((a, b) => b.pct - a.pct);
    const predictedItem = sortedItems[0];
    
    const possibleItems = getPossibleItemImagesWithChances(predictedItem.type, predictedItem.pct, craftType);
    const firstItemImage = possibleItems[0]?.image || null;
    
    const newBuild: SavedBuild = {
      id: Date.now().toString(),
      name: buildName,
      craftType,
      slots: [...slots],
      results: JSON.parse(JSON.stringify(results)),
      timestamp: Date.now(),
      predictedItem: predictedItem.type,
      predictedChance: predictedItem.pct,
      multiplier: results.combinedMultiplier,
      imageUrl: firstItemImage || undefined
    };
    
    setSavedBuilds(prev => [newBuild, ...prev]);
    setShowSaveDialog(false);
    setBuildName("");
  };

  const deleteBuild = (id: string) => {
    setSavedBuilds(prev => prev.filter(b => b.id !== id));
    setSelectedBuildsForCompare(prev => prev.filter(bId => bId !== id));
  };

  const toggleCompareSelection = (id: string) => {
    setSelectedBuildsForCompare(prev => {
      if (prev.includes(id)) {
        return prev.filter(bId => bId !== id);
      } else {
        if (prev.length < 4) {
          return [...prev, id];
        }
        return prev;
      }
    });
  };

  const currentTypes = craftType === "Weapon" ? WEAPON_TYPES : ARMOR_TYPES;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100 font-mali relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.05),transparent_50%)]" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
      </div>

      {/* Main Container */}
      <div className="relative z-10 min-h-screen p-4 sm:p-6 max-w-[1800px] mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/"
            className="flex items-center gap-2 text-zinc-400 hover:text-yellow-400 transition-colors group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-semibold">{t('backToHome')}</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCompareMode(!showCompareMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                showCompareMode 
                  ? 'bg-yellow-500 text-black' 
                  : 'bg-zinc-800 text-yellow-400 hover:bg-zinc-700'
              }`}
            >
              <CompareIcon className="w-4 h-4" />
              {showCompareMode ? t('stopComparing') : t('compareBuilds')}
            </button>
            
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-semibold transition-all border border-red-500/30"
            >
              {t('clear')}
            </button>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: Ore Selector - 3 columns */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Search & Type Selector */}
            <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-zinc-800/50 p-4 space-y-3">
              <input
                type="text"
                placeholder={t('searchOres')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-500/50 transition-colors"
              />
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setCraftType('Weapon')}
                  className={`py-2.5 rounded-lg font-semibold text-sm transition-all ${
                    craftType === 'Weapon'
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30'
                      : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700/50'
                  }`}
                >
                  {t('weapon')}
                </button>
                <button
                  onClick={() => setCraftType('Armor')}
                  className={`py-2.5 rounded-lg font-semibold text-sm transition-all ${
                    craftType === 'Armor'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700/50'
                  }`}
                >
                  {t('armor')}
                </button>
              </div>
            </div>

            {/* Favorite Ores */}
            {favoriteOres.length > 0 && (
              <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-yellow-500/20 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <HeartIcon className="w-4 h-4 text-yellow-400" filled />
                  <h3 className="font-bold text-yellow-400 text-sm">{t('favoriteOres')}</h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {favoriteOres.map(oreName => {
                    const data = ores[oreName];
                    const oreImage = getOreImagePath(oreName);
                    return (
                      <button
                        key={oreName}
                        onClick={() => addOreToSlot(oreName)}
                        className={`relative aspect-square border ${RarityColors[data.rarity]} ${RarityBg[data.rarity]} rounded-lg p-1 hover:brightness-125 transition-all group overflow-hidden`}
                      >
                        {oreImage && (
                          <div className="absolute inset-0 opacity-60">
                            <Image src={oreImage} alt={oreName} fill className="object-cover" />
                          </div>
                        )}
                        <span className="relative z-10 text-white text-[7px] font-semibold leading-tight drop-shadow-lg block">
                          {oreName}
                        </span>
                        <span className="absolute bottom-0.5 right-0.5 z-10 text-white font-bold text-[7px] drop-shadow-lg">
                          {data.multiplier}×
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Ores with Traits */}
            {useMemo(() => {
              const traitOres = filteredOreNames.filter(oreName => {
                const data = ores[oreName];
                return data.traits && data.traits.length > 0;
              });
              
              return traitOres.length > 0 ? (
                <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <SparklesIcon className="w-4 h-4 text-purple-400" />
                    <h3 className="font-bold text-purple-300 text-sm">{language === 'th' ? 'แร่ที่มีคุณสมบัติพิเศษ ✨' : 'Ores with Traits ✨'}</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {traitOres.map(oreName => {
                      const data = ores[oreName];
                      const oreImage = getOreImagePath(oreName);
                      const isFavorite = favoriteOres.includes(oreName);
                      
                      return (
                        <div key={oreName} className="relative group">
                          <button
                            onClick={() => addOreToSlot(oreName)}
                            className={`relative w-full aspect-square border-2 ${RarityColors[data.rarity]} ${RarityBg[data.rarity]} rounded-lg p-1 hover:brightness-125 transition-all overflow-visible`}
                          >
                            {oreImage && (
                              <div className="absolute inset-0 opacity-60">
                                <Image src={oreImage} alt={oreName} fill className="object-cover" />
                              </div>
                            )}
                            <span className="relative z-10 text-white text-[7px] font-semibold leading-tight drop-shadow-lg block">
                              {oreName}
                            </span>
                            <span className="absolute bottom-0.5 right-0.5 z-10 text-white font-bold text-[7px] drop-shadow-lg">
                              {data.multiplier}×
                            </span>
                            {/* Trait Badge */}
                            <div className="absolute top-0.5 left-0.5 z-20 bg-purple-500/80 rounded-full w-4 h-4 flex items-center justify-center">
                              <SparklesIcon className="w-2.5 h-2.5 text-white" />
                            </div>
                          </button>
                          
                          {/* Trait Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                            <div className="bg-zinc-900 border border-purple-500/50 rounded-lg p-2 shadow-lg">
                              <div className="text-xs font-bold text-purple-300 mb-1">{language === 'th' ? 'Trait:' : 'Traits:'}</div>
                              {data.traits.map((trait, idx) => (
                                <div key={idx} className="text-[10px] text-purple-200 leading-snug">
                                  • {t(trait.description)}
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => toggleFavorite(oreName)}
                            className="absolute -top-1 -right-1 z-20 w-5 h-5 bg-zinc-900 rounded-full border border-zinc-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <HeartIcon 
                              className={`w-3 h-3 ${isFavorite ? 'text-yellow-400' : 'text-zinc-500'}`} 
                              filled={isFavorite} 
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null;
            }, [filteredOreNames, language, favoriteOres, t])}

            {/* Ore Grid */}
            <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-zinc-800/50 p-4">
              <h3 className="font-bold text-zinc-300 mb-3 text-sm">{t('selectOres')}</h3>
              <div className="grid grid-cols-3 gap-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredOreNames.map(oreName => {
                  const data = ores[oreName];
                  const oreImage = getOreImagePath(oreName);
                  const isFavorite = favoriteOres.includes(oreName);
                  
                  return (
                    <div key={oreName} className="relative group">
                      <button
                        onClick={() => addOreToSlot(oreName)}
                        className={`relative w-full aspect-square border ${RarityColors[data.rarity]} ${RarityBg[data.rarity]} rounded-lg p-1 hover:brightness-125 transition-all overflow-hidden`}
                      >
                        {oreImage && (
                          <div className="absolute inset-0 opacity-60">
                            <Image src={oreImage} alt={oreName} fill className="object-cover" />
                          </div>
                        )}
                        <span className="relative z-10 text-white text-[7px] font-semibold leading-tight drop-shadow-lg block">
                          {oreName}
                        </span>
                        <span className="absolute bottom-0.5 right-0.5 z-10 text-white font-bold text-[9px] drop-shadow-lg">
                          {data.multiplier}×
                        </span>
                      </button>
                      
                      <button
                        onClick={() => toggleFavorite(oreName)}
                        className="absolute -top-1 -right-1 z-20 w-5 h-5 bg-zinc-900 rounded-full border border-zinc-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <HeartIcon 
                          className={`w-3 h-3 ${isFavorite ? 'text-yellow-400' : 'text-zinc-500'}`} 
                          filled={isFavorite} 
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CENTER: Calculator - 6 columns */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Slots & Multiplier */}
            <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/50 backdrop-blur-xl rounded-3xl border border-zinc-800/50 p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-purple-500/5 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {slots.map((slot, idx) => (
                    <SlotButton
                      key={`${idx}-${slot?.name ?? 'empty'}-${slot?.count ?? 0}`}
                      index={idx}
                      slot={slot}
                      onRemoveOne={removeOneOreFromSlot}
                      onRemoveAll={removeAllOresFromSlot}
                      isMobile={isMobile}
                    />
                  ))}
                </div>

                {/* Composition */}
                {results && results.composition && Object.keys(results.composition).length > 0 && (
                  <div className="text-center mb-6">
                    <div className="text-xs text-zinc-500 mb-2 font-semibold">{t('composition')}</div>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {Object.entries(results.composition)
                        .sort((a, b) => (b[1] as number) - (a[1] as number))
                        .map(([oreName, pct], index) => {
                          const pctNum = pct as number;
                          const maxPct = Math.max(...Object.values(results.composition).map(p => p as number));
                          const isHighest = pctNum === maxPct;
                          return (
                            <div
                              key={oreName}
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                isHighest
                                  ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                                  : 'bg-zinc-800/50 text-zinc-400 border border-zinc-700/30'
                              }`}
                            >
                              {oreName} ({pctNum.toFixed(0)}%)
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* Multiplier Display */}
                <div className="text-center">
                  <div className="inline-flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <SparklesIcon className="w-6 h-6 text-yellow-400 mb-2 relative z-10" />
                    <div className="text-sm text-zinc-400 mb-1 relative z-10 font-semibold">{t('multiplier')}</div>
                    <div className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent relative z-10">
                      {results?.combinedMultiplier ? `${results.combinedMultiplier.toFixed(2)}×` : '0.00×'}
                    </div>
                  </div>
                </div>

                {/* Save Build Button */}
                {results && results.odds && Object.keys(results.odds).length > 0 && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setShowSaveDialog(true)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-green-500/30"
                    >
                      <SaveIcon className="w-4 h-4" />
                      {t('saveBuild')}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Predicted Item */}
            {results && results.odds && Object.keys(results.odds).length > 0 && (() => {
              const sortedItems = currentTypes
                .map(type => ({ type, pct: results.odds[type] || 0 }))
                .sort((a, b) => b.pct - a.pct);
              const predictedItem = sortedItems[0];
              const possibleItems = getPossibleItemImagesWithChances(predictedItem.type, predictedItem.pct, craftType);
              
              const stats = possibleItems
                .map(item => calculateMasterworkStat(item.name, results.combinedMultiplier, craftType))
                .filter((stat): stat is number => stat !== null);
              
              let masterworkStat: number | { min: number, max: number } | null = null;
              if (stats.length > 0) {
                if (stats.length === 1) {
                  masterworkStat = stats[0];
                } else {
                  const min = Math.min(...stats);
                  const max = Math.max(...stats);
                  if (Math.abs(min - max) < 0.01) {
                    masterworkStat = min;
                  } else {
                    masterworkStat = { min, max };
                  }
                }
              }
              
              const masterworkPrice = calculateMasterworkPrice(predictedItem.type, results.combinedMultiplier, craftType);
              
              return (
                <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-xl rounded-2xl border-2 border-green-500/30 p-6">
                  <div className="text-center mb-4">
                    <div className="text-xs text-green-400 mb-1 font-semibold uppercase tracking-wider">{t('predictedItem')}</div>
                    <div className="text-2xl font-bold text-green-300 mb-1">
                      {t(predictedItem.type)}
                    </div>
                    <div className="text-sm text-zinc-400">
                      {(predictedItem.pct * 100).toFixed(1)}% {language === 'th' ? 'โอกาส' : 'chance'}
                    </div>
                  </div>
                  
                  {possibleItems.length > 0 && (
                    <div className="flex items-center justify-center gap-3 mb-4">
                      {possibleItems.map((item) => (
                        <div key={item.image} className="flex flex-col items-center group">
                          <div className="relative w-16 h-16 mb-1">
                            <Image src={item.image} alt={item.name} fill className="object-contain opacity-90 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <span className="text-[10px] text-white font-semibold">{item.ratio}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {masterworkPrice !== null && masterworkStat !== null && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className={`p-3 rounded-lg ${craftType === "Weapon" ? 'bg-red-500/10 border border-red-500/30' : 'bg-blue-500/10 border border-blue-500/30'}`}>
                        <div className="text-xs text-zinc-400 mb-1">{t(craftType === "Weapon" ? 'damage' : 'defense')}</div>
                        <div className={`text-xl font-bold ${craftType === "Weapon" ? 'text-red-300' : 'text-blue-300'}`}>
                          {typeof masterworkStat === 'number' 
                            ? (craftType === "Weapon" ? masterworkStat.toFixed(2) : Math.round(masterworkStat).toString())
                            : (craftType === "Weapon" 
                                ? `${masterworkStat.min.toFixed(2)}-${masterworkStat.max.toFixed(2)}`
                                : `${Math.round(masterworkStat.min)}-${Math.round(masterworkStat.max)}`)}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                        <div className="text-xs text-zinc-400 mb-1">{t('price')}</div>
                        <div className="text-xl font-bold text-yellow-300">
                          ${masterworkPrice >= 1000 ? masterworkPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : masterworkPrice.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Active Traits */}
            {results && results.traits && results.traits.length > 0 && (
              <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-3 sm:p-6">
                <h3 className="text-purple-400 font-bold mb-3 sm:mb-4 text-center uppercase tracking-wider text-xs sm:text-sm">
                  {t('activeTraits')}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {results.traits.map((tr: any, idx: number) => (
                    <div key={idx} className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-500/30 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                        <div className="text-purple-300 font-bold text-xs sm:text-sm">{tr.ore}</div>
                      </div>
                      <div className="space-y-2">
                        {tr.lines.map((lineData: any, i: number) => {
                          const oreData = ores[tr.ore];
                          const trait = oreData?.traits?.[i];
                          const maxStat = trait?.maxStat ?? 0;
                          
                          // Handle both string (old format) and object (new format) for backward compatibility
                          const isOldFormat = typeof lineData === 'string';
                          const percentage = isOldFormat ? null : lineData.percentage;
                          const description = isOldFormat ? lineData : lineData.description;
                          const mergedPercentage = isOldFormat ? null : lineData.mergedPercentage;
                          
                          return (
                            <div key={i} className="space-y-1 border-b border-purple-500/15 pb-1.5 last:border-0 last:pb-0">
                              <div className="text-[9px] sm:text-[10px] text-purple-300/80 font-semibold">
                                {language === 'th' ? 'ได้รับ:' : 'Obtained:'}
                              </div>
                              <div className="text-[9px] sm:text-[11px] text-purple-200 font-medium leading-relaxed ml-2">
                                {percentage !== null ? `${percentage}%` : ''} {t(description)}
                                {mergedPercentage !== null ? ` ${mergedPercentage}%` : ''}
                              </div>
                              {maxStat !== 0 && (
                                <div className="text-[8px] sm:text-[10px] text-purple-300/70 flex items-center gap-2 ml-2">
                                  <span className="text-purple-400">{language === 'th' ? 'สูงสุด:' : 'Max:'}</span>
                                  <span className="font-semibold text-purple-400">{Math.abs(maxStat).toFixed(2)}</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Forge Chances OR Saved Builds - 3 columns */}
          <div className="lg:col-span-3 space-y-4">
            
            {showCompareMode ? (
              // Saved Builds for Comparison
              <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-zinc-800/50 p-4 max-h-[800px] overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-zinc-300 text-sm">{t('savedBuilds')}</h3>
                  <span className="text-xs text-zinc-500">{selectedBuildsForCompare.length}/4 {language === 'th' ? 'เลือก' : 'selected'}</span>
                </div>
                
                {savedBuilds.length === 0 ? (
                  <div className="text-center py-12 text-zinc-500">
                    <BookmarkIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">{t('noBuildsSaved')}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savedBuilds.map(build => {
                      const isSelected = selectedBuildsForCompare.includes(build.id);
                      
                      return (
                        <div
                          key={build.id}
                          className={`relative p-3 rounded-lg border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-yellow-500/20 border-yellow-500/50 shadow-lg shadow-yellow-500/20'
                              : 'bg-zinc-800/30 border-zinc-700/50 hover:border-zinc-600/50'
                          }`}
                          onClick={() => toggleCompareSelection(build.id)}
                        >
                          <div className="flex items-start gap-3">
                            {build.imageUrl && (
                              <div className="relative w-12 h-12 flex-shrink-0">
                                <Image src={build.imageUrl} alt={build.name} fill className="object-contain" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-sm text-white mb-1 truncate">{build.name}</div>
                              <div className="text-xs text-zinc-400 mb-1">
                                {t(build.craftType)} • {build.multiplier?.toFixed(2)}×
                              </div>
                              {build.predictedItem && (
                                <div className="text-[10px] text-green-400">
                                  {t(build.predictedItem)} ({(build.predictedChance! * 100).toFixed(1)}% โอกาส)
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-col gap-2 flex-shrink-0">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  loadBuildToCalculator(build);
                                }}
                                className="w-6 h-6 flex items-center justify-center rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-colors text-xs font-bold"
                                title={t('loadBuild')}
                              >
                                ↓
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowBuildInfo(build.id);
                                }}
                                className="w-6 h-6 flex items-center justify-center rounded bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 transition-colors"
                                title="Build Information"
                              >
                                <InfoIcon className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteBuild(build.id);
                                }}
                                className="w-6 h-6 flex items-center justify-center rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                              >
                                <TrashIcon className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              // Forge Chances
              <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-zinc-800/50 p-4 max-h-[800px] overflow-y-auto custom-scrollbar">
                <h3 className="font-bold text-zinc-300 mb-4 text-sm">{t('forgeChances')}</h3>
                
                <div className="space-y-3">
                  {craftType === "Armor" ? (() => {
                    const armorByCategory = getArmorItemsByCategory();
                    const categoryGroups: Record<string, Array<{name: string, image: string, chance: number, ratio: string}>> = {};
                    
                    Object.values(armorByCategory).flat().forEach(item => {
                      const categoryChance = results?.odds?.[item.categoryKey] || 0;
                      const { chance, ratio } = getItemChance(item.name, item.categoryKey, categoryChance, "Armor");
                      
                      if (!categoryGroups[item.categoryKey]) {
                        categoryGroups[item.categoryKey] = [];
                      }
                      
                      categoryGroups[item.categoryKey].push({
                        name: item.name,
                        image: item.image,
                        chance: chance,
                        ratio: ratio
                      });
                    });
                    
                    const sortedCategories = Object.entries(categoryGroups)
                      .map(([categoryKey, items]) => ({
                        categoryKey,
                        categoryChance: results?.odds?.[categoryKey] || 0,
                        items: items.sort((a, b) => b.chance - a.chance)
                      }))
                      .sort((a, b) => b.categoryChance - a.categoryChance);
                    
                    return sortedCategories.map((category) => (
                      <div key={category.categoryKey} className="bg-zinc-800/30 rounded-lg p-3 border border-zinc-700/30">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-zinc-300 text-xs font-semibold">{t(category.categoryKey)}</span>
                          <span className={`text-xs font-bold ${category.categoryChance > 0 ? 'text-green-400' : 'text-zinc-600'}`}>
                            {(category.categoryChance * 100).toFixed(1)}%
                          </span>
                        </div>
                        
                        <div className="flex gap-2 mb-2">
                          {category.items.map((item) => (
                            <div key={item.name} className="flex-1 flex flex-col items-center">
                              <div className="relative w-10 h-10 mb-1">
                                <Image src={item.image} alt={item.name} fill className="object-contain opacity-80" />
                              </div>
                              <span className="text-[8px] text-white">{item.ratio}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="h-1 bg-zinc-700/50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300" 
                            style={{ width: `${category.categoryChance * 100}%` }} 
                          />
                        </div>
                      </div>
                    ));
                  })() : (() => {
                    const weaponByCategory = getWeaponItemsByCategory();
                    const categoryGroups: Record<string, Array<{name: string, image: string, chance: number, ratio: string}>> = {};
                    
                    Object.values(weaponByCategory).flat().forEach(item => {
                      const categoryChance = results?.odds?.[item.categoryKey] || 0;
                      const { chance, ratio } = getItemChance(item.name, item.categoryKey, categoryChance, "Weapon");
                      
                      if (!categoryGroups[item.categoryKey]) {
                        categoryGroups[item.categoryKey] = [];
                      }
                      
                      categoryGroups[item.categoryKey].push({
                        name: item.name,
                        image: item.image,
                        chance: chance,
                        ratio: ratio
                      });
                    });
                    
                    const sortedCategories = Object.entries(categoryGroups)
                      .map(([categoryKey, items]) => ({
                        categoryKey,
                        categoryChance: results?.odds?.[categoryKey] || 0,
                        items: items.sort((a, b) => b.chance - a.chance)
                      }))
                      .sort((a, b) => b.categoryChance - a.categoryChance);
                    
                    return sortedCategories.map((category) => (
                      <div key={category.categoryKey} className="bg-zinc-800/30 rounded-lg p-3 border border-zinc-700/30">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-zinc-300 text-xs font-semibold">{t(category.categoryKey)}</span>
                          <span className={`text-xs font-bold ${category.categoryChance > 0 ? 'text-green-400' : 'text-zinc-600'}`}>
                            {(category.categoryChance * 100).toFixed(1)}%
                          </span>
                        </div>
                        
                        <div className="flex gap-2 mb-2 flex-wrap">
                          {category.items.map((item) => (
                            <div key={item.name} className="flex flex-col items-center">
                              <div className="relative w-10 h-10 mb-1">
                                <Image src={item.image} alt={item.name} fill className="object-contain opacity-80" />
                              </div>
                              <span className="text-[8px] text-white">{item.ratio}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="h-1 bg-zinc-700/50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-300" 
                            style={{ width: `${category.categoryChance * 100}%` }} 
                          />
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Compare View - Full Width Below */}
        {showCompareMode && selectedBuildsForCompare.length > 0 && (
          <div className="mt-6 bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-yellow-500/30 p-6">
            <h2 className="text-xl font-bold text-yellow-400 mb-6 text-center">{t('comparing')} ({selectedBuildsForCompare.length})</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {selectedBuildsForCompare.map(buildId => {
                const build = savedBuilds.find(b => b.id === buildId);
                if (!build) return null;
                
                const possibleItems = build.predictedItem 
                  ? getPossibleItemImagesWithChances(build.predictedItem, build.predictedChance || 0, build.craftType)
                  : [];
                
                return (
                  <div key={build.id} className="bg-zinc-800/50 rounded-xl border border-zinc-700/50 p-4">
                    <div className="text-center mb-4">
                      <h3 className="font-bold text-white mb-2">{build.name}</h3>
                      <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-zinc-700/50 text-zinc-300 mb-2">
                        {t(build.craftType)}
                      </div>
                      
                      {build.imageUrl && (
                        <div className="relative w-20 h-20 mx-auto mb-3">
                          <Image src={build.imageUrl} alt={build.name} fill className="object-contain" />
                        </div>
                      )}
                      
                      {build.predictedItem && (
                        <div className="text-green-400 font-semibold text-sm mb-1">
                          {t(build.predictedItem)}
                        </div>
                      )}
                      {build.predictedChance && (
                        <div className="text-zinc-400 text-xs mb-3">
                          {(build.predictedChance * 100).toFixed(1)}% {language === 'th' ? 'โอกาส' : 'chance'}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2">
                        <div className="text-xs text-zinc-400">{t('multiplier')}</div>
                        <div className="text-lg font-bold text-yellow-300">{build.multiplier?.toFixed(2)}×</div>
                      </div>
                      
                      {/* Ore Composition */}
                      {build.slots.filter(s => s !== null).length > 0 && (
                        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-2">
                          <div className="text-xs text-zinc-400 mb-1.5">{language === 'th' ? 'องค์ประกอบแร่' : 'Ore Composition'}</div>
                          <div className="grid grid-cols-3 gap-1">
                            {build.slots.filter(s => s !== null).map((slot, idx) => {
                              const oreImage = getOreImagePath(slot?.name || '');
                              return (
                                <div key={idx} className="flex flex-col items-center text-center">
                                  {oreImage && (
                                    <div className="relative w-8 h-8 mb-0.5 rounded border border-purple-500/30 bg-zinc-800/30 overflow-hidden">
                                      <Image src={addImageVersion(oreImage)} alt={slot?.name || ''} fill className="object-cover" />
                                    </div>
                                  )}
                                  <div className="text-[8px] text-purple-200 font-semibold leading-tight truncate w-full">×{slot?.count}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
                      {possibleItems.length > 0 && (() => {
                        const stats = possibleItems
                          .map(item => calculateMasterworkStat(item.name, build.multiplier || 0, build.craftType))
                          .filter((stat): stat is number => stat !== null);
                        
                        if (stats.length > 0) {
                          const min = Math.min(...stats);
                          const max = Math.max(...stats);
                          const statDisplay = Math.abs(min - max) < 0.01 
                            ? (build.craftType === "Weapon" ? min.toFixed(2) : Math.round(min).toString())
                            : (build.craftType === "Weapon" 
                                ? `${min.toFixed(2)}-${max.toFixed(2)}`
                                : `${Math.round(min)}-${Math.round(max)}`);
                          
                          return (
                            <div className={`${build.craftType === "Weapon" ? 'bg-red-500/10 border border-red-500/30' : 'bg-blue-500/10 border border-blue-500/30'} rounded-lg p-2`}>
                              <div className="text-xs text-zinc-400">{t(build.craftType === "Weapon" ? 'damage' : 'defense')}</div>
                              <div className={`text-lg font-bold ${build.craftType === "Weapon" ? 'text-red-300' : 'text-blue-300'}`}>
                                {statDisplay}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}
                      
                      {build.results?.traits && build.results.traits.length > 0 && (
                        <div className="bg-gradient-to-br from-purple-500/15 to-purple-600/10 border border-purple-500/40 rounded-lg p-3">
                          <div className="text-xs text-purple-400 font-semibold mb-2 uppercase tracking-wider">{t('traits')}</div>
                          <div className="text-[9px] text-zinc-300 space-y-1.5">
                            {build.results.traits.map((tr: any, idx: number) => (
                              <div key={idx} className="border-l-2 border-purple-500/60 pl-2 py-1">
                                <div className="font-semibold text-purple-300 mb-1.5 text-[8px] uppercase">{tr.ore}</div>
                                {tr.lines && tr.lines.map((lineData: any, lineIdx: number) => {
                                  const oreData = ores[tr.ore];
                                  const trait = oreData?.traits?.[lineIdx];
                                  const maxStat = trait?.maxStat ?? 0;
                                  
                                  // Handle both string (old format) and object (new format) for backward compatibility
                                  const isOldFormat = typeof lineData === 'string';
                                  const percentage = isOldFormat ? null : lineData.percentage;
                                  const description = isOldFormat ? lineData : lineData.description;
                                  const mergedPercentage = isOldFormat ? null : lineData.mergedPercentage;
                                  
                                  return (
                                    <div key={lineIdx} className="space-y-1 text-[8px] mb-1.5 last:mb-0">
                                      <div className="text-purple-300/80 font-semibold">
                                        {language === 'th' ? 'ได้รับ:' : 'Obtained:'}
                                      </div>
                                      <div className="text-zinc-400 leading-snug ml-2">
                                        • {percentage !== null ? `${percentage}%` : ''} {t(description)}
                                        {mergedPercentage !== null ? ` ${mergedPercentage}%` : ''}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Build Info Modal */}
      {showBuildInfo && (() => {
        const build = savedBuilds.find(b => b.id === showBuildInfo);
        if (!build) return null;
        
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl border border-purple-500/30 p-4 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Header */}
              <div className="flex items-start justify-between mb-4 sm:mb-6 gap-2">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-2xl font-bold text-white mb-2 break-words">{build.name}</h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30">
                      {t(build.craftType)}
                    </span>
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                      {build.multiplier?.toFixed(2)}× {language === 'th' ? 'ตัวคูณ' : 'Multiplier'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowBuildInfo(null)}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  <CloseIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Ore Composition */}
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                <h3 className="text-purple-400 font-bold mb-2 sm:mb-3 text-xs sm:text-sm uppercase tracking-wider">
                  {language === 'th' ? 'องค์ประกอบของแร่' : 'Ore Composition'}
                </h3>
                <div className="space-y-1.5">
                  {build.slots.filter(s => s !== null).map((slot, idx) => {
                    const oreImage = getOreImagePath(slot?.name || '');
                    return (
                      <div key={idx} className="flex items-center justify-between text-xs sm:text-sm gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          {oreImage && (
                            <div className="relative w-6 h-6 sm:w-8 sm:h-8 rounded-lg border border-purple-500/30 overflow-hidden bg-zinc-800/50 flex-shrink-0">
                              <Image src={addImageVersion(oreImage)} alt={slot?.name || ''} fill className="object-cover" />
                            </div>
                          )}
                          <span className="text-zinc-300 font-medium truncate">{slot?.name}</span>
                        </div>
                        <span className="text-purple-400 font-bold flex-shrink-0">×{slot?.count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Predicted Item */}
              {build.predictedItem && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-900/30 rounded-lg border border-green-500/30">
                  <h3 className="text-green-400 font-bold mb-2 sm:mb-3 text-xs sm:text-sm uppercase tracking-wider">
                    {language === 'th' ? 'ไอเทมที่คาดว่าจะได้' : 'Predicted Item'}
                  </h3>
                  
                  {/* Item Images */}
                  {(() => {
                    const possibleItems = getPossibleItemImagesWithChances(build.predictedItem, build.predictedChance || 0, build.craftType);
                    if (possibleItems.length > 0) {
                      return (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-3">
                          {possibleItems.map((item) => (
                            <div key={item.image} className="flex flex-col items-center bg-zinc-800/30 rounded-lg p-2 border border-green-500/20">
                              <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-1">
                                <Image src={item.image} alt={item.name} fill className="object-contain" />
                              </div>
                              <span className="text-[10px] sm:text-xs text-white font-semibold text-center">{item.name}</span>
                              <span className="text-[9px] text-green-400 font-bold">{item.ratio}</span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  })()}
                  
                  {/* Item Info */}
                  <div className="flex justify-between items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2 min-w-0">
                      {(() => {
                        const itemImage = getItemImageByName(build.predictedItem, build.craftType);
                        if (itemImage) {
                          return (
                            <div className="relative w-8 h-8 sm:w-12 sm:h-12 rounded-lg border border-green-500/30 overflow-hidden bg-zinc-800/50 flex-shrink-0">
                              <Image src={addImageVersion(itemImage)} alt={build.predictedItem} fill className="object-contain p-1" />
                            </div>
                          );
                        }
                        return null;
                      })()}
                      <span className="text-white font-semibold text-xs sm:text-base truncate">{t(build.predictedItem)}</span>
                    </div>
                    <span className="text-green-400 font-bold text-xs sm:text-sm flex-shrink-0">{(build.predictedChance! * 100).toFixed(1)}% {language === 'th' ? 'โอกาส' : 'Chance'}</span>
                  </div>
                </div>
              )}

              {/* Traits */}
              {build.results?.traits && build.results.traits.length > 0 && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-lg border border-purple-500/30">
                  <h3 className="text-purple-400 font-bold mb-3 text-xs sm:text-sm uppercase tracking-wider">
                    {t('activeTraits')}
                  </h3>
                  <div className="space-y-3">
                    {build.results.traits.map((tr: any, idx: number) => (
                      <div key={idx} className="space-y-2 pb-3 border-b border-purple-500/20 last:border-0 last:pb-0">
                        <div className="font-bold text-purple-300 text-xs sm:text-base">{tr.ore}</div>
                        <div className="space-y-1 sm:space-y-2 ml-2">
                          {tr.lines && tr.lines.map((lineData: any, lineIdx: number) => {
                            const oreData = ores[tr.ore];
                            const trait = oreData?.traits?.[lineIdx];
                            const maxStat = trait?.maxStat ?? 0;
                            
                            // Handle both string (old format) and object (new format) for backward compatibility
                            const isOldFormat = typeof lineData === 'string';
                            const percentage = isOldFormat ? null : lineData.percentage;
                            const description = isOldFormat ? lineData : lineData.description;
                            const mergedPercentage = isOldFormat ? null : lineData.mergedPercentage;
                            
                            return (
                              <div key={lineIdx} className="space-y-0.5">
                                <div className="text-xs sm:text-sm text-purple-300/80 font-semibold">
                                  {language === 'th' ? 'ได้รับ:' : 'Obtained:'}
                                </div>
                                <div className="text-purple-200 text-xs sm:text-sm font-medium">
                                  {percentage !== null ? `${percentage}%` : ''} {t(description)}
                                  {mergedPercentage !== null ? ` ${mergedPercentage}%` : ''}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-zinc-700">
                <button
                  onClick={() => {
                    loadBuildToCalculator(build);
                    setShowBuildInfo(null);
                  }}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg font-semibold transition-all text-xs sm:text-base"
                >
                  {language === 'th' ? 'โหลดโครงสร้าง' : 'Load Build'}
                </button>
                <button
                  onClick={() => setShowBuildInfo(null)}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg font-semibold transition-colors text-xs sm:text-base"
                >
                  {t('cancel')}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Save Dialog Modal */}
      {showSaveDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-700 p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">{t('saveBuild')}</h3>
            <input
              type="text"
              value={buildName}
              onChange={(e) => setBuildName(e.target.value)}
              placeholder={t('buildName')}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-500 mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setBuildName("");
                }}
                className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg font-semibold transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleSaveBuild}
                disabled={!buildName.trim()}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('save')}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 215, 0, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 215, 0, 0.5);
        }
      `}</style>
    </div>
  );
}
