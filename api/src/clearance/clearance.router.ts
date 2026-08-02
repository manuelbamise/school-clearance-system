import { Router } from 'express';
import * as clearanceController from './clearance.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const clearanceRouter = Router();

clearanceRouter.use(authenticate);

clearanceRouter.get('/me', authorize('student'), clearanceController.getMine);
clearanceRouter.get(
  '/',
  authorize('academic', 'bursary', 'department'),
  clearanceController.getList,
);
clearanceRouter.patch(
  '/:studentId/clear',
  authorize('academic', 'bursary', 'department'),
  clearanceController.clearStudent,
);

export default clearanceRouter;
