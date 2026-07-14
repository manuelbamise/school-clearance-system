import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Role } from '@/types';
import { quickActions } from '@/data/dummy';
import {
  BookOpen,
  DollarSign,
  Upload,
  PlusCircle,
  ClipboardCheck,
  Calendar,
  BarChart3,
  FileText,
  Bell,
  Building2,
  Users,
  Landmark,
  UserCog,
  ScrollText,
  MessageCircleWarning,
  ShieldCheck,
  User,
} from 'lucide-react';
import type { QuickAction as QuickActionType } from '@/types';
import { useNavigate } from '@tanstack/react-router';

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  DollarSign,
  Upload,
  PlusCircle,
  ClipboardCheck,
  Calendar,
  BarChart3,
  FileText,
  Bell,
  Building2,
  Users,
  Landmark,
  ShieldCheck,
  User,
  MessageCircleWarning,
  UserCog,
  ScrollText,
};

const colorMap: Record<string, string> = {
  purple: 'bg-purple-500/10 text-purple-500 group-hover:bg-purple-500/20',
  green: 'bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20',
  blue: 'bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20',
  amber: 'bg-amber-500/10 text-amber-500 group-hover:bg-amber-500/20',
  red: 'bg-red-500/10 text-red-500 group-hover:bg-red-500/20',
};

export default function QuickActions({ role }: { role: Role }) {
  const navigate = useNavigate();
  const actions = quickActions[role] || [];

  const handleNav = (path: string) => {
    if (path === '#') return;
    navigate({ to: path });
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold">Quick Actions</h3>
      </div>
      <div className="grid grid-cols-2 gap-3 p-5">
        {actions.map((action, i) => {
          const Icon = iconMap[action.icon] || PlusCircle;
          return (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleNav(action.path || '#')}
              className="group flex flex-col items-center gap-2 rounded-lg border border-border/60 p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-sm hover:-translate-y-0.5 hover:cursor-pointer"
            >
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-200',
                  colorMap[action.color] || 'bg-primary/10 text-primary',
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {action.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
