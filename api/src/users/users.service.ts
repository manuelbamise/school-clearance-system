import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';
import type { Prisma } from '@prisma/client';
import type { CreateUserInput, UpdateUserInput } from './users.validation.js';

const SALT_ROUNDS = 12;

export const getAll = async (params: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = params.search
    ? {
        OR: [
          { name: { contains: params.search } },
          { email: { contains: params.search } },
          { studentId: { contains: params.search } },
          { staffId: { contains: params.search } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: { department: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const getById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    include: { department: true },
  });
};

export const create = async (
  data: CreateUserInput,
  performedByUserId?: string,
  ipAddress?: string,
) => {
  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role,
        studentId: data.studentId,
        staffId: data.staffId,
        departmentId: data.departmentId ?? null,
      },
      include: { department: true },
    });

    if (performedByUserId) {
      await tx.auditLog.create({
        data: {
          userId: performedByUserId,
          action: `Created user: ${user.email}`,
          reason: `Admin created user with role ${user.role}`,
          category: 'user-management',
          status: 'success',
          ipAddress: ipAddress ?? null,
        },
      });
    }

    return user;
  });
};

export const update = async (
  id: string,
  data: UpdateUserInput,
  performedByUserId?: string,
  ipAddress?: string,
) => {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id },
      data: {
        ...data,
        departmentId:
          data.departmentId === undefined ? undefined : data.departmentId,
      },
      include: { department: true },
    });

    if (performedByUserId) {
      await tx.auditLog.create({
        data: {
          userId: performedByUserId,
          action: `Updated user: ${user.email}`,
          reason: `Admin updated user profile`,
          category: 'user-management',
          status: 'success',
          ipAddress: ipAddress ?? null,
        },
      });
    }

    return user;
  });
};

export const remove = async (
  id: string,
  performedByUserId?: string,
  ipAddress?: string,
) => {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.delete({ where: { id } });

    if (performedByUserId) {
      await tx.auditLog.create({
        data: {
          userId: performedByUserId,
          action: `Deleted user: ${user.email}`,
          reason: `Admin deleted user account`,
          category: 'user-management',
          status: 'success',
          ipAddress: ipAddress ?? null,
        },
      });
    }

    return user;
  });
};
