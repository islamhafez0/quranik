import { useLanguage } from '../context/LanguageContext'
import type { Surah } from '../types/quran'

export const SurahCard = ({
    surah,
    active,
    isPlaying,
    progress = 0,
    onClick
}: {
    surah: Surah
    active: boolean
    isPlaying: boolean
    progress?: number
    onClick: () => void
}) => {
    const { t, language } = useLanguage()

    return (
        <button
            onClick={onClick}
            className={`surah-card group flex items-center gap-5 w-full text-start rounded-2xl px-5 py-4 cursor-pointer relative overflow-hidden ${active ? 'active' : ''}`}
        >
            {/* Progress Background */}
            <div
                className="absolute inset-y-0 start-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-all duration-500 pointer-events-none"
                style={{ width: `${progress}%` }}
            />
            {/* Number / Playing indicator */}
            <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-black/20 border border-white/5 group-hover:bg-black/40 transition-colors relative">
                {active && isPlaying ? (
                    <div className="audio-bars">
                        <div className="audio-bar" />
                        <div className="audio-bar" />
                        <div className="audio-bar" />
                    </div>
                ) : (
                    <span className={`text-sm font-semibold ${active ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                        {surah.number}
                    </span>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className={`text-base font-semibold truncate transition-colors ${active ? 'text-emerald-400' : 'text-zinc-200 group-hover:text-white'} ${language === 'ar' ? 'font-arabic text-xl' : ''}`}>
                    {language === 'ar' ? surah.name : surah.englishName}
                </p>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-500">
                    <span className="truncate">{surah.englishNameTranslation}</span>
                    <span>•</span>
                    <span>{surah.numberOfAyahs} {t('surah.ayahs')}</span>
                    <span>•</span>
                    <span>{t(`surah.${surah.revelationType}`)}</span>
                </div>
            </div>

            {/* Decorative Arabic Name on trailing edge (if English interface) */}
            {language === 'en' && (
                <span className={`font-arabic text-2xl shrink-0 ${active ? 'text-emerald-400' : 'text-zinc-700 group-hover:text-zinc-500'} transition-colors`}>
                    {surah.name}
                </span>
            )}
        </button>
    )
}
