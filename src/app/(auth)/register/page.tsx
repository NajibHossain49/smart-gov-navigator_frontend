'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Shield, UserPlus } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { getErrorMessage } from '@/lib/utils'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function RegisterPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const mutation = useMutation({
    mutationFn: () => authApi.register(form),
    onSuccess: (res) => {
      const { user, token } = res.data.data
      setAuth(user, token)
      toast.success('Account created successfully!')
      router.push('/')
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { toast.error('Please fill all fields.'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters.'); return }
    mutation.mutate()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50
                    flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">

        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/">
            <div
              className="inline-flex items-center justify-center w-14 h-14 bg-primary-600
                   rounded-2xl mb-4 shadow-lg shadow-primary-200 cursor-pointer"
            >
              <Shield className="w-7 h-7 text-white" />
            </div>
          </Link>
          <Link href="/">
            <h1 className="text-2xl font-bold text-slate-900 cursor-pointer">
              Create account
            </h1>
          </Link>
          <p className="text-sm text-slate-500 mt-1">Join GovNavigator to access all services</p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="label">Full Name</label>
              <input type="text" className="input" placeholder="Rahim Uddin"
                value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>

            <div>
              <label className="label">Email address</label>
              <input type="email" className="input" placeholder="you@example.com"
                value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} className="input pr-10"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={mutation.isPending} className="btn-primary w-full py-3">
              {mutation.isPending
                ? <><LoadingSpinner size="sm" />Creating account...</>
                : <><UserPlus className="w-4 h-4" />Create Account</>}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-5">
          Already have an account?{' '}
          <Link href="/login" className="text-primary-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
