import { createFileRoute } from '@tanstack/react-router'
import { GraduationCap, FileSearch } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/document-viewer')({
  component: DocumentViewerPage,
})

function DocumentViewerPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#2d1b69] to-[#1a1a2e]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />

      <div className="relative flex flex-col items-center justify-center">
        {/* Branding */}
        <div className="flex flex-col items-center justify-center gap-3 mb-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-lg">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xl font-bold text-white">
              Clearance Management System
            </span>
            <span className="text-xs text-white/50">
              Document Viewer
            </span>
          </div>
        </div>

        {/* Empty state */}
        <div className="flex max-w-sm flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
            <FileSearch className="h-7 w-7 text-white/70" />
          </div>
          <h2 className="text-lg font-semibold text-white">
            No Document Found
          </h2>
          <p className="mt-2 text-sm text-white/60">
            The document you are looking for could not be found. Please check
            the link and try again.
          </p>
          <Button
            variant="outline"
            className="mt-6 border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            onClick={() => window.close()}
          >
            Close Viewer
          </Button>
        </div>
      </div>
    </div>
  )
}
