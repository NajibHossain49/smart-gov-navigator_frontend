'use client'
import Link from 'next/link'
import { Search, ArrowRight, FileText, Building2, BookMarked, Star } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { categoryApi, serviceApi } from '@/lib/api'
import { CATEGORY_ICONS, CATEGORY_COLORS, cn } from '@/lib/utils'
import { CardSkeleton } from '@/components/ui/LoadingSpinner'
import StarRating from '@/components/ui/StarRating'
import type { Category, Service } from '@/types'
import TeamSection from './Teamsection'


export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Service[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  const { data: categoriesRes, isLoading: catLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getAll(),
  })

  const { data: servicesRes, isLoading: svcLoading } = useQuery({
    queryKey: ['services', 'home'],
    queryFn: () => serviceApi.getAll(1, 6),
  })

  const categories: Category[] = categoriesRes?.data?.data ?? []
  const services: Service[] = servicesRes?.data?.data?.services ?? []

  // Close dropdown on outside click
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
    <div className="animate-fade-in">

      {/* ── Hero ─────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 overflow-hidden">
        {/* Background pattern */}
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

            {/* Suggestions Dropdown */}
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

                    {/* View all results link */}
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

      {/* ── Categories ───────────────────────── */}
      <section className="page-container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">Browse by Category</h2>
            <p className="text-sm text-slate-500 mt-1">Find services organized by type</p>
          </div>
          <Link href="/services" className="text-sm text-primary-600 font-medium hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {catLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array(8).fill(0).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/services?categoryId=${cat.id}`}
                className="card-hover p-4 flex flex-col items-center text-center gap-2 group"
              >
                <span className="text-3xl">{CATEGORY_ICONS[cat.name] ?? '📋'}</span>
                <span className={cn('badge text-xs', CATEGORY_COLORS[cat.name] ?? 'bg-slate-50 text-slate-600 border-slate-200')}>
                  {cat._count?.services ?? 0} services
                </span>
                <p className="text-sm font-medium text-slate-800 leading-tight">{cat.name}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Featured Services ─────────────────── */}
      <section className="bg-slate-50/80 py-12">
        <div className="page-container !py-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="section-title">Popular Services</h2>
              <p className="text-sm text-slate-500 mt-1">Most accessed government services</p>
            </div>
            <Link href="/services" className="text-sm text-primary-600 font-medium hover:underline flex items-center gap-1">
              See all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {svcLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((svc) => (
                <Link key={svc.id} href={`/services/${svc.id}`} className="card-hover p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className={cn('badge text-xs', CATEGORY_COLORS[svc.category?.name ?? ''] ?? 'bg-slate-50 text-slate-600 border-slate-200')}>
                      {svc.category?.name}
                    </span>
                    {(svc._count?.feedbacks ?? 0) > 0 && (
                      <div className="flex items-center gap-1 text-xs text-amber-500">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span className="text-slate-500">{svc._count?.feedbacks} reviews</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm leading-snug mb-1.5">{svc.title}</h3>
                    {svc.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{svc.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 pt-1 border-t border-slate-100 mt-auto">
                    {svc.fees && (
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {svc.fees.split('|')[0].trim()}
                      </span>
                    )}
                    {svc.processing_time && (
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {svc.processing_time.split('|')[0].trim()}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── How it works ───────────────────────── */}
      <section className="page-container">
        <div className="text-center mb-10">
          <h2 className="section-title">How It Works</h2>
          <p className="text-sm text-slate-500 mt-1">Simple steps to find the service you need</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { icon: '🔍', step: '01', title: 'Search or Browse', desc: 'Search for a service or browse by category to find what you need.' },
            { icon: '📋', step: '02', title: 'View Details', desc: 'See step-by-step guides, required documents, and fees.' },
            { icon: '🏢', step: '03', title: 'Visit the Office', desc: 'Find the nearest office and complete your application.' },
          ].map((item) => (
            <div key={item.step} className="text-center p-5">
              <div className="text-4xl mb-3">{item.icon}</div>
              <div className="text-xs font-bold text-primary-400 mb-1 tracking-widest">{item.step}</div>
              <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <TeamSection
        title="Our Best Team"
        subtitle="Meet our dedicated government office staff"
        members={[
          {
            id: 1,
            name: 'Md. Rafiqul Islam',
            designation: 'Director General',
            department: 'Administration',
            office: 'Dhaka HQ',
            email: 'rafiqul@gov.bd',
            phone: '+880 1700-000001',
            color: 'blue',
          },
          {
            id: 2,
            name: 'Fatema Khanam',
            designation: 'Deputy Secretary',
            department: 'Finance',
            office: 'Chattogram',
            email: 'fatema@gov.bd',
             phone: '+880 1700-000054',
          },
          {
            id: 3,
            name: 'Redima Rahman Mou',
            designation: 'Deputy Secretary',
            department: 'Human Resources',
            office: 'Dhaka',
            email: 'redima@gov.bd',
             phone: '+880 1700-0054009',
          },
        ]}
      />
      {/* ── CTA ──────────────────────────────── */}
      <section className="bg-primary-600 py-14">
        <div className="max-w-2xl mx-auto text-center px-4">
          <BookMarked className="w-10 h-10 text-primary-200 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">Save Your Favorite Services</h2>
          <p className="text-primary-100 text-sm mb-7">
            Create a free account to bookmark services, track your history, and get updates.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/register"
              className="bg-white text-primary-700 font-medium px-6 py-2.5 rounded-lg text-sm hover:bg-primary-50 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/services"
              className="text-white border border-white/30 font-medium px-6 py-2.5 rounded-lg text-sm hover:bg-white/10 transition-colors"
            >
              Browse Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}