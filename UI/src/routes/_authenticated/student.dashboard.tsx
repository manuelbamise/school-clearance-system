import { createFileRoute } from '@tanstack/react-router';
import RoleDashboard from '@/components/dashboard/role-dashboard';

export const Route = createFileRoute('/_authenticated/student/dashboard')({
  component: StudentDashboard,
});

function StudentDashboard() {
  return <RoleDashboard role="student" />;
}
