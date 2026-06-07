import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import StarfieldBackground from '@/components/three/StarfieldBackground'

const ABOUT_TITLE = 'who i am?'
const WHO_END_INDEX = 4

const CARD_ICONS = {
  rocket: (
    <svg viewBox="0 0 24 24">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
  layers: (
    <svg viewBox="0 0 24 24">
      <path d="M12 2 2 7l10 5 10-5-10-5z" />
      <path d="m2 17 10 5 10-5" />
      <path d="m2 12 10 5 10-5" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  cap: (
    <svg viewBox="0 0 24 24">
      <path d="M22 10 12 5 2 10l10 5 10-5z" />
      <path d="M6 12v5c0 1 2.5 3 6 3s6-2 6-3v-5" />
    </svg>
  ),
} as const

const ABOUT_CARDS = [
  {
    value: '3+',
    label: 'ACTIVE PROJECTS',
    detail: 'Building and shipping\nreal-world solutions',
    icon: 'rocket',
  },
  {
    value: 'FULL STACK',
    label: 'DEVELOPER',
    detail: 'React · Supabase · Svelte\nTypeScript · Node.js',
    icon: 'layers',
  },
  {
    value: 'DAVAO',
    label: 'PHILIPPINES',
    detail: 'Based in PH',
    icon: 'pin',
  },
  {
    value: '2026',
    label: 'GRADUATING',
    detail: 'Currently studying\nComputer Engineering',
    icon: 'cap',
  },
] as const

export default function AboutSection() {
  const ref = useRef<HTMLElement | null>(null)
  const [typedLength, setTypedLength] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const isComplete = typedLength === ABOUT_TITLE.length
    const isEmpty = typedLength === 0

    const timeout = window.setTimeout(() => {
      if (!isDeleting && isComplete) {
        setIsDeleting(true)
        return
      }

      if (isDeleting && isEmpty) {
        setIsDeleting(false)
        return
      }

      setTypedLength((current) => current + (isDeleting ? -1 : 1))
    }, isComplete || isEmpty ? 850 : isDeleting ? 95 : 140)

    return () => window.clearTimeout(timeout)
  }, [typedLength, isDeleting])

  const typedTitle = ABOUT_TITLE.slice(0, typedLength)
  const typedWho = typedTitle.slice(0, WHO_END_INDEX)
  const typedIam = typedTitle.slice(WHO_END_INDEX)

  return (
    <section id="about" ref={ref} className="about-section">
      <StarfieldBackground />

      <div className="about-overlay-copy">
        <motion.div
          className="about-eyebrow"
          aria-hidden="true"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          // 01 - ABOUT
        </motion.div>

        <motion.h2
          className="about-title"
          aria-label={ABOUT_TITLE}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          <span className="about-title-text about-title-text-placeholder" aria-hidden="true">
            <span>who </span>
            <span className="about-title-accent">i am?</span>
          </span>
          <span className="about-title-text about-title-text-animated">
            <span>{typedWho}</span>
            <span className="about-title-accent">{typedIam}</span>
          </span>
        </motion.h2>

        <motion.div
          className="about-body"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
        >
          <p>
            Computer Engineering student based in Davao City,<br />
            Philippines. I build production-grade web apps that<br />
            solve real problems - from transit routing systems to<br />
            internship management platforms.
          </p>
          <p>
            I care about real-world usability, not just pretty UIs.<br />
            I do firsthand field research - like visiting actual<br />
            bus terminals - to make sure what I build reflects how<br />
            people actually use things.
          </p>
        </motion.div>

        <motion.div
          className="about-info-list"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24 }}
        >
          <div className="about-info-row">
            <span className="about-info-icon" aria-hidden="true">
              <svg viewBox="0 0 32 32">
                <path d="m12 9-7 7 7 7M20 9l7 7-7 7M18 5l-4 22" />
              </svg>
            </span>
            <span className="about-info-label">STACK</span>
            <span className="about-info-value">React · TypeScript · Supabase · Svelte 5</span>
          </div>

          <div className="about-info-row">
            <span className="about-info-icon" aria-hidden="true">
              <svg viewBox="0 0 32 32">
                <path d="m9 11 6 5-6 5M17 22h7" />
              </svg>
            </span>
            <span className="about-info-label">CURRENTLY</span>
            <span className="about-info-value">Building MindaRide + portfolio</span>
          </div>

          <div className="about-info-row">
            <span className="about-info-icon about-info-icon-star" aria-hidden="true">
              <svg viewBox="0 0 32 32">
                <path d="M16 3.5l3.8 7.9 8.7 1.1-6.4 5.9 1.7 8.6L16 24.7 8.5 27l1.7-8.6-6.4-5.9 8.7-1.1z" />
              </svg>
            </span>
            <span className="about-info-label">INTERESTS</span>
            <span className="about-info-value">Web apps · Game dev · Transit tech</span>
          </div>
        </motion.div>
      </div>

      <div className="about-card-grid-overlay" aria-hidden="true">
        {ABOUT_CARDS.map((card, i) => (
          <motion.article
            key={card.label}
            className="about-card-copy"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <span className="about-card-copy-accent" aria-hidden="true" />
            <span className="about-card-copy-icon" aria-hidden="true">
              {CARD_ICONS[card.icon]}
            </span>
            <div className="about-card-copy-value">{card.value}</div>
            <div className="about-card-copy-label">{card.label}</div>
            <div className="about-card-copy-detail">
              {card.detail.split('\n').map((line) => (
                <span key={line}>{line}</span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>

      <motion.div
        className="about-terminal-line"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <span className="about-terminal-prompt" aria-hidden="true">&gt;_</span>
        <span className="about-terminal-divider" aria-hidden="true" />
        <span className="about-terminal-copy">Code is how I think. Build is how I solve.</span>
        <a href="#contact" className="about-terminal-cta">Let's build something great →</a>
      </motion.div>
    </section>
  )
}
