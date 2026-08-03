import { createFileRoute } from '@tanstack/react-router'
import UnitClearancePage from '@/components/unit/unit-clearance-page'

export const Route = createFileRoute('/_authenticated/department-unit/clearance')({
  component: DepartmentUnitClearancePage,
})

function DepartmentUnitClearancePage() {
  return <UnitClearancePage unit="department" />
}
