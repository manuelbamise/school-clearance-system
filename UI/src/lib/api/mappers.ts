import type {
  Role,
  User,
  DocumentRecord,
  ClearanceUnit,
  ClearanceStep,
  ClearanceRequest,
  SubmittedDocument,
  MetricCard,
  Activity,
  UserRecord,
  AuditLog,
  ReportRecord,
} from '@/types'
import type {
  ApiUser,
  ApiRole,
  ApiDocument,
  ApiClearanceStep,
  ApiClearanceItem,
  ApiActivity,
  ApiAuditLog,
  ApiReport,
  ApiMetric,
} from './types'

const API_ROLE_TO_UI: Record<ApiRole, Role> = {
  student: 'student',
  superAdmin: 'superadmin',
  academic: 'academic-unit',
  bursary: 'bursary-unit',
  department: 'department-unit',
}

const UI_ROLE_TO_API: Record<Role, ApiRole> = {
  student: 'student',
  superadmin: 'superAdmin',
  'academic-unit': 'academic',
  'bursary-unit': 'bursary',
  'department-unit': 'department',
}

export const toUiRole = (role: ApiRole | string): Role => API_ROLE_TO_UI[role as ApiRole] ?? 'student'
export const toApiRole = (role: Role): ApiRole => UI_ROLE_TO_API[role]

export const CLEARANCE_UNIT_META: Record<ClearanceUnit, { label: string; icon: string }> = {
  academic: { label: 'Academic Unit', icon: 'GraduationCap' },
  bursary: { label: 'Bursary Unit', icon: 'DollarSign' },
  department: { label: 'Department Unit', icon: 'Building2' },
}

export const mapUser = (user: ApiUser): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: toUiRole(user.role),
  studentId: user.studentId ?? undefined,
  staffId: user.staffId ?? undefined,
  department: user.department?.name,
})

export const mapUserRecord = (user: ApiUser): UserRecord => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: toUiRole(user.role),
  department: user.department?.name ?? '',
  lastActive: user.updatedAt,
  studentId: user.studentId ?? undefined,
  staffId: user.staffId ?? undefined,
})

export const mapDocument = (doc: ApiDocument): DocumentRecord => ({
  id: doc.id,
  name: doc.name,
  level: doc.level,
  session: doc.session,
  submittedTo: doc.unit,
  status: doc.status,
  date: doc.date,
  rejectionReason: doc.rejectionReason ?? undefined,
})

export const mapClearanceSteps = (steps: ApiClearanceStep[]): ClearanceStep[] =>
  steps.map((step) => ({
    unit: step.unit,
    label: CLEARANCE_UNIT_META[step.unit].label,
    cleared: step.status === 'cleared',
    clearedBy: step.clearedBy?.name,
    clearedAt: step.clearedAt ?? undefined,
    icon: CLEARANCE_UNIT_META[step.unit].icon,
  }))

export const mapClearanceItem = (item: ApiClearanceItem): ClearanceRequest => ({
  id: item.id,
  userId: item.student.id,
  studentName: item.student.name,
  studentId: item.student.studentId ?? item.student.id,
  department: item.student.department,
  cleared: item.status === 'cleared',
})

export const mapSubmittedDocument = (doc: ApiDocument): SubmittedDocument => ({
  id: doc.id,
  studentName: doc.student.name,
  studentId: doc.student.studentId ?? doc.student.id,
  documentName: doc.name,
  level: doc.level,
  session: doc.session,
  status: doc.status,
})

export const mapMetric = (metric: ApiMetric): MetricCard => metric

export const mapActivity = (activity: ApiActivity): Activity => ({
  id: activity.id,
  user: { name: activity.user.name, role: toUiRole(activity.user.role) },
  action: activity.action,
  target: activity.target,
  timestamp: activity.timestamp,
  type: (activity.type as Activity['type']) ?? 'info',
})

export const mapAuditLog = (log: ApiAuditLog): AuditLog => ({
  id: log.id,
  who: log.who,
  whoEmail: log.whoEmail,
  what: log.what,
  when: log.when,
  where: log.where,
  why: log.why,
  category: log.category as AuditLog['category'],
  status: log.status as AuditLog['status'],
})

export const mapReport = (report: ApiReport): ReportRecord => report
