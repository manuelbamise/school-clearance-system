import { GraduationCap, FileQuestion, ArrowLeft, LogIn } from 'lucide-react'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  const navigate = useNavigate()
  const router = useRouter()

  const goBack = () => {
    if (window.history.length > 1) {
      router.history.back()
    } else {
      navigate({ to: '/', replace: true })
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#2d1b69] to-[#1a1a2e]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />

      <div className="relative flex flex-col items-center justify-center">
        {/* Branding */}
        <div className="mb-10 flex flex-col items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-lg">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">
            Clearance Management System
          </span>
        </div>

        {/* Empty state */}
        <div className="flex max-w-md flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
            <FileQuestion className="h-7 w-7 text-white/70" />
          </div>
          <h2 className="text-5xl font-bold text-white">404</h2>
          <h3 className="mt-2 text-lg font-semibold text-white">
            Page Not Found
          </h3>
          <p className="mt-2 text-sm text-white/60">
            The page you are looking for doesn't exist or has been moved.
            Please check the address and try again.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Button
              variant="gradient"
              className="gap-2"
              onClick={goBack}
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            <Button
              variant="outline"
              className="gap-2 border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
              onClick={() => navigate({ to: '/login' })}
            >
              <LogIn className="h-4 w-4" />
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
