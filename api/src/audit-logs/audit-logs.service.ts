import prisma from '../lib/prisma.js';

export const getAll = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}) => {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (params.category && params.category !== 'all') {
    where.category = params.category;
  }

  if (params.search) {
    where.OR = [
      { action: { contains: params.search } },
      { reason: { contains: params.search } },
      { ipAddress: { contains: params.search } },
      { user: { name: { contains: params.search } } },
      { user: { email: { contains: params.search } } },
    ];
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    logs,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const clearAll = async (
  actor: { id: string; name: string },
  ipAddress?: string,
) => {
  return prisma.$transaction(async (tx) => {
    const { count } = await tx.auditLog.deleteMany();

    await tx.auditLog.create({
      data: {
        userId: actor.id,
        action: 'Cleared audit logs',
        reason: `${actor.name} cleared ${count} audit log${count === 1 ? '' : 's'}`,
        category: 'user-management',
        status: 'success',
        ipAddress: ipAddress ?? null,
      },
    });

    await tx.activity.create({
      data: {
        actorId: actor.id,
        action: 'cleared audit logs',
        target: `${count} audit log${count === 1 ? '' : 's'}`,
        type: 'warning',
      },
    });
  });
};
