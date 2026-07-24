import type { Request, Response, NextFunction } from 'express';
import * as activitiesService from './activities.service.js';

const sanitize = (activity: any) => ({
  id: activity.id,
  user: {
    name: activity.actor.name,
    role: activity.actor.role,
  },
  action: activity.action,
  target: activity.target,
  timestamp: activity.createdAt,
  type: activity.type,
});

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);

    const { activities, meta } = await activitiesService.getAll({ page, limit });
    res.json({ status: 'success', data: activities.map(sanitize), meta });
  } catch (err) {
    next(err);
  }
};
