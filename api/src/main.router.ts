import { Router } from 'express';
import authRouter from './auth/auth.router.js';
import usersRouter from './users/users.router.js';

const mainRouter = Router();

mainRouter.get('/health', (_req, res) => {
  res.json({ status: 'success', message: 'Server is running well' });
});

mainRouter.use('/auth', authRouter);
mainRouter.use('/users', usersRouter);

export default mainRouter;
