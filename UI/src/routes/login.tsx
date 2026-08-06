import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { motion, useReducedMotion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import LoginForm from '@/components/auth/login-form';
import LoginTestimonials from '@/components/auth/login-testimonials';
import CityIllustration from '@/components/auth/city-illustration';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b1220] via-[#14345f] to-[#0b1220]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
      <div className="absolute -top-32 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />

      {/* Skyline silhouette */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 128"
        preserveAspectRatio="none"
        className="pointer-events-none absolute bottom-0 left-0 h-32 w-full text-white opacity-[0.04]"
        fill="currentColor"
      >
        <path d="M0 128h16v-24h20v24h14v-40h20v40h16v-56h22v56h18v-28h16v28h20v-64h24v64h18v-40h18v40h22v-80h24v80h18v-32h16v32h20v-48h20v48h18v-72h22v72h22v-36h18v36h18v-60h24v60h20v-44h20v44h18v-88h22v88h20v-32h16v32h22v-52h20v52h18v-68h24v68h20v-40h18v40h22v-76h20v76h18v-48h24v48h20v-56h18v56h22v-84h22v84h18v-36h20v36h20v-64h18v64h22v-44h22v44h18v-72h20v72h20v-32h18v32h22v-56h20v56h18v-66h24v66h20v-40h18v40h22v-80h20v80h18v-44h24v44h20v-60h18v60h22v-72h20v72h18v-36h22v36h20v-52h18v52h14v-28h16v28H0Z" />
      </svg>

      <div className="relative flex w-full items-center justify-center px-4 py-12 sm:px-6">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-4xl"
        >
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-blue-950/40 backdrop-blur-xl">
            <div className="grid lg:grid-cols-2">
              {/* Left - form */}
              <div className="flex flex-col px-8 py-10 sm:px-12">
                <div
                  onClick={() => navigate({ to: '/' })}
                  className="flex items-center gap-3 hover:cursor-pointer hover:opacity-80"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
                    <GraduationCap className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-bold tracking-tight text-white">
                    Clearance
                  </span>
                </div>

                <h2 className="mt-10 text-3xl font-bold tracking-tight text-white">
                  Sign In
                </h2>
                <p className="mt-2 text-sm text-white/60">
                  Welcome back! Please enter your details to continue.
                </p>

                <div className="mt-8">
                  <LoginForm />
                </div>

                <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="mb-2 text-xs font-medium text-white/70">
                    Demo Credentials:
                  </p>
                  <div className="space-y-1 text-[11px] text-white/40">
                    <p>student@portal.test / academic@portal.test</p>
                    <p>bursary@portal.test / department@portal.test</p>
                    <p>super@portal.test</p>
                    <p className="font-medium text-white/60">
                      All passwords: password123
                    </p>
                  </div>
                </div>
              </div>

              {/* Right - testimonial + illustration */}
              <div className="hidden flex-col justify-between gap-10 border-t border-white/10 bg-white/[0.03] px-8 py-10 sm:px-12 lg:flex lg:border-l lg:border-t-0">
                <LoginTestimonials />
                <CityIllustration />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
