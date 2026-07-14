import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { scheduleEvents } from '@/data/dummy'
import { BookOpen, Users, Calendar, Clock } from 'lucide-react'

const eventIcons: Record<string, React.ElementType> = {
  class: BookOpen,
  meeting: Users,
  appointment: Calendar,
  task: Clock,
}

const eventColors: Record<string, string> = {
  class: 'bg-purple-500',
  meeting: 'bg-blue-500',
  appointment: 'bg-amber-500',
  task: 'bg-green-500',
}

export default function ScheduleCard() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold">Today's Schedule</h3>
      </div>
      <div className="divide-y divide-border">
        {scheduleEvents.map((event, i) => {
          const Icon = eventIcons[event.type] || Clock
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/20"
            >
              {/* Time column */}
              <div className="flex flex-col items-center min-w-[48px]">
                <span className="text-xs font-bold text-foreground">{event.time}</span>
                <span className="text-[9px] text-muted-foreground">{event.duration}</span>
              </div>

              {/* Timeline dot */}
              <div className="relative flex items-center justify-center">
                <div className={cn('h-2 w-2 rounded-full', eventColors[event.type])} />
                {i < scheduleEvents.length - 1 && (
                  <div className="absolute top-3 h-8 w-px bg-border" />
                )}
              </div>

              {/* Event details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <p className="text-sm font-medium text-foreground truncate">{event.title}</p>
                </div>
                {event.location && (
                  <p className="text-xs text-muted-foreground mt-0.5">{event.location}</p>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
