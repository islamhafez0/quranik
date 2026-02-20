import { useState, useEffect } from 'react';
import type { Reciter } from '../types/quran';
import recitersData from '../data/reciters.json';

export const useReciters = () => {
    const [reciters, setReciters] = useState<Reciter[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            // Map mp3quran data to our Reciter interface
            const mappedReciters: Reciter[] = recitersData.reciters.map((r: any) => {
                // Find standard moshaf (Murattal Hafs - type 11) or just pick first
                const standardMoshaf = r.moshaf.find((m: any) => m.moshaf_type === 11) || r.moshaf[0];

                return {
                    identifier: `mp3quran-${r.id}`,
                    name: r.name_ar || r.name, // Use Arabic name
                    englishName: r.name_en || r.name,
                    format: 'audio',
                    language: 'ar',
                    type: 'audio',
                    serverUrl: standardMoshaf?.server
                };
            });

            // Sort alphabetically by name
            mappedReciters.sort((a, b) => a.englishName.localeCompare(b.englishName));

            setReciters(mappedReciters);
        } catch (err) {
            console.error('Error loading reciters:', err);
            setError('Failed to load the reciter library');
        } finally {
            setLoading(false);
        }
    }, []);

    return { reciters, loading, error };
};
