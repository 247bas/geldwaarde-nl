#!/usr/bin/env node

/**
 * Münzen Database Update Script
 * 
 * Dit script leest coins-database.json en update automatisch:
 * 1. /app/page.tsx (calculator data)
 * 2. /app/nl/[slug]/page.tsx (gedetailleerde pagina's)
 * 3. /app/nl/gouden-munten/page.tsx (gouden munten overzicht)
 * 4. /app/nl/zilveren-munten/page.tsx (zilveren munten overzicht)
 * 
 * Gebruik: node update-coins.js
 */

const fs = require('fs');
const path = require('path');

console.log('🪙 Geldwaarde.nl - Munten Database Update');
console.log('=======================================');

// Lees de database
let coinsDatabase;
try {
  const dbPath = path.join(__dirname, 'coins-database.json');
  console.log(`📖 Database laden: ${dbPath}`);
  coinsDatabase = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  console.log(`✅ Database geladen: ${Object.keys(coinsDatabase.coins).length} munten`);
} catch (error) {
  console.error('❌ Fout bij laden database:', error.message);
  process.exit(1);
}

// Validatie functie
function validateCoin(slug, coin) {
  const errors = [];
  
  if (!coin.id) errors.push('Ontbrekende id');
  if (!coin.name) errors.push('Ontbrekende name');
  if (!coin.slug) errors.push('Ontbrekende slug');
  if (!['GOLD', 'SILVER'].includes(coin.metalType)) errors.push('Ongeldige metalType (moet GOLD of SILVER zijn)');
  if (!coin.variants || coin.variants.length === 0) errors.push('Geen variants gedefinieerd');
  
  // Valideer variants
  coin.variants?.forEach((variant, idx) => {
    if (!variant.id) errors.push(`Variant ${idx}: ontbrekende id`);
    if (!variant.name) errors.push(`Variant ${idx}: ontbrekende name`);
    if (!variant.weight || variant.weight <= 0) errors.push(`Variant ${idx}: ongeldig gewicht`);
    
    if (coin.metalType === 'GOLD' && (!variant.goldPercentage || variant.goldPercentage <= 0)) {
      errors.push(`Variant ${idx}: ontbrekend/ongeldig goldPercentage`);
    }
    if (coin.metalType === 'SILVER' && (!variant.silverPercentage || variant.silverPercentage <= 0)) {
      errors.push(`Variant ${idx}: ontbrekend/ongeldig silverPercentage`);
    }
    
    // Valideer optionele collectorsValueRange
    if (variant.collectorsValueRange) {
      if (typeof variant.collectorsValueRange !== 'object' ||
          typeof variant.collectorsValueRange.min !== 'number' ||
          typeof variant.collectorsValueRange.max !== 'number' ||
          variant.collectorsValueRange.min <= 0 ||
          variant.collectorsValueRange.max <= 0 ||
          variant.collectorsValueRange.min > variant.collectorsValueRange.max) {
        errors.push(`Variant ${idx}: ongeldige collectorsValueRange (moet object zijn met min/max getallen, min <= max)`);
      }
    }
  });
  
  return errors;
}

// Valideer alle munten
console.log('🔍 Database validatie...');
let hasErrors = false;
Object.entries(coinsDatabase.coins).forEach(([slug, coin]) => {
  const errors = validateCoin(slug, coin);
  if (errors.length > 0) {
    console.error(`❌ Fouten in munt '${slug}':`);
    errors.forEach(error => console.error(`   - ${error}`));
    hasErrors = true;
  }
});

if (hasErrors) {
  console.error('❌ Validatie gefaald. Los fouten op voor update.');
  process.exit(1);
}

console.log('✅ Database validatie geslaagd');

// Helper functions
function generateCalculatorData() {
  const mockCoins = [];
  const mockVariants = {};
  
  Object.entries(coinsDatabase.coins).forEach(([slug, coin]) => {
    mockCoins.push({
      id: coin.id,
      name: coin.name,
      slug: coin.slug,
      metalType: coin.metalType
    });
    
    mockVariants[coin.id] = coin.variants.map(variant => ({
      id: variant.id,
      years: variant.years,
      name: variant.name,
      weight: variant.weight,
      ...(coin.metalType === 'GOLD' ? { goldPercentage: variant.goldPercentage } : { silverPercentage: variant.silverPercentage }),
      ...(variant.collectorsValueRange && { collectorsValueRange: variant.collectorsValueRange })
    }));
  });
  
  return { mockCoins, mockVariants };
}

function generateDetailedPageData() {
  const mockCoinsData = {};
  
  Object.entries(coinsDatabase.coins).forEach(([slug, coin]) => {
    mockCoinsData[slug] = {
      id: coin.id,
      name: coin.name,
      metalType: coin.metalType,
      images: coin.images,
      seoContent: coin.seoContent,
      variants: coin.variants.map(variant => ({
        id: variant.id,
        years: variant.years,
        name: variant.name,
        weight: variant.weight,
        ...(coin.metalType === 'GOLD' ? { goldPercentage: variant.goldPercentage } : { silverPercentage: variant.silverPercentage }),
        ...(variant.collectorsValueRange && { collectorsValueRange: variant.collectorsValueRange })
      }))
    };
  });
  
  return mockCoinsData;
}

function generateOverviewData(metalType) {
  const coinsData = [];
  
  Object.entries(coinsDatabase.coins)
    .filter(([slug, coin]) => coin.metalType === metalType)
    .forEach(([slug, coin]) => {
      coinsData.push({
        slug: coin.slug,
        name: coin.name,
        years: coin.overviewData.years,
        weight: coin.overviewData.weight,
        [`${metalType.toLowerCase()}Content`]: coin.overviewData.metalContent,
        description: coin.overviewData.description
      });
    });
  
  return coinsData;
}

// Update bestanden
console.log('🔄 Bestanden bijwerken...');

// 1. Update /app/page.tsx
try {
  const pageFile = path.join(__dirname, 'app/page.tsx');
  let pageContent = fs.readFileSync(pageFile, 'utf8');
  
  const { mockCoins, mockVariants } = generateCalculatorData();
  
  // Replace mockCoins array
  const mockCoinsStr = JSON.stringify(mockCoins, null, 2)
    .replace(/"/g, "'")
    .replace(/'GOLD'/g, "'GOLD' as const")
    .replace(/'SILVER'/g, "'SILVER' as const");
  
  pageContent = pageContent.replace(
    /const mockCoins = \[[\s\S]*?\];/,
    `const mockCoins = ${mockCoinsStr};`
  );
  
  // Replace mockVariants object
  const mockVariantsStr = JSON.stringify(mockVariants, null, 2).replace(/"/g, "'");
  pageContent = pageContent.replace(
    /const mockVariants: Record<string, any\[\]> = \{[\s\S]*?\};/,
    `const mockVariants: Record<string, any[]> = ${mockVariantsStr};`
  );
  
  fs.writeFileSync(pageFile, pageContent);
  console.log('✅ /app/page.tsx bijgewerkt');
} catch (error) {
  console.error('❌ Fout bij bijwerken /app/page.tsx:', error.message);
}

// 2. Update /app/nl/[slug]/page.tsx
try {
  const slugPageFile = path.join(__dirname, 'app/nl/[slug]/page.tsx');
  let slugPageContent = fs.readFileSync(slugPageFile, 'utf8');
  
  const mockCoinsData = generateDetailedPageData();
  const mockCoinsDataStr = JSON.stringify(mockCoinsData, null, 2).replace(/"/g, "'");
  
  slugPageContent = slugPageContent.replace(
    /const mockCoinsData: Record<string, any> = \{[\s\S]*?\};/,
    `const mockCoinsData: Record<string, any> = ${mockCoinsDataStr};`
  );
  
  fs.writeFileSync(slugPageFile, slugPageContent);
  console.log('✅ /app/nl/[slug]/page.tsx bijgewerkt');
} catch (error) {
  console.error('❌ Fout bij bijwerken /app/nl/[slug]/page.tsx:', error.message);
}

// 3. Update /app/gouden-munten/page.tsx
try {
  const goldenCoinsFile = path.join(__dirname, 'app/gouden-munten/page.tsx');
  let goldenCoinsContent = fs.readFileSync(goldenCoinsFile, 'utf8');
  
  const goldenCoinsData = generateOverviewData('GOLD');
  const goldenCoinsDataStr = JSON.stringify(goldenCoinsData, null, 2).replace(/"/g, "'");
  
  goldenCoinsContent = goldenCoinsContent.replace(
    /const goldenCoinsData = \[[\s\S]*?\];/,
    `const goldenCoinsData = ${goldenCoinsDataStr};`
  );
  
  fs.writeFileSync(goldenCoinsFile, goldenCoinsContent);
  console.log('✅ /app/gouden-munten/page.tsx bijgewerkt');
} catch (error) {
  console.error('❌ Fout bij bijwerken /app/gouden-munten/page.tsx:', error.message);
}

// 4. Update /app/zilveren-munten/page.tsx
try {
  const silverCoinsFile = path.join(__dirname, 'app/zilveren-munten/page.tsx');
  let silverCoinsContent = fs.readFileSync(silverCoinsFile, 'utf8');
  
  const silverCoinsData = generateOverviewData('SILVER');
  const silverCoinsDataStr = JSON.stringify(silverCoinsData, null, 2).replace(/"/g, "'");
  
  silverCoinsContent = silverCoinsContent.replace(
    /const silverCoinsData = \[[\s\S]*?\];/,
    `const silverCoinsData = ${silverCoinsDataStr};`
  );
  
  fs.writeFileSync(silverCoinsFile, silverCoinsContent);
  console.log('✅ /app/zilveren-munten/page.tsx bijgewerkt');
} catch (error) {
  console.error('❌ Fout bij bijwerken /app/zilveren-munten/page.tsx:', error.message);
}

// Statistieken
const goldCoins = Object.values(coinsDatabase.coins).filter(coin => coin.metalType === 'GOLD');
const silverCoins = Object.values(coinsDatabase.coins).filter(coin => coin.metalType === 'SILVER');
const totalVariants = Object.values(coinsDatabase.coins).reduce((sum, coin) => sum + coin.variants.length, 0);

console.log('');
console.log('📊 Update Statistieken:');
console.log(`   🥇 Gouden munten: ${goldCoins.length}`);
console.log(`   🥈 Zilveren munten: ${silverCoins.length}`);
console.log(`   📋 Totaal varianten: ${totalVariants}`);
console.log(`   📅 Database versie: ${coinsDatabase.version}`);
console.log(`   📆 Laatst bijgewerkt: ${coinsDatabase.lastUpdated}`);
console.log('');
console.log('🎉 Alle bestanden succesvol bijgewerkt!');
console.log('');
console.log('💡 Volgende stappen:');
console.log('   1. Start de dev server: npm run dev');
console.log('   2. Test de calculator op http://localhost:5173');
console.log('   3. Controleer individuele muntpagina\'s');
console.log('   4. Verifieer overzichtpagina\'s');
console.log('');
console.log('⚠️  Let op: Herstart de dev server als deze al draait!');