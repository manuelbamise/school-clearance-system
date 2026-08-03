import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, ChevronLeft, ChevronRight, ShieldCheck, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'
import { TableSkeleton, EmptyState, ErrorState } from '@/components/ui/data-states'
import { useAsync } from '@/hooks/use-async'
import { getClearanceList, clearStudent } from '@/lib/api/clearance.api'
import { mapClearanceItem } from '@/lib/api/mappers'
import { errorMessage } from '@/lib/api/client'
import type { ClearanceRequest } from '@/types'

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'cleared', label: 'Cleared' },
] as const

export default function UnitClearancePage({ unit }: { unit: string }) {
  const requests = useAsync(
    async () => (await getClearanceList({ limit: 100 })).clearances.map(mapClearanceItem),
    [unit],
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 5

  const [clearRequest, setClearRequest] = useState<ClearanceRequest | null>(null)
  const [checkedItems, setCheckedItems] = useState({ documents: false, status: false, dues: false })
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const data = requests.data ?? []

  const checklist = [
    { key: 'documents' as const, label: 'All documents are in order' },
    { key: 'status' as const, label: 'Student status is valid' },
    { key: 'dues' as const, label: 'All dues have been paid' },
  ]

  const handleClear = async () => {
    if (!clearRequest?.userId) return
    setBusy(true)
    setActionError(null)
    try {
      await clearStudent(clearRequest.userId)
      await requests.refetch()
      setClearRequest(null)
      setCheckedItems({ documents: false, status: false, dues: false })
    } catch (err) {
      setActionError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const filteredRequests = useMemo(
    () =>
      data
        .filter((r) =>
          statusFilter === 'all' ? true : statusFilter === 'cleared' ? r.cleared : !r.cleared,
        )
        .filter((r) =>
          [r.studentName, r.studentId, r.department].some((f) =>
            f.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        ),
    [data, searchQuery, statusFilter],
  )

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / ITEMS_PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)
  const paginatedRequests = filteredRequests.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  )

  const allChecked = checklist.every((item) => checkedItems[item.key])

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Clearance Requests</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Clear students whose documents are all in order.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
            <CardDescription>
              {filteredRequests.length} request
              {filteredRequests.length === 1 ? '' : 's'} found
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Search by student, ID, or department..."
                className="pl-9"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setStatusFilter(opt.value)
                    setCurrentPage(1)
                  }}
                  className={cn(
                    'rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors',
                    statusFilter === opt.value
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'border border-border bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {requests.isLoading ? (
              <TableSkeleton rows={4} cols={4} />
            ) : requests.error ? (
              <ErrorState message={requests.error} onRetry={requests.refetch} />
            ) : filteredRequests.length === 0 ? (
              <EmptyState
                title={
                  searchQuery || statusFilter !== 'all'
                    ? 'No requests match your filters.'
                    : 'No clearance requests found.'
                }
                description={searchQuery || statusFilter !== 'all' ? undefined : 'Students requesting clearance will appear here.'}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Student</th>
                      <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Department</th>
                      <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                      <th className="text-right px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {paginatedRequests.map((req, i) => (
                      <motion.tr
                        key={req.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.02 }}
                        className="transition-colors hover:bg-muted/20"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{req.studentName}</span>
                            <span className="text-xs text-muted-foreground">{req.studentId}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground">{req.department}</td>
                        <td className="px-5 py-3.5">
                          <Badge variant={req.cleared ? 'default' : 'secondary'}>
                            {req.cleared ? 'Cleared' : 'Pending'}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex justify-end">
                            <Button
                              variant="gradient"
                              size="sm"
                              className="gap-1.5"
                              disabled={req.cleared || busy}
                              onClick={() => {
                                setCheckedItems({ documents: false, status: false, dues: false })
                                setClearRequest(req)
                              }}
                            >
                              <ShieldCheck className="h-3.5 w-3.5" />
                              Clear
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!requests.isLoading && !requests.error && filteredRequests.length > 0 && (
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-muted-foreground">
                  Showing {Math.min((safePage - 1) * ITEMS_PER_PAGE + 1, filteredRequests.length)}–
                  {Math.min(safePage * ITEMS_PER_PAGE, filteredRequests.length)} of {filteredRequests.length}
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
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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

      {/* Clear Confirmation Modal */}
      <Dialog open={clearRequest !== null} onOpenChange={(open) => { if (!open) setClearRequest(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear Student</DialogTitle>
            <DialogDescription>
              Are you sure you want to clear{' '}
              <span className="font-medium text-foreground">{clearRequest?.studentName}</span>? Please
              confirm the checklist below before proceeding.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              {checklist.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setCheckedItems((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                  className="flex w-full items-center gap-3 rounded-lg border border-dashed border-border px-3 py-2.5 text-left transition-colors hover:bg-muted/20"
                >
                  <span
                    className={cn(
                      'flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border text-white transition-colors',
                      checkedItems[item.key] ? 'border-primary bg-primary' : 'border-border bg-transparent',
                    )}
                  >
                    {checkedItems[item.key] && (
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </span>
                  <span className="text-sm text-foreground">{item.label}</span>
                </button>
              ))}
            </div>
            {actionError && <p className="text-xs text-destructive">{actionError}</p>}
            <div className="flex items-center justify-between pt-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button variant="gradient" onClick={handleClear} disabled={!allChecked || busy}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Clear'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
