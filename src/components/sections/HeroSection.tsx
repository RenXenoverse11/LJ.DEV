import { motion } from 'framer-motion'
import GlobeField from '@/components/three/GlobeField'
import StarfieldBackground from '@/components/three/StarfieldBackground'
import { SOCIALS as PORTFOLIO_SOCIALS } from '@/data/portfolio'

type IconType =
  | 'bolt'
  | 'code'
  | 'shield'
  | 'user'
  | 'terminal'
  | 'rocket'
  | 'cup'
  | 'github'
  | 'linkedin'
  | 'upwork'
  | 'facebook'
  | 'mail'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.62, delay, ease: 'easeOut' },
})

const FEATURES: Array<{
  icon: IconType
  title: string
  description: string
}> = [
  {
    icon: 'bolt',
    title: 'Performance Focused',
    description: 'I build fast, optimized, and scalable applications.',
  },
  {
    icon: 'code',
    title: 'Clean & Maintainable Code',
    description: "Writing clean code that's easy to maintain and scale.",
  },
  {
    icon: 'shield',
    title: 'Secure by Design',
    description: 'Implementing best practices to keep applications secure.',
  },
  {
    icon: 'user',
    title: 'User Experience First',
    description: 'Creating intuitive and engaging experiences users love.',
  },
]

const STATS: Array<{
  icon: IconType
  value: string
  label: string
}> = [
  { icon: 'terminal', value: '20+', label: 'Projects Completed' },
  { icon: 'rocket', value: '5+', label: 'Years of Experience' },
  { icon: 'code', value: '15+', label: 'Technologies' },
  { icon: 'cup', value: '∞', label: 'Passion for Building' },
]

// Fix #9: map from shared SOCIALS so there's a single source of truth
const LABEL_TO_ICON: Record<string, IconType> = {
  GitHub: 'github',
  LinkedIn: 'linkedin',
  Upwork: 'upwork',
  Email: 'mail',
  Facebook: 'facebook',
}

const SOCIALS = PORTFOLIO_SOCIALS.map((s) => ({
  icon: (LABEL_TO_ICON[s.label] ?? 'mail') as IconType,
  label: s.label,
  href: s.href,
}))

const TECH_STACK = [
  { name: 'React', icon: 'https://cdn.simpleicons.org/react/61DAFB', href: 'https://react.dev/' },
  { name: 'TypeScript', icon: 'https://cdn.simpleicons.org/typescript/3178C6', href: 'https://www.typescriptlang.org/' },
  { name: 'Svelte', icon: 'https://cdn.simpleicons.org/svelte/FF3E00', href: 'https://svelte.dev/' },
  { name: 'Angular', icon: 'https://cdn.simpleicons.org/angular/DD0031', href: 'https://angular.dev/' },
  { name: 'jQuery', icon: 'https://cdn.simpleicons.org/jquery/0769AD', href: 'https://jquery.com/' },
  { name: 'Tailwind CSS', icon: 'https://cdn.simpleicons.org/tailwindcss/06B6D4', href: 'https://tailwindcss.com/' },
  { name: 'Node.js', icon: 'https://cdn.simpleicons.org/nodedotjs/5FA04E', href: 'https://nodejs.org/' },
  { name: 'Supabase', icon: 'https://cdn.simpleicons.org/supabase/3FCF8E', href: 'https://supabase.com/' },
  { name: 'Vercel', icon: 'https://cdn.simpleicons.org/vercel/E8E8E8', href: 'https://vercel.com/' },
  { name: 'GitHub', icon: 'https://cdn.simpleicons.org/github/E8E8E8', href: 'https://github.com/' },
]

function HeroIcon({ type }: { type: IconType }) {
  if (type === 'bolt') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M18 3 7 18h8l-1 11 11-16h-8l1-10Z" />
      </svg>
    )
  }

  if (type === 'code') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="m12 9-7 7 7 7M20 9l7 7-7 7M18 5l-4 22" />
      </svg>
    )
  }

  if (type === 'shield') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 4 26 8v7c0 6.2-4.2 10.6-10 13-5.8-2.4-10-6.8-10-13V8l10-4Z" />
      </svg>
    )
  }

  if (type === 'user') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="11" r="5" />
        <path d="M6 28c1.6-6.2 4.8-9.2 10-9.2s8.4 3 10 9.2" />
      </svg>
    )
  }

  if (type === 'terminal') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <rect x="5" y="7" width="22" height="18" rx="2" />
        <path d="m10 14 4 3-4 3M16 21h6" />
      </svg>
    )
  }

  if (type === 'rocket') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M19 4c4.4 1 7 3.6 8 8l-8 8-7-7 7-9Z" />
        <path d="m12 13-5 1-2 5 7-1M19 20l-1 7-5 2 1-5M9 23l-4 4" />
        <circle cx="20" cy="11" r="2.2" />
      </svg>
    )
  }

  if (type === 'cup') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M8 9h14v9a7 7 0 0 1-14 0V9ZM22 12h3a3 3 0 0 1 0 6h-3" />
        <path d="M10 26h10M11 5v2M16 5v2M21 5v2" />
      </svg>
    )
  }

  if (type === 'github') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M12 27c-5 1.5-5-2.5-7-3m14 6v-4.1c0-1.2.4-2 1-2.6 3.4-.4 7-1.7 7-7.5 0-1.7-.6-3.1-1.7-4.3.2-.5.7-2.2-.2-4.4 0 0-1.4-.4-4.5 1.7a15 15 0 0 0-9.2 0C8.3 6.7 6.9 7.1 6.9 7.1c-.9 2.2-.4 3.9-.2 4.4A6.7 6.7 0 0 0 5 15.8c0 5.8 3.6 7.1 7 7.5.5.4 1 1.2 1 2.5V30" />
      </svg>
    )
  }

  if (type === 'linkedin') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M8 13v14M8 8v.2M15 27V13M15 19c.8-2.4 2.6-3.7 5.2-3.7 3.8 0 5.8 2.5 5.8 7.4V27" />
      </svg>
    )
  }

  if (type === 'upwork') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M9 10v7.5c0 3.7 2.6 6.5 7 6.5s7-2.8 7-6.5V10" />
        <path d="M20 16c1.6 0 2.9.6 4 1.8 1 1 1.6 2.3 2 3.7" />
        <path d="M9 10h6" />
      </svg>
    )
  }

  if (type === 'facebook') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M18 12v-2.2c0-1.2.8-1.8 1.9-1.8H22V4h-2.4C15.8 4 14 6.1 14 9.3V12h-3v4h3v12h4V16h3.2l.8-4H18Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M5 9h22v16H5V9Z" />
      <path d="m6 10 10 8 10-8" />
    </svg>
  )
}

function scrollToSection(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function HeroSection() {
  return (
    <section id="home" className="hero-landing">
      <StarfieldBackground leftOnly />
      <GlobeField />

      <div className="hero-veil" aria-hidden="true" />
      <div className="hero-shell">
        <div className="hero-main">
          <div className="hero-copy">
            <motion.p {...fadeUp(0.08)} className="hero-kicker">
              <span>// FULL-STACK WEB DEVELOPER</span>
            </motion.p>

            <motion.h1 {...fadeUp(0.2)} className="hero-heading">
              <span>Laurence </span>
              <strong>Jan</strong>
            </motion.h1>

            <motion.p {...fadeUp(0.32)} className="hero-description">
              I build scalable web applications and
              <br />
              exceptional digital experiences.
            </motion.p>

            <motion.p {...fadeUp(0.42)} className="hero-location">
              <span className="hero-location-pin" aria-hidden="true" />
              <span>
                Based in <strong>Davao City, Philippines</strong>
              </span>
            </motion.p>

            <motion.div {...fadeUp(0.52)} className="hero-actions">
              <a
                href="#projects"
                className="hero-btn hero-btn-primary"
                onClick={(event) => {
                  event.preventDefault()
                  scrollToSection('#projects')
                }}
              >
                <span>VIEW PROJECTS</span>
                <span aria-hidden="true">&rarr;</span>
              </a>
              <a
                href="#contact"
                className="hero-btn hero-btn-secondary"
                onClick={(event) => {
                  event.preventDefault()
                  scrollToSection('#contact')
                }}
              >
                <span>CONTACT ME</span>
                <span aria-hidden="true">&rarr;</span>
              </a>
            </motion.div>

            <motion.div {...fadeUp(0.62)} className="hero-social-row">
              <span>LET&apos;S CONNECT</span>
              <div className="hero-social-links">
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel={social.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                    aria-label={social.label}
                    className="hero-social-link"
                  >
                    <HeroIcon type={social.icon} />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div {...fadeUp(0.72)} className="hero-feature-panel">
          {FEATURES.map((feature) => (
            <article key={feature.title} className="hero-feature-card">
              <div className="hero-card-icon">
                <HeroIcon type={feature.icon} />
              </div>
              <div>
                <h2>{feature.title}</h2>
                <p>{feature.description}</p>
              </div>
            </article>
          ))}
        </motion.div>

        <motion.div {...fadeUp(0.82)} className="hero-stat-panel">
          {STATS.map((stat) => (
            <article key={stat.label} className="hero-stat-card">
              <div className="hero-card-icon">
                <HeroIcon type={stat.icon} />
              </div>
              <div>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            </article>
          ))}
        </motion.div>

        <motion.div {...fadeUp(0.92)} className="hero-tech-strip">
          <div className="hero-tech-heading">
            <span>TECHNOLOGIES I WORK WITH</span>
            <i aria-hidden="true" />
            <button
              type="button"
              className="hero-tech-down-btn"
              aria-label="Go to next section"
              onClick={() => scrollToSection('#projects')}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 5v11" />
                <path d="m7.5 12.5 4.5 4.5 4.5-4.5" />
              </svg>
            </button>
          </div>
          <div className="hero-tech-list">
            {TECH_STACK.map((tech) => (
              <a
                key={tech.name}
                href={tech.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-tech-item"
                aria-label={`Open ${tech.name}`}
              >
                <img src={tech.icon} alt="" loading="lazy" />
                <span>{tech.name}</span>
              </a>
            ))}
            <button
              type="button"
              className="hero-tech-more"
              onClick={() => scrollToSection('#skills')}
              aria-label="Go to skills section"
            >
              &amp; more
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
