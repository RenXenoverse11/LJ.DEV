import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import ProjectsDataField from '@/components/three/ProjectsDataField'
import { PROJECTS } from '@/data/portfolio'

const STATUS_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  live: { label: 'LIVE', color: '#4ade80', bg: 'rgba(74,222,128,0.08)' },
  active: { label: 'ACTIVE', color: '#f59a1b', bg: 'rgba(245,154,27,0.08)' },
  wip: { label: 'WIP', color: '#77778a', bg: 'rgba(119,119,138,0.1)' },
}

export default function ProjectsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="projects" ref={ref} className="projects-section">
      <div className="projects-data-field">
        <ProjectsDataField />
      </div>

      <div className="projects-inner">
        <div className="projects-heading-row">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="projects-kicker"
            >
              // 02 - PROJECTS
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="projects-title"
            >
              <span className="projects-title-type">
                <span>things i </span>
                <span className="projects-title-accent">built</span>
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="projects-summary"
            >
              A collection of selected work that showcases problem-solving, clean code,
              and real-world impact.
            </motion.p>
          </div>

          <motion.a
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            href="#projects"
            className="projects-view-all"
          >
            VIEW ALL PROJECTS &gt;_
          </motion.a>
        </div>

        <div className="projects-grid">
          {PROJECTS.map((project, i) => {
            const status = STATUS_STYLES[project.status]
            const isViewable = project.url !== '#'

            return (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.25 + i * 0.1 }}
                className="project-card"
                whileHover={{ borderColor: '#f59a1b66', translateY: -4 }}
              >
                {project.previewImage && (
                  <div className="project-preview">
                    <img
                      src={project.previewImage}
                      alt={project.previewAlt}
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="project-card-header">
                  <span className="project-label">{project.label}</span>

                  <div className="project-card-actions">
                    <span
                      className="project-status"
                      style={{
                        color: status.color,
                        background: status.bg,
                        borderColor: `${status.color}55`,
                      }}
                    >
                      {status.label}
                    </span>

                    {isViewable && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-external"
                        aria-label={`Open ${project.name}`}
                      >
                        &gt;
                      </a>
                    )}
                  </div>
                </div>

                <h3 className="project-name">{project.name}</h3>
                <p className="project-description">{project.description}</p>

                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>

                <div className="project-footer">
                  <a
                    href={isViewable ? project.url : undefined}
                    target={isViewable ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className={isViewable ? 'project-link' : 'project-link project-link-muted'}
                  >
                    {isViewable ? 'VIEW PROJECT >_' : 'IN PROGRESS >_'}
                  </a>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
