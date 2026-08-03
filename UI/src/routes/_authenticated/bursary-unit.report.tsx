import { createFileRoute } from '@tanstack/react-router'
import UnitReportPage from '@/components/unit/unit-report-page'

export const Route = createFileRoute('/_authenticated/bursary-unit/report')({
  component: BursaryUnitReportPage,
})

function BursaryUnitReportPage() {
  return <UnitReportPage />
}
