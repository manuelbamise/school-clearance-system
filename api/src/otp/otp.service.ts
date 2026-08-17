import crypto from 'crypto';
import { Redis } from '@upstash/redis';
import prisma from '../lib/prisma.js';
import { AppError } from '../lib/AppError.js';
import * as activitiesService from '../activities/activities.service.js';
import { sendEmail } from '../email/email.service.js';

const OTP_LENGTH = 6;
const OTP_TTL_SECONDS = 10 * 60;

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const redis =
  redisUrl && redisToken
    ? new Redis({ url: redisUrl, token: redisToken })
    : null;

const memoryStore = new Map<string, { code: string; expiresAt: number }>();

const otpKey = (userId: string) => `otp:${userId}`;

const generateCode = (): string =>
  crypto
    .randomInt(0, 10 ** OTP_LENGTH)
    .toString()
    .padStart(OTP_LENGTH, '0');

const timingSafeEqualStr = (a: string, b: string) => {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
};

const storeCode = async (userId: string, code: string) => {
  if (redis) {
    await redis.set(otpKey(userId), code, { ex: OTP_TTL_SECONDS });
    return;
  }
  memoryStore.set(otpKey(userId), {
    code,
    expiresAt: Date.now() + OTP_TTL_SECONDS * 1000,
  });
};

const getCode = async (userId: string): Promise<string | null> => {
  if (redis) {
    return redis.get<string>(otpKey(userId));
  }
  const entry = memoryStore.get(otpKey(userId));
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryStore.delete(otpKey(userId));
    return null;
  }
  return entry.code as string;
};

const deleteCode = async (userId: string) => {
  if (redis) {
    await redis.del(otpKey(userId));
    return;
  }
  memoryStore.delete(otpKey(userId));
};

export const sendOtp = async (userId: string, email: string) => {
  const code = generateCode();
  await storeCode(userId, code);

  const html = `<!doctype html>
    <html>
      <body style="font-family: Arial, sans-serif; background: #f4f6fa; padding: 24px;">
        <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #e5e7eb;">
          <h2 style="margin: 0 0 8px; color: #0f172a;">Verify your email</h2>
          <p style="color: #64748b; margin: 0 0 24px;">Use the code below to verify your ClearPath account. This code expires in 10 minutes.</p>
          <div style="font-size: 32px; font-weight: 700; letter-spacing: 8px; text-align: center; color: #2563eb; padding: 16px 0; background: #f1f5f9; border-radius: 12px;">
            ${code}
          </div>
          <p style="color: #94a3b8; font-size: 13px; margin: 24px 0 0;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      </body>
    </html>`;

  await sendEmail({
    to: email,
    subject: 'Your ClearPath verification code',
    html,
  });
};

export const verifyOtp = async (
  userId: string,
  email: string,
  code: string,
) => {
  const stored: string | null = await getCode(userId);
  if (!stored || stored == null) {
    throw new AppError(
      'Verification code has expired. Please request a new one.',
      400,
    );
  }

  if (!timingSafeEqualStr(stored.toString(), code)) {
    throw new AppError('Invalid verification code.', 400);
  }

  await deleteCode(userId);

  const user = await prisma.$transaction(async (tx) => {
    const u = await tx.user.update({
      where: { id: userId },
      data: { isVerified: true },
      include: { department: true },
    });

    await tx.auditLog.create({
      data: {
        userId,
        action: 'Email verified',
        reason: 'User verified their email via OTP',
        category: 'login',
        status: 'success',
        ipAddress: null,
      },
    });

    return u;
  });

  await activitiesService.log(userId, 'verified email', email, 'success');
  return user;
};
