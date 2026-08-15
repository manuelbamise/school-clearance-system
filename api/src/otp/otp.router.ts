import { Router } from 'express';
import * as otpController from './otp.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { otpSendLimiter, otpVerifyLimiter } from '../middleware/rate-limit.middleware.js';

const otpRouter = Router();

otpRouter.post('/send', authenticate, otpSendLimiter, otpController.send);
otpRouter.post('/verify', authenticate, otpVerifyLimiter, otpController.verify);

export default otpRouter;
