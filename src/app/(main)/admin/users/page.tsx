'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Ban, CheckCircle, Trash2, Search, ShieldCheck, ShieldOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminApi } from '@/lib/api'
import { getErrorMessage, formatDate, cn } from '@/lib/utils'
import AuthGuard from '@/components/auth/AuthGuard'
import { ConfirmModal } from '@/components/ui/Modal'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import Pagination from '@/components/ui/Pagination'
import Badge from '@/components/ui/Badge'

function UsersContent() {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users', page, search, statusFilter],
    queryFn: () => adminApi.getAllUsers({
      page, limit: 15,
      search: search || undefined,
      is_active: statusFilter === '' ? undefined : statusFilter === 'true',
    }),
  })

  const users = data?.data?.data?.users ?? []
  const pagination = data?.data?.data?.pagination

  const toggleMutation = useMutation({
    mutationFn: (id: number) => adminApi.toggleUserStatus(id),
    onSuccess: () => { toast.success('User status updated.'); qc.invalidateQueries({ queryKey: ['admin', 'users'] }) },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: number; role: string }) => adminApi.changeUserRole(id, role),
    onSuccess: () => { toast.success('Role updated.'); qc.invalidateQueries({ queryKey: ['admin', 'users'] }) },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const deleteMutation = useMutation({
    mutationFn: () => adminApi.deleteUser(deleteTarget!.id),
    onSuccess: () => {
      toast.success('User deleted.')
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
      setDeleteTarget(null)
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="section-title">User Management</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {pagination?.total ?? 0} total users
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input className="input pl-9 text-sm" placeholder="Search by name or email..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        </div>
        <select className="input max-w-[160px] text-sm" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}>
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Banned</option>
        </select>
      </div>

      {isLoading ? <PageLoader /> : (
        <>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['User', 'Role', 'Status', 'Activity', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((u: {
                  id: number; name: string; email: string
                  role: { role_name: string }; is_active: boolean; created_at: string
                  _count?: { bookmarks: number; feedbacks: number }
                }) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-primary-700">{u.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 text-sm">{u.name}</p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={u.role?.role_name === 'Admin' ? 'purple' : 'info'}>
                        {u.role?.role_name}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={u.is_active ? 'success' : 'danger'}>
                        {u.is_active ? '● Active' : '● Banned'}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-500">
                      <span>{u._count?.bookmarks ?? 0} bookmarks</span>
                      <br />
                      <span>{u._count?.feedbacks ?? 0} reviews</span>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-400">{formatDate(u.created_at)}</td>
                    <td className="px-5 py-3">
                      {u.role?.role_name !== 'Admin' ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => toggleMutation.mutate(u.id)}
                            title={u.is_active ? 'Ban user' : 'Activate user'}
                            className={cn('p-1.5 rounded-lg transition-colors',
                              u.is_active ? 'hover:bg-red-50 text-slate-400 hover:text-red-500' : 'hover:bg-green-50 text-slate-400 hover:text-green-600')}>
                            {u.is_active ? <Ban className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                          </button>
                          <button onClick={() => roleMutation.mutate({ id: u.id, role: u.role?.role_name === 'Admin' ? 'User' : 'Admin' })}
                            title="Toggle admin role"
                            className="p-1.5 rounded-lg hover:bg-purple-50 text-slate-400 hover:text-purple-600 transition-colors">
                            {u.role?.role_name === 'Admin' ? <ShieldOff className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                          </button>
                          <button onClick={() => setDeleteTarget({ id: u.id, name: u.name })}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-300">Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination page={page} totalPages={pagination?.totalPages ?? 1} onPageChange={setPage} />
        </>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate()} loading={deleteMutation.isPending}
        title="Delete User"
        message={`Permanently delete "${deleteTarget?.name}"? All their bookmarks and feedbacks will be removed.`} />
    </div>
  )
}

export default function AdminUsersPage() {
  return <AuthGuard requireAdmin><UsersContent /></AuthGuard>
}
