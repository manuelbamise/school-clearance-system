import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/superadmin/users')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/superadmin/users"!</div>
}
