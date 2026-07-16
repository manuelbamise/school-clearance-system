import type { Request, Response, NextFunction } from 'express';
import * as auditLogsService from './audit-logs.service.js';

const sanitize = (log: any) => ({
  id: log.id,
  who: log.user.name,
  whoEmail: log.user.email,
  what: log.action,
  when: log.createdAt,
  where: log.ipAddress || '127.0.0.1',
  why: log.reason,
  category: log.category,
  status: log.status,
});

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
    const search = req.query.search as string;
    const category = req.query.category as string;

    const { logs, meta } = await auditLogsService.getAll({ page, limit, search, category });
    res.json({ status: 'success', data: logs.map(sanitize), meta });
  } catch (err) {
    next(err);
  }
};

export const clearAll = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    await auditLogsService.clearAll();
    res.json({ status: 'success', message: 'All audit logs cleared' });
  } catch (err) {
    next(err);
  }
};
