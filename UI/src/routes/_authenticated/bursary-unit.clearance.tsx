import { createFileRoute } from '@tanstack/react-router'
import UnitClearancePage from '@/components/unit/unit-clearance-page'

export const Route = createFileRoute('/_authenticated/bursary-unit/clearance')({
  component: BursaryUnitClearancePage,
})

function BursaryUnitClearancePage() {
  return <UnitClearancePage unit="bursary" />
}
