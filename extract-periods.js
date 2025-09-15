const fs = require('fs');
const path = require('path');

// Read database
const dbPath = path.join(__dirname, 'coins-database.json');
const database = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const goldenCoins = [
  'gouden-tientje',
  'gouden-vijfje', 
  'gouden-gulden',
  'gouden-twintig-gulden',
  'gouden-dukaat',
  'gouden-dubbele-dukaat'
];

console.log('Extracting period information for golden coins:\n');

goldenCoins.forEach(coinSlug => {
  const coin = database.coins[coinSlug];
  if (coin && coin.variants) {
    console.log(`\n--- ${coin.name} ---`);
    
    // Extract all individual years from all variants
    const allYears = [];
    
    coin.variants.forEach(variant => {
      if (variant.years) {
        console.log(`Variant: ${variant.name} - ${variant.years}`);
        
        // Parse years (handle ranges and individual years)
        const yearStr = variant.years;
        if (yearStr.includes('-')) {
          // Handle ranges like "1818-1840" or "1826-1827"
          const ranges = yearStr.split(',').map(s => s.trim());
          ranges.forEach(range => {
            if (range.includes('-')) {
              const [start, end] = range.split('-').map(s => parseInt(s.trim()));
              if (!isNaN(start)) allYears.push(start);
              if (!isNaN(end)) allYears.push(end);
            } else {
              const year = parseInt(range);
              if (!isNaN(year)) allYears.push(year);
            }
          });
        } else {
          // Handle individual years
          const years = yearStr.split(',').map(s => s.trim());
          years.forEach(yearStr => {
            const year = parseInt(yearStr);
            if (!isNaN(year)) allYears.push(year);
          });
        }
      }
    });
    
    if (allYears.length > 0) {
      const minYear = Math.min(...allYears);
      const maxYear = Math.max(...allYears);
      console.log(`\n=> Full Period: ${minYear}-${maxYear}`);
    }
  }
});