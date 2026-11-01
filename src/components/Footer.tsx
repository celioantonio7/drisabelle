import FooterLocationMap from './FooterLocationMap'
import SectionBackground from './SectionBackground'
import './FooterCompact.css'
import { useEditorialReveal } from '../animations/useEditorialReveal'
import { useEffect, useRef, useState } from 'react'
import { ArrowUp, ChevronDown, ChevronUp, ChevronRight, X } from 'lucide-react'
import {
  AttentionArrow,
  SocialInstagramLottie,
  SocialWhatsAppLottie,
  SocialLocationLottie,
} from './LottieflowIcons'
import { INSTAGRAM_URL, NAV, WHATSAPP_URL, ADDRESS_TEXT, MAPS_URL } from '../data'
import { scrollToId } from '../utils/scroll'
import {
  useMagneticButton,
} from '../animations/hooks'
import TechText from './TechText'

export default function Footer() {
  const [expanded, setExpanded] = useState(false)
  const footerRef = useRef<HTMLElement>(null)

  useMagneticButton(footerRef)
  useEditorialReveal(footerRef, 'signature')

  useEffect(() => {
    if (expanded) {
      document.body.style.overflow = 'hidden'
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setExpanded(false)
      }
      window.addEventListener('keydown', onKey)
      return () => {
        document.body.style.overflow = ''
        window.removeEventListener('keydown', onKey)
      }
    } else {
      document.body.style.overflow = ''
    }
  }, [expanded])

  const handleNav = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    setExpanded(false)
    document.body.style.overflow = ''
    requestAnimationFrame(() => scrollToId(id, { immediate: true }))
  }

  return (
    <footer ref={footerRef} id="contato" className="footer-section" aria-label="Contato e Rodapé">
      <SectionBackground variant="color-bends" />
      {/* Atmospheric Silk Blue Waves & Diagonal Hairline SVG Splines (Matching Footer Reference) */}
      <div className="footer-bg-atmosphere" aria-hidden="true">
        <svg viewBox="0 0 1448 680" fill="none" preserveAspectRatio="none" className="footer-bg-svg">
          <defs>
            <linearGradient id="footer-silk-right" x1="1" y1="0.2" x2="0.2" y2="0.9">
              <stop offset="0%" stopColor="#cfe3fc" stopOpacity="0.65" />
              <stop offset="48%" stopColor="#e3effd" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="footer-top-aura" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M 0 0 L 1448 0 L 1448 210 C 1080 260, 420 260, 0 210 Z"
            fill="url(#footer-top-aura)"
          />
          <path
            d="M 680 680 C 830 480, 1090 290, 1448 180 L 1448 680 Z"
            fill="url(#footer-silk-right)"
          />
          <path
            d="M 0 470 C 390 420, 760 550, 1448 340"
            stroke="#3d8bff"
            strokeWidth="1.2"
            strokeOpacity="0.24"
          />
          <path
            d="M 620 680 C 890 460, 1160 350, 1448 290"
            stroke="#0056d6"
            strokeWidth="1.3"
            strokeOpacity="0.28"
          />
        </svg>
      </div>

      <div className="section-container faq-container-layer">
        {/* ================= PRE-FOOTER CTA ("Seu sorriso é sua assinatura.") ================= */}
        <div className="footer-contact-layout">
          <div className="footer-signature-cta" data-footer-reveal>
            <h2 className="footer-cta-headline">
              <span>Seu sorriso é</span> <br />
              <span className="text-accent-blue">sua assinatura.</span>
            </h2>
            <hr className="footer-signature-rule" />
            <p className="footer-cta-sub">
              Invista em você com quem entende de estética, precisão e elegância.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-cta-primary-btn"
              data-magnetic
            >
              <span>Agendar Avaliação Exclusiva</span>
              <AttentionArrow size={18} />
            </a>

          </div>
          <FooterLocationMap />
        </div>

        {/* ================= COLLAPSIBLE PILL BAR AT THE BOTTOM (Desktop & Mobile) ================= */}
        <div className="footer-upward-wrapper" data-footer-reveal>
          <div className="footer-pill-bar hero-glass-card">
            <p className="footer-pill-copy">
              &copy; 2026 &nbsp;Dra. Isabella Ferro
              <span className="footer-copy-desktop-extra"> &nbsp;|&nbsp; Todos os direitos reservados.</span>
            </p>

            <div className="footer-pill-right">
              <div className="footer-pill-socials">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-pill-social-icon"
                  aria-label="WhatsApp"
                >
                  <SocialWhatsAppLottie size={16} />
                </a>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-pill-social-icon"
                  aria-label="Instagram"
                >
                  <SocialInstagramLottie size={16} />
                </a>
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-pill-social-icon"
                  aria-label="Abrir localização no Google Maps"
                >
                  <SocialLocationLottie size={16} />
                </a>
              </div>

              <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                className={`footer-mais-toggle-btn ${expanded ? 'is-open' : ''}`}
                aria-expanded={expanded}
              >
                <span>{expanded ? 'MENOS' : 'MAIS'}</span>
                {expanded ? <ChevronDown width={15} height={15} /> : <ChevronUp width={15} height={15} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= FULLSCREEN UPWARD FOOTER OVERLAY (Sem Rolagem, Abre Para Cima 100vh) ================= */}
      <div
        className={`footer-expandable-drawer ${expanded ? 'is-expanded' : ''}`}
        hidden={!expanded}
        inert={!expanded}
        aria-hidden={!expanded}
      >
        {/* Atmospheric Silk Waves & Diagonal Curves Inside Expanded Footer (Exact Match to Reference) */}
        <div className="footer-drawer-bg-atmosphere" aria-hidden="true">
          <svg viewBox="0 0 1448 1086" fill="none" preserveAspectRatio="none" className="footer-bg-svg">
            <defs>
              <linearGradient id="drawer-silk-wave-1" x1="1" y1="0.25" x2="0.25" y2="0.95">
                <stop offset="0%" stopColor="#cce0fa" stopOpacity="0.72" />
                <stop offset="50%" stopColor="#e2effe" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="drawer-silk-wave-2" x1="0.9" y1="0.1" x2="0.4" y2="0.8">
                <stop offset="0%" stopColor="#bad5f8" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M 760 1086 C 900 760, 1120 510, 1448 370 L 1448 1086 Z"
              fill="url(#drawer-silk-wave-1)"
            />
            <path
              d="M 940 1086 C 1060 820, 1240 620, 1448 490 L 1448 1086 Z"
              fill="url(#drawer-silk-wave-2)"
            />
            <path
              d="M 0 695 C 380 650, 760 760, 1448 545"
              stroke="#3d8bff"
              strokeWidth="1.2"
              strokeOpacity="0.26"
            />
            <path
              d="M 670 980 C 940 730, 1190 610, 1448 550"
              stroke="#0056d6"
              strokeWidth="1.4"
              strokeOpacity="0.32"
            />
          </svg>
        </div>

        <div className="footer-drawer-inner">
          {/* Top-Right Close Button */}
          <div className="footer-drawer-top-actions">
            <button
              type="button"
              onClick={() => {
                setExpanded(false)
                requestAnimationFrame(() => scrollToId('inicio', { immediate: true }))
              }}
              className="footer-back-top-round-btn"
              aria-label="Voltar ao topo"
            >
              <ArrowUp width={20} height={20} />
            </button>

            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="footer-close-round-btn"
              aria-label="Fechar rodapé expandido"
            >
              <X width={20} height={20} />
            </button>
          </div>

          {/* Desktop 4-Column Layout */}
          <div className="footer-cols-desktop">
            <div className="footer-col">
              <h4 className="footer-col-h">NAVEGAÇÃO</h4>
              <span className="footer-col-rule" aria-hidden="true" />
              <ul className="footer-col-list">
                {NAV.map(({ id, label }) => (
                  <li key={id}>
                    <a href={`#${id}`} onClick={(e) => handleNav(e, id)}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-h">ESPECIALIDADES</h4>
              <span className="footer-col-rule" aria-hidden="true" />
              <ul className="footer-col-list">
                <li><a href="#lentes-resina" onClick={(e) => handleNav(e, 'lentes-resina')}>Lentes de Resina</a></li>
                <li><a href="#lentes-porcelana" onClick={(e) => handleNav(e, 'lentes-porcelana')}>Lentes de Porcelana</a></li>
                <li><a href="#harmonizacao" onClick={(e) => handleNav(e, 'harmonizacao')}>Harmonização do Sorriso</a></li>
                <li><a href="#especialidades" onClick={(e) => handleNav(e, 'especialidades')}>Clareamento Dental</a></li>
                <li><a href="#spec-cards" onClick={(e) => handleNav(e, 'spec-cards')}>Facetas Dentárias</a></li>
                <li><a href="#especialidades" onClick={(e) => handleNav(e, 'especialidades')}>Outros Tratamentos</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-h">ATENDIMENTO</h4>
              <span className="footer-col-rule" aria-hidden="true" />
              <ul className="footer-col-contact-list">
                <li>
                  <span className="footer-contact-icon-badge">
                    <SocialWhatsAppLottie size={16} />
                  </span>
                  <div className="footer-contact-item-copy">
                    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                      WhatsApp
                    </a>
                    <small>Atendimento rápido</small>
                  </div>
                </li>
                <li>
                  <span className="footer-contact-icon-badge">
                    <SocialInstagramLottie size={16} />
                  </span>
                  <div className="footer-contact-item-copy">
                    <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                      Instagram
                    </a>
                    <small>Acompanhe os resultados</small>
                  </div>
                </li>
                <li>
                  <span className="footer-contact-icon-badge">
                    <SocialLocationLottie size={16} />
                  </span>
                  <div className="footer-contact-item-copy">
                    <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
                      Localização
                    </a>
                    <small>{ADDRESS_TEXT}</small>
                  </div>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-h">INFORMAÇÕES</h4>
              <span className="footer-col-rule" aria-hidden="true" />
              <div className="footer-info-block">
                <strong>Dra. Isabella Ferro</strong>
                <span>Clínico Geral &bull; CRO 140267</span>
                <span>Odontologia Estética &amp; Harmonização Facial</span>
              </div>
            </div>
          </div>

          {/* Mobile Stacked Layout (Exact match to media_1793530364048_be6b9f6c.jpg) */}
          <div className="footer-cols-mobile">
            {/* 1. NAVEGAÇÃO */}
            <div className="fm-drawer-card hero-glass-card">
              <h4 className="fm-drawer-card-title">NAVEGAÇÃO</h4>
              <ul className="fm-drawer-list">
                {NAV.map(({ id, label }) => (
                  <li key={id}>
                    <a href={`#${id}`} onClick={(e) => handleNav(e, id)} className="fm-drawer-row">
                      <span>{label}</span>
                      <ChevronRight size={15} className="fm-drawer-chevron" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. ESPECIALIDADES */}
            <div className="fm-drawer-card hero-glass-card">
              <h4 className="fm-drawer-card-title">ESPECIALIDADES</h4>
              <ul className="fm-drawer-list">
                <li>
                  <a href="#lentes-resina" onClick={(e) => handleNav(e, 'lentes-resina')} className="fm-drawer-row">
                    <span>Lentes de Resina</span>
                    <ChevronRight size={15} className="fm-drawer-chevron" />
                  </a>
                </li>
                <li>
                  <a href="#lentes-porcelana" onClick={(e) => handleNav(e, 'lentes-porcelana')} className="fm-drawer-row">
                    <span>Lentes de Porcelana</span>
                    <ChevronRight size={15} className="fm-drawer-chevron" />
                  </a>
                </li>
                <li>
                  <a href="#harmonizacao" onClick={(e) => handleNav(e, 'harmonizacao')} className="fm-drawer-row">
                    <span>Harmonização do Sorriso</span>
                    <ChevronRight size={15} className="fm-drawer-chevron" />
                  </a>
                </li>
                <li>
                  <a href="#especialidades" onClick={(e) => handleNav(e, 'especialidades')} className="fm-drawer-row">
                    <span>Clareamento Dental</span>
                    <ChevronRight size={15} className="fm-drawer-chevron" />
                  </a>
                </li>
                <li>
                  <a href="#spec-cards" onClick={(e) => handleNav(e, 'spec-cards')} className="fm-drawer-row">
                    <span>Facetas Dentárias</span>
                    <ChevronRight size={15} className="fm-drawer-chevron" />
                  </a>
                </li>
                <li>
                  <a href="#especialidades" onClick={(e) => handleNav(e, 'especialidades')} className="fm-drawer-row">
                    <span>Outros Tratamentos</span>
                    <ChevronRight size={15} className="fm-drawer-chevron" />
                  </a>
                </li>
              </ul>
            </div>

            {/* 3. ATENDIMENTO */}
            <div className="fm-drawer-card hero-glass-card">
              <h4 className="fm-drawer-card-title">ATENDIMENTO</h4>
              <ul className="fm-drawer-list">
                <li>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="fm-drawer-row">
                    <div className="fm-drawer-contact-left">
                      <span className="fm-drawer-icon-pill">
                        <SocialWhatsAppLottie size={18} />
                      </span>
                      <div className="fm-drawer-contact-texts">
                        <strong>WhatsApp</strong>
                        <small>Atendimento rápido</small>
                      </div>
                    </div>
                    <ChevronRight size={15} className="fm-drawer-chevron" />
                  </a>
                </li>
                <li>
                  <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="fm-drawer-row">
                    <div className="fm-drawer-contact-left">
                      <span className="fm-drawer-icon-pill">
                        <SocialInstagramLottie size={18} />
                      </span>
                      <div className="fm-drawer-contact-texts">
                        <strong>Instagram</strong>
                        <small>Acompanhe os resultados</small>
                      </div>
                    </div>
                    <ChevronRight size={15} className="fm-drawer-chevron" />
                  </a>
                </li>
                <li>
                  <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="fm-drawer-row">
                    <div className="fm-drawer-contact-left">
                      <span className="fm-drawer-icon-pill">
                        <SocialLocationLottie size={18} />
                      </span>
                      <div className="fm-drawer-contact-texts">
                        <strong>Localização</strong>
                        <small>{ADDRESS_TEXT}</small>
                      </div>
                    </div>
                    <ChevronRight size={15} className="fm-drawer-chevron" />
                  </a>
                </li>
              </ul>
            </div>

            {/* 4. INFORMAÇÕES */}
            <div className="fm-drawer-card hero-glass-card">
              <h4 className="fm-drawer-card-title">INFORMAÇÕES</h4>
              <div className="fm-drawer-info">
                <strong className="fm-drawer-doctor-name">Dra. Isabella Ferro</strong>
                <span className="fm-drawer-cro">Clínico Geral &bull; CRO 140267</span>
                <span className="fm-drawer-specialties">Odontologia Estética &amp; Harmonização Facial</span>
              </div>
            </div>

          </div>

          {/* Monumental Interactive TechText Brand Signature at Bottom + Soft Mirror Reflection */}
          <div className="footer-monumental-stage">
            <div className="footer-monumental-eyebrows" aria-hidden="true">
              <span>&mdash; ODONTOLOGIA ESTÉTICA DE ALTO PADRÃO</span>
              <span>&mdash; SORRISOS QUE TRANSFORMAM</span>
            </div>

            <div className="footer-monumental-tech-wrap">
              <TechText
                text="DRA. ISABELLA FERRO"
                fontFamily="'Playfair Display Variable', serif"
                fontWeight={600}
                fontSize={125}
                letterSpacing={-0.02}
                color="#0b192c"
                accentColor="#0056d6"
                reveal="letter"
                dashLength={4}
                dashGap={2}
                specks={15}
                intro="none"
                introDuration={2}
                autoScan={false}
                clickKick
                draggable
                sweep
                speed={1}
                guides={false}
              />
            </div>

            <div className="footer-monumental-reflection" aria-hidden="true">
              <span className="reflection-blue">DRA.</span> ISABELLA FERRO
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
