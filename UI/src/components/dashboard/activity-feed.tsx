import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { activities } from '@/data/dummy'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const typeStyles: Record<string, string> = {
  info: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-destructive/10 text-destructive',
}

export default function ActivityFeed() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold">Recent Activities</h3>
      </div>
      <div className="divide-y divide-border">
        {activities.map((activity, i) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-muted/20"
          >
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className={cn(
                'text-[10px] font-semibold',
                typeStyles[activity.type || 'info']
              )}>
                {activity.user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-medium text-foreground">{activity.user.name}</span>
                {' '}
                <span className="text-muted-foreground">{activity.action}</span>
                {' '}
                <span className="font-medium text-foreground">{activity.target}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{activity.timestamp}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
