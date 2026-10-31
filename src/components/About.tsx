import { useRef } from 'react'
import { Award, GraduationCap, HeartHandshake } from 'lucide-react'
import { WHATSAPP_URL } from '../data'
import {
  useMagneticButton,
  useCardTilt,
  useExpandPhotoOnScroll,
} from '../animations/hooks'
import FluidRevealCanvas from './FluidRevealCanvas'
import Stack from './Stack'
import { AttentionArrow } from './LottieflowIcons'
import { assetUrl } from '../utils/assets'

export default function About() {
  const rootRef = useRef<HTMLElement>(null)

  useMagneticButton(rootRef)
  useCardTilt(rootRef)
  useExpandPhotoOnScroll(rootRef)

  const stackCards = [
    <div key="ciencia" className="about-stack-card-inner about-stack-tone-1">
      <div className="about-stack-card-left">
        <div className="about-stack-texts">
          <strong className="about-science-tags">CIÊNCIA &bull; ARTE &bull; NATURALIDADE</strong>
          <p className="about-science-desc">Cuidado individualizado em cada etapa.</p>
        </div>
      </div>
      <span className="about-stack-badge">01 / 04</span>
    </div>,
    <div key="dentistica" className="about-stack-card-inner about-stack-tone-2">
      <div className="about-stack-card-left">
        <div className="about-stack-icon-pill">
          <GraduationCap width={20} height={20} className="about-cred-icon" />
        </div>
        <div className="about-stack-texts">
          <strong>Dentística &amp; Harmonização Facial</strong>
          <p>Protocolos avançados em Lentes de Resina, Porcelana e Full Face</p>
        </div>
      </div>
      <span className="about-stack-badge">02 / 04</span>
    </div>,
    <div key="excelencia" className="about-stack-card-inner about-stack-tone-3">
      <div className="about-stack-card-left">
        <div className="about-stack-icon-pill">
          <Award width={20} height={20} className="about-cred-icon" />
        </div>
        <div className="about-stack-texts">
          <strong>Excelência Estética</strong>
          <p>Planejamento digital tridimensional personalizado para cada sorriso</p>
        </div>
      </div>
      <span className="about-stack-badge">03 / 04</span>
    </div>,
    <div key="privativo" className="about-stack-card-inner about-stack-tone-4">
      <div className="about-stack-card-left">
        <div className="about-stack-icon-pill">
          <HeartHandshake width={20} height={20} className="about-cred-icon" />
        </div>
        <div className="about-stack-texts">
          <strong>Atendimento Privativo</strong>
          <p>Número limitado de pacientes por período para máxima dedicação</p>
        </div>
      </div>
      <span className="about-stack-badge">04 / 04</span>
    </div>,
  ]

  return (
    <section ref={rootRef} id="sobre" className="about-section" aria-label="Sobre a Dra. Isabella Ferro">
      {/* Organic Soft Blue SVG Waves & Splines for Atmospheric Depth */}
      <div className="about-bg-organic-svg" aria-hidden="true">
        <svg viewBox="0 0 1600 900" fill="none" preserveAspectRatio="none" className="about-svg-canvas">
          <defs>
            <linearGradient id="about-wave-top" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#dfeeff" stopOpacity="0.72" />
              <stop offset="55%" stopColor="#eef6ff" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="about-wave-bot" x1="1" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#d9ebff" stopOpacity="0.68" />
              <stop offset="60%" stopColor="#ebf4ff" stopOpacity="0.38" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M 0 0 L 1600 0 L 1600 280 C 1320 380, 1020 140, 680 260 C 360 370, 160 190, 0 310 Z"
            fill="url(#about-wave-top)"
          />
          <path
            d="M 0 640 C 320 520, 660 760, 1040 610 C 1320 500, 1480 650, 1600 580 L 1600 900 L 0 900 Z"
            fill="url(#about-wave-bot)"
          />
          <path
            d="M -30 240 C 280 120, 580 360, 920 210 C 1220 80, 1440 290, 1640 180"
            stroke="#0056d6"
            strokeWidth="1.5"
            strokeOpacity="0.18"
            strokeDasharray="7 7"
          />
          <path
            d="M -20 710 C 340 590, 720 820, 1120 660 C 1380 550, 1510 700, 1630 630"
            stroke="#3d8bff"
            strokeWidth="1.6"
            strokeOpacity="0.22"
          />
        </svg>
      </div>

      <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
          {/* Mobile Header (Exact match to 02_sobre_mobile.png) */}
          <div className="about-mobile-header about-anim-up">
            <span className="about-mobile-eyebrow">S O B R E</span>
            <h2 className="about-mobile-title">
              Dra. Isabella <br />
              <span className="text-accent-blue">Ferro.</span>
            </h2>
          </div>

          <div className="about-grid">
            {/* Left: Doctor Fluid Reveal Interactive Portrait (Lando Norris Effect: Adulta -> Criança) */}
            <div className="about-media-col about-anim-up">
              <div className="about-photo-card" data-expand-photo>
                <div className="about-photo-wrap">
                  <FluidRevealCanvas
                    topSrc={assetUrl('/img/sobre_adulta.png')}
                    bottomSrc={assetUrl('/img/sobre_crianca.png')}
                  />
                </div>
              </div>
            </div>

            {/* Right: Biography & Authority */}
            <div className="about-content-col about-anim-up">
              {/* Desktop Eyebrow & Title */}
              <div className="about-desktop-header">
                <div className="section-eyebrow">
                  <span>S O B R E</span>
                  <span className="eyebrow-line" />
                </div>

                <h2 className="about-title">
                  Dra. Isabella <span className="text-accent-blue">Ferro.</span>
                </h2>
              </div>

              <p className="about-mandic-sub">
                Odontologia Estética, Reabilitação Oral &amp; Harmonização Facial
              </p>

              <h3 className="about-highlight-sub">
                Precisão técnica e sensibilidade estética.
              </h3>

              <div className="about-text">
                <p>
                  Cada sorriso é planejado de forma exclusiva, respeitando a harmonia facial e a
                  identidade de cada paciente.
                </p>
                <p className="about-desktop-extra-p">
                  Com foco em naturalidade e sofisticação, a Dra. Isabella Ferro dedica sua prática
                  clínica à criação de lentes em resina composta, porcelana e harmonização facial que
                  se integram perfeitamente aos traços de cada rosto.
                </p>
              </div>

              {/* Subtle Interactive React Bits <Stack /> for Pillars & Credentials */}
              <div className="about-stack-wrapper">
                <div className="about-stack-stage">
                  <Stack
                    layout="deck"
                    visible={4}
                    spread={0.35}
                    depth={0.28}
                    radius={18}
                    frame={0}
                    shadow={false}
                    tilt={0}
                    threshold={70}
                    speed={1}
                    sendToBackOnClick={true}
                    autoplay={true}
                    autoplayDelay={4200}
                    pauseOnHover={true}
                    cards={stackCards}
                  />
                </div>
              </div>

              <div className="about-cta-wrap">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-main-cta"
                  data-magnetic
                >
                  <span>Conhecer a Dra. Isabella</span>
                  <span className="hero-cta-circle">
                    <AttentionArrow size={16} />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
    </section>
  )
}
