import Reveal from './reveal'

const stats = [
  { value: '50+', label: 'Universities onboard' },
  { value: '24–48h', label: 'Average clearance time' },
  { value: '40%', label: 'Faster processing' },
  { value: '4.9/5', label: 'Average user rating' },
]

export default function LandingStats() {
  return (
    <section className="lp-stats">
      <div className="lp-container">
        <div className="lp-stats-grid">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 100}>
              <div className="lp-stat">
                <div className="lp-stat-value">{s.value}</div>
                <div className="lp-stat-label">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
