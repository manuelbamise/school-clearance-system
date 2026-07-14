import { useState, useEffect } from 'react'
import { Menu, Bell, Sun, Moon, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/auth-context'
import { useTheme } from '@/contexts/theme-context'
import { useSidebar } from '@/hooks/use-sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { notifications } from '@/data/dummy'

const roleLabels: Record<string, string> = {
  student: 'Student',
  'academic-unit': 'Academic Unit',
  'bursary-unit': 'Bursary Unit',
  'department-unit': 'Department Unit',
  superadmin: 'Super Admin',
}

export default function Topbar() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { setMobileOpen } = useSidebar()
  const [dateStr, setDateStr] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const unread = notifications.filter((n) => !n.read).length

  useEffect(() => {
    const now = new Date()
    setDateStr(now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }))
  }, [])

  if (!user) return null

  const initials = user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden sm:block">
          <p className="text-sm text-muted-foreground">{dateStr}</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Role Badge */}
        <Badge variant="secondary" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {roleLabels[user.role as keyof typeof roleLabels] || user.role}
        </Badge>

        {/* Theme Toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground">
          {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </Button>

        {/* Notifications */}
        <div className="relative">
          <Button variant="ghost" size="icon" onClick={() => setNotifOpen(!notifOpen)} className="text-muted-foreground relative">
            <Bell className="h-4.5 w-4.5" />
            {unread > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white px-1">
                {unread}
              </span>
            )}
          </Button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border bg-card shadow-lg z-50"
              >
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <span className="text-sm font-semibold">Notifications</span>
                  {unread > 0 && <Badge variant="default" className="text-[10px]">{unread} new</Badge>}
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className={cn(
                      'flex gap-3 border-b border-border/50 px-4 py-3 transition-colors hover:bg-muted/30',
                      !n.read && 'bg-primary/5'
                    )}>
                      <div className={cn(
                        'mt-0.5 h-2 w-2 shrink-0 rounded-full',
                        !n.read ? 'bg-primary' : 'bg-muted-foreground/30'
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">{n.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-border">
          <Avatar className="h-8 w-8 ring-2 ring-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-tight">{user.name}</p>
            <p className="text-[10px] text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
