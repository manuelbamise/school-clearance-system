import { createFileRoute } from '@tanstack/react-router';
import RoleDashboard from '@/components/dashboard/role-dashboard';

export const Route = createFileRoute('/_authenticated/academic-unit/dashboard')(
  {
    component: AcademicUnitDashboard,
  },
);

function AcademicUnitDashboard() {
  return <RoleDashboard role="academic-unit" />;
}
