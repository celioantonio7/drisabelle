import { useEffect, useRef, useState } from 'react'
import { ArrowDown } from 'lucide-react'
import { ToothIcon, FaceIcon, ShieldIcon, DiamondIcon } from './Icons'
import { AttentionArrow } from './LottieflowIcons'
import { WHATSAPP_URL } from '../data'
import { assetUrl } from '../utils/assets'
import { useMotion } from '../animations/useMotion'
import {
  useParallax,
  useMagneticButton,
  useCardTilt,
  useExpandPhotoOnScroll,
} from '../animations/hooks'
import { gsap } from '../animations/gsap'

export default function Specialties() {
  const rootRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = rootRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setInView(entry.isIntersecting)
        }
      },
      { threshold: 0.12 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useParallax(rootRef)
  useMagneticButton(rootRef)
  useCardTilt(rootRef)
  useExpandPhotoOnScroll(rootRef)

  useMotion(rootRef, ({ motion, desktop }, root) => {
    if (!motion) return

    // Mode B (Codrops-Paper 3D Sheet Unfold & Differential Card Scrub)
    if (desktop) {
      const card01 = root.querySelector('.spec-card-01-pos')
      const card02 = root.querySelector('.spec-card-02-pos')
      const planCard = root.querySelector('.spec-floating-planning-card')

      if (card01 && card02) {
        gsap.fromTo(
          card01,
          { y: 42, rotateX: 5, transformPerspective: 1100 },
          {
            y: 0,
            rotateX: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top 80%',
              end: 'center 52%',
              scrub: 0.65,
            },
          },
        )
        gsap.fromTo(
          card02,
          { y: 74, rotateX: 6, transformPerspective: 1100 },
          {
            y: 22,
            rotateX: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top 76%',
              end: 'center 48%',
              scrub: 0.75,
            },
          },
        )
      }

      if (planCard) {
        gsap.fromTo(
          planCard,
          { y: 28 },
          {
            y: -14,
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8,
            },
          },
        )
      }
    }
  })

  return (
    <section
      ref={rootRef}
      id="especialidades"
      className={`spec-stage-wrapper ${inView ? 'is-section-inview' : ''}`}
      aria-label="Especialidades"
    >
      {/* Layered Organic Background Matching "Excelência em Cada Detalhe.png" */}
      <div className="spec-bg-organic-canvas" aria-hidden="true">
        <svg viewBox="0 0 1536 1024" fill="none" preserveAspectRatio="none" className="spec-svg-bg">
          <defs>
            <linearGradient id="spec-base-periwinkle" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e6effb" />
              <stop offset="52%" stopColor="#dce8f8" />
              <stop offset="100%" stopColor="#eef4fc" />
            </linearGradient>
            <linearGradient id="spec-left-white-lobe" x1="0" y1="0" x2="0.9" y2="0.9">
              <stop offset="0%" stopColor="#f8fbff" />
              <stop offset="65%" stopColor="#f3f8fe" />
              <stop offset="100%" stopColor="#eaf2fc" stopOpacity="0.92" />
            </linearGradient>
            <linearGradient id="spec-top-petal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e2ecfa" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#f5f9ff" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Soft Periwinkle Base Canvas */}
          <rect width="1536" height="1024" fill="url(#spec-base-periwinkle)" />

          {/* Sweeping White/Ice Left Organic Lobe Embracing Headline & CTA */}
          <path
            d="M 0 0 L 640 0 C 650 210, 560 460, 430 630 C 310 785, 130 770, 0 715 Z"
            fill="url(#spec-left-white-lobe)"
          />

          {/* Inner Layered Soft Blue-Grey Curves at Top-Left (Exact Match to Reference) */}
          <path
            d="M 270 0 L 630 0 C 610 130, 540 225, 535 235 C 425 180, 330 95, 270 0 Z"
            fill="url(#spec-top-petal)"
          />
          <path
            d="M 445 0 L 645 0 C 635 120, 610 210, 555 245 C 485 185, 455 95, 445 0 Z"
            fill="#e3edf9"
            opacity="0.65"
          />

          {/* Subtle Bottom Organic Wave Behind 4-Pillar Bar */}
          <path
            d="M 0 830 C 380 770, 790 885, 1180 815 C 1360 785, 1465 820, 1536 805 L 1536 1024 L 0 1024 Z"
            fill="#f7faff"
            opacity="0.78"
          />
        </svg>
      </div>

      <div className="spec-master-canvas">
        {/* ================= TOP STAGE: LEFT EDITORIAL COPY + STAMP + RIGHT CURVED SMILE HERO ================= */}
        <div className="spec-top-row">
          {/* Left Lead Column */}
          <div className="spec-col-lead" data-spec-reveal>
            <div className="spec-eyebrow-pill">
              <span>ESPECIALIDADES</span>
            </div>

            <h2 className="spec-headline">
              Excelência <br />
              em <span className="spec-headline-accent">cada</span> <br />
              detalhe.
            </h2>

            <span className="spec-title-rule" aria-hidden="true" />

            <p className="spec-lead-desc">
              Lentes em Resina e Porcelana com técnica, <br className="spec-br-desk" />
              naturalidade e resultados que respeitam <br className="spec-br-desk" />
              a sua identidade.
            </p>

            {/* Desktop CTA (Dark Navy Circle + Arrow on Left, Clean Text on Right) */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="spec-action-pill-btn spec-desktop-btn"
              data-magnetic
            >
              <span className="spec-action-icon-circle">
                <AttentionArrow size={17} />
              </span>
              <span className="spec-action-label">
                Conheça nossas <br />
                especialidades
              </span>
            </a>

            {/* Mobile Discover Cue (Exact match to 03_especialidades_mobile.png) */}
            <a href="#spec-cards" className="spec-mobile-discover-btn">
              <span className="spec-mobile-discover-circle">
                <ArrowDown width={15} height={15} />
              </span>
              <span>
                Descubra <br />
                nossas especialidades
              </span>
            </a>
          </div>

          {/* Center Rotating Stamp (NO STAR — Uses ToothIcon per user rule) */}
          <div className="spec-center-stamp-pos" data-spec-reveal>
            <div className="spec-stamp-badge">
              <div className="spec-stamp-inner-ring" aria-hidden="true" />
              <svg viewBox="0 0 160 160" className="spec-stamp-svg" aria-hidden="true">
                <path
                  id="spec-stamp-circle-path"
                  d="M 80, 80 m -56, 0 a 56,56 0 1,1 112,0 a 56,56 0 1,1 -112,0"
                  fill="none"
                />
                <text className="spec-stamp-text">
                  <textPath href="#spec-stamp-circle-path" startOffset="0%">
                    SORRISOS &mdash; COM IDENTIDADE &mdash;
                  </textPath>
                </text>
              </svg>
              <div className="spec-stamp-sparkle">
                <ToothIcon width={22} height={22} />
              </div>
            </div>
          </div>

          {/* Top Right Curved Smile Photo + Translucent Capsule Arch + Floating Planning Card */}
          <div className="spec-top-right-group" data-spec-reveal>
            <div className="spec-beauty-arch-frame">
              <img
                src={assetUrl('/img/spec_smile_hero_clean.jpg')}
                alt="Sorriso natural esculpido com excelência"
                className="spec-beauty-photo"
                data-parallax="4"
              />
            </div>

            {/* Translucent Vertical Capsule Arch Rising Behind the Glass Card */}
            <div className="spec-capsule-backdrop" aria-hidden="true" />

            {/* Floating Preenchimento Labial / Harmonização Glass Card (Com preenchimento_clean.png) */}
            <div className="spec-floating-planning-card spec-floating-preenchimento-card hero-glass-card" data-tilt>
              <div className="spec-plan-thumb-box">
                <img
                  src={assetUrl('/img/preenchimento_clean.png')}
                  alt="Resultado real de preenchimento labial e harmonização facial pela Dra. Isabella Ferro"
                  className="spec-plan-thumb-img"
                  loading="lazy"
                />
              </div>
              <div className="spec-plan-info">
                <strong className="spec-plan-title">
                  Harmonização &amp; <br />
                  Preenchimento
                </strong>
                <p className="spec-plan-text">
                  Escultura labial com proporção áurea, volume sutil e naturalidade absoluta.
                </p>
              </div>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="spec-plan-arrow"
                aria-label="Agendar avaliação de preenchimento e harmonização"
              >
                <AttentionArrow size={15} />
              </a>
            </div>
          </div>
        </div>

        {/* ================= MIDDLE ROW: GEOMETRIC SCULPTED CARDS 01 & 02 ================= */}
        <div id="spec-cards" className="spec-cards-row">
          {/* CARD 01: LENTES EM RESINA */}
          <div className="spec-card-pos spec-card-01-pos" data-spec-reveal data-tilt>
            <div className="spec-card-inner">
              <div className="spec-card-text-side">
                <span className="spec-card-index">01</span>
                <span className="spec-card-index-rule" aria-hidden="true" />
                <h3 className="spec-card-heading">
                  Lentes em <br />
                  Resina
                </h3>
                <p className="spec-card-summary">
                  Reestruturação estética minimamente invasiva, com naturalidade e refinamento imediato.
                </p>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="spec-card-action-link"
                  data-tilt-arrow
                >
                  <span className="spec-card-action-circle">
                    <AttentionArrow size={15} />
                  </span>
                  <span>Saiba mais</span>
                </a>
              </div>
              <div className="spec-card-photo-wrap">
                <img
                  src={assetUrl('/img/spec_resina_ref.jpg')}
                  alt="Resultado de lentes em resina composta de alto padrão"
                  className="spec-card-img"
                  data-tilt-img
                />
              </div>
            </div>
          </div>

          {/* CARD 02: LENTES EM PORCELANA */}
          <div className="spec-card-pos spec-card-02-pos" data-spec-reveal data-tilt>
            <div className="spec-card-inner spec-card-02-inner">
              <div className="spec-card-text-side">
                <span className="spec-card-index">02</span>
                <span className="spec-card-index-rule" aria-hidden="true" />
                <h3 className="spec-card-heading">
                  Lentes em <br />
                  Porcelana
                </h3>
                <p className="spec-card-summary">
                  Alta performance estética, durabilidade superior e acabamento impecável para um sorriso sofisticado.
                </p>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="spec-card-action-link"
                  data-tilt-arrow
                >
                  <span className="spec-card-action-circle">
                    <AttentionArrow size={15} />
                  </span>
                  <span>Saiba mais</span>
                </a>
              </div>
              <div className="spec-card-photo-wrap">
                <img
                  src={assetUrl('/img/spec_porcelana_ref.jpg')}
                  alt="Resultado de lentes em porcelana pura ultrafina"
                  className="spec-card-img"
                  data-tilt-img
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM ROW: FULL-WIDTH 4-PILLAR GLASS BAR (Exact Match to Reference) ================= */}
        <div className="spec-pillars-bar" data-spec-reveal>
          <div className="spec-pillars-grid">
            <div className="spec-pillar-item">
              <div className="spec-pillar-icon-box">
                <ToothIcon width={24} height={24} />
              </div>
              <div className="spec-pillar-texts">
                <h4 className="spec-pillar-name">Clínica Geral</h4>
                <p className="spec-pillar-desc">
                  Saúde bucal completa <br className="spec-br-desk" />
                  para todas as fases da vida.
                </p>
              </div>
            </div>

            <div className="spec-pillar-item">
              <div className="spec-pillar-icon-box">
                <FaceIcon width={24} height={24} />
              </div>
              <div className="spec-pillar-texts">
                <h4 className="spec-pillar-name">Harmonização Facial</h4>
                <p className="spec-pillar-desc">
                  Equilíbrio e beleza em <br className="spec-br-desk" />
                  harmonia com o seu sorriso.
                </p>
              </div>
            </div>

            <div className="spec-pillar-item">
              <div className="spec-pillar-icon-box">
                <ShieldIcon width={24} height={24} />
              </div>
              <div className="spec-pillar-texts">
                <h4 className="spec-pillar-name">Prevenção</h4>
                <p className="spec-pillar-desc">
                  Cuidado contínuo para <br className="spec-br-desk" />
                  um sorriso sempre saudável.
                </p>
              </div>
            </div>

            <div className="spec-pillar-item">
              <div className="spec-pillar-icon-box">
                <DiamondIcon width={24} height={24} />
              </div>
              <div className="spec-pillar-texts">
                <h4 className="spec-pillar-name">Estética Avançada</h4>
                <p className="spec-pillar-desc">
                  Soluções personalizadas <br className="spec-br-desk" />
                  para resultados extraordinários.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Dark Navy Banner (Exact match to 03_especialidades_mobile.png) */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="spec-mobile-navy-banner"
        >
          <div className="spec-navy-banner-left">
            <DiamondIcon width={18} height={18} className="spec-navy-diamond" />
            <p className="spec-navy-quote">
              Mais que um tratamento, <br />
              uma experiência <br />
              personalizada.
            </p>
          </div>
          <span className="spec-navy-arrow-pill">
            <AttentionArrow size={16} />
          </span>
        </a>
      </div>
    </section>
  )
}
