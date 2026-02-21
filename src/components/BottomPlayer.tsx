import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { formatTime } from '../utils/formatTime'
import type { Reciter, Surah } from '../types/quran'

export const BottomPlayer = ({
    nowPlaying,
    currentReciter,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    handleNext,
    handlePrev,
    seek,
    setVolume
}: {
    nowPlaying: Surah | null
    currentReciter: Reciter | null
    isPlaying: boolean
    currentTime: number
    duration: number
    volume: number
    togglePlay: () => void
    handleNext: () => void
    handlePrev: () => void
    seek: (time: number) => void
    setVolume: (v: number) => void
}) => {
    const { language } = useLanguage()
    const progress = duration ? (currentTime / duration) * 100 : 0

    return (
        <AnimatePresence>
            {nowPlaying && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-2xl z-40"
                >
                    <div className="glass-dock rounded-3xl overflow-hidden shadow-2xl shadow-emerald-900/20">

                        {/* Top Progress Bar */}
                        <div
                            className="h-1.5 bg-black/40 cursor-pointer relative group"
                            onClick={e => {
                                const rect = e.currentTarget.getBoundingClientRect()
                                const clickX = language === 'ar' ? (rect.right - e.clientX) : (e.clientX - rect.left);
                                const pct = Math.max(0, Math.min(1, clickX / rect.width))
                                seek(pct * duration)
                            }}
                        >
                            <div
                                className={`absolute top-0 start-0 h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-[width] duration-100 ease-linear ${language === 'ar' ? 'origin-right' : 'origin-left'}`}
                                style={{ width: `${progress}%` }}
                            />
                            {/* Interactive thumb on hover */}
                            <div
                                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ [language === 'ar' ? 'right' : 'left']: `calc(${progress}% - 6px)` }}
                            />
                        </div>

                        <div className="px-6 py-4 flex items-center justify-between gap-6">
                            {/* Info Section */}
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-900/40 flex items-center justify-center border border-emerald-500/20 shrink-0">
                                    <span className={`font-arabic text-xl ${isPlaying ? 'text-emerald-400' : 'text-zinc-400'}`}>
                                        {nowPlaying.name}
                                    </span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className={`text-base font-semibold text-white truncate ${language === 'ar' ? 'font-arabic text-lg' : ''}`}>
                                        {language === 'ar' ? nowPlaying.name : nowPlaying.englishName}
                                    </p>
                                    <p className="text-xs text-emerald-400/80 truncate mt-0.5">
                                        {currentReciter ? (language === 'ar' ? currentReciter.name : currentReciter.englishName) : ''}
                                    </p>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex flex-col items-center gap-1">
                                <div className={`flex items-center gap-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                                    <button onClick={handlePrev} className="p-2 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/5 cursor-pointer">
                                        <SkipBack className="w-5 h-5 fill-current" />
                                    </button>

                                    <button
                                        onClick={togglePlay}
                                        className="w-12 h-12 rounded-full bg-white text-zinc-950 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-white/10 cursor-pointer"
                                    >
                                        {isPlaying ? (
                                            <Pause className="w-6 h-6 fill-current" />
                                        ) : (
                                            <Play className={`w-6 h-6 fill-current ${language === 'ar' ? 'me-1' : 'ms-1'}`} />
                                        )}
                                    </button>

                                    <button onClick={handleNext} className="p-2 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/5 cursor-pointer">
                                        <SkipForward className="w-5 h-5 fill-current" />
                                    </button>
                                </div>
                                <div className="text-[10px] font-mono text-zinc-500 tabular-nums">
                                    {formatTime(currentTime)} / {formatTime(duration)}
                                </div>
                            </div>

                            {/* Extra Controls (Volume hidden on mobile, useful on desktop) */}
                            <div className="hidden md:flex items-center gap-3 flex-1 justify-end">
                                <Volume2 className="w-4 h-4 text-zinc-500" />
                                <div className="w-24 h-1.5 rounded-full bg-black/40 overflow-hidden relative cursor-pointer group"
                                    onClick={e => {
                                        const rect = e.currentTarget.getBoundingClientRect()
                                        const clickX = language === 'ar' ? (rect.right - e.clientX) : (e.clientX - rect.left);
                                        const v = Math.max(0, Math.min(1, clickX / rect.width))
                                        setVolume(v)
                                    }}
                                >
                                    <div className="absolute top-0 start-0 h-full bg-zinc-400 transition-all group-hover:bg-emerald-400" style={{ width: `${volume * 100}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
