# Rune Calculator Feature Documentation

## Overview
ฟีเจอร์ Rune Calculator ได้ถูกเพิ่มลงในโปรเจกต์ The Forge Calculator ตามข้อมูลจำเพาะที่ร้องขอ

## ไฟล์ที่เพิ่มและแก้ไข

### 1. **ไฟล์ใหม่: `src/components/RuneCalculator.tsx`**
- คอมโพเนนต์ Rune Calculator แบบ Modal
- ตำแหน่ง: ปุ่มลอยที่มุมขวาล่างของหน้าจอ (Fixed Position)
- ไอคอน: Sparkles สีม่วง-ชมพู

### 2. **ไฟล์แก้ไข: `src/app/calculator/page.tsx`**
- เพิ่ม import สำหรับ `RuneCalculator` component
- เพิ่ม type `RuneState` สำหรับจัดการ rune data
- เพิ่ม state `selectedRune` ในการจัดการ rune state
- เพิ่มฟีลด์ `runeState` ใน SavedBuild type
- อัปเดต `handleSaveBuild` เพื่อบันทึก rune state
- เพิ่มการแสดงผล Rune Traits ในส่วน Build Info Modal
- เรียกใช้ RuneCalculator component ที่ส่วนท้ายของหน้า

## ฟีเจอร์หลัก

### 1. Rune Calculator Panel (โปนเน็ลเรูนคำนวน)
**ตำแหน่ง**: ปุ่มลอยมุมขวาล่างของหน้าจอ

**ปุ่ม Floating Button**:
- ไอคอน: Sparkles สีม่วง-ชมพู
- ฟังก์ชัน: เปิด/ปิด Rune Calculator Panel

### 2. Rune Selection (เลือกเรูน)
- แสดงรูปภาพ rune ทั้งหมดจากโฟลเดอร์ `/public/rune/`
- รูปภาพจะโหลดตามชื่อ rune ใน JSON data
- ตัวอย่าง: "Miner Shard" → `MinerShard.png`
- หน้า grid layout ให้ป้องกันการเลือก runes หลาย ๆ ตัว

### 3. Edit Traits (แก้ไข Traits)
ตัวอักษรที่เลือกของ rune แต่ละตัวจะแสดงการแก้ไข traits:
- **Slider**: ปรับค่า traits ได้อย่างราบรื่น
- **Input Box**: ใส่ค่าโดยตรง
- **Progress Bar**: แสดงค่าปัจจุบันเทียบกับค่าสูงสุด
- **Max Value Display**: แสดงค่าสูงสุด
- **Description**: แสดงรายละเอียดของ trait

### 4. Save Rune Build (บันทึก Build)
- ปุ่ม "Save Rune": บันทึก rune configuration
- Dialog: ตั้งชื่อ rune build
- ข้อมูลการบันทึก:
  - Rune ID
  - Trait values
  - Timestamp

### 5. Saved Runes Management (จัดการเรูนที่บันทึก)
**แสดงรายการ runes ที่บันทึก** พร้อมปุ่ม:
- **Load**: โหลด rune build กลับมาแก้ไข
- **Info**: ดูรายละเอียด (ส่วนนี้เป็นฟีเจอร์ถัดไป)
- **Delete**: ลบ rune build

### 6. Rune Info Display (ข้อมูลเรูน)
- แสดง rune name, creation date
- แสดง trait values ทั้งหมด
- มี progress bar แสดงค่า

## Integration with Ore Comparison

### ในหน้า Build Info Modal:
1. **Ore Traits** - แสดงคุณสมบัติแร่ที่ได้
2. **Rune Traits** (ใหม่) - แสดงคุณสมบัติเรูนหากเลือก
   - ถ้าไม่เลือก rune ก็จะไม่แสดง
   - แสดงทุก trait ที่ถูกแก้ไข
   - มี UI พิเศษสีม่วง-ชมพู

## Data Storage

### LocalStorage Keys:
- `savedRunes`: เก็บ rune builds ที่บันทึกไว้

### Data Structure:
```typescript
type RuneState = {
  runeId: string;           // ID ของ rune
  traitValues: Record<string, number>; // ค่า traits
};

type SavedRune = {
  id: string;
  name: string;
  runeState: RuneState;
  timestamp: number;
};
```

## Language Support

### Supported Languages:
- **Thai (ไทย)** - แสดง UI ในภาษาไทยทั้งหมด
- **English** - แสดง UI ในภาษาอังกฤษ

### Translation Keys:
- `rune.calculator` - ชื่อ Rune Calculator
- `rune.selectRune` - เลือกเรูน
- `rune.editTraits` - แก้ไข Traits
- `rune.save` - บันทึก
- `rune.savedRunes` - เรูนที่บันทึก
- `rune.maxValue` - ค่าสูงสุด
- And more...

## UI/UX Features

### Visual Design:
- **Color Scheme**: ม่วง-ชมพู สำหรับ rune, สีเหลือง-ทอง สำหรับ ore
- **Responsive Design**: รองรับทั้ง Mobile และ Desktop
- **Animations**: มี hover effects และ transitions
- **Icons**: ใช้ SVG icons ที่กำหนดเอง

### Interactive Elements:
- Floating button ที่ drag-friendly
- Modal ที่ modal scrollable
- Tab switching (Rune Calculator / Saved Runes)
- Progress bars สำหรับ visual feedback

## Usage Flow

1. **เลือก Rune**
   - คลิกปุ่ม Sparkles ที่มุมขวาล่าง
   - เลือก rune จากรูปภาพ

2. **แก้ไข Traits**
   - ใช้ slider หรือ input box เพื่อปรับค่า
   - ดูอัปเดต values แบบ real-time

3. **บันทึก Build**
   - กดปุ่ม "Save Rune"
   - ตั้งชื่อ rune build
   - กดปุ่ม "Save"

4. **โหลด Build**
   - ไปที่ tab "Saved Runes"
   - กดปุ่ม "Load" เพื่อนำ rune กลับมา
   - ข้อมูลจะถูกแสดงในการเปรียบเทียบกับ Ore

5. **ส่วนการเปรียบเทียบ**
   - Build Info จะแสดง Rune Traits
   - ถ้าไม่มี rune ก็จะไม่แสดง rune section

## Installation & Setup

### Files Modified:
1. `src/components/RuneCalculator.tsx` - ไฟล์ใหม่
2. `src/app/calculator/page.tsx` - แก้ไข

### Dependencies:
- React 19.0.0
- Next.js 15.0.0
- Tailwind CSS 3.4.15
- ไม่มี package ใหม่เพิ่มเติม

### Build Command:
```bash
npm run build
```

### Development Command:
```bash
npm run dev
```

## Notes & Tips

1. **Rune Images**: ตรวจสอบว่าไฟล์รูป rune อยู่ใน `/public/rune/` และชื่อตรงกับ mapping ใน component

2. **Data Persistence**: ข้อมูลทั้งหมด (favorites, builds, runes) จะถูกบันทึกใน localStorage โดยอัตโนมัติ

3. **Multi-Language**: ระบบสนับสนุนการสลับภาษาแบบ dynamic โดยใช้ LanguageContext

4. **Responsive**: UI ทั้งหมด optimized สำหรับ mobile และ desktop

## Future Enhancements

- Export rune builds as JSON
- Share rune builds via URL
- Rune combination calculator
- Rune set recommendations
- Advanced filtering & search

---
**Version**: 1.0.0  
**Last Updated**: December 6, 2025
