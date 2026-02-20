import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations = {
    ar: {
        'app.title': 'استمع للقرآن الكريم',
        'app.subtitle': 'استمتع بأعذب التلاوات القرآنية',
        'search.placeholder': 'ابحث عن سورة...',
        'search.empty': 'لم يتم العثور على سور مطابقة لـ',
        'reciter.select': 'اختر قارئاً',
        'reciter.search': 'ابحث عن مقرئ...',
        'reciter.empty': 'لم يتم العثور على قراء',
        'error.retry': 'المحاولة مرة أخرى',
        'surah.ayahs': 'آيات',
        'surah.Meccan': 'مكية',
        'surah.Medinan': 'مدنية',
    },
    en: {
        'app.title': 'Listen to the Holy Quran',
        'app.subtitle': 'Immerse yourself in beautiful recitations',
        'search.placeholder': 'Search for a Surah...',
        'search.empty': 'No chapters found matching',
        'reciter.select': 'Select reciter',
        'reciter.search': 'Search reciters...',
        'reciter.empty': 'No reciters found',
        'error.retry': 'Try Again',
        'surah.ayahs': 'Ayahs',
        'surah.Meccan': 'Meccan',
        'surah.Medinan': 'Medinan',
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Default to 'ar' unless user previously picked 'en'
    const [language, setLanguageState] = useState<Language>(() => {
        const saved = localStorage.getItem('quranik_lang');
        return (saved === 'en' || saved === 'ar') ? saved : 'ar';
    });

    useEffect(() => {
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
        localStorage.setItem('quranik_lang', language);
    }, [language]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
    };

    const t = (key: string): string => {
        // @ts-ignore
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within LanguageProvider');
    return context;
};
