import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { GraduationCap } from 'lucide-react'
import SignupForm from '@/components/auth/signup-form'

export const Route = createFileRoute('/signup')({
  component: SignupPage,
})

function SignupPage() {
  return (
    <div className="relative flex min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#2d1b69] to-[#1a1a2e]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />

      <div className="relative flex w-full">
        {/* Left - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Join E-School</h1>
            <p className="text-lg text-white/60 max-w-md mx-auto">
              Create your account and start your educational journey with our comprehensive platform.
            </p>

            <div className="mt-12 space-y-4 max-w-sm mx-auto">
              {[
                { title: 'Track Your Progress', desc: 'Monitor grades, assignments, and clearance status' },
                { title: 'Manage Payments', desc: 'View fees, make payments, and track invoices' },
                { title: 'Stay Connected', desc: 'Get real-time updates and notifications' },
              ].map((feature) => (
                <div key={feature.title} className="flex items-start gap-3 text-left rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-primary-light shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white">{feature.title}</p>
                    <p className="text-xs text-white/50 mt-0.5">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right - Form */}
        <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full max-w-md"
          >
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">E-School Portal</span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-1">Create account</h2>
              <p className="text-sm text-white/60 mb-8">Fill in your details to get started</p>

              <SignupForm />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
