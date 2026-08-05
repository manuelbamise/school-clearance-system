import Reveal from './reveal';

const stats = [
  { value: '50+', label: 'Universities onboard' },
  { value: '24–48h', label: 'Average clearance time' },
  { value: '40%', label: 'Faster processing' },
  { value: '4.9/5', label: 'Average user rating' },
];

export default function LandingStats() {
  return (
    <section className="border-y border-lp-line bg-lp-deep">
      <div className="mx-auto max-w-[1200px] px-10 max-[809px]:px-5">
        <div className="grid grid-cols-2 gap-6 py-12 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.4}>
              <div className="text-center">
                <div className="mb-1.5 font-display text-[clamp(36px,4vw,48px)] font-medium tracking-[-0.02em] text-white">
                  {s.value}
                </div>
                <div className="text-sm font-normal text-lp-muted">
                  {s.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
