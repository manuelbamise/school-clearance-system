import { createFileRoute } from '@tanstack/react-router'
import UnitDocumentsPage from '@/components/unit/unit-documents-page'

export const Route = createFileRoute('/_authenticated/academic-unit/document')({
  component: AcademicUnitDocumentPage,
})

function AcademicUnitDocumentPage() {
  return <UnitDocumentsPage unit="academic" />
}
