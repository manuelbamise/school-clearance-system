import { createFileRoute } from '@tanstack/react-router'
import ProfilePage from '@/components/layout/profile-page'

export const Route = createFileRoute('/_authenticated/superadmin/profile')({
  component: () => <ProfilePage role="superadmin" />,
})
