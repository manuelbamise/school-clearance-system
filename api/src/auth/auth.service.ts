import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import * as activitiesService from '../activities/activities.service.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

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

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user) {
    activitiesService.log(userId, 'logged in', '', 'info');
  }
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
