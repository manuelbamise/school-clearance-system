import Reveal from './reveal';
import { SectionHeader } from './landing-ui';

type ChangeType = 'feat' | 'fix' | 'perf' | 'refactor';

interface Change {
  type: ChangeType;
  date: string;
  message: string;
}

const changes: Change[] = [
  {
    type: 'fix',
    date: 'Aug 04, 2026',
    message: 'first revamp of the landing page',
  },
  { type: 'feat', date: 'Aug 03, 2026', message: 'add marketing landing page' },
  {
    type: 'feat',
    date: 'Aug 03, 2026',
    message: 'integrate UI with backend APIs across all roles',
  },
  {
    type: 'feat',
    date: 'Aug 03, 2026',
    message: 'wire frontend to real API auth and add typed api client layer',
  },
  {
    type: 'feat',
    date: 'Aug 03, 2026',
    message: 'add per-role dashboard metrics entity',
  },
  {
    type: 'feat',
    date: 'Aug 02, 2026',
    message: 'add bursary unit clearance, report, and document pages',
  },
  {
    type: 'feat',
    date: 'Aug 02, 2026',
    message: 'add department unit clearance, report, and document pages',
  },
  {
    type: 'feat',
    date: 'Jul 14, 2026',
    message: 'build multi-role E-School Platform with dashboards and profiles',
  },
];

const dotCls: Record<ChangeType, string> = {
  feat: 'bg-lp-blue text-lp-blue',
  fix: 'bg-emerald-500 text-emerald-500',
  perf: 'bg-lp-gold text-lp-gold',
  refactor: 'bg-lp-cyan text-lp-cyan',
};

const particles = [
  {
    left: '6%',
    top: '82%',
    size: 3,
    type: 'blue',
    delay: 0,
    duration: 16,
    drift: 26,
    opacity: 0.55,
  },
  {
    left: '12%',
    top: '30%',
    size: 4,
    type: 'gold',
    delay: 3.2,
    duration: 19,
    drift: -30,
    opacity: 0.5,
  },
  {
    left: '18%',
    top: '60%',
    size: 2,
    type: 'cyan',
    delay: 1.4,
    duration: 22,
    drift: 18,
    opacity: 0.6,
  },
  {
    left: '24%',
    top: '12%',
    size: 3,
    type: 'blue',
    delay: 5.1,
    duration: 17,
    drift: -22,
    opacity: 0.45,
  },
  {
    left: '33%',
    top: '74%',
    size: 2,
    type: 'gold',
    delay: 2.3,
    duration: 20,
    drift: 32,
    opacity: 0.5,
  },
  {
    left: '41%',
    top: '38%',
    size: 5,
    type: 'blue',
    delay: 7.4,
    duration: 24,
    drift: -18,
    opacity: 0.4,
  },
  {
    left: '49%',
    top: '88%',
    size: 3,
    type: 'cyan',
    delay: 4.6,
    duration: 18,
    drift: 24,
    opacity: 0.5,
  },
  {
    left: '57%',
    top: '22%',
    size: 2,
    type: 'gold',
    delay: 6.2,
    duration: 21,
    drift: -28,
    opacity: 0.55,
  },
  {
    left: '63%',
    top: '66%',
    size: 4,
    type: 'blue',
    delay: 1.9,
    duration: 23,
    drift: 20,
    opacity: 0.4,
  },
  {
    left: '71%',
    top: '10%',
    size: 3,
    type: 'cyan',
    delay: 8.3,
    duration: 19,
    drift: -24,
    opacity: 0.5,
  },
  {
    left: '78%',
    top: '52%',
    size: 2,
    type: 'gold',
    delay: 3.8,
    duration: 26,
    drift: 30,
    opacity: 0.45,
  },
  {
    left: '84%',
    top: '80%',
    size: 4,
    type: 'blue',
    delay: 5.7,
    duration: 20,
    drift: -20,
    opacity: 0.5,
  },
  {
    left: '90%',
    top: '28%',
    size: 3,
    type: 'cyan',
    delay: 2.8,
    duration: 22,
    drift: 22,
    opacity: 0.55,
  },
  {
    left: '95%',
    top: '68%',
    size: 2,
    type: 'blue',
    delay: 7.9,
    duration: 18,
    drift: -26,
    opacity: 0.45,
  },
];

const particleCls: Record<string, string> = {
  blue: 'bg-lp-blue shadow-[0_0_8px_1px_rgba(37,99,235,0.45)]',
  gold: 'bg-lp-gold shadow-[0_0_8px_1px_rgba(230,184,102,0.4)]',
  cyan: 'bg-lp-cyan shadow-[0_0_8px_1px_rgba(34,211,238,0.35)]',
};

export default function LandingChangelog() {
  return (
    <section
      className="relative overflow-hidden bg-lp-black py-20 max-[809px]:py-16"
      id="changelog"
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {particles.map((p, i) => (
          <span
            key={i}
            className={`absolute rounded-full ${particleCls[p.type]} animate-rise`}
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
      <div className="relative z-10 mx-auto max-w-[1200px] px-10 max-[809px]:px-5">
        <SectionHeader
          title="What&#39;s New"
          subtitle="Latest updates and improvements to ClearPath."
        />

        <div className="mx-auto max-w-[800px]">
          {changes.map((c, i) => (
            <Reveal key={`${c.date}-${i}`} delay={i < 4 ? i * 0.4 : 0}>
              <div
                className={`grid grid-cols-[128px_1fr] gap-6 border-b border-lp-line py-5 max-[809px]:grid-cols-1 max-[809px]:gap-3 ${
                  i === 0 ? 'pt-0' : ''
                } ${i === changes.length - 1 ? 'border-b-0' : ''}`}
              >
                <span className="h-fit whitespace-nowrap rounded-lg border border-lp-line bg-lp-glass px-3 py-1 text-sm font-normal text-lp-muted">
                  {c.date}
                </span>
                <div className="flex items-center gap-3 text-[15px] font-medium leading-[1.5] tracking-[-0.02em] text-lp-soft">
                  <span
                    className={`h-2.5 w-2.5 flex-shrink-0 rounded-full shadow-[0_0_12px_currentColor] ${dotCls[c.type]}`}
                  />
                  <span>{c.message}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
