'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { User, BookMarked, Clock, Star, Trash2, Eye, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { userApi, bookmarkApi } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { getErrorMessage, formatDate, CATEGORY_COLORS, CATEGORY_ICONS, cn } from '@/lib/utils'
import AuthGuard from '@/components/auth/AuthGuard'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'

function DashboardContent() {
  const qc = useQueryClient()
  const { user, updateUser } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'profile'|'bookmarks'|'history'>('profile')
  const [form, setForm] = useState({ name: user?.name ?? '', password: '' })

  const { data: bookmarksRes, isLoading: bmLoading } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: bookmarkApi.getAll,
  })

  const { data: historyRes, isLoading: histLoading } = useQuery({
    queryKey: ['recently-viewed'],
    queryFn: userApi.getRecentlyViewed,
    enabled: activeTab === 'history',
  })

  const updateMutation = useMutation({
    mutationFn: () => userApi.updateProfile({ name: form.name || undefined, password: form.password || undefined }),
    onSuccess: (res) => {
      updateUser(res.data.data)
      toast.success('Profile updated!')
      setForm(p => ({ ...p, password: '' }))
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const removeBmMutation = useMutation({
    mutationFn: (id: number) => bookmarkApi.remove(id),
    onSuccess: () => { toast.success('Bookmark removed.'); qc.invalidateQueries({ queryKey: ['bookmarks'] }) },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const clearHistoryMutation = useMutation({
    mutationFn: userApi.clearRecentlyViewed,
    onSuccess: () => { toast.success('History cleared.'); qc.invalidateQueries({ queryKey: ['recently-viewed'] }) },
  })

  const bookmarks = bookmarksRes?.data?.data?.bookmarks ?? []
  const history = historyRes?.data?.data?.services ?? []

  const tabs = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'bookmarks', label: `Bookmarks (${bookmarks.length})`, icon: BookMarked },
    { key: 'history', label: 'Recently Viewed', icon: Clock },
  ] as const

  return (
    <div className="page-container animate-fade-in">
      <div className="mb-7">
        <h1 className="section-title">My Dashboard</h1>
        <p className="text-sm text-slate-500">Manage your account, bookmarks, and activity</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar nav */}
        <div className="lg:col-span-1">
          <div className="card p-2">
            {tabs.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={cn('w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left',
                  activeTab === tab.key ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50')}>
                <tab.icon className="w-4 h-4" />{tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">

          {/* Profile */}
          {activeTab === 'profile' && (
            <div className="card p-6">
              <h2 className="text-base font-semibold text-slate-900 mb-5">Profile Information</h2>

              <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-xl">
                <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-primary-700">{user?.name?.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{user?.name}</p>
                  <p className="text-sm text-slate-500">{user?.email}</p>
                  <span className={cn('badge mt-1 text-xs',
                    user?.role?.role_name === 'Admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200')}>
                    {user?.role?.role_name}
                  </span>
                </div>
              </div>

              <div className="space-y-4 max-w-md">
                <div>
                  <label className="label">Full Name</label>
                  <input className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label className="label">New Password <span className="text-slate-400 font-normal">(leave blank to keep current)</span></label>
                  <input type="password" className="input" placeholder="Min. 6 characters"
                    value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
                </div>
                <button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}
                  className="btn-primary text-sm"><Save className="w-4 h-4" />Save Changes</button>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 text-xs text-slate-400 space-y-1">
                <p>Member since: {user?.created_at ? formatDate(user.created_at) : '—'}</p>
              </div>
            </div>
          )}

          {/* Bookmarks */}
          {activeTab === 'bookmarks' && (
            <div className="card p-6">
              <h2 className="text-base font-semibold text-slate-900 mb-5">Saved Services</h2>
              {bmLoading ? <PageLoader /> : bookmarks.length === 0 ? (
                <EmptyState icon="🔖" title="No bookmarks yet"
                  description="Browse services and bookmark them for quick access."
                  action={<Link href="/services" className="btn-primary text-sm">Browse Services</Link>} />
              ) : (
                <div className="space-y-3">
                  {bookmarks.map(bm => (
                    <div key={bm.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{bm.service?.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={cn('badge text-xs', CATEGORY_COLORS[bm.service?.category?.name ?? ''] ?? 'bg-slate-50 text-slate-500 border-slate-200')}>
                            {CATEGORY_ICONS[bm.service?.category?.name ?? '']} {bm.service?.category?.name}
                          </span>
                          <span className="text-xs text-slate-400">{formatDate(bm.created_at)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Link href={`/services/${bm.service_id}`} className="p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-primary-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button onClick={() => removeBmMutation.mutate(bm.id)}
                          disabled={removeBmMutation.isPending}
                          className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* History */}
          {activeTab === 'history' && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-slate-900">Recently Viewed</h2>
                {history.length > 0 && (
                  <button onClick={() => clearHistoryMutation.mutate()}
                    className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1">
                    <Trash2 className="w-3.5 h-3.5" />Clear history
                  </button>
                )}
              </div>
              {histLoading ? <PageLoader /> : history.length === 0 ? (
                <EmptyState icon="🕐" title="No history yet"
                  description="Services you view will appear here." />
              ) : (
                <div className="space-y-2">
                  {history.map((svc: { id: number; title: string; category?: { name: string }; view_count: number }) => (
                    <Link key={svc.id} href={`/services/${svc.id}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 group-hover:text-primary-600 truncate">{svc.title}</p>
                        <p className="text-xs text-slate-400">{svc.category?.name}</p>
                      </div>
                      <Star className="w-3.5 h-3.5 text-slate-300 group-hover:text-primary-400 shrink-0" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return <AuthGuard><DashboardContent /></AuthGuard>
}
