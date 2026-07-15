import type { Request, Response, NextFunction } from 'express';
import * as usersService from './users.service.js';
import { createUserSchema, updateUserSchema } from './users.validation.js';

const sanitize = <T extends { password: string }>(user: T) => {
  const { password: _, ...rest } = user;
  return rest;
};

export const getAll = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await usersService.getAll();
    res.json({ status: 'success', data: users.map(sanitize) });
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
    const user = await usersService.create(data);
    res.status(201).json({ status: 'success', data: sanitize(user) });
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = updateUserSchema.parse(req.body);
    const user = await usersService.update(req.params.id, data);
    res.json({ status: 'success', data: sanitize(user) });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await usersService.remove(req.params.id);
    res.json({ status: 'success', message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};
