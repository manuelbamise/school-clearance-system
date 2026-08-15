import type { Request, Response, NextFunction } from 'express';
import * as otpService from './otp.service.js';
import { verifyOtpSchema } from './otp.validation.js';
import * as authService from '../auth/auth.service.js';

export const send = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as { id: string; email: string };
    await otpService.sendOtp(user.id, user.email);
    res.json({ status: 'success', message: 'Verification code sent to your email' });
  } catch (err) {
    next(err);
  }
};

export const verify = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = verifyOtpSchema.parse(req.body);
    const user = req.user as { id: string; email: string };
    const updated = await otpService.verifyOtp(user.id, user.email, code);
    res.json({
      status: 'success',
      message: 'Email verified successfully',
      data: authService.sanitizeUser(updated),
    });
  } catch (err) {
    next(err);
  }
};
