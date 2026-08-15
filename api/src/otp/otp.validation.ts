import { z } from 'zod';

export const verifyOtpSchema = z.object({
  code: z.string().regex(/^\d{6}$/, 'Verification code must be 6 digits'),
});

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
