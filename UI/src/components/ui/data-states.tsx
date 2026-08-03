import type { LucideIcon } from 'lucide-react'
import { Inbox, AlertCircle } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function TableSkeleton({ rows = 4, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="grid gap-4 rounded-lg border border-border/60 p-4"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className={cn('h-4', c === 0 ? 'max-w-[160px]' : 'max-w-[120px]')} />
          ))}
        </div>
      ))}
    </div>
  )
}

export function EmptyState({
  icon: Icon = Inbox,
  title = 'Nothing here yet',
  description,
  action,
  className,
}: {
  icon?: LucideIcon
  title?: string
  description?: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border px-6 py-14 text-center', className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="h-6 w-6" />
      </div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description && <p className="max-w-sm text-xs text-muted-foreground">{description}</p>}
      {action}
    </div>
  )
}

export function ErrorState({
  message = 'Something went wrong while loading this data.',
  onRetry,
  className,
}: {
  message?: string
  onRetry?: () => void
  className?: string
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-14 text-center', className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="h-6 w-6" />
      </div>
      <p className="text-sm font-medium text-foreground">Failed to load</p>
      <p className="max-w-sm text-xs text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-2" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
