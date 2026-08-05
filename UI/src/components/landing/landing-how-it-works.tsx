import Reveal from './reveal';
import { SectionHeader } from './landing-ui';

const steps = [
  {
    title: 'Create Your Account',
    body: 'Sign in with your student credentials and open a clearance session in seconds.',
  },
  {
    title: 'Upload Your Documents',
    body: 'Drag and drop transcripts, IDs, and forms. ClearPath verifies them automatically.',
  },
  {
    title: 'Track Real-Time Progress',
    body: 'Follow each document through every department on your live dashboard.',
  },
  {
    title: 'Get Fully Cleared',
    body: 'Receive instant approval notifications and download your clearance certificate.',
  },
];

const stepCardCls =
  'relative h-full rounded-3xl border border-lp-line bg-lp-surface p-10 px-8 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-lp-blue/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3),0_0_40px_rgba(37,99,235,0.05)]';

export default function LandingHowItWorks() {
  return (
    <section
      className="relative overflow-hidden bg-lp-deep py-20 max-[809px]:py-16"
      id="how-it-works"
    >
      <div className="lp-how-grid" />
      <div className="relative z-10 mx-auto max-w-[1200px] px-10 max-[809px]:px-5">
        <SectionHeader
          title="How It Works"
          subtitle="From upload to approval in four simple steps."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.4} className="h-full">
              <div className={stepCardCls}>
                <span className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-lp-blue to-lp-cyan text-base font-bold text-black shadow-[0_6px_18px_rgba(37,99,235,0.28)]">
                  {i + 1}
                </span>
                <h4 className="mb-3 text-[clamp(18px,2vw,24px)] font-normal leading-[1.5] text-white">
                  {s.title}
                </h4>
                <p className="mt-3 text-sm font-normal leading-[1.4] text-lp-muted">
                  {s.body}
                </p>
                {i < steps.length - 1 && (
                  <span className="absolute left-[calc(100%+8px)] top-[60px] hidden h-px w-6 bg-lp-line xl:block" />
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
