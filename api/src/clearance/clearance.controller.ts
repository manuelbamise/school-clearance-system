import type { Request, Response, NextFunction } from 'express';
import * as clearanceService from './clearance.service.js';

const sanitizeStep = (step: any) => ({
  unit: step.unit,
  status: step.status,
  clearedBy: step.clearedBy,
  clearedAt: step.clearedAt,
});

export const getMine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const studentId = (req.user as { id: string }).id;
    const { clearance, steps } = await clearanceService.getMine(studentId);
    res.json({ status: 'success', data: { clearance, steps: steps.map(sanitizeStep) } });
  } catch (err) {
    next(err);
  }
};

export const getList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const staffId = (req.user as { id: string }).id;
    const role = (req.user as { role: string }).role;
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
    const status = req.query.status as string;
    const search = req.query.search as string;

    const { clearances, meta } = await clearanceService.getList(staffId, role, {
      page,
      limit,
      status,
      search,
    });

    const data = clearances.map((c: any) => {
      const cu = c.units[0];
      return {
        id: c.id,
        student: {
          id: c.student.id,
          name: c.student.name,
          studentId: c.student.studentId,
          department: c.student.department?.name || '',
        },
        unit: cu?.unit || null,
        status: cu?.status || 'pending',
        clearedBy: cu?.clearedBy
          ? { id: cu.clearedBy.id, name: cu.clearedBy.name }
          : null,
        clearedAt: cu?.clearedAt || null,
        createdAt: c.createdAt,
      };
    });

    res.json({ status: 'success', data, meta });
  } catch (err) {
    next(err);
  }
};

export const clearStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const staffId = (req.user as { id: string }).id;
    const role = (req.user as { role: string }).role;
    await clearanceService.clear(req.params.studentId as string, staffId, role, req.ip);
    res.json({ status: 'success', message: 'Student cleared' });
  } catch (err) {
    next(err);
  }
};
