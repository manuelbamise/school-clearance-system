import { describe, it, expect, vi, beforeEach } from 'vitest'

const { prismaMock, mockTransaction, mockActivityLog, mockSendEmail } = vi.hoisted(() => {
  const prismaMock = {
    $transaction: vi.fn(),
    user: {
      update: vi.fn(),
    },
    auditLog: { create: vi.fn() },
  } as any

  const mockTransaction = () => {
    prismaMock.$transaction.mockImplementation(async (fn: any) => fn(prismaMock))
  }

  const mockActivityLog = vi.fn()
  const mockSendEmail = vi.fn()

  return { prismaMock, mockTransaction, mockActivityLog, mockSendEmail }
})

vi.mock('@/lib/prisma', () => ({ default: prismaMock }))
vi.mock('@/lib/AppError', () => ({ AppError: Error }))
vi.mock('@/activities/activities.service', () => ({
  log: mockActivityLog,
}))
vi.mock('@/email/email.service', () => ({
  sendEmail: mockSendEmail,
}))

import { sendOtp, verifyOtp } from '@/otp/otp.service'
import { buildUser } from '../helpers/factories'

describe('otp.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockTransaction()
  })

  describe('sendOtp', () => {
    it('sends email with 6-digit code', async () => {
      await sendOtp('user-1', 'test@example.com')

      expect(mockSendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'test@example.com',
          subject: expect.stringContaining('verification'),
        }),
      )
    })

    it('includes 6-digit code in email HTML', async () => {
      await sendOtp('user-1', 'test@example.com')

      const call = mockSendEmail.mock.calls[0][0]
      expect(call.html).toMatch(/\d{6}/)
    })
  })

  describe('verifyOtp', () => {
    it('throws on wrong code', async () => {
      await sendOtp('user-1', 'test@example.com')

      const call = mockSendEmail.mock.calls[0][0]
      const code = call.html.match(/(\d{6})/)[1]

      // Verify with wrong code
      await expect(verifyOtp('user-1', 'test@example.com', '000000')).rejects.toThrow(
        'Invalid verification code',
      )
    })

    it('sets isVerified on success', async () => {
      const user = buildUser({ isVerified: true })
      prismaMock.user.update.mockResolvedValue(user)

      await sendOtp('user-1', 'test@example.com')

      const call = mockSendEmail.mock.calls[0][0]
      const code = call.html.match(/(\d{6})/)[1]

      await verifyOtp('user-1', 'test@example.com', code)

      expect(prismaMock.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { isVerified: true },
        }),
      )
    })

    it('creates audit log on success', async () => {
      const user = buildUser({ isVerified: true })
      prismaMock.user.update.mockResolvedValue(user)

      await sendOtp('user-1', 'test@example.com')

      const call = mockSendEmail.mock.calls[0][0]
      const code = call.html.match(/(\d{6})/)[1]

      await verifyOtp('user-1', 'test@example.com', code)

      expect(prismaMock.auditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: 'Email verified',
          }),
        }),
      )
    })
  })
})
