const fs = require('fs');
const path = require('path');

// Read database
const dbPath = path.join(__dirname, 'coins-database.json');
const database = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Period updates based on extracted data
const periodUpdates = {
  'gouden-tientje': '1818-1933',
  'gouden-vijfje': '1826-1912', 
  'gouden-gulden': '2001',
  'gouden-twintig-gulden': '1848-1853',
  'gouden-dukaat': '1814-2012',
  'gouden-dubbele-dukaat': '1854-2012'
};

console.log('Updating overviewData periods for golden coins:\n');

Object.keys(periodUpdates).forEach(coinSlug => {
  const coin = database.coins[coinSlug];
  if (coin && coin.overviewData) {
    const oldPeriod = coin.overviewData.years;
    const newPeriod = periodUpdates[coinSlug];
    
    coin.overviewData.years = newPeriod;
    
    console.log(`${coin.name}: ${oldPeriod} → ${newPeriod}`);
  }
});

// Save updated database
fs.writeFileSync(dbPath, JSON.stringify(database, null, 2));

console.log('\n✅ Database updated successfully!');