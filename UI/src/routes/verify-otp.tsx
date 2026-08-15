import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { BrandLogo } from '@/components/brand/brand-logo';
import OtpInputForm from '@/components/auth/otp-input-form';
import { useAuth } from '@/contexts/auth-context';
import type { Role } from '@/types';

export const Route = createFileRoute('/verify-otp')({
  component: VerifyOtpPage,
});

const DASHBOARD_BY_ROLE: Record<Role, string> = {
  student: '/student/dashboard',
  'academic-unit': '/academic-unit/dashboard',
  'bursary-unit': '/bursary-unit/dashboard',
  'department-unit': '/department-unit/dashboard',
  superadmin: '/superadmin/dashboard',
};

function VerifyOtpPage() {
  const { user, isHydrating } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isHydrating) return;
    if (!user) {
      navigate({ to: '/login', replace: true });
    } else if (user.isVerified) {
      navigate({ to: DASHBOARD_BY_ROLE[user.role], replace: true });
    }
  }, [isHydrating, user, navigate]);

  return (
    <div className="relative flex min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b1220] via-[#14345f] to-[#0b1220]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
      <div className="absolute -top-32 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />

      <div className="relative flex w-full items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-blue-950/40 backdrop-blur-xl sm:p-10">
            <div className="mb-10 flex items-center gap-3">
              <BrandLogo variant="dark" className="h-10 w-10" />
              <span className="text-lg font-bold tracking-tight text-white">
                ClearPath
              </span>
            </div>

            <OtpInputForm />
          </div>
        </div>
      </div>
    </div>
  );
}
