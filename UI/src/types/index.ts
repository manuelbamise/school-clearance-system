export type Role = 'student' | 'academic-unit' | 'bursary-unit' | 'department-unit' | 'superadmin'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatar?: string
  phone?: string
  studentId?: string
  staffId?: string
  department?: string
  school?: string
  address?: string
}

export interface SidebarItem {
  label: string
  icon: string
  path: string
  badge?: number
}

export interface MetricCard {
  label: string
  value: string | number
  icon: string
  trend?: { value: number; positive: boolean }
  gradient?: string
}

export interface Activity {
  id: string
  user: { name: string; avatar?: string; role: string }
  action: string
  target: string
  timestamp: string
  type?: 'info' | 'success' | 'warning' | 'error'
}

export interface ScheduleEvent {
  id: string
  title: string
  time: string
  duration: string
  location?: string
  type: 'class' | 'meeting' | 'appointment' | 'task'
}

export interface QuickAction {
  label: string
  icon: string
  color: string
  onClick?: () => void
}

export interface Notification {
  id: string
  title: string
  message: string
  timestamp: string
  read: boolean
  type: 'info' | 'success' | 'warning' | 'error'
}
