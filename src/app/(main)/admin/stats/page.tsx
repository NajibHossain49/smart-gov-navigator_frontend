'use client'
import { useQuery } from '@tanstack/react-query'
import { TrendingUp, Users, BookMarked, Star, Building2, Tag, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { adminApi } from '@/lib/api'
import { CATEGORY_ICONS, cn } from '@/lib/utils'
import AuthGuard from '@/components/auth/AuthGuard'
import { CardSkeleton } from '@/components/ui/LoadingSpinner'
import StarRating from '@/components/ui/StarRating'

function StatsContent() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: adminApi.getDashboardStats,
  })
  const stats = data?.data?.data

  if (isLoading) return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array(8).fill(0).map((_,i) => <CardSkeleton key={i} />)}
    </div>
  )
  if (!stats) return null

  const overviewCards = [
    { label: 'Total Users', value: stats.overview.total_users, sub: `${stats.overview.active_users} active`, icon: Users, color: 'bg-blue-50 text-blue-600', iconBg: 'bg-blue-100' },
    { label: 'Total Services', value: stats.overview.total_services, sub: `${stats.overview.total_categories} categories`, icon: Building2, color: 'bg-emerald-50 text-emerald-600', iconBg: 'bg-emerald-100' },
    { label: 'Total Bookmarks', value: stats.overview.total_bookmarks, sub: 'Saved by users', icon: BookMarked, color: 'bg-amber-50 text-amber-600', iconBg: 'bg-amber-100' },
    { label: 'Total Offices', value: stats.overview.total_offices, sub: 'Across Bangladesh', icon: Tag, color: 'bg-purple-50 text-purple-600', iconBg: 'bg-purple-100' },
    { label: 'Total Reviews', value: stats.overview.total_feedbacks, sub: `Avg: ${stats.overview.average_rating?.toFixed(1) ?? '—'} ★`, icon: Star, color: 'bg-pink-50 text-pink-600', iconBg: 'bg-pink-100' },
    { label: 'New Users (30d)', value: stats.overview.new_users_last_30_days, sub: 'This month', icon: TrendingUp, color: 'bg-cyan-50 text-cyan-600', iconBg: 'bg-cyan-100' },
    { label: 'Inactive Users', value: stats.overview.inactive_users, sub: 'Banned accounts', icon: Users, color: 'bg-red-50 text-red-600', iconBg: 'bg-red-100' },
    { label: 'Avg Rating', value: stats.overview.average_rating?.toFixed(2) ?? '—', sub: 'All services', icon: BarChart3, color: 'bg-indigo-50 text-indigo-600', iconBg: 'bg-indigo-100' },
  ]

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="section-title">Statistics & Analytics</h1>
        <p className="text-sm text-slate-500 mt-0.5">Full platform overview</p>
      </div>

      {/* Overview */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewCards.map(card => (
          <div key={card.label} className="card p-5">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', card.iconBg)}>
              <card.icon className={cn('w-5 h-5', card.color.split(' ')[1])} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{card.value}</p>
            <p className="text-xs font-medium text-slate-700 mt-0.5">{card.label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Top Viewed */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary-600" />Top 5 Most Viewed Services
          </h3>
          <div className="space-y-3">
            {stats.top_viewed_services.map((svc, i) => (
              <div key={svc.id} className="flex items-center gap-3">
                <span className={cn('w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                  i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-slate-100 text-slate-600' : 'bg-slate-50 text-slate-500')}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <Link href={`/services/${svc.id}`} className="text-sm font-medium text-slate-900 hover:text-primary-600 truncate block">{svc.title}</Link>
                  <p className="text-xs text-slate-400">{svc.category?.name}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-slate-900">{svc.view_count}</p>
                  <p className="text-xs text-slate-400">views</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Bookmarked */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <BookMarked className="w-4 h-4 text-amber-500" />Top 5 Most Bookmarked
          </h3>
          <div className="space-y-3">
            {stats.top_bookmarked_services.map((svc, i) => (
              <div key={svc.id} className="flex items-center gap-3">
                <span className={cn('w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                  i === 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-50 text-slate-500')}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <Link href={`/services/${svc.id}`} className="text-sm font-medium text-slate-900 hover:text-primary-600 truncate block">{svc.title}</Link>
                  <p className="text-xs text-slate-400">{svc.category?.name}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-slate-900">{svc._count?.bookmarks ?? 0}</p>
                  <p className="text-xs text-slate-400">saves</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Services per Category */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary-600" />Services by Category
          </h3>
          <div className="space-y-3">
            {stats.services_per_category.map(cat => {
              const max = stats.services_per_category[0]?._count?.services ?? 1
              const count = cat._count?.services ?? 0
              const pct = Math.round((count / max) * 100)
              return (
                <div key={cat.id}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="flex items-center gap-1.5 font-medium text-slate-700">
                      <span>{CATEGORY_ICONS[cat.name] ?? '📋'}</span>{cat.name}
                    </span>
                    <span className="text-slate-500 font-medium">{count}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Average rating breakdown */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" />Platform Rating
          </h3>
          <div className="flex flex-col items-center py-4">
            <p className="text-5xl font-black text-slate-900 mb-2">
              {stats.overview.average_rating?.toFixed(1) ?? '—'}
            </p>
            <StarRating rating={Math.round(stats.overview.average_rating ?? 0)} size="lg" />
            <p className="text-sm text-slate-500 mt-2">{stats.overview.total_feedbacks} total reviews</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminStatsPage() {
  return <AuthGuard requireAdmin><StatsContent /></AuthGuard>
}
