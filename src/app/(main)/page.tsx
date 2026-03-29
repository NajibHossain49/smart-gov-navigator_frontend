'use client'
import Link from 'next/link'
import { Search, ArrowRight, FileText, Building2, BookMarked, Star } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { categoryApi, serviceApi } from '@/lib/api'
import { CATEGORY_ICONS, CATEGORY_COLORS, cn } from '@/lib/utils'
import { CardSkeleton } from '@/components/ui/LoadingSpinner'
import StarRating from '@/components/ui/StarRating'
import type { Category, Service } from '@/types'

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) router.push(`/services?q=${encodeURIComponent(searchQuery.trim())}`)
  }

  return (
    <div className="animate-fade-in">

      {/* ── Hero ─────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800
                          overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-xs font-medium
                          px-3 py-1.5 rounded-full border border-white/20 mb-6 backdrop-blur-sm">
            🇧🇩 Government Services of Bangladesh
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            Find Government Services
            <span className="block text-primary-200 mt-1">Quickly & Easily</span>
          </h1>
          <p className="text-primary-100 text-lg max-w-xl mx-auto mb-10">
            One platform for all your government service needs. Step-by-step guides, required documents, and office locations.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch}
            className="flex items-center gap-2 max-w-xl mx-auto bg-white rounded-xl p-1.5 shadow-xl">
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text" placeholder="Search services e.g. Passport, Trade License, NID..."
              className="flex-1 text-sm text-slate-900 placeholder:text-slate-400 outline-none bg-transparent py-2"
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            <button type="submit" className="btn-primary px-5 py-2 text-sm shrink-0">
              Search
            </button>
          </form>

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
              <Link key={cat.id} href={`/services?categoryId=${cat.id}`}
                className="card-hover p-4 flex flex-col items-center text-center gap-2 group">
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
                    {svc.fees && <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{svc.fees.split('|')[0].trim()}</span>}
                    {svc.processing_time && <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{svc.processing_time.split('|')[0].trim()}</span>}
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

      {/* ── CTA ──────────────────────────────── */}
      <section className="bg-primary-600 py-14">
        <div className="max-w-2xl mx-auto text-center px-4">
          <BookMarked className="w-10 h-10 text-primary-200 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">Save Your Favorite Services</h2>
          <p className="text-primary-100 text-sm mb-7">
            Create a free account to bookmark services, track your history, and get updates.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/register" className="bg-white text-primary-700 font-medium px-6 py-2.5 rounded-lg text-sm hover:bg-primary-50 transition-colors">
              Get Started Free
            </Link>
            <Link href="/services" className="text-white border border-white/30 font-medium px-6 py-2.5 rounded-lg text-sm hover:bg-white/10 transition-colors">
              Browse Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
