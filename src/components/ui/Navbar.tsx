import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ljDevLogo from '@/assets/brand/lj-dev-logo.png'
import { NAV_LINKS } from '@/data/portfolio'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('#home')
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

    const onScroll = () => updateActiveSection()
    window.addEventListener('scroll', onScroll, { passive: true })
    updateActiveSection()

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (href: string) => {
    setActive(href)
    const el = document.querySelector(href)
    if (el) {
      const top = window.scrollY + el.getBoundingClientRect().top - 80
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
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
        transition: 'all 0.3s ease',
        padding: '0 clamp(18px, 3.6vw, 56px)',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 'none',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: '32px',
        }}
      >
        <div className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); handleNav('#home') }}
            className="nav-logo"
            aria-label="LJ.DEV home"
          >
            <img src={ljDevLogo} alt="LJ.DEV" className="nav-logo-image" />
          </a>
        </div>

        <div className="nav-right">
          {/* Desktop nav */}
          <nav className="nav-links" style={{ display: 'flex', gap: '54px', alignItems: 'center' }}>
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

          <a
            href="#contact"
            className="nav-cta"
            onClick={(e) => { e.preventDefault(); handleNav('#contact') }}
          >
            <span>LET&apos;S TALK</span>
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </motion.header>
  )
}
