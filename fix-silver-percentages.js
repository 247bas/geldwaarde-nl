const fs = require('fs');

// Lees de database
const database = JSON.parse(fs.readFileSync('coins-database.json', 'utf8'));

console.log('Fixing silver percentages to 1 decimal place...\n');

let changesCount = 0;

// Functie om getal naar 1 decimaal te formatteren
function formatToOneDecimal(number) {
  return parseFloat(number.toFixed(1));
}

// Loop door alle munten
Object.keys(database.coins).forEach(coinKey => {
  const coin = database.coins[coinKey];
  
  // Skip gouden munten
  if (coin.metalType === 'GOLD') return;
  
  console.log(`Checking ${coin.name}...`);
  
  // Fix overviewData metalContent
  if (coin.overviewData && coin.overviewData.metalContent !== undefined) {
    const oldValue = coin.overviewData.metalContent;
    const newValue = formatToOneDecimal(oldValue);
    // Always update to ensure 1 decimal format
    coin.overviewData.metalContent = newValue;
    if (oldValue !== newValue) {
      console.log(`  ✅ Overview: ${oldValue}% → ${newValue}%`);
      changesCount++;
    }
  }
  
  // Fix variants silverPercentage
  if (coin.variants) {
    coin.variants.forEach((variant, index) => {
      if (variant.silverPercentage !== undefined) {
        const oldValue = variant.silverPercentage;
        const newValue = formatToOneDecimal(oldValue);
        // Always update to ensure 1 decimal format
        variant.silverPercentage = newValue;
        if (oldValue !== newValue) {
          console.log(`  ✅ Variant ${index + 1}: ${oldValue}% → ${newValue}%`);
          changesCount++;
        }
      }
    });
  }
});

// Update seoContent en technicalInfo waar nodig
Object.keys(database.coins).forEach(coinKey => {
  const coin = database.coins[coinKey];
  
  // Skip gouden munten
  if (coin.metalType === 'GOLD') return;
  
  if (coin.seoContent) {
    // Update metaDescription
    if (coin.seoContent.metaDescription) {
      const originalDesc = coin.seoContent.metaDescription;
      const updatedDesc = originalDesc.replace(/(\d+(?:\.\d+)?)% zilvergehalte/g, (match, percentage) => {
        const formatted = formatToOneDecimal(parseFloat(percentage));
        return `${formatted}% zilvergehalte`;
      });
      if (originalDesc !== updatedDesc) {
        coin.seoContent.metaDescription = updatedDesc;
        console.log(`  ✅ Meta description updated`);
        changesCount++;
      }
    }
    
    // Update historicalInfo
    if (coin.seoContent.historicalInfo) {
      const originalInfo = coin.seoContent.historicalInfo;
      const updatedInfo = originalInfo.replace(/zilvergehalte van (\d+(?:\.\d+)?)%/g, (match, percentage) => {
        const formatted = formatToOneDecimal(parseFloat(percentage));
        return `zilvergehalte van ${formatted}%`;
      });
      if (originalInfo !== updatedInfo) {
        coin.seoContent.historicalInfo = updatedInfo;
        console.log(`  ✅ Historical info updated`);
        changesCount++;
      }
    }
    
    // Update technicalInfo
    if (coin.seoContent.technicalInfo) {
      const originalTech = coin.seoContent.technicalInfo;
      const updatedTech = originalTech.replace(/Zilvergehalte: (\d+(?:\.\d+)?)%/g, (match, percentage) => {
        const formatted = formatToOneDecimal(parseFloat(percentage));
        return `Zilvergehalte: ${formatted}%`;
      });
      if (originalTech !== updatedTech) {
        coin.seoContent.technicalInfo = updatedTech;
        console.log(`  ✅ Technical info updated`);
        changesCount++;
      }
    }
  }
});

// Schrijf de bijgewerkte database terug
fs.writeFileSync('coins-database.json', JSON.stringify(database, null, 2));

console.log(`\n✅ Database updated! Made ${changesCount} changes.`);
console.log('All silver percentages now use 1 decimal place format.');