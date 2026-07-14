import { createFileRoute } from '@tanstack/react-router'
import ProfilePage from '@/components/layout/profile-page'

export const Route = createFileRoute('/_authenticated/bursary-unit/profile')({
  component: () => <ProfilePage role="bursary-unit" />,
})
