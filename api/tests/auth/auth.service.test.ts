import { describe, it, expect, vi, beforeEach } from 'vitest'

const { prismaMock, mockTransaction, mockActivityLog } = vi.hoisted(() => {
  const prismaMock = {
    $transaction: vi.fn(),
    user: {
      findUnique: vi.fn(),
    },
    auditLog: { create: vi.fn() },
  } as any

  const mockTransaction = () => {
    prismaMock.$transaction.mockImplementation(async (fn: any) => fn(prismaMock))
  }

  const mockActivityLog = vi.fn()

  return { prismaMock, mockTransaction, mockActivityLog }
})

vi.mock('@/lib/prisma', () => ({ default: prismaMock }))
vi.mock('@/activities/activities.service', () => ({
  log: mockActivityLog,
}))

import { generateToken, sanitizeUser, logLogin } from '@/auth/auth.service'

describe('auth.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockTransaction()
  })

  describe('generateToken', () => {
    it('returns a valid JWT with sub and role claims', async () => {
      const jwt = await import('jsonwebtoken')
      const token = generateToken({ id: 'user-1', role: 'student' })
      const decoded = jwt.default.verify(token, 'fallback-secret') as jwt.JwtPayload

      expect(decoded.sub).toBe('user-1')
      expect(decoded.role).toBe('student')
    })

    it('sets 2h expiry', async () => {
      const jwt = await import('jsonwebtoken')
      const token = generateToken({ id: 'user-1', role: 'student' })
      const decoded = jwt.default.verify(token, 'fallback-secret') as jwt.JwtPayload

      expect(decoded.exp! - decoded.iat!).toBe(7200)
    })

    it('uses the configured JWT_SECRET', async () => {
      const jwt = await import('jsonwebtoken')
      const token = generateToken({ id: 'u1', role: 'academic' })

      expect(() => jwt.default.verify(token, 'fallback-secret')).not.toThrow()
      expect(() => jwt.default.verify(token, 'wrong-secret')).toThrow()
    })
  })

  describe('sanitizeUser', () => {
    it('strips the password field', () => {
      const user = { id: '1', email: 'a@b.com', password: 'secret', name: 'Test' }
      const result = sanitizeUser(user)

      expect(result).not.toHaveProperty('password')
    })

    it('preserves all other fields', () => {
      const user = { id: '1', email: 'a@b.com', password: 'secret', name: 'Test', role: 'student' }
      const result = sanitizeUser(user)

      expect(result).toEqual({ id: '1', email: 'a@b.com', name: 'Test', role: 'student' })
    })
  })

  describe('logLogin', () => {
    it('creates an audit log entry', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null)

      await logLogin('user-1', '127.0.0.1')

      expect(prismaMock.auditLog.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          action: 'Successful login',
          reason: 'User logged in successfully',
          category: 'login',
          status: 'success',
          ipAddress: '127.0.0.1',
        },
      })
    })

    it('defaults ipAddress to null', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null)

      await logLogin('user-1')

      expect(prismaMock.auditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ ipAddress: null }),
        }),
      )
    })
  })
})
