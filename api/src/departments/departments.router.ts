import { Router } from 'express';
import * as departmentsController from './departments.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const departmentsRouter = Router();

departmentsRouter.use(authenticate);
departmentsRouter.use(authorize('superAdmin'));

departmentsRouter.get('/', departmentsController.getAll);
departmentsRouter.post('/', departmentsController.create);
departmentsRouter.delete('/:id', departmentsController.remove);

export default departmentsRouter;
