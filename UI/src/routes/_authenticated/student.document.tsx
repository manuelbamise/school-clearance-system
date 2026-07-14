import { createFileRoute } from '@tanstack/react-router';
import { useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  FileText,
  X,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
import { pastDocuments as initialDocuments } from '@/data/dummy';
import type { DocumentRecord } from '@/types';

export const Route = createFileRoute('/_authenticated/student/document')({
  component: StudentDocumentPage,
});

interface DocumentFormData {
  name: string;
  level: string;
  session: string;
  submittedTo: 'department' | 'academic' | 'bursary';
}

function StudentDocumentPage() {
  const [documents, setDocuments] =
    useState<DocumentRecord[]>(initialDocuments);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [forms, setForms] = useState<DocumentFormData[]>([]);
  const [uploading, setUploading] = useState(false);
  const [resubmitDoc, setResubmitDoc] = useState<DocumentRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalFileRef = useRef<HTMLInputElement>(null);
  const ITEMS_PER_PAGE = 5;

  const handleModalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) setSelectedFiles(files);
  };

  const submittedToLabel = (to: string) => {
    const map: Record<string, string> = {
      department: 'Department Unit',
      academic: 'Academic Unit',
      bursary: 'Bursary Unit',
    };
    return map[to] || to;
  };

  const filteredDocuments = useMemo(
    () =>
      documents
        .filter((doc) => statusFilter === 'all' || doc.status === statusFilter)
        .filter((doc) =>
          [doc.name, doc.level, doc.session, submittedToLabel(doc.submittedTo)].some(
            (field) => field.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        ),
    [documents, searchQuery, statusFilter],
  );

  const totalPages = Math.max(1, Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedDocuments = filteredDocuments.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  const openResubmit = (doc: DocumentRecord) => {
    setResubmitDoc(doc);
    setSelectedFiles([]);
    setForms([
      {
        name: doc.name,
        level: doc.level,
        session: doc.session,
        submittedTo: doc.submittedTo,
      },
    ]);
    setUploadModalOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setSelectedFiles(files);
    setForms(
      files.map((f) => ({
        name: f.name.replace(/\.pdf$/i, ''),
        level: '',
        session: '',
        submittedTo: 'department' as const,
      })),
    );
    setUploadModalOpen(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const updateForm = (
    index: number,
    field: keyof DocumentFormData,
    value: string,
  ) => {
    setForms((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      if (resubmitDoc) {
        setDocuments((prev) =>
          prev.map((d) =>
            d.id === resubmitDoc.id
              ? {
                  ...d,
                  name: forms[0]?.name || d.name,
                  level: forms[0]?.level || d.level,
                  session: forms[0]?.session || d.session,
                  submittedTo: forms[0]?.submittedTo || d.submittedTo,
                  status: 'pending' as const,
                  date: new Date().toISOString().split('T')[0],
                }
              : d,
          ),
        );
        setResubmitDoc(null);
      } else {
        const newDocs: DocumentRecord[] = forms.map((form, i) => ({
          id: `d-${Date.now()}-${i}`,
          name:
            form.name ||
            selectedFiles[i]?.name.replace(/\.pdf$/i, '') ||
            'Untitled',
          level: form.level || 'N/A',
          session: form.session || 'N/A',
          submittedTo: form.submittedTo,
          status: 'pending' as const,
          date: new Date().toISOString().split('T')[0],
        }));
        setDocuments((prev) => [...newDocs, ...prev]);
      }
      setUploading(false);
      setUploadModalOpen(false);
      setSelectedFiles([]);
      setForms([]);
    }, 1200);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newForms = forms.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setForms(newForms);
    if (newFiles.length === 0) {
      setUploadModalOpen(false);
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<
      string,
      { variant: 'success' | 'warning' | 'destructive'; label: string }
    > = {
      approved: { variant: 'success', label: 'Approved' },
      pending: { variant: 'warning', label: 'Pending' },
      rejected: { variant: 'destructive', label: 'Rejected' },
    };
    const s = map[status] || { variant: 'warning' as const, label: status };
    return <Badge variant={s.variant}>{s.label}</Badge>;
  };

  const bulkMode = selectedFiles.length > 1;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Documents</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload and track your submitted documents.
          </p>
        </div>
      </motion.div>

      {/* Upload button & hidden file input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          variant="gradient"
          className="gap-2"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4" />
          Upload Document
        </Button>
      </motion.div>

      {/* Upload Modal */}
      <Dialog open={uploadModalOpen} onOpenChange={(open) => {
        if (!open) {
          setResubmitDoc(null);
          setSelectedFiles([]);
          setForms([]);
        }
        setUploadModalOpen(open);
      }}>
        <DialogContent className={cn('max-w-lg', bulkMode && 'max-w-2xl')}>
          <DialogHeader>
            <DialogTitle>
              {resubmitDoc
                ? 'Resubmit Document'
                : bulkMode
                  ? `Upload ${selectedFiles.length} Documents`
                  : 'Upload Document'}
            </DialogTitle>
            <DialogDescription>
              {resubmitDoc
                ? 'Update the details and resubmit your document.'
                : bulkMode
                  ? 'Review and fill in details for each document before uploading.'
                  : 'Fill in the document details below.'}
            </DialogDescription>
          </DialogHeader>

          <div
            className={cn(
              'space-y-4',
              bulkMode && 'max-h-96 overflow-y-auto pr-1',
            )}
          >
            <input
              ref={modalFileRef}
              type="file"
              accept=".pdf"
              onChange={handleModalFileChange}
              className="hidden"
            />
            {forms.map((form, i) => (
              <div
                key={i}
                className={cn(
                  'rounded-lg border border-border p-4 space-y-3',
                  bulkMode && 'relative',
                )}
              >
                {bulkMode && (
                  <button
                    onClick={() => removeFile(i)}
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/20 text-muted-foreground hover:bg-destructive hover:text-white transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}

                {bulkMode && (
                  <div className="flex items-center gap-2 pb-1">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-xs font-medium text-muted-foreground truncate">
                      {selectedFiles[i]?.name}
                    </span>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Document Name</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => updateForm(i, 'name', e.target.value)}
                    placeholder="e.g. Transcript Request"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Level</Label>
                    <Input
                      value={form.level}
                      onChange={(e) => updateForm(i, 'level', e.target.value)}
                      placeholder="e.g. 400L"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Session</Label>
                    <Input
                      value={form.session}
                      onChange={(e) => updateForm(i, 'session', e.target.value)}
                      placeholder="e.g. 2024/2025"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Send To</Label>
                  <Select
                    value={form.submittedTo}
                    onValueChange={(
                      val: 'department' | 'academic' | 'bursary',
                    ) => updateForm(i, 'submittedTo', val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="department">
                        Department Unit
                      </SelectItem>
                      <SelectItem value="academic">Academic Unit</SelectItem>
                      <SelectItem value="bursary">Bursary Unit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {!bulkMode && (
                  <div className="space-y-2">
                    <Label>File</Label>
                    {selectedFiles.length > 0 ? (
                      <div className="relative flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-sm text-muted-foreground pr-10">
                        <FileText className="h-4 w-4 shrink-0 text-primary" />
                        <span className="truncate">
                          {selectedFiles[0]?.name}
                        </span>
                        <span className="ml-auto shrink-0 text-xs">
                          {selectedFiles[0] &&
                            `${(selectedFiles[0].size / 1024).toFixed(1)} KB`}
                        </span>
                        <button
                          onClick={() => setSelectedFiles([])}
                          className="absolute right-2 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground hover:bg-muted-foreground/20 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => modalFileRef.current?.click()}
                      >
                        <Upload className="h-4 w-4" />
                        Choose File
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="gradient"
              className="gap-2"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  {resubmitDoc ? 'Resubmit' : bulkMode ? `Upload All (${selectedFiles.length})` : 'Upload'}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Past Uploads Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Past Uploads</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-5">
            {/* Status Filters */}
            <div className="flex items-center gap-2">
              {(['all', 'approved', 'pending', 'rejected'] as const).map((f) => (
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

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search documents..."
                className="pl-9"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Document Name
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Level
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Session
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Submitted To
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredDocuments.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-12 text-center text-sm text-muted-foreground"
                      >
                        {searchQuery
                          ? 'No documents match your search.'
                          : 'No documents uploaded yet.'}
                      </td>
                    </tr>
                  ) : (
                    paginatedDocuments.map((doc, i) => (
                      <motion.tr
                        key={doc.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.02 }}
                        className="transition-colors hover:bg-muted/20"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 shrink-0 text-primary" />
                            <span className="font-medium text-foreground">
                              {doc.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground">
                          {doc.level}
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground">
                          {doc.session}
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground">
                          {submittedToLabel(doc.submittedTo)}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex flex-col items-start gap-1.5">
                            {statusBadge(doc.status)}
                            {doc.status === 'rejected' && (
                              <>
                                {doc.rejectionReason && (
                                  <p className="text-xs text-destructive/80 max-w-[200px] leading-tight">
                                    {doc.rejectionReason}
                                  </p>
                                )}
                                <button
                                  onClick={() => openResubmit(doc)}
                                  className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                >
                                  <RotateCcw className="h-3 w-3" />
                                  Resubmit
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredDocuments.length > 0 && (
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-muted-foreground">
                  Showing{' '}
                  {Math.min(
                    (safePage - 1) * ITEMS_PER_PAGE + 1,
                    filteredDocuments.length,
                  )}
                  –
                  {Math.min(safePage * ITEMS_PER_PAGE, filteredDocuments.length)}{' '}
                  of {filteredDocuments.length}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.max(1, p - 1))
                    }
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
