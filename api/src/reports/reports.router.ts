import { Router } from 'express';
import * as reportsController from './reports.controller.js';
import { authenticateVerified, authorize, denyRole } from '../middleware/auth.middleware.js';
import { createReportLimiter } from '../middleware/rate-limit.middleware.js';

const reportsRouter = Router();

reportsRouter.post('/', createReportLimiter, authenticateVerified, denyRole('superAdmin'), reportsController.create);
reportsRouter.get('/', authenticateVerified, authorize('superAdmin'), reportsController.getAll);
reportsRouter.patch('/:id', authenticateVerified, authorize('superAdmin'), reportsController.updateStatus);
reportsRouter.delete('/:id', authenticateVerified, authorize('superAdmin'), reportsController.remove);

export default reportsRouter;
