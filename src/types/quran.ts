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

export interface SurahProgress {
    [surahNumber: number]: number; // percentage 0-100
}

export interface UserStats {
    totalListenTime: number; // in seconds
    surahsStarted: number[]; // array of surah numbers
    surahsCompleted: number[]; // array of surah numbers
}
