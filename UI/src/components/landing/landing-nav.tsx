import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { GraduationCap, Menu, X } from 'lucide-react'
import { btnPrimary } from './landing-ui'

const links = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Changelog', href: '#changelog' },
  { label: 'FAQ', href: '#faq' },
]

const logoCls =
  'flex items-center gap-2.5 font-display text-xl font-bold tracking-[-0.02em] text-white no-underline'

const logoIconCls =
  'flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-lp-blue to-lp-cyan text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)]'

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
      <nav
        className={`fixed inset-x-0 top-0 z-50 border-b border-transparent bg-lp-surface/50 backdrop-blur-[10px] transition-[background,border-color] duration-300 ${
          scrolled ? 'border-lp-line bg-lp-surface/80' : ''
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between gap-6 px-10 max-[809px]:px-5">
          <a href="#top" className={logoCls}>
            <span className={logoIconCls}>
              <GraduationCap size={18} strokeWidth={2.5} />
            </span>
            ClearPath
          </a>

          <div className="hidden items-center gap-8 min-[810px]:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="relative pb-0.5 text-sm font-medium text-lp-soft no-underline transition-colors duration-200 hover:text-white after:absolute after:left-0 after:-bottom-[2px] after:h-px after:w-0 after:bg-white after:transition-[width] after:duration-300 hover:after:w-full"
              >
                {l.label}
              </a>
            ))}
          </div>

          <button
            type="button"
            className={`${btnPrimary} px-5 py-2.5 text-sm max-[809px]:hidden`}
            onClick={goToLogin}
          >
            Get Started
          </button>

          <button
            type="button"
            className="hidden h-[52px] w-[52px] items-center justify-center rounded-xl border border-lp-line bg-transparent text-white transition-colors hover:bg-lp-glass max-[809px]:flex"
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-[60] bg-black/60 opacity-0 backdrop-blur-sm transition-[opacity,visibility] duration-300 ${
          drawerOpen ? 'visible opacity-100' : 'invisible'
        }`}
        onClick={() => setDrawerOpen(false)}
      />

      <aside
        className={`fixed bottom-0 right-0 top-0 z-[61] flex w-[min(340px,85vw)] flex-col gap-2 border-l border-lp-line bg-lp-surface p-6 shadow-[0_21px_60px_rgba(0,0,0,0.43)] transition-transform duration-300 ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!drawerOpen}
      >
        <div className="mb-6 flex items-center justify-between">
          <a href="#top" className={logoCls} onClick={() => setDrawerOpen(false)}>
            <span className={logoIconCls}>
              <GraduationCap size={18} strokeWidth={2.5} />
            </span>
            ClearPath
          </a>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-lp-line bg-transparent text-white"
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
            className="rounded-xl px-4 py-3 text-base font-medium text-lp-soft no-underline transition-colors hover:bg-lp-glass hover:text-white"
            onClick={() => setDrawerOpen(false)}
          >
            {l.label}
          </a>
        ))}
        <button
          type="button"
          className={`${btnPrimary} mt-4 w-full`}
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
