import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, ChevronLeft, ChevronRight, Eye, Check, X, Trash2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
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
import { getInbox, reviewDocument, deleteDocument } from '@/lib/api/documents.api'
import { mapSubmittedDocument } from '@/lib/api/mappers'
import { errorMessage } from '@/lib/api/client'
import type { SubmittedDocument } from '@/types'

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
] as const

const statusVariant: Record<
  SubmittedDocument['status'],
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  pending: 'secondary',
  approved: 'default',
  rejected: 'destructive',
}

export default function UnitDocumentsPage({ unit }: { unit: string }) {
  const docs = useAsync(
    async () => (await getInbox({ limit: 100 })).documents.map(mapSubmittedDocument),
    [unit],
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 5

  const [approveDoc, setApproveDoc] = useState<SubmittedDocument | null>(null)
  const [rejectDoc, setRejectDoc] = useState<SubmittedDocument | null>(null)
  const [deleteDoc, setDeleteDoc] = useState<SubmittedDocument | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const documents = docs.data ?? []

  const handleViewDocument = (doc: SubmittedDocument) => {
    window.open(
      `/document-viewer?id=${doc.id}&name=${encodeURIComponent(doc.documentName)}&student=${encodeURIComponent(doc.studentName)}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  const handleApprove = async () => {
    if (!approveDoc) return
    setBusy(true)
    setActionError(null)
    try {
      await reviewDocument(approveDoc.id, { status: 'approved' })
      await docs.refetch()
      setApproveDoc(null)
    } catch (err) {
      setActionError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const handleReject = async () => {
    if (!rejectDoc || !rejectionReason.trim()) return
    setBusy(true)
    setActionError(null)
    try {
      await reviewDocument(rejectDoc.id, {
        status: 'rejected',
        rejectionReason: rejectionReason.trim(),
      })
      await docs.refetch()
      setRejectDoc(null)
      setRejectionReason('')
    } catch (err) {
      setActionError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDoc) return
    setBusy(true)
    setActionError(null)
    try {
      await deleteDocument(deleteDoc.id)
      await docs.refetch()
      setDeleteDoc(null)
    } catch (err) {
      setActionError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const filteredDocuments = useMemo(
    () =>
      documents
        .filter((d) => statusFilter === 'all' || d.status === statusFilter)
        .filter((d) =>
          [d.studentName, d.studentId, d.documentName, d.level, d.session].some((f) =>
            f.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        ),
    [documents, searchQuery, statusFilter],
  )

  const totalPages = Math.max(1, Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)
  const paginatedDocuments = filteredDocuments.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  )

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Submitted Documents</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review and approve documents submitted by students.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>
              {filteredDocuments.length} document
              {filteredDocuments.length === 1 ? '' : 's'} found
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
                placeholder="Search by student, ID, document, level, or session..."
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

            {docs.isLoading ? (
              <TableSkeleton rows={4} cols={6} />
            ) : docs.error ? (
              <ErrorState message={docs.error} onRetry={docs.refetch} />
            ) : filteredDocuments.length === 0 ? (
              <EmptyState
                title={
                  searchQuery || statusFilter !== 'all'
                    ? 'No documents match your filters.'
                    : 'No documents in your inbox.'
                }
                description={searchQuery || statusFilter !== 'all' ? undefined : 'Documents submitted by students will appear here.'}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Student</th>
                      <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Document</th>
                      <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Level</th>
                      <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Session</th>
                      <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                      <th className="text-right px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {paginatedDocuments.map((doc, i) => (
                      <motion.tr
                        key={doc.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.02 }}
                        className="transition-colors hover:bg-muted/20"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{doc.studentName}</span>
                            <span className="text-xs text-muted-foreground">{doc.studentId}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-foreground">{doc.documentName}</td>
                        <td className="px-5 py-3.5 text-muted-foreground">{doc.level}</td>
                        <td className="px-5 py-3.5 text-muted-foreground">{doc.session}</td>
                        <td className="px-5 py-3.5">
                          <Badge variant={statusVariant[doc.status]}>{doc.status}</Badge>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => handleViewDocument(doc)}>
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </Button>
                            {doc.status === 'pending' ? (
                              <>
                                <Button
                                  variant="gradient"
                                  size="sm"
                                  className="gap-1.5"
                                  disabled={busy}
                                  onClick={() => setApproveDoc(doc)}
                                >
                                  <Check className="h-3.5 w-3.5" />
                                  Approve
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="gap-1.5"
                                  disabled={busy}
                                  onClick={() => setRejectDoc(doc)}
                                >
                                  <X className="h-3.5 w-3.5" />
                                  Reject
                                </Button>
                              </>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                disabled={busy}
                                onClick={() => setDeleteDoc(doc)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                              </Button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!docs.isLoading && !docs.error && filteredDocuments.length > 0 && (
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-muted-foreground">
                  Showing {Math.min((safePage - 1) * ITEMS_PER_PAGE + 1, filteredDocuments.length)}–
                  {Math.min(safePage * ITEMS_PER_PAGE, filteredDocuments.length)} of {filteredDocuments.length}
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

      {/* Approve Confirmation Modal */}
      <Dialog open={approveDoc !== null} onOpenChange={(open) => { if (!open) setApproveDoc(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve{' '}
              <span className="font-medium text-foreground">{approveDoc?.documentName}</span> by{' '}
              {approveDoc?.studentName}?
            </DialogDescription>
          </DialogHeader>
          {actionError && <p className="text-xs text-destructive">{actionError}</p>}
          <div className="flex items-center justify-between pt-2">
            <DialogClose asChild>
              <Button variant="outline">No</Button>
            </DialogClose>
            <Button variant="gradient" onClick={handleApprove} disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Yes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog
        open={rejectDoc !== null}
        onOpenChange={(open) => {
          if (!open) {
            setRejectDoc(null)
            setRejectionReason('')
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Document</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting{' '}
              <span className="font-medium text-foreground">{rejectDoc?.documentName}</span> by{' '}
              {rejectDoc?.studentName}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Reason for rejection</Label>
              <textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. The document is illegible. Please re-upload a clear scan."
                rows={4}
                className="flex w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
            </div>
            {actionError && <p className="text-xs text-destructive">{actionError}</p>}
            <div className="flex items-center justify-between pt-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button variant="destructive" onClick={handleReject} disabled={!rejectionReason.trim() || busy}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reject'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteDoc !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteDoc(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{' '}
              <span className="font-medium text-foreground">{deleteDoc?.documentName}</span> by{' '}
              {deleteDoc?.studentName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {actionError && <p className="text-xs text-destructive">{actionError}</p>}
          <div className="flex items-center justify-between pt-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete} disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
