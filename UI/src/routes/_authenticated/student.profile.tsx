import { createFileRoute } from '@tanstack/react-router'
import ProfilePage from '@/components/layout/profile-page'

export const Route = createFileRoute('/_authenticated/student/profile')({
  component: () => <ProfilePage role="student" />,
})
