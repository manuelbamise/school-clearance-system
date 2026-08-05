import { useNavigate } from '@tanstack/react-router';
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
} from 'lucide-react';
import Reveal from './reveal';
import LandingLogoMarquee from './landing-marquee';
import { btnPrimary, btnSecondary } from './landing-ui';

/* ---------- Mockup: faithful app frame ---------- */

const sideItems: { label: string; icon: typeof FileText; active?: boolean }[] =
  [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Documents', icon: FileText, active: true },
    { label: 'Clearance', icon: ClipboardList },
    { label: 'Reports', icon: BarChart3 },
    { label: 'Profile', icon: User },
  ];

const statusCfg: Record<string, { label: string; cls: string }> = {
  approved: { label: 'Approved', cls: 'bg-emerald-500/10 text-emerald-500' },
  pending: { label: 'Pending', cls: 'bg-lp-gold/10 text-lp-gold' },
  rejected: { label: 'Rejected', cls: 'bg-red-400/10 text-red-400' },
};

const docRows = [
  {
    name: 'Academic Transcript',
    level: '500L',
    session: '2024/2025',
    to: 'Academic Unit',
    status: 'approved',
  },
  {
    name: 'Clearance Form',
    level: '500L',
    session: '2024/2025',
    to: 'Bursary Unit',
    status: 'pending',
  },
  {
    name: 'Identity Card',
    level: '500L',
    session: '2024/2025',
    to: 'Department Unit',
    status: 'rejected',
  },
];

function MockSidebar() {
  return (
    <div className="hidden w-[168px] flex-shrink-0 flex-col gap-[3px] border-r border-lp-line bg-black/20 p-2.5 max-[809px]:hidden">
      {sideItems.map((item) => (
        <div
          key={item.label}
          className={`flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[11px] font-medium ${
            item.active
              ? 'border border-lp-line bg-lp-glass text-white'
              : 'text-lp-muted'
          }`}
        >
          <item.icon size={13} strokeWidth={2} />
          {item.label}
        </div>
      ))}
    </div>
  );
}

function MockTable() {
  const headers = [
    'Document Name',
    'Level',
    'Session',
    'Submitted To',
    'Status',
  ];
  return (
    <div className="rounded-[14px] border border-lp-line bg-white/[0.025] p-3.5">
      <div className="mb-3 text-xs font-semibold tracking-[-0.02em] text-white">
        Past Uploads
      </div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {['All', 'Approved', 'Pending', 'Rejected'].map((f, i) => (
          <span
            key={f}
            className={`cursor-pointer rounded-full border px-[11px] py-1 text-[10px] font-medium ${
              i === 0
                ? 'border-transparent bg-gradient-to-r from-lp-blue to-lp-cyan font-bold text-black'
                : 'border-lp-line bg-transparent text-lp-muted'
            }`}
          >
            {f}
          </span>
        ))}
      </div>
      <div className="mb-3 flex items-center gap-2 rounded-[9px] border border-lp-line bg-black/25 px-[11px] py-[7px] text-[10px] text-lp-muted">
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        Search documents...
      </div>
      <table className="w-full border-collapse text-[11px]">
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="border-b border-lp-line px-1.5 py-2 text-left text-[9px] font-semibold uppercase tracking-[0.08em] text-lp-muted"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {docRows.map((row, ri) => {
            const s = statusCfg[row.status];
            const last = ri === docRows.length - 1;
            return (
              <tr key={row.name}>
                <td
                  className={`flex items-center gap-[7px] px-1.5 py-2.5 font-medium text-white ${
                    last ? '' : 'border-b border-white/[0.06]'
                  }`}
                >
                  <FileText size={12} className="flex-shrink-0 text-lp-blue" />
                  <span>{row.name}</span>
                </td>
                <td
                  className={`px-1.5 py-2.5 text-lp-soft ${last ? '' : 'border-b border-white/[0.06]'}`}
                >
                  {row.level}
                </td>
                <td
                  className={`px-1.5 py-2.5 text-lp-soft ${last ? '' : 'border-b border-white/[0.06]'}`}
                >
                  {row.session}
                </td>
                <td
                  className={`px-1.5 py-2.5 text-lp-soft ${last ? '' : 'border-b border-white/[0.06]'}`}
                >
                  {row.to}
                </td>
                <td
                  className={`px-1.5 py-2.5 ${last ? '' : 'border-b border-white/[0.06]'}`}
                >
                  <div className="flex flex-col items-start gap-1">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-[2px] text-[10px] font-semibold ${s.cls}`}
                    >
                      <span className="h-[5px] w-[5px] rounded-full bg-current" />
                      {s.label}
                    </span>
                    {row.status === 'rejected' && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-lp-line px-[7px] py-0.5 text-[9px] font-medium text-lp-muted">
                        <RotateCcw size={9} />
                        Resubmit
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-3 flex items-center justify-between gap-3 text-[10px] text-lp-muted">
        <span>Showing 1–3 of 3</span>
        <span className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-[7px] border border-lp-line px-2 py-[3px] text-[10px] font-medium text-lp-muted opacity-55">
            <ChevronLeft size={10} />
            Previous
          </span>
          <span className="text-[10px] text-lp-muted">Page 1 of 1</span>
          <span className="inline-flex items-center gap-1 rounded-[7px] border border-lp-line px-2 py-[3px] text-[10px] font-medium text-lp-muted opacity-55">
            Next
            <ChevronRight size={10} />
          </span>
        </span>
      </div>
    </div>
  );
}

function HeroMockup() {
  return (
    <div className="relative mx-auto mt-12 max-w-[900px]" id="lp-demo">
      <div className="relative overflow-hidden rounded-[24px] border border-lp-glow bg-lp-surface shadow-[0_0_120px_rgba(37,99,235,0.12),0_40px_80px_rgba(0,0,0,0.5)] animate-float [transform:perspective(1400px)_rotateX(5deg)_rotateY(-5deg)] after:absolute after:inset-x-0 after:top-0 after:h-px after:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent)] max-[809px]:[transform:none]">
        <div className="flex items-center gap-4 border-b border-lp-line bg-white/[0.02] px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-[22px] w-[22px] items-center justify-center rounded-[7px] bg-gradient-to-br from-lp-blue to-lp-cyan text-white">
              <GraduationCap size={13} strokeWidth={2.5} />
            </span>
            <span className="text-xs font-bold tracking-[-0.02em] text-white">
              ClearPath
            </span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-lp-line bg-lp-glass px-2.5 py-[3px] text-[10px] font-semibold text-lp-soft">
              <span className="h-[5px] w-[5px] rounded-full bg-lp-blue" />
              Student
            </span>
            <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-gradient-to-br from-lp-blue to-lp-cyan text-[10px] font-bold text-white">
              AO
            </span>
          </div>
        </div>
        <div className="flex min-h-[360px]">
          <MockSidebar />
          <div className="flex min-w-0 flex-1 flex-col gap-3.5 px-5 py-[18px]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[15px] font-bold leading-[1.2] tracking-[-0.02em] text-white">
                  Documents
                </div>
                <div className="mt-[3px] text-[10px] text-lp-muted">
                  Upload and track your submitted documents.
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-[10px] bg-gradient-to-r from-lp-blue to-lp-cyan px-3.5 py-2 text-[11px] font-bold text-black shadow-[0_6px_18px_rgba(37,99,235,0.25)]">
                <Upload size={11} />
                Upload Document
              </span>
            </div>
            <MockTable />
          </div>
        </div>
      </div>

      <div
        className="absolute -left-6 bottom-10 z-[3] flex items-center gap-3 rounded-[14px] border border-lp-glow bg-lp-surface/95 p-3.5 shadow-[0_21px_60px_rgba(0,0,0,0.43),0_0_40px_rgba(34,197,94,0.06)] backdrop-blur-[10px] animate-float max-[1199px]:-left-2 max-[809px]:bottom-3 max-[809px]:left-3 max-[809px]:right-3"
        style={{ animationDelay: '1.6s' }}
      >
        <span className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
          <CheckCircle2 size={14} />
        </span>
        <div>
          <div className="text-[11px] font-semibold tracking-[-0.01em] text-white">
            Academic transcript approved
          </div>
          <div className="mt-px text-[9px] text-lp-muted">
            Academic Unit · just now
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Landing hero section ---------- */

const shapeBase =
  'absolute rounded-[18px] border border-white/40 bg-gradient-to-br from-lp-blue/[0.08] to-lp-gold/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_60px_rgba(37,99,235,0.08)] backdrop-blur-[1px] lp-shape';

export default function LandingHero() {
  const navigate = useNavigate();

  return (
    <section
      className="relative overflow-hidden bg-lp-black pt-40 pb-20 max-[809px]:pt-[140px]"
      id="top"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-[560px] w-[820px] -translate-x-1/2 [background:radial-gradient(closest-side,rgba(37,99,235,0.15),rgba(37,99,235,0.04)_45%,transparent_72%)]" />
      <div className="pointer-events-none absolute inset-0 z-0">
        <span
          className={`${shapeBase} right-[6%] top-[120px] h-[72px] w-[120px] rotate-[24deg] animate-bob`}
        />
        <span
          className={`${shapeBase} left-[3%] top-[300px] h-[148px] w-[220px] -rotate-[18deg] bg-gradient-to-br from-lp-gold/[0.07] to-lp-blue/[0.05] animate-bob`}
          style={{ animationDelay: '2.2s', animationDuration: '11s' }}
        />
        <span
          className={`${shapeBase} bottom-[120px] right-[8%] h-[220px] w-[340px] rotate-[14deg] bg-gradient-to-br from-lp-blue/[0.1] to-lp-blue/[0.03] animate-bob`}
          style={{ animationDelay: '4.1s', animationDuration: '13s' }}
        />
        <span
          className={`${shapeBase} right-[4%] top-[26%] h-[96px] w-[150px] rotate-[22deg] bg-gradient-to-br from-lp-blue/[0.09] to-lp-cyan/[0.04] animate-bob`}
          style={{ animationDelay: '3.3s', animationDuration: '12s' }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1200px] px-10 max-[809px]:px-5">
        <Reveal>
          <div className="relative z-10 mx-auto flex max-w-[780px] flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-lp-line bg-lp-glass px-4 py-1.5 text-sm font-normal text-lp-muted backdrop-blur-[8px] [text-shadow:0_1px_2px_rgba(0,0,0,0.32)]">
              <ShieldCheck size={14} className="text-lp-blue" />
              Student Clearance Made Simple
            </span>
            <h1 className="m-0 mt-6 text-center font-display text-[clamp(46px,6vw,82px)] font-medium leading-[1.2] tracking-[-0.03em] text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.32)]">
              Streamline Your Clearance.
              <br />
              Graduate Without the Hassle.
            </h1>
            <p className="mx-auto mt-6 max-w-[640px] text-[clamp(16px,1.5vw,20px)] font-medium leading-[1.5] tracking-[-0.03em] text-lp-soft">
              ClearPath automates document verification, status tracking, and
              approvals — so students and administrators save hours of
              paperwork.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4 max-[809px]:w-full max-[809px]:flex-col max-[809px]:items-stretch">
              <button
                type="button"
                className={btnPrimary}
                onClick={() => navigate({ to: '/login' })}
              >
                Get Started Free
                <ArrowRight size={16} />
              </button>
              <a href="#lp-demo" className={btnSecondary}>
                <Play size={16} fill="currentColor" />
                Watch Demo
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <LandingLogoMarquee />
        </Reveal>

        <Reveal delay={0.5}>
          <HeroMockup />
        </Reveal>
      </div>
    </section>
  );
}
