import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { useSurahs } from './hooks/useSurahs'
import { useReciters } from './hooks/useReciters'
import { AudioProvider, useAudio } from './context/AudioContext'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import type { Reciter } from './types/quran'

// Components
import { Header } from './components/Header'
import { SurahCard } from './components/SurahCard'
import { BottomPlayer } from './components/BottomPlayer'
import { Virtuoso } from 'react-virtuoso'

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

  const { t, language } = useLanguage()

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

      <Header reciters={reciters} currentReciter={currentReciter} setReciter={setReciter} />

      {/* ═══ Main Content Container ═══ */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 pt-8 pb-40">

        {/* Title & Search Section */}
        <div className="mb-10 text-center space-y-6">
          <div className={`space-y-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white/90">
              {language === 'ar' ? (
                <><span className="primary-gradient-text">القرآن الكريم</span></>
              ) : (
                <>Listen to the <span className="primary-gradient-text">Holy Quran</span></>
              )}
            </h1>
            <p className={`text-zinc-500 ${language === 'ar' ? 'text-lg mt-2' : ''}`}>{t('app.subtitle')}</p>
          </div>

          <div className="max-w-xl mx-auto relative group">
            <div className="absolute inset-0 bg-emerald-500/5 rounded-2xl blur-xl transition-all group-focus-within:bg-emerald-500/10" />
            <div className="relative">
              <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t('search.placeholder')}
                className={`w-full bg-zinc-900/50 backdrop-blur-sm border border-white/10 rounded-2xl ps-12 pe-4 py-4 outline-none text-zinc-200 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-sm ${language === 'ar' ? 'font-arabic' : ''}`}
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
              className="px-6 py-2.5 rounded-xl text-sm font-medium bg-zinc-900 hover:bg-zinc-800 text-white transition-colors border border-white/10 cursor-pointer">
              {t('error.retry')}
            </button>
          </div>
        ) : (
          <div
            className="flex-1 w-full"
          >
            <div className="pb-40 min-h-screen">
              <Virtuoso
                useWindowScroll
                data={filtered}
                itemContent={(_index, surah) => (
                  <div className="pb-3 px-1">
                    <SurahCard
                      surah={surah}
                      active={nowPlaying?.number === surah.number}
                      isPlaying={isPlaying}
                      onClick={() => playSurah(surah)}
                    />
                  </div>
                )}
              />

              {filtered.length === 0 && (
                <div className="text-center py-20 text-zinc-500">
                  {t('search.empty')} "{search}"
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <BottomPlayer
        nowPlaying={nowPlaying}
        currentReciter={currentReciter}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        togglePlay={togglePlay}
        handleNext={handleNext}
        handlePrev={handlePrev}
        seek={seek}
        setVolume={setVolume}
      />
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
      name: 'مشاري العفاسي',
      englishName: 'Mishary Alafasi',
      format: 'audio',
      language: 'ar',
      type: 'audio',
      serverUrl: 'https://server8.mp3quran.net/afs/'
    }
  })()

  return (
    <LanguageProvider>
      <AudioProvider initialReciter={savedReciter}>
        <MainApp />
      </AudioProvider>
    </LanguageProvider>
  )
}

export default App
