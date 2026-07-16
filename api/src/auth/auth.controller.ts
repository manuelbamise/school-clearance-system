import type { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import * as authService from './auth.service.js';
import { registerSchema } from './auth.validation.js';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = registerSchema.parse(req.body);
    const { user, token } = await authService.register(data, req.ip);
    res.status(201).json({
      status: 'success',
      data: { user: authService.sanitizeUser(user), token },
    });
  } catch (err) {
    next(err);
  }
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', { session: false }, (err: Error | null, user: any, info: any) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ status: 'error', message: info?.message || 'Invalid credentials' });
    }
    const token = authService.generateToken(user);
    authService.logLogin(user.id, req.ip);
    res.json({
      status: 'success',
      data: { user: authService.sanitizeUser(user), token },
    });
  })(req, res, next);
};

export const me = (req: Request, res: Response) => {
  const user = req.user!;
  res.json({ status: 'success', data: authService.sanitizeUser(user) });
};
