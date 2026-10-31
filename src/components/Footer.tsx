import { useEffect, useRef, useState } from 'react'
import { ArrowUp, ChevronDown, ChevronUp, X } from 'lucide-react'
import {
  AttentionArrow,
  SocialInstagramLottie,
  SocialWhatsAppLottie,
  SocialLocationLottie,
} from './LottieflowIcons'
import { INSTAGRAM_URL, NAV, WHATSAPP_URL } from '../data'
import { scrollToId } from '../utils/scroll'
import {
  useMagneticButton,
} from '../animations/hooks'
import TechText from './TechText'

export default function Footer() {
  const [expanded, setExpanded] = useState(false)
  const footerRef = useRef<HTMLElement>(null)

  useMagneticButton(footerRef)

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
    window.setTimeout(() => scrollToId(id), 80)
  }

  return (
    <footer ref={footerRef} id="contato" className="footer-section" aria-label="Contato e Rodapé">
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
        <div className="footer-signature-cta" data-footer-reveal>
          <span className="footer-cta-eyebrow">C O N T A T O</span>
          <h2 className="footer-cta-headline">
            <span>Seu sorriso é</span> <br />
            <span className="text-accent-blue">sua assinatura.</span>
          </h2>
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

        {/* ================= COLLAPSIBLE PILL BAR AT THE BOTTOM ================= */}
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
                  href="#contato"
                  onClick={(e) => {
                    e.preventDefault()
                    setExpanded(true)
                  }}
                  className="footer-pill-social-icon"
                  aria-label="Localização"
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

        {/* ================= MOBILE INLINE FOOTER (Directly visible on mobile matching 07_footer_mobile.png) ================= */}
        <div className="footer-mobile-flow" data-footer-reveal>
          <div className="fm-flow-group">
            <h4 className="fm-flow-title">NAVEGAÇÃO</h4>
            <span className="fm-flow-rule" aria-hidden="true" />
            <div className="fm-flow-links">
              <p>
                <a href="#inicio" onClick={(e) => handleNav(e, 'inicio')}>Início</a>
                <span className="fm-dot">&bull;</span>
                <a href="#sobre" onClick={(e) => handleNav(e, 'sobre')}>Sobre</a>
              </p>
              <p>
                <a href="#especialidades" onClick={(e) => handleNav(e, 'especialidades')}>Especialidades</a>
                <span className="fm-dot">&bull;</span>
                <a href="#experiencia" onClick={(e) => handleNav(e, 'experiencia')}>Experiência</a>
              </p>
              <p>
                <a href="#faq" onClick={(e) => handleNav(e, 'faq')}>FAQ</a>
                <span className="fm-dot">&bull;</span>
                <a href="#resultados" onClick={(e) => handleNav(e, 'resultados')}>Resultados</a>
              </p>
            </div>
          </div>

          <div className="fm-flow-group">
            <h4 className="fm-flow-title">ESPECIALIDADES</h4>
            <span className="fm-flow-rule" aria-hidden="true" />
            <div className="fm-flow-links">
              <p>
                <a href="#especialidades" onClick={(e) => handleNav(e, 'especialidades')}>Lentes em Resina</a>
                <span className="fm-dot">&bull;</span>
                <a href="#especialidades" onClick={(e) => handleNav(e, 'especialidades')}>Porcelana</a>
              </p>
              <p>
                <span>Odontologia estética &amp; Harmonização</span>
              </p>
            </div>
          </div>

          <div className="fm-flow-group">
            <h4 className="fm-flow-title">CONTATO</h4>
            <span className="fm-flow-rule" aria-hidden="true" />
            <div className="fm-flow-links">
              <p>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  WhatsApp: (12) 99623-2567
                </a>
              </p>
              <p>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                  Instagram: @draisabellaferro
                </a>
              </p>
            </div>
          </div>

          {/* Monumental Watermark Name (Matching 07_footer_mobile.png) */}
          <div className="footer-mobile-brand-watermark" aria-hidden="true">
            <div className="fm-brand-isabella">ISABELLA</div>
            <div className="fm-brand-ferro">FERRO</div>
          </div>
        </div>
      </div>

      {/* ================= FULLSCREEN UPWARD FOOTER OVERLAY (Sem Rolagem, Abre Para Cima 100vh) ================= */}
      <div
        className={`footer-expandable-drawer ${expanded ? 'is-expanded' : ''}`}
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
                window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 80)
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
                <li><a href="#especialidades" onClick={(e) => handleNav(e, 'especialidades')}>Lentes de Resina</a></li>
                <li><a href="#especialidades" onClick={(e) => handleNav(e, 'especialidades')}>Lentes de Porcelana</a></li>
                <li><a href="#especialidades" onClick={(e) => handleNav(e, 'especialidades')}>Harmonização do Sorriso</a></li>
                <li><a href="#especialidades" onClick={(e) => handleNav(e, 'especialidades')}>Clareamento Dental</a></li>
                <li><a href="#especialidades" onClick={(e) => handleNav(e, 'especialidades')}>Facetas Dentárias</a></li>
                <li><a href="#experiencia" onClick={(e) => handleNav(e, 'experiencia')}>Outros Tratamentos</a></li>
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
                    <span>Localização</span>
                    <small>São José dos Campos - SP</small>
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

          {/* Mobile Stacked Layout (Exact match to 07_footer_mobile.png, Zero Scroll) */}
          <div className="footer-cols-mobile">
            <div className="fm-group">
              <h4 className="fm-group-title">NAVEGAÇÃO</h4>
              <div className="fm-inline-links">
                <p>
                  <a href="#inicio" onClick={(e) => handleNav(e, 'inicio')}>Início</a>
                  <span className="fm-dot">&bull;</span>
                  <a href="#sobre" onClick={(e) => handleNav(e, 'sobre')}>Sobre</a>
                </p>
                <p>
                  <a href="#especialidades" onClick={(e) => handleNav(e, 'especialidades')}>Especialidades</a>
                  <span className="fm-dot">&bull;</span>
                  <a href="#experiencia" onClick={(e) => handleNav(e, 'experiencia')}>Experiência</a>
                </p>
                <p>
                  <a href="#faq" onClick={(e) => handleNav(e, 'faq')}>FAQ</a>
                  <span className="fm-dot">&bull;</span>
                  <a href="#resultados" onClick={(e) => handleNav(e, 'resultados')}>Resultados</a>
                </p>
              </div>
            </div>

            <div className="fm-group">
              <h4 className="fm-group-title">ESPECIALIDADES</h4>
              <div className="fm-inline-links">
                <p>
                  <span>Lentes em Resina</span>
                  <span className="fm-dot">&bull;</span>
                  <span>Porcelana</span>
                </p>
                <p>
                  <span>Odontologia estética &amp; Harmonização Facial</span>
                </p>
              </div>
            </div>

            <div className="fm-group">
              <h4 className="fm-group-title">CONTATO</h4>
              <div className="fm-inline-links">
                <p>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                    WhatsApp: (12) 99623-2567
                  </a>
                </p>
                <p>
                  <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                    Instagram: @isabellapferro
                  </a>
                </p>
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
