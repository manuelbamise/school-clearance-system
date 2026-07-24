import { Router } from 'express';
import * as activitiesController from './activities.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const activitiesRouter = Router();

activitiesRouter.use(authenticate);
activitiesRouter.get('/', activitiesController.getAll);

export default activitiesRouter;
