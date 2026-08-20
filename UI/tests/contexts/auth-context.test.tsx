import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/contexts/auth-context'

vi.mock('@/lib/api/auth.api', () => ({
  login: vi.fn(),
  getMe: vi.fn(),
}))

vi.mock('@/utils/axios', () => ({
  USER_KEY: 'clearpath_user',
  getToken: vi.fn(() => null),
  setToken: vi.fn(),
  clearAuth: vi.fn(),
  apiClient: { get: vi.fn(), post: vi.fn() },
}))

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
)

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('starts with no user when no token', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.user).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  it('login returns success with role on valid credentials', async () => {
    const { login } = await import('@/lib/api/auth.api')
    vi.mocked(login).mockResolvedValue({
      user: {
        id: 'u1',
        email: 'test@test.com',
        name: 'Test',
        role: 'student',
        isVerified: true,
        studentId: 'STU001',
        staffId: null,
        departmentId: 'd1',
        department: { id: 'd1', name: 'CS', createdAt: '', updatedAt: '' },
        createdAt: '',
        updatedAt: '',
      },
      token: 'mock-token',
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    let res: any
    await act(async () => {
      res = await result.current.login('test@test.com', 'password123')
    })

    expect(res.success).toBe(true)
    expect(res.role).toBe('student')
    expect(res.isVerified).toBe(true)
  })

  it('login returns error on failure', async () => {
    const { login } = await import('@/lib/api/auth.api')
    vi.mocked(login).mockRejectedValue(new Error('Invalid credentials'))

    const { result } = renderHook(() => useAuth(), { wrapper })

    let res: any
    await act(async () => {
      res = await result.current.login('bad@test.com', 'wrong')
    })

    expect(res.success).toBe(false)
    expect(res.error).toBeTruthy()
  })

  it('logout clears user', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    act(() => {
      result.current.logout()
    })

    expect(result.current.user).toBeNull()
  })
})
