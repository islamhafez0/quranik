import { Globe } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { ReciterCombobox } from './ReciterCombobox'
import type { Reciter } from '../types/quran'

export const Header = ({
    reciters,
    currentReciter,
    setReciter
}: {
    reciters: Reciter[]
    currentReciter: Reciter | null
    setReciter: (r: Reciter) => void
}) => {
    const { language, setLanguage } = useLanguage()

    return (
        <header className="glass-nav sticky top-0 z-30 px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                    <div className="absolute inset-0 bg-emerald-500 blur-[20px] opacity-20 rounded-full" />
                    <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-sm font-bold text-zinc-950 shadow-lg shadow-emerald-500/20">
                        Q
                    </div>
                </div>
                <span className="text-xl font-bold tracking-tight text-white/90 hidden sm:block">Quranik</span>
            </div>

            <div className="flex items-center gap-3">
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
