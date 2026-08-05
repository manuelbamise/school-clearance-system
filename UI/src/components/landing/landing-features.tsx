import {
  Shield,
  Zap,
  BarChart3,
  LayoutGrid,
  type LucideIcon,
} from 'lucide-react';
import Reveal from './reveal';
import { SectionHeader } from './landing-ui';

interface Feature {
  icon: LucideIcon;
  title: string;
  body: string;
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
];

const cardCls =
  'h-full rounded-3xl border border-lp-glow bg-lp-surface p-8 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-lp-blue/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3),0_0_40px_rgba(37,99,235,0.05)]';

export default function LandingFeatures() {
  return (
    <section
      className="relative bg-lp-black py-20 max-[809px]:py-16"
      id="features"
    >
      <div className="mx-auto max-w-[1200px] px-10 max-[809px]:px-5">
        <SectionHeader
          title="Why Choose ClearPath?"
          subtitle="Everything students and administrators need for a frictionless clearance process."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.4} className="h-full">
              <div className={cardCls}>
                <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-lp-line bg-lp-glass text-lp-blue">
                  <f.icon size={22} strokeWidth={1.8} />
                </span>
                <h4 className="mb-3 text-[clamp(18px,2vw,24px)] font-normal leading-[1.5] text-white">
                  {f.title}
                </h4>
                <p className="mt-3 text-sm font-normal leading-[1.4] text-lp-muted">
                  {f.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
