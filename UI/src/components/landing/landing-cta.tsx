import { useNavigate } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import Reveal from './reveal'

export default function LandingCta() {
  const navigate = useNavigate()

  return (
    <section className="lp-section lp-cta">
      <div className="lp-container">
        <Reveal>
          <div className="lp-cta-card">
            <h2 className="lp-h2" style={{ fontWeight: 500 }}>
              Ready to Graduate Without the Hassle?
            </h2>            <p className="lp-body">
              Join 50+ universities already streamlining clearance with
              ClearPath. Set up takes less than a minute.
            </p>
            <button
              type="button"
              className="lp-btn lp-btn-primary"
              onClick={() => navigate({ to: '/login' })}
            >
              Get Started Free
              <ArrowRight size={16} />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}