import type { User, Report, Document, Clearance, ClearanceUnit } from '@prisma/client'

export const buildUser = (overrides?: Partial<User>): User => ({
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  password: 'hashed-password',
  role: 'student',
  isVerified: true,
  studentId: 'STU001',
  staffId: null,
  departmentId: 'dept-1',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  ...overrides,
})

export const buildStaffUser = (overrides?: Partial<User>): User =>
  buildUser({
    id: 'staff-1',
    email: 'staff@example.com',
    name: 'Staff User',
    role: 'academic',
    studentId: null,
    staffId: 'STF001',
    ...overrides,
  })

export const buildReport = (overrides?: Partial<Report>): Report => ({
  id: 'report-1',
  userId: 'user-1',
  title: 'Test Report',
  content: 'Test content',
  status: 'pending',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  ...overrides,
})

export const buildDocument = (overrides?: Partial<Document>): Document => ({
  id: 'doc-1',
  name: 'Test Document',
  level: '100',
  session: '2025/2026',
  unit: 'academic',
  status: 'pending',
  rejectionReason: null,
  filePath: '/uploads/test.pdf',
  fileSize: 1024,
  mimeType: 'application/pdf',
  studentId: 'user-1',
  recipientId: 'staff-1',
  reviewedById: null,
  reviewedAt: null,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  ...overrides,
})

export const buildClearance = (overrides?: Partial<Clearance>): Clearance => ({
  id: 'clearance-1',
  studentId: 'user-1',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  ...overrides,
})

export const buildClearanceUnit = (overrides?: Partial<ClearanceUnit>): ClearanceUnit => ({
  id: 'cu-1',
  clearanceId: 'clearance-1',
  unit: 'academic',
  status: 'pending',
  clearedById: null,
  clearedAt: null,
  ...overrides,
})
