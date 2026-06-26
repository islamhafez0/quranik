'use client'

import { useState, useEffect } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { SurahCard } from './SurahCard'
import type { Surah } from '../types/quran'

export const SurahList = ({
  surahs,
  nowPlaying,
  isPlaying,
  surahProgress,
  onPlay,
  search,
}: {
  surahs: Surah[]
  nowPlaying: Surah | null
  isPlaying: boolean
  surahProgress: Record<number, number>
  onPlay: (surah: Surah) => void
  search: string
}) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="pb-40 min-h-screen">
        {surahs.map((surah) => (
          <div className="pb-3 px-1" key={surah.number}>
            <SurahCard
              surah={surah}
              active={nowPlaying?.number === surah.number}
              isPlaying={isPlaying}
              progress={surahProgress[surah.number] || 0}
              onClick={() => onPlay(surah)}
            />
          </div>
        ))}
        {surahs.length === 0 && (
          <div className="text-center py-20 text-zinc-500">
            No results found for &quot;{search}&quot;
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="pb-40 min-h-screen">
      <Virtuoso
        useWindowScroll
        data={surahs}
        itemContent={(_index, surah) => (
          <div className="pb-3 px-1">
            <SurahCard
              surah={surah}
              active={nowPlaying?.number === surah.number}
              isPlaying={isPlaying}
              progress={surahProgress[surah.number] || 0}
              onClick={() => onPlay(surah)}
            />
          </div>
        )}
      />
      {surahs.length === 0 && (
        <div className="text-center py-20 text-zinc-500">
          No results found for &quot;{search}&quot;
        </div>
      )}
    </div>
  )
}
