export interface Ayah {
    number: number;
    text: string;
    numberInSurah: number;
    juz: number;
    manzil: number;
    page: number;
    ruku: number;
    hizbQuarter: number;
    sajda: boolean | any;
    translation?: string;
    audio?: string;
    audioSecondary?: string[];
    timing?: {
        from: number;
        to: number;
        duration: number;
    };
}

export interface Reciter {
    identifier: string;
    language: string;
    name: string;
    englishName: string;
    format: string;
    type: string;
    serverUrl?: string;
}

export interface Surah {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: "Meccan" | "Medinan";
    ayahs?: Ayah[];
}

export interface QuranData {
    surahs: Surah[];
}
