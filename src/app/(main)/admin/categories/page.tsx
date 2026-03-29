'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Tag } from 'lucide-react'
import toast from 'react-hot-toast'
import { categoryApi } from '@/lib/api'
import { getErrorMessage, formatDate } from '@/lib/utils'
import AuthGuard from '@/components/auth/AuthGuard'
import Modal, { ConfirmModal } from '@/components/ui/Modal'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import type { Category } from '@/types'

function CategoriesContent() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState<Category | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const [form, setForm] = useState({ name: '', description: '' })

  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getAll,
  })
  const categories: Category[] = data?.data?.data ?? []

  const openCreate = () => { setForm({ name: '', description: '' }); setEditTarget(null); setShowForm(true) }
  const openEdit = (cat: Category) => { setForm({ name: cat.name, description: cat.description ?? '' }); setEditTarget(cat); setShowForm(true) }

  const saveMutation = useMutation({
    mutationFn: () => editTarget
      ? categoryApi.update(editTarget.id, form)
      : categoryApi.create(form),
    onSuccess: () => {
      toast.success(editTarget ? 'Category updated!' : 'Category created!')
      qc.invalidateQueries({ queryKey: ['categories'] })
      setShowForm(false)
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const deleteMutation = useMutation({
    mutationFn: () => categoryApi.delete(deleteTarget!.id),
    onSuccess: () => {
      toast.success('Category deleted.')
      qc.invalidateQueries({ queryKey: ['categories'] })
      setDeleteTarget(null)
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title">Categories</h1>
          <p className="text-sm text-slate-500 mt-0.5">{categories.length} total categories</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> New Category
        </button>
      </div>

      {isLoading ? <PageLoader /> : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Name', 'Description', 'Services', 'Created', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {categories.map(cat => (
                <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Tag className="w-3.5 h-3.5 text-primary-600" />
                      </div>
                      <span className="font-medium text-slate-900">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-500 text-xs max-w-xs truncate">{cat.description ?? '—'}</td>
                  <td className="px-5 py-3">
                    <span className="badge bg-blue-50 text-blue-700 border-blue-200 text-xs">
                      {cat._count?.services ?? 0} services
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-slate-400">{formatDate(cat.created_at)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(cat)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteTarget(cat)}
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
      )}

      {/* Create / Edit Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)}
        title={editTarget ? 'Edit Category' : 'New Category'} size="sm">
        <div className="space-y-4">
          <div>
            <label className="label">Name *</label>
            <input className="input" placeholder="e.g. Identity Services"
              value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input resize-none" rows={3} placeholder="Brief description..."
              value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={() => setShowForm(false)} className="btn-secondary text-sm px-4">Cancel</button>
            <button onClick={() => saveMutation.mutate()} disabled={!form.name || saveMutation.isPending}
              className="btn-primary text-sm px-4">
              {saveMutation.isPending ? 'Saving...' : editTarget ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmModal
        isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate()} loading={deleteMutation.isPending}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? All associated services may be affected.`}
      />
    </div>
  )
}

export default function CategoriesPage() {
  return <AuthGuard requireAdmin><CategoriesContent /></AuthGuard>
}
