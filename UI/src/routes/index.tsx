import { createFileRoute, Navigate } from '@tanstack/react-router'
import LandingPage from '@/components/landing/landing-page'
import { useAuth } from '@/contexts/auth-context'
import type { Role } from '@/types'

export const Route = createFileRoute('/')({
  component: IndexRouteComponent,
})

const DASHBOARD_BY_ROLE: Record<Role, string> = {
  student: '/student/dashboard',
  'academic-unit': '/academic-unit/dashboard',
  'bursary-unit': '/bursary-unit/dashboard',
  'department-unit': '/department-unit/dashboard',
  superadmin: '/superadmin/dashboard',
}

function IndexRouteComponent() {
  const { user } = useAuth()

  if (user) {
    return <Navigate to={DASHBOARD_BY_ROLE[user.role] as never} replace />
  }

  return <LandingPage />
}
