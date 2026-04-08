'use client'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { categoryApi } from '@/lib/api'
import { CATEGORY_ICONS, CATEGORY_COLORS, cn } from '@/lib/utils'
import { CardSkeleton } from '@/components/ui/LoadingSpinner'
import type { Category } from '@/types'

export default function CategoriesSection() {
    const { data: categoriesRes, isLoading: catLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: () => categoryApi.getAll(),
    })

    const categories: Category[] = categoriesRes?.data?.data ?? []

    return (
        <section className="page-container">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="section-title">Browse by Category</h2>
                    <p className="text-sm text-slate-500 mt-1">Find services organized by type</p>
                </div>
                <Link
                    href="/services"
                    className="text-sm text-primary-600 font-medium hover:underline flex items-center gap-1"
                >
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
    )
}