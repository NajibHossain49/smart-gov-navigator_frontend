'use client'
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TeamMember {
    id: string | number
    name: string
    designation: string
    department?: string
    office?: string
    email?: string
    phone?: string
    imageUrl?: string
    initials?: string
    color?: 'blue' | 'green' | 'amber' | 'rose' | 'purple' | 'teal'
}

interface TeamSectionProps {
    title?: string
    subtitle?: string
    members: TeamMember[]
    className?: string
}

const AVATAR_COLORS: Record<NonNullable<TeamMember['color']>, string> = {
    blue: 'bg-blue-50   text-blue-700   border-blue-200',
    green: 'bg-green-50  text-green-700  border-green-200',
    amber: 'bg-amber-50  text-amber-700  border-amber-200',
    rose: 'bg-rose-50   text-rose-700   border-rose-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    teal: 'bg-teal-50   text-teal-700   border-teal-200',
}

const DEPT_COLORS: Record<NonNullable<TeamMember['color']>, string> = {
    blue: 'bg-blue-50   text-blue-600   border-blue-200',
    green: 'bg-green-50  text-green-600  border-green-200',
    amber: 'bg-amber-50  text-amber-600  border-amber-200',
    rose: 'bg-rose-50   text-rose-600   border-rose-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    teal: 'bg-teal-50   text-teal-600   border-teal-200',
}

const COLOR_CYCLE: TeamMember['color'][] = ['blue', 'teal', 'green', 'amber', 'purple', 'rose']

function getInitials(name: string) {
    return name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
}

function MemberCard({ member, index }: { member: TeamMember; index: number }) {
    const color = member.color ?? COLOR_CYCLE[index % COLOR_CYCLE.length]!
    const initials = member.initials ?? getInitials(member.name)

    return (
        <div className="card-hover p-5 flex flex-col gap-4">
            {/* Top: Avatar + Name + Title */}
            <div className="flex items-center gap-3">
                {member.imageUrl ? (
                    <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                ) : (
                    <div
                        className={cn(
                            'w-12 h-12 rounded-xl border flex items-center justify-center text-sm font-semibold shrink-0',
                            AVATAR_COLORS[color]
                        )}
                    >
                        {initials}
                    </div>
                )}
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{member.name}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{member.designation}</p>
                </div>
            </div>

            {/* Department / Office badge */}
            {(member.department || member.office) && (
                <div className="flex flex-wrap gap-1.5">
                    {member.department && (
                        <span
                            className={cn(
                                'inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full border',
                                DEPT_COLORS[color]
                            )}
                        >
                            {member.department}
                        </span>
                    )}
                    {member.office && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border bg-slate-50 text-slate-500 border-slate-200">
                            <MapPin className="w-2.5 h-2.5" />
                            {member.office}
                        </span>
                    )}
                </div>
            )}

            {/* Contact Info */}
            {(member.email || member.phone) && (
                <div className="border-t border-slate-100 pt-3 flex flex-col gap-1.5">
                    {member.email && (
                        <a
                            href={`mailto:${member.email}`}
                            className="flex items-center gap-2 text-xs text-slate-500 hover:text-primary-600 transition-colors group"
                        >
                            <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-primary-500" />
                            <span className="truncate">{member.email}</span>
                            <ExternalLink className="w-2.5 h-2.5 ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                    )}
                    {member.phone && (
                        <a
                            href={`tel:${member.phone}`}
                            className="flex items-center gap-2 text-xs text-slate-500 hover:text-primary-600 transition-colors group"
                        >
                            <Phone className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-primary-500" />
                            <span className="truncate">{member.phone}</span>
                        </a>
                    )}
                </div>
            )}
        </div>
    )
}

export default function TeamSection({
    title = 'Our Best Team',
    subtitle = 'Meet our dedicated government office staff',
    members,
    className,
}: TeamSectionProps) {
    return (
        <section className={cn('page-container', className)}>
            <div className="flex flex-col items-center mb-6">
                <h2 className="section-title">{title}</h2>
                {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map((member, i) => (
                    <MemberCard key={member.id} member={member} index={i} />
                ))}
            </div>
        </section>
    )
}