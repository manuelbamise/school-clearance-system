import { Router } from 'express';
import * as reportsController from './reports.controller.js';
import { authenticate, authorize, denyRole } from '../middleware/auth.middleware.js';
import { createReportLimiter } from '../middleware/rate-limit.middleware.js';

const reportsRouter = Router();

reportsRouter.post('/', createReportLimiter, authenticate, denyRole('superAdmin'), reportsController.create);
reportsRouter.get('/', authenticate, authorize('superAdmin'), reportsController.getAll);
reportsRouter.patch('/:id', authenticate, authorize('superAdmin'), reportsController.updateStatus);
reportsRouter.delete('/:id', authenticate, authorize('superAdmin'), reportsController.remove);

export default reportsRouter;
