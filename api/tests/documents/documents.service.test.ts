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
    document: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    clearance: {
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
vi.mock('@/lib/AppError', () => ({ AppError: Error }))
vi.mock('@/activities/activities.service', () => ({
  log: mockActivityLog,
}))
vi.mock('@/middleware/upload.middleware', () => ({
  uploadsDirPath: '/tmp/uploads',
}))
vi.mock('fs', () => ({
  default: { promises: { unlink: vi.fn().mockResolvedValue(undefined) } },
}))

import { review, remove } from '@/documents/documents.service'
import { buildDocument, buildUser } from '../helpers/factories'

describe('documents.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockTransaction()
  })

  describe('review', () => {
    it('throws 404 if document not found', async () => {
      prismaMock.document.findUnique.mockResolvedValue(null)

      await expect(
        review('doc-1', { status: 'approved' }, 'staff-1'),
      ).rejects.toThrow('Document not found')
    })

    it('throws 403 if reviewer is not the recipient', async () => {
      const doc = buildDocument({ recipientId: 'staff-1' })
      prismaMock.document.findUnique.mockResolvedValue({
        ...doc,
        recipient: buildUser({ id: 'staff-1', role: 'academic' }),
        student: buildUser(),
      })

      await expect(
        review('doc-1', { status: 'approved' }, 'wrong-staff'),
      ).rejects.toThrow('You can only review documents sent to you')
    })

    it('approves a document', async () => {
      const doc = buildDocument({ recipientId: 'staff-1' })
      prismaMock.document.findUnique.mockResolvedValue({
        ...doc,
        recipient: buildUser({ id: 'staff-1', role: 'academic' }),
        student: buildUser(),
      })
      prismaMock.document.update.mockResolvedValue({
        ...doc,
        status: 'approved',
        reviewedById: 'staff-1',
        reviewedAt: new Date(),
        recipient: buildUser({ id: 'staff-1', role: 'academic' }),
        student: buildUser(),
        reviewedBy: buildUser({ id: 'staff-1', role: 'academic' }),
      })

      await review('doc-1', { status: 'approved' }, 'staff-1')

      expect(prismaMock.document.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: 'approved',
            reviewedById: 'staff-1',
          }),
        }),
      )
    })

    it('rejects a document with reason', async () => {
      const doc = buildDocument({ recipientId: 'staff-1' })
      prismaMock.document.findUnique.mockResolvedValue({
        ...doc,
        recipient: buildUser({ id: 'staff-1', role: 'academic' }),
        student: buildUser(),
      })
      prismaMock.document.update.mockResolvedValue({
        ...doc,
        status: 'rejected',
        rejectionReason: 'Incomplete',
        reviewedById: 'staff-1',
        recipient: buildUser({ id: 'staff-1', role: 'academic' }),
        student: buildUser(),
        reviewedBy: buildUser({ id: 'staff-1', role: 'academic' }),
      })

      await review('doc-1', { status: 'rejected', rejectionReason: 'Incomplete' }, 'staff-1')

      expect(prismaMock.document.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: 'rejected',
            rejectionReason: 'Incomplete',
          }),
        }),
      )
    })

    it('throws if rejected without reason', async () => {
      const doc = buildDocument({ recipientId: 'staff-1' })
      prismaMock.document.findUnique.mockResolvedValue({
        ...doc,
        recipient: buildUser({ id: 'staff-1', role: 'academic' }),
        student: buildUser(),
      })

      await expect(
        review('doc-1', { status: 'rejected' }, 'staff-1'),
      ).rejects.toThrow('Rejection reason is required')
    })
  })

  describe('remove', () => {
    it('throws 404 if document not found', async () => {
      prismaMock.document.findUnique.mockResolvedValue(null)

      await expect(remove('doc-1', 'user-1')).rejects.toThrow('Document not found')
    })

    it('throws 403 if not recipient', async () => {
      const doc = buildDocument({ recipientId: 'staff-1', status: 'approved' })
      prismaMock.document.findUnique.mockResolvedValue({
        ...doc,
        recipient: buildUser({ id: 'staff-1', role: 'academic' }),
        student: buildUser(),
      })

      await expect(remove('doc-1', 'wrong-user')).rejects.toThrow('You can only delete documents sent to you')
    })

    it('throws if document is still pending', async () => {
      const doc = buildDocument({ recipientId: 'staff-1', status: 'pending' })
      prismaMock.document.findUnique.mockResolvedValue({
        ...doc,
        recipient: buildUser({ id: 'staff-1', role: 'academic' }),
        student: buildUser(),
      })

      await expect(remove('doc-1', 'staff-1')).rejects.toThrow('Only reviewed documents can be deleted')
    })

    it('deletes an approved document', async () => {
      const doc = buildDocument({ recipientId: 'staff-1', status: 'approved' })
      prismaMock.document.findUnique.mockResolvedValue({
        ...doc,
        recipient: buildUser({ id: 'staff-1', role: 'academic' }),
        student: buildUser(),
      })
      prismaMock.document.delete.mockResolvedValue(doc)

      await remove('doc-1', 'staff-1')

      expect(prismaMock.document.delete).toHaveBeenCalledWith({ where: { id: 'doc-1' } })
    })
  })
})
