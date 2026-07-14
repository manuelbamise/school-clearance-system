import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/auth-context'
import MetricCard from '@/components/dashboard/metric-card'
import ActivityFeed from '@/components/dashboard/activity-feed'
import ScheduleCard from '@/components/dashboard/schedule-card'
import QuickActions from '@/components/dashboard/quick-actions'
import { metricCards } from '@/data/dummy'

export const Route = createFileRoute('/_authenticated/bursary-unit/dashboard')({
  component: BursaryUnitDashboard,
})

function BursaryUnitDashboard() {
  const { user } = useAuth()
  const metrics = metricCards['bursary-unit'] || []

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome, {user?.name?.split(' ')[0] || 'Bursary Unit'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Financial operations and payment management.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2">
          <span className="text-xs font-medium text-primary">
            Dept: Bursary
          </span>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, i) => (
          <MetricCard key={metric.label} data={metric} index={i} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <ActivityFeed />
        </div>
        <div className="space-y-6">
          <ScheduleCard />
          <QuickActions role="bursary-unit" />
        </div>
      </div>
    </div>
  )
}
