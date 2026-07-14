import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, GraduationCap, DollarSign, Building2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { clearanceSteps as initialSteps, clearanceHistory as initialHistory } from '@/data/dummy';
import type { ClearanceStep } from '@/types';

export const Route = createFileRoute('/_authenticated/student/clearance')({
  component: StudentClearancePage,
});

const iconMap: Record<string, React.ElementType> = {
  GraduationCap,
  DollarSign,
  Building2,
};

function StudentClearancePage() {
  const [steps, setSteps] = useState<ClearanceStep[]>(initialSteps);
  const [stage, setStage] = useState(0);

  const clearedCount = steps.filter((s) => s.cleared).length;
  const total = steps.length;
  const isComplete = clearedCount === total;

  useEffect(() => {
    const interval = setInterval(() => {
      setStage((prev) => {
        const next = prev + 1;
        if (next === 1) {
          setSteps((s) =>
            s.map((step) =>
              step.unit === 'bursary'
                ? { ...step, cleared: true, clearedBy: 'Mr. James Okafor', clearedAt: '2025-04-02' }
                : step,
            ),
          );
        }
        if (next >= 2) {
          setSteps((s) =>
            s.map((step) =>
              step.unit === 'department'
                ? { ...step, cleared: true, clearedBy: 'Prof. Emily Chen', clearedAt: '2025-04-05' }
                : step,
            ),
          );
        }
        return next;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const bannerContent = () => {
    if (isComplete) {
      return {
        bg: 'bg-success/10 border-success/20',
        icon: Check,
        iconColor: 'text-success',
        title: 'Clearance Complete!',
        desc: 'All units have cleared you. You are fully cleared.',
      };
    }
    const clearedNames = steps
      .filter((s) => s.cleared)
      .map((s) => s.label)
      .join(', ');
    const pendingNames = steps
      .filter((s) => !s.cleared)
      .map((s) => s.label)
      .join(', ');
    return {
      bg: 'bg-blue-500/10 border-blue-500/20',
      icon: Clock,
      iconColor: 'text-blue-500',
      title: 'Clearance in Progress',
      desc: clearedNames
        ? `${clearedNames} ${clearedCount > 1 ? 'have' : 'has'} cleared you. Awaiting ${pendingNames}.`
        : 'No unit has begun clearing you yet.',
    };
  };

  const banner = bannerContent();
  const BannerIcon = banner.icon;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-foreground">Clearance Status</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your clearance progress across all units.
        </p>
      </motion.div>

      {/* Progress Stepper */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card>
          <CardContent className="py-10">
            <div className="flex items-center justify-center gap-0">
              {steps.map((step, i) => {
                const Icon = iconMap[step.icon] || Building2;
                const isStepActive = step.cleared;
                const isCompleteStep = isComplete && isStepActive;
                return (
                  <div key={step.unit} className="flex items-center">
                    {/* Step circle + label */}
                    <div className="flex flex-col items-center gap-2.5">
                      <motion.div
                        animate={{
                          scale: isStepActive ? 1 : 0.9,
                          opacity: isStepActive ? 1 : 0.4,
                        }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className={cn(
                          'flex h-16 w-16 items-center justify-center rounded-full border-2 transition-colors duration-500',
                          isCompleteStep
                            ? 'border-success bg-success/10 text-success'
                            : isStepActive
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-muted-foreground/25 bg-muted/20 text-muted-foreground/40',
                        )}
                      >
                        {isStepActive ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                          >
                            <Check className="h-7 w-7" />
                          </motion.div>
                        ) : (
                          <Icon className="h-7 w-7" />
                        )}
                      </motion.div>
                      <div className="flex flex-col items-center gap-0.5">
                        <span
                          className={cn(
                            'text-sm font-medium transition-colors duration-300',
                            isCompleteStep
                              ? 'text-success'
                              : isStepActive
                                ? 'text-foreground'
                                : 'text-muted-foreground/40',
                          )}
                        >
                          {step.label}
                        </span>
                        <span
                          className={cn(
                            'text-xs transition-colors duration-300',
                            isCompleteStep
                              ? 'text-success'
                              : isStepActive
                                ? 'text-primary'
                                : 'text-muted-foreground/30',
                          )}
                        >
                          {isStepActive ? 'Cleared' : 'Pending'}
                        </span>
                      </div>
                    </div>

                    {/* Connector (not after last) */}
                    {i < steps.length - 1 && (
                      <div className="relative mx-5 sm:mx-10 h-1 w-16 sm:w-28 rounded-full overflow-hidden bg-muted-foreground/20">
                        <motion.div
                          initial={false}
                          animate={{
                            width: isStepActive
                              ? isComplete
                                ? '100%'
                                : '100%'
                              : '0%',
                            backgroundColor: isComplete
                              ? 'var(--color-success, #10b981)'
                              : 'var(--color-primary, #7c3aed)',
                          }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                          className="absolute inset-y-0 left-0 rounded-full"
                        />
                      </div>
                    )}

                    {/* Final check circle */}
                    {i === steps.length - 1 && isComplete && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                        className="ml-3 flex h-9 w-9 items-center justify-center rounded-full bg-success"
                      >
                        <Check className="h-5 w-5 text-white" />
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Banner */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`banner-${clearedCount}`}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3 }}
          className={cn('rounded-xl border p-5 flex items-start gap-4', banner.bg)}
        >
          <div className={cn('mt-0.5', banner.iconColor)}>
            <BannerIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{banner.title}</p>
            <p className="text-sm text-muted-foreground mt-1">{banner.desc}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Clearance Details */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Clearance Details</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Unit</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cleared By</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {steps.map((step, i) => (
                    <motion.tr
                      key={step.unit}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="transition-colors hover:bg-muted/20"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            'flex h-7 w-7 items-center justify-center rounded-full',
                            step.cleared ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground/50',
                          )}>
                            {step.cleared ? (
                              <Check className="h-3.5 w-3.5" />
                            ) : (
                              <Clock className="h-3.5 w-3.5" />
                            )}
                          </div>
                          <span className="font-medium text-foreground">{step.label}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant={step.cleared ? 'success' : 'warning'}>
                          {step.cleared ? 'Cleared' : 'Pending'}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">
                        {step.clearedBy || '—'}
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">
                        {step.clearedAt || '—'}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
