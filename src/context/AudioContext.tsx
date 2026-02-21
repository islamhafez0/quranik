import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import type { Surah, Reciter } from '../types/quran';

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
    const [nowPlaying, setNowPlaying] = useState<Surah | null>(null);
    const [currentReciter, setCurrentReciter] = useState<Reciter | null>(initialReciter);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(Number(localStorage.getItem('quran_volume')) || 0.7);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio();
        const audio = audioRef.current;

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime)
            // Sync media session position state for supported browsers
            if ('mediaSession' in navigator && audio.duration && audio.currentTime) {
                try {
                    navigator.mediaSession.setPositionState({
                        duration: audio.duration,
                        playbackRate: audio.playbackRate,
                        position: audio.currentTime
                    });
                } catch { /* Ignore for old browsers */ }
            }
        };

        const handleLoadedMetadata = () => {
            setDuration(audio.duration)
        };

        const handleEnded = () => {
            setIsPlaying(false)
            if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);

        // Media Session controls
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

    // Update Media Session Metadata when track changes
    useEffect(() => {
        if ('mediaSession' in navigator && nowPlaying && currentReciter) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: nowPlaying.englishName, // Can't conditionally hook language simply here unless we import LanguageContext, so we fallback to englishName for universal OS support
                artist: currentReciter.englishName,
                album: 'Holy Quran',
                artwork: [
                    { src: '/quran-icon.png', sizes: '512x512', type: 'image/png' } // Assuming there's a favicon or we can add one later
                ]
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
        }
    }, []);

    const setReciter = useCallback((r: Reciter) => {
        setCurrentReciter(r);
        // If something is playing, we might want to restart it with the new reciter
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
    }, [nowPlaying]);

    const prevSurah = useCallback(() => {
        if (!nowPlaying) return;
    }, [nowPlaying]);

    const value = {
        isPlaying,
        nowPlaying,
        currentReciter,
        currentTime,
        duration,
        volume,
        playbackSpeed,
        playSurah,
        togglePlay,
        seek,
        setVolume,
        setPlaybackSpeed,
        setReciter,
        nextSurah,
        prevSurah
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
