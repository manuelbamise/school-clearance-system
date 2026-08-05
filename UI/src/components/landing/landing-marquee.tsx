import { GraduationCap } from 'lucide-react'

const universities = [
  'Greenfield University',
  'Saint Augustine College',
  'Kingston Academy',
  'Northgate University',
  'Fairmont College',
  'Westfield Institute',
  'Hillcrest University',
  'Brookfield State',
  'Cardinal Heights',
  'Riverside Academy',
]

export default function LandingLogoMarquee() {
  const chips = [...universities, ...universities]

  return (
    <div className="mt-14 w-full text-center">
      <p className="mb-[22px] text-[13px] font-medium uppercase tracking-[0.12em] text-lp-muted">
        Trusted by 50+ universities
      </p>
      <div className="overflow-hidden [-webkit-mask-image:linear-gradient(90deg,transparent,#000_14%,#000_86%,transparent)] [mask-image:linear-gradient(90deg,transparent,#000_14%,#000_86%,transparent)]">
        <div className="flex w-max items-center gap-[72px] animate-marquee">
          {chips.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="inline-flex items-center gap-2.5 whitespace-nowrap font-display text-[17px] font-semibold tracking-[-0.02em] text-[#9aa3b5] opacity-85 grayscale transition-opacity hover:opacity-100"
            >
              <span className="flex h-[26px] w-[26px] items-center justify-center rounded-lg bg-gradient-to-br from-[#2f3950] to-[#232b3c] text-[#9aa3b5]">
                <GraduationCap size={14} strokeWidth={2.2} />
              </span>
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
