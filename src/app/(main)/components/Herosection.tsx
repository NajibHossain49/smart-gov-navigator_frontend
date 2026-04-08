'use client'
import { Search, ArrowRight } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { serviceApi } from '@/lib/api'
import { CATEGORY_ICONS, cn } from '@/lib/utils'
import type { Service } from '@/types'

export default function HeroSection() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState('')
    const [suggestions, setSuggestions] = useState<Service[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
    const [activeIndex, setActiveIndex] = useState(-1)
    const searchRef = useRef<HTMLDivElement>(null)
    const debounceRef = useRef<ReturnType<typeof setTimeout>>()

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node))
                setShowSuggestions(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setSearchQuery(val)
        setActiveIndex(-1)
        clearTimeout(debounceRef.current)
        if (val.trim().length < 2) {
            setShowSuggestions(false)
            setSuggestions([])
            return
        }
        setIsLoadingSuggestions(true)
        setShowSuggestions(true)
        debounceRef.current = setTimeout(async () => {
            try {
                const res = await serviceApi.getAll(1, 6)
                setSuggestions(res?.data?.data?.services ?? [])
            } catch {
                setSuggestions([])
            } finally {
                setIsLoadingSuggestions(false)
            }
        }, 280)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showSuggestions || !suggestions.length) {
            if (e.key === 'Enter') handleSearch(e as any)
            return
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActiveIndex(i => Math.min(i + 1, suggestions.length - 1))
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActiveIndex(i => Math.max(i - 1, -1))
        } else if (e.key === 'Enter') {
            e.preventDefault()
            if (activeIndex >= 0 && suggestions[activeIndex]) {
                router.push(`/services/${suggestions[activeIndex].id}`)
                setShowSuggestions(false)
            } else {
                handleSearch(e as any)
            }
        } else if (e.key === 'Escape') {
            setShowSuggestions(false)
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setShowSuggestions(false)
        if (searchQuery.trim()) router.push(`/services?q=${encodeURIComponent(searchQuery.trim())}`)
    }

    const highlight = (text: string, q: string) => {
        const idx = text.toLowerCase().indexOf(q.toLowerCase())
        if (idx === -1) return <>{text}</>
        return (
            <>
                {text.slice(0, idx)}
                <mark className="bg-transparent text-primary-600 font-semibold not-italic">
                    {text.slice(idx, idx + q.length)}
                </mark>
                {text.slice(idx + q.length)}
            </>
        )
    }

    return (
        <section className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 overflow-hidden">
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '32px 32px',
                }}
            />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-xs font-medium px-3 py-1.5 rounded-full border border-white/20 mb-6 backdrop-blur-sm">
                    🇧🇩 Government Services of Bangladesh
                </div>

                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
                    Find Government Services
                    <span className="block text-primary-200 mt-1">Quickly & Easily</span>
                </h1>
                <p className="text-primary-100 text-lg max-w-xl mx-auto mb-10">
                    One platform for all your government service needs. Step-by-step guides, required documents, and office locations.
                </p>

                {/* Search with Suggestions */}
                <div ref={searchRef} className="relative max-w-xl mx-auto">
                    <form
                        onSubmit={handleSearch}
                        className="flex items-center gap-2 bg-white rounded-xl p-1.5 shadow-xl"
                    >
                        <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                        <input
                            type="text"
                            placeholder="Search services e.g. Passport, Trade License, NID..."
                            className="flex-1 text-sm text-slate-900 placeholder:text-slate-400 outline-none bg-transparent py-2"
                            value={searchQuery}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            onFocus={() => {
                                if (searchQuery.trim().length >= 2 && suggestions.length)
                                    setShowSuggestions(true)
                            }}
                            autoComplete="off"
                        />
                        <button type="submit" className="btn-primary px-5 py-2 text-sm shrink-0">
                            Search
                        </button>
                    </form>

                    {showSuggestions && (
                        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden z-50 text-left">
                            {isLoadingSuggestions ? (
                                <div className="py-5 text-center text-sm text-slate-400">
                                    <span className="inline-flex items-center gap-2">
                                        <svg className="animate-spin w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        Searching...
                                    </span>
                                </div>
                            ) : suggestions.length === 0 ? (
                                <div className="py-6 text-center text-sm text-slate-400">
                                    No services found for{' '}
                                    <span className="font-medium text-slate-600">"{searchQuery}"</span>
                                </div>
                            ) : (
                                <>
                                    <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                        Services
                                    </div>
                                    {suggestions.map((svc, i) => (
                                        <button
                                            key={svc.id}
                                            type="button"
                                            className={cn(
                                                'w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors border-b border-slate-50 last:border-0',
                                                i === activeIndex ? 'bg-primary-50' : 'hover:bg-slate-50'
                                            )}
                                            onMouseEnter={() => setActiveIndex(i)}
                                            onMouseDown={() => {
                                                router.push(`/services/${svc.id}`)
                                                setShowSuggestions(false)
                                            }}
                                        >
                                            <span className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-base shrink-0">
                                                {CATEGORY_ICONS[svc.category?.name ?? ''] ?? '📋'}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-800 truncate">
                                                    {highlight(svc.title, searchQuery)}
                                                </p>
                                                {svc.category?.name && (
                                                    <p className="text-xs text-slate-400 mt-0.5">{svc.category.name}</p>
                                                )}
                                            </div>
                                            <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium text-primary-600 hover:bg-primary-50 transition-colors border-t border-slate-100"
                                        onMouseDown={() => {
                                            router.push(`/services?q=${encodeURIComponent(searchQuery.trim())}`)
                                            setShowSuggestions(false)
                                        }}
                                    >
                                        View all results for "{searchQuery}"
                                        <ArrowRight className="w-3 h-3" />
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Quick stats */}
                <div className="flex items-center justify-center gap-8 mt-10 text-white/70 text-sm">
                    {[['15+', 'Services'], ['8', 'Categories'], ['12', 'Offices']].map(([num, label]) => (
                        <div key={label} className="text-center">
                            <div className="text-xl font-bold text-white">{num}</div>
                            <div>{label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}