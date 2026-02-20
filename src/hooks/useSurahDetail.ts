import { useState, useEffect } from 'react';
import type { Surah } from '../types/quran';

export const useSurahDetail = (surahNumber: number | null, audioEdition: string = 'ar.alafasy') => {
    const [surah, setSurah] = useState<Surah | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!surahNumber) return;

        const fetchSurahDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,en.sahih,${audioEdition}`);
                const data = await response.json();

                if (data.code === 200) {
                    const uthmani = data.data[0];
                    const english = data.data[1];
                    const audio = data.data[2];

                    const mergedAyahs = uthmani.ayahs.map((ayah: any, index: number) => ({
                        ...ayah,
                        translation: english.ayahs[index].text,
                        audio: audio.ayahs[index].audio,
                        audioSecondary: audio.ayahs[index].audioSecondary
                    }));

                    setSurah({
                        ...uthmani,
                        ayahs: mergedAyahs
                    });
                } else {
                    setError('Failed to fetch surah details');
                }
            } catch (err) {
                setError('An error occurred while fetching surah details');
            } finally {
                setLoading(false);
            }
        };

        fetchSurahDetail();
    }, [surahNumber, audioEdition]);

    return { surah, loading, error };
};
