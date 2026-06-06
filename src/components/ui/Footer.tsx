import ljDevLogo from '@/assets/brand/lj-dev-logo.png'
import { SOCIALS } from '@/data/portfolio'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-brand">
        <img src={ljDevLogo} alt="LJ.DEV" className="site-footer-logo" />
        <p>&copy; 2026 Laurence Jan &middot; Davao City, PH</p>
      </div>

      <div className="site-footer-links">
        {SOCIALS.map((social) => (
          <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer">
            {social.label.toUpperCase()}
          </a>
        ))}
        <div className="site-footer-terminal" aria-hidden="true">
          &gt;_
        </div>
      </div>
    </footer>
  )
}
