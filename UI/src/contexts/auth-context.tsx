import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User, Role } from '@/types'

const CREDENTIALS: Record<string, { password: string; user: User }> = {
  'student@portal.test': {
    password: 'password123',
    user: {
      id: 'STU-001',
      name: 'Alex Johnson',
      email: 'student@portal.test',
      role: 'student',
      studentId: 'STU-2024-001',
      department: 'Computer Science',
      school: 'School of Technology',
      phone: '+1 234 567 890',
      address: '123 Campus Drive',
    },
  },
  'academic@portal.test': {
    password: 'password123',
    user: {
      id: 'ACD-001',
      name: 'Dr. Sarah Williams',
      email: 'academic@portal.test',
      role: 'academic-unit',
      staffId: 'ACD-2020-001',
      department: 'Academic Affairs',
      school: 'School of Technology',
      phone: '+1 234 567 891',
      address: '456 Faculty Row',
    },
  },
  'bursary@portal.test': {
    password: 'password123',
    user: {
      id: 'BRS-001',
      name: 'Mr. James Okafor',
      email: 'bursary@portal.test',
      role: 'bursary-unit',
      staffId: 'BRS-2019-001',
      department: 'Bursary Department',
      school: 'School of Technology',
      phone: '+1 234 567 892',
      address: '789 Finance Wing',
    },
  },
  'department@portal.test': {
    password: 'password123',
    user: {
      id: 'DPT-001',
      name: 'Prof. Emily Chen',
      email: 'department@portal.test',
      role: 'department-unit',
      staffId: 'DPT-2018-001',
      department: 'Computer Science',
      school: 'School of Technology',
      phone: '+1 234 567 893',
      address: '321 Department Ave',
    },
  },
  'super@portal.test': {
    password: 'password123',
    user: {
      id: 'SUP-001',
      name: 'Admin Master',
      email: 'super@portal.test',
      role: 'superadmin',
      staffId: 'SUP-2015-001',
      department: 'System Administration',
      school: 'All Schools',
      phone: '+1 234 567 894',
      address: '1 Admin Tower',
    },
  },
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; role?: string }>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('auth_user')
    return stored ? JSON.parse(stored) : null
  })
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setIsLoading(false)

    const entry = CREDENTIALS[email.toLowerCase()]
    if (!entry) return { success: false, error: 'Invalid email or password' }
    if (entry.password !== password) return { success: false, error: 'Invalid email or password' }

    setUser(entry.user)
    localStorage.setItem('auth_user', JSON.stringify(entry.user))
    return { success: true, role: entry.user.role }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('auth_user')
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
