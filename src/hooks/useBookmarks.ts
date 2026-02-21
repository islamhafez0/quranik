import { useState, useCallback, useEffect } from 'react';

export const useBookmarks = () => {
    const [bookmarks, setBookmarks] = useState<number[]>(() => {
        try {
            const saved = localStorage.getItem('quran_bookmarks');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('quran_bookmarks', JSON.stringify(bookmarks));
    }, [bookmarks]);

    const toggleBookmark = useCallback((surahNumber: number) => {
        setBookmarks(prev => {
            if (prev.includes(surahNumber)) {
                return prev.filter(n => n !== surahNumber);
            } else {
                return [...prev, surahNumber];
            }
        });
    }, []);

    const isBookmarked = useCallback((surahNumber: number) => {
        return bookmarks.includes(surahNumber);
    }, [bookmarks]);

    return { bookmarks, toggleBookmark, isBookmarked };
};
