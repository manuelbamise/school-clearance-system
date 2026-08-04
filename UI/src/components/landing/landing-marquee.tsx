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
    <div className="lp-marquee">
      <p className="lp-marquee-label">Trusted by 50+ universities</p>
      <div className="lp-marquee-viewport">
        <div className="lp-marquee-track">
          {chips.map((name, i) => (
            <span key={`${name}-${i}`} className="lp-marquee-chip">
              <span className="lp-marquee-mark">
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