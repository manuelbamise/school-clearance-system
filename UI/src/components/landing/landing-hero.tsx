import { useNavigate } from '@tanstack/react-router'
import {
  ArrowRight,
  ShieldCheck,
  Play,
  Upload,
  FileText,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  GraduationCap,
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  User,
} from 'lucide-react'
import Reveal from './reveal'
import LandingLogoMarquee from './landing-marquee'

/* ---------- Mockup: faithful app frame ---------- */

const sideItems: { label: string; icon: typeof FileText; active?: boolean }[] = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Documents', icon: FileText, active: true },
  { label: 'Clearance', icon: ClipboardList },
  { label: 'Reports', icon: BarChart3 },
  { label: 'Profile', icon: User },
]

const statusCfg: Record<string, { label: string; cls: string }> = {
  approved: { label: 'Approved', cls: 'approved' },
  pending: { label: 'Pending', cls: 'pending' },
  rejected: { label: 'Rejected', cls: 'rejected' },
}

const docRows = [
  { name: 'Academic Transcript', level: '500L', session: '2024/2025', to: 'Academic Unit', status: 'approved' },
  { name: 'Clearance Form', level: '500L', session: '2024/2025', to: 'Bursary Unit', status: 'pending' },
  { name: 'Identity Card', level: '500L', session: '2024/2025', to: 'Department Unit', status: 'rejected' },
]

function MockSidebar() {
  return (
    <div className="lp-mock-side">
      {sideItems.map((item) => (
        <div key={item.label} className={`lp-mock-nav-item ${item.active ? 'active' : ''}`}>
          <item.icon size={13} strokeWidth={2} />
          {item.label}
        </div>
      ))}
    </div>
  )
}

function MockTable() {
  const headers = ['Document Name', 'Level', 'Session', 'Submitted To', 'Status']
  return (
    <div className="lp-mock-card">
      <div className="lp-mock-card-title">Past Uploads</div>
      <div className="lp-mock-filters">
        {['All', 'Approved', 'Pending', 'Rejected'].map((f, i) => (
          <span key={f} className={`lp-mock-pill ${i === 0 ? 'active' : ''}`}>
            {f}
          </span>
        ))}
      </div>
      <div className="lp-mock-search">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        Search documents...
      </div>
      <table className="lp-mock-table">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {docRows.map((row) => {
            const s = statusCfg[row.status]
            return (
              <tr key={row.name}>
                <td className="lp-mock-docname">
                  <FileText size={12} />
                  <span>{row.name}</span>
                </td>
                <td>{row.level}</td>
                <td>{row.session}</td>
                <td>{row.to}</td>
                <td>
                  <div className="lp-mock-badge-col">
                    <span className={`lp-mock-badge ${s.cls}`}>{s.label}</span>
                    {row.status === 'rejected' && (
                      <span className="lp-mock-resubmit">
                        <RotateCcw size={9} />
                        Resubmit
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="lp-mock-table-foot">
        <span>Showing 1–3 of 3</span>
        <span className="lp-mock-pagination">
          <span className="lp-mock-pgbtn">
            <ChevronLeft size={10} />
            Previous
          </span>
          <span className="lp-mock-pageno">Page 1 of 1</span>
          <span className="lp-mock-pgbtn">
            Next
            <ChevronRight size={10} />
          </span>
        </span>
      </div>
    </div>
  )
}

function HeroMockup() {
  return (
    <div className="lp-hero-mockup-wrap" id="lp-demo">
      <div className="lp-mockup lp-mockup-tilt">
        <div className="lp-mock-topbar">
          <div className="lp-mock-brand">
            <span className="lp-mock-logo">
              <GraduationCap size={13} strokeWidth={2.5} />
            </span>
            <span className="lp-mock-brandname">ClearPath</span>
          </div>
          <div className="lp-mock-top-right">
            <span className="lp-mock-role-badge">Student</span>
            <span className="lp-mock-avatar">AO</span>
          </div>
        </div>
        <div className="lp-mock-body">
          <MockSidebar />
          <div className="lp-mock-main">
            <div className="lp-mock-pagehead">
              <div>
                <div className="lp-mock-pagetitle">Documents</div>
                <div className="lp-mock-pagesub">Upload and track your submitted documents.</div>
              </div>
              <span className="lp-mock-upload-btn">
                <Upload size={11} />
                Upload Document
              </span>
            </div>
            <MockTable />
          </div>
        </div>
      </div>

      <div className="lp-mock-toast">
        <span className="lp-mock-toast-icon">
          <CheckCircle2 size={14} />
        </span>
        <div>
          <div className="lp-mock-toast-title">Academic transcript approved</div>
          <div className="lp-mock-toast-sub">Academic Unit · just now</div>
        </div>
      </div>
    </div>
  )
}

/* ---------- Landing hero section ---------- */

export default function LandingHero() {
  const navigate = useNavigate()

  return (
    <section className="lp-hero" id="top">
      <div className="lp-hero-glow" />
      <div className="lp-hero-shapes">
        <span className="lp-hero-shape s1" />
        <span className="lp-hero-shape s2" />
        <span className="lp-hero-shape s3" />
      </div>
      <div className="lp-container lp-hero-container">
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
          </div>
        </Reveal>

        <Reveal delay={100}>
          <LandingLogoMarquee />
        </Reveal>

        <Reveal delay={180}>
          <HeroMockup />
        </Reveal>
      </div>
    </section>
  )
}