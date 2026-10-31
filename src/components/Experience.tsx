import { useEffect, useRef, useState } from 'react'
import { Play, User } from 'lucide-react'
import { ToothIcon } from './Icons'
import { AttentionArrow } from './LottieflowIcons'
import { WHATSAPP_URL } from '../data'
import {
  useLineDraw,
  useParallax,
  useMagneticButton,
  useCardTilt,
  useExpandPhotoOnScroll,
} from '../animations/hooks'
import Folder from './Folder'
import { assetUrl } from '../utils/assets'

interface ExperienceProps {
  onOpenVideo?: () => void
}

const FOLDER_ITEMS = [
  {
    image: assetUrl('/img/cases/case1_depois.jpg'),
    alt: 'Resultado Lentes em Porcelana',
  },
  {
    image: assetUrl('/img/cases/case2_depois.jpg'),
    alt: 'Resultado Lentes em Resina',
  },
  {
    image: assetUrl('/img/cases/case5_depois.jpg'),
    alt: 'Resultado Harmonização Facial',
  },
]

export default function Experience({ onOpenVideo }: ExperienceProps) {
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

  useLineDraw(rootRef)
  useParallax(rootRef)
  useMagneticButton(rootRef)
  useCardTilt(rootRef)
  useExpandPhotoOnScroll(rootRef)

  return (
    <section
      ref={rootRef}
      id="experiencia"
      className={`exp-stage-wrapper ${inView ? 'is-section-inview' : ''}`}
      aria-label="Experiência"
    >
      {/* Dynamic SVG Curves Weaving Through Section (Desktop) */}
      <div className="exp-svg-canvas-wrap" aria-hidden="true" data-draw>
        <svg viewBox="0 0 1672 941" fill="none" preserveAspectRatio="none" className="exp-svg-spline">
          <path
            d="M 40 430 C 260 220, 500 530, 760 310 C 1020 90, 1260 490, 1580 260"
            stroke="#0056d6"
            strokeWidth="2"
            strokeOpacity="0.4"
          />
          <path
            d="M 220 650 C 460 520, 720 750, 1000 560 C 1220 390, 1440 600, 1640 470"
            stroke="#0056d6"
            strokeWidth="1.2"
            strokeOpacity="0.22"
            strokeDasharray="6 6"
          />
        </svg>
      </div>

      {/* =====================================================================
          DESKTOP MASTER CANVAS (≥ 1024px) — Experiência Além do Procedimento.png
         ===================================================================== */}
      <div className="exp-master-canvas exp-desktop-only">
        <div className="exp-col-lead" data-exp-reveal>
          <div className="exp-eyebrow-pill">
            <span>EXPERIÊNCIA</span>
            <span className="exp-eyebrow-line" />
          </div>

          <h2 className="exp-headline">
            Uma experiência <br />
            além do <br />
            procedimento<span className="exp-headline-dot">.</span>
          </h2>

          <div className="exp-lead-paragraphs">
            <p>
              Mais do que resultados, cada etapa é pensada para proporcionar conforto,
              segurança e uma experiência verdadeiramente personalizada.
            </p>
            <p>
              Do primeiro contato ao acompanhamento final, você encontra um cuidado completo,
              que une precisão técnica, estética e respeito à sua história.
            </p>
          </div>

          <div className="exp-action-group">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="exp-cta-btn"
              data-magnetic
            >
              <span>Conheça nosso espaço</span>
              <AttentionArrow size={16} className="ml-2" />
            </a>

            <button
              type="button"
              onClick={onOpenVideo}
              className="exp-play-round-btn"
              aria-label="Assistir tour em vídeo"
            >
              <Play width={16} height={16} fill="#1e293b" stroke="#1e293b" />
            </button>
          </div>
        </div>

        <div className="exp-col-center" data-exp-reveal>
          <div className="exp-doctor-asym-frame" data-expand-photo>
            <img
              src={assetUrl('/img/dra_master_exp.png')}
              alt="Dra. Isabella Ferro em atendimento acolhedor"
              className="exp-doctor-img"
              loading="lazy"
              data-parallax="4"
            />
          </div>
        </div>

        <div className="exp-card-pos exp-c1-pos hero-glass-card" data-exp-reveal data-tilt>
          <div className="exp-icon-circle-pill">
            <ToothIcon width={20} height={20} />
          </div>
          <strong className="exp-card-heading">Acolhimento exclusivo</strong>
          <p className="exp-card-text">
            Um atendimento próximo, com escuta ativa e atenção total em cada etapa.
          </p>
          <a href="#contato" className="exp-card-arrow-link" aria-label="Acolhimento" data-tilt-arrow>
            <AttentionArrow size={14} />
          </a>
        </div>

        <div className="exp-card-pos exp-c2-pos hero-glass-card" data-exp-reveal data-tilt>
          <div className="exp-c2-content">
            <span className="exp-c2-tag">PLANEJAMENTO DETALHADO</span>
            <p className="exp-c2-desc">
              Analisamos sua face, suas proporções e seus objetivos para criar um plano único e personalizado.
            </p>
            <a href="#especialidades" className="exp-card-arrow-link" aria-label="Planejamento detalhado" data-tilt-arrow>
              <AttentionArrow size={14} />
            </a>
          </div>
          <div className="exp-c2-photo-wrap">
            <img
              src={assetUrl('/img/porcelana_vertical.jpg')}
              alt="Planejamento estético facial do sorriso"
              className="exp-c2-img"
              data-tilt-img
            />
          </div>
        </div>

        <div className="exp-card-pos exp-c3-pos exp-c3-folder-stage">
          <Folder
            mode="flap"
            variant="solid"
            layout="spread"
            color="#0056d6"
            paperColor="#ffffff"
            tabPosition="center"
            openOn="click"
            size={1.08}
            tilt={0.45}
            speed={1}
            bounce={0.4}
            peek
            intro
            draggable
            zoomOnClick
            theme="dark"
            items={FOLDER_ITEMS}
          />
        </div>

        <div className="exp-card-pos exp-c4-pos hero-glass-card" data-exp-reveal data-tilt>
          <div className="exp-c4-photo-box">
            <img
              src={assetUrl('/img/clinica.jpg')}
              alt="Ambiente estéril e moderno de atendimento"
              className="exp-c4-img"
              data-tilt-img
            />
          </div>
          <div className="exp-c4-info">
            <strong className="exp-c4-title">Conforto e segurança</strong>
            <p className="exp-c4-desc">
              Ambiente moderno, protocolos rigorosos e tecnologia de ponta para sua tranquilidade.
            </p>
            <button
              type="button"
              onClick={onOpenVideo}
              className="exp-card-arrow-link"
              aria-label="Ver espaço"
              data-tilt-arrow
            >
              <AttentionArrow size={14} />
            </button>
          </div>
        </div>

        <div className="exp-card-pos exp-c5-pos hero-glass-card" data-exp-reveal data-tilt>
          <div className="exp-c5-info">
            <div className="exp-icon-circle-pill" style={{ marginBottom: 8 }}>
              <User width={20} height={20} />
            </div>
            <strong className="exp-c5-title">Acompanhamento individualizado</strong>
            <p className="exp-c5-desc">
              Cuidado contínuo, com suporte próximo e atenção às suas necessidades.
            </p>
            <a href="#contato" className="exp-card-arrow-link" aria-label="Acompanhamento">
              <AttentionArrow size={14} />
            </a>
          </div>
          <div className="exp-c5-photo-box">
            <img
              src={assetUrl('/img/instrumentos.jpg')}
              alt="Instrumentos odontológicos de precisão"
              className="exp-c5-img"
            />
          </div>
        </div>
      </div>

      {/* =====================================================================
          MOBILE LAYOUT (< 1024px) — Exact Match to 04_experiencia_mobile.png
         ===================================================================== */}
      <div className="exp-mobile-only">
        <span className="em-eyebrow">E X P E R I Ê N C I A</span>

        <h2 className="em-headline">
          Uma experiência <br />
          <span className="text-accent-blue">além do</span> <br />
          procedimento.
        </h2>

        <p className="em-lead">
          Cada etapa é pensada para proporcionar conforto, segurança e atenção individualizada.
        </p>

        {/* Visual Showcase Card (with CONHEÇA NOSSO ESPAÇO ↗ pill) */}
        <div className="em-showcase-card">
          <img
            src={assetUrl('/img/experiencia.jpg')}
            alt="Experiência Dra. Isabella Ferro"
            className="em-showcase-img"
          />
          <button
            type="button"
            onClick={onOpenVideo}
            className="em-showcase-pill-btn"
          >
            <span>CONHEÇA NOSSO ESPAÇO</span>
            <AttentionArrow size={15} diagonal />
          </button>
        </div>

        {/* 2 Staggered Cards Row (01 Planejamento detalhado & 02 Acolhimento exclusivo) */}
        <div className="em-staggered-cards">
          <div className="em-stag-card em-stag-left hero-glass-card">
            <span className="em-stag-num">01</span>
            <strong className="em-stag-title">
              Planejamento <br />
              detalhado
            </strong>
            <p className="em-stag-desc">
              Um cuidado feito para você.
            </p>
            <a href="#especialidades" className="em-stag-arrow" aria-label="Planejamento detalhado">
              <AttentionArrow size={15} />
            </a>
          </div>

          <div className="em-stag-card em-stag-right hero-glass-card">
            <span className="em-stag-num">02</span>
            <strong className="em-stag-title">
              Acolhimento <br />
              exclusivo
            </strong>
            <p className="em-stag-desc">
              Escuta e atenção em cada etapa.
            </p>
            <a href="#contato" className="em-stag-arrow" aria-label="Acolhimento exclusivo">
              <AttentionArrow size={15} />
            </a>
          </div>
        </div>

        {/* Bottom Dark Navy Card + Interactive Folder */}
        <div className="em-navy-card">
          <div className="em-navy-folder-wrap">
            <Folder
              mode="flap"
              variant="glass"
              layout="spread"
              color="#3d8bff"
              paperColor="#ffffff"
              tabPosition="right"
              openOn="click"
              size={0.92}
              frost={0.25}
              tilt={0.4}
              speed={1}
              bounce={0.4}
              peek
              intro
              draggable
              zoomOnClick
              theme="dark"
              items={FOLDER_ITEMS}
            />
          </div>
          <h3 className="em-navy-title">
            Naturalidade em <br />
            cada detalhe.
          </h3>
          <span className="em-navy-tags">
            ESTÉTICA &bull; CONFORTO &bull; PRECISÃO
          </span>
        </div>
      </div>
    </section>
  )
}
