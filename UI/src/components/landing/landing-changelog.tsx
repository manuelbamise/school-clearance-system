import Reveal from './reveal'

type ChangeType = 'feat' | 'fix' | 'perf' | 'refactor'

interface Change {
  type: ChangeType
  date: string
  message: string
}

const changes: Change[] = [
  { type: 'fix', date: 'Aug 04, 2026', message: 'first revamp of the landing page' },
  { type: 'feat', date: 'Aug 03, 2026', message: 'add marketing landing page' },
  { type: 'feat', date: 'Aug 03, 2026', message: 'integrate UI with backend APIs across all roles' },
  { type: 'feat', date: 'Aug 03, 2026', message: 'wire frontend to real API auth and add typed api client layer' },
  { type: 'feat', date: 'Aug 03, 2026', message: 'add per-role dashboard metrics entity' },
  { type: 'feat', date: 'Aug 02, 2026', message: 'add bursary unit clearance, report, and document pages' },
  { type: 'feat', date: 'Aug 02, 2026', message: 'add department unit clearance, report, and document pages' },
  { type: 'feat', date: 'Jul 14, 2026', message: 'build multi-role E-School Platform with dashboards and profiles' },
]

const particles = [
  { left: '6%', top: '82%', size: 3, type: 'blue', delay: 0, duration: 16, drift: 26, opacity: 0.55 },
  { left: '12%', top: '30%', size: 4, type: 'amber', delay: 3.2, duration: 19, drift: -30, opacity: 0.5 },
  { left: '18%', top: '60%', size: 2, type: 'gold', delay: 1.4, duration: 22, drift: 18, opacity: 0.6 },
  { left: '24%', top: '12%', size: 3, type: 'blue', delay: 5.1, duration: 17, drift: -22, opacity: 0.45 },
  { left: '33%', top: '74%', size: 2, type: 'amber', delay: 2.3, duration: 20, drift: 32, opacity: 0.5 },
  { left: '41%', top: '38%', size: 5, type: 'blue', delay: 7.4, duration: 24, drift: -18, opacity: 0.4 },
  { left: '49%', top: '88%', size: 3, type: 'gold', delay: 4.6, duration: 18, drift: 24, opacity: 0.5 },
  { left: '57%', top: '22%', size: 2, type: 'amber', delay: 6.2, duration: 21, drift: -28, opacity: 0.55 },
  { left: '63%', top: '66%', size: 4, type: 'blue', delay: 1.9, duration: 23, drift: 20, opacity: 0.4 },
  { left: '71%', top: '10%', size: 3, type: 'gold', delay: 8.3, duration: 19, drift: -24, opacity: 0.5 },
  { left: '78%', top: '52%', size: 2, type: 'amber', delay: 3.8, duration: 26, drift: 30, opacity: 0.45 },
  { left: '84%', top: '80%', size: 4, type: 'blue', delay: 5.7, duration: 20, drift: -20, opacity: 0.5 },
  { left: '90%', top: '28%', size: 3, type: 'gold', delay: 2.8, duration: 22, drift: 22, opacity: 0.55 },
  { left: '95%', top: '68%', size: 2, type: 'blue', delay: 7.9, duration: 18, drift: -26, opacity: 0.45 },
]

export default function LandingChangelog() {
  return (
    <section className="lp-section lp-changelog" id="changelog">
      <div className="lp-particles">
        {particles.map((p, i) => (
          <span
            key={i}
            className={`lp-particle ${p.type}`}
            style={
              {
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                '--lp-particle-drift': `${p.drift}px`,
                '--lp-particle-opacity': p.opacity,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
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