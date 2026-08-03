import type { Request, Response, NextFunction } from 'express';
import * as metricsService from './metrics.service.js';

export const getMetrics = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req.user as { id: string }).id;
    const metrics = await metricsService.getMetricsForUser(userId);
    res.json({ status: 'success', data: metrics });
  } catch (err) {
    next(err);
  }
};
