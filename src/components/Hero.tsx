import CardHoverLight from './CardHoverLight'
import SectionBackground from './SectionBackground'
import { useEffect, useRef, useState } from 'react'
import { ChevronDown, ArrowDown, Lock, Play } from 'lucide-react'
import { ToothIcon, FaceIcon, ShieldIcon, DiamondIcon } from './Icons'
import { AttentionArrow } from './LottieflowIcons'
import { WHATSAPP_URL } from '../data'
import { assetUrl } from '../utils/assets'
import {
  useLineDraw,
  useParallax,
  useMagneticButton,
  useCardTilt,
  useFloat,
} from '../animations/hooks'

interface HeroProps {
  onOpenVideo?: () => void
}

export default function Hero({ onOpenVideo }: HeroProps) {
  const rootRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(true)

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

  useLineDraw(rootRef)
  useParallax(rootRef)
  useMagneticButton(rootRef)
  useCardTilt(rootRef)
  useFloat(rootRef)

  return (
    <section
      ref={rootRef}
      id="inicio"
      className={`hero-stage-wrapper ${inView ? 'is-section-inview' : ''}`}
      aria-label="Apresentação"
    >
      <SectionBackground variant="static" />
      {/* Full-bleed Luxury Clinic Background Layer */}
      <div className="hero-full-bg-layer" aria-hidden="true">
        <img
          src={assetUrl('/img/clinica.webp')}
          alt=""
          className="hero-full-bg-img"
        />
        <div className="hero-full-bg-overlay" />
      </div>

      {/* Background SVG Splines & Atmospheric Soft Blue Waves (Animated when in view) */}
      <div className="hero-svg-canvas-wrap" aria-hidden="true">
        <svg viewBox="0 0 1672 941" fill="none" preserveAspectRatio="none" className="hero-svg-spline">
          <defs>
            <linearGradient id="hero-wave-fill-top" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#d9ebff" stopOpacity="0.68" />
              <stop offset="60%" stopColor="#eaf4ff" stopOpacity="0.38" />
              <stop offset="100%" stopColor="#f8fbff" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="hero-wave-fill-bot" x1="1" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#d4e7ff" stopOpacity="0.62" />
              <stop offset="65%" stopColor="#e8f2ff" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Soft Organic Wave Fill — Top Left & Right Corners */}
          <path
            className="hero-svg-organic-fill hero-svg-fill-1"
            d="M 0 0 L 1672 0 L 1672 340 C 1380 420, 1140 190, 820 290 C 510 390, 260 220, 0 360 Z"
            fill="url(#hero-wave-fill-top)"
          />

          {/* Soft Organic Wave Fill — Bottom Left & Right Corners */}
          <path
            className="hero-svg-organic-fill hero-svg-fill-2"
            d="M 0 640 C 340 530, 620 740, 980 610 C 1290 500, 1490 660, 1672 560 L 1672 941 L 0 941 Z"
            fill="url(#hero-wave-fill-bot)"
          />

          {/* Animated Flowing Spline 1 */}
          <path
            className="hero-spline-line hero-spline-line-1"
            d="M -40 430 C 210 290, 450 510, 670 380 C 870 260, 1050 670, 1290 400 C 1450 220, 1560 440, 1710 350"
            stroke="#0056d6"
            strokeWidth="2.2"
            strokeOpacity="0.46"
          />

          {/* Animated Flowing Dashed Spline 2 */}
          <path
            className="hero-spline-line hero-spline-line-2"
            d="M 380 640 C 610 730, 900 660, 1080 530 C 1240 410, 1340 230, 1170 150 C 1000 70, 830 190, 750 320"
            stroke="#0056d6"
            strokeWidth="1.5"
            strokeOpacity="0.32"
            strokeDasharray="8 8"
          />

          {/* Animated Accent Spline 3 */}
          <path
            className="hero-spline-line hero-spline-line-3"
            d="M -20 720 C 260 610, 520 810, 840 680 C 1150 550, 1410 740, 1700 610"
            stroke="#3d8bff"
            strokeWidth="1.4"
            strokeOpacity="0.28"
          />
        </svg>
      </div>

      {/* =====================================================================
          DESKTOP MASTER CANVAS (≥ 1024px) — Clínica de Sorrisos Exclusivos.png
         ===================================================================== */}
      <div className="hero-master-canvas hero-desktop-only">
        {/* LEFT COLUMN */}
        <div className="hero-col-left">
          <div className="hero-pill-badge" data-hero-fade>
            <span>Odontologia Estética <em>&amp; Harmonização Facial</em></span>
          </div>

          <h1 className="hero-headline" data-hero-fade>
            A Arte de Criar <br />
            <em className="hero-headline-accent">Sorrisos &amp; Harmonização</em> <br />
            Exclusivos.
          </h1>

          <p className="hero-lead-text" data-hero-fade>
            Excelência em Lentes em Resina, Porcelana e Harmonização Facial para quem busca naturalidade,
            sofisticação e resultados impecáveis.
          </p>

          <div className="hero-action-group" data-hero-fade>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-main-cta"
              data-magnetic
            >
              <span>Solicitar Avaliação Privativa</span>
              <span className="hero-cta-circle">
                <AttentionArrow size={16} />
              </span>
            </a>

            <div className="hero-trust-lock">
              <Lock width={14} height={14} className="hero-lock-icon" />
              <span>Atendimento personalizado e número limitado de pacientes.</span>
            </div>
          </div>

          <div className="hero-clinic-teaser" data-hero-fade>
            <button
              type="button"
              onClick={onOpenVideo}
              className="hero-teaser-btn"
              aria-label="Assistir tour da clínica"
            >
              <img
                src={assetUrl('/img/clinica.webp')}
                alt="Ambiente moderno da clínica"
                className="hero-teaser-img"
              />
              <span className="hero-teaser-play">
                <Play width={13} height={13} fill="#ffffff" stroke="#ffffff" />
              </span>
            </button>
            <div className="hero-teaser-info">
              <span className="hero-teaser-tag">CONHEÇA</span>
              <span className="hero-teaser-name">NOSSO ESPAÇO</span>
            </div>
          </div>
        </div>

        {/* CENTER: DOCTOR PORTRAIT & CLINIC BACKDROP */}
        <div className="hero-col-center">
          <div className="hero-clinic-backdrop-blur" aria-hidden="true">
            <img src={assetUrl('/img/clinica.webp')} alt="" className="hero-clinic-bg-img" />
            <div className="hero-clinic-bg-glow" />
          </div>

          <div className="hero-top-arc-text" aria-hidden="true">
            <span>NATURALIDADE</span>
            <span>EM CADA</span>
            <span>DETALHE</span>
            <i className="hero-arc-line" />
          </div>

          <div className="hero-bg-faded-smile" aria-hidden="true">
            <img src={assetUrl('/img/skincare-sorriso.webp')} alt="" className="hero-bg-faded-img" />
          </div>

          <div className="hero-doctor-frame">
            <img
              src={assetUrl('/img/dra_master_hero.webp')}
              alt="Dra. Isabella Ferro - Odontologia Estética e Harmonização"
              className="hero-doctor-image"
              loading="eager"
            />
          </div>
        </div>

        {/* FLOATING LIQUID GLASSMORPHISM CARDS */}
        <div className="hero-card-pos hero-card-planejamento hero-glass-card has-card-light" data-hero-card data-tilt>
          <CardHoverLight />
          <div className="hero-card-icon-pill">
            <ToothIcon width={20} height={20} />
          </div>
          <div className="hero-card-texts">
            <strong className="hero-card-h">Planejamento 3D Exclusivo</strong>
            <span className="hero-card-sub">Design personalizado guiado pela face.</span>
          </div>
          <a href="#especialidades" className="hero-card-round-arrow" aria-label="Ver planejamento" data-tilt-arrow>
            <AttentionArrow size={14} />
          </a>
        </div>

        <div className="hero-card-pos hero-card-resultados hero-glass-card has-card-light" data-hero-card data-tilt>
          <CardHoverLight />
          <div className="hero-card-icon-pill">
            <FaceIcon width={20} height={20} />
          </div>
          <div className="hero-card-texts">
            <strong className="hero-card-h">Harmonização Facial</strong>
            <span className="hero-card-sub">Estética e harmonia com sua identidade.</span>
          </div>
          <a href="#experiencia" className="hero-card-round-arrow" aria-label="Ver harmonização" data-tilt-arrow>
            <AttentionArrow size={14} />
          </a>
        </div>

        {/* Signature & Credentials Floating cleanly on Right */}
        <div className="hero-card-signature" data-hero-card data-float>
          <div className="hero-sig-monogram">if</div>
          <div className="hero-sig-details">
            <strong className="hero-sig-title">Dra. Isabella Ferro</strong>
            <span className="hero-sig-cro">CRO 140267</span>
            <span className="hero-sig-school">Odontologia Estética &amp; Facial</span>
          </div>
        </div>

        {/* Right Macro Veneer Card */}
        <div className="hero-card-pos hero-card-smile-macro hero-glass-card has-card-light" data-hero-card data-tilt>
          <CardHoverLight />
          <div className="hero-macro-top">
            <span className="hero-macro-tag">LENTES EM RESINA E PORCELANA</span>
            <a href="#especialidades" className="hero-macro-link" aria-label="Ver lentes" data-tilt-arrow>
              <AttentionArrow size={15} diagonal />
            </a>
          </div>
          <div className="hero-macro-photo-frame">
            <img
              src={assetUrl('/img/porcelana_vertical.webp')}
              alt="Macro fotografia de lentes cerâmicas ultrafinas"
              className="hero-macro-img"
              data-tilt-img
              data-parallax="4"
            />
          </div>
          <p className="hero-macro-caption">
            Sorrisos que realçam o que te torna único.
          </p>
        </div>

        {/* Non-clickable floating Scroll Indicator */}
        <div className="hero-bottom-exploration" aria-hidden="true">
          <div className="hero-explore-btn hero-scroll-float-only">
            <span className="hero-explore-round">
              <ChevronDown width={16} height={16} />
            </span>

          </div>
        </div>
      </div>

      {/* =====================================================================
          MOBILE LAYOUT (< 1024px) — Exact Match to 01_hero_mobile.png
         ===================================================================== */}
      <div className="hero-mobile-only">
        {/* Top Hero Split: Left Copy + Right Curved Portrait Arch */}
        <div className="hm-top-split">
          <div className="hm-left-copy">
            <div className="hm-eyebrow">
              <span>ODONTOLOGIA ESTÉTICA</span>
              <span>DE ALTO PADRÃO</span>
              <i className="hm-eyebrow-line" />
            </div>

            <h1 className="hm-headline">
              A Arte de <br />
              Criar <br />
              <em className="hm-headline-accent">Sorrisos</em> <br />
              Exclusivos.
            </h1>

            <p className="hm-lead">
              Excelência em Lentes em Resina, Porcelana e Harmonização Facial para quem busca
              naturalidade, sofisticação e resultados impecáveis.
            </p>
          </div>

          {/* Right Curved Smile Arch + Rotating Stamp */}
          <div className="hm-right-arch-wrap">
            <div className="hm-right-arch-photo">
              <img
                src={assetUrl('/img/dra_master_hero.webp')}
                alt="Dra. Isabella Ferro"
                className="hm-arch-img"
              />
            </div>

            {/* Circular Stamp Overlapping Arch */}
            <div className="hm-stamp-badge">
              <svg viewBox="0 0 140 140" className="hm-stamp-svg" aria-hidden="true">
                <path
                  id="hm-stamp-path"
                  d="M 70, 70 m -50, 0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0"
                  fill="none"
                />
                <text className="hm-stamp-text">
                  <textPath href="#hm-stamp-path" startOffset="0%">
                    • NATURALIDADE • EM CADA DETALHE
                  </textPath>
                </text>
              </svg>
              <div className="hm-stamp-center">
                <DiamondIcon width={18} height={18} />
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Primary CTA Pill */}
        <div className="hm-cta-wrap">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hm-cta-btn"
          >
            <span>Solicitar Avaliação Privativa</span>
            <span className="hm-cta-arrow-circle">
              <AttentionArrow size={16} />
            </span>
          </a>

          <div className="hm-lock-row">
            <span className="hm-lock-badge">
              <Lock width={13} height={13} />
            </span>
            <span>Atendimento personalizado e número limitado de pacientes.</span>
          </div>
        </div>

        {/* 3 Mini Cards Row (Exact match to 01_hero_mobile.png) */}
        <div className="hm-3cards-grid">
          <a href="#especialidades" className="hm-mini-card hero-glass-card">
            <span className="hm-mini-icon">
              <ToothIcon width={18} height={18} />
            </span>
            <strong className="hm-mini-title">Planejamento Personalizado</strong>
            <span className="hm-mini-desc">Cada sorriso é único.</span>
            <span className="hm-mini-arrow">
              <AttentionArrow size={13} />
            </span>
          </a>

          <a href="#experiencia" className="hm-mini-card hero-glass-card">
            <span className="hm-mini-icon">
              <ShieldIcon width={18} height={18} />
            </span>
            <strong className="hm-mini-title">Conforto e Segurança</strong>
            <span className="hm-mini-desc">Ambiente moderno e tecnologia de ponta.</span>
            <span className="hm-mini-arrow">
              <AttentionArrow size={13} />
            </span>
          </a>

          <a href="#sobre" className="hm-mini-card hero-glass-card">
            <span className="hm-mini-icon">
              <FaceIcon width={18} height={18} />
            </span>
            <strong className="hm-mini-title">Atendimento Exclusivo</strong>
            <span className="hm-mini-desc">Foco total em você.</span>
            <span className="hm-mini-arrow">
              <AttentionArrow size={13} />
            </span>
          </a>
        </div>

        {/* Wide Clinic Video Banner Card */}
        <button
          type="button"
          onClick={onOpenVideo}
          className="hm-video-banner"
          aria-label="Conheça nosso espaço em vídeo"
        >
          <img
            src={assetUrl('/img/clinica.webp')}
            alt="Espaço da clínica Dra. Isabella Ferro"
            className="hm-video-banner-img"
          />
          <div className="hm-video-banner-overlay">
            <span className="hm-video-play-circle">
              <Play width={18} height={18} fill="#0b192c" stroke="#0b192c" />
            </span>
            <span className="hm-video-banner-label">
              Conheça <br />
              nosso espaço
            </span>
          </div>
        </button>

        {/* +500 Social Proof Bar */}
        <div className="hm-social-proof-pill hero-glass-card">
          <div className="hm-avatars-stack">
            <img src={assetUrl('/img/sobre_adulta.webp')} alt="" className="hm-avatar-img" />
            <img src={assetUrl('/img/exemplo_harmonizacao.webp')} alt="" className="hm-avatar-img" />
            <img src={assetUrl('/img/exemplo2.webp')} alt="" className="hm-avatar-img" />
            <img src={assetUrl('/img/skincare-sorriso.webp')} alt="" className="hm-avatar-img" />
          </div>
          <div className="hm-proof-texts">
            <strong className="hm-proof-num">+500</strong>
            <span className="hm-proof-sub">Sorrisos transformados</span>
            <span className="hm-proof-sub">Resultados reais e naturais.</span>
          </div>
        </div>

        {/* Bottom Scroll Cue — Non-clickable floating notice */}
        <div className="hm-scroll-cue hero-scroll-float-only" aria-hidden="true">
          <span className="hm-scroll-circle">
            <ArrowDown width={14} height={14} />
          </span>
        </div>
      </div>
    </section>
  )
}
