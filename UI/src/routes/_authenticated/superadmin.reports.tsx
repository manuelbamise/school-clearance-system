import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { reportRecords as initialReports } from '@/data/dummy';
import type { ReportRecord } from '@/types';

export const Route = createFileRoute('/_authenticated/superadmin/reports')({
  component: SuperadminReportsPage,
});

const MAX_TITLE_LENGTH = 50;

function SuperadminReportsPage() {
  const [reports, setReports] = useState<ReportRecord[]>(initialReports);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'resolved'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState<ReportRecord | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const ITEMS_PER_PAGE = 5;

  const filteredReports = useMemo(
    () =>
      reports
        .filter((r) => statusFilter === 'all' || r.status === statusFilter)
        .filter((r) =>
          [r.userName, r.userEmail, r.userDepartment, r.title, r.content].some((f) =>
            f.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        ),
    [reports, searchQuery, statusFilter],
  );

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedReports = filteredReports.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  const openPreview = (report: ReportRecord) => {
    setSelectedReport(report);
    setPreviewOpen(true);
  };

  const handleResolve = () => {
    if (!selectedReport) return;
    setReports((prev) =>
      prev.map((r) =>
        r.id === selectedReport.id ? { ...r, status: 'resolved' as const } : r,
      ),
    );
    setSelectedReport((prev) =>
      prev ? { ...prev, status: 'resolved' as const } : null,
    );
  };

  const handleDelete = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  const truncate = (text: string, max: number) =>
    text.length > max ? text.slice(0, max) + '...' : text;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View and manage student and staff reports.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>All Reports</CardTitle>
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
                placeholder="Search by user, title, or content..."
                className="pl-9"
              />
            </div>

            {/* Status Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              {(['all', 'pending', 'resolved'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setStatusFilter(f);
                    setCurrentPage(1);
                  }}
                  className={cn(
                    'rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors',
                    statusFilter === f
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'border border-border bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
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
                      Department
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Report
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Status
                    </th>
                    <th className="w-12" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredReports.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-12 text-center text-sm text-muted-foreground"
                      >
                        {searchQuery
                          ? 'No reports match your search.'
                          : 'No reports found.'}
                      </td>
                    </tr>
                  ) : (
                    paginatedReports.map((report, i) => (
                      <motion.tr
                        key={report.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.02 }}
                        onClick={() => openPreview(report)}
                        className="cursor-pointer transition-colors hover:bg-muted/20"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">
                              {report.userName}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {report.userEmail}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground">
                          {report.userDepartment}
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground">
                          {truncate(report.title, MAX_TITLE_LENGTH)}
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge
                            variant={
                              report.status === 'resolved' ? 'success' : 'warning'
                            }
                          >
                            {report.status === 'resolved'
                              ? 'Resolved'
                              : 'Pending'}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5">
                          {report.status === 'resolved' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(report.id);
                              }}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredReports.length > 0 && (
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-muted-foreground">
                  Showing{' '}
                  {Math.min(
                    (safePage - 1) * ITEMS_PER_PAGE + 1,
                    filteredReports.length,
                  )}
                  –
                  {Math.min(safePage * ITEMS_PER_PAGE, filteredReports.length)}{' '}
                  of {filteredReports.length}
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

      {/* Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-5">
              {/* User info */}
              <div>
                <p className="text-sm font-medium text-foreground">
                  {selectedReport.userName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedReport.userEmail}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Department: {selectedReport.userDepartment}
                </p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm font-semibold text-foreground mb-2">
                  {selectedReport.title}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {selectedReport.content}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
                {selectedReport.status === 'pending' && (
                  <Button variant="gradient" onClick={handleResolve}>
                    Resolve
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
