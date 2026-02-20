const fs = require('fs');
try {
    const data = JSON.parse(fs.readFileSync('c:/Users/Islam/Pictures/quranik/mp3quran_reciters.json', 'utf8'));
    const terms = ['Soufi', 'Sufi', 'Idrees', 'Dossari', 'Islam Sobhi'];
    const results = data.reciters.filter(r =>
        terms.some(t => r.name.toLowerCase().includes(t.toLowerCase()))
    );
    console.log(JSON.stringify(results, null, 2));
} catch (e) {
    console.error(e);
}
