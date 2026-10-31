import { useRef, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { FAQ, WHATSAPP_URL } from '../data'
import { useMotion } from '../animations/useMotion'
import {
  useMagneticButton,
  useCardTilt,
  useParallax,
} from '../animations/hooks'
import { gsap } from '../animations/gsap'
import { AttentionArrow } from './LottieflowIcons'

export default function FAQSection() {
  const rootRef = useRef<HTMLElement>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  useMagneticButton(rootRef)
  useCardTilt(rootRef)
  useParallax(rootRef)

  useMotion(rootRef, ({ motion, desktop }, root) => {
    if (!motion) return

    // Mode D (Codrops-Paper Split-Column Counter-Parallax & Seal Rotation)
    if (desktop) {
      const leftCol = root.querySelector('.faq-left-col')
      const rightCol = root.querySelector('.faq-right-showcase')
      const sealSvg = root.querySelector('.faq-seal-svg')

      if (leftCol && rightCol) {
        gsap.fromTo(
          leftCol,
          { y: 20 },
          {
            y: -16,
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.7,
            },
          },
        )
        gsap.fromTo(
          rightCol,
          { y: -18 },
          {
            y: 22,
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.85,
            },
          },
        )
      }

      if (sealSvg) {
        gsap.fromTo(
          sealSvg,
          { rotation: -45 },
          {
            rotation: 95,
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.9,
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
      <div className="section-container faq-container-layer">
        <div className="faq-ref-layout">
          {/* ================= LEFT COLUMN: EYEBROW + TITLE + SUBTITLE + 01..05 ACCORDIONS ================= */}
          <div className="faq-left-col faq-anim-up">
            <div className="faq-eyebrow-row">
              <span className="faq-eyebrow-rule" aria-hidden="true" />
              <span className="faq-eyebrow-text">F A Q</span>
            </div>

            <h2 className="faq-title">
              Perguntas <br />
              <span className="text-accent-blue">Frequentes.</span>
            </h2>

            <p className="faq-lead">
              Tire suas dúvidas sobre avaliação, tratamentos <br className="faq-br-desk" />
              e planejamento do seu sorriso.
            </p>

            {/* 01..05 Numbered Accordion Stack on the Left (Exact Match to Reference) */}
            <div className="faq-accordion">
              {FAQ.map((item, idx) => {
                const isOpen = openIndex === idx
                const numStr = String(idx + 1).padStart(2, '0')
                return (
                  <div
                    key={idx}
                    className={`faq-item ${isOpen ? 'is-open' : ''}`}
                  >
                    <button
                      type="button"
                      className="faq-question-btn"
                      onClick={() => toggle(idx)}
                      aria-expanded={isOpen}
                    >
                      <span className="faq-num-badge">{numStr}</span>
                      <span className="faq-question-text">{item.q}</span>
                      <span className="faq-chevron-circle">
                        {isOpen ? <ChevronUp width={16} height={16} /> : <ChevronDown width={16} height={16} />}
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

            {/* Mobile Full-Width CTA Pill (matching 05_faq_mobile.png) */}
            <div className="faq-bottom-cta-wrap faq-mobile-cta-only">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="faq-full-cta-btn"
                data-magnetic
              >
                <span>Agendar avaliação privativa</span>
                <AttentionArrow size={16} />
              </a>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: EXACT SHOWCASE CARD FROM REFERÊNCIA (Imagem ChatGPT 30_10_2026, 20_56_42-5.png) ================= */}
          <div className="faq-right-showcase">
            <div className="faq-showcase-real-frame" data-tilt>
              <img
                src="/img/faq_showcase_card.png"
                alt="Dra. Isabella Ferro — Odontologia Estética e Harmonização Facial"
                className="faq-showcase-real-img"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
