import prisma from '../lib/prisma.js';
import { AppError } from '../lib/AppError.js';
import * as activitiesService from '../activities/activities.service.js';
import type { CreateDocumentInput, ReviewDocumentInput } from './documents.validation.js';

const resolveRecipient = async (unit: string, studentDepartmentId: string | null) => {
  if (unit === 'academic' || unit === 'bursary') {
    return prisma.user.findFirst({ where: { role: unit } });
  }

  if (!studentDepartmentId) return null;
  return prisma.user.findFirst({
    where: { role: 'department', departmentId: studentDepartmentId },
  });
};

export const create = async (
  studentId: string,
  data: CreateDocumentInput,
  file: { path: string; size: number; mimetype: string },
  ipAddress?: string,
) => {
  return prisma.$transaction(async (tx) => {
    const student = await tx.user.findUnique({ where: { id: studentId } });
    if (!student) throw new AppError('Student not found', 404);

    const recipient = await tx.user.findFirst({
      where:
        data.unit === 'department'
          ? { role: 'department', departmentId: student.departmentId ?? undefined }
          : { role: data.unit },
    });
    if (!recipient) {
      throw new AppError(`No recipient found for unit: ${data.unit}`, 400);
    }

    const document = await tx.document.create({
      data: {
        name: data.name,
        level: data.level,
        session: data.session,
        unit: data.unit,
        filePath: file.path,
        fileSize: file.size,
        mimeType: file.mimetype,
        studentId,
        recipientId: recipient.id,
        status: 'pending',
      },
      include: {
        student: { include: { department: true } },
        recipient: { include: { department: true } },
      },
    });

    const existing = await tx.clearance.findUnique({ where: { studentId } });
    if (!existing) {
      await tx.clearance.create({
        data: {
          studentId,
          units: {
            create: ['academic', 'bursary', 'department'].map((unit) => ({ unit })),
          },
        },
      });
    }

    await tx.auditLog.create({
      data: {
        userId: studentId,
        action: `Uploaded document: ${data.name}`,
        reason: `Student sent document to ${data.unit} unit`,
        category: 'user-management',
        status: 'success',
        ipAddress: ipAddress ?? null,
      },
    });

    return document;
  }).then(async (document) => {
    await activitiesService.log(studentId, 'uploaded document', data.name, 'info');
    return document;
  });
};

export const getMine = async (studentId: string, params: {
  page?: number;
  limit?: number;
  status?: string;
}) => {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const skip = (page - 1) * limit;

  const where: any = { studentId };
  if (params.status && params.status !== 'all') {
    where.status = params.status;
  }

  const [documents, total] = await Promise.all([
    prisma.document.findMany({
      where,
      include: {
        student: { include: { department: true } },
        recipient: { include: { department: true } },
        reviewedBy: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.document.count({ where }),
  ]);

  return {
    documents,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const getInbox = async (recipientId: string, params: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) => {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const skip = (page - 1) * limit;

  const where: any = { recipientId };
  if (params.status && params.status !== 'all') {
    where.status = params.status;
  }
  if (params.search) {
    where.OR = [
      { name: { contains: params.search } },
      { student: { name: { contains: params.search } } },
      { student: { studentId: { contains: params.search } } },
    ];
  }

  const [documents, total] = await Promise.all([
    prisma.document.findMany({
      where,
      include: {
        student: { include: { department: true } },
        recipient: { include: { department: true } },
        reviewedBy: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.document.count({ where }),
  ]);

  return {
    documents,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const review = async (
  id: string,
  data: ReviewDocumentInput,
  reviewerId: string,
  ipAddress?: string,
) => {
  return prisma.$transaction(async (tx) => {
    const document = await tx.document.findUnique({
      where: { id },
      include: { recipient: true, student: true },
    });
    if (!document) throw new AppError('Document not found', 404);
    if (document.recipientId !== reviewerId) {
      throw new AppError('You can only review documents sent to you', 403);
    }
    if (data.status === 'rejected' && !data.rejectionReason) {
      throw new AppError('Rejection reason is required', 400);
    }

    const updated = await tx.document.update({
      where: { id },
      data: {
        status: data.status,
        rejectionReason: data.status === 'rejected' ? data.rejectionReason : null,
        reviewedById: reviewerId,
        reviewedAt: new Date(),
      },
      include: {
        student: { include: { department: true } },
        recipient: { include: { department: true } },
        reviewedBy: true,
      },
    });

    await tx.auditLog.create({
      data: {
        userId: reviewerId,
        action: `${data.status === 'approved' ? 'Approved' : 'Rejected'} document: ${document.name}`,
        reason: `${document.recipient.role} unit ${data.status} the document`,
        category: 'user-management',
        status: 'success',
        ipAddress: ipAddress ?? null,
      },
    });

    return updated;
  }).then(async (document) => {
    await activitiesService.log(
      reviewerId,
      data.status === 'approved' ? 'approved document' : 'rejected document',
      document.name,
      data.status === 'approved' ? 'success' : 'warning',
    );
    return document;
  });
};
