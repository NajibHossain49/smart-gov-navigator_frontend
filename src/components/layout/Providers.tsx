'use client'
import { useEffect } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import { queryClient } from '@/lib/queryClient'
import { useAuthStore } from '@/store/authStore'

function AuthInitializer() {
  const initFromStorage = useAuthStore((s) => s.initFromStorage)

  useEffect(() => {
    // Fix corrupted role data in localStorage if any
    try {
      const raw = localStorage.getItem('gov_user')
      if (raw) {
        const user = JSON.parse(raw)
        // If role is string, fix it to object format
        if (typeof user.role === 'string') {
          user.role = { role_name: user.role }
          localStorage.setItem('gov_user', JSON.stringify(user))
        }
      }
    } catch {
      // ignore
    }
    initFromStorage()
  }, [initFromStorage])

  return null
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer />
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { fontSize: '14px', fontWeight: '500', borderRadius: '10px', padding: '12px 16px' },
          success: { iconTheme: { primary: '#2563eb', secondary: '#fff' } },
        }}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
