'use client'
import { useState, useEffect, Suspense, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Search, FileText, Clock, ArrowRight, X } from 'lucide-react'
import { serviceApi, categoryApi } from '@/lib/api'
import { CATEGORY_COLORS, CATEGORY_ICONS, cn, truncate } from '@/lib/utils'
import { CardSkeleton } from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'
import type { Service, Category } from '@/types'

function ServicesContent() {
  const searchParams = useSearchParams()
  const [searchInput, setSearchInput] = useState(searchParams.get('q') ?? '')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    searchParams.get('categoryId') ? parseInt(searchParams.get('categoryId')!) : null
  )
  const [page, setPage] = useState(1)

  // Suggestion state
  const [suggestions, setSuggestions] = useState<Service[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  const { data: catRes } = useQuery({ queryKey: ['categories'], queryFn: categoryApi.getAll })
  const categories: Category[] = catRes?.data?.data ?? []

  const { data: searchRes, isLoading: searchLoading } = useQuery({
    queryKey: ['services', 'search', searchQuery],
    queryFn: () => serviceApi.search(searchQuery),
    enabled: !!searchQuery,
  })

  const { data: catSvcRes, isLoading: catLoading } = useQuery({
    queryKey: ['services', 'category', selectedCategory],
    queryFn: () => serviceApi.getByCategory(selectedCategory!),
    enabled: !!selectedCategory && !searchQuery,
  })

  const { data: allRes, isLoading: allLoading } = useQuery({
    queryKey: ['services', 'all', page],
    queryFn: () => serviceApi.getAll(page, 12),
    enabled: !searchQuery && !selectedCategory,
  })

  const isLoading = searchLoading || catLoading || allLoading
  let services: Service[] = []
  let totalPages = 1

  if (searchQuery) services = searchRes?.data?.data ?? []
  else if (selectedCategory) services = catSvcRes?.data?.data?.services ?? []
  else {
    services = allRes?.data?.data?.services ?? []
    totalPages = allRes?.data?.data?.pagination?.totalPages ?? 1
  }

  // Close suggestions on outside click
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
    setSearchInput(val)
    setActiveIndex(-1)
    clearTimeout(debounceRef.current)
    if (val.trim().length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    setIsLoadingSuggestions(true)
    setShowSuggestions(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await serviceApi.search(val.trim())
        setSuggestions(res?.data?.data?.slice(0, 6) ?? [])
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
        setSearchInput(suggestions[activeIndex].title)
        setSearchQuery(suggestions[activeIndex].title)
        setShowSuggestions(false)
        setSelectedCategory(null)
        setPage(1)
      } else {
        handleSearch(e as any)
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuggestions(false)
    setSearchQuery(searchInput.trim())
    setSelectedCategory(null)
    setPage(1)
  }

  const clearFilters = () => {
    setSearchInput(''); setSearchQuery(''); setSelectedCategory(null); setPage(1)
    setSuggestions([]); setShowSuggestions(false)
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="mb-7">
        <h1 className="section-title mb-1">Government Services</h1>
        <p className="text-sm text-slate-500">Browse all available government services</p>
      </div>

      {/* Search with Suggestions */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-5">
        <div ref={searchRef} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
          <input
            className="input pl-9"
            placeholder="Search services..."
            value={searchInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (searchInput.trim().length >= 2 && suggestions.length)
                setShowSuggestions(true)
            }}
            autoComplete="off"
          />

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
                  <span className="font-medium text-slate-600">"{searchInput}"</span>
                </div>
              ) : (
                <>
                  <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Suggestions
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
                        setSearchInput(svc.title)
                        setSearchQuery(svc.title)
                        setShowSuggestions(false)
                        setSelectedCategory(null)
                        setPage(1)
                      }}
                    >
                      <span className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-base shrink-0">
                        {CATEGORY_ICONS[svc.category?.name ?? ''] ?? '📋'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">
                          {highlight(svc.title, searchInput)}
                        </p>
                        {svc.category?.name && (
                          <p className="text-xs text-slate-400 mt-0.5">{svc.category.name}</p>
                        )}
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        <button type="submit" className="btn-primary px-5">Search</button>
        {(searchQuery || selectedCategory) && (
          <button type="button" onClick={clearFilters} className="btn-secondary px-3">
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button
          onClick={() => { setSelectedCategory(null); setSearchQuery(''); setPage(1) }}
          className={cn('px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
            !selectedCategory && !searchQuery
              ? 'bg-primary-600 text-white border-primary-600'
              : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300')}>
          All
        </button>
        {categories.map(cat => (
          <button key={cat.id}
            onClick={() => { setSelectedCategory(cat.id); setSearchQuery(''); setSearchInput(''); setPage(1) }}
            className={cn('px-3 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-1',
              selectedCategory === cat.id
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300')}>
            <span>{CATEGORY_ICONS[cat.name] ?? '📋'}</span>{cat.name}
          </button>
        ))}
      </div>

      {/* Active filter info */}
      {searchQuery && (
        <p className="text-sm text-slate-600 mb-4">
          Showing <span className="font-semibold">{services.length}</span> results for &quot;<span className="text-primary-600">{searchQuery}</span>&quot;
        </p>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : services.length === 0 ? (
        <EmptyState icon="🔍" title="No services found"
          description="Try different keywords or browse by category."
          action={<button onClick={clearFilters} className="btn-secondary text-sm">Clear Filters</button>} />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((svc) => (
              <Link key={svc.id} href={`/services/${svc.id}`} className="card-hover p-5 flex flex-col gap-3">
                <span className={cn('badge text-xs w-fit', CATEGORY_COLORS[svc.category?.name ?? ''] ?? 'bg-slate-50 text-slate-600 border-slate-200')}>
                  {CATEGORY_ICONS[svc.category?.name ?? '']} {svc.category?.name}
                </span>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 text-sm leading-snug mb-1">{svc.title}</h3>
                  {svc.description && (
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{truncate(svc.description, 120)}</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  {svc.fees && <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{svc.fees.split('|')[0].trim()}</span>}
                  {svc.processing_time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{svc.processing_time.split('|')[0].trim()}</span>}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{svc._count?.feedbacks ?? 0} reviews</span>
                  <span className="text-xs text-primary-600 flex items-center gap-1 font-medium">
                    View details <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {!searchQuery && !selectedCategory && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary px-4 py-2 text-sm disabled:opacity-40">Previous</button>
              <span className="text-sm text-slate-600">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-secondary px-4 py-2 text-sm disabled:opacity-40">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function ServicesPage() {
  return <Suspense fallback={<div className="page-container"><CardSkeleton /></div>}><ServicesContent /></Suspense>
}