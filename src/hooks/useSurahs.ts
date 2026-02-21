import { useQuery } from '@tanstack/react-query';
import type { Surah } from '../types/quran';

export const useSurahs = () => {
    const {
        data: surahs = [],
        isLoading: loading,
        error: queryError
    } = useQuery<Surah[], Error>({
        queryKey: ['surahs'],
        queryFn: async () => {
            const response = await fetch('https://api.alquran.cloud/v1/surah');
            const data = await response.json();
            if (data.code === 200) {
                return data.data;
            } else {
                throw new Error('Failed to fetch surahs');
            }
        },
        staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours (Surah list never changes)
    });

    const error = queryError ? 'An error occurred while fetching surahs' : null;

    return { surahs, loading, error };
};
