import { useNavigate } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import Reveal from './reveal'
import { btnPrimary } from './landing-ui'

export default function LandingCta() {
  const navigate = useNavigate()

  return (
    <section className="relative overflow-hidden border-t border-lp-line bg-lp-surface py-20 max-[809px]:py-16">
      <div className="mx-auto max-w-[1200px] px-10 max-[809px]:px-5">
        <Reveal>
          <div className="relative overflow-hidden rounded-[40px] border border-lp-glow bg-lp-deep px-10 py-20 text-center max-[809px]:rounded-3xl max-[809px]:px-6 max-[809px]:py-12">
            <div className="pointer-events-none absolute -top-1/2 left-1/2 h-[500px] w-[700px] -translate-x-1/2 [background:radial-gradient(closest-side,rgba(37,99,235,0.2),transparent_70%)]" />
            <h2 className="relative mb-6 font-display text-[clamp(36px,4vw,45px)] font-medium leading-[1.2] tracking-[-0.02em] text-white">
              Ready to Graduate Without the Hassle?
            </h2>
            <p className="relative mx-auto mb-10 max-w-[480px] font-medium leading-[1.5] tracking-[-0.03em] text-lp-soft">
              Join 50+ universities already streamlining clearance with
              ClearPath. Set up takes less than a minute.
            </p>
            <button
              type="button"
              className={btnPrimary}
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
