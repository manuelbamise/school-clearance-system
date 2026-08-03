import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { User } from '@/types'
import { USER_KEY, clearAuth, getToken, setToken } from '@/utils/axios'
import * as authApi from '@/lib/api/auth.api'
import { mapUser } from '@/lib/api/mappers'
import { errorMessage } from '@/lib/api/client'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; role?: string }>
  logout: () => void
  isLoading: boolean
  isHydrating: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

const readStoredUser = (): User | null => {
  const stored = localStorage.getItem(USER_KEY)
  if (!stored) return null
  try {
    return JSON.parse(stored) as User
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readStoredUser)
  const [isLoading, setIsLoading] = useState(false)
  const [isHydrating, setIsHydrating] = useState(() => Boolean(getToken()))

  useEffect(() => {
    if (!getToken()) return
    let cancelled = false
    authApi
      .getMe()
      .then((apiUser) => {
        if (cancelled) return
        const mapped = mapUser(apiUser)
        setUser(mapped)
        localStorage.setItem(USER_KEY, JSON.stringify(mapped))
      })
      .catch(() => {
        if (cancelled) return
        clearAuth()
        setUser(null)
      })
      .finally(() => {
        if (!cancelled) setIsHydrating(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { user: apiUser, token } = await authApi.login(email, password)
      const mapped = mapUser(apiUser)
      setToken(token)
      setUser(mapped)
      localStorage.setItem(USER_KEY, JSON.stringify(mapped))
      return { success: true, role: mapped.role }
    } catch (err) {
      return { success: false, error: errorMessage(err, 'Invalid email or password') }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    clearAuth()
  }, [])

  const refreshUser = useCallback(async () => {
    const apiUser = await authApi.getMe()
    const mapped = mapUser(apiUser)
    setUser(mapped)
    localStorage.setItem(USER_KEY, JSON.stringify(mapped))
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, isHydrating, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
