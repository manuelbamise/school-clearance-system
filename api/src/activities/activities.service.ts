import prisma from '../lib/prisma.js';

export const log = async (
  actorId: string,
  action: string,
  target: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
  unit?: string,
) => {
  return prisma.activity.create({
    data: { actorId, action, target, type, unit: unit ?? null },
  });
};

export const getAll = async (
  role: string,
  userId: string,
  params: { page?: number; limit?: number },
) => {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const skip = (page - 1) * limit;

  let where: Record<string, unknown> = {};

  if (role === 'student') {
    where = { actorId: userId };
  } else if (role === 'academic' || role === 'bursary' || role === 'department') {
    where = { OR: [{ unit: role }, { actorId: userId }] };
  }

  const [activities, total] = await Promise.all([
    prisma.activity.findMany({
      where,
      include: { actor: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.activity.count({ where }),
  ]);

  return {
    activities,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};
