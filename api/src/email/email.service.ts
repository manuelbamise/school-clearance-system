import { Resend } from 'resend';
import { AppError } from '../lib/AppError.js';

const resendApiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM || 'ClearPath <onboarding@resend.dev>';
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailParams) => {
  if (resend) {
    await resend.emails.send({ from: emailFrom, to, subject, html });
    return;
  }

  if (process.env.NODE_ENV !== 'PRODUCTION') {
    console.log(`[EMAIL] To: ${to} | Subject: ${subject}`);
    return;
  }

  throw new AppError('Email service is not configured', 500);
};
