import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, PlayCircle, CheckCircle, BarChart3 } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import type { UserStats } from '../types/quran'

export const StatisticsModal = ({ isOpen, onClose, stats }: {
    isOpen: boolean
    onClose: () => void
    stats: UserStats
}) => {
    const { t, language } = useLanguage()

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600)
        const m = Math.floor((seconds % 3600) / 60)
        const s = Math.floor(seconds % 60)

        const parts = []
        if (h > 0) parts.push(`${h} ${t('stats.hours')}`)
        if (m > 0 || h > 0) parts.push(`${m} ${t('stats.minutes')}`)
        parts.push(`${s} ${t('stats.seconds')}`)

        return parts.join(' ')
    }

    const completionRate = Math.round((stats.surahsCompleted.length / 114) * 100)

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg glass-panel overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                    <BarChart3 size={24} />
                                </div>
                                <h2 className={`text-xl font-bold text-white ${language === 'ar' ? 'font-arabic' : ''}`}>
                                    {t('stats.title')}
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl hover:bg-white/5 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Total Time Card */}
                            <div className="p-5 rounded-2xl bg-zinc-900/50 border border-white/5 space-y-2">
                                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                                    <Clock size={16} />
                                    <span>{t('stats.totalTime')}</span>
                                </div>
                                <p className={`text-2xl font-bold text-emerald-400 ${language === 'ar' ? 'font-arabic' : ''}`}>
                                    {formatTime(stats.totalListenTime)}
                                </p>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-5 rounded-2xl bg-zinc-900/50 border border-white/5 space-y-1">
                                    <div className="flex items-center gap-2 text-zinc-400 text-sm">
                                        <PlayCircle size={16} />
                                        <span>{t('stats.surahsStarted')}</span>
                                    </div>
                                    <p className="text-2xl font-bold text-white">
                                        {stats.surahsStarted.length} <span className="text-zinc-500 text-sm font-normal">/ 114</span>
                                    </p>
                                </div>
                                <div className="p-5 rounded-2xl bg-zinc-900/50 border border-white/5 space-y-1">
                                    <div className="flex items-center gap-2 text-zinc-400 text-sm">
                                        <CheckCircle size={16} />
                                        <span>{t('stats.surahsCompleted')}</span>
                                    </div>
                                    <p className="text-2xl font-bold text-emerald-400">
                                        {stats.surahsCompleted.length} <span className="text-zinc-500 text-sm font-normal">/ 114</span>
                                    </p>
                                </div>
                            </div>

                            {/* Progress Ring / Bar */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-zinc-400">{t('stats.completion')}</span>
                                    <span className="text-emerald-400 font-bold">{completionRate}%</span>
                                </div>
                                <div className="h-3 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${completionRate}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer Overlay Gradient */}
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
