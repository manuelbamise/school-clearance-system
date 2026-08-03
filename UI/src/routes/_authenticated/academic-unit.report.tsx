import { createFileRoute } from '@tanstack/react-router'
import UnitReportPage from '@/components/unit/unit-report-page'

export const Route = createFileRoute('/_authenticated/academic-unit/report')({
  component: AcademicUnitReportPage,
})

function AcademicUnitReportPage() {
  return <UnitReportPage />
}
