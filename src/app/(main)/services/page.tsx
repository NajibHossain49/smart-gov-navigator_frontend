'use client'
import { useState, useEffect, Suspense } from 'react'
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

  const { data: catRes } = useQuery({ queryKey: ['categories'], queryFn: categoryApi.getAll })
  const categories: Category[] = catRes?.data?.data ?? []

  // Search mode
  const { data: searchRes, isLoading: searchLoading } = useQuery({
    queryKey: ['services', 'search', searchQuery],
    queryFn: () => serviceApi.search(searchQuery),
    enabled: !!searchQuery,
  })

  // Category mode
  const { data: catSvcRes, isLoading: catLoading } = useQuery({
    queryKey: ['services', 'category', selectedCategory],
    queryFn: () => serviceApi.getByCategory(selectedCategory!),
    enabled: !!selectedCategory && !searchQuery,
  })

  // All services mode
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(searchInput.trim())
    setSelectedCategory(null)
    setPage(1)
  }

  const clearFilters = () => {
    setSearchInput(''); setSearchQuery(''); setSelectedCategory(null); setPage(1)
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="mb-7">
        <h1 className="section-title mb-1">Government Services</h1>
        <p className="text-sm text-slate-500">Browse all available government services</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input className="input pl-9" placeholder="Search services..."
            value={searchInput} onChange={e => setSearchInput(e.target.value)} />
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
        <button onClick={() => { setSelectedCategory(null); setSearchQuery(''); setPage(1) }}
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
