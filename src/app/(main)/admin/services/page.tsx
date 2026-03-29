'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Eye, Search } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { serviceApi, categoryApi } from '@/lib/api'
import { getErrorMessage, CATEGORY_COLORS, CATEGORY_ICONS, cn } from '@/lib/utils'
import AuthGuard from '@/components/auth/AuthGuard'
import Modal, { ConfirmModal } from '@/components/ui/Modal'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import Pagination from '@/components/ui/Pagination'
import type { Service, Category } from '@/types'

function ServiceFormModal({ isOpen, onClose, editTarget, categories }: {
  isOpen: boolean; onClose: () => void
  editTarget: Service | null; categories: Category[]
}) {
  const qc = useQueryClient()
  const [form, setForm] = useState({
    category_id: editTarget?.category_id?.toString() ?? '',
    title: editTarget?.title ?? '',
    description: editTarget?.description ?? '',
    application_process: editTarget?.application_process ?? '',
    fees: editTarget?.fees ?? '',
    processing_time: editTarget?.processing_time ?? '',
  })

  const mutation = useMutation({
    mutationFn: () => editTarget
      ? serviceApi.update(editTarget.id, { ...form, category_id: parseInt(form.category_id) } as Parameters<typeof serviceApi.update>[1])
      : serviceApi.create({ ...form, category_id: parseInt(form.category_id) } as Parameters<typeof serviceApi.create>[0]),
    onSuccess: () => {
      toast.success(editTarget ? 'Service updated!' : 'Service created!')
      qc.invalidateQueries({ queryKey: ['services'] })
      onClose()
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const f = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [field]: e.target.value }))

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editTarget ? 'Edit Service' : 'New Service'} size="lg">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="label">Category *</label>
          <select className="input" value={form.category_id} onChange={f('category_id')}>
            <option value="">Select category...</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label">Title *</label>
          <input className="input" placeholder="e.g. Passport Application" value={form.title} onChange={f('title')} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Description</label>
          <textarea className="input resize-none" rows={3} placeholder="Brief description of the service..."
            value={form.description} onChange={f('description')} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Application Process</label>
          <textarea className="input resize-none" rows={2} placeholder="How to apply..."
            value={form.application_process} onChange={f('application_process')} />
        </div>
        <div>
          <label className="label">Fees</label>
          <input className="input" placeholder="e.g. BDT 3,000" value={form.fees} onChange={f('fees')} />
        </div>
        <div>
          <label className="label">Processing Time</label>
          <input className="input" placeholder="e.g. 7–14 working days" value={form.processing_time} onChange={f('processing_time')} />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4 mt-2 border-t border-slate-100">
        <button onClick={onClose} className="btn-secondary text-sm px-4">Cancel</button>
        <button onClick={() => mutation.mutate()} disabled={!form.title || !form.category_id || mutation.isPending}
          className="btn-primary text-sm px-4">
          {mutation.isPending ? 'Saving...' : editTarget ? 'Update' : 'Create'}
        </button>
      </div>
    </Modal>
  )
}

function ServicesAdminContent() {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState<Service | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['services', 'all', page],
    queryFn: () => serviceApi.getAll(page, 10),
  })

  const { data: catRes } = useQuery({ queryKey: ['categories'], queryFn: categoryApi.getAll })
  const categories: Category[] = catRes?.data?.data ?? []

  const services: Service[] = data?.data?.data?.services ?? []
  const totalPages = data?.data?.data?.pagination?.totalPages ?? 1

  const filtered = search
    ? services.filter(s => s.title.toLowerCase().includes(search.toLowerCase()))
    : services

  const openCreate = () => { setEditTarget(null); setShowForm(true) }
  const openEdit = (s: Service) => { setEditTarget(s); setShowForm(true) }

  const deleteMutation = useMutation({
    mutationFn: () => serviceApi.delete(deleteTarget!.id),
    onSuccess: () => {
      toast.success('Service deleted.')
      qc.invalidateQueries({ queryKey: ['services'] })
      setDeleteTarget(null)
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title">Services</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage all government services</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> New Service
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input className="input pl-9 text-sm" placeholder="Filter services..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {isLoading ? <PageLoader /> : (
        <>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Title', 'Category', 'Fees', 'Views', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(svc => (
                  <tr key={svc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 max-w-xs">
                      <p className="font-medium text-slate-900 truncate">{svc.title}</p>
                      {svc.processing_time && <p className="text-xs text-slate-400 truncate">{svc.processing_time}</p>}
                    </td>
                    <td className="px-5 py-3">
                      <span className={cn('badge text-xs', CATEGORY_COLORS[svc.category?.name ?? ''] ?? 'bg-slate-50 text-slate-600 border-slate-200')}>
                        {CATEGORY_ICONS[svc.category?.name ?? '']} {svc.category?.name}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-500 max-w-[120px] truncate">{svc.fees ?? '—'}</td>
                    <td className="px-5 py-3 text-xs font-medium text-slate-600">{svc.view_count}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <Link href={`/services/${svc.id}`}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button onClick={() => openEdit(svc)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleteTarget(svc)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!search && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
        </>
      )}

      <ServiceFormModal
        isOpen={showForm} onClose={() => setShowForm(false)}
        editTarget={editTarget} categories={categories} />

      <ConfirmModal
        isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate()} loading={deleteMutation.isPending}
        title="Delete Service"
        message={`Delete "${deleteTarget?.title}"? This will also remove all steps, documents, and mappings.`} />
    </div>
  )
}

export default function AdminServicesPage() {
  return <AuthGuard requireAdmin><ServicesAdminContent /></AuthGuard>
}
