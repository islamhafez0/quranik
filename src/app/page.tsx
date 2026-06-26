import InteractiveApp from '@/components/InteractiveApp'

async function getSurahs() {
  const res = await fetch('https://api.alquran.cloud/v1/surah', {
    next: { revalidate: 86400 },
  })
  const data = await res.json()
  if (data.code === 200) return data.data
  return []
}

export default async function Home() {
  let surahs: any[] = []

  try {
    surahs = await getSurahs()
  } catch { /* fallback */ }

  return <InteractiveApp initialSurahs={surahs} />
}
