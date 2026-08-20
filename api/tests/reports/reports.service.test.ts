import { describe, it, expect, vi, beforeEach } from 'vitest'

const { prismaMock, mockTransaction, mockActivityLog } = vi.hoisted(() => {
  const prismaMock = {
    $transaction: vi.fn(),
    user: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    report: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
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

import { create, getAll, updateStatus, remove } from '@/reports/reports.service'
import { buildReport, buildUser } from '../helpers/factories'

describe('reports.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockTransaction()
  })

  describe('create', () => {
    it('creates a report with pending status', async () => {
      const report = buildReport()
      const user = buildUser()
      prismaMock.report.create.mockResolvedValue({ ...report, user: { ...user, department: null } })

      await create('user-1', { title: 'Test Report', content: 'Content' })

      expect(prismaMock.report.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'user-1',
            title: 'Test Report',
            status: 'pending',
          }),
        }),
      )
    })

    it('creates an audit log inside the transaction', async () => {
      const report = buildReport()
      const user = buildUser()
      prismaMock.report.create.mockResolvedValue({ ...report, user: { ...user, department: null } })

      await create('user-1', { title: 'Report', content: 'Content' }, '127.0.0.1')

      expect(prismaMock.auditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'user-1',
            action: expect.stringContaining('Created report'),
            ipAddress: '127.0.0.1',
          }),
        }),
      )
    })

    it('logs activity after transaction', async () => {
      const report = buildReport()
      const user = buildUser()
      prismaMock.report.create.mockResolvedValue({ ...report, user: { ...user, department: null } })

      await create('user-1', { title: 'My Report', content: 'Content' })

      expect(mockActivityLog).toHaveBeenCalledWith('user-1', 'submitted report', 'My Report', 'info')
    })
  })

  describe('getAll', () => {
    it('returns paginated results', async () => {
      prismaMock.report.findMany.mockResolvedValue([])
      prismaMock.report.count.mockResolvedValue(0)

      const result = await getAll({ page: 1, limit: 10 })

      expect(result.meta).toEqual({ page: 1, limit: 10, total: 0, totalPages: 0 })
    })

    it('filters by status', async () => {
      prismaMock.report.findMany.mockResolvedValue([])
      prismaMock.report.count.mockResolvedValue(0)

      await getAll({ status: 'resolved' })

      expect(prismaMock.report.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'resolved' }),
        }),
      )
    })

    it('searches across title and user fields', async () => {
      prismaMock.report.findMany.mockResolvedValue([])
      prismaMock.report.count.mockResolvedValue(0)

      await getAll({ search: 'test' })

      expect(prismaMock.report.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              { title: { contains: 'test' } },
            ]),
          }),
        }),
      )
    })
  })

  describe('updateStatus', () => {
    it('updates report status', async () => {
      const report = buildReport({ status: 'resolved' })
      prismaMock.report.update.mockResolvedValue({ ...report, user: { id: 'u1', name: 'T', email: 'e', department: null } })

      await updateStatus('report-1', { status: 'resolved' }, 'admin-1')

      expect(prismaMock.report.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { status: 'resolved' },
        }),
      )
    })
  })

  describe('remove', () => {
    it('deletes the report', async () => {
      const report = buildReport()
      prismaMock.report.delete.mockResolvedValue({ ...report, user: { id: 'u1', name: 'T', email: 'e', department: null } })

      await remove('report-1', 'admin-1')

      expect(prismaMock.report.delete).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'report-1' } }),
      )
    })
  })
})
