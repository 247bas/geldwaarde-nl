const fs = require('fs');
const path = require('path');

// Read existing database
const existingDb = JSON.parse(fs.readFileSync(path.join(__dirname, 'coins-database.json')));
const newCoins = JSON.parse(fs.readFileSync(path.join(__dirname, 'munten-processed.json')));

// Helper function to generate SEO content
function generateSeoContent(coin) {
  const isGold = coin.metalType === 'GOLD';
  const metalName = isGold ? 'goud' : 'zilver';
  const currentYear = new Date().getFullYear();
  
  // Get year range from variants
  const years = coin.variants.map(v => v.years).filter(Boolean).join(', ');
  const rulers = [...new Set(coin.variants.map(v => v.ruler).filter(Boolean))].join(', ');
  const avgWeight = coin.variants.reduce((sum, v) => sum + v.weight, 0) / coin.variants.length;
  const avgMetalContent = coin.variants.reduce((sum, v) => sum + v.metalPercentage, 0) / coin.variants.length;
  
  return {
    metaTitle: `${coin.name} Waarde ${currentYear} - Actuele ${isGold ? 'Goud' : 'Zilver'}prijs Calculator | Geldwaarde.nl`,
    metaDescription: `Bereken direct de waarde van uw ${coin.name.toLowerCase()}. ${rulers}. Actuele ${metalName}prijs. ${avgWeight.toFixed(2)} gram, ${avgMetalContent.toFixed(1)}% ${metalName}gehalte.`,
    h1Title: `${coin.name}: Actuele Waarde en Informatie`,
    introText: `De ${coin.name.toLowerCase()} is een ${isGold ? 'gouden' : 'zilveren'} munt uit de Nederlandse muntgeschiedenis. Deze munten werden geslagen onder ${rulers} en bevatten gemiddeld ${(avgWeight * avgMetalContent / 100).toFixed(3)} gram puur ${metalName}.`,
    historicalInfo: `${coin.name} munten werden uitgegeven onder verschillende vorsten: ${rulers}. De munten hebben een gemiddeld gewicht van ${avgWeight.toFixed(2)} gram met een ${metalName}gehalte van ${avgMetalContent.toFixed(1)}%.`,
    technicalInfo: `Gewicht: ${avgWeight.toFixed(2)} gram | ${isGold ? 'Goud' : 'Zilver'}gehalte: ${avgMetalContent.toFixed(1)}% | Fijn ${metalName}: ${(avgWeight * avgMetalContent / 100).toFixed(3)} gram`,
    collectingTips: `Let bij aankoop op de staat van de munt en het jaar van uitgifte. Zeldzame jaren en onbeschadigde exemplaren hebben een hogere verzamelaarswaarde dan alleen de ${metalName}waarde.`
  };
}

// Merge new coins into existing structure
const mergedCoins = { ...existingDb.coins };

newCoins.coins.forEach(coin => {
  // Skip if already exists (like gouden-tientje)
  if (mergedCoins[coin.slug] && coin.slug === 'gouden-10-gulden') {
    console.log(`Skipping ${coin.slug} - already exists as gouden-tientje`);
    return;
  }
  
  // Create coin entry
  const coinEntry = {
    id: coin.id,
    name: coin.name,
    slug: coin.slug,
    metalType: coin.metalType,
    denomination: coin.denomination,
    images: {
      main: `/images/coins/${coin.slug}-main.jpg`,
      variants: coin.variants.map((v, idx) => ({
        id: `${coin.id}-${idx + 1}`,
        ruler: v.ruler,
        images: {
          front: `/images/coins/${coin.slug}-${v.ruler.toLowerCase().replace(/\s+/g, '-')}-voorkant.jpg`,
          back: `/images/coins/${coin.slug}-${v.ruler.toLowerCase().replace(/\s+/g, '-')}-achterkant.jpg`
        }
      }))
    },
    seoContent: generateSeoContent(coin),
    overviewData: {
      years: coin.variants.map(v => v.years).filter(Boolean).join(', '),
      weight: coin.variants[0]?.weight || 0,
      metalContent: coin.variants[0]?.metalPercentage || 0,
      description: `${coin.name} uit de Nederlandse muntgeschiedenis`
    },
    variants: coin.variants.map((v, idx) => ({
      id: `${coin.id}-${idx + 1}`,
      years: v.years,
      name: v.ruler,
      rulerPeriod: v.rulerPeriod,
      weight: v.weight,
      goldPercentage: coin.metalType === 'GOLD' ? v.metalPercentage : undefined,
      silverPercentage: coin.metalType === 'SILVER' ? v.metalPercentage : undefined,
      diameter: v.diameter,
      collectorsValueRange: {
        min: Math.round(v.weight * v.metalPercentage / 100 * (coin.metalType === 'GOLD' ? 75 : 35) * 1.2),
        max: Math.round(v.weight * v.metalPercentage / 100 * (coin.metalType === 'GOLD' ? 75 : 35) * 2)
      }
    }))
  };
  
  mergedCoins[coin.slug] = coinEntry;
  console.log(`✅ Added: ${coin.name}`);
});

// Create final database
const finalDatabase = {
  version: '2.0.0',
  lastUpdated: new Date().toISOString().split('T')[0],
  coins: mergedCoins
};

// Save the merged database
fs.writeFileSync(
  path.join(__dirname, 'coins-database-updated.json'),
  JSON.stringify(finalDatabase, null, 2)
);

console.log('\n✅ Database merged and saved to coins-database-updated.json');
console.log(`Total coins in database: ${Object.keys(mergedCoins).length}`);