export function surahSlug(englishName: string): string {
  return englishName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function getSurahList() {
  const res = await fetch('https://api.alquran.cloud/v1/surah', {
    next: { revalidate: 86400 },
  })
  const data = await res.json()
  if (data.code === 200) return data.data as { number: number; name: string; englishName: string; englishNameTranslation: string; numberOfAyahs: number; revelationType: string }[]
  return []
}
