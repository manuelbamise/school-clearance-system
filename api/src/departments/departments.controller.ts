import type { Request, Response, NextFunction } from 'express';
import * as departmentsService from './departments.service.js';
import { createDepartmentSchema } from './departments.validation.js';

const sanitize = (dept: any) => ({
  id: dept.id,
  name: dept.name,
  userCount: dept._count?.users ?? 0,
});

export const getAll = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const departments = await departmentsService.getAll();
    res.json({ status: 'success', data: departments.map(sanitize) });
  } catch (err) {
    next(err);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createDepartmentSchema.parse(req.body);
    const performedByUserId = (req.user as { id: string }).id;
    const department = await departmentsService.create(data, performedByUserId, req.ip);
    res.status(201).json({ status: 'success', data: sanitize(department) });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const performedByUserId = (req.user as { id: string }).id;
    await departmentsService.remove(req.params.id, performedByUserId, req.ip);
    res.json({ status: 'success', message: 'Department deleted' });
  } catch (err) {
    next(err);
  }
};
