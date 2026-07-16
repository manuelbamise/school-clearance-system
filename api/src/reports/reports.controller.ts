import type { Request, Response, NextFunction } from 'express';
import * as reportsService from './reports.service.js';
import { createReportSchema, updateReportSchema } from './reports.validation.js';

const sanitize = (report: any) => ({
  id: report.id,
  userName: report.user.name,
  userEmail: report.user.email,
  userDepartment: report.user.department?.name || '',
  title: report.title,
  content: report.content,
  status: report.status,
  date: report.createdAt.toISOString().split('T')[0],
});

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createReportSchema.parse(req.body);
    const userId = (req.user as { id: string }).id;
    const report = await reportsService.create(userId, data, req.ip);
    res.status(201).json({ status: 'success', data: sanitize(report) });
  } catch (err) {
    next(err);
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
    const search = req.query.search as string;
    const status = req.query.status as string;

    const { reports, meta } = await reportsService.getAll({ page, limit, search, status });
    res.json({ status: 'success', data: reports.map(sanitize), meta });
  } catch (err) {
    next(err);
  }
};

export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = updateReportSchema.parse(req.body);
    const performedByUserId = (req.user as { id: string }).id;
    const report = await reportsService.updateStatus(req.params.id, data, performedByUserId, req.ip);
    res.json({ status: 'success', data: sanitize(report) });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const performedByUserId = (req.user as { id: string }).id;
    await reportsService.remove(req.params.id, performedByUserId, req.ip);
    res.json({ status: 'success', message: 'Report deleted' });
  } catch (err) {
    next(err);
  }
};
