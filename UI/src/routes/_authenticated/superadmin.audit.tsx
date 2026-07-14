import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { auditLogs as initialLogs } from '@/data/dummy';
import type { AuditLog } from '@/types';

export const Route = createFileRoute('/_authenticated/superadmin/audit')({
  component: SuperadminAuditPage,
});

const categoryOptions = [
  { value: 'all', label: 'All' },
  { value: 'login', label: 'Logins' },
  { value: 'permission', label: 'Permissions' },
  { value: 'export', label: 'Data Exports' },
  { value: 'user-management', label: 'User Management' },
] as const;

const categoryBadge = (cat: AuditLog['category']) => {
  const map: Record<string, { variant: 'default' | 'warning' | 'destructive'; label: string }> = {
    login: { variant: 'default', label: 'Login' },
    permission: { variant: 'warning', label: 'Permission' },
    export: { variant: 'destructive', label: 'Export' },
    'user-management': { variant: 'default', label: 'User Mgmt' },
  };
  const c = map[cat] || { variant: 'default' as const, label: cat };
  return <Badge variant={c.variant}>{c.label}</Badge>;
};

function SuperadminAuditPage() {
  const [logs] = useState<AuditLog[]>(initialLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const filteredLogs = useMemo(
    () =>
      logs
        .filter((l) => categoryFilter === 'all' || l.category === categoryFilter)
        .filter((l) =>
          [l.who, l.whoEmail, l.what, l.where, l.why].some((f) =>
            f.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        ),
    [logs, searchQuery, categoryFilter],
  );

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedLogs = filteredLogs.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track who did what, when, and why across the system.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
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
                placeholder="Search by user, action, IP, or reason..."
                className="pl-9"
              />
            </div>

            {/* Category Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              {categoryOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setCategoryFilter(opt.value);
                    setCurrentPage(1);
                  }}
                  className={cn(
                    'rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors',
                    categoryFilter === opt.value
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
                      User
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Action
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Timestamp
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Reason
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-12 text-center text-sm text-muted-foreground"
                      >
                        {searchQuery
                          ? 'No logs match your search.'
                          : 'No activity logs found.'}
                      </td>
                    </tr>
                  ) : (
                    paginatedLogs.map((log, i) => (
                      <motion.tr
                        key={log.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.02 }}
                        className="transition-colors hover:bg-muted/20"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">
                              {log.who}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {log.whoEmail}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex flex-col">
                            <span className="text-foreground">
                              {log.what}
                            </span>
                            <span className="text-xs text-muted-foreground mt-0.5">
                              {categoryBadge(log.category)}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap">
                          {log.when}
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground max-w-[220px]">
                          <span className="line-clamp-2">{log.why}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge
                            variant={log.status === 'success' ? 'success' : 'destructive'}
                          >
                            {log.status === 'success' ? 'Success' : 'Failed'}
                          </Badge>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredLogs.length > 0 && (
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-muted-foreground">
                  Showing{' '}
                  {Math.min(
                    (safePage - 1) * ITEMS_PER_PAGE + 1,
                    filteredLogs.length,
                  )}
                  –
                  {Math.min(safePage * ITEMS_PER_PAGE, filteredLogs.length)}{' '}
                  of {filteredLogs.length}
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
    </div>
  );
}
