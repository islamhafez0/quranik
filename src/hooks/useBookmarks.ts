import { useState, useCallback, useEffect } from 'react';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('quran_bookmarks');
      if (saved) setBookmarks(JSON.parse(saved));
    } catch { /* noop */ }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('quran_bookmarks', JSON.stringify(bookmarks));
    }
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
