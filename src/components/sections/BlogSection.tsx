import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { BLOG_POSTS } from '@/data/portfolio'
import StarfieldBackground from '@/components/three/StarfieldBackground'

// Fix #11: icon type is now driven by data, not array index
type BlogIconType = 'document' | 'graduation' | 'database'

function BlogIcon({ type }: { type: BlogIconType }) {
  if (type === 'graduation') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="m4 12 12-6 12 6-12 6-12-6Z" />
        <path d="M9 15v6c2.8 3 11.2 3 14 0v-6" />
      </svg>
    )
  }

  if (type === 'database') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <ellipse cx="14" cy="8" rx="8" ry="3.8" />
        <path d="M6 8v11c0 2.1 3.6 3.8 8 3.8s8-1.7 8-3.8V8" />
        <path d="M6 14c0 2.1 3.6 3.8 8 3.8 1.3 0 2.5-.1 3.6-.4" />
        <rect x="18" y="17" width="8" height="8" rx="1.6" />
        <path d="M22 19.5v3" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M9 4h11l5 5v19H9V4Z" />
      <path d="M20 4v6h6M13 15h10M13 20h10M13 25h6" />
    </svg>
  )
}

export default function BlogSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="blog" ref={ref} className="blog-section">
      <StarfieldBackground />

      <div className="blog-inner">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="blog-kicker"
        >
          // 04 - BLOG
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="blog-title"
        >
          <span className="blog-title-type">
            <span>devlogs &amp; </span>
            <span className="blog-title-accent">tutorials</span>
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="blog-summary"
        >
          Notes, guides, and behind-the-scenes from real projects.
          <br />
          Sharing what I learn as I build.
        </motion.p>

        <div className="blog-post-list">
          {BLOG_POSTS.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.24 + index * 0.09 }}
              className="blog-post-card"
            >
              <div className="blog-post-meta">
                <div className="blog-post-icon">
                  {/* Fix #11: icon comes from data, not inferred from index */}
                  <BlogIcon type={post.icon} />
                </div>

                <div className="blog-post-tag-wrap">
                  <span className="blog-post-tag">{post.tag}</span>
                  <span className="blog-post-date">{post.date}</span>
                </div>
              </div>

              <div className="blog-post-copy">
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
              </div>

              <div className="blog-post-action">
                <span className="blog-read-time">
                  <span className="blog-clock" aria-hidden="true" />
                  {post.readTime} read
                </span>
                {/* Fix #7: only render arrow link when a real URL exists */}
                {post.url ? (
                  <a
                    href={post.url}
                    aria-label={`Read ${post.title}`}
                    className="blog-arrow"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    &rarr;
                  </a>
                ) : (
                  <span className="blog-arrow blog-arrow-muted" aria-label="Coming soon">
                    &rarr;
                  </span>
                )}
              </div>
            </motion.article>
          ))}
        </div>

        {/* Fix #7: "ALL POSTS" is a coming-soon placeholder — rendered as a non-link button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.58 }}
          className="blog-all-posts blog-all-posts-soon"
          aria-label="More posts coming soon"
        >
          <span className="blog-grid-icon" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>
          ALL POSTS
          <span className="blog-all-arrow" aria-hidden="true">
            &rarr;
          </span>
        </motion.div>
      </div>
    </section>
  )
}
