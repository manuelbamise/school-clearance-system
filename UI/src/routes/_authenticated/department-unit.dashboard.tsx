import { createFileRoute } from '@tanstack/react-router';
import RoleDashboard from '@/components/dashboard/role-dashboard';

export const Route = createFileRoute('/_authenticated/department-unit/dashboard')(
  {
    component: DepartmentUnitDashboard,
  },
);

function DepartmentUnitDashboard() {
  return <RoleDashboard role="department-unit" />;
}
