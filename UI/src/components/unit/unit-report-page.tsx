import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Loader2, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { createReport } from '@/lib/api/reports.api'
import { errorMessage } from '@/lib/api/client'

export default function UnitReportPage() {
  const [title, setTitle] = useState('')
  const [complaint, setComplaint] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !complaint.trim()) return
    setSending(true)
    setError(null)
    try {
      await createReport({ title: title.trim(), content: complaint.trim() })
      setSent(true)
      setTitle('')
      setComplaint('')
      setTimeout(() => setSent(false), 3000)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Submit a Report</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Use this form to send a complaint or report directly to the Super Admin.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Report Details</CardTitle>
            <CardDescription>Provide a clear title and detailed description of your issue.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief summary of your issue"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="complaint">Complaint</Label>
                <textarea
                  id="complaint"
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                  placeholder="Describe your issue in detail..."
                  required
                  rows={6}
                  className="flex w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
              </div>

              {error && <p className="text-xs text-destructive">{error}</p>}

              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="gradient"
                  className="gap-2"
                  disabled={sending || !title.trim() || !complaint.trim()}
                >
                  {sending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : sent ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Sent Successfully
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Report
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}