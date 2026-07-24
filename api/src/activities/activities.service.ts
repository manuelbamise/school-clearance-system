import prisma from '../lib/prisma.js';

export const log = async (
  actorId: string,
  action: string,
  target: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
) => {
  return prisma.activity.create({
    data: { actorId, action, target, type },
  });
};

export const getAll = async (params: { page?: number; limit?: number }) => {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const skip = (page - 1) * limit;

  const [activities, total] = await Promise.all([
    prisma.activity.findMany({
      include: { actor: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.activity.count(),
  ]);

  return {
    activities,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};
