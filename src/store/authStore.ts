'use client'
import { create } from 'zustand'
import type { User } from '@/types'

const TOKEN_KEY = 'gov_token'
const USER_KEY  = 'gov_user'

// Normalize role — backend sometimes returns role as string, sometimes as object
function normalizeUser(user: User): User {
  if (!user) return user
  const role = user.role as unknown
  if (typeof role === 'string') {
    return { ...user, role: { role_name: role as 'Admin' | 'User' } }
  }
  if (role && typeof role === 'object' && 'role_name' in (role as object)) {
    return user
  }
  return user
}

function loadFromStorage(): { user: User | null; token: string | null } {
  if (typeof window === 'undefined') return { user: null, token: null }
  try {
    const token = localStorage.getItem(TOKEN_KEY)
    const raw   = localStorage.getItem(USER_KEY)
    const user  = raw ? normalizeUser(JSON.parse(raw) as User) : null
    return { user, token }
  } catch {
    return { user: null, token: null }
  }
}

function saveToStorage(user: User, token: string) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

function clearStorage() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem('gov_auth')
}

function isAdmin(user: User | null): boolean {
  if (!user) return false
  const role = user.role as unknown
  if (typeof role === 'string') return role === 'Admin'
  if (role && typeof role === 'object' && 'role_name' in (role as object)) {
    return (role as { role_name: string }).role_name === 'Admin'
  }
  return false
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isAdmin: boolean
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
  updateUser: (user: User) => void
  initFromStorage: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isAdmin: false,

  initFromStorage: () => {
    const { user, token } = loadFromStorage()
    if (user && token) {
      const normalized = normalizeUser(user)
      set({
        user: normalized,
        token,
        isAuthenticated: true,
        isAdmin: isAdmin(normalized),
      })
    }
  },

  setAuth: (user, token) => {
    const normalized = normalizeUser(user)
    saveToStorage(normalized, token)
    set({
      user: normalized,
      token,
      isAuthenticated: true,
      isAdmin: isAdmin(normalized),
    })
  },

  clearAuth: () => {
    clearStorage()
    set({ user: null, token: null, isAuthenticated: false, isAdmin: false })
  },

  updateUser: (user) => {
    const normalized = normalizeUser(user)
    const token = localStorage.getItem(TOKEN_KEY) ?? ''
    saveToStorage(normalized, token)
    set({ user: normalized, isAdmin: isAdmin(normalized) })
  },
}))
