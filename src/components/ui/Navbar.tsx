import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ljDevLogo from '@/assets/brand/lj-dev-logo.png'
import { NAV_LINKS } from '@/data/portfolio'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('#home')
  const [mobileOpen, setMobileOpen] = useState(false)
  const navbarBackground = '#050505'

  useEffect(() => {
    const sectionIds = NAV_LINKS.map((link) => link.href.slice(1))

    const updateActiveSection = () => {
      const scrollY = window.scrollY
      const offset = 140
      let current = '#home'

      for (const id of sectionIds) {
        const section = document.getElementById(id)
        if (!section) continue
        const top = section.offsetTop - offset
        const bottom = top + section.offsetHeight
        if (scrollY >= top && scrollY < bottom) {
          current = `#${id}`
        }
      }

      setActive(current)
      setScrolled(scrollY > 40)
    }

    window.addEventListener('scroll', updateActiveSection, { passive: true })
    updateActiveSection()
    return () => window.removeEventListener('scroll', updateActiveSection)
  }, [])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleNav = (href: string) => {
    setActive(href)
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) {
      const top = window.scrollY + el.getBoundingClientRect().top - 80
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          borderBottom: scrolled ? '1px solid #1e1e28' : '1px solid rgba(30,30,40,0.45)',
          background: navbarBackground,
          backdropFilter: 'blur(14px)',
          transition: 'border-color 0.3s ease',
          padding: '0 clamp(18px, 3.6vw, 56px)',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); handleNav('#home') }}
            className="nav-logo"
            aria-label="LJ.DEV home"
          >
            <img src={ljDevLogo} alt="LJ.DEV" className="nav-logo-image" />
          </a>

          {/* Desktop nav */}
          <nav className="nav-links" aria-label="Main navigation" style={{ display: 'flex', gap: '54px', alignItems: 'center' }}>
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNav(link.href) }}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '15px',
                  letterSpacing: '1px',
                  color: active === link.href ? 'var(--amber)' : '#555566',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  whiteSpace: 'nowrap',
                  position: 'relative',
                  padding: '31px 0',
                }}
                onMouseEnter={(e) => {
                  if (active !== link.href)
                    (e.target as HTMLElement).style.color = '#888896'
                }}
                onMouseLeave={(e) => {
                  if (active !== link.href)
                    (e.target as HTMLElement).style.color = '#555566'
                }}
              >
                {link.label}
                {active === link.href && (
                  <motion.span
                    layoutId="nav-active-line"
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: '3px',
                      background: 'var(--amber)',
                    }}
                  />
                )}
              </a>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a
              href="#contact"
              className="nav-cta"
              onClick={(e) => { e.preventDefault(); handleNav('#contact') }}
            >
              <span>LET&apos;S TALK</span>
              <span aria-hidden="true">&rarr;</span>
            </a>

            {/* Fix #5: Hamburger button — mobile only */}
            <button
              type="button"
              className="nav-hamburger"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              <span className={`nav-hamburger-bar ${mobileOpen ? 'nav-hamburger-bar--top-open' : ''}`} />
              <span className={`nav-hamburger-bar ${mobileOpen ? 'nav-hamburger-bar--mid-open' : ''}`} />
              <span className={`nav-hamburger-bar ${mobileOpen ? 'nav-hamburger-bar--bot-open' : ''}`} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Fix #5: Mobile slide-down menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: '80px',
              left: 0,
              right: 0,
              zIndex: 49,
              background: '#050505',
              borderBottom: '1px solid #1e1e28',
              padding: '12px 0 24px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNav(link.href) }}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '15px',
                  letterSpacing: '1px',
                  color: active === link.href ? 'var(--amber)' : '#888896',
                  textDecoration: 'none',
                  padding: '14px clamp(18px, 3.6vw, 56px)',
                  borderLeft: active === link.href ? '3px solid var(--amber)' : '3px solid transparent',
                  transition: 'color 0.15s ease, border-color 0.15s ease',
                }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); handleNav('#contact') }}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '13px',
                letterSpacing: '1px',
                color: 'var(--amber)',
                textDecoration: 'none',
                padding: '14px clamp(18px, 3.6vw, 56px)',
                marginTop: '8px',
                borderTop: '1px solid #1e1e28',
              }}
            >
              LET&apos;S TALK &rarr;
            </a>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Backdrop to close menu on outside click */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 48,
              background: 'rgba(0,0,0,0.5)',
            }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </>
  )
}
