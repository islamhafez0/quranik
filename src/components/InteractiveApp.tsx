'use client'

import { useState, useMemo, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { useSurahs } from '../hooks/useSurahs'
import { useReciters } from '../hooks/useReciters'
import { AudioProvider, useAudio } from '../context/AudioContext'
import { LanguageProvider, useLanguage } from '../context/LanguageContext'
import type { Reciter, Surah } from '../types/quran'
import { Header } from './Header'
import { SurahList } from './SurahList'
import { BottomPlayer } from './BottomPlayer'
import { StatisticsModal } from './StatisticsModal'
import { normalizeArabic } from '../utils/text'
import { useIsClient } from '../hooks/useIsClient'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 24,
    },
  },
})

const MainApp = ({ initialSurahs }: { initialSurahs: Surah[] }) => {
  const [search, setSearch] = useState('')
  const [isStatsOpen, setIsStatsOpen] = useState(false)
  const { surahs, loading: surahsLoading, error: surahsError } = useSurahs()
  const { reciters } = useReciters()
  const {
    isPlaying, nowPlaying, currentTime, duration,
    currentReciter, playSurah, togglePlay, seek, setReciter, setVolume, volume,
    nextSurah, prevSurah, surahProgress, userStats
  } = useAudio()

  const { t, language } = useLanguage()
  const isClient = useIsClient()

  const displaySurahs = isClient && surahs.length > 0 ? surahs : initialSurahs
  const isLoading = isClient ? surahsLoading : false

  useEffect(() => {
    if (currentReciter) {
      localStorage.setItem('quranik_reciter', JSON.stringify(currentReciter))
    }
  }, [currentReciter])

  useEffect(() => {
    if (!isClient || surahs.length === 0) return
    const params = new URLSearchParams(window.location.search)
    const surahParam = params.get('surah')
    if (surahParam) {
      const num = Number(surahParam)
      const target = surahs.find(s => s.number === num)
      if (target) {
        setTimeout(() => playSurah(target), 500)
        const url = new URL(window.location.href)
        url.searchParams.delete('surah')
        window.history.replaceState({}, '', url.toString())
      }
    }
  }, [isClient, surahs, playSurah])

  const filtered = useMemo(() => {
    const normSearch = normalizeArabic(search.toLowerCase());
    return displaySurahs.filter(s =>
      s.englishName.toLowerCase().includes(search.toLowerCase()) ||
      normalizeArabic(s.name).includes(normSearch) ||
      String(s.number) === search
    );
  }, [displaySurahs, search])

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-emerald-500/30">
      <Header
        reciters={reciters}
        currentReciter={currentReciter}
        setReciter={setReciter}
        onOpenStats={() => setIsStatsOpen(true)}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-2 md:px-6 pt-8 pb-40">
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
                name='search-surah'
                id='search-surah'
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t('search.placeholder')}
                className={`w-full bg-zinc-900/50 backdrop-blur-sm border border-white/10 rounded-2xl ps-12 pe-4 py-4 outline-none text-zinc-200 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-sm ${language === 'ar' ? 'font-arabic' : ''}`}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
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
          <div className="flex-1 w-full">
            <SurahList
              surahs={filtered}
              nowPlaying={nowPlaying}
              isPlaying={isPlaying}
              surahProgress={surahProgress}
              onPlay={playSurah}
              search={search}
            />
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
        handleNext={nextSurah}
        handlePrev={prevSurah}
        seek={seek}
        setVolume={setVolume}
      />

      <StatisticsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={userStats}
      />

      <footer className="text-center py-6 border-t border-white/5">
        <p className="text-xs text-zinc-600">
          Built by{' '}
          <a
            href="https://islamhafez.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="text-zinc-500 hover:text-emerald-400 transition-colors"
          >
            Islam Hafez
          </a>
          {' · '}
          <a
            href="https://github.com/islamhafez0/quranik"
            target="_blank"
            rel="noreferrer"
            className="text-zinc-500 hover:text-emerald-400 transition-colors"
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  )
}

function InteractiveApp({ initialSurahs }: { initialSurahs: Surah[] }) {
  const [savedReciter, setSavedReciter] = useState<Reciter | null>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('quranik_reciter')
      if (saved) {
        setSavedReciter(JSON.parse(saved) as Reciter)
      } else {
        setSavedReciter({
          identifier: 'mp3quran-123',
          name: 'مشاري العفاسي',
          englishName: 'Mishary Alafasi',
          format: 'audio',
          language: 'ar',
          type: 'audio',
          serverUrl: 'https://server8.mp3quran.net/afs/'
        })
      }
    } catch {
      setSavedReciter({
        identifier: 'mp3quran-123',
        name: 'مشاري العفاسي',
        englishName: 'Mishary Alafasi',
        format: 'audio',
        language: 'ar',
        type: 'audio',
        serverUrl: 'https://server8.mp3quran.net/afs/'
      })
    }
  }, [])

  if (!savedReciter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AudioProvider initialReciter={savedReciter}>
          <MainApp initialSurahs={initialSurahs} />
        </AudioProvider>
      </LanguageProvider>
    </QueryClientProvider>
  )
}

export default InteractiveApp
