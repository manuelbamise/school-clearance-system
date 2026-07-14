import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/auth-context'

interface SignupFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()

  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupFormData>({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  const password = watch('password')

  const onSubmit = async (data: SignupFormData) => {
    setError('')
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    const result = await login(data.email, data.password)
    if (result.success && result.role) {
      const paths: Record<string, string> = {
        student: '/student/dashboard',
        'academic-unit': '/academic-unit/dashboard',
        'bursary-unit': '/bursary-unit/dashboard',
        'department-unit': '/department-unit/dashboard',
        superadmin: '/superadmin/dashboard',
      }
      navigate({ to: paths[result.role] || '/student/dashboard' })
    } else {
      setError(result.error || 'Signup failed. Please check your credentials.')
    }
  }

  const passwordChecks = [
    { label: 'At least 8 characters', met: password?.length >= 8 },
    { label: 'Contains uppercase', met: /[A-Z]/.test(password || '') },
    { label: 'Contains number', met: /\d/.test(password || '') },
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3"
        >
          <p className="text-sm text-destructive font-medium">{error}</p>
        </motion.div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          placeholder="John Doe"
          {...register('name', { required: 'Name is required' })}
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@portal.test"
          {...register('email', { required: 'Email is required' })}
          className={errors.email ? 'border-destructive' : ''}
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a password"
            {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'At least 8 characters' } })}
            className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}

        {password && (
          <div className="space-y-1.5 pt-1">
            {passwordChecks.map((check) => (
              <div key={check.label} className="flex items-center gap-2">
                {check.met ? (
                  <Check className="h-3 w-3 text-success" />
                ) : (
                  <X className="h-3 w-3 text-muted-foreground" />
                )}
                <span className={check.met ? 'text-xs text-success' : 'text-xs text-muted-foreground'}>
                  {check.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          {...register('confirmPassword', { required: 'Please confirm your password' })}
          className={errors.confirmPassword ? 'border-destructive' : ''}
        />
        {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
      </div>

      <Button type="submit" variant="gradient" className="w-full h-11" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <a href="/login" className="text-primary font-medium hover:underline">
          Sign in
        </a>
      </p>
    </form>
  )
}
