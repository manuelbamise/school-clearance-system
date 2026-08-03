import { createFileRoute } from '@tanstack/react-router'
import UnitDocumentsPage from '@/components/unit/unit-documents-page'

export const Route = createFileRoute('/_authenticated/bursary-unit/document')({
  component: BursaryUnitDocumentPage,
})

function BursaryUnitDocumentPage() {
  return <UnitDocumentsPage unit="bursary" />
}
