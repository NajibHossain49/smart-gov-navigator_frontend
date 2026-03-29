'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminApi } from '@/lib/api'
import { getErrorMessage, formatDate } from '@/lib/utils'
import AuthGuard from '@/components/auth/AuthGuard'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'
import StarRating from '@/components/ui/StarRating'

function FeedbacksContent() {
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'feedbacks'],
    queryFn: adminApi.getAllFeedbacks,
  })

  const feedbacks = data?.data?.data?.feedbacks ?? []

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteFeedback(id),
    onSuccess: () => { toast.success('Feedback deleted.'); qc.invalidateQueries({ queryKey: ['admin', 'feedbacks'] }) },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="section-title">Feedback Moderation</h1>
        <p className="text-sm text-slate-500 mt-0.5">{feedbacks.length} total reviews</p>
      </div>

      {isLoading ? <PageLoader /> : feedbacks.length === 0 ? (
        <EmptyState icon="💬" title="No feedbacks yet" description="User reviews will appear here." />
      ) : (
        <div className="space-y-3">
          {feedbacks.map((fb: {
            id: number; rating: number; comment?: string; created_at: string
            user?: { name: string; email: string }
            service?: { id: number; title: string }
          }) => (
            <div key={fb.id} className="card p-5 flex gap-4">
              {/* User avatar */}
              <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-primary-700">{fb.user?.name?.charAt(0)}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-sm font-semibold text-slate-900">{fb.user?.name}</span>
                  <span className="text-xs text-slate-400">{fb.user?.email}</span>
                  <span className="text-xs text-slate-300">·</span>
                  <Link href={`/services/${fb.service?.id}`}
                    className="text-xs text-primary-600 hover:underline font-medium">{fb.service?.title}</Link>
                </div>
                <StarRating rating={fb.rating} size="sm" />
                {fb.comment && <p className="text-sm text-slate-600 mt-2 leading-relaxed">{fb.comment}</p>}
                <p className="text-xs text-slate-400 mt-2">{formatDate(fb.created_at)}</p>
              </div>

              <button onClick={() => { if (confirm('Delete this feedback?')) deleteMutation.mutate(fb.id) }}
                className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors self-start shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AdminFeedbacksPage() {
  return <AuthGuard requireAdmin><FeedbacksContent /></AuthGuard>
}
