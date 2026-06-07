import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useForm, ValidationError } from '@formspree/react'
import { SOCIALS } from '@/data/portfolio'
import StarfieldBackground from '@/components/three/StarfieldBackground'

type ContactIconType = 'email' | 'location' | 'github' | 'linkedin'
type FieldIconType = 'user' | 'mail' | 'file' | 'edit' | 'send'

// Fix #2: derive display values from the single SOCIALS source of truth
const githubSocial = SOCIALS.find((s) => s.label === 'GitHub')!
const linkedinSocial = SOCIALS.find((s) => s.label === 'LinkedIn')!

const CONTACT_ITEMS: Array<{
  icon: ContactIconType
  label: string
  value: string
}> = [
  { icon: 'email', label: 'Email', value: 'laurencejan1431@gmail.com' },
  { icon: 'location', label: 'Location', value: 'Davao City, Philippines' },
  { icon: 'github', label: 'GitHub', value: githubSocial.href.replace('https://', '') },
  { icon: 'linkedin', label: 'LinkedIn', value: linkedinSocial.href.replace('https://www.', '') },
]

function ContactIcon({ type }: { type: ContactIconType }) {
  if (type === 'location') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 28s9-8.4 9-17a9 9 0 0 0-18 0c0 8.6 9 17 9 17Z" />
        <circle cx="16" cy="11" r="3" />
      </svg>
    )
  }

  if (type === 'github') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M12 26c-5 1.4-5-2.4-7-3m14 6v-4.1c0-1.2.4-2 1-2.6 3.2-.4 6.6-1.6 6.6-7.2 0-1.6-.6-3-1.6-4.1.2-.4.7-2-.2-4.1 0 0-1.3-.4-4.3 1.6A14.4 14.4 0 0 0 16 7.9c-1.5 0-3 .2-4.4.6C8.6 6.5 7.3 6.9 7.3 6.9 6.4 9 6.9 10.6 7.1 11A6.4 6.4 0 0 0 5.5 15c0 5.6 3.4 6.8 6.6 7.2.5.4.9 1.2.9 2.4V29" />
      </svg>
    )
  }

  if (type === 'linkedin') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M7 13v14M7 8v.2M14 27V13M14 18c.8-2 2.5-3 4.8-3 3.5 0 5.2 2.2 5.2 6.5V27" />
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

function FieldIcon({ type }: { type: FieldIconType }) {
  if (type === 'mail') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M5 9h22v16H5V9Z" />
        <path d="m6 10 10 8 10-8" />
      </svg>
    )
  }

  if (type === 'file') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M9 4h12l4 4v24H9V4Z" />
        <path d="M20 4v7h7M13 17h10M13 22h10" />
      </svg>
    )
  }

  if (type === 'edit') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="m6 24 2-7 12-12 5 5-12 12-7 2Z" />
        <path d="m18 7 5 5" />
      </svg>
    )
  }

  if (type === 'send') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="m4 16 24-11-8 24-5-10-11-3Z" />
        <path d="m15 19 13-14" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="10" r="5" />
      <path d="M6 28c1.6-6 4.8-9 10-9s8.4 3 10 9" />
    </svg>
  )
}

export default function ContactSection() {
  const ref = useRef(null)
  const [state, handleSubmit] = useForm('mykaklod')

  return (
    <section id="contact" ref={ref} className="contact-section">
      <StarfieldBackground />

      <div className="contact-inner">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
          className="contact-copy"
        >
          <p className="contact-kicker">// 05 - CONTACT</p>
          <h2 className="contact-title">
            <span className="contact-title-type">
              <span>get in </span>
              <span className="contact-title-accent">touch</span>
            </span>
          </h2>
          <p className="contact-summary">
            Building something and need a developer? Want to collaborate, or just want to
            say hi? I&apos;m open to freelance projects and opportunities.
          </p>

          <div className="contact-info-list">
            {CONTACT_ITEMS.map((item) => (
              <div key={item.label} className="contact-info-item">
                <div className="contact-info-icon">
                  <ContactIcon type={item.icon} />
                </div>
                <div>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          onSubmit={handleSubmit}
          className="contact-form-card"
        >
          {state.succeeded ? (
            <div style={{ color: '#f59a1b', textAlign: 'center', padding: '2rem' }}>
              <p style={{ fontSize: '1.1em', fontWeight: 600 }}>Message sent! Thanks for reaching out 🚀</p>
            </div>
          ) : (
            <>
              <div className="contact-form-grid">
                <label className="contact-field">
                  <FieldIcon type="user" />
                  <input type="text" name="name" placeholder="Your Name" required />
                  <ValidationError field="name" errors={state.errors} />
                </label>
                <label className="contact-field">
                  <FieldIcon type="mail" />
                  <input type="email" name="email" placeholder="Your Email" required />
                  <ValidationError field="email" errors={state.errors} />
                </label>
              </div>

              <label className="contact-field">
                <FieldIcon type="file" />
                <input type="text" name="subject" placeholder="Subject" />
              </label>

              <label className="contact-field contact-message-field">
                <FieldIcon type="edit" />
                <textarea name="message" placeholder="Your Message" rows={7} required />
                <ValidationError field="message" errors={state.errors} />
              </label>

              <button type="submit" className="contact-submit" disabled={state.submitting}>
                <FieldIcon type="send" />
                {state.submitting ? 'SENDING...' : 'SEND MESSAGE >_'}
              </button>
            </>
          )}
        </motion.form>
      </div>
    </section>
  )
}
