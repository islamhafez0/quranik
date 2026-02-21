import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronDown, Check } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import type { Reciter } from '../types/quran'

export const ReciterCombobox = ({ reciters, selected, onSelect }: {
    reciters: Reciter[]
    selected: Reciter | null
    onSelect: (r: Reciter) => void
}) => {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [highlightIdx, setHighlightIdx] = useState(0)
    const ref = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const { t, language } = useLanguage()

    const filtered = useMemo(() =>
        query
            ? reciters.filter(r => {
                const searchSpace = language === 'ar' ? r.name : r.englishName;
                return searchSpace.toLowerCase().includes(query.toLowerCase());
            })
            : reciters
        , [reciters, query, language])

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const selectItem = useCallback((r: Reciter) => {
        onSelect(r)
        setOpen(false)
        setQuery('')
    }, [onSelect])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setHighlightIdx(i => Math.min(i + 1, filtered.length - 1))
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setHighlightIdx(i => Math.max(i - 1, 0))
        } else if (e.key === 'Enter' && filtered[highlightIdx]) {
            selectItem(filtered[highlightIdx])
        } else if (e.key === 'Escape') {
            setOpen(false)
        }
    }

    // Active Reciter Name based on current language
    const reciterLabel = selected
        ? (language === 'ar' ? selected.name : selected.englishName)
        : t('reciter.select');

    return (
        <div ref={ref} className="relative z-50">
            <button
                onClick={() => { setOpen(!open); setTimeout(() => inputRef.current?.focus(), 50) }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:bg-white/5 border border-white/10 bg-white/5 backdrop-blur-md cursor-pointer group"
            >
                <div className="w-5 h-5 shrink-0 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:animate-pulse" />
                </div>
                <span className="truncate max-w-[140px] text-zinc-300 group-hover:text-white transition-colors">{reciterLabel}</span>
                <ChevronDown className={`w-4 h-4 shrink-0 text-zinc-500 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className={`absolute top-full mt-3 w-80 rounded-2xl overflow-hidden glass-panel z-50 ${language === 'ar' ? 'left-0 origin-top-left' : 'right-0 origin-top-right'}`}
                    >
                        <div className="p-3 border-b border-white/5">
                            <div className="relative">
                                <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={e => { setQuery(e.target.value); setHighlightIdx(0) }}
                                    onKeyDown={handleKeyDown}
                                    placeholder={t('reciter.search')}
                                    className="w-full text-sm rounded-xl ps-9 pe-4 py-2 bg-black/40 text-zinc-200 border border-white/5 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600"
                                />
                            </div>
                        </div>

                        <div className="combobox-list py-2">
                            {filtered.length === 0 && (
                                <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                        <Search className="w-5 h-5 text-zinc-600" />
                                    </div>
                                    <p className="text-sm text-zinc-500">{t('reciter.empty')}</p>
                                </div>
                            )}
                            {filtered.map((r, i) => {
                                const rName = language === 'ar' ? r.name : r.englishName;
                                return (
                                    <button
                                        key={r.identifier}
                                        onClick={() => selectItem(r)}
                                        className={`cursor-pointer w-full text-start px-5 py-3 text-sm flex items-center justify-between transition-colors
                            ${i === highlightIdx ? 'bg-white/5' : 'hover:bg-white/5'}
                        `}
                                    >
                                        <span className={`truncate ${selected?.identifier === r.identifier ? 'text-emerald-400 font-medium' : 'text-zinc-300'}`}>
                                            {rName}
                                        </span>
                                        {selected?.identifier === r.identifier && (
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="shrink-0 ms-2">
                                                <Check className="w-4 h-4 text-emerald-500" />
                                            </motion.div>
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
