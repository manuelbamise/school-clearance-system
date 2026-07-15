import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/academic-unit/report')({
  component: AcademicUnitReportPage,
});

function AcademicUnitReportPage() {
  return <div></div>;
}
