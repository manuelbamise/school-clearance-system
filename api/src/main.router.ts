import { Router } from 'express';
import authRouter from './auth/auth.router.js';
import usersRouter from './users/users.router.js';
import reportsRouter from './reports/reports.router.js';
import departmentsRouter from './departments/departments.router.js';
import auditLogsRouter from './audit-logs/audit-logs.router.js';

const mainRouter = Router();

mainRouter.get('/health', (_req, res) => {
  res.json({ status: 'success', message: 'Server is running well' });
});

mainRouter.use('/auth', authRouter);
mainRouter.use('/users', usersRouter);
mainRouter.use('/reports', reportsRouter);
mainRouter.use('/departments', departmentsRouter);
mainRouter.use('/audit-logs', auditLogsRouter);

export default mainRouter;
