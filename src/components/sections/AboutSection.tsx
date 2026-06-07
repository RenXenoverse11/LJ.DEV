import { useEffect, useRef, useState } from 'react'
import StarfieldBackground from '@/components/three/StarfieldBackground'

const ABOUT_TITLE = 'who i am?'
const WHO_END_INDEX = 4

const ABOUT_CARDS = [
  {
    value: '3+',
    label: 'ACTIVE PROJECTS',
    detail: 'Building and shipping\nreal-world solutions',
  },
  {
    value: 'FULL STACK',
    label: 'DEVELOPER',
    detail: 'React · Supabase · Svelte\nTypeScript · Node.js',
  },
  {
    value: 'DAVAO',
    label: 'PHILIPPINES',
    detail: 'Based in PH',
  },
  {
    value: '2026',
    label: 'GRADUATING',
    detail: 'Currently studying\nComputer Engineering',
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
        <div className="about-eyebrow" aria-hidden="true">
          // 01 - ABOUT
        </div>

        <h2 className="about-title" aria-label={ABOUT_TITLE}>
          <span className="about-title-text about-title-text-placeholder" aria-hidden="true">
            <span>who </span>
            <span className="about-title-accent">i am?</span>
          </span>
          <span className="about-title-text about-title-text-animated">
            <span>{typedWho}</span>
            <span className="about-title-accent">{typedIam}</span>
          </span>
        </h2>

        <div className="about-body">
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
        </div>

        <div className="about-info-list">
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
        </div>
      </div>

      <div className="about-card-grid-overlay" aria-hidden="true">
        {ABOUT_CARDS.map((card) => (
          <article key={card.label} className="about-card-copy">
            <div className="about-card-copy-value">{card.value}</div>
            <div className="about-card-copy-label">{card.label}</div>
            <div className="about-card-copy-detail">
              {card.detail.split('\n').map((line) => (
                <span key={line}>{line}</span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="about-terminal-line">
        <span className="about-terminal-prompt" aria-hidden="true">&gt;_</span>
        <span className="about-terminal-divider" aria-hidden="true" />
        <span className="about-terminal-copy">Code is how I think. Build is how I solve.</span>
        <a href="#contact" className="about-terminal-cta">Let's build something great →</a>
      </div>
    </section>
  )
}
