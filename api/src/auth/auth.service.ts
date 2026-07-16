import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import type { RegisterInput } from './auth.validation.js';

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export const register = async (data: RegisterInput, ipAddress?: string) => {
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
    });

    await tx.auditLog.create({
      data: {
        userId: user.id,
        action: 'User registered',
        reason: `New ${data.role} account created`,
        category: 'login',
        status: 'success',
        ipAddress: ipAddress ?? null,
      },
    });

    const token = generateToken(user);
    return { user, token };
  });
};

export const logLogin = async (userId: string, ipAddress?: string) => {
  await prisma.auditLog.create({
    data: {
      userId,
      action: 'Successful login',
      reason: 'User logged in successfully',
      category: 'login',
      status: 'success',
      ipAddress: ipAddress ?? null,
    },
  });
};

export const generateToken = (user: { id: string; role: string }) => {
  return jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const sanitizeUser = <T extends { password: string }>(user: T) => {
  const { password: _, ...rest } = user;
  return rest;
};
