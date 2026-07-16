import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, ChevronLeft, ChevronRight, Building2, UserPlus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { departments as initialDepartments, userRecords as initialUsers } from '@/data/dummy';
import type { Department, UserRecord } from '@/types';

export const Route = createFileRoute('/_authenticated/superadmin/users')({
  component: SuperadminUsersPage,
});

const roleOptions = [
  { value: 'all', label: 'All' },
  { value: 'superadmin', label: 'Admin' },
  { value: 'academic-unit', label: 'Academic' },
  { value: 'bursary-unit', label: 'Bursary' },
  { value: 'department-unit', label: 'Department' },
  { value: 'student', label: 'Student' },
] as const;

const roleLabel = (role: string) => {
  const map: Record<string, string> = {
    superadmin: 'Super Admin',
    'academic-unit': 'Academic',
    'bursary-unit': 'Bursary',
    'department-unit': 'Department',
    student: 'Student',
  };
  return map[role] || role;
};

function SuperadminUsersPage() {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [users, setUsers] = useState<UserRecord[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Department modal
  const [departmentModalOpen, setDepartmentModalOpen] = useState(false);
  const [deptName, setDeptName] = useState('');
  const [deptPage, setDeptPage] = useState(1);
  const DEPTS_PER_PAGE = 4;

  // User modal
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'student',
    department: '',
    studentId: '',
    staffId: '',
  });

  // User edit/delete
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [editedUser, setEditedUser] = useState<UserRecord | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleCreateDepartment = () => {
    if (!deptName.trim()) return;
    setDepartments((prev) => [
      ...prev,
      { id: `dept-${Date.now()}`, name: deptName.trim(), userCount: 0 },
    ]);
    setDeptName('');
    setDepartmentModalOpen(false);
  };

  const handleCreateUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.department) return;
    const record: UserRecord = {
      id: `u-${Date.now()}`,
      name: newUser.name.trim(),
      email: newUser.email.trim(),
      role: newUser.role,
      department: newUser.department,
      lastActive: new Date().toISOString().split('T')[0],
    };
    if (newUser.role === 'student') {
      record.studentId = newUser.studentId || '-';
    } else {
      record.staffId = newUser.staffId || '-';
    }
    setUsers((prev) => [record, ...prev]);
    setNewUser({ name: '', email: '', role: 'student', department: '', studentId: '', staffId: '' });
    setUserModalOpen(false);
  };

  const paginatedDepartments = departments.slice(
    (deptPage - 1) * DEPTS_PER_PAGE,
    deptPage * DEPTS_PER_PAGE,
  );
  const deptTotalPages = Math.max(1, Math.ceil(departments.length / DEPTS_PER_PAGE));

  const handleDeleteDepartment = (id: string) => {
    setDepartments((prev) => prev.filter((d) => d.id !== id));
    const maxPage = Math.max(1, Math.ceil((departments.length - 1) / DEPTS_PER_PAGE));
    if (deptPage > maxPage) setDeptPage(maxPage);
  };

  const openEditUser = (user: UserRecord) => {
    setSelectedUser(user);
    setEditedUser({ ...user });
    setEditUserOpen(true);
  };

  const closeEdit = () => {
    setEditUserOpen(false);
    setSelectedUser(null);
    setEditedUser(null);
  };

  const hasChanges = useMemo(() => {
    if (!selectedUser || !editedUser) return false;
    return (
      editedUser.name !== selectedUser.name ||
      editedUser.email !== selectedUser.email ||
      editedUser.role !== selectedUser.role ||
      editedUser.department !== selectedUser.department ||
      editedUser.studentId !== selectedUser.studentId ||
      editedUser.staffId !== selectedUser.staffId
    );
  }, [selectedUser, editedUser]);

  const handleUpdateUser = () => {
    if (!editedUser) return;
    setUsers((prev) => prev.map((u) => (u.id === editedUser.id ? editedUser : u)));
    closeEdit();
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
    setDeleteConfirmOpen(false);
    closeEdit();
  };

  const filteredUsers = useMemo(
    () =>
      users
        .filter((u) => roleFilter === 'all' || u.role === roleFilter)
        .filter((u) =>
          [u.name, u.email, u.role, u.department].some((f) =>
            f.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        ),
    [users, searchQuery, roleFilter],
  );

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedUsers = filteredUsers.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage departments and users across the system.
          </p>
        </div>
      </motion.div>

      {/* Departments */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Departments</CardTitle>
            <Button
              variant="gradient"
              size="sm"
              className="gap-2"
              onClick={() => setDepartmentModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Create Department
            </Button>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="divide-y divide-border rounded-lg border border-border">
              {paginatedDepartments.map((dept) => (
                <div
                  key={dept.id}
                  className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-muted/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {dept.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDepartment(dept.id);
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <Badge variant="secondary">{dept.userCount} Users</Badge>
                  </div>
                </div>
              ))}
            </div>
            {departments.length > DEPTS_PER_PAGE && (
              <div className="flex items-center justify-between pt-3">
                <p className="text-xs text-muted-foreground">
                  Showing {(deptPage - 1) * DEPTS_PER_PAGE + 1}–
                  {Math.min(deptPage * DEPTS_PER_PAGE, departments.length)} of{' '}
                  {departments.length}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDeptPage((p) => Math.max(1, p - 1))}
                    disabled={deptPage <= 1}
                    className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                  >
                    <ChevronLeft className="h-3 w-3" />
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setDeptPage((p) => Math.min(deptTotalPages, p + 1))
                    }
                    disabled={deptPage >= deptTotalPages}
                    className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                  >
                    Next
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>All Users</CardTitle>
            <Button
              variant="gradient"
              size="sm"
              className="gap-2"
              onClick={() => setUserModalOpen(true)}
            >
              <UserPlus className="h-4 w-4" />
              Create User
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 p-5">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search users by name, email, role, or department..."
                className="pl-9"
              />
            </div>

            {/* Role Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              {roleOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setRoleFilter(opt.value);
                    setCurrentPage(1);
                  }}
                  className={cn(
                    'rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors',
                    roleFilter === opt.value
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'border border-border bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Name
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Role
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Department
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Last Active
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-5 py-12 text-center text-sm text-muted-foreground"
                      >
                        {searchQuery
                          ? 'No users match your search.'
                          : 'No users found.'}
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((user, i) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.02 }}
                        onClick={() => openEditUser(user)}
                        className="cursor-pointer transition-colors hover:bg-muted/20"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">
                              {user.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {user.email}
                              {user.studentId && (
                                <span> &bull; {user.studentId}</span>
                              )}
                              {user.staffId && (
                                <span> &bull; {user.staffId}</span>
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge
                            variant={
                              user.role === 'superadmin'
                                ? 'default'
                                : user.role === 'student'
                                  ? 'secondary'
                                  : 'outline'
                            }
                          >
                            {roleLabel(user.role)}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground">
                          {user.department}
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground">
                          {user.lastActive}
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredUsers.length > 0 && (
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-muted-foreground">
                  Showing{' '}
                  {Math.min(
                    (safePage - 1) * ITEMS_PER_PAGE + 1,
                    filteredUsers.length,
                  )}
                  –
                  {Math.min(safePage * ITEMS_PER_PAGE, filteredUsers.length)}{' '}
                  of {filteredUsers.length}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={safePage <= 1}
                    className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Previous
                  </button>
                  <span className="text-xs text-muted-foreground px-2">
                    Page {safePage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={safePage >= totalPages}
                    className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                  >
                    Next
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Create Department Modal */}
      <Dialog open={departmentModalOpen} onOpenChange={setDepartmentModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Department</DialogTitle>
            <DialogDescription>
              Add a new department to the system.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Department Name</Label>
              <Input
                value={deptName}
                onChange={(e) => setDeptName(e.target.value)}
                placeholder="e.g. Computer Science"
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                variant="gradient"
                onClick={handleCreateDepartment}
                disabled={!deptName.trim()}
              >
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create User Modal */}
      <Dialog open={userModalOpen} onOpenChange={setUserModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
            <DialogDescription>
              Add a new user to the system. Default password: password123
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={newUser.name}
                onChange={(e) =>
                  setNewUser((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="e.g. John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={newUser.email}
                onChange={(e) =>
                  setNewUser((p) => ({ ...p, email: e.target.value }))
                }
                placeholder="e.g. john@university.edu"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(val) =>
                    setNewUser((p) => ({
                      ...p,
                      role: val,
                      studentId: '',
                      staffId: '',
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="academic-unit">Academic</SelectItem>
                    <SelectItem value="bursary-unit">Bursary</SelectItem>
                    <SelectItem value="department-unit">
                      Department
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Select
                  value={newUser.department}
                  onValueChange={(val) =>
                    setNewUser((p) => ({ ...p, department: val }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d.id} value={d.name}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {newUser.role === 'student' ? (
              <div className="space-y-2">
                <Label>Student ID</Label>
                <Input
                  value={newUser.studentId}
                  onChange={(e) =>
                    setNewUser((p) => ({ ...p, studentId: e.target.value }))
                  }
                  placeholder="e.g. STU-001"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Staff ID</Label>
                <Input
                  value={newUser.staffId}
                  onChange={(e) =>
                    setNewUser((p) => ({ ...p, staffId: e.target.value }))
                  }
                  placeholder="e.g. STA-001"
                />
              </div>
            )}
            <div className="flex items-center justify-between pt-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                variant="gradient"
                onClick={handleCreateUser}
                disabled={
                  !newUser.name.trim() ||
                  !newUser.email.trim() ||
                  !newUser.department
                }
              >
                Create User
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog
        open={editUserOpen}
        onOpenChange={(open) => {
          if (!open) closeEdit();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User — {selectedUser?.name}</DialogTitle>
          </DialogHeader>
          {editedUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={editedUser.name}
                  onChange={(e) =>
                    setEditedUser((p) =>
                      p ? { ...p, name: e.target.value } : p,
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={editedUser.email}
                  onChange={(e) =>
                    setEditedUser((p) =>
                      p ? { ...p, email: e.target.value } : p,
                    )
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select
                    value={editedUser.role}
                    onValueChange={(val) =>
                      setEditedUser((p) =>
                        p
                          ? {
                              ...p,
                              role: val,
                              studentId: '',
                              staffId: '',
                            }
                          : p,
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="academic-unit">Academic</SelectItem>
                      <SelectItem value="bursary-unit">Bursary</SelectItem>
                      <SelectItem value="department-unit">
                        Department
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select
                    value={editedUser.department}
                    onValueChange={(val) =>
                      setEditedUser((p) =>
                        p ? { ...p, department: val } : p,
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((d) => (
                        <SelectItem key={d.id} value={d.name}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {editedUser.role === 'student' ? (
                <div className="space-y-2">
                  <Label>Student ID</Label>
                  <Input
                    value={editedUser.studentId || ''}
                    onChange={(e) =>
                      setEditedUser((p) =>
                        p ? { ...p, studentId: e.target.value } : p,
                      )
                    }
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Staff ID</Label>
                  <Input
                    value={editedUser.staffId || ''}
                    onChange={(e) =>
                      setEditedUser((p) =>
                        p ? { ...p, staffId: e.target.value } : p,
                      )
                    }
                  />
                </div>
              )}
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="destructive"
                  onClick={() => {
                    setEditUserOpen(false);
                    setDeleteConfirmOpen(true);
                  }}
                >
                  Delete
                </Button>
                <Button
                  variant="gradient"
                  onClick={handleUpdateUser}
                  disabled={!hasChanges}
                >
                  Update
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete user "{selectedUser?.name}"?
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteConfirmOpen(false);
                setEditUserOpen(true);
              }}
            >
              No
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Yes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
