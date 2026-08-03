import { Shield, Zap, BarChart3, LayoutGrid, type LucideIcon } from 'lucide-react'
import Reveal from './reveal'

interface Feature {
  icon: LucideIcon
  title: string
  body: string
}

const features: Feature[] = [
  {
    icon: Shield,
    title: 'Maximum Security',
    body: 'End-to-end encryption and role-based access keep sensitive student data protected at every step.',
  },
  {
    icon: Zap,
    title: 'Instant Processing',
    body: 'Automated document verification reduces clearance time from weeks to minutes with AI-powered checks.',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Tracking',
    body: 'Live dashboards show exactly where each document stands — no more email chasing.',
  },
  {
    icon: LayoutGrid,
    title: 'Premium Interface',
    body: 'An elegant, intuitive design that\u2019s easy to use for students, faculty, and admins alike.',
  },
]

export default function LandingFeatures() {
  return (
    <section className="lp-section lp-features" id="features">
      <div className="lp-container">
        <Reveal>
          <div className="lp-section-header">
            <h2>Why Choose ClearPath?</h2>
            <p className="lp-section-subtitle">
              Everything students and administrators need for a frictionless
              clearance process.
            </p>
          </div>
        </Reveal>

        <div className="lp-feature-grid">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 100}>
              <div className="lp-feature-card">
                <span className="lp-feature-icon">
                  <f.icon size={22} strokeWidth={1.8} />
                </span>
                <h4 className="lp-h4">{f.title}</h4>
                <p className="lp-caption" style={{ marginTop: 12 }}>
                  {f.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
