import { Router } from 'express';
import * as authController from './auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const authRouter = Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.get('/me', authenticate, authController.me);

export default authRouter;
