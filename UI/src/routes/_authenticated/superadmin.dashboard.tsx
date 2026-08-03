import { createFileRoute } from '@tanstack/react-router';
import RoleDashboard from '@/components/dashboard/role-dashboard';

export const Route = createFileRoute('/_authenticated/superadmin/dashboard')({
  component: SuperadminDashboard,
});

function SuperadminDashboard() {
  return <RoleDashboard role="superadmin" />;
}
