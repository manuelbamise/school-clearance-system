import prisma from '../lib/prisma.js';
import { AppError } from '../lib/AppError.js';
import * as activitiesService from '../activities/activities.service.js';

const UNITS = ['academic', 'bursary', 'department'];

const getUnitForRole = (role: string) => {
  if (role === 'department') return 'department';
  return role;
};

export const getMine = async (studentId: string) => {
  const clearance = await prisma.clearance.findUnique({
    where: { studentId },
    include: {
      units: {
        include: { clearedBy: true },
      },
    },
  });

  if (!clearance) {
    return {
      clearance: null,
      steps: UNITS.map((unit) => ({ unit, status: 'pending' })),
    };
  }

  const steps = UNITS.map((unit) => {
    const cu = clearance.units.find((u) => u.unit === unit);
    return {
      unit,
      status: cu?.status || 'pending',
      clearedBy: cu?.clearedBy
        ? { id: cu.clearedBy.id, name: cu.clearedBy.name }
        : null,
      clearedAt: cu?.clearedAt || null,
    };
  });

  return {
    clearance: { id: clearance.id, createdAt: clearance.createdAt },
    steps,
  };
};

export const getList = async (staffId: string, role: string, params: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) => {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const skip = (page - 1) * limit;

  const unit = getUnitForRole(role);

  const staff = await prisma.user.findUnique({ where: { id: staffId } });

  const studentWhere: any = { role: 'student' };
  if (role === 'department' && staff?.departmentId) {
    studentWhere.departmentId = staff.departmentId;
  }
  if (params.search) {
    studentWhere.OR = [
      { name: { contains: params.search } },
      { studentId: { contains: params.search } },
    ];
  }

  const where: any = { student: studentWhere, units: { some: { unit } } };
  if (params.status && params.status !== 'all') {
    where.units = { some: { unit, status: params.status } };
  }

  const [clearances, total] = await Promise.all([
    prisma.clearance.findMany({
      where,
      include: {
        student: { include: { department: true } },
        units: { where: { unit }, include: { clearedBy: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.clearance.count({ where }),
  ]);

  return {
    clearances,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const clear = async (
  studentId: string,
  staffId: string,
  role: string,
  ipAddress?: string,
) => {
  return prisma.$transaction(async (tx) => {
    const unit = getUnitForRole(role);

    const staff = await tx.user.findUnique({ where: { id: staffId } });

    const clearance = await tx.clearance.findUnique({
      where: { studentId },
      include: { student: true },
    });
    if (!clearance) throw new AppError('Student is not on the clearance list', 404);

    if (role === 'department') {
      if (!staff?.departmentId || clearance.student.departmentId !== staff.departmentId) {
        throw new AppError('You can only clear students from your department', 403);
      }
    }

    const updated = await tx.clearanceUnit.upsert({
      where: {
        clearanceId_unit: {
          clearanceId: clearance.id,
          unit,
        },
      },
      update: {
        status: 'cleared',
        clearedById: staffId,
        clearedAt: new Date(),
      },
      create: {
        clearanceId: clearance.id,
        unit,
        status: 'cleared',
        clearedById: staffId,
        clearedAt: new Date(),
      },
    });

    await tx.auditLog.create({
      data: {
        userId: staffId,
        action: `Cleared student from ${unit} unit`,
        reason: `${role} unit cleared the student`,
        category: 'user-management',
        status: 'success',
        ipAddress: ipAddress ?? null,
      },
    });

    return { updated, unit };
  }).then(async ({ unit }) => {
    await activitiesService.log(staffId, 'cleared student', `${unit} unit`, 'success');
  });
};
