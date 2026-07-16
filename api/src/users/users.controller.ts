import type { Request, Response, NextFunction } from 'express';
import * as usersService from './users.service.js';
import { createUserSchema, updateUserSchema } from './users.validation.js';

const sanitize = <T extends { password: string }>(user: T) => {
  const { password: _, ...rest } = user;
  return rest;
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
    const search = req.query.search as string;

    const { users, meta } = await usersService.getAll({ page, limit, search });
    res.json({ status: 'success', data: users.map(sanitize), meta });
  } catch (err) {
    next(err);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await usersService.getById(req.params.id);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    res.json({ status: 'success', data: sanitize(user) });
  } catch (err) {
    next(err);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createUserSchema.parse(req.body);
    const performedByUserId = (req.user as { id: string }).id;
    const user = await usersService.create(data, performedByUserId, req.ip);
    res.status(201).json({ status: 'success', data: sanitize(user) });
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = updateUserSchema.parse(req.body);
    const performedByUserId = (req.user as { id: string }).id;
    const user = await usersService.update(req.params.id, data, performedByUserId, req.ip);
    res.json({ status: 'success', data: sanitize(user) });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const performedByUserId = (req.user as { id: string }).id;
    await usersService.remove(req.params.id, performedByUserId, req.ip);
    res.json({ status: 'success', message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};
