import prisma from '../lib/prisma.js';
import type { CreateReportInput, UpdateReportInput } from './reports.validation.js';

export const create = async (userId: string, data: CreateReportInput, ipAddress?: string) => {
  return prisma.$transaction(async (tx) => {
    const report = await tx.report.create({
      data: {
        userId,
        title: data.title,
        content: data.content,
        status: 'pending',
      },
      include: {
        user: { include: { department: true } },
      },
    });

    await tx.auditLog.create({
      data: {
        userId,
        action: `Created report: ${data.title}`,
        reason: 'User submitted a report',
        category: 'user-management',
        status: 'success',
        ipAddress: ipAddress ?? null,
      },
    });

    return report;
  });
};

export const getAll = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) => {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (params.status && params.status !== 'all') {
    where.status = params.status;
  }

  if (params.search) {
    where.OR = [
      { title: { contains: params.search } },
      { user: { name: { contains: params.search } } },
      { user: { email: { contains: params.search } } },
    ];
  }

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where,
      include: { user: { include: { department: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.report.count({ where }),
  ]);

  return {
    reports,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const updateStatus = async (id: string, data: UpdateReportInput, performedByUserId: string, ipAddress?: string) => {
  return prisma.$transaction(async (tx) => {
    const report = await tx.report.update({
      where: { id },
      data: { status: data.status },
      include: { user: { include: { department: true } } },
    });

    await tx.auditLog.create({
      data: {
        userId: performedByUserId,
        action: `Report ${data.status === 'resolved' ? 'resolved' : 'updated'}: ${report.title}`,
        reason: `Super admin ${data.status === 'resolved' ? 'resolved' : 'updated'} the report`,
        category: 'user-management',
        status: 'success',
        ipAddress: ipAddress ?? null,
      },
    });

    return report;
  });
};

export const remove = async (id: string, performedByUserId: string, ipAddress?: string) => {
  return prisma.$transaction(async (tx) => {
    const report = await tx.report.delete({
      where: { id },
      include: { user: { include: { department: true } } },
    });

    await tx.auditLog.create({
      data: {
        userId: performedByUserId,
        action: `Deleted report: ${report.title}`,
        reason: 'Super admin deleted the report',
        category: 'user-management',
        status: 'success',
        ipAddress: ipAddress ?? null,
      },
    });

    return report;
  });
};
