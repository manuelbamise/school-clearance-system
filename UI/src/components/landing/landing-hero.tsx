import { useNavigate } from '@tanstack/react-router'
import {
  ArrowRight,
  LayoutDashboard,
  FileUp,
  ShieldCheck,
  UploadCloud,
  CheckCircle2,
  Clock3,
  Star,
  FileCheck2,
  Play,
} from 'lucide-react'
import Reveal from './reveal'

function MockSidebar() {
  const items = [
    { label: 'Dashboard', active: false },
    { label: 'My Documents', active: true },
    { label: 'Clearance', active: false },
    { label: 'Reports', active: false },
  ]
  return (
    <div className="lp-mock-side">
      {items.map((item) => (
        <div
          key={item.label}
          className={`lp-mock-nav-item ${item.active ? 'active' : ''}`}
        >
          {item.active ? <FileUp size={14} /> : <LayoutDashboard size={14} />}
          {item.label}
        </div>
      ))}
    </div>
  )
}

function MockDocuments() {
  const docs = [
    { name: 'Academic Transcript', status: 'Verified', color: '#22c55e', pct: 100 },
    { name: 'Clearance Form', status: 'Under review', color: '#ffac0a', pct: 68 },
    { name: 'Identity Card', status: 'Pending upload', color: '#9ba9c4', pct: 0 },
  ]
  return (
    <div className="lp-mock-card">
      <div className="lp-mock-card-title">Required Documents</div>
      {docs.map((doc) => (
        <div key={doc.name} className="lp-mock-file">
          <span className="lp-mock-file-icon">
            <FileCheck2 size={16} />
          </span>
          <div className="lp-mock-file-meta">
            <div className="lp-mock-file-name">{doc.name}</div>
            <div className="lp-mock-file-status">{doc.status}</div>
            {doc.pct > 0 && (
              <div className="lp-mock-progress-track" style={{ marginTop: 6 }}>
                <div
                  className="lp-mock-progress-bar"
                  style={{ width: `${doc.pct}%`, background: doc.color }}
                />
              </div>
            )}
          </div>
          <span className="lp-mock-status-dot" style={{ background: doc.color }} />
        </div>
      ))}
    </div>
  )
}

function HeroMockup() {
  return (
    <div className="lp-hero-mockup-wrap" id="lp-demo">
      <div className="lp-mockup lp-mockup-tilt">
        <div className="lp-mock-topbar">
          <div className="lp-mock-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            Search documents...
          </div>
          <span className="lp-mock-avatar">JD</span>
        </div>
        <div className="lp-mock-body">
          <MockSidebar />
          <div className="lp-mock-main">
            <div className="lp-mock-upload">
              <UploadCloud size={26} color="#0175ff" />
              <div className="lp-mock-upload-title">Drag &amp; drop documents here</div>
              <div className="lp-mock-upload-sub">or click to browse · PDF, JPG, PNG</div>
            </div>
            <MockDocuments />
            <div className="lp-mock-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div className="lp-mock-card-title" style={{ marginBottom: 2 }}>
                  Clearance Progress
                </div>
                <div className="lp-mock-file-status">3 of 5 departments approved</div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#0175ff', letterSpacing: '-0.02em' }}>
                68%
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lp-float-card fc-left">
        <span className="lp-mock-file-icon" style={{ background: 'rgba(34,197,94,.15)', color: '#22c55e' }}>
          <CheckCircle2 size={16} />
        </span>
        <div>
          <div className="lp-float-card-label">Document verified</div>
          <div className="lp-float-card-value">Transcript · 100%</div>
        </div>
      </div>

      <div className="lp-float-card fc-right">
        <span className="lp-mock-file-icon" style={{ background: 'rgba(255,172,10,.15)', color: '#ffac0a' }}>
          <Clock3 size={16} />
        </span>
        <div>
          <div className="lp-float-card-label">Next review</div>
          <div className="lp-float-card-value">~ 24 hrs</div>
        </div>
      </div>
    </div>
  )
}

export default function LandingHero() {
  const navigate = useNavigate()

  return (
    <section className="lp-hero" id="top">
      <div className="lp-hero-glow" />
      <div className="lp-container">
        <Reveal>
          <div className="lp-hero-content">
            <span className="lp-badge">
              <ShieldCheck size={14} color="#0175ff" />
              Student Clearance Made Simple
            </span>
            <h1 className="lp-h1" style={{ marginTop: 24 }}>
              Streamline Your Clearance.
              <br />
              Graduate Without the Hassle.
            </h1>
            <p className="lp-body lp-hero-subtitle">
              ClearPath automates document verification, status tracking, and
              approvals — so students and administrators save hours of paperwork.
            </p>

            <div className="lp-hero-ctas">
              <button
                type="button"
                className="lp-btn lp-btn-primary"
                onClick={() => navigate({ to: '/login' })}
              >
                Get Started Free
                <ArrowRight size={16} />
              </button>
              <a href="#lp-demo" className="lp-btn lp-btn-secondary">
                <Play size={16} fill="currentColor" />
                Watch Demo
              </a>
            </div>

            <div className="lp-hero-trust">
              <span className="lp-stars">
                <Star size={15} fill="currentColor" stroke="none" />
                <Star size={15} fill="currentColor" stroke="none" />
                <Star size={15} fill="currentColor" stroke="none" />
                <Star size={15} fill="currentColor" stroke="none" />
                <Star size={15} fill="currentColor" stroke="none" />
              </span>
              <span style={{ fontWeight: 600, color: '#fff' }}>4.9</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span className="lp-caption">Trusted by 50+ universities</span>
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <HeroMockup />
        </Reveal>
      </div>
    </section>
  )
}
