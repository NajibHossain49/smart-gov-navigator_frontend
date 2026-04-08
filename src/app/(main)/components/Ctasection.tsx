'use client'
import Link from 'next/link'
import { BookMarked, Sparkles, ArrowRight } from 'lucide-react'

export default function CTASection() {
    return (
        <section className="relative py-20 overflow-hidden bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900">
            {/* Decorative blobs */}
            <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-sky-500/15 blur-3xl" />
            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-40 rounded-full bg-primary-400/10 blur-2xl" />

            {/* Grid texture overlay */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                    backgroundSize: '28px 28px',
                }}
            />

            <div className="relative max-w-2xl mx-auto text-center px-6">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary-400/30 bg-primary-400/10 text-primary-300 text-xs font-semibold tracking-widest uppercase mb-6">
                    <Sparkles className="w-3.5 h-3.5" />
                    Free Account
                </div>

                {/* Icon */}
                <div className="flex items-center justify-center mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-primary-500/20 border border-primary-400/30 flex items-center justify-center">
                        <BookMarked className="w-8 h-8 text-primary-300" />
                    </div>
                </div>

                {/* Heading */}
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight tracking-tight">
                    Save Your{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-sky-300">
                        Favorite Services
                    </span>
                </h2>

                {/* Description */}
                <p className="text-slate-400 text-sm sm:text-base mb-8 max-w-md mx-auto leading-relaxed">
                    Create a free account to bookmark services, track your history, and get personalized updates from Bangladesh government.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        href="/register"
                        className="group inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-400 text-white font-semibold px-7 py-3 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-primary-500/25 hover:shadow-primary-400/30 hover:-translate-y-0.5"
                    >
                        Get Started Free
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 hover:border-white/20 font-medium px-7 py-3 rounded-xl text-sm transition-all duration-200"
                    >
                        Browse Services
                    </Link>
                </div>

                {/* Trust row */}
                <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500">
                    {['No credit card required', 'Free forever', 'Instant access'].map((item, i) => (
                        <span key={i} className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-primary-500" />
                            {item}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    )
}