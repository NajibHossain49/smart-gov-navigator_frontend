import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="text-8xl font-black text-slate-200 mb-4 select-none">404</div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Page not found</h1>
      <p className="text-slate-500 text-sm mb-8 max-w-sm">
        Sorry, we couldn&apos;t find the page you were looking for.
      </p>
      <div className="flex gap-3">
        <Link href="/" className="btn-primary text-sm">Go Home</Link>
        <Link href="/services" className="btn-secondary text-sm">Browse Services</Link>
      </div>
    </div>
  )
}
