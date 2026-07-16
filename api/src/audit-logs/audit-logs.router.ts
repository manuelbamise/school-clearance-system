import { Router } from 'express';
import * as auditLogsController from './audit-logs.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const auditLogsRouter = Router();

auditLogsRouter.use(authenticate);
auditLogsRouter.use(authorize('superAdmin'));

auditLogsRouter.get('/', auditLogsController.getAll);
auditLogsRouter.delete('/', auditLogsController.clearAll);

export default auditLogsRouter;
