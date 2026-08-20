import { mockDeep, type DeepMockProxy } from 'vitest-mock-extended'
import { PrismaClient } from '@prisma/client'

export const prismaMock = mockDeep<PrismaClient>()

export function mockTransaction() {
  prismaMock.$transaction.mockImplementation(async (fn: any) => fn(prismaMock))
}
