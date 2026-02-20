const fs = require('fs');
const path = require('path');

const jsonPath = 'c:/Users/Islam/Pictures/quranik/mp3quran_reciters.json';
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const targetReciters = [
    'Maher Al Meaqli',
    'Abdurrahman Alsudaes',
    'Ahmad Al-Ajmy',
    'Saud Al-Shuraim',
    'Shaik Abu Bakr Al Shatri',
    'Hani Arrifai',
    'Abdul Rashid Sufi',
    'Mishary Alafasi'
];

const mappings = {};

data.reciters.forEach(r => {
    mappings[r.name] = {
        id: r.id,
        server: r.moshaf[0]?.server,
        moshaf_name: r.moshaf[0]?.name
    };
});

fs.writeFileSync('c:/Users/Islam/Pictures/quranik/mappings_result.json', JSON.stringify(mappings, null, 2));
console.log('Mappings written to mappings_result.json');
