import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { GraduationCap, Menu, X } from 'lucide-react'

const links = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Changelog', href: '#changelog' },
  { label: 'FAQ', href: '#faq' },
]

export default function LandingNav() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  const goToLogin = () => navigate({ to: '/login' })

  return (
    <>
      <nav className={`lp-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="lp-nav-inner">
          <a href="#top" className="lp-logo">
            <span className="lp-logo-icon">
              <GraduationCap size={18} strokeWidth={2.5} />
            </span>
            ClearPath
          </a>

          <div className="lp-nav-links">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="lp-nav-link">
                {l.label}
              </a>
            ))}
          </div>

          <button
            type="button"
            className="lp-btn lp-btn-primary lp-nav-cta"
            onClick={goToLogin}
          >
            Get Started
          </button>

          <button
            type="button"
            className="lp-nav-burger"
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>

      <div
        className={`lp-drawer-overlay ${drawerOpen ? 'open' : ''}`}
        onClick={() => setDrawerOpen(false)}
      />

      <aside className={`lp-drawer ${drawerOpen ? 'open' : ''}`} aria-hidden={!drawerOpen}>
        <div className="lp-drawer-head">
          <a href="#top" className="lp-logo" onClick={() => setDrawerOpen(false)}>
            <span className="lp-logo-icon">
              <GraduationCap size={18} strokeWidth={2.5} />
            </span>
            ClearPath
          </a>
          <button
            type="button"
            className="lp-drawer-close"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="lp-drawer-link"
            onClick={() => setDrawerOpen(false)}
          >
            {l.label}
          </a>
        ))}
        <button
          type="button"
          className="lp-btn lp-btn-primary lp-drawer-cta"
          onClick={() => {
            setDrawerOpen(false)
            goToLogin()
          }}
        >
          Get Started
        </button>
      </aside>
    </>
  )
}
