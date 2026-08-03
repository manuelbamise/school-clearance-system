import { createFileRoute } from '@tanstack/react-router'
import UnitDocumentsPage from '@/components/unit/unit-documents-page'

export const Route = createFileRoute('/_authenticated/department-unit/document')({
  component: DepartmentUnitDocumentPage,
})

function DepartmentUnitDocumentPage() {
  return <UnitDocumentsPage unit="department" />
}
