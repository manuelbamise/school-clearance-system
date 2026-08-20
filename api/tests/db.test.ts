import { describe, it, expect } from 'vitest'
import prisma from '@/lib/prisma'

describe('Database connection', () => {
  it('can connect and query users', async () => {
    const count = await prisma.user.count()
    expect(count).toBeGreaterThanOrEqual(0)
  })

  it('can run a raw query', async () => {
    const result = await prisma.$queryRaw`SELECT 1 as value`
    expect(result).toBeDefined()
  })
})
