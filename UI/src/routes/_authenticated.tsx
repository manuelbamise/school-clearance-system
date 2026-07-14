import { createFileRoute, Outlet, Navigate } from '@tanstack/react-router'
import DashboardShell from '@/components/layout/dashboard-shell'
import { useAuth } from '@/contexts/auth-context'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <DashboardShell>
      <Outlet />
    </DashboardShell>
  )
}
