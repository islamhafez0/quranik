const fs = require('fs');
const jsonPath = 'c:/Users/Islam/Pictures/quranik/mp3quran_reciters.json';
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const results = data.reciters.filter(r =>
    r.name.toLowerCase().includes('sufi') ||
    r.name.toLowerCase().includes('soufi') ||
    r.name.toLowerCase().includes('rashid')
);

fs.writeFileSync('c:/Users/Islam/Pictures/quranik/search_results.json', JSON.stringify(results, null, 2));
console.log(`Found ${results.length} results. Saved to search_results.json`);
