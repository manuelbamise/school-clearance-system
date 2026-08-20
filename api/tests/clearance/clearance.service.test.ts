import { describe, it, expect, vi, beforeEach } from 'vitest'

const { prismaMock, mockTransaction, mockActivityLog } = vi.hoisted(() => {
  const prismaMock = {
    $transaction: vi.fn(),
    user: {
      findUnique: vi.fn(),
    },
    clearance: {
      findUnique: vi.fn(),
    },
    clearanceUnit: {
      upsert: vi.fn(),
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
vi.mock('@/lib/AppError', () => ({ AppError: Error }))
vi.mock('@/activities/activities.service', () => ({
  log: mockActivityLog,
}))

import { getMine, clear } from '@/clearance/clearance.service'
import { buildUser, buildClearance, buildClearanceUnit } from '../helpers/factories'

function buildStaffUser(overrides?: any) {
  return buildUser({
    id: 'staff-1',
    email: 'staff@example.com',
    role: 'academic',
    studentId: null,
    staffId: 'STF001',
    ...overrides,
  })
}

describe('clearance.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockTransaction()
  })

  describe('getMine', () => {
    it('returns 3 steps with pending status when no clearance exists', async () => {
      prismaMock.clearance.findUnique.mockResolvedValue(null)

      const result = await getMine('user-1')

      expect(result.steps).toHaveLength(3)
      expect(result.steps.every((s: any) => s.status === 'pending')).toBe(true)
    })

    it('reflects cleared status from clearance units', async () => {
      const clearance = buildClearance()
      const units = [
        buildClearanceUnit({ unit: 'academic', status: 'cleared', clearedById: 'staff-1', clearedAt: new Date() }),
        buildClearanceUnit({ unit: 'bursary', status: 'pending' }),
        buildClearanceUnit({ unit: 'department', status: 'pending' }),
      ]
      prismaMock.clearance.findUnique.mockResolvedValue({
        ...clearance,
        units: units.map((u) => ({ ...u, clearedBy: buildUser({ id: 'staff-1', name: 'Staff' }) })),
      })

      const result = await getMine('user-1')

      expect(result.steps[0].status).toBe('cleared')
      expect(result.steps[1].status).toBe('pending')
      expect(result.steps[2].status).toBe('pending')
    })
  })

  describe('clear', () => {
    it('throws 404 if clearance not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(buildStaffUser())
      prismaMock.clearance.findUnique.mockResolvedValue(null)

      await expect(clear('user-1', 'staff-1', 'academic')).rejects.toThrow(
        'Student is not on the clearance list',
      )
    })

    it('upserts clearance unit with cleared status', async () => {
      const staff = buildStaffUser({ id: 'staff-1', role: 'academic' })
      const student = buildUser({ id: 'user-1' })
      const clearance = buildClearance({ studentId: 'user-1' })

      prismaMock.user.findUnique.mockResolvedValue(staff)
      prismaMock.clearance.findUnique.mockResolvedValue({ ...clearance, student })
      prismaMock.clearanceUnit.upsert.mockResolvedValue(buildClearanceUnit({ status: 'cleared' }))

      await clear('user-1', 'staff-1', 'academic')

      expect(prismaMock.clearanceUnit.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          update: expect.objectContaining({ status: 'cleared' }),
        }),
      )
    })

    it('creates audit log', async () => {
      const staff = buildStaffUser({ id: 'staff-1', role: 'academic' })
      const student = buildUser({ id: 'user-1' })
      const clearance = buildClearance({ studentId: 'user-1' })

      prismaMock.user.findUnique.mockResolvedValue(staff)
      prismaMock.clearance.findUnique.mockResolvedValue({ ...clearance, student })
      prismaMock.clearanceUnit.upsert.mockResolvedValue(buildClearanceUnit())

      await clear('user-1', 'staff-1', 'academic', '127.0.0.1')

      expect(prismaMock.auditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'staff-1',
            action: expect.stringContaining('Cleared student'),
            ipAddress: '127.0.0.1',
          }),
        }),
      )
    })

    it('department role blocks clearing other departments', async () => {
      const staff = buildStaffUser({ id: 'staff-1', role: 'department', departmentId: 'dept-1' })
      const student = buildUser({ id: 'user-1', departmentId: 'dept-2' })
      const clearance = buildClearance({ studentId: 'user-1' })

      prismaMock.user.findUnique.mockResolvedValue(staff)
      prismaMock.clearance.findUnique.mockResolvedValue({ ...clearance, student })

      await expect(clear('user-1', 'staff-1', 'department')).rejects.toThrow(
        'You can only clear students from your department',
      )
    })
  })
})
