import { Router } from 'express';
import * as activitiesController from './activities.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const activitiesRouter = Router();

activitiesRouter.use(authenticate);
activitiesRouter.get('/', activitiesController.getAll);
activitiesRouter.delete('/', authorize('superAdmin'), activitiesController.clearAll);

export default activitiesRouter;
