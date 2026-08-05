import { createFileRoute, useSearch } from '@tanstack/react-router'
import { GraduationCap, FileSearch, Loader2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAsync } from '@/hooks/use-async'
import { getDocument } from '@/lib/api/documents.api'
import { assetUrl } from '@/utils/axios'
import { errorMessage } from '@/lib/api/client'

export const Route = createFileRoute('/document-viewer')({
  component: DocumentViewerPage,
})

const fallbackName = (name?: string) =>
  name || 'My Document'

function DocumentViewerPage() {
  const search = useSearch({ strict: false }) as { id?: string; name?: string; student?: string }
  const id = search.id

  const doc = useAsync(async () => (id ? getDocument(id) : null), [id], { enabled: Boolean(id) })

  const fileName = doc.data?.name || fallbackName(search.name)
  const studentName = doc.data ? doc.data.student.name : search.student || ''
  const src = doc.data ? assetUrl(doc.data.fileUrl) : ''

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b1220] via-[#14345f] to-[#0b1220]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />

      <div className="relative flex w-full max-w-4xl flex-col items-center justify-center">
        {/* Branding */}
        <div className="flex flex-col items-center justify-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-lg">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xl font-bold text-white">
              Clearance Management System
            </span>
            <span className="text-xs text-white/50">Document Viewer</span>
          </div>
        </div>

        {doc.isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-10 py-14 text-center backdrop-blur-xl">
            <Loader2 className="h-7 w-7 animate-spin text-white/70" />
            <p className="text-sm text-white/70">Loading document...</p>
          </div>
        ) : doc.error || !doc.data ? (
          <div className="flex max-w-sm flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
              <FileSearch className="h-7 w-7 text-white/70" />
            </div>
            <h2 className="text-lg font-semibold text-white">No Document Found</h2>
            <p className="mt-2 text-sm text-white/60">
              {doc.error
                ? errorMessage(doc.error, 'The document could not be loaded.')
                : 'The document you are looking for could not be found. Please check the link and try again.'}
            </p>
            <Button
              variant="outline"
              className="mt-6 border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
              onClick={() => window.close()}
            >
              Close Viewer
            </Button>
          </div>
        ) : (
          <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
            {/* Header bar */}
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3.5">
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold text-white">{fileName}</span>
                {studentName && <span className="truncate text-xs text-white/50">{studentName}</span>}
              </div>
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/20 bg-transparent px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/10"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open in new tab
              </a>
            </div>
            {/* Document body */}
            <div className="aspect-[4/3] w-full bg-neutral-900">
              <iframe
                src={src}
                title={fileName}
                className="h-full w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}