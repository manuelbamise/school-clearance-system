import { createFileRoute, Outlet, redirect, useLocation, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import DashboardShell from '@/components/layout/dashboard-shell'
import { useAuth } from '@/contexts/auth-context'
import { Skeleton } from '@/components/ui/skeleton'
import { getToken } from '@/utils/axios'
import type { Role } from '@/types'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    if (!getToken()) {
      throw redirect({ to: '/login' })
    }
  },
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
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (isHydrating) return
    if (!user) {
      navigate({ to: '/login', replace: true })
      return
    }
    const path = location.pathname
    const prefix = rolePrefix[user.role]
    const isOnOwnRoute = path === '/' || path.startsWith(prefix)
    if (!isOnOwnRoute) {
      navigate({ to: DASHBOARD_BY_ROLE[user.role], replace: true })
    }
  }, [isHydrating, user, location.pathname, navigate])

  if (isHydrating || !user) {
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

  return (
    <DashboardShell>
      <Outlet />
    </DashboardShell>
  )
}