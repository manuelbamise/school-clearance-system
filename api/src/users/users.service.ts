import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';
import type { CreateUserInput, UpdateUserInput } from './users.validation.js';

const SALT_ROUNDS = 12;

export const getAll = async () => {
  return prisma.user.findMany({
    include: { department: true },
    orderBy: { createdAt: 'desc' },
  });
};

export const getById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    include: { department: true },
  });
};

export const create = async (data: CreateUserInput) => {
  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
  return prisma.user.create({
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
};

export const update = async (id: string, data: UpdateUserInput) => {
  return prisma.user.update({
    where: { id },
    data: {
      ...data,
      departmentId: data.departmentId === undefined ? undefined : data.departmentId,
    },
    include: { department: true },
  });
};

export const remove = async (id: string) => {
  return prisma.user.delete({ where: { id } });
};
