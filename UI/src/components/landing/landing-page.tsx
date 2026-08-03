import LandingNav from './landing-nav'
import LandingHero from './landing-hero'
import LandingStats from './landing-stats'
import LandingFeatures from './landing-features'
import LandingHowItWorks from './landing-how-it-works'
import LandingChangelog from './landing-changelog'
import LandingFaq from './landing-faq'
import LandingNewsletter from './landing-newsletter'
import LandingCta from './landing-cta'
import LandingFooter from './landing-footer'
import '@/landing.css'

export default function LandingPage() {
  return (
    <div className="landing">
      <LandingNav />
      <main>
        <LandingHero />
        <LandingStats />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingChangelog />
        <LandingFaq />
        <LandingNewsletter />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  )
}