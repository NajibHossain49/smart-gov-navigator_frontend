'use client'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import {
  Users, Building2, BookMarked, Star, TrendingUp,
  List, Tag, MapPin, MessageSquare, BarChart3, ArrowRight,
} from 'lucide-react'
import { adminApi } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'
import AuthGuard from '@/components/auth/AuthGuard'
import { CardSkeleton } from '@/components/ui/LoadingSpinner'

const adminNav = [
  { href: '/admin/services',   label: 'Service Management',  icon: List,         desc: 'Create, edit & delete services',     color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { href: '/admin/categories', label: 'Category Management', icon: Tag,          desc: 'Manage service categories',           color: 'bg-purple-50 text-purple-600 border-purple-100' },
  { href: '/admin/offices',    label: 'Office Management',   icon: MapPin,       desc: 'Add & update government offices',     color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  { href: '/admin/users',      label: 'User Management',     icon: Users,        desc: 'Ban, activate & manage roles',        color: 'bg-amber-50 text-amber-600 border-amber-100' },
  { href: '/admin/feedbacks',  label: 'Feedback Moderation', icon: MessageSquare,desc: 'Review & delete user feedback',       color: 'bg-rose-50 text-rose-600 border-rose-100' },
  { href: '/admin/stats',      label: 'Analytics & Stats',   icon: BarChart3,    desc: 'Platform insights and reports',       color: 'bg-cyan-50 text-cyan-600 border-cyan-100' },
]

function AdminDashboard() {
  const { user } = useAuthStore()

  const { data: statsRes, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: adminApi.getDashboardStats,
  })
  const stats = statsRes?.data?.data

  const overviewCards = stats ? [
    { label: 'Total Users',     value: stats.overview.total_users,     sub: `${stats.overview.active_users} active`,         icon: Users,      color: 'bg-blue-100 text-blue-700' },
    { label: 'Total Services',  value: stats.overview.total_services,  sub: `${stats.overview.total_categories} categories`, icon: Building2,  color: 'bg-emerald-100 text-emerald-700' },
    { label: 'Total Bookmarks', value: stats.overview.total_bookmarks, sub: 'Saved by users',                                icon: BookMarked, color: 'bg-amber-100 text-amber-700' },
    { label: 'Total Reviews',   value: stats.overview.total_feedbacks, sub: `Avg ${stats.overview.average_rating?.toFixed(1) ?? '—'} ★`, icon: Star, color: 'bg-pink-100 text-pink-700' },
  ] : []

  return (
    <div className="animate-fade-in space-y-7">

      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
        <p className="text-primary-200 text-sm mb-1">Welcome back,</p>
        <h1 className="text-2xl font-bold">{user?.name} 👋</h1>
        <p className="text-primary-100 text-sm mt-1">Here&apos;s what&apos;s happening on your platform today.</p>
      </div>

      {/* Overview Stats */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_,i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {overviewCards.map(card => (
            <div key={card.label} className="card p-5">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', card.color)}>
                <card.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{card.value}</p>
              <p className="text-sm font-medium text-slate-700 mt-0.5">{card.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{card.sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* Quick navigation to all admin sections */}
      <div>
        <h2 className="text-base font-semibold text-slate-900 mb-4">Admin Sections</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminNav.map(item => (
            <Link key={item.href} href={item.href}
              className={cn(
                'card-hover p-5 flex items-start gap-4 border',
                item.color.split(' ').slice(2).join(' ')
              )}>
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', item.color.split(' ').slice(0,2).join(' '))}>
                <item.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm">{item.label}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            </Link>
          ))}
        </div>
      </div>

      {/* Top viewed services */}
      {stats && stats.top_viewed_services.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary-600" />Top Viewed Services
            </h2>
            <Link href="/admin/stats" className="text-xs text-primary-600 hover:underline flex items-center gap-1">
              Full stats <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {stats.top_viewed_services.slice(0, 5).map((svc, i) => (
              <div key={svc.id} className="flex items-center gap-3 py-1.5">
                <span className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                  i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-slate-100 text-slate-600' : 'bg-slate-50 text-slate-400'
                )}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{svc.title}</p>
                  <p className="text-xs text-slate-400">{svc.category?.name}</p>
                </div>
                <span className="text-xs font-semibold text-slate-600 shrink-0">{svc.view_count} views</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminPage() {
  return <AuthGuard requireAdmin><AdminDashboard /></AuthGuard>
}
