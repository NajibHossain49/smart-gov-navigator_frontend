'use client'
import Link from 'next/link'
import { ArrowRight, FileText, Building2, Star } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { serviceApi } from '@/lib/api'
import { CATEGORY_COLORS, cn } from '@/lib/utils'
import { CardSkeleton } from '@/components/ui/LoadingSpinner'
import type { Service } from '@/types'

export default function FeaturedServicesSection() {
    const { data: servicesRes, isLoading: svcLoading } = useQuery({
        queryKey: ['services', 'home'],
        queryFn: () => serviceApi.getAll(1, 6),
    })

    const services: Service[] = servicesRes?.data?.data?.services ?? []

    return (
        <section className="bg-slate-50/80 py-12">
            <div className="page-container !py-0">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="section-title">Popular Services</h2>
                        <p className="text-sm text-slate-500 mt-1">Most accessed government services</p>
                    </div>
                    <Link
                        href="/services"
                        className="text-sm text-primary-600 font-medium hover:underline flex items-center gap-1"
                    >
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
    )
}