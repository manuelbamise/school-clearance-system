import { useState, type FormEvent } from 'react'
import Reveal from './reveal'
import { btnGradient } from './landing-ui'

export default function LandingNewsletter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
  }

  return (
    <section className="bg-gradient-to-b from-black to-lp-surface py-20 max-[809px]:py-16">
      <div className="mx-auto max-w-[1200px] px-10 max-[809px]:px-5">
        <Reveal>
          <div className="mx-auto max-w-[600px] text-center">
            <h2 className="m-0 font-display text-[clamp(36px,4vw,45px)] font-normal leading-[1.2] tracking-[-0.02em] text-white">
              Stay in the Loop
            </h2>
            <p className="mt-4 font-medium leading-[1.5] tracking-[-0.03em] text-lp-soft">
              Get the latest updates on new features, university partnerships,
              and clearance tips.
            </p>

            <form
              className="mt-10 flex flex-wrap justify-center gap-3 max-[809px]:flex-col max-[809px]:items-stretch"
              onSubmit={onSubmit}
            >
              <input
                type="email"
                className="w-full max-w-[400px] rounded-xl border border-lp-glow bg-lp-surface px-5 py-4 font-sans text-base text-white outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-lp-muted focus:border-lp-blue focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] max-[809px]:max-w-full"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
              />
              <button type="submit" className={btnGradient}>
                Subscribe
              </button>
            </form>

            {subscribed ? (
              <p className="mt-6 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-5 py-4 text-[15px] text-[#6ee7a0]">
                You\u2019re in! Check your inbox to confirm your subscription.
              </p>
            ) : (
              <p className="mt-4 text-sm text-lp-muted">No spam. Unsubscribe anytime.</p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
