import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/department-unit/clearance',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/department-unit/clearance"!</div>
}
