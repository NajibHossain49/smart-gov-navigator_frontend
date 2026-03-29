'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { BookMarked, BookMarked as BookMarkedFill, MapPin, Phone, Clock,
         FileText, ChevronRight, Star, CheckCircle2, XCircle, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { serviceApi, bookmarkApi, feedbackApi } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { CATEGORY_COLORS, CATEGORY_ICONS, cn, getErrorMessage, formatDate } from '@/lib/utils'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import StarRating from '@/components/ui/StarRating'
import type { Feedback, EligibilityAnswer } from '@/types'

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const serviceId = parseInt(id)
  const qc = useQueryClient()
  const { isAuthenticated } = useAuthStore()

  const [activeTab, setActiveTab] = useState<'steps'|'docs'|'offices'|'feedback'|'eligibility'>('steps')
  const [bookmarked, setBookmarked] = useState(false)
  const [bookmarkId, setBookmarkId] = useState<number|null>(null)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [eligibilityAnswers, setEligibilityAnswers] = useState<Record<number, string>>({})
  const [eligibilityResult, setEligibilityResult] = useState<null | { eligible: boolean; results: { rule_id: number; question: string; passed: boolean; reason: string }[] }>(null)

  const { data: svcRes, isLoading } = useQuery({
    queryKey: ['service', serviceId],
    queryFn: () => serviceApi.getById(serviceId),
  })

  const { data: relatedRes } = useQuery({
    queryKey: ['service', serviceId, 'related'],
    queryFn: () => serviceApi.getRelated(serviceId),
    enabled: !!serviceId,
  })

  const { data: eligRes } = useQuery({
    queryKey: ['service', serviceId, 'eligibility'],
    queryFn: () => serviceApi.getEligibilityRules(serviceId),
    enabled: activeTab === 'eligibility',
  })

  // Check bookmark status
  useQuery({
    queryKey: ['bookmarks', 'check', serviceId],
    queryFn: async () => {
      const res = await bookmarkApi.getAll()
      const bm = res.data.data?.bookmarks.find(b => b.service_id === serviceId)
      if (bm) { setBookmarked(true); setBookmarkId(bm.id) }
      return bm
    },
    enabled: isAuthenticated,
  })

  const bookmarkMutation = useMutation({
    mutationFn: () => bookmarked ? bookmarkApi.remove(bookmarkId!) : bookmarkApi.add(serviceId),
    onSuccess: (res) => {
      if (!bookmarked) {
        setBookmarkId((res as { data: { data: { id: number } } }).data?.data?.id)
        setBookmarked(true)
        toast.success('Service bookmarked!')
      } else {
        setBookmarked(false); setBookmarkId(null)
        toast.success('Bookmark removed.')
      }
      qc.invalidateQueries({ queryKey: ['bookmarks'] })
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const feedbackMutation = useMutation({
    mutationFn: () => feedbackApi.create({ service_id: serviceId, rating, comment }),
    onSuccess: () => {
      toast.success('Feedback submitted!')
      setRating(0); setComment('')
      qc.invalidateQueries({ queryKey: ['service', serviceId] })
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const eligibilityMutation = useMutation({
    mutationFn: () => {
      const rules: { id: number }[] = eligRes?.data?.data?.rules ?? []
      const answers: EligibilityAnswer[] = rules.map(r => ({ rule_id: r.id, answer: eligibilityAnswers[r.id] ?? '' }))
      return serviceApi.checkEligibility(serviceId, answers)
    },
    onSuccess: (res) => setEligibilityResult(res.data.data),
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  if (isLoading) return <PageLoader />

  const service = svcRes?.data?.data
  if (!service) return <div className="page-container text-center py-20 text-slate-500">Service not found.</div>

  const related = relatedRes?.data?.data?.related_services ?? []
  const eligibilityRules = eligRes?.data?.data?.rules ?? []
  const feedbacks: Feedback[] = service.feedbacks ?? []

  const tabs = [
    { key: 'steps', label: 'Steps', count: service.steps?.length },
    { key: 'docs', label: 'Documents', count: service.required_documents?.length },
    { key: 'offices', label: 'Offices', count: service.service_offices?.length },
    { key: 'feedback', label: 'Reviews', count: feedbacks.length },
    { key: 'eligibility', label: 'Eligibility', count: null },
  ] as const

  return (
    <div className="page-container animate-fade-in">
      <div className="grid lg:grid-cols-3 gap-6">

        {/* ── Main Content ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Header card */}
          <div className="card p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <span className={cn('badge text-xs mb-3 inline-flex', CATEGORY_COLORS[service.category?.name ?? ''] ?? 'bg-slate-50 text-slate-600 border-slate-200')}>
                  {CATEGORY_ICONS[service.category?.name ?? '']} {service.category?.name}
                </span>
                <h1 className="text-xl font-bold text-slate-900 leading-snug">{service.title}</h1>
                {service.description && (
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{service.description}</p>
                )}
              </div>
              {isAuthenticated && (
                <button onClick={() => bookmarkMutation.mutate()} disabled={bookmarkMutation.isPending}
                  className={cn('p-2.5 rounded-lg border transition-colors shrink-0',
                    bookmarked ? 'bg-primary-50 border-primary-200 text-primary-600' : 'bg-white border-slate-200 text-slate-400 hover:border-primary-200')}>
                  <BookMarked className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Key info */}
            <div className="grid grid-cols-2 gap-3">
              {service.fees && (
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-0.5">Fees</p>
                  <p className="text-sm font-medium text-slate-900">{service.fees}</p>
                </div>
              )}
              {service.processing_time && (
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-0.5">Processing Time</p>
                  <p className="text-sm font-medium text-slate-900">{service.processing_time}</p>
                </div>
              )}
            </div>

            {service.application_process && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs font-medium text-blue-700 mb-1">Application Process</p>
                <p className="text-xs text-blue-600 leading-relaxed">{service.application_process}</p>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="card overflow-hidden">
            <div className="flex border-b border-slate-100 overflow-x-auto">
              {tabs.map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={cn('px-4 py-3 text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-colors border-b-2 -mb-px',
                    activeTab === tab.key
                      ? 'border-primary-600 text-primary-700 bg-primary-50/50'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50')}>
                  {tab.label}
                  {tab.count != null && (
                    <span className={cn('inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px]',
                      activeTab === tab.key ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-500')}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="p-5">
              {/* Steps */}
              {activeTab === 'steps' && (
                <div className="space-y-3">
                  {service.steps?.length ? service.steps.map((step, i) => (
                    <div key={step.id} className="flex gap-4">
                      <div className="flex flex-col items-center shrink-0">
                        <div className="w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">{step.step_number}</div>
                        {i < (service.steps?.length ?? 0) - 1 && <div className="w-px flex-1 bg-slate-200 mt-1" />}
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-semibold text-slate-900 mb-0.5">{step.step_title}</p>
                        {step.step_description && <p className="text-xs text-slate-500 leading-relaxed">{step.step_description}</p>}
                      </div>
                    </div>
                  )) : <p className="text-sm text-slate-500">No steps available.</p>}
                </div>
              )}

              {/* Documents */}
              {activeTab === 'docs' && (
                <div className="space-y-2">
                  {service.required_documents?.length ? service.required_documents.map((doc) => (
                    <div key={doc.id} className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                      <FileText className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{doc.document_name}</p>
                        {doc.description && <p className="text-xs text-slate-500 mt-0.5">{doc.description}</p>}
                      </div>
                    </div>
                  )) : <p className="text-sm text-slate-500">No documents listed.</p>}
                </div>
              )}

              {/* Offices */}
              {activeTab === 'offices' && (
                <div className="space-y-3">
                  {service.service_offices?.length ? service.service_offices.map((so) => (
                    <div key={so.id} className="p-4 rounded-lg border border-slate-100">
                      <p className="text-sm font-semibold text-slate-900 mb-1.5">{so.office.name}</p>
                      <div className="space-y-1 text-xs text-slate-500">
                        {so.office.address && <div className="flex gap-2"><MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />{so.office.address}</div>}
                        {so.office.phone && <div className="flex gap-2"><Phone className="w-3.5 h-3.5" />{so.office.phone}</div>}
                        {so.office.office_hours && <div className="flex gap-2"><Clock className="w-3.5 h-3.5" />{so.office.office_hours}</div>}
                      </div>
                    </div>
                  )) : <p className="text-sm text-slate-500">No offices linked.</p>}
                </div>
              )}

              {/* Feedback */}
              {activeTab === 'feedback' && (
                <div className="space-y-4">
                  {isAuthenticated && (
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-sm font-medium text-slate-900 mb-3">Leave a Review</p>
                      <div className="mb-3">
                        <p className="text-xs text-slate-500 mb-1.5">Your Rating</p>
                        <StarRating rating={rating} interactive onChange={setRating} size="lg" />
                      </div>
                      <textarea className="input resize-none text-xs" rows={3}
                        placeholder="Share your experience with this service..."
                        value={comment} onChange={e => setComment(e.target.value)} />
                      <button onClick={() => { if (!rating) { toast.error('Please select a rating.'); return } feedbackMutation.mutate() }}
                        disabled={feedbackMutation.isPending}
                        className="btn-primary mt-2 text-xs px-4 py-2">
                        <Send className="w-3 h-3" />Submit Review
                      </button>
                    </div>
                  )}

                  {feedbacks.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-6">No reviews yet. Be the first!</p>
                  ) : feedbacks.map((fb) => (
                    <div key={fb.id} className="p-4 border border-slate-100 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-primary-700">{fb.user?.name?.charAt(0)}</span>
                          </div>
                          <span className="text-sm font-medium text-slate-900">{fb.user?.name}</span>
                        </div>
                        <StarRating rating={fb.rating} size="sm" />
                      </div>
                      {fb.comment && <p className="text-xs text-slate-600 leading-relaxed">{fb.comment}</p>}
                      <p className="text-xs text-slate-400 mt-2">{formatDate(fb.created_at)}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Eligibility */}
              {activeTab === 'eligibility' && (
                <div className="space-y-4">
                  <p className="text-sm text-slate-600">Answer these questions to check if you are eligible for this service.</p>

                  {eligibilityRules.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-2" />
                      <p className="text-sm font-medium text-slate-900">No restrictions</p>
                      <p className="text-xs text-slate-500">This service is available to all applicants.</p>
                    </div>
                  ) : (
                    <>
                      {eligibilityRules.map((rule: { id: number; question: string; answer_type: string; description?: string }) => (
                        <div key={rule.id} className="p-4 border border-slate-200 rounded-lg">
                          <p className="text-sm font-medium text-slate-900 mb-3">{rule.question}</p>
                          {rule.answer_type === 'yes_no' && (
                            <div className="flex gap-2">
                              {['yes', 'no'].map(opt => (
                                <button key={opt} onClick={() => setEligibilityAnswers(p => ({ ...p, [rule.id]: opt }))}
                                  className={cn('px-4 py-2 rounded-lg text-sm font-medium border transition-colors',
                                    eligibilityAnswers[rule.id] === opt
                                      ? 'bg-primary-600 text-white border-primary-600'
                                      : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300')}>
                                  {opt === 'yes' ? '✅ Yes' : '❌ No'}
                                </button>
                              ))}
                            </div>
                          )}
                          {rule.answer_type === 'age' && (
                            <input type="number" className="input w-32" placeholder="Your age"
                              value={eligibilityAnswers[rule.id] ?? ''}
                              onChange={e => setEligibilityAnswers(p => ({ ...p, [rule.id]: e.target.value }))} />
                          )}
                          {rule.answer_type === 'text' && (
                            <input type="text" className="input" placeholder="Enter answer"
                              value={eligibilityAnswers[rule.id] ?? ''}
                              onChange={e => setEligibilityAnswers(p => ({ ...p, [rule.id]: e.target.value }))} />
                          )}
                        </div>
                      ))}

                      <button onClick={() => eligibilityMutation.mutate()}
                        disabled={eligibilityMutation.isPending} className="btn-primary text-sm">
                        Check Eligibility
                      </button>

                      {eligibilityResult && (
                        <div className={cn('p-4 rounded-xl border', eligibilityResult.eligible ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200')}>
                          <div className="flex items-center gap-2 mb-3">
                            {eligibilityResult.eligible
                              ? <CheckCircle2 className="w-5 h-5 text-green-600" />
                              : <XCircle className="w-5 h-5 text-red-600" />}
                            <p className={cn('font-semibold text-sm', eligibilityResult.eligible ? 'text-green-800' : 'text-red-800')}>
                              {eligibilityResult.eligible ? 'You are eligible!' : 'You may not be eligible.'}
                            </p>
                          </div>
                          <div className="space-y-1.5">
                            {eligibilityResult.results.map((r) => (
                              <div key={r.rule_id} className="flex items-start gap-2 text-xs">
                                {r.passed ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5" /> : <XCircle className="w-3.5 h-3.5 text-red-500 mt-0.5" />}
                                <span className={r.passed ? 'text-green-700' : 'text-red-700'}>{r.reason}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-5">
          {/* Quick stats */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Quick Info</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Views</span><span className="font-medium">{service.view_count}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Reviews</span><span className="font-medium">{service._count?.feedbacks ?? 0}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Bookmarks</span><span className="font-medium">{service._count?.bookmarks ?? 0}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Steps</span><span className="font-medium">{service.steps?.length ?? 0}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Documents</span><span className="font-medium">{service.required_documents?.length ?? 0}</span></div>
            </div>
          </div>

          {/* Related services */}
          {related.length > 0 && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Related Services</h3>
              <div className="space-y-2">
                {related.map(r => (
                  <Link key={r.id} href={`/services/${r.id}`}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors group">
                    <span className="text-xs text-slate-700 group-hover:text-primary-600 font-medium leading-snug pr-2">{r.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary-600 shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Login prompt */}
          {!isAuthenticated && (
            <div className="card p-5 bg-primary-50 border-primary-100">
              <Star className="w-6 h-6 text-primary-500 mb-2" />
              <p className="text-sm font-semibold text-primary-900 mb-1">Save this service</p>
              <p className="text-xs text-primary-700 mb-3">Sign in to bookmark and track your services.</p>
              <Link href="/login" className="btn-primary w-full text-xs py-2">Sign In</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
