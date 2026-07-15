import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/academic-unit/document')(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
  return <div>Hello "/_authenticated/academic-unit/documents"!</div>
}
