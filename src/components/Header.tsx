import { Globe, Github, BarChart3 } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { ReciterCombobox } from './ReciterCombobox'
import type { Reciter } from '../types/quran'

export const Header = ({
    reciters,
    currentReciter,
    setReciter,
    onOpenStats
}: {
    reciters: Reciter[]
    currentReciter: Reciter | null
    setReciter: (r: Reciter) => void;
    onOpenStats: () => void;
}) => {
    const { language, setLanguage } = useLanguage()

    return (
        <header className="glass-nav sticky top-0 z-30 px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <picture>
                    <source media="(min-width: 768px)" srcSet="/brand.png" />
                    <source media="(min-width: 0px)" srcSet="/brand-sm.png" />
                    <img src="/brand.png" alt="Quranik" className="h-8 w-auto object-contain" draggable={false} />
                </picture>
            </div>

            <div className="flex items-center gap-3">
                <a
                    href="https://github.com/islamhafez0/quranik"
                    target="_blank"
                    rel="noreferrer"
                    className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:bg-white/5 border border-white/10 bg-white/5 cursor-pointer text-zinc-300 hover:text-white"
                    title="Built by Islam Hafez"
                >
                    <Github className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs font-bold tracking-widest">Islam Hafez</span>
                </a>
                <button
                    onClick={onOpenStats}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:bg-white/5 border border-white/10 bg-white/5 cursor-pointer text-zinc-300 hover:text-white"
                >
                    <BarChart3 className="w-4 h-4 opacity-70" />
                </button>
                <button
                    onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:bg-white/5 border border-white/10 bg-white/5 cursor-pointer text-zinc-300 hover:text-white"
                >
                    <Globe className="w-4 h-4 opacity-70" />
                    <span className="uppercase text-xs font-bold tracking-widest">{language}</span>
                </button>
                <ReciterCombobox reciters={reciters} selected={currentReciter} onSelect={setReciter} />
            </div>
        </header>
    )
}
