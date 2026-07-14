import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/superadmin/audit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/superadmin/audit"!</div>
}
