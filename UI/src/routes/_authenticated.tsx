import { createFileRoute, Outlet, Navigate, useLocation } from '@tanstack/react-router'
import DashboardShell from '@/components/layout/dashboard-shell'
import { useAuth } from '@/contexts/auth-context'
import { Skeleton } from '@/components/ui/skeleton'
import type { Role } from '@/types'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
})

const rolePrefix: Record<Role, string> = {
  student: '/student',
  'academic-unit': '/academic-unit',
  'bursary-unit': '/bursary-unit',
  'department-unit': '/department-unit',
  superadmin: '/superadmin',
}

type DashboardPath =
  | '/student/dashboard'
  | '/academic-unit/dashboard'
  | '/bursary-unit/dashboard'
  | '/department-unit/dashboard'
  | '/superadmin/dashboard'

const DASHBOARD_BY_ROLE: Record<Role, DashboardPath> = {
  student: '/student/dashboard',
  'academic-unit': '/academic-unit/dashboard',
  'bursary-unit': '/bursary-unit/dashboard',
  'department-unit': '/department-unit/dashboard',
  superadmin: '/superadmin/dashboard',
}

function AuthenticatedLayout() {
  const { user, isHydrating } = useAuth()
  const location = useLocation()

  if (isHydrating) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-full max-w-sm space-y-4 p-6">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const path = location.pathname
  const prefix = rolePrefix[user.role]
  const isOnOwnRoute = path === '/' || path.startsWith(prefix)

  if (!isOnOwnRoute) {
    return <Navigate to={DASHBOARD_BY_ROLE[user.role]} replace />
  }

  return (
    <DashboardShell>
      <Outlet />
    </DashboardShell>
  )
}
