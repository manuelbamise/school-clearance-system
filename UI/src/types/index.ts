export type Role =
  | 'student'
  | 'academic-unit'
  | 'bursary-unit'
  | 'department-unit'
  | 'superadmin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  phone?: string;
  studentId?: string;
  staffId?: string;
  department?: string;
  school?: string;
  address?: string;
}

export interface SidebarItem {
  label: string;
  icon: string;
  path: string;
  badge?: number;
}

export interface MetricCard {
  label: string;
  value: string | number;
  icon: string;
  trend?: { value: number; positive: boolean };
  gradient?: string;
}

export interface Activity {
  id: string;
  user: { name: string; avatar?: string; role: string };
  action: string;
  target: string;
  timestamp: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export interface ScheduleEvent {
  id: string;
  title: string;
  time: string;
  duration: string;
  location?: string;
  type: 'class' | 'meeting' | 'appointment' | 'task';
}

export interface QuickAction {
  label: string;
  icon: string;
  color: string;
  path: string;
  onClick?: () => void;
}

export interface DocumentRecord {
  id: string;
  name: string;
  level: string;
  session: string;
  submittedTo: 'department' | 'academic' | 'bursary';
  status: 'approved' | 'pending' | 'rejected';
  date: string;
  rejectionReason?: string;
}

export type ClearanceUnit = 'academic' | 'bursary' | 'department'

export interface ClearanceStep {
  unit: ClearanceUnit
  label: string
  cleared: boolean
  clearedBy?: string
  clearedAt?: string
  icon: string
}

export interface ClearanceHistoryItem {
  unit: string
  status: 'cleared' | 'pending'
  clearedBy: string
  date: string
}

export interface Department {
  id: string;
  name: string;
  userCount: number;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  lastActive: string;
  studentId?: string;
  staffId?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}
