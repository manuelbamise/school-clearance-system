import { createFileRoute } from '@tanstack/react-router'
import UnitClearancePage from '@/components/unit/unit-clearance-page'

export const Route = createFileRoute('/_authenticated/academic-unit/clearance')({
  component: AcademicUnitClearancePage,
})

function AcademicUnitClearancePage() {
  return <UnitClearancePage unit="academic" />
}
