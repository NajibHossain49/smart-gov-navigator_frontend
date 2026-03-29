'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import { officeApi } from '@/lib/api'
import api from '@/lib/axios'
import { getErrorMessage } from '@/lib/utils'
import AuthGuard from '@/components/auth/AuthGuard'
import Modal, { ConfirmModal } from '@/components/ui/Modal'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import type { GovernmentOffice } from '@/types'

const DISTRICTS = ['Dhaka','Chittagong','Sylhet','Rajshahi','Khulna','Gazipur','Narayanganj','Barisal','Rangpur','Mymensingh']

type OfficeForm = {
  name: string; office_type: string; address: string
  district: string; upazila: string; phone: string; email: string; office_hours: string
}

const emptyForm: OfficeForm = { name:'', office_type:'', address:'', district:'', upazila:'', phone:'', email:'', office_hours:'' }

function OfficeFormModal({ isOpen, onClose, editTarget }: { isOpen: boolean; onClose: () => void; editTarget: GovernmentOffice | null }) {
  const qc = useQueryClient()
  const [form, setForm] = useState<OfficeForm>(editTarget ? {
    name: editTarget.name, office_type: editTarget.office_type ?? '',
    address: editTarget.address ?? '', district: editTarget.district ?? '',
    upazila: editTarget.upazila ?? '', phone: editTarget.phone ?? '',
    email: editTarget.email ?? '', office_hours: editTarget.office_hours ?? '',
  } : emptyForm)

  const f = (field: keyof OfficeForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [field]: e.target.value }))

  const mutation = useMutation({
    mutationFn: () => editTarget
      ? api.put(`/admin/offices/${editTarget.id}`, form)
      : api.post('/admin/offices', form),
    onSuccess: () => {
      toast.success(editTarget ? 'Office updated!' : 'Office created!')
      qc.invalidateQueries({ queryKey: ['offices'] })
      onClose()
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editTarget ? 'Edit Office' : 'New Office'} size="lg">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="label">Office Name *</label>
          <input className="input" placeholder="e.g. Dhaka Passport Office" value={form.name} onChange={f('name')} />
        </div>
        <div>
          <label className="label">Office Type</label>
          <input className="input" placeholder="e.g. Passport Office" value={form.office_type} onChange={f('office_type')} />
        </div>
        <div>
          <label className="label">District</label>
          <select className="input" value={form.district} onChange={f('district')}>
            <option value="">Select district...</option>
            {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Upazila</label>
          <input className="input" placeholder="e.g. Sher-e-Bangla Nagar" value={form.upazila} onChange={f('upazila')} />
        </div>
        <div>
          <label className="label">Phone</label>
          <input className="input" placeholder="02-XXXXXXX" value={form.phone} onChange={f('phone')} />
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" className="input" placeholder="office@gov.bd" value={form.email} onChange={f('email')} />
        </div>
        <div>
          <label className="label">Office Hours</label>
          <input className="input" placeholder="Sun–Thu: 9:00 AM – 5:00 PM" value={form.office_hours} onChange={f('office_hours')} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Address</label>
          <input className="input" placeholder="Full address..." value={form.address} onChange={f('address')} />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4 mt-2 border-t border-slate-100">
        <button onClick={onClose} className="btn-secondary text-sm px-4">Cancel</button>
        <button onClick={() => mutation.mutate()} disabled={!form.name || mutation.isPending}
          className="btn-primary text-sm px-4">
          {mutation.isPending ? 'Saving...' : editTarget ? 'Update' : 'Create'}
        </button>
      </div>
    </Modal>
  )
}

function OfficesAdminContent() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState<GovernmentOffice | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<GovernmentOffice | null>(null)
  const [districtFilter, setDistrictFilter] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['offices', districtFilter],
    queryFn: () => officeApi.getAll(districtFilter ? { district: districtFilter } : undefined),
  })
  const offices: GovernmentOffice[] = data?.data?.data ?? []

  const openCreate = () => { setEditTarget(null); setShowForm(true) }
  const openEdit = (o: GovernmentOffice) => { setEditTarget(o); setShowForm(true) }

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/admin/offices/${deleteTarget!.id}`),
    onSuccess: () => {
      toast.success('Office deleted.')
      qc.invalidateQueries({ queryKey: ['offices'] })
      setDeleteTarget(null)
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title">Offices</h1>
          <p className="text-sm text-slate-500 mt-0.5">{offices.length} offices</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm"><Plus className="w-4 h-4" />New Office</button>
      </div>

      <div className="mb-4">
        <select className="input max-w-xs text-sm" value={districtFilter} onChange={e => setDistrictFilter(e.target.value)}>
          <option value="">All Districts</option>
          {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {isLoading ? <PageLoader /> : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Name', 'Type', 'District', 'Phone', 'Hours', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {offices.map(office => (
                <tr key={office.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <span className="font-medium text-slate-900 text-xs leading-snug max-w-[160px] truncate">{office.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{office.office_type ?? '—'}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{office.district ?? '—'}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{office.phone ?? '—'}</td>
                  <td className="px-4 py-3 text-xs text-slate-400 max-w-[120px] truncate">{office.office_hours ?? '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(office)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteTarget(office)}
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

      <OfficeFormModal isOpen={showForm} onClose={() => setShowForm(false)} editTarget={editTarget} />
      <ConfirmModal
        isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate()} loading={deleteMutation.isPending}
        title="Delete Office" message={`Delete "${deleteTarget?.name}"?`} />
    </div>
  )
}

export default function AdminOfficesPage() {
  return <AuthGuard requireAdmin><OfficesAdminContent /></AuthGuard>
}
