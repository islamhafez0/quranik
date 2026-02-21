import { useQuery } from '@tanstack/react-query';
import type { Reciter } from '../types/quran';
import recitersData from '../data/reciters.json';

export const useReciters = () => {
    const {
        data: reciters = [],
        isLoading: loading,
        error: queryError
    } = useQuery<Reciter[], Error>({
        queryKey: ['reciters'],
        queryFn: async () => {
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

            // Sort alphabetically by englishName for consistency
            return mappedReciters.sort((a, b) => a.englishName.localeCompare(b.englishName));
        },
        staleTime: Infinity, // Local JSON data never goes stale
    });

    const error = queryError ? 'Failed to load the reciter library' : null;

    return { reciters, loading, error };
};
