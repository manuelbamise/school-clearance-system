import { createFileRoute } from '@tanstack/react-router'
import UnitReportPage from '@/components/unit/unit-report-page'

export const Route = createFileRoute('/_authenticated/department-unit/report')({
  component: DepartmentUnitReportPage,
})

function DepartmentUnitReportPage() {
  return <UnitReportPage />
}
