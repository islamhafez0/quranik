import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { surahSlug, getSurahList } from '@/utils/surahSlug'

interface AyahData {
  number: number
  text: string
  numberInSurah: number
  juz: number
  page: number
  translation?: string
}

interface SurahDetail {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  numberOfAyahs: number
  revelationType: string
  ayahs: AyahData[]
}

async function getSurahDetail(id: number): Promise<SurahDetail | null> {
  try {
    const res = await fetch(
      `https://api.alquran.cloud/v1/surah/${id}/editions/quran-uthmani,en.sahih`,
      { next: { revalidate: 86400 } }
    )
    const data = await res.json()
    if (data.code === 200) {
      const uthmani = data.data[0]
      const english = data.data[1]
      const mergedAyahs = uthmani.ayahs.map((ayah: any, index: number) => ({
        ...ayah,
        translation: english.ayahs[index]?.text || '',
      }))
      return { ...uthmani, ayahs: mergedAyahs }
    }
    return null
  } catch {
    return null
  }
}

export async function generateStaticParams() {
  const surahs = await getSurahList()
  return surahs.map((s) => ({ slug: surahSlug(s.englishName) }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const surahs = await getSurahList()
  const match = surahs.find((s) => surahSlug(s.englishName) === slug)
  if (!match) return { title: 'Surah Not Found - Quranik' }

  const surah = await getSurahDetail(match.number)
  if (!surah) return { title: 'Surah Not Found - Quranik' }

  const title = `Surah ${surah.englishName} (${surah.name}) - Quranik`
  const description = `Listen to Surah ${surah.englishName} (${surah.englishNameTranslation}) with beautiful recitations from 230+ reciters. ${surah.numberOfAyahs} ayahs, ${surah.revelationType}.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://quranik.vercel.app/surah/${slug}`,
      siteName: 'Quranik',
      type: 'article',
      images: [{ url: 'https://quranik.vercel.app/brand.png' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://quranik.vercel.app/brand.png'],
    },
    alternates: {
      canonical: `https://quranik.vercel.app/surah/${slug}`,
    },
  }
}

export default async function SurahPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const surahs = await getSurahList()
  const match = surahs.find((s) => surahSlug(s.englishName) === slug)

  if (!match) notFound()

  const surah = await getSurahDetail(match.number)
  if (!surah) notFound()

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-emerald-500/30" style={{ backgroundColor: '#09090b' }}>
      <header className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between gap-4" style={{ background: 'rgba(9,9,11,0.75)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Link href="/" className="flex items-center gap-3">
          <picture>
            <source media="(min-width: 768px)" srcSet="/brand.png" />
            <source media="(min-width: 0px)" srcSet="/brand-sm.png" />
            <img src="/brand.png" alt="Quranik" className="h-8 w-auto object-contain" draggable={false} />
          </picture>
        </Link>
        <Link
          href="/"
          className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:bg-white/5 border border-white/10 bg-white/5 text-zinc-300 hover:text-white"
        >
          ← Back
        </Link>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-6 pt-12 pb-40">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: 'rgba(255,255,255,0.9)' }}>
            <span className="primary-gradient-text">{surah.name}</span>
          </h1>
          <p className="text-2xl font-semibold" style={{ color: '#a1a1aa' }}>{surah.englishName}</p>
          <div className="flex items-center justify-center gap-3 text-sm" style={{ color: '#71717a' }}>
            <span>{surah.englishNameTranslation}</span>
            <span>•</span>
            <span>{surah.numberOfAyahs} ayahs</span>
            <span>•</span>
            <span>{surah.revelationType}</span>
          </div>
          <div className="pt-4">
            <Link
              href={`/?surah=${surah.number}`}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
            >
              Listen to {surah.englishName}
            </Link>
          </div>
        </div>

        {surah.number !== 9 && surah.number !== 1 && (
          <div className="text-center mb-8">
            <p className="text-3xl font-arabic" style={{ color: '#34d399' }}>
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
          </div>
        )}

        <div className="space-y-6">
          {surah.ayahs.map((ayah) => (
            <div
              key={ayah.number}
              className="rounded-2xl px-5 py-4"
              style={{ background: 'rgba(24,24,27,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div
                  className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold"
                  style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}
                >
                  {ayah.numberInSurah}
                </div>
                <p className="text-right text-2xl leading-[2] font-arabic flex-1" style={{ color: '#f4f4f5', direction: 'rtl' }}>
                  {ayah.text}
                </p>
              </div>
              {ayah.translation && (
                <p className="text-sm leading-relaxed mt-2" style={{ color: '#a1a1aa' }}>
                  {ayah.translation}
                </p>
              )}
              {ayah.juz && (
                <div className="mt-2 text-[10px] uppercase tracking-wider" style={{ color: '#52525b' }}>
                  Juz {ayah.juz} · Page {ayah.page}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-16 pt-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <p className="text-xs" style={{ color: '#52525b' }}>
            Quranik — Built by{' '}
            <a
              href="https://islamhafez.vercel.app"
              target="_blank"
              rel="noreferrer"
              style={{ color: '#71717a' }}
              className="hover:text-emerald-400 transition-colors"
            >
              Islam Hafez
            </a>
          </p>
        </div>
      </main>
    </div>
  )
}
