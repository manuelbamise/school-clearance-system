export type ApiRole = 'student' | 'superAdmin' | 'academic' | 'bursary' | 'department'
export type ApiUnit = 'academic' | 'bursary' | 'department'
export type ApiDocumentStatus = 'pending' | 'approved' | 'rejected'
export type ApiClearanceStatus = 'pending' | 'cleared'

export interface ApiDepartment {
  id: string
  name: string
}

export interface ApiUser {
  id: string
  email: string
  name: string
  studentId: string | null
  staffId: string | null
  role: ApiRole
  departmentId: string | null
  department: ApiDepartment | null
  createdAt: string
  updatedAt: string
}

export interface ApiDocument {
  id: string
  name: string
  level: string
  session: string
  unit: ApiUnit
  status: ApiDocumentStatus
  rejectionReason: string | null
  fileUrl: string
  fileSize: number
  mimeType: string
  student: { id: string; name: string; studentId: string | null; department: string }
  recipient: { id: string; name: string; role: string; department: string }
  reviewedBy: { id: string; name: string } | null
  reviewedAt: string | null
  date: string
  createdAt: string
  updatedAt: string
}

export interface ApiClearanceStep {
  unit: ApiUnit
  status: ApiClearanceStatus
  clearedBy: { id: string; name: string } | null
  clearedAt: string | null
}

export interface ApiClearance {
  id: string
  studentId: string
  createdAt: string
  units: Array<{
    id: string
    unit: ApiUnit
    status: ApiClearanceStatus
    clearedBy: { id: string; name: string } | null
    clearedAt: string | null
  }>
}

export interface ApiClearanceItem {
  id: string
  student: { id: string; name: string; studentId: string | null; department: string }
  unit: ApiUnit | null
  status: ApiClearanceStatus
  clearedBy: { id: string; name: string } | null
  clearedAt: string | null
  createdAt: string
}

export interface ApiMetric {
  label: string
  value: number
  icon: string
  gradient: string
  trend?: { value: number; positive: boolean }
}

export interface ApiActivity {
  id: string
  user: { name: string; role: ApiRole }
  action: string
  target: string
  timestamp: string
  type: string
}

export interface ApiAuditLog {
  id: string
  who: string
  whoEmail: string
  what: string
  when: string
  where: string
  why: string
  category: string
  status: string
}

export interface ApiReport {
  id: string
  userName: string
  userEmail: string
  userDepartment: string
  title: string
  content: string
  status: 'pending' | 'resolved'
  date: string
}

export interface ApiDepartmentRecord {
  id: string
  name: string
  userCount: number
}
