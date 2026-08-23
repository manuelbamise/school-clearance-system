import { describe, it, expect, vi, beforeEach } from 'vitest';

const { prismaMock, mockTransaction, mockActivityLog } = vi.hoisted(() => {
  const prismaMock = {
    $transaction: vi.fn(),
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    auditLog: { create: vi.fn() },
  } as any;

  const mockTransaction = () => {
    prismaMock.$transaction.mockImplementation(async (fn: any) =>
      fn(prismaMock),
    );
  };

  const mockActivityLog = vi.fn();

  return { prismaMock, mockTransaction, mockActivityLog };
});

vi.mock('@/lib/prisma', () => ({ default: prismaMock }));
vi.mock('@/activities/activities.service', () => ({
  log: mockActivityLog,
}));

import { create, update, remove, getAll } from '../../src/users/users.service';
import { buildUser } from '../helpers/factories';

describe('users.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTransaction();
  });

  describe('create', () => {
    it('hashes the password with bcrypt', async () => {
      const user = buildUser();
      prismaMock.user.create.mockResolvedValue(user);

      await create(
        {
          email: 'new@test.com',
          password: 'plain123',
          name: 'New',
          role: 'student',
        },
        'admin-1',
      );

      expect(prismaMock.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            password: expect.not.stringMatching('plain123'),
          }),
        }),
      );
    });

    it('creates audit log when performedByUserId provided', async () => {
      const user = buildUser();
      prismaMock.user.create.mockResolvedValue(user);

      await create(
        {
          email: 'new@test.com',
          password: 'pass123',
          name: 'New',
          role: 'student',
        },
        'admin-1',
        '127.0.0.1',
      );

      expect(prismaMock.auditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'admin-1',
            action: expect.stringContaining('Created user'),
            ipAddress: '127.0.0.1',
          }),
        }),
      );
    });

    it('skips audit log when no performedByUserId', async () => {
      const user = buildUser();
      prismaMock.user.create.mockResolvedValue(user);

      await create({
        email: 'new@test.com',
        password: 'pass123',
        name: 'New',
        role: 'student',
      });

      expect(prismaMock.auditLog.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('updates user fields', async () => {
      const user = buildUser({ name: 'Updated' });
      prismaMock.user.update.mockResolvedValue(user);

      await update('user-1', { name: 'Updated' }, 'admin-1');

      expect(prismaMock.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ name: 'Updated' }),
        }),
      );
    });
  });

  describe('remove', () => {
    it('deletes the user', async () => {
      const user = buildUser();
      prismaMock.user.delete.mockResolvedValue(user);

      await remove('user-1', 'admin-1');

      expect(prismaMock.user.delete).toHaveBeenCalledWith({
        where: { id: 'user-1' },
      });
    });

    it('logs activity after deletion', async () => {
      const user = buildUser();
      prismaMock.user.delete.mockResolvedValue(user);

      await remove('user-1', 'admin-1');

      expect(mockActivityLog).toHaveBeenCalledWith(
        'admin-1',
        'deleted user',
        user.email,
        'warning',
      );
    });
  });

  describe('getAll', () => {
    it('returns paginated results', async () => {
      prismaMock.user.findMany.mockResolvedValue([]);
      prismaMock.user.count.mockResolvedValue(0);

      const result = await getAll({ page: 1, limit: 10 });

      expect(result.meta).toEqual({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      });
    });

    it('searches across name, email, studentId, staffId', async () => {
      prismaMock.user.findMany.mockResolvedValue([]);
      prismaMock.user.count.mockResolvedValue(0);

      await getAll({ search: 'test' });

      expect(prismaMock.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              { name: { contains: 'test' } },
              { email: { contains: 'test' } },
              { studentId: { contains: 'test' } },
              { staffId: { contains: 'test' } },
            ]),
          }),
        }),
      );
    });
  });
});
