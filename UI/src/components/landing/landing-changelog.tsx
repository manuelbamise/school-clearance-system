import Reveal from './reveal'

type ChangeType = 'feat' | 'fix' | 'perf' | 'refactor'

interface Change {
  type: ChangeType
  date: string
  message: string
}

const changes: Change[] = [
  { type: 'feat', date: 'Aug 2, 2024', message: 'Added bulk document upload with drag-and-drop support' },
  { type: 'fix', date: 'Aug 1, 2024', message: 'Resolved notification delay for clearance status updates' },
  { type: 'feat', date: 'Jul 28, 2024', message: 'New admin dashboard with department-wise analytics' },
  { type: 'perf', date: 'Jul 25, 2024', message: 'Reduced document processing time by 40%' },
  { type: 'feat', date: 'Jul 22, 2024', message: 'Integrated digital signature verification' },
  { type: 'fix', date: 'Jul 18, 2024', message: 'Fixed mobile responsiveness on document preview modal' },
  { type: 'feat', date: 'Jul 15, 2024', message: 'Added multi-language support (English, Spanish, French)' },
  { type: 'refactor', date: 'Jul 10, 2024', message: 'Migrated database to PostgreSQL for better scaling' },
  { type: 'feat', date: 'Jul 5, 2024', message: 'Introduced AI-powered document classification' },
  { type: 'fix', date: 'Jul 1, 2024', message: 'Patched security vulnerability in file upload handler' },
]

export default function LandingChangelog() {
  return (
    <section className="lp-section lp-changelog" id="changelog">
      <div className="lp-container">
        <Reveal>
          <div className="lp-section-header">
            <h2>What&#39;s New</h2>
            <p className="lp-section-subtitle">
              Latest updates and improvements to ClearPath.
            </p>
          </div>
        </Reveal>

        <div className="lp-changelog-list">
          {changes.map((c, i) => (
            <Reveal key={`${c.date}-${i}`} delay={i < 4 ? i * 60 : 0}>
              <div className="lp-change-entry">
                <span className="lp-change-date">{c.date}</span>
                <div className="lp-change-message">
                  <span className={`lp-change-dot ${c.type}`} />
                  <span>{c.message}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}