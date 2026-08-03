import type { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import * as authService from './auth.service.js';

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
  const user = req.user as { password: string };
  res.json({ status: 'success', data: authService.sanitizeUser(user) });
};
