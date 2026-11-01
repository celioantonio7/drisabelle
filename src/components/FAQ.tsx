import { useRef, useState } from 'react'
import { ChevronDown, ChevronUp, Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react'
import { FAQ, WHATSAPP_URL } from '../data'
import { useMotion } from '../animations/useMotion'
import {
  useMagneticButton,
  useCardTilt,
  useParallax,
} from '../animations/hooks'
import { gsap } from '../animations/gsap'
import { AttentionArrow } from './LottieflowIcons'
import { ToothIcon } from './Icons'
import { assetUrl } from '../utils/assets'

export default function FAQSection() {
  const rootRef = useRef<HTMLElement>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  useMagneticButton(rootRef)
  useCardTilt(rootRef)
  useParallax(rootRef)

  useMotion(rootRef, ({ motion, desktop }, root) => {
    if (!motion) return

    if (desktop) {
      const bentoItems = root.querySelectorAll('.faq-bento-card')
      if (bentoItems.length > 0) {
        gsap.fromTo(
          bentoItems,
          { opacity: 0, y: 35, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.1,
            scrollTrigger: {
              trigger: root,
              start: 'top 82%',
              once: true,
            },
          },
        )
      }
    }
  })

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <section ref={rootRef} id="faq" className="faq-section" aria-label="Perguntas Frequentes">
      {/* Atmosphere Background with Silk Blue Gradient & Elegant Curves */}
      <div className="faq-bg-atmosphere" aria-hidden="true">
        <svg viewBox="0 0 1440 820" fill="none" preserveAspectRatio="none" className="faq-bg-svg">
          <defs>
            <radialGradient id="faq-radial-glow" cx="50%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#dceeff" stopOpacity="0.55" />
              <stop offset="55%" stopColor="#ebf4fd" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="faq-silk-right" x1="1" y1="0.1" x2="0.3" y2="0.9">
              <stop offset="0%" stopColor="#cde2fc" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect width="1440" height="820" fill="url(#faq-radial-glow)" />
          <path
            d="M -100 240 C 320 290, 780 120, 1540 280"
            stroke="#3d8bff"
            strokeWidth="1.2"
            strokeOpacity="0.22"
          />
          <path
            d="M 580 820 C 820 620, 1140 460, 1540 380 L 1540 820 Z"
            fill="url(#faq-silk-right)"
          />
          <path
            d="M 0 540 C 420 590, 890 420, 1440 600"
            stroke="#0056d6"
            strokeWidth="1.3"
            strokeOpacity="0.25"
          />
        </svg>
      </div>

      <div className="section-container faq-container-layer">
        {/* ================= ASYMMETRIC BENTO GRID ================= */}
        <div className="faq-bento-grid">
          {/* BENTO 1: EDITORIAL HEADER CARD */}
          <div className="faq-bento-card faq-bento-header hero-glass-card" data-tilt>
            <div className="faq-eyebrow-row">
              <span className="faq-eyebrow-rule" aria-hidden="true" />
              <span className="faq-eyebrow-text">F A Q &bull; DÚVIDAS FREQUENTES</span>
            </div>

            <h2 className="faq-title">
              Perguntas <br />
              <span className="text-accent-blue">Frequentes.</span>
            </h2>

            <p className="faq-lead">
              Tire suas dúvidas sobre avaliação, tratamentos personalizados e o método exclusivo da Dra. Isabella Ferro.
            </p>

            <div className="faq-header-badges">
              <span className="faq-pill-badge">
                <ShieldCheck size={14} /> Atendimento Exclusivo
              </span>
              <span className="faq-pill-badge">
                <Sparkles size={14} /> Planejamento 3D
              </span>
              <span className="faq-pill-badge">
                <HeartHandshake size={14} /> Acolhimento Humanizado
              </span>
            </div>
          </div>

          {/* BENTO 2: DOCTOR SHOWCASE PHOTO CARD WITH CLEANED PHOTO & INTEGRATED SEAL */}
          <div className="faq-bento-card faq-bento-doctor hero-glass-card" data-tilt>
            <div className="faq-doctor-photo-wrap">
              <img
                src={assetUrl('/img/drisabelleferro_clean.png')}
                alt="Dra. Isabella Ferro — Cirurgiã-Dentista e Especialista em Odontologia Estética"
                className="faq-doctor-photo"
                loading="eager"
              />
              <div className="faq-doctor-photo-overlay" />

              {/* Doctor Info Glass Tag */}
              <div className="faq-doctor-caption">
                <strong className="faq-doctor-name">Dra. Isabella Ferro</strong>
                <span className="faq-doctor-cro">CRO 140267 &bull; Odontologia Estética</span>
              </div>

              {/* Neatly Aligned Rotating Circular Seal Badge (Zero baked duplicates) */}
              <div className="faq-seal-badge" aria-hidden="true">
                <div className="faq-seal-inner-ring" />
                <svg viewBox="0 0 144 144" className="faq-seal-svg">
                  <path
                    id="faq-seal-path"
                    d="M 72, 72 m -50, 0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0"
                    fill="none"
                  />
                  <text className="faq-seal-text">
                    <textPath href="#faq-seal-path" startOffset="2%" textLength="285" lengthAdjust="spacing">
                      ODONTOLOGIA ESTÉTICA • RESULTADOS REAIS •
                    </textPath>
                  </text>
                </svg>
                <div className="faq-seal-center-icon">
                  <ToothIcon width={28} height={28} />
                </div>
              </div>
            </div>
          </div>

          {/* BENTO 3: ASYMMETRIC PRIMARY ACCORDION (Perguntas 01 e 02) */}
          <div className="faq-bento-card faq-bento-accordions hero-glass-card">
            <span className="faq-bento-card-label">AVALIAÇÃO &amp; MATERIAIS</span>
            <div className="faq-accordion-stack">
              {FAQ.slice(0, 2).map((item, idx) => {
                const isOpen = openIndex === idx
                const numStr = String(idx + 1).padStart(2, '0')
                return (
                  <div key={idx} className={`faq-bento-item ${isOpen ? 'is-open' : ''}`}>
                    <button
                      type="button"
                      className="faq-question-btn"
                      onClick={() => toggle(idx)}
                      aria-expanded={isOpen}
                    >
                      <span className="faq-num-badge">{numStr}</span>
                      <span className="faq-question-text">{item.q}</span>
                      <span className="faq-chevron-circle">
                        {isOpen ? <ChevronUp width={15} height={15} /> : <ChevronDown width={15} height={15} />}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="faq-answer">
                        <p>{item.a}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* BENTO 4: ASYMMETRIC SECONDARY ACCORDION (Perguntas 03, 04 e 05) */}
          <div className="faq-bento-card faq-bento-secondary hero-glass-card">
            <span className="faq-bento-card-label">DURABILIDADE &amp; AGENDAMENTO</span>
            <div className="faq-accordion-stack">
              {FAQ.slice(2).map((item, relIdx) => {
                const idx = relIdx + 2
                const isOpen = openIndex === idx
                const numStr = String(idx + 1).padStart(2, '0')
                return (
                  <div key={idx} className={`faq-bento-item ${isOpen ? 'is-open' : ''}`}>
                    <button
                      type="button"
                      className="faq-question-btn"
                      onClick={() => toggle(idx)}
                      aria-expanded={isOpen}
                    >
                      <span className="faq-num-badge">{numStr}</span>
                      <span className="faq-question-text">{item.q}</span>
                      <span className="faq-chevron-circle">
                        {isOpen ? <ChevronUp width={15} height={15} /> : <ChevronDown width={15} height={15} />}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="faq-answer">
                        <p>{item.a}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* BENTO 5: DIRECT WHATSAPP CONCIERGE CARD */}
          <div className="faq-bento-card faq-bento-cta hero-glass-card" data-tilt>
            <div className="faq-cta-texts">
              <span className="faq-cta-mini-tag">ATENDIMENTO PRIVATIVO</span>
              <h3 className="faq-cta-title">Ainda tem alguma dúvida?</h3>
              <p className="faq-cta-desc">
                Nossa equipe está pronta para orientar você e agendar sua consulta exclusiva.
              </p>
            </div>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="faq-bento-whatsapp-btn"
              data-magnetic
            >
              <span>Conversar pelo WhatsApp</span>
              <AttentionArrow size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
