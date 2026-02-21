import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import type { Surah, Reciter } from '../types/quran';
import { useSurahs } from '../hooks/useSurahs';

interface AudioContextType {
    isPlaying: boolean;
    nowPlaying: Surah | null;
    currentReciter: Reciter | null;
    currentTime: number;
    duration: number;
    volume: number;
    playbackSpeed: number;
    playSurah: (surah: Surah) => void;
    togglePlay: () => void;
    seek: (time: number) => void;
    setVolume: (v: number) => void;
    setPlaybackSpeed: (s: number) => void;
    setReciter: (r: Reciter) => void;
    nextSurah: () => void;
    prevSurah: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode, initialReciter: Reciter | null }> = ({ children, initialReciter }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [nowPlaying, setNowPlaying] = useState<Surah | null>(() => {
        const saved = localStorage.getItem('quran_nowPlaying');
        return saved ? JSON.parse(saved) : null;
    });
    const [currentReciter, setCurrentReciter] = useState<Reciter | null>(initialReciter);
    const [currentTime, setCurrentTime] = useState(() => {
        const saved = localStorage.getItem('quran_currentTime');
        return saved ? Number(saved) : 0;
    });
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(Number(localStorage.getItem('quran_volume')) || 0.7);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);

    const { surahs } = useSurahs();

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Using a ref to always have access to the latest surahs and nowPlaying inside the event listener
    const surahsRef = useRef(surahs);
    const nowPlayingRef = useRef(nowPlaying);

    useEffect(() => {
        surahsRef.current = surahs;
        nowPlayingRef.current = nowPlaying;
    }, [surahs, nowPlaying]);

    useEffect(() => {
        audioRef.current = new Audio();
        const audio = audioRef.current;

        if (nowPlaying && currentReciter) {
            audio.src = `${currentReciter.serverUrl}${nowPlaying.number.toString().padStart(3, '0')}.mp3`;
        }

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
            if (audio.currentTime > 0 && Math.floor(audio.currentTime) % 5 === 0) {
                localStorage.setItem('quran_currentTime', audio.currentTime.toString());
            }
            if ('mediaSession' in navigator && audio.duration && audio.currentTime) {
                try {
                    navigator.mediaSession.setPositionState({
                        duration: audio.duration,
                        playbackRate: audio.playbackRate,
                        position: audio.currentTime
                    });
                } catch { /* noop */ }
            }
        };

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
            const savedTime = Number(localStorage.getItem('quran_currentTime') || 0);
            if (savedTime > 0 && audio.currentTime === 0) {
                audio.currentTime = savedTime;
                setCurrentTime(savedTime);
            }
        };

        const handleEnded = () => {
            setIsPlaying(false);
            localStorage.setItem('quran_currentTime', '0');

            // Auto play next Surah logic
            const currentSurahs = surahsRef.current;
            const currentNowPlaying = nowPlayingRef.current;

            if (currentSurahs && currentSurahs.length > 0 && currentNowPlaying) {
                const nextSurah = currentSurahs.find(s => s.number === (currentNowPlaying.number % 114) + 1);
                if (nextSurah && currentReciter) {
                    const url = `${currentReciter.serverUrl}${nextSurah.number.toString().padStart(3, '0')}.mp3`;
                    setNowPlaying(nextSurah);
                    localStorage.setItem('quran_nowPlaying', JSON.stringify(nextSurah));
                    setCurrentTime(0);

                    audio.src = url;
                    audio.play();
                    setIsPlaying(true);
                    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
                    return; // Exit early so we don't pause the media session
                }
            }

            if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);

        if ('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler('play', () => {
                audio.play();
                setIsPlaying(true);
                navigator.mediaSession.playbackState = 'playing';
            });
            navigator.mediaSession.setActionHandler('pause', () => {
                audio.pause();
                setIsPlaying(false);
                navigator.mediaSession.playbackState = 'paused';
            });
            navigator.mediaSession.setActionHandler('seekto', (details) => {
                if (details.fastSeek && 'fastSeek' in audio) {
                    audio.fastSeek(details.seekTime || 0);
                    return;
                }
                audio.currentTime = details.seekTime || 0;
            });
        }

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
            audio.pause();
        };
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
            localStorage.setItem('quran_volume', volume.toString());
        }
    }, [volume]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.playbackRate = playbackSpeed;
        }
    }, [playbackSpeed]);

    useEffect(() => {
        if ('mediaSession' in navigator && nowPlaying && currentReciter) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: nowPlaying.englishName,
                artist: currentReciter.englishName,
                album: 'Holy Quran',
                artwork: [{ src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' }]
            });
        }
    }, [nowPlaying, currentReciter]);

    const playSurah = useCallback((surah: Surah) => {
        if (!audioRef.current || !currentReciter?.serverUrl) return;

        const url = `${currentReciter.serverUrl}${surah.number.toString().padStart(3, '0')}.mp3`;

        if (nowPlaying?.number === surah.number && audioRef.current.src === url) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
                if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
            } else {
                audioRef.current.play();
                setIsPlaying(true);
                if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
            }
            return;
        }

        setNowPlaying(surah);
        localStorage.setItem('quran_nowPlaying', JSON.stringify(surah));
        localStorage.setItem('quran_currentTime', '0');
        setCurrentTime(0);

        audioRef.current.src = url;
        audioRef.current.play();
        setIsPlaying(true);
        if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
    }, [nowPlaying, isPlaying, currentReciter]);

    const togglePlay = useCallback(() => {
        if (!audioRef.current || !audioRef.current.src) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
            if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
        } else {
            audioRef.current.play();
            setIsPlaying(true);
            if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
        }
    }, [isPlaying]);

    const seek = useCallback((time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
            localStorage.setItem('quran_currentTime', time.toString());
        }
    }, []);

    const setReciter = useCallback((r: Reciter) => {
        setCurrentReciter(r);
        if (nowPlaying && isPlaying && audioRef.current) {
            const url = `${r.serverUrl}${nowPlaying.number.toString().padStart(3, '0')}.mp3`;
            const savedTime = audioRef.current.currentTime;
            audioRef.current.src = url;
            audioRef.current.currentTime = savedTime;
            audioRef.current.play();
        }
    }, [nowPlaying, isPlaying]);

    const nextSurah = useCallback(() => {
        if (!nowPlaying) return;
        const currentSurahs = surahsRef.current;
        if (!currentSurahs || currentSurahs.length === 0) return;

        const next = currentSurahs.find(s => s.number === (nowPlaying.number !== 114 ? nowPlaying.number + 1 : 1));
        if (next) playSurah(next);
    }, [nowPlaying, playSurah]);

    const prevSurah = useCallback(() => {
        if (!nowPlaying) return;
        const currentSurahs = surahsRef.current;
        if (!currentSurahs || currentSurahs.length === 0) return;

        const prev = currentSurahs.find(s => s.number === (nowPlaying.number !== 1 ? nowPlaying.number - 1 : 114));
        if (prev) playSurah(prev);
    }, [nowPlaying, playSurah]);

    const value = {
        isPlaying, nowPlaying, currentReciter, currentTime, duration, volume,
        playbackSpeed, playSurah, togglePlay, seek, setVolume, setPlaybackSpeed,
        setReciter, nextSurah, prevSurah
    };

    return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
};
