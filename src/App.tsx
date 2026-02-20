import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronDown, Check, Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import { useSurahs } from './hooks/useSurahs'
import { useReciters } from './hooks/useReciters'
import { AudioProvider, useAudio } from './context/AudioContext'
import { formatTime } from './utils/formatTime'
import type { Reciter } from './types/quran'
import './App.css'

/* ═══════════════════════════════════════
   Searchable Reciter Combobox
   ═══════════════════════════════════════ */
const ReciterCombobox = ({ reciters, selected, onSelect }: {
  reciters: Reciter[]
  selected: Reciter | null
  onSelect: (r: Reciter) => void
}) => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [highlightIdx, setHighlightIdx] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() =>
    query
      ? reciters.filter(r => r.englishName.toLowerCase().includes(query.toLowerCase()))
      : reciters
    , [reciters, query])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selectItem = useCallback((r: Reciter) => {
    onSelect(r)
    setOpen(false)
    setQuery('')
  }, [onSelect])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightIdx(i => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightIdx(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && filtered[highlightIdx]) {
      selectItem(filtered[highlightIdx])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(!open); setTimeout(() => inputRef.current?.focus(), 50) }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:bg-white/5 border border-white/10 bg-white/5 backdrop-blur-md cursor-pointer group"
      >
        <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:animate-pulse" />
        </div>
        <span className="truncate max-w-[140px] text-zinc-300 group-hover:text-white transition-colors">{selected?.englishName || 'Select reciter'}</span>
        <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full mt-3 w-80 rounded-2xl overflow-hidden glass-panel z-50 origin-top-right"
          >
            <div className="p-3 border-b border-white/5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => { setQuery(e.target.value); setHighlightIdx(0) }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search reciters…"
                  className="w-full text-sm rounded-xl pl-9 pr-4 py-2 bg-black/40 text-zinc-200 border border-white/5 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600"
                />
              </div>
            </div>

            <div className="combobox-list py-2">
              {filtered.length === 0 && (
                <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <Search className="w-5 h-5 text-zinc-600" />
                  </div>
                  <p className="text-sm text-zinc-500">No reciters found</p>
                </div>
              )}
              {filtered.map((r, i) => (
                <button
                  key={r.identifier}
                  onClick={() => selectItem(r)}
                  className={`w-full text-left px-5 py-3 text-sm flex items-center justify-between transition-colors
                    ${i === highlightIdx ? 'bg-white/5' : 'hover:bg-white/5'}
                  `}
                >
                  <span className={`truncate ${selected?.identifier === r.identifier ? 'text-emerald-400 font-medium' : 'text-zinc-300'}`}>
                    {r.englishName}
                  </span>
                  {selected?.identifier === r.identifier && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <Check className="w-4 h-4 text-emerald-500" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ═══════════════════════════════════════
   Main App
   ═══════════════════════════════════════ */
const MainApp = () => {
  const [search, setSearch] = useState('')
  const { surahs, loading: surahsLoading, error: surahsError } = useSurahs()
  const { reciters } = useReciters()
  const {
    isPlaying, nowPlaying, currentTime, duration,
    currentReciter, playSurah, togglePlay, seek, setReciter, setVolume, volume
  } = useAudio()

  useEffect(() => {
    if (currentReciter) {
      localStorage.setItem('quranik_reciter', JSON.stringify(currentReciter))
    }
  }, [currentReciter])

  useEffect(() => {
    const saved = localStorage.getItem('quranik_reciter')
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Reciter
        setReciter(parsed)
      } catch { /* ignore */ }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() =>
    surahs.filter(s =>
      s.englishName.toLowerCase().includes(search.toLowerCase()) ||
      s.name.includes(search) ||
      String(s.number) === search
    ), [surahs, search])

  const progress = duration ? (currentTime / duration) * 100 : 0

  const handleNext = () => {
    if (!nowPlaying) return
    const next = surahs.find(s => s.number === (nowPlaying.number % 114) + 1)
    if (next) playSurah(next)
  }

  const handlePrev = () => {
    if (!nowPlaying) return
    const prev = surahs.find(s => s.number === (nowPlaying.number === 1 ? 114 : nowPlaying.number - 1))
    if (prev) playSurah(prev)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  }

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-emerald-500/30">

      {/* ═══ Header ═══ */}
      <header className="glass-nav sticky top-0 z-30 px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="absolute inset-0 bg-emerald-500 blur-[20px] opacity-20 rounded-full" />
            <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-sm font-bold text-zinc-950 shadow-lg shadow-emerald-500/20">
              Q
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight text-white/90">Quranik</span>
        </div>

        <ReciterCombobox reciters={reciters} selected={currentReciter} onSelect={setReciter} />
      </header>

      {/* ═══ Main Content Container ═══ */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 pt-8 pb-40">

        {/* Title & Search Section */}
        <div className="mb-10 text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white/90">
              Listen to the <span className="primary-gradient-text">Holy Quran</span>
            </h1>
            <p className="text-zinc-500">Immerse yourself in beautiful recitations</p>
          </div>

          <div className="max-w-xl mx-auto relative group">
            <div className="absolute inset-0 bg-emerald-500/5 rounded-2xl blur-xl transition-all group-focus-within:bg-emerald-500/10" />
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search for a Surah..."
                className="w-full bg-zinc-900/50 backdrop-blur-sm border border-white/10 rounded-2xl pl-12 pr-4 py-4 outline-none text-zinc-200 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* ═══ Surah List ═══ */}
        {surahsLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-zinc-900/50 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : surahsError ? (
          <div className="text-center py-20">
            <div className="inline-flex w-16 h-16 rounded-full bg-red-500/10 items-center justify-center mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-red-400 mb-6">{surahsError}</p>
            <button onClick={() => location.reload()}
              className="px-6 py-2.5 rounded-xl text-sm font-medium bg-zinc-900 hover:bg-zinc-800 text-white transition-colors border border-white/10">
              Try Again
            </button>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid gap-3"
          >
            {filtered.map(surah => {
              const active = nowPlaying?.number === surah.number
              return (
                <motion.button
                  variants={itemVariants}
                  key={surah.number}
                  onClick={() => playSurah(surah)}
                  className={`surah-card group flex items-center gap-5 w-full text-left rounded-2xl px-5 py-4 cursor-pointer relative overflow-hidden ${active ? 'active' : ''}`}
                >
                  {/* Number / Playing indicator */}
                  <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-black/20 border border-white/5 group-hover:bg-black/40 transition-colors relative">
                    {active && isPlaying ? (
                      <div className="audio-bars">
                        <div className="audio-bar" />
                        <div className="audio-bar" />
                        <div className="audio-bar" />
                      </div>
                    ) : (
                      <span className={`text-sm font-semibold ${active ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                        {surah.number}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-base font-semibold truncate transition-colors ${active ? 'text-emerald-400' : 'text-zinc-200 group-hover:text-white'}`}>
                      {surah.englishName}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-500">
                      <span className="truncate">{surah.englishNameTranslation}</span>
                      <span>•</span>
                      <span>{surah.numberOfAyahs} Ayahs</span>
                      <span>•</span>
                      <span>{surah.revelationType}</span>
                    </div>
                  </div>

                  {/* Arabic Name */}
                  <span className={`font-arabic text-2xl shrink-0 ${active ? 'text-emerald-400' : 'text-zinc-700 group-hover:text-zinc-500'} transition-colors`}>
                    {surah.name}
                  </span>
                </motion.button>
              )
            })}
            {filtered.length === 0 && (
              <div className="text-center py-20 text-zinc-500">
                No chapters found matching "{search}"
              </div>
            )}
          </motion.div>
        )}
      </main>

      {/* ═══ Bottom Player Dock ═══ */}
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
                  const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
                  seek(pct * duration)
                }}
              >
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-[width] duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                />
                {/* Interactive thumb on hover */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `calc(${progress}% - 6px)` }}
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
                    <p className="text-base font-semibold text-white truncate">{nowPlaying.englishName}</p>
                    <p className="text-xs text-emerald-400/80 truncate mt-0.5">{currentReciter?.englishName}</p>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-4">
                    <button onClick={handlePrev} className="p-2 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
                      <SkipBack className="w-5 h-5 fill-current" />
                    </button>

                    <button
                      onClick={togglePlay}
                      className="w-12 h-12 rounded-full bg-white text-zinc-950 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-white/10"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 fill-current" />
                      ) : (
                        <Play className="w-6 h-6 fill-current ml-1" />
                      )}
                    </button>

                    <button onClick={handleNext} className="p-2 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
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
                      const v = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
                      setVolume(v)
                    }}
                  >
                    <div className="absolute top-0 left-0 h-full bg-zinc-400 transition-all group-hover:bg-emerald-400" style={{ width: `${volume * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function App() {
  const savedReciter = (() => {
    try {
      const saved = localStorage.getItem('quranik_reciter')
      if (saved) return JSON.parse(saved) as Reciter
    } catch { /* ignore */ }
    return {
      identifier: 'mp3quran-123',
      name: 'Mishary Alafasi',
      englishName: 'Mishary Alafasi',
      format: 'audio',
      language: 'ar',
      type: 'audio',
      serverUrl: 'https://server8.mp3quran.net/afs/'
    }
  })()

  return (
    <AudioProvider initialReciter={savedReciter}>
      <MainApp />
    </AudioProvider>
  )
}

export default App
