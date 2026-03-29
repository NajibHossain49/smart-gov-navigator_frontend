'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MapPin, Phone, Mail, Clock, Search, Building2 } from 'lucide-react'
import { officeApi } from '@/lib/api'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'
import type { GovernmentOffice } from '@/types'

const BD_DISTRICTS = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Gazipur', 'Narayanganj']

export default function OfficesPage() {
  const [district, setDistrict] = useState('')
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['offices', district],
    queryFn: () => officeApi.getAll(district ? { district } : undefined),
  })

  const offices: GovernmentOffice[] = data?.data?.data ?? []
  const filtered = offices.filter(o =>
    !search || o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.office_type?.toLowerCase().includes(search.toLowerCase())
  )

  if (isLoading) return <PageLoader />

  return (
    <div className="page-container animate-fade-in">
      <div className="mb-8">
        <h1 className="section-title mb-1">Government Offices</h1>
        <p className="text-sm text-slate-500">Find government offices near you by district</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input className="input pl-9" placeholder="Search offices..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input sm:w-48"
          value={district} onChange={e => setDistrict(e.target.value)}>
          <option value="">All Districts</option>
          {BD_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-500 mb-4">{filtered.length} office{filtered.length !== 1 ? 's' : ''} found</p>

      {filtered.length === 0 ? (
        <EmptyState icon="🏛️" title="No offices found"
          description="Try a different district or search term." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((office) => (
            <div key={office.id} className="card p-5 hover:shadow-card-hover transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4 text-primary-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900 text-sm leading-snug">{office.name}</h3>
                  {office.office_type && (
                    <span className="text-xs text-primary-600 font-medium">{office.office_type}</span>
                  )}
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-500">
                {office.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
                    <span>{office.address}{office.district ? `, ${office.district}` : ''}</span>
                  </div>
                )}
                {office.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <a href={`tel:${office.phone}`} className="hover:text-primary-600">{office.phone}</a>
                  </div>
                )}
                {office.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <a href={`mailto:${office.email}`} className="hover:text-primary-600 truncate">{office.email}</a>
                  </div>
                )}
                {office.office_hours && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span>{office.office_hours}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
