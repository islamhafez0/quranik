import { useState, useEffect } from 'react';
import type { Surah } from '../types/quran';

export const useSurahs = () => {
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSurahs = async () => {
            try {
                const response = await fetch('https://api.alquran.cloud/v1/surah');
                const data = await response.json();
                if (data.code === 200) {
                    setSurahs(data.data);
                } else {
                    setError('Failed to fetch surahs');
                }
            } catch (err) {
                setError('An error occurred while fetching surahs');
            } finally {
                setLoading(false);
            }
        };

        fetchSurahs();
    }, []);

    return { surahs, loading, error };
};
