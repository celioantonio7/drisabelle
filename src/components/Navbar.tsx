import { useEffect, useRef, useState } from 'react'
import { NAV, WHATSAPP_URL, INSTAGRAM_URL } from '../data'
import { scrollToId } from '../utils/scroll'
import { assetUrl } from '../utils/assets'
import { ScrollTrigger, useGSAP } from '../animations/gsap'
import {
  LottieMenuNav11,
  AttentionArrow,
  SocialInstagramLottie,
  SocialWhatsAppLottie,
  SocialLocationLottie,
} from './LottieflowIcons'

export default function Navbar() {
  const barRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState<string>('inicio')
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      const delta = y - lastY
      if (y <= 70) {
        setHidden(false)
      } else if (delta > 6 && !open) {
        // Rolar para baixo: some
        setHidden(true)
      } else if (delta < -4) {
        // Rolar para cima: aparece descendo
        setHidden(false)
      }
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [open])

  useGSAP(
    () => {
      NAV.forEach(({ id }) => {
        const target = document.getElementById(id)
        if (!target) return
        ScrollTrigger.create({
          trigger: target,
          start: id === 'contato' ? 'top 90%' : 'top 35%',
          end: id === 'contato' ? 'bottom top' : 'bottom 35%',
          onEnter: () => setActive(id),
          onEnterBack: () => setActive(id),
        })
      })

      ScrollTrigger.create({
        start: 20,
        end: 'max',
        onToggle: (s) => setScrolled(s.isActive),
      })
    },
    { scope: barRef },
  )

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    setOpen(false)
    scrollToId(id)
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <header className={`nav-wrapper ${hidden && !open ? 'is-nav-hidden' : ''}`}>
      <nav
        ref={barRef}
        className={`nav-pill-bar ${scrolled ? 'is-scrolled' : ''}`}
        aria-label="Navegação principal"
      >
        {/* Brand / Logo Dourado Transparente com efeito de brilho reluzente */}
        <a
          href="#inicio"
          className="nav-brand"
          onClick={(e) => go(e, 'inicio')}
          aria-label="Dra. Isabella Ferro"
        >
          <div className="nav-brand-logo-wrap">
            <img
              src={assetUrl('/img/logo_dourado_transparente.webp')}
              alt="Dra. Isabella Ferro - Odontologia Estética e Facial"
              className="nav-brand-logo-img"
            />
            <span className="nav-brand-shine" aria-hidden="true" />
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div className="nav-menu-desktop">
          <ul className="nav-links-list">
            {NAV.map(({ id, label }) => (
              <li key={id} className="nav-item">
                <a
                  href={`#${id}`}
                  className={`nav-link ${active === id ? 'is-active' : ''}`}
                  onClick={(e) => go(e, id)}
                >
                  {label}
                  {active === id && <span className="nav-active-dot" aria-hidden />}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Actions: Socials + CTA */}
        <div className="nav-actions">
          <div className="nav-social-icons">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-social-btn"
              aria-label="Instagram"
            >
              <SocialInstagramLottie size={16} />
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-social-btn"
              aria-label="WhatsApp"
            >
              <SocialWhatsAppLottie size={16} />
            </a>
            <a
              href="#contato"
              onClick={(e) => go(e, 'contato')}
              className="nav-social-btn"
              aria-label="Localização"
            >
              <SocialLocationLottie size={16} />
            </a>
          </div>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-cta-pill"
          >
            <span>Solicitar avaliação</span>
            <AttentionArrow size={15} />
          </a>

          <button
            type="button"
            className="nav-burger-btn"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-label="Menu"
          >
            <LottieMenuNav11 open={open} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer — Only rendered when open is true */}
      {open && (
        <div className="nav-mobile-sheet">
          <ul className="nav-mobile-list">
            {NAV.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`nav-mobile-item ${active === id ? 'is-active' : ''}`}
                  onClick={(e) => go(e, id)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <div className="nav-mobile-bottom">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-cta-pill nav-cta-mobile-full"
            >
              <span>Solicitar avaliação</span>
              <AttentionArrow size={16} />
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
