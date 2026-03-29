'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LogOut, User, BookMarked, LayoutDashboard, Menu, X, Shield } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/lib/api'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/',         label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/offices',  label: 'Offices' },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, isAdmin, clearAuth, initFromStorage } = useAuthStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  // Re-sync on every navigation
  useEffect(() => {
    initFromStorage()
  }, [pathname, initFromStorage])

  const handleLogout = async () => {
    try { await authApi.logout() } finally {
      clearAuth()
      toast.success('Logged out successfully.')
      router.push('/')
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-nav border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center
                            group-hover:bg-primary-700 transition-colors">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-slate-900 text-sm leading-none block">GovNavigator</span>
              <span className="text-xs text-slate-500 leading-none">Bangladesh</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                )}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                             text-slate-700 hover:bg-slate-50 transition-colors">
                  <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-700">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:block max-w-24 truncate">{user?.name}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl border border-slate-200
                                  shadow-lg py-1 animate-slide-down z-50">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="text-sm font-medium text-slate-900 truncate">{user?.email}</p>
                      <p className="text-xs text-primary-600 font-medium mt-0.5">
                        {isAdmin ? '🔑 Admin' : '👤 User'}
                      </p>
                    </div>
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        <LayoutDashboard className="w-4 h-4" />Admin Dashboard
                      </Link>
                    )}
                    <Link href="/dashboard" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                      <User className="w-4 h-4" />My Profile
                    </Link>
                    <Link href="/dashboard/bookmarks" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                      <BookMarked className="w-4 h-4" />My Bookmarks
                    </Link>
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full">
                        <LogOut className="w-4 h-4" />Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="btn-secondary text-xs px-4 py-2">Sign In</Link>
                <Link href="/register" className="btn-primary text-xs px-4 py-2">Register</Link>
              </div>
            )}

            <button className="md:hidden p-2 rounded-lg hover:bg-slate-50"
              onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 py-3 space-y-1 animate-slide-down">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'block px-3 py-2 rounded-lg text-sm font-medium',
                  pathname === link.href
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-50'
                )}>
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin" onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-purple-700 bg-purple-50">
                🔑 Admin Panel
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
