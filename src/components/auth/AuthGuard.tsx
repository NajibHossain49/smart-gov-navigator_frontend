'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { PageLoader } from '@/components/ui/LoadingSpinner'

interface Props {
  children: React.ReactNode
  requireAdmin?: boolean
}

export default function AuthGuard({ children, requireAdmin = false }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState<'checking' | 'ready' | 'denied'>('checking')

  useEffect(() => {
    // Always init fresh from localStorage first
    useAuthStore.getState().initFromStorage()

    // Read state directly — synchronous after initFromStorage
    const { isAuthenticated, isAdmin } = useAuthStore.getState()

    if (!isAuthenticated) {
      router.replace('/login')
      setStatus('denied')
      return
    }

    if (requireAdmin && !isAdmin) {
      router.replace('/dashboard')
      setStatus('denied')
      return
    }

    setStatus('ready')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (status !== 'ready') return <PageLoader />
  return <>{children}</>
}
