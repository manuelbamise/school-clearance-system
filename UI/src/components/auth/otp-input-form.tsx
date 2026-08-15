import { useEffect, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Loader2, MailCheck, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { sendOtp, verifyOtp } from '@/lib/api/auth.api';
import { errorMessage } from '@/lib/api/client';
import { mapUser } from '@/lib/api/mappers';
import type { Role } from '@/types';

const RESEND_COOLDOWN = 30;

const DASHBOARD_BY_ROLE: Record<Role, string> = {
  student: '/student/dashboard',
  'academic-unit': '/academic-unit/dashboard',
  'bursary-unit': '/bursary-unit/dashboard',
  'department-unit': '/department-unit/dashboard',
  superadmin: '/superadmin/dashboard',
};

const maskEmail = (email: string) => {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  const masked =
    local.length <= 2 ? `${local[0] ?? ''}***` : `${local.slice(0, 2)}***`;
  return `${masked}@${domain}`;
};

export default function OtpInputForm() {
  const { user, refreshUser, logout } = useAuth();
  const navigate = useNavigate();
  const [digits, setDigits] = useState<string[]>(Array(6).fill(''));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const email = user?.email ?? '';
  const code = digits.join('');

  const sendCode = async () => {
    setSending(true);
    setError('');
    try {
      await sendOtp();
      setInfo('Verification code sent to your email.');
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      setError(errorMessage(err, 'Failed to send verification code'));
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    sendCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const next = Array(6).fill('');
    text.split('').forEach((d, i) => {
      next[i] = d;
    });
    setDigits(next);
    inputsRef.current[Math.min(text.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    if (code.length !== 6) return;
    setVerifying(true);
    setError('');
    try {
      const apiUser = await verifyOtp(code);
      const mapped = mapUser(apiUser);
      await refreshUser();
      navigate({ to: DASHBOARD_BY_ROLE[mapped.role] });
    } catch (err) {
      setError(errorMessage(err, 'Could not verify the code'));
      setDigits(Array(6).fill(''));
      inputsRef.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate({ to: '/login' });
  };

  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15">
        <MailCheck className="h-7 w-7 text-primary" />
      </div>

      <h2 className="text-2xl font-bold tracking-tight text-white">
        Verify your email
      </h2>
      <p className="mt-2 text-sm text-white/60">
        We sent a 6-digit code to{' '}
        <span className="font-medium text-white/80">{maskEmail(email)}</span>.
        Enter it below to continue.
      </p>

      <div className="mt-8 flex items-center justify-center gap-2.5">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            inputMode="numeric"
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            maxLength={1}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            className="h-13 w-11 rounded-xl border border-white/10 bg-white/5 text-center text-xl font-bold text-white outline-none transition-colors focus:border-primary focus:bg-white/10"
          />
        ))}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-sm font-medium text-red-400"
        >
          {error}
        </motion.p>
      )}
      {info && !error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-sm text-white/50"
        >
          {info}
        </motion.p>
      )}

      <Button
        type="button"
        variant="gradient"
        className="mt-6 h-11 w-full"
        onClick={handleVerify}
        disabled={code.length !== 6 || verifying}
      >
        {verifying ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          'Verify'
        )}
      </Button>

      <div className="mt-5 flex items-center gap-1 text-sm text-white/50">
        <span>Didn't get it?</span>
        {cooldown > 0 ? (
          <span className="text-white/40">
            Resend in {cooldown}s
          </span>
        ) : (
          <button
            type="button"
            onClick={sendCode}
            disabled={sending}
            className="font-medium text-primary hover:underline disabled:opacity-50"
          >
            {sending ? 'Sending...' : 'Resend code'}
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-8 flex items-center gap-1.5 text-xs text-white/40 transition-colors hover:text-white/70"
      >
        <LogOut className="h-3.5 w-3.5" />
        Use a different account
      </button>
    </div>
  );
}
