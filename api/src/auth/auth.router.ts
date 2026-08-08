import { Router } from 'express';
import * as authController from './auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { loginLimiter } from '../middleware/rate-limit.middleware.js';

const authRouter = Router();

authRouter.post('/login', loginLimiter, authController.login);
authRouter.get('/me', authenticate, authController.me);

export default authRouter;
