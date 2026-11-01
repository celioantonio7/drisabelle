import { useRef, useState, useLayoutEffect } from 'react'
import { Plus, RotateCcw, ArrowRight } from 'lucide-react'
import { FAQ, WHATSAPP_URL } from '../data'
import { useMotion } from '../animations/useMotion'
import { useMagneticButton } from '../animations/hooks'
import { gsap, ScrollTrigger } from '../animations/gsap'
import { WhatsAppIcon } from './Icons'
import { assetUrl } from '../utils/assets'
import './FAQ.css'

export default function FAQSection() {
  const rootRef = useRef<HTMLElement>(null)
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  useMagneticButton(rootRef)

  // Scroll entry animations
  useMotion(rootRef, ({ motion, desktop }, root) => {
    if (!motion) return

    gsap.fromTo(root.querySelector('.faq-main-title'), { opacity: 0, y: 20, clipPath: 'inset(0 0 100% 0)' }, {
      opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: .8,
      scrollTrigger: { trigger: root, start: 'top 80%', once: true },
    })
    gsap.fromTo(root.querySelector('.faq-bg-spline-wrap'), { xPercent: -4 }, {
      xPercent: 4, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: 1 },
    })
    if (desktop) {
      const cards = root.querySelectorAll('.faq-flip-card, .faq-side-doctor-card, .faq-side-cta-card')
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 35, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            ease: 'power3.out',
            stagger: 0.08,
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

  const animationLock = useRef(false)
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const context = gsap.context(() => {
      const cards = root.querySelectorAll<HTMLElement>('.faq-flip-card')
      const timeline = gsap.timeline({ onComplete: () => {
        animationLock.current = false
        setIsAnimating(false)
        ScrollTrigger.refresh()
      } })
      cards.forEach((card, index) => {
        const back = card.querySelector<HTMLElement>('.faq-card-back')!
        const front = card.querySelector<HTMLElement>('.faq-card-front')!
        const open = index === flippedIndex
        const face = open ? back : front
        face.style.height = 'auto'
        const height = Math.max(155, face.scrollHeight)
        face.style.height = ''
        timeline.to(card, { height, duration: reduced ? 0 : 0.75, ease: 'power3.inOut' }, 0)
        timeline.to(card.querySelector('.faq-flip-card-inner'), {
          rotateY: open ? 180 : 0, duration: reduced ? 0 : 0.75, ease: 'power3.inOut',
        }, 0)
        if (open) timeline.fromTo(back.querySelector('p'), { opacity: 0 },
          { opacity: 1, duration: reduced ? 0 : 0.25 }, reduced ? 0 : 0.4)
      })
    }, root)
    return () => context.kill(false)
  }, [flippedIndex])

  useLayoutEffect(() => {
    const grid = rootRef.current?.querySelector('.faq-cards-grid')
    if (!grid) return
    let lastWidth = grid.getBoundingClientRect().width
    const observer = new ResizeObserver(() => {
      const width = grid.getBoundingClientRect().width
      if (Math.abs(width - lastWidth) < 1) return
      lastWidth = width
      grid.querySelectorAll<HTMLElement>('.faq-flip-card').forEach(card => {
        const face = card.querySelector<HTMLElement>(card.getAttribute('aria-expanded') === 'true' ? '.faq-card-back' : '.faq-card-front')!
        face.style.height = 'auto'
        const height = Math.max(155, face.scrollHeight)
        face.style.height = ''
        gsap.set(card, { height })
      })
      ScrollTrigger.refresh()
    })
    observer.observe(grid)
    return () => observer.disconnect()
  }, [])

  const handleCardClick = (idx: number) => {
    if (animationLock.current) return
    animationLock.current = true
    setIsAnimating(true)
    setFlippedIndex(current => current === idx ? null : idx)
  }

  return (
    <section ref={rootRef} id="faq" className="faq-bento-section" aria-label="Perguntas Frequentes">
      {/* ================= BACKGROUND DECORATIVE SVGS (From public/ assets) ================= */}
      <div className="faq-bg-canvas" aria-hidden="true">
        {/* 05: Background waves */}
        <img
          src={assetUrl('/05_background_waves.svg')}
          alt=""
          className="faq-bg-waves"
        />

        {/* 06: Bottom-Left Architectural Marble Arc */}
        <img
          src={assetUrl('/06_marble_arc.svg')}
          alt=""
          className="faq-bg-marble-arc"
        />

        {/* 01 & 02: Serpentine Glow Line traversing behind cards */}
        <div className="faq-bg-spline-wrap">
          <img
            src={assetUrl('/02_glow_curve.svg')}
            alt=""
            className="faq-bg-glow-curve"
          />
          <img
            src={assetUrl('/01_serpentine_line.svg')}
            alt=""
            className="faq-bg-spline-line"
          />

          {/* 03: Floating 3D Glass Orbs positioned along the spline */}
          <img
            src={assetUrl('/03_glass_orb.svg')}
            alt=""
            className="faq-bg-orb orb-1"
          />
          <img
            src={assetUrl('/03_glass_orb.svg')}
            alt=""
            className="faq-bg-orb orb-2"
          />
          <img
            src={assetUrl('/03_glass_orb.svg')}
            alt=""
            className="faq-bg-orb orb-3"
          />
        </div>
      </div>

      <div className="section-container faq-bento-container">
        {/* ================= 3-COLUMN ASYMMETRIC BENTO GRID ================= */}
        <div className="faq-bento-layout">
          {/* ================= LEFT COLUMN: EDITORIAL COPY & CONTACT LINK ================= */}
          <div className="faq-col-left">
            <div className="faq-eyebrow-line">
              <span className="faq-eyebrow-txt">F A Q</span>
              <span className="faq-eyebrow-bar" />
            </div>

            <h2 className="faq-main-title">
              Perguntas <br />
              <em className="faq-title-accent">Frequentes.</em>
            </h2>

            <p className="faq-main-desc">
              Tire suas dúvidas sobre avaliação, tratamentos personalizados e o método exclusivo da Dra. Isabella Ferro.
            </p>

            <a href="#contato" className="faq-contact-link" data-magnetic>
              <span className="faq-link-circle">
                <ArrowRight size={14} />
              </span>
              <span>Falar com a nossa equipe</span>
            </a>
          </div>

          {/* ================= MIDDLE COLUMN: 5 BENTO 3D FLIP CARDS ================= */}
          <div className="faq-col-center">
            <div className="faq-cards-grid">
              {FAQ.map((item, idx) => {
                const isFlipped = flippedIndex === idx
                const numStr = String(idx + 1).padStart(2, '0')
                const isBlueLiquidCard = idx === 0
                const isWideCard = idx === 4

                return (
                  <button
                    type="button"
                    key={idx}
                    className={`faq-flip-card ${isWideCard ? 'is-wide-card' : ''} ${
                      isFlipped ? 'is-flipped' : ''
                    }`}
                    onClick={() => handleCardClick(idx)}
                    aria-disabled={isAnimating}
                    aria-controls={`faq-answer-${idx}`}
                    aria-expanded={isFlipped}
                    aria-label={`Pergunta ${numStr}: ${item.q}`}
                  >
                    <div className="faq-flip-card-inner">
                      {/* FRONT FACE (Question) */}
                      <div
                        aria-hidden={isFlipped}
                        className={`faq-card-face faq-card-front ${
                          isBlueLiquidCard ? 'card-front-blue-liquid' : 'card-front-frosted'
                        }`}
                      >
                        <div className="faq-card-top-row">
                          <span className="faq-card-num">{numStr}</span>
                          <span className="faq-card-action-btn" aria-hidden="true">
                            <Plus size={16} />
                          </span>
                        </div>
                        <span className="faq-card-question">{item.q}</span>
                      </div>

                      {/* BACK FACE (Answer) */}
                      <div
                        aria-hidden={!isFlipped}
                        className={`faq-card-face faq-card-back ${
                          isBlueLiquidCard ? 'card-back-blue-deep' : 'card-back-navy'
                        }`}
                      >
                        <div className="faq-card-top-row">
                          <span className="faq-card-num back-num">{numStr}</span>
                          <span className="faq-card-action-btn back-btn" aria-hidden="true">
                            <RotateCcw size={14} />
                          </span>
                        </div>
                        <p id={`faq-answer-${idx}`} className="faq-card-answer" aria-hidden={!isFlipped}>{item.a}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* ================= RIGHT COLUMN: DOCTOR PHOTO CARD + WHATSAPP CARD ================= */}
          <div className="faq-col-right">
            {/* Top Doctor Showcase Card (Matching reference photo & typography) */}
            <div className="faq-side-doctor-card">
              <img
                src={assetUrl('/img/dra_faq_clean.webp')}
                alt="Dra. Isabella Ferro — Odontologia Estética"
                className="faq-side-doctor-img"
              />
              <div className="faq-side-doctor-overlay" />

              <div className="faq-side-doctor-content">
                <div className="faq-doctor-monogram">if</div>
                <strong className="faq-doctor-name">Dra. Isabella Ferro</strong>
                <span className="faq-doctor-cro">CRO 140267</span>
                <span className="faq-doctor-spec">Odontologia Estética</span>
              </div>
            </div>

            {/* Bottom Concierge WhatsApp Card */}
            <div className="faq-side-cta-card">
              <span className="faq-cta-tag">ATENDIMENTO PRIVATIVO</span>
              <h4 className="faq-cta-headline">Ainda tem alguma dúvida?</h4>
              <p className="faq-cta-sub">
                Nossa equipe está pronta para orientar você e agendar sua consulta exclusiva.
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="faq-cta-whatsapp-btn"
                data-magnetic
              >
                <WhatsAppIcon width={16} height={16} />
                <span>Conversar pelo WhatsApp</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
