'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, List, Tag, Building2,
  MessageSquare, Users, BarChart3, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/admin',            label: 'Dashboard',           icon: LayoutDashboard, exact: true },
  { href: '/admin/services',   label: 'Services',            icon: List },
  { href: '/admin/categories', label: 'Categories',          icon: Tag },
  { href: '/admin/offices',    label: 'Offices',             icon: Building2 },
  { href: '/admin/users',      label: 'Users',               icon: Users },
  { href: '/admin/feedbacks',  label: 'Feedback Moderation', icon: MessageSquare },
  { href: '/admin/stats',      label: 'Analytics',           icon: BarChart3 },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-52 shrink-0 hidden lg:block">
      <div className="card p-2 sticky top-24">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2 mb-1">
          Admin Panel
        </p>
        {links.map(link => {
          const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href)
          return (
            <Link key={link.href} href={link.href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}>
              <link.icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600')} />
              <span className="flex-1">{link.label}</span>
              {isActive && <ChevronRight className="w-3 h-3 text-primary-400" />}
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
