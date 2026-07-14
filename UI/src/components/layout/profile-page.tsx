import { useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Save, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/auth-context'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import type { Role } from '@/types'

const roleLabels: Record<string, string> = {
  student: 'Student',
  'academic-unit': 'Academic Unit',
  'bursary-unit': 'Bursary Unit',
  'department-unit': 'Department Unit',
  superadmin: 'Super Admin',
}

export default function ProfilePage({ role }: { role: Role }) {
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  if (!user) return null

  const initials = user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }, 1000)
  }

  const isStaff = role !== 'student'
  const roleLabel = roleLabels[role] || role

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your personal information and security settings.</p>
      </motion.div>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative group">
                <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary-light text-white text-2xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
                  <Badge variant="secondary">{roleLabel}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
                <div className="flex flex-wrap gap-3 mt-3 justify-center sm:justify-start">
                  {isStaff ? (
                    <>
                      <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                        Staff ID: {user.staffId || 'N/A'}
                      </span>
                      <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                        {user.department || 'N/A'}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                        Student ID: {user.studentId || 'N/A'}
                      </span>
                      <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                        {user.department || 'N/A'}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input defaultValue={user.name.split(' ')[0]} />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input defaultValue={user.name.split(' ').slice(1).join(' ')} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue={user.email} type="email" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input defaultValue={user.phone || '+1 234 567 890'} />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input defaultValue={user.address || '123 Campus Drive'} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security & ID */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-6"
        >
          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Update your password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" placeholder="Enter current password" />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" placeholder="Enter new password" />
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input type="password" placeholder="Confirm new password" />
              </div>
              <Button variant="outline" size="sm">Change Password</Button>
            </CardContent>
          </Card>

          {/* ID Information */}
          <Card>
            <CardHeader>
              <CardTitle>Identification</CardTitle>
              <CardDescription>Your account identifiers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">User ID</span>
                <span className="text-sm font-medium">{user.id}</span>
              </div>
              {isStaff ? (
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Staff ID</span>
                  <span className="text-sm font-medium">{user.staffId || 'N/A'}</span>
                </div>
              ) : (
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Student ID</span>
                  <span className="text-sm font-medium">{user.studentId || 'N/A'}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Department</span>
                <span className="text-sm font-medium">{user.department || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Role</span>
                <Badge variant="secondary">{roleLabel}</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Manage how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Email Notifications', desc: 'Receive notifications via email' },
              { label: 'Push Notifications', desc: 'Receive push notifications in browser' },
              { label: 'SMS Alerts', desc: 'Get important alerts via SMS' },
              { label: 'Weekly Digest', desc: 'Receive a weekly summary of activities' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <Switch defaultChecked={item.label === 'Email Notifications'} />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Save */}
      <div className="flex justify-end">
        <Button onClick={handleSave} variant="gradient" className="gap-2" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <span className="h-4 w-4 rounded-full bg-white/30 flex items-center justify-center">
                <span className="text-[10px]">✓</span>
              </span>
              Saved
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
