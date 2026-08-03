import { useState, type FormEvent } from 'react'
import Reveal from './reveal'

export default function LandingNewsletter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
  }

  return (
    <section className="lp-section lp-newsletter">
      <div className="lp-container">
        <Reveal>
          <div className="lp-newsletter-inner">
            <h2 className="lp-h2">
              Stay in the Loop
            </h2>
            <p className="lp-body" style={{ marginTop: 16 }}>
              Get the latest updates on new features, university partnerships,
              and clearance tips.
            </p>

            <form className="lp-newsletter-form" onSubmit={onSubmit}>
              <input
                type="email"
                className="lp-newsletter-input"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
              />
              <button type="submit" className="lp-btn lp-btn-gradient">
                Subscribe
              </button>
            </form>

            {subscribed ? (
              <p className="lp-newsletter-success">
                You\u2019re in! Check your inbox to confirm your subscription.
              </p>
            ) : (
              <p className="lp-newsletter-note">No spam. Unsubscribe anytime.</p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}