import { createFileRoute } from '@tanstack/react-router';
import RoleDashboard from '@/components/dashboard/role-dashboard';

export const Route = createFileRoute('/_authenticated/bursary-unit/dashboard')(
  {
    component: BursaryUnitDashboard,
  },
);

function BursaryUnitDashboard() {
  return <RoleDashboard role="bursary-unit" />;
}
