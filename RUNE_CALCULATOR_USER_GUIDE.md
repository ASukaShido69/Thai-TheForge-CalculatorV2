# Rune Calculator - User Guide

## ภาษาไทย 🇹🇭

### วิธีใช้งาน Rune Calculator

#### 1. เปิด Rune Calculator
- หาปุ่มม่วง-ชมพู ที่มุมขวาล่างของหน้าจอ
- คลิกปุ่ม Sparkles เพื่อเปิด/ปิด Rune Calculator Panel

#### 2. เลือกเรูน
- ดูรูปภาพเรูนทั้งหมด
- คลิกที่เรูนที่คุณต้องการ
- เรูนที่เลือกจะมีกรอบสีม่วง

#### 3. แก้ไขคุณสมบัติ (Traits)
สำหรับแต่ละ trait:
- **Slider**: ลาก slider เพื่อปรับค่า
- **Input Box**: พิมพ์ค่าตรง
- **Progress Bar**: มองเห็นค่าปัจจุบันเทียบกับค่าสูงสุด
- ทุก trait มี description เพื่ออธิบายการใช้งาน

#### 4. บันทึก Build
- กดปุ่ม "บันทึก Build"
- ตั้งชื่อ build ที่คุณต้องการ
- กดปุ่ม "บันทึก" เพื่อบันทึก

#### 5. ดูเรูนที่บันทึกไว้
- ไปที่ tab "เรูนที่บันทึก"
- ดูรายการ builds ที่บันทึกทั้งหมด
- ปุ่ม "โหลด": นำ build กลับมาแก้ไข
- ปุ่ม "ข้อมูล": ดูรายละเอียด
- ปุ่ม "ลบ": ลบ build

#### 6. ใช้เรูนกับ Ore
- โหลด rune build
- เลือก ores ที่ต้องการ
- ในหน้า Build Info จะแสดง Rune Traits ด้วย
- ดูการเปรียบเทียบระหว่าง Ore Traits และ Rune Traits

### เคล็ดลับ 💡

1. **บันทึกข้อมูลอัตโนมัติ**: ระบบจะบันทึกข้อมูลของคุณโดยอัตโนมัติ
2. **ไม่มี Rune ก็ได้**: ถ้าไม่เลือก rune ก็จะไม่แสดง rune traits ในผลลัพธ์
3. **รูปภาพเรูน**: ชื่อเรูนจะโหลดจากโฟลเดอร์ `/public/rune/` ตามชื่อในข้อมูล

### ข้อมูลต่างๆของ Traits

- **Luck**: เพิ่มโอกาสการได้ของแบบทั่วไป
- **Yield**: โอกาส drop ไอเทมพิเศษ
- **Swift Mining**: ความเร็วในการขุด
- **Mine Power**: ความแรงของการขุด
- และอื่น ๆ

---

## English 🇺🇸

### How to Use Rune Calculator

#### 1. Open Rune Calculator
- Look for the purple-pink button at the bottom-right corner
- Click the Sparkles icon to open/close the Rune Calculator Panel

#### 2. Select a Rune
- View all available runes with images
- Click on the rune you want to select
- Selected rune will have a purple border

#### 3. Edit Traits
For each trait:
- **Slider**: Drag the slider to adjust value
- **Input Box**: Type value directly
- **Progress Bar**: See current value compared to max
- Each trait has a description explaining its effect

#### 4. Save Build
- Click "Save Rune Build" button
- Enter a name for your build
- Click "Save" to confirm

#### 5. View Saved Runes
- Go to "Saved Runes" tab
- See all your saved builds
- "Load" button: Load build to edit
- "Info" button: View details
- "Delete" button: Remove build

#### 6. Use with Ore
- Load a rune build
- Select ores you want
- In Build Info page, rune traits will be displayed
- Compare ore traits with rune traits

### Tips 💡

1. **Auto Save**: Your data is automatically saved
2. **Optional Rune**: You don't need to select a rune
3. **Rune Images**: Loaded from `/public/rune/` folder

### Trait Information

- **Luck**: Increases overall luck
- **Yield**: Chance to drop extra ore
- **Swift Mining**: Faster mining speed
- **Mine Power**: Extra mine damage
- And more...

---

## ข้อมูล Traits

### Rune Types & Traits

#### Miner Shard (เรูนแร่)
- **Luck**: Overall luck increase (5%-16%)
- **Yield**: Chance to drop 1 extra ore (3%-10%)
- **Swift Mining**: Faster mining (4%-12%)
- **Mine Power**: Extra mine damage (8%-15%)

#### Frost Speck (เรูนน้ำแข็ง)
- **Ice**: Freezes enemies for short duration

#### Flame Spark (เรูนไฟ)
- **Burn**: Deals fire damage per second
  - Damage: 5%-10%
  - Duration: 1-2 seconds
  - Proc Chance: 15%-25%

#### Venom Crumb (เรูนพิษ)
- **Poison**: Deals poison damage over time

#### Chill Dust (เรูนความหนาว)
- **Snow**: Slows enemy movement and attack speed

#### Blast Chip (เรูนระเบิด)
- **Explosion**: AOE explosion damage
  - Damage: 20%-40%
  - Proc Chance: 8%-20%

#### Drain Edge (เรูนดูดเลือด)
- **Heal**: Heals percentage of physical damage (5%-13%)

#### Briar Notch (เรูนหนาม)
- **Thorns**: Reflects physical damage (2%-10%)

#### Rage Mark (เรูนความโกรธ)
- **Berserk**: Boosts damage & speed when health < 35%
  - Boost: 12%-26%
  - Duration: 4-7 seconds
  - Cooldown: 50-60 seconds

#### Ward Patch (เรูนป้องกัน)
- **Shield**: Reduces incoming damage (6%-14%)

#### Rot Stitch (เรูนสงคราม)
- **Toxic Veins**: Poisons around user when health < 35%

---

## Keyboard Shortcuts

- **Escape**: Close Rune Calculator panel (ปิด Rune Calculator)

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari

## Troubleshooting

### ปัญหา: ข้อมูลไม่ถูกบันทึก
**วิธีแก้**: ลบ localStorage แล้วรีโหลดหน้า
```javascript
localStorage.clear();
location.reload();
```

### ปัญหา: รูปเรูนไม่แสดง
**วิธีแก้**: ตรวจสอบว่าไฟล์อยู่ใน `/public/rune/` และชื่อตรงกัน

### Problem: Traits values reset
**Solution**: Ensure JavaScript is enabled in browser

---

## Version Information

- **Version**: 1.0.0
- **Release Date**: December 6, 2025
- **Supported Languages**: Thai, English

For more technical details, see `RUNE_CALCULATOR_DOCUMENTATION.md`
