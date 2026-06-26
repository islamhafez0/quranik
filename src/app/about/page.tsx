import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — Quranik by Islam Hafez',
  description:
    'Quranik is a modern Quran streaming web app built by Islam Hafez (islamhafez0). Features gapless playback, 230+ reciters, Arabic search, and PWA support.',
  openGraph: {
    title: 'About Quranik — Built by Islam Hafez',
    description:
      'Learn about Quranik, the Holy Quran streaming app created by frontend developer Islam Hafez.',
    url: 'https://quranik.vercel.app/about',
    images: [{ url: 'https://quranik.vercel.app/brand.png' }],
  },
}

export default function AboutPage() {
  return (
    <div dir='ltr' className="min-h-screen flex flex-col font-sans selection:bg-emerald-500/30" style={{ backgroundColor: '#09090b' }}>
      <header className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between gap-4" style={{ background: 'rgba(9,9,11,0.75)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Link href="/" className="flex items-center gap-3">
          <picture>
            <source media="(min-width: 768px)" srcSet="/brand.png" />
            <source media="(min-width: 0px)" srcSet="/brand-sm.png" />
            <img src="/brand.png" alt="Quranik" className="h-8 w-auto object-contain" draggable={false} />
          </picture>
        </Link>
        <Link href="/" className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:bg-white/5 border border-white/10 bg-white/5 text-zinc-300 hover:text-white">← Back</Link>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 md:px-6 pt-16 pb-40">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" style={{ color: 'rgba(255,255,255,0.9)' }}>
            About <span className="primary-gradient-text">Quranik</span>
          </h1>
          <p className="text-lg" style={{ color: '#a1a1aa' }}>
            A modern Quran streaming experience
          </p>
        </div>

        <div className="space-y-8" style={{ color: '#d4d4d8' }}>
          <section className="rounded-2xl p-6" style={{ background: 'rgba(24,24,27,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h2 className="text-xl font-semibold mb-3 text-white">The App</h2>
            <p className="leading-relaxed" style={{ color: '#a1a1aa' }}>
              Quranik is a free, modern web application for streaming the Holy Quran. It features gapless playback,
              over 230 reciters, robust Arabic search with diacritic-aware normalization, and full PWA support
              for offline access.
            </p>
          </section>

          <section className="rounded-2xl p-6" style={{ background: 'rgba(24,24,27,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h2 className="text-xl font-semibold mb-3 text-white">The Developer</h2>
            <p className="leading-relaxed" style={{ color: '#a1a1aa' }}>
              Built by <strong className="text-white">Islam Hafez</strong> (<code className="text-emerald-400">islamhafez0</code>),
              a frontend developer specializing in React, TypeScript, and modern web technologies.
              Islam is passionate about building high-performance, accessible web applications
              with clean architecture and great user experiences.
            </p>
          </section>

          <section className="rounded-2xl p-6" style={{ background: 'rgba(24,24,27,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h2 className="text-xl font-semibold mb-3 text-white">Links</h2>
            <div className="flex flex-col gap-2">
              <a href="https://islamhafez.vercel.app" target="_blank" rel="noreferrer"
                className="text-emerald-400 hover:text-emerald-300 transition-colors underline underline-offset-2">
                Portfolio — islamhafez.vercel.app
              </a>
              <a href="https://github.com/islamhafez0" target="_blank" rel="noreferrer"
                className="text-emerald-400 hover:text-emerald-300 transition-colors underline underline-offset-2">
                GitHub — github.com/islamhafez0
              </a>
              <a href="https://github.com/islamhafez0/quranik" target="_blank" rel="noreferrer"
                className="text-emerald-400 hover:text-emerald-300 transition-colors underline underline-offset-2">
                Quranik Source — github.com/islamhafez0/quranik
              </a>
            </div>
          </section>

          <section className="rounded-2xl p-6" style={{ background: 'rgba(24,24,27,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h2 className="text-xl font-semibold mb-3 text-white">Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {['Next.js', 'React 19', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'React Query', 'React Virtuoso', 'Lucide Icons'].map((tech) => (
                <span key={tech} className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}>
                  {tech}
                </span>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
