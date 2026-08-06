import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'The bursary, department, and academic unit sign-offs all happened in one place — I finished my clearance in two days instead of two weeks.',
    name: 'Amina Yusuf',
    role: 'Final-year student',
    initials: 'AY',
  },
  {
    quote:
      'Every unit gets a clear queue. We no longer chase students for missing signatures — the system does that for us.',
    name: 'David Okafor',
    role: 'Bursary officer',
    initials: 'DO',
  },
  {
    quote:
      'One dashboard to review every clearance request. The handoffs between units are finally traceable.',
    name: 'Dr. Sandra Mensah',
    role: 'Academic unit head',
    initials: 'SM',
  },
];

export default function LoginTestimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const active = TESTIMONIALS[index];

  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % TESTIMONIALS.length),
      6000
    );
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div
      className="flex flex-col gap-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="What people say about Clearance"
    >
      <span
        aria-hidden="true"
        className="font-display text-5xl leading-none text-primary/40"
      >
        “
      </span>

      <div className="relative flex min-h-[150px] items-start">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <p className="text-[15px] leading-relaxed text-white/80">
              {active.quote}
            </p>
            <figcaption className="mt-5 flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full gradient-primary text-xs font-semibold text-white">
                {active.initials}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-white">
                  {active.name}
                </span>
                <span className="block text-xs text-white/50">
                  {active.role}
                </span>
              </span>
            </figcaption>
          </motion.blockquote>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-1.5">
        {TESTIMONIALS.map((t, i) => (
          <button
            key={t.name}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show testimonial from ${t.name}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index
                ? 'w-6 bg-primary'
                : 'w-1.5 bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
