import type { Request, Response, NextFunction } from 'express';
import passport from 'passport';

type Role = 'student' | 'superAdmin' | 'academic' | 'bursary' | 'department';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: Error | null, user: Express.User | false) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    req.user = user;
    next();
  })(req, res, next);
};

export const authorize = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    const user = req.user as { role: Role };
    if (!roles.includes(user.role)) {
      return res.status(403).json({ status: 'error', message: 'Forbidden' });
    }
    next();
  };
};

export const denyRole = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    const user = req.user as { role: Role };
    if (roles.includes(user.role)) {
      return res.status(403).json({ status: 'error', message: 'Forbidden for this role' });
    }
    next();
  };
};
