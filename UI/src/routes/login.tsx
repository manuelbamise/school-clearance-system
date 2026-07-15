import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import LoginForm from '@/components/auth/login-form';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="relative flex min-h-screen overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#2d1b69] to-[#1a1a2e]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />

      <div className="relative flex w-full items-center justify-center">
        {/* Right - Form */}
        <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full max-w-md"
          >
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
              {/* Logo */}
              <div className="flex flex-col items-center justify-center gap-3 mb-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">
                  Clearance Management System
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-1">
                Welcome back
              </h2>
              <p className="text-sm text-white/60 mb-8">
                Sign in to your account to continue
              </p>

              <LoginForm />

              {/* Credentials hint */}
              <div className="mt-6 rounded-lg bg-white/5 border border-white/10 p-3">
                <p className="text-xs font-medium text-white/70 mb-2">
                  Demo Credentials:
                </p>
                <div className="space-y-1 text-[10px] text-white/40">
                  <p>student@portal.test / academic@portal.test</p>
                  <p>bursary@portal.test / department@portal.test</p>
                  <p>super@portal.test</p>
                  <p className="font-medium text-white/60">
                    All passwords: password123
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
