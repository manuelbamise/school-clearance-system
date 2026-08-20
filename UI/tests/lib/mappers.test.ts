import { describe, it, expect } from 'vitest'
import {
  toUiRole,
  toApiRole,
  mapUser,
  mapUserRecord,
  mapDocument,
  mapClearanceSteps,
  mapActivity,
  mapAuditLog,
  CLEARANCE_UNIT_META,
} from '@/lib/api/mappers'
import type { ApiUser, ApiDocument, ApiClearanceStep, ApiActivity, ApiAuditLog } from '@/lib/api/types'

describe('toUiRole', () => {
  it('maps student', () => expect(toUiRole('student')).toBe('student'))
  it('maps superAdmin', () => expect(toUiRole('superAdmin')).toBe('superadmin'))
  it('maps academic', () => expect(toUiRole('academic')).toBe('academic-unit'))
  it('maps bursary', () => expect(toUiRole('bursary')).toBe('bursary-unit'))
  it('maps department', () => expect(toUiRole('department')).toBe('department-unit'))
  it('defaults to student for unknown', () => expect(toUiRole('unknown')).toBe('student'))
})

describe('toApiRole', () => {
  it('maps student', () => expect(toApiRole('student')).toBe('student'))
  it('maps superadmin', () => expect(toApiRole('superadmin')).toBe('superAdmin'))
  it('maps academic-unit', () => expect(toApiRole('academic-unit')).toBe('academic'))
  it('maps bursary-unit', () => expect(toApiRole('bursary-unit')).toBe('bursary'))
  it('maps department-unit', () => expect(toApiRole('department-unit')).toBe('department'))
})

describe('mapUser', () => {
  const apiUser: ApiUser = {
    id: 'u1',
    email: 'test@example.com',
    name: 'Test User',
    studentId: 'STU001',
    staffId: null,
    role: 'student',
    isVerified: true,
    departmentId: 'dept-1',
    department: { id: 'dept-1', name: 'Computer Science', createdAt: '', updatedAt: '' },
    createdAt: '',
    updatedAt: '',
  }

  it('transforms ApiUser to User', () => {
    const result = mapUser(apiUser)
    expect(result).toEqual({
      id: 'u1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'student',
      isVerified: true,
      studentId: 'STU001',
      staffId: undefined,
      department: 'Computer Science',
    })
  })

  it('maps null studentId to undefined', () => {
    const user = { ...apiUser, studentId: null }
    expect(mapUser(user).studentId).toBeUndefined()
  })

  it('maps null staffId to undefined', () => {
    expect(mapUser(apiUser).staffId).toBeUndefined()
  })
})

describe('mapDocument', () => {
  it('transforms ApiDocument to DocumentRecord', () => {
    const apiDoc: ApiDocument = {
      id: 'd1',
      name: 'Transcript',
      level: '100',
      session: '2025/2026',
      unit: 'academic',
      status: 'pending',
      date: '2026-01-01',
      rejectionReason: null,
      student: {} as any,
      recipient: {} as any,
      reviewedBy: null,
      createdAt: '',
      updatedAt: '',
    }

    const result = mapDocument(apiDoc)
    expect(result).toEqual({
      id: 'd1',
      name: 'Transcript',
      level: '100',
      session: '2025/2026',
      submittedTo: 'academic',
      status: 'pending',
      date: '2026-01-01',
      rejectionReason: undefined,
    })
  })
})

describe('mapClearanceSteps', () => {
  it('maps steps with labels and icons', () => {
    const steps: ApiClearanceStep[] = [
      { unit: 'academic', status: 'cleared', clearedBy: { id: 's1', name: 'Staff' }, clearedAt: '2026-01-01' },
      { unit: 'bursary', status: 'pending', clearedBy: null, clearedAt: null },
      { unit: 'department', status: 'pending', clearedBy: null, clearedAt: null },
    ]

    const result = mapClearanceSteps(steps)

    expect(result[0]).toEqual({
      unit: 'academic',
      label: 'Academic Unit',
      cleared: true,
      clearedBy: 'Staff',
      clearedAt: '2026-01-01',
      icon: 'GraduationCap',
    })
    expect(result[1].cleared).toBe(false)
  })
})

describe('mapActivity', () => {
  it('maps type field to union', () => {
    const activity: ApiActivity = {
      id: 'a1',
      user: { name: 'Test', role: 'student' },
      action: 'uploaded',
      target: 'doc.pdf',
      timestamp: '2026-01-01',
      type: 'success',
    }

    const result = mapActivity(activity)
    expect(result.type).toBe('success')
  })
})

describe('mapAuditLog', () => {
  it('maps all fields', () => {
    const log: ApiAuditLog = {
      id: 'l1',
      who: 'Admin',
      whoEmail: 'admin@test.com',
      what: 'Created user',
      when: '2026-01-01',
      where: 'Users',
      why: 'New staff',
      category: 'user-management',
      status: 'success',
    }

    const result = mapAuditLog(log)
    expect(result).toEqual(log)
  })
})

describe('CLEARANCE_UNIT_META', () => {
  it('has labels and icons for all 3 units', () => {
    expect(Object.keys(CLEARANCE_UNIT_META)).toEqual(['academic', 'bursary', 'department'])
    for (const meta of Object.values(CLEARANCE_UNIT_META)) {
      expect(meta.label).toBeTruthy()
      expect(meta.icon).toBeTruthy()
    }
  })
})
