import prisma from '../lib/prisma.js';

const periodOf = (date: Date) => {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
};

const startOfPeriod = (period: string) => {
  const [y, m] = period.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, 1));
};

const nextPeriod = (period: string) => {
  const [y, m] = period.split('-').map(Number);
  const next = new Date(Date.UTC(y, m, 1));
  return periodOf(next);
};

const previousPeriod = (period: string) => {
  const [y, m] = period.split('-').map(Number);
  const prev = new Date(Date.UTC(y, m - 2, 1));
  return periodOf(prev);
};

const roundTrend = (current: number, previous: number) => {
  if (previous <= 0) return undefined;
  const value = Math.round(((current - previous) / previous) * 100);
  return { value: Math.abs(value), positive: current >= previous };
};

interface MetricDefinition {
  key: string;
  label: string;
  icon: string;
  gradient: string;
  value: number;
}

const studentMetrics = async (
  userId: string,
  period: string,
): Promise<MetricDefinition[]> => {
  const start = startOfPeriod(period);
  const end = new Date(start.getTime());
  end.setUTCMonth(end.getUTCMonth() + 1);

  const [uploaded, approved, rejected] = await Promise.all([
    prisma.document.count({
      where: { studentId: userId, createdAt: { gte: start, lt: end } },
    }),
    prisma.document.count({
      where: {
        studentId: userId,
        status: 'approved',
        reviewedAt: { gte: start, lt: end },
      },
    }),
    prisma.document.count({
      where: {
        studentId: userId,
        status: 'rejected',
        reviewedAt: { gte: start, lt: end },
      },
    }),
  ]);

  return [
    {
      key: 'documents_uploaded',
      label: 'Documents Uploaded',
      icon: 'FileUp',
      gradient: 'from-purple-500 to-pink-500',
      value: uploaded,
    },
    {
      key: 'documents_approved',
      label: 'Documents Approved',
      icon: 'FileCheck',
      gradient: 'from-blue-500 to-cyan-500',
      value: approved,
    },
    {
      key: 'documents_rejected',
      label: 'Documents Rejected',
      icon: 'FileX',
      gradient: 'from-red-500 to-orange-500',
      value: rejected,
    },
  ];
};

const unitMetrics = async (
  userId: string,
  role: string,
  departmentId: string | null,
): Promise<MetricDefinition[]> => {
  const [pendingDocuments, pendingClearance] = await Promise.all([
    prisma.document.count({
      where: { recipientId: userId, status: 'pending' },
    }),
    prisma.clearanceUnit.count({
      where: {
        unit: role,
        status: 'pending',
        ...(role === 'department' && departmentId
          ? { clearance: { student: { departmentId } } }
          : {}),
      },
    }),
  ]);

  return [
    {
      key: 'documents_pending',
      label: 'Documents Pending',
      icon: 'FileExclamationPoint',
      gradient: 'from-red-500 to-emerald-500',
      value: pendingDocuments,
    },
    {
      key: 'clearance_pending',
      label: 'Students Clearance Pending',
      icon: 'ShieldCheck',
      gradient: 'from-blue-500 to-cyan-500',
      value: pendingClearance,
    },
  ];
};

const superAdminMetrics = async (): Promise<MetricDefinition[]> => {
  const [totalUsers, pendingReports] = await Promise.all([
    prisma.user.count(),
    prisma.report.count({ where: { status: 'pending' } }),
  ]);

  return [
    {
      key: 'total_users',
      label: 'Total Users',
      icon: 'Users',
      gradient: 'from-blue-500 to-cyan-500',
      value: totalUsers,
    },
    {
      key: 'pending_reports',
      label: 'Pending Reports',
      icon: 'MessageCircleWarning',
      gradient: 'from-amber-500 to-orange-500',
      value: pendingReports,
    },
  ];
};

const computeMetrics = async (
  user: { id: string; role: string; departmentId: string | null },
): Promise<MetricDefinition[]> => {
  if (user.role === 'student') {
    return studentMetrics(user.id, periodOf(new Date()));
  }
  if (user.role === 'superAdmin') {
    return superAdminMetrics();
  }
  return unitMetrics(user.id, user.role, user.departmentId);
};

export const getMetricsForUser = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const period = periodOf(new Date());
  const current = await computeMetrics(user);

  const previous = await prisma.metric.findMany({
    where: { userId, period: previousPeriod(period) },
    select: { key: true, value: true },
  });
  const previousMap = new Map(previous.map((p) => [p.key, p.value]));

  const results = current.map((metric) => {
    const trend = roundTrend(metric.value, previousMap.get(metric.key) ?? 0);
    return {
      label: metric.label,
      value: metric.value,
      icon: metric.icon,
      gradient: metric.gradient,
      ...(trend ? { trend } : {}),
    };
  });

  await Promise.all(
    current.map((metric) =>
      prisma.metric.upsert({
        where: { userId_period_key: { userId, period, key: metric.key } },
        update: { value: metric.value },
        create: {
          userId,
          period,
          key: metric.key,
          label: metric.label,
          value: metric.value,
          icon: metric.icon,
          gradient: metric.gradient,
        },
      }),
    ),
  );

  return results;
};

export const periodHelpers = { periodOf, startOfPeriod, nextPeriod };
