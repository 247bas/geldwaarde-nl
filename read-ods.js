const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Read the ODS file
const workbook = XLSX.readFile('/home/pc/geldwaarde/Overzicht munten op te nemen in website.ods');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON
const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// Display the data structure
console.log('Total rows:', jsonData.length);
console.log('\nFirst 10 rows:');
jsonData.slice(0, 10).forEach((row, index) => {
  console.log(`Row ${index}:`, row);
});

// Save as JSON for processing
fs.writeFileSync(
  path.join(__dirname, 'munten-data-raw.json'),
  JSON.stringify(jsonData, null, 2)
);

console.log('\nData saved to munten-data-raw.json');