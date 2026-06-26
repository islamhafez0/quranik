import type { MetadataRoute } from 'next'
import { surahSlug, getSurahList } from '@/utils/surahSlug'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://quranik.vercel.app'
  const surahs = await getSurahList()

  const surahEntries: MetadataRoute.Sitemap = surahs.map((s) => ({
    url: `${baseUrl}/surah/${surahSlug(s.englishName)}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...surahEntries,
  ]
}
