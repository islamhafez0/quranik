/**
 * Removes diacritics (tashkeel), tatweel, and normalizes various forms of Alef, Ya, and Hamza
 * to make Arabic text search more robust.
 * 
 * E.g: "سُورَةُ ٱلْفَاتِحَةِ" -> "سوره الفاتحه"
 */
export const normalizeArabic = (text: string): string => {
    return text
        // Remove Arabic diacritics (Tashkeel, Madda, Superscript Alef, etc.)
        .replace(/[\u0617-\u061A\u064B-\u0653\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, '')
        // Normalize Alef variants to a simple Alef
        .replace(/[أإآٱ]/g, 'ا')
        // Normalize Ya and Alef Maksura
        .replace(/[يى]/g, 'ي')
        // Normalize Ta Marbuta to Ha (Optional but helpful for search since many users typing Ha)
        .replace(/ة/g, 'ه')
        // Normalize Waw with Hamza
        .replace(/ؤ/g, 'و')
        // Normalize Waw with Hamza
        .replace(/ئ/g, 'ي')
        // Remove Tatweel (Kashida)
        .replace(/ـ/g, '');
};
