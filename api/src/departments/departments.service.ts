import prisma from '../lib/prisma.js';
import type { CreateDepartmentInput } from './departments.validation.js';

export const getAll = async () => {
  return prisma.department.findMany({
    include: { _count: { select: { users: true } } },
    orderBy: { name: 'asc' },
  });
};

export const create = async (data: CreateDepartmentInput, performedByUserId: string, ipAddress?: string) => {
  return prisma.$transaction(async (tx) => {
    const department = await tx.department.create({
      data: { name: data.name },
    });

    await tx.auditLog.create({
      data: {
        userId: performedByUserId,
        action: `Created department: ${data.name}`,
        reason: 'Admin created a new department',
        category: 'user-management',
        status: 'success',
        ipAddress: ipAddress ?? null,
      },
    });

    return department;
  });
};

export const remove = async (id: string, performedByUserId: string, ipAddress?: string) => {
  return prisma.$transaction(async (tx) => {
    const department = await tx.department.delete({ where: { id } });

    await tx.auditLog.create({
      data: {
        userId: performedByUserId,
        action: `Deleted department: ${department.name}`,
        reason: 'Admin deleted a department',
        category: 'user-management',
        status: 'success',
        ipAddress: ipAddress ?? null,
      },
    });

    return department;
  });
};
