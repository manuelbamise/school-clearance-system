import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/auth-context'
import MetricCard from '@/components/dashboard/metric-card'
import ActivityFeed from '@/components/dashboard/activity-feed'
import QuickActions from '@/components/dashboard/quick-actions'
import { useAsync } from '@/hooks/use-async'
import { ErrorState } from '@/components/ui/data-states'
import { getMetrics } from '@/lib/api/metrics.api'
import { getActivities } from '@/lib/api/activities.api'
import { mapMetric, mapActivity } from '@/lib/api/mappers'
import type { Role } from '@/types'

const ROLES: Record<Role, { badge: string; subtitle: string; firstNameIndex: number; columns: string }> = {
  student: {
    badge: 'Student',
    subtitle: "Here's what's happening with your clearance today.",
    firstNameIndex: 0,
    columns: 'sm:grid-cols-2 lg:grid-cols-3',
  },
  'academic-unit': {
    badge: 'Dept: Academic Affairs',
    subtitle: 'Academic affairs overview and class management.',
    firstNameIndex: 1,
    columns: 'sm:grid-cols-2 lg:grid-cols-2',
  },
  'bursary-unit': {
    badge: 'Dept: Bursary',
    subtitle: 'Bursary overview and payment management.',
    firstNameIndex: 1,
    columns: 'sm:grid-cols-2 lg:grid-cols-2',
  },
  'department-unit': {
    badge: 'Dept: Department Unit',
    subtitle: 'Department overview and clearance management.',
    firstNameIndex: 1,
    columns: 'sm:grid-cols-2 lg:grid-cols-2',
  },
  superadmin: {
    badge: 'Super Admin Access',
    subtitle: 'System-wide oversight and platform management.',
    firstNameIndex: 0,
    columns: 'sm:grid-cols-2 lg:grid-cols-2',
  },
}

export default function RoleDashboard({ role }: { role: Role }) {
  const { user } = useAuth()
  const meta = ROLES[role]
  const firstName = user?.name?.split(' ')[meta.firstNameIndex] || 'there'

  const metrics = useAsync(async () => (await getMetrics()).map(mapMetric), [])
  const activities = useAsync(
    async () => (await getActivities({ limit: 100 })).activities.map(mapActivity),
    [],
  )

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome, {firstName}</h1>
          <p className="text-sm text-muted-foreground mt-1">{meta.subtitle}</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2">
          <span className="text-xs font-medium text-primary">{meta.badge}</span>
        </div>
      </motion.div>

      <div className={`grid gap-4 ${meta.columns}`}>
        {metrics.isLoading
          ? Array.from({ length: role === 'student' ? 3 : 2 }).map((_, i) => (
              <MetricCard
                key={i}
                index={i}
                data={{ label: 'Loading…', value: '—', icon: 'BarChart3' }}
              />
            ))
          : metrics.error
            ? null
            : metrics.data?.map((metric, i) => (
                <MetricCard key={metric.label} data={metric} index={i} />
              ))}
      </div>

      {metrics.error && (
        <ErrorState message={metrics.error} onRetry={metrics.refetch} />
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {activities.error ? (
            <ErrorState message={activities.error} onRetry={activities.refetch} />
          ) : (
            <ActivityFeed
              items={activities.data ?? []}
              isLoading={activities.isLoading}
            />
          )}
        </div>
        <div className="space-y-6">
          <QuickActions role={role} />
        </div>
      </div>
    </div>
  )
}
