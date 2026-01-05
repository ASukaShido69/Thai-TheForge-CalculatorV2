const fs = require('fs');
const path = require('path');

// Load weaponOdds
const oddsPath = path.join(__dirname, 'src/data/weaponOdds.json');
const odds = JSON.parse(fs.readFileSync(oddsPath, 'utf8'));

// For each tier, add Mace
Object.keys(odds).forEach(tier => {
    const ssOdd = odds[tier]['Straight Sword'] || 0;
    const gauntletOdd = odds[tier]['Gauntlet'] || 0;
    
    // Mace is average of these two
    const maceOdd = parseFloat(((ssOdd + gauntletOdd) / 2).toFixed(2));
    
    // Reduce Straight Sword and Gauntlet
    if (ssOdd > 0 || gauntletOdd > 0) {
        const reduction = maceOdd / 2;
        odds[tier]['Straight Sword'] = Math.max(0, parseFloat((ssOdd - reduction).toFixed(2)));
        odds[tier]['Gauntlet'] = Math.max(0, parseFloat((gauntletOdd - reduction).toFixed(2)));
    }
    
    odds[tier]['Mace'] = maceOdd;
    
    // Reorder keys to maintain order
    const ordered = {};
    const keyOrder = ["Dagger", "Straight Sword", "Gauntlet", "Mace", "Katana", "Great Sword", "Great Axe", "Colossal Sword"];
    keyOrder.forEach(key => {
        if (key in odds[tier]) {
            ordered[key] = odds[tier][key];
        }
    });
    
    odds[tier] = ordered;
});

// Write back
fs.writeFileSync(oddsPath, JSON.stringify(odds, null, 4));

console.log('✅ Mace odds added successfully!');
console.log('\nSample output for tier 9:');
console.log(JSON.stringify(odds["9"], null, 2));
