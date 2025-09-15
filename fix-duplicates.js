const fs = require('fs');
const path = require('path');

// Read current database
const dbPath = path.join(__dirname, 'coins-database.json');
const database = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log('🔧 Fixing duplicate golden coins...\n');

// 1. Replace gouden-tientje with gouden-10-gulden data (keep original slug)
if (database.coins['gouden-10-gulden']) {
  const newTientjeData = { ...database.coins['gouden-10-gulden'] };
  // Keep the original slug and ID for URL consistency
  newTientjeData.slug = 'gouden-tientje';
  newTientjeData.id = 'gouden-tientje';
  newTientjeData.name = 'Gouden Tientje';
  
  // Update image paths to use original tientje paths
  if (newTientjeData.images && newTientjeData.images.variants) {
    newTientjeData.images.main = '/images/coins/gouden-tientje-main.jpg';
    newTientjeData.images.variants = newTientjeData.images.variants.map((variant, index) => {
      const rulers = ['willem1', 'willem2', 'willem3', 'wilhelmina'];
      const ruler = rulers[index] || `variant${index + 1}`;
      return {
        ...variant,
        images: {
          front: `/images/coins/gouden-tientje-${ruler}-voorkant.jpg`,
          back: `/images/coins/gouden-tientje-${ruler}-achterkant.jpg`
        }
      };
    });
  }
  
  // Update variant IDs to match original pattern
  if (newTientjeData.variants) {
    newTientjeData.variants = newTientjeData.variants.map((variant, index) => ({
      ...variant,
      id: `gouden-tientje-${index + 1}`
    }));
  }
  
  database.coins['gouden-tientje'] = newTientjeData;
  console.log('✅ Updated gouden-tientje with complete data from gouden-10-gulden');
}

// 2. Replace gouden-vijfje with gouden-5-gulden data (keep original slug)
if (database.coins['gouden-5-gulden']) {
  const newVijfjeData = { ...database.coins['gouden-5-gulden'] };
  // Keep the original slug and ID for URL consistency
  newVijfjeData.slug = 'gouden-vijfje';
  newVijfjeData.id = 'gouden-vijfje';
  newVijfjeData.name = 'Gouden Vijfje';
  
  // Update image paths to use original vijfje paths
  if (newVijfjeData.images && newVijfjeData.images.variants) {
    newVijfjeData.images.main = '/images/coins/gouden-vijfje-main.jpg';
    newVijfjeData.images.variants = newVijfjeData.images.variants.map((variant, index) => {
      const rulers = ['willem1', 'willem2', 'willem3', 'wilhelmina'];
      const ruler = rulers[index] || `variant${index + 1}`;
      return {
        ...variant,
        images: {
          front: `/images/coins/gouden-vijfje-${ruler}-voorkant.jpg`,
          back: `/images/coins/gouden-vijfje-${ruler}-achterkant.jpg`
        }
      };
    });
  }
  
  // Update variant IDs to match original pattern
  if (newVijfjeData.variants) {
    newVijfjeData.variants = newVijfjeData.variants.map((variant, index) => ({
      ...variant,
      id: `gouden-vijfje-${index + 1}`
    }));
  }
  
  database.coins['gouden-vijfje'] = newVijfjeData;
  console.log('✅ Updated gouden-vijfje with complete data from gouden-5-gulden');
}

// 3. Remove duplicate entries
if (database.coins['gouden-10-gulden']) {
  delete database.coins['gouden-10-gulden'];
  console.log('🗑️ Removed duplicate gouden-10-gulden entry');
}

if (database.coins['gouden-5-gulden']) {
  delete database.coins['gouden-5-gulden'];
  console.log('🗑️ Removed duplicate gouden-5-gulden entry');
}

// Update version and timestamp
database.version = '2.1.0';
database.lastUpdated = new Date().toISOString().split('T')[0];

// Save updated database
fs.writeFileSync(dbPath, JSON.stringify(database, null, 2));

console.log('\n✅ Database successfully updated!');
console.log(`📊 Total coins in database: ${Object.keys(database.coins).length}`);
console.log('\n🔍 Checking results...');

// Verify the changes
const updatedDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const tientje = updatedDb.coins['gouden-tientje'];
const vijfje = updatedDb.coins['gouden-vijfje'];

if (tientje && tientje.variants && tientje.variants.length > 1) {
  console.log(`✅ Gouden Tientje now has ${tientje.variants.length} variants`);
} else {
  console.log('❌ Issue with Gouden Tientje update');
}

if (vijfje && vijfje.variants && vijfje.variants.length > 1) {
  console.log(`✅ Gouden Vijfje now has ${vijfje.variants.length} variants`);
} else {
  console.log('❌ Issue with Gouden Vijfje update');
}

if (!updatedDb.coins['gouden-10-gulden'] && !updatedDb.coins['gouden-5-gulden']) {
  console.log('✅ Duplicate entries successfully removed');
} else {
  console.log('❌ Duplicate entries still exist');
}