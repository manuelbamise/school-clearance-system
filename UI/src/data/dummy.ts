import type { QuickAction, SidebarItem } from '@/types';

export const quickActions: Record<string, QuickAction[]> = {
  student: [
    {
      label: 'Check Clearance',
      icon: 'ShieldCheck',
      color: 'green',
      path: '/student/clearance',
    },
    {
      label: 'View Profile',
      icon: 'User',
      color: 'blue',
      path: '/student/profile',
    },
    {
      label: 'Issue Report',
      icon: 'MessageCircleWarning',
      color: 'red',
      path: '/student/report',
    },
    {
      label: 'Upload Document',
      icon: 'Upload',
      color: 'amber',
      path: '/student/document',
    },
  ],
  'academic-unit': [
    {
      label: 'Approve Documents',
      icon: 'FileCheck',
      color: 'green',
      path: '/academic-unit/document',
    },
    {
      label: 'Clear Student',
      icon: 'ShieldCheck',
      color: 'blue',
      path: '/academic-unit/clearance',
    },
    {
      label: 'Make Report',
      icon: 'MessageCircleWarning',
      color: 'red',
      path: '/academic-unit/report',
    },
  ],

  'bursary-unit': [
    {
      label: 'Approve Documents',
      icon: 'FileCheck',
      color: 'green',
      path: '/bursary-unit/document',
    },
    {
      label: 'Clear Student',
      icon: 'ShieldCheck',
      color: 'blue',
      path: '/bursary-unit/clearance',
    },
    {
      label: 'Make Report',
      icon: 'MessageCircleWarning',
      color: 'red',
      path: '/bursary-unit/report',
    },
  ],

  'department-unit': [
    {
      label: 'Approve Documents',
      icon: 'FileCheck',
      color: 'green',
      path: '/department-unit/document',
    },
    {
      label: 'Clear Student',
      icon: 'ShieldCheck',
      color: 'blue',
      path: '/department-unit/clearance',
    },
    {
      label: 'Make Report',
      icon: 'MessageCircleWarning',
      color: 'red',
      path: '/department-unit/report',
    },
  ],
  superadmin: [
    {
      label: 'User Management',
      icon: 'UserCog',
      color: 'green',
      path: '/superadmin/users',
    },
    {
      label: 'System Logs',
      icon: 'ScrollText',
      color: 'blue',
      path: '/superadmin/audit',
    },
    {
      label: 'Platform Reports',
      icon: 'MessageCircleWarning',
      color: 'amber',
      path: '/superadmin/reports',
    },
  ],
};

export const sidebarItems: Record<string, SidebarItem[]> = {
  student: [
    { label: 'Dashboard', icon: 'LayoutDashboard', path: '/student/dashboard' },
    { label: 'Documents', icon: 'FileUp', path: '/student/document' },
    {
      label: 'Clearance',
      icon: 'ShieldCheck',
      path: '/student/clearance',
    },
    { label: 'Reports', icon: 'MessageCircleWarning', path: '/student/report' },
    { label: 'Profile', icon: 'User', path: '/student/profile' },
  ],
  'academic-unit': [
    {
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      path: '/academic-unit/dashboard',
    },
    {
      label: 'Documents',
      icon: 'FileCheck',
      path: '/academic-unit/document',
    },
    {
      label: 'Clearance',
      icon: 'ShieldCheck',
      path: '/academic-unit/clearance',
    },
    {
      label: 'Report',
      icon: 'MessageCircleWarning',
      path: '/academic-unit/report',
    },
    { label: 'Profile', icon: 'User', path: '/academic-unit/profile' },
  ],
  'bursary-unit': [
    {
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      path: '/bursary-unit/dashboard',
    },
    {
      label: 'Documents',
      icon: 'FileCheck',
      path: '/bursary-unit/document',
    },
    {
      label: 'Clearance',
      icon: 'ShieldCheck',
      path: '/bursary-unit/clearance',
    },
    {
      label: 'Report',
      icon: 'MessageCircleWarning',
      path: '/bursary-unit/report',
    },
    { label: 'Profile', icon: 'User', path: '/bursary-unit/profile' },
  ],

  'department-unit': [
    {
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      path: '/department-unit/dashboard',
    },
    {
      label: 'Documents',
      icon: 'FileCheck',
      path: '/department-unit/document',
    },
    {
      label: 'Clearance',
      icon: 'ShieldCheck',
      path: '/department-unit/clearance',
    },
    {
      label: 'Report',
      icon: 'MessageCircleWarning',
      path: '/department-unit/report',
    },
    { label: 'Profile', icon: 'User', path: '/department-unit/profile' },
  ],

  superadmin: [
    {
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      path: '/superadmin/dashboard',
    },
    {
      label: 'User Management',
      icon: 'Users',
      path: '/superadmin/users',
    },
    { label: 'Audit Logs', icon: 'ScrollText', path: '/superadmin/audit' },
    {
      label: 'Reports',
      icon: 'MessageCircleWarning',
      path: '/superadmin/reports',
    },
    { label: 'Profile', icon: 'User', path: '/superadmin/profile' },
  ],
};
