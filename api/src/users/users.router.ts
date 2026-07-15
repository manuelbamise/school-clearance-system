import { Router } from 'express';
import * as usersController from './users.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const usersRouter = Router();

usersRouter.use(authenticate);
usersRouter.use(authorize('superAdmin'));

usersRouter.get('/', usersController.getAll);
usersRouter.get('/:id', usersController.getById);
usersRouter.post('/', usersController.create);
usersRouter.patch('/:id', usersController.update);
usersRouter.delete('/:id', usersController.remove);

export default usersRouter;
