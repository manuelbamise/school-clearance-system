import { useNavigate, useLocation } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/hooks/use-sidebar';
import { useAuth } from '@/contexts/auth-context';
import { sidebarItems } from '@/data/dummy';
import {
  LayoutDashboard,
  User,
  BookOpen,
  DollarSign,
  FileUp,
  Building2,
  Calendar,
  Users,
  BarChart3,
  FileText,
  UserCheck,
  Landmark,
  UserCog,
  Settings,
  ScrollText,
  PlusCircle,
  Bell,
  LogOut,
  GraduationCap,
  ClipboardList,
  Activity,
  Clock,
  AlertTriangle,
  TrendingUp,
  Award,
  ClipboardCheck,
  MessageCircleWarning,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { Role } from '@/types';

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  User,
  BookOpen,
  DollarSign,
  ShieldCheck,
  FileUp,
  Building2,
  Calendar,
  Users,
  BarChart3,
  FileText,
  UserCheck,
  Landmark,
  UserCog,
  Settings,
  ScrollText,
  PlusCircle,
  Bell,
  LogOut,
  GraduationCap,
  ClipboardList,
  Activity,
  Clock,
  AlertTriangle,
  TrendingUp,
  Award,
  ClipboardCheck,
  FileCheck,
  MessageCircleWarning,
};

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { collapsed, toggle, mobileOpen, setMobileOpen } = useSidebar();
  const { user, logout } = useAuth();

  const role = user?.role as Role;
  const items = sidebarItems[role] || [];

  const handleNav = (path: string) => {
    if (path === '#') return;
    navigate({ to: path });
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate({ to: '/login' });
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-sidebar">
      {/* Logo */}
      <div
        className={cn(
          'flex h-16 items-center px-4',
          collapsed ? 'justify-center' : 'justify-between',
        )}
      >
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary text-white">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold text-gradient">
              Clearance Management System
            </span>
          </div>
        )}
        {collapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary text-white">
            <GraduationCap className="h-4 w-4" />
          </div>
        )}
      </div>

      <Separator className="mx-4 w-auto" />

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 scrollbar-none">
        <nav className="flex flex-col gap-1">
          {items.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => handleNav(item.path)}
                className={cn(
                  'group relative flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:cursor-pointer',
                  collapsed && 'justify-center',
                  isActive
                    ? 'gradient-primary text-white shadow-sm'
                    : 'text-sidebar-foreground/70 hover:bg-primary/10 hover:text-primary',
                )}
              >
                <Icon
                  className={cn(
                    'h-4.5 w-4.5 shrink-0',
                    collapsed ? 'h-5 w-5' : '',
                  )}
                />
                {!collapsed && (
                  <>
                    <span className="ml-3 truncate">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/20 px-1.5 text-[10px] font-bold text-primary">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {collapsed && item.badge && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <Separator className="mx-4 w-auto" />

      {/* Logout */}
      <div className="p-3">
        <button
          onClick={handleLogout}
          className={cn(
            'flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive',
            collapsed && 'justify-center',
          )}
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          {!collapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className={cn(
          'hidden md:flex h-screen flex-col border-r border-border bg-sidebar overflow-hidden',
        )}
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile sheet */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-sidebar shadow-xl animate-in slide-in-from-left">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
