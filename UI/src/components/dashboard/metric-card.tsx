import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  ClipboardList,
  FileCheck,
  Award,
  Building2,
  Users,
  DollarSign,
  Clock,
  TrendingUp,
  AlertTriangle,
  UserCheck,
  Landmark,
  Activity,
  Bell,
  BarChart3,
  FileUp,
  FileX,
} from 'lucide-react';
import type { MetricCard as MetricCardType } from '@/types';

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  ClipboardList,
  FileCheck,
  Award,
  Building2,
  Users,
  DollarSign,
  Clock,
  TrendingUp,
  AlertTriangle,
  UserCheck,
  Landmark,
  Activity,
  Bell,
  BarChart3,
  FileUp,
  FileX,
};

export default function MetricCard({
  data,
  index,
}: {
  data: MetricCardType;
  index: number;
}) {
  const Icon = iconMap[data.icon] || BarChart3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
    >
      {/* Gradient accent bar */}
      <div
        className={cn(
          'absolute inset-x-0 top-0 h-1 bg-gradient-to-r',
          data.gradient || 'from-primary to-primary-light',
        )}
      />

      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {data.label}
          </p>
          <p className="text-2xl font-bold text-foreground">{data.value}</p>
          {data.trend && (
            <div className="flex items-center gap-1">
              <TrendingUp
                className={cn(
                  'h-3 w-3',
                  data.trend.positive ? 'text-success' : 'text-destructive',
                )}
              />
              <span
                className={cn(
                  'text-[11px] font-medium',
                  data.trend.positive ? 'text-success' : 'text-destructive',
                )}
              >
                {data.trend.positive ? '+' : ''}
                {data.trend.value}%
              </span>
              <span className="text-[11px] text-muted-foreground">
                vs last month
              </span>
            </div>
          )}
        </div>
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg',
            'bg-gradient-to-br from-primary/10 to-primary/5 text-primary',
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
