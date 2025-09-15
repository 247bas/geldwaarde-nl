const fs = require('fs');
const path = require('path');

// Read the raw data
const rawData = JSON.parse(fs.readFileSync(path.join(__dirname, 'munten-data-raw.json')));

// Skip header row
const dataRows = rawData.slice(1);

// Process the data
const processedCoins = {};
const uniqueCoins = new Set();

dataRows.forEach(row => {
  if (!row[0]) return; // Skip empty rows
  
  const [muntType, regeerder, regeerperiode, gehalte, metaalType, gewicht, doorsnede, muntjaren] = row;
  
  // Create slug for the coin type
  const metalPrefix = metaalType?.toLowerCase() === 'goud' ? 'gouden' : 'zilveren';
  const coinName = muntType.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/,/g, '-')
    .replace(/\./g, '-');
  const slug = `${metalPrefix}-${coinName}`;
  
  // Initialize coin if not exists
  if (!processedCoins[slug]) {
    processedCoins[slug] = {
      id: `${metalPrefix}-${coinName}`,
      name: `${metaalType === 'Goud' ? 'Gouden' : 'Zilveren'} ${muntType}`,
      slug: slug,
      metalType: metaalType?.toUpperCase() === 'GOUD' ? 'GOLD' : 'SILVER',
      denomination: muntType,
      variants: []
    };
    uniqueCoins.add(slug);
  }
  
  // Parse weight (handle comma as decimal separator)
  let weightValue = 0;
  if (gewicht) {
    weightValue = typeof gewicht === 'string' 
      ? parseFloat(gewicht.replace(',', '.'))
      : gewicht;
  }
  
  // Parse metal percentage
  let metalPercentage = 0;
  if (gehalte) {
    // Convert from xxx/1000 to percentage
    metalPercentage = (gehalte / 1000) * 100;
  }
  
  // Add variant
  const variant = {
    ruler: regeerder || '',
    rulerPeriod: regeerperiode || '',
    years: muntjaren ? muntjaren.toString() : '',
    weight: weightValue,
    metalPercentage: Math.round(metalPercentage * 10) / 10, // Round to 1 decimal
    diameter: doorsnede || null,
    metalContent: gehalte || 0
  };
  
  processedCoins[slug].variants.push(variant);
});

// Sort coins and create final structure
const sortedCoins = Object.values(processedCoins).sort((a, b) => {
  // Sort by metal type first (gold first), then by name
  if (a.metalType !== b.metalType) {
    return a.metalType === 'GOLD' ? -1 : 1;
  }
  return a.name.localeCompare(b.name);
});

// Create summary
console.log('\n=== PROCESSED COINS SUMMARY ===');
console.log(`Total unique coins: ${uniqueCoins.size}`);
console.log('\nGouden munten:');
sortedCoins.filter(c => c.metalType === 'GOLD').forEach(c => {
  console.log(`- ${c.name} (${c.variants.length} varianten)`);
});
console.log('\nZilveren munten:');
sortedCoins.filter(c => c.metalType === 'SILVER').forEach(c => {
  console.log(`- ${c.name} (${c.variants.length} varianten)`);
});

// Save processed data
const outputData = {
  version: '2.0.0',
  lastUpdated: new Date().toISOString().split('T')[0],
  coins: sortedCoins
};

fs.writeFileSync(
  path.join(__dirname, 'munten-processed.json'),
  JSON.stringify(outputData, null, 2)
);

console.log('\n✅ Data processed and saved to munten-processed.json');