import { useState, useEffect } from 'react';
import {
  Menu,
  Bell,
  Sun,
  Moon,
  PanelLeftOpen,
  PanelLeftClose,
} from 'lucide-react';

import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/contexts/theme-context';
import { useSidebar } from '@/hooks/use-sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const roleLabels: Record<string, string> = {
  student: 'Student',
  'academic-unit': 'Academic Unit',
  'bursary-unit': 'Bursary Unit',
  'department-unit': 'Department Unit',
  superadmin: 'Super Admin',
};

export default function Topbar() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { collapsed, toggle, setMobileOpen } = useSidebar();
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const now = new Date();
    setDateStr(
      now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    );
  }, []);

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

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
        <button
          onClick={toggle}
          className="hidden md:flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </button>
        <div className="hidden sm:block">
          <p className="text-sm text-muted-foreground">{dateStr}</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Role Badge */}
        <Badge
          variant="secondary"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {roleLabels[user.role as keyof typeof roleLabels] || user.role}
        </Badge>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-muted-foreground"
        >
          {theme === 'dark' ? (
            <Sun className="h-4.5 w-4.5" />
          ) : (
            <Moon className="h-4.5 w-4.5" />
          )}
        </Button>

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
  );
}
