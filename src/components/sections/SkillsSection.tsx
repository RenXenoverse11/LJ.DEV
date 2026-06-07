import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { SKILLS } from '@/data/portfolio'
import StarfieldBackground from '@/components/three/StarfieldBackground'

type SkillCategory = keyof typeof SKILLS

const CATEGORY_META: Array<{
  key: SkillCategory
  title: string
  description: string
  icon: 'frontend' | 'backend' | 'tools' | 'mobile'
}> = [
  {
    key: 'frontend',
    title: 'Frontend',
    description: 'Building interactive and responsive UI.',
    icon: 'frontend',
  },
  {
    key: 'backend',
    title: 'Backend & Data',
    description: 'APIs, databases, and serverless platforms.',
    icon: 'backend',
  },
  {
    key: 'tools',
    title: 'Tools & Infra',
    description: 'Developer tools and cloud infrastructure.',
    icon: 'tools',
  },
  {
    key: 'mobile',
    title: 'Mobile',
    description: 'Cross-platform and native development.',
    icon: 'mobile',
  },
]

const SKILL_ICONS: Record<string, { src?: string; fallback?: string; className?: string }> = {
  'React 19': { src: 'https://cdn.simpleicons.org/react/61DAFB' },
  TypeScript: { src: 'https://cdn.simpleicons.org/typescript/3178C6' },
  'Svelte 5': { src: 'https://cdn.simpleicons.org/svelte/FF3E00' },
  Angular: { src: 'https://cdn.simpleicons.org/angular/DD0031' },
  'Vue.js': { src: 'https://cdn.simpleicons.org/vuedotjs/4FC08D' },
  jQuery: { src: 'https://cdn.simpleicons.org/jquery/0769AD' },
  'Tailwind CSS': { src: 'https://cdn.simpleicons.org/tailwindcss/06B6D4' },
  'Three.js': { src: 'https://cdn.simpleicons.org/threedotjs/E8E8E8' },
  'Framer Motion': { src: 'https://cdn.simpleicons.org/framer/7C4DFF' },
  'Node.js': { src: 'https://cdn.simpleicons.org/nodedotjs/5FA04E' },
  Laravel: { src: 'https://cdn.simpleicons.org/laravel/FF2D20' },
  Supabase: { src: 'https://cdn.simpleicons.org/supabase/3FCF8E' },
  PostgreSQL: { src: 'https://cdn.simpleicons.org/postgresql/4169E1' },
  'Google Apps Script': { src: 'https://cdn.simpleicons.org/googleappsscript/4285F4' },
  'Google Sheets API': { src: 'https://cdn.simpleicons.org/googlesheets/34A853' },
  'REST APIs': { fallback: '{}', className: 'skill-icon-code' },
  Vite: { src: 'https://cdn.simpleicons.org/vite/646CFF' },
  Git: { src: 'https://cdn.simpleicons.org/git/F05032' },
  GitHub: { src: 'https://cdn.simpleicons.org/github/E8E8E8' },
  Vercel: { src: 'https://cdn.simpleicons.org/vercel/E8E8E8' },
  Cloudflare: { src: 'https://cdn.simpleicons.org/cloudflare/F38020' },
  OSRM: { fallback: 'O', className: 'skill-icon-map' },
  Mapbox: { src: 'https://cdn.simpleicons.org/mapbox/4264FB' },
  Leaflet: { src: 'https://cdn.simpleicons.org/leaflet/75B843' },
  'React Native': { src: 'https://cdn.simpleicons.org/react/61DAFB' },
  Flutter: { src: 'https://cdn.simpleicons.org/flutter/40C4FF' },
  Dart: { src: 'https://cdn.simpleicons.org/dart/0175C2' },
  'Android Studio': { src: 'https://cdn.simpleicons.org/androidstudio/3DDC84' },
}

const SKILL_URLS: Record<string, string> = {
  'React 19': 'https://react.dev/',
  TypeScript: 'https://www.typescriptlang.org/',
  'Svelte 5': 'https://svelte.dev/',
  Angular: 'https://angular.dev/',
  'Vue.js': 'https://vuejs.org/',
  jQuery: 'https://jquery.com/',
  'Tailwind CSS': 'https://tailwindcss.com/',
  'Three.js': 'https://threejs.org/',
  'Framer Motion': 'https://www.framer.com/motion/',
  'Node.js': 'https://nodejs.org/',
  Laravel: 'https://laravel.com/',
  Supabase: 'https://supabase.com/',
  PostgreSQL: 'https://www.postgresql.org/',
  'Google Apps Script': 'https://developers.google.com/apps-script',
  'Google Sheets API': 'https://developers.google.com/sheets/api',
  'REST APIs': '#',
  Vite: 'https://vitejs.dev/',
  Git: 'https://git-scm.com/',
  GitHub: 'https://github.com/',
  Vercel: 'https://vercel.com/',
  Cloudflare: 'https://www.cloudflare.com/',
  OSRM: 'http://project-osrm.org/',
  Mapbox: 'https://www.mapbox.com/',
  Leaflet: 'https://leafletjs.com/',
  'React Native': 'https://reactnative.dev/',
  Flutter: 'https://flutter.dev/',
  Dart: 'https://dart.dev/',
  'Android Studio': 'https://developer.android.com/studio',
}

function CategoryIcon({ icon }: { icon: (typeof CATEGORY_META)[number]['icon'] }) {
  if (icon === 'frontend') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <rect x="5" y="7" width="22" height="18" rx="2.5" />
        <path d="M5 12h22M10 9.5h1.5M14 9.5h1.5" />
      </svg>
    )
  }

  if (icon === 'backend') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <ellipse cx="16" cy="8" rx="10" ry="4.5" />
        <path d="M6 8v14c0 2.5 4.5 4.5 10 4.5s10-2 10-4.5V8" />
        <path d="M6 15c0 2.5 4.5 4.5 10 4.5s10-2 10-4.5" />
      </svg>
    )
  }

  if (icon === 'tools') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <rect x="5" y="7" width="22" height="18" rx="2.5" />
        <path d="m10 13 4 3-4 3M16 20h7" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect x="10" y="4" width="12" height="24" rx="2.5" />
      <path d="M14 7h4M15 25h2" />
    </svg>
  )
}

function SkillIcon({ skill }: { skill: string }) {
  const icon = SKILL_ICONS[skill]

  if (icon?.src) {
    return <img src={icon.src} alt="" loading="lazy" />
  }

  return <span className={icon?.className}>{icon?.fallback ?? skill[0]}</span>
}

export default function SkillsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="skills" ref={ref} className="skills-section">
      <StarfieldBackground />

      <div className="skills-inner">
        <div className="skills-header">
          <div className="skills-heading-copy">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="skills-kicker"
            >
              // 03 - SKILLS
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="skills-title"
            >
              <span className="skills-title-type">
                <span>my </span>
                <span className="skills-title-accent">stack</span>
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="skills-summary"
            >
              A curated set of technologies, tools, and platforms I use to build fast,
              scalable, and reliable solutions.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="skills-build-card"
          >
            <div className="skills-build-icon" aria-hidden="true">
              &lt;/&gt;
            </div>
            <div>
              <h3>Always Building</h3>
              <p>Continuously learning and shipping better products.</p>
            </div>
          </motion.div>
        </div>

        <div className="skills-stack-list">
          {CATEGORY_META.map((category, categoryIndex) => (
            <motion.article
              key={category.key}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.26 + categoryIndex * 0.08 }}
              className="skills-row"
            >
              <div className="skills-row-label">
                <div className="skills-row-icon">
                  <CategoryIcon icon={category.icon} />
                </div>
                <div>
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                </div>
              </div>

              <div className="skills-chip-grid">
                {SKILLS[category.key].map((skill, skillIndex) => {
                  const skillUrl = SKILL_URLS[skill]
                  const isClickable = skillUrl && skillUrl !== '#'

                  // Fix #8: use <a> for clickable chips — keyboard accessible, correct semantics
                  const Tag = isClickable ? motion.a : motion.div
                  return (
                    <Tag
                      key={skill}
                      {...(isClickable
                        ? { href: skillUrl, target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{
                        duration: 0.28,
                        delay: 0.34 + categoryIndex * 0.06 + skillIndex * 0.025,
                      }}
                      className="skills-chip"
                    >
                      <span className="skills-chip-icon">
                        <SkillIcon skill={skill} />
                      </span>
                      <span>{skill}</span>
                    </Tag>
                  )
                })}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
