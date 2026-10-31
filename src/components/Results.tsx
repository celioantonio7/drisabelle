import { useState, useRef, useEffect } from 'react'
import { ArrowRight, X } from 'lucide-react'
import { WhatsAppIcon, DiamondIcon } from './Icons'
import { AttentionArrow, SocialInstagramLottie } from './LottieflowIcons'
import { WHATSAPP_URL, INSTAGRAM_URL } from '../data'
import { useMagneticButton } from '../animations/hooks'
import WobbleSpiralCanvas from './WobbleSpiralCanvas'
import { assetUrl } from '../utils/assets'

export interface CaseItem {
  id: number
  antesImg: string
  depoisImg: string
  pairImg: string
  tag: string
  title: string
  quote: string
  desc: string
  category: 'Full Face' | 'Porcelana' | 'Resina' | 'Harmonização'
}

const CASES_DATA: CaseItem[] = [
  {
    id: 0,
    antesImg: assetUrl('/img/cases/case1_antes.jpg'),
    depoisImg: assetUrl('/img/cases/case1_depois.jpg'),
    pairImg: assetUrl('/img/cases/case1_pair.jpg'),
    tag: 'Lentes em Porcelana',
    title: 'Lentes Cerâmicas Ultrafinas',
    quote:
      'Um novo sorriso que ilumina todo o rosto com delicadeza, proporção áurea e textura idêntica ao dente natural. 🤍',
    desc: 'Lentes de porcelana pura com planejamento digital 3D. Textura, reflexo de luz e translucidez idênticos ao esmalte dental natural.',
    category: 'Porcelana',
  },
  {
    id: 1,
    antesImg: assetUrl('/img/cases/case2_antes.jpg'),
    depoisImg: assetUrl('/img/cases/case2_depois.jpg'),
    pairImg: assetUrl('/img/cases/case2_pair.jpg'),
    tag: 'Lentes em Resina',
    title: 'Estratificação em Resina Composta',
    quote:
      'Escultura artesanal dente a dente que devolve volume, alinhamento e brilho natural sem desgaste excessivo. 🤍',
    desc: 'Escultura direta dente a dente com resinas nobres de alta performance. Ajuste anatômico que devolve jovialidade e iluminação ao sorriso.',
    category: 'Resina',
  },
  {
    id: 2,
    antesImg: assetUrl('/img/cases/case3_antes.jpg'),
    depoisImg: assetUrl('/img/cases/case3_depois.jpg'),
    pairImg: assetUrl('/img/cases/case3_pair.jpg'),
    tag: 'Reabilitação Estética',
    title: 'Harmonia & Alinhamento do Sorriso',
    quote:
      'Equilíbrio entre estética branca e estética vermelha para um sorriso amplo, harmônico e cheio de vida. 🤍',
    desc: 'Correção de contornos dentais, alinhamento do corredor bucal e acabamento de alto brilho com naturalidade absoluta.',
    category: 'Porcelana',
  },
  {
    id: 3,
    antesImg: assetUrl('/img/cases/case4_antes.jpg'),
    depoisImg: assetUrl('/img/cases/case4_depois.jpg'),
    pairImg: assetUrl('/img/cases/case4_pair.jpg'),
    tag: 'Lentes em Porcelana',
    title: 'Reabilitação Completa do Sorriso',
    quote:
      'Transformar o sorriso é devolver a liberdade de sorrir com confiança em todos os momentos. 🤍',
    desc: 'Restaurações cerâmicas de alta tecnologia desenvolvidas para quem busca sofisticação máxima, clareza natural e resultados duradouros.',
    category: 'Porcelana',
  },
  {
    id: 4,
    antesImg: assetUrl('/img/cases/case5_antes.jpg'),
    depoisImg: assetUrl('/img/cases/case5_depois.jpg'),
    pairImg: assetUrl('/img/cases/case5_pair.jpg'),
    tag: 'Full Face & Harmonização',
    title: 'Transformação Full Face',
    quote:
      'Nunca é tarde para se olhar no espelho e se sentir ainda mais bonita. 🤍 Full Face: uma transformação que valoriza a beleza sem perder a naturalidade!',
    desc: 'Integração harmônica entre contorno facial, rejuvenescimento e suporte tecidual com naturalidade absoluta.',
    category: 'Full Face',
  },
  {
    id: 5,
    antesImg: assetUrl('/img/cases/case6_antes.jpg'),
    depoisImg: assetUrl('/img/cases/case6_depois.jpg'),
    pairImg: assetUrl('/img/cases/case6_pair.jpg'),
    tag: 'Harmonização & Perfil',
    title: 'Simetria & Equilíbrio Facial',
    quote:
      'Realçar os traços naturais com leveza e precisão para um semblante mais descansado, elegante e harmônico. 🤍',
    desc: 'Protocolo conjugado de estruturação facial, suavização de sulcos e equilíbrio das proporções do rosto.',
    category: 'Harmonização',
  },
  {
    id: 6,
    antesImg: assetUrl('/img/cases/case7_antes.jpg'),
    depoisImg: assetUrl('/img/cases/case7_depois.jpg'),
    pairImg: assetUrl('/img/cases/case7_pair.jpg'),
    tag: 'Full Face & Contorno',
    title: 'Rejuvenescimento & Sustentação Facial',
    quote:
      'Cuidado individualizado que respeita a identidade de cada rosto, devolvendo firmeza e suavidade na medida certa. 🤍',
    desc: 'Realce dos pontos de sustentação da face para um semblante mais leve, descansado e proporcional.',
    category: 'Full Face',
  },
]

/**
 * 2D Canvas Lando Norris fluid trail reveal:
 * Default in front = ANTES (topSrc)
 * On mouse move / touch = reveals DEPOIS (bottomSrc) of the exact same image!
 */
function HexFluidImage({
  topSrc,
  bottomSrc,
  alt,
  width = 240,
  height = 260,
  className = 'colmeia-hex-canvas',
}: {
  topSrc: string
  bottomSrc: string
  alt: string
  width?: number
  height?: number
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const trailsRef = useRef<Array<{ x: number; y: number; r: number; alpha: number }>>([])
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = width
    const h = height
    canvas.width = w
    canvas.height = h

    const imgAntes = new Image()
    const imgDepois = new Image()
    imgAntes.crossOrigin = 'anonymous'
    imgDepois.crossOrigin = 'anonymous'
    imgAntes.src = topSrc
    imgDepois.src = bottomSrc

    const maskCanvas = document.createElement('canvas')
    maskCanvas.width = w
    maskCanvas.height = h
    const maskCtx = maskCanvas.getContext('2d')

    const drawCover = (targetCtx: CanvasRenderingContext2D, img: HTMLImageElement) => {
      if (!img.complete || img.naturalWidth === 0) return
      const iw = img.naturalWidth
      const ih = img.naturalHeight
      const scale = Math.max(w / iw, h / ih)
      const sw = iw * scale
      const sh = ih * scale
      targetCtx.drawImage(img, (w - sw) / 2, (h - sh) / 2, sw, sh)
    }

    const render = () => {
      ctx.clearRect(0, 0, w, h)
      // Default visible layer in front: ANTES
      drawCover(ctx, imgAntes)

      // Fluid brush reveals DEPOIS underneath
      if (trailsRef.current.length > 0 && maskCtx && imgDepois.complete && imgDepois.naturalWidth > 0) {
        maskCtx.clearRect(0, 0, w, h)
        for (let i = trailsRef.current.length - 1; i >= 0; i--) {
          const pt = trailsRef.current[i]
          const grad = maskCtx.createRadialGradient(pt.x, pt.y, pt.r * 0.2, pt.x, pt.y, pt.r)
          grad.addColorStop(0, `rgba(255,255,255,${pt.alpha})`)
          grad.addColorStop(0.6, `rgba(255,255,255,${pt.alpha * 0.8})`)
          grad.addColorStop(1, 'rgba(255,255,255,0)')
          maskCtx.fillStyle = grad
          maskCtx.beginPath()
          maskCtx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2)
          maskCtx.fill()

          pt.alpha *= 0.86
          pt.r *= 0.985
          if (pt.alpha < 0.05) {
            trailsRef.current.splice(i, 1)
          }
        }

        maskCtx.globalCompositeOperation = 'source-in'
        drawCover(maskCtx, imgDepois)
        maskCtx.globalCompositeOperation = 'source-over'

        ctx.drawImage(maskCanvas, 0, 0)
      }

      if (trailsRef.current.length > 0) {
        rafRef.current = requestAnimationFrame(render)
      } else {
        rafRef.current = 0
      }
    }

    imgAntes.onload = () => render()
    imgDepois.onload = () => render()

    const addTrailPoint = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) return
      const x = ((clientX - rect.left) / rect.width) * w
      const y = ((clientY - rect.top) / rect.height) * h
      trailsRef.current.push({ x, y, r: Math.max(w, h) * 0.28, alpha: 1.0 })
      if (trailsRef.current.length > 24) trailsRef.current.shift()
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(render)
      }
    }

    const onMove = (e: MouseEvent) => addTrailPoint(e.clientX, e.clientY)
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) addTrailPoint(e.touches[0].clientX, e.touches[0].clientY)
    }

    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('touchmove', onTouch, { passive: true })
    return () => {
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('touchmove', onTouch)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [topSrc, bottomSrc, width, height])

  return <canvas ref={canvasRef} className={className} aria-label={alt} />
}

export default function Results() {
  const rootRef = useRef<HTMLElement>(null)
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null)
  const [sliderPos, setSliderPos] = useState(50)
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

  useEffect(() => {
    if (selectedCase) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [selectedCase])

  useMagneticButton(rootRef)

  // Clean images (zero watermark) for the 3D Spiral Slider
  const spiralImages = CASES_DATA.map((c) => c.depoisImg)
  const leftHexagons = CASES_DATA.slice(0, 3)
  const rightHexagons = CASES_DATA.slice(3, 6)

  return (
    <section
      ref={rootRef}
      id="resultados"
      className={`results-section ${inView ? 'is-section-inview' : ''}`}
      aria-label="Resultados e Casos"
    >
      <div className="section-container faq-container-layer">
        {/* ================= MOBILE TOP HERO SPLIT ================= */}
        <div className="rm-top-split results-anim-up">
          <div className="rm-left-copy">
            <h2 className="rm-headline">
              Transformações <br />
              que revelam <br />
              <em className="rm-headline-accent">confiança.</em>
            </h2>
          </div>

          <div className="rm-right-arch-wrap">
            <div className="rm-right-arch-photo">
              <img src={assetUrl('/img/skincare-sorriso.jpg')} alt="Sorriso confiante" className="rm-arch-img" />
            </div>
            <div className="rm-stamp-badge">
              <svg viewBox="0 0 140 140" className="hm-stamp-svg" aria-hidden="true">
                <path
                  id="rm-stamp-path"
                  d="M 70, 70 m -50, 0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0"
                  fill="none"
                />
                <text className="hm-stamp-text">
                  <textPath href="#rm-stamp-path" startOffset="0%">
                    • TRANSFORMAÇÕES • DE CONFIANÇA •
                  </textPath>
                </text>
              </svg>
              <div className="hm-stamp-center">
                <DiamondIcon width={18} height={18} />
              </div>
            </div>
          </div>
        </div>

        {/* ================= DESKTOP HEADER ================= */}
        <div className="results-header results-desktop-header results-anim-up">
          <h2 className="results-headline">
            Transformações que revelam <em className="spec-headline-accent">confiança.</em>
          </h2>
        </div>

        {/* ================= 3D SPIRAL SLIDER & LATERAL HONEYCOMB ================= */}
        <div className="results-showcase-layout results-anim-up">
          {/* Left Honeycomb Column (Colmeia Esquerda — Fotos 100% Limpas: Antes na frente -> Depois ao passar o mouse) */}
          <div className="colmeia-column colmeia-left">
            <div className="colmeia-hex-stack">
              {leftHexagons.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedCase(item)}
                  className={`colmeia-hex-wrapper ${idx === 1 ? 'is-offset-left' : ''}`}
                  role="button"
                  tabIndex={0}
                  aria-label={item.title}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedCase(item)}
                >
                  <div className="colmeia-hex-shape">
                    <HexFluidImage
                      topSrc={item.antesImg}
                      bottomSrc={item.depoisImg}
                      alt={item.title}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Center 3D Spiral Slider — Floating freely without container box */}
          <div className="spiral-center-column spiral-floating-free">
            <WobbleSpiralCanvas
              images={spiralImages}
              onSelect={(idx) => setSelectedCase(CASES_DATA[idx % CASES_DATA.length])}
              pinnedTriggerSelector="#resultados"
            />
          </div>

          {/* Right Honeycomb Column (Colmeia Direita — Fotos 100% Limpas: Antes na frente -> Depois ao passar o mouse) */}
          <div className="colmeia-column colmeia-right">
            <div className="colmeia-hex-stack">
              {rightHexagons.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedCase(item)}
                  className={`colmeia-hex-wrapper ${idx === 1 ? 'is-offset-right' : ''}`}
                  role="button"
                  tabIndex={0}
                  aria-label={item.title}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedCase(item)}
                >
                  <div className="colmeia-hex-shape">
                    <HexFluidImage
                      topSrc={item.antesImg}
                      bottomSrc={item.depoisImg}
                      alt={item.title}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= MOBILE FEATURED CARDS (Exact match to 06_resultados_mobile.png, Clean Images) ================= */}
        <div className="rm-cards-stack">
          {/* 1. Interactive Before / After Card (Lentes em Porcelana — Antes vs Depois reais da mesma imagem) */}
          <div className="rm-ba-card hero-glass-card">
            <div
              className="rm-ba-viewport"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect()
                setSliderPos(Math.max(10, Math.min(90, ((e.clientX - r.left) / r.width) * 100)))
              }}
              onTouchMove={(e) => {
                if (!e.touches[0]) return
                const r = e.currentTarget.getBoundingClientRect()
                setSliderPos(Math.max(10, Math.min(90, ((e.touches[0].clientX - r.left) / r.width) * 100)))
              }}
            >
              <img src={assetUrl('/img/cases/case1_depois.jpg')} alt="Depois" className="rm-ba-img-full" />
              <div
                className="rm-ba-before-clip"
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
              >
                <img
                  src={assetUrl('/img/cases/case1_antes.jpg')}
                  alt="Antes"
                  className="rm-ba-img-full"
                />
              </div>
              <span className="rm-ba-pill rm-ba-pill-left">Antes</span>
              <span className="rm-ba-pill rm-ba-pill-right">Depois</span>
              <div className="rm-ba-divider" style={{ left: `${sliderPos}%` }}>
                <span className="rm-ba-handle">&lt; &gt;</span>
              </div>
            </div>

            <div className="rm-ba-footer" onClick={() => setSelectedCase(CASES_DATA[0])}>
              <div>
                <h3 className="rm-card-h">Lentes em Porcelana</h3>
                <p className="rm-card-p">
                  Reestruturação estética com naturalidade e refinamento imediato.
                </p>
              </div>
              <span className="rm-round-arrow">
                <AttentionArrow size={15} />
              </span>
            </div>
          </div>

          {/* 2. Harmonização do Sorriso & Facial (Split Left Text / Right Clean Photo) */}
          <div
            className="rm-split-card hero-glass-card"
            onClick={() => setSelectedCase(CASES_DATA[4])}
          >
            <div className="rm-split-text">
              <h3 className="rm-card-h">Harmonização do Sorriso &amp; Face</h3>
              <p className="rm-card-p">
                Estética e proporção para um sorriso e contorno mais harmônicos.
              </p>
              <span className="rm-round-arrow">
                <AttentionArrow size={15} />
              </span>
            </div>
            <div className="rm-split-photo">
              <img src={assetUrl('/img/cases/case5_depois.jpg')} alt="Harmonização" />
            </div>
          </div>

          {/* 3. Dark Navy Quote Card with Doctor Avatar */}
          <div className="rm-navy-quote-card" onClick={() => setSelectedCase(CASES_DATA[4])}>
            <span className="rm-navy-top-arrow">
              <AttentionArrow size={15} />
            </span>
            <span className="rm-quote-mark">&ldquo;</span>
            <p className="rm-navy-quote-text">
              Resultados que respeitam a sua identidade e realçam o que te torna único.
            </p>
            <div className="rm-navy-author-row">
              <span className="rm-navy-author-line" />
              <span className="rm-navy-author-name">Dra. Isabella Ferro</span>
            </div>
            <div className="rm-navy-avatar">
              <img src={assetUrl('/img/sobre_adulta.png')} alt="Dra. Isabella Ferro" />
            </div>
          </div>

          {/* 4. Sorriso Natural (Split Left Clean Photo / Right Text) */}
          <div
            className="rm-split-card rm-split-reverse hero-glass-card"
            onClick={() => setSelectedCase(CASES_DATA[1])}
          >
            <div className="rm-split-photo">
              <img src={assetUrl('/img/cases/case2_depois.jpg')} alt="Sorriso Natural" />
            </div>
            <div className="rm-split-text">
              <h3 className="rm-card-h">Sorriso Natural</h3>
              <p className="rm-card-p">
                Leveza, simetria e naturalidade em cada detalhe.
              </p>
              <span className="rm-round-arrow" style={{ marginLeft: 'auto' }}>
                <AttentionArrow size={15} />
              </span>
            </div>
          </div>

          {/* 5. Instagram Pill Card */}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rm-insta-pill-card hero-glass-card"
          >
            <span className="rm-insta-icon-circle">
              <SocialInstagramLottie size={20} />
            </span>
            <span className="rm-insta-text">
              Conheça mais resultados <br />
              no Instagram. &rarr;
            </span>
            <div className="rm-insta-thumbs">
              <img src={assetUrl('/img/cases/case4_depois.jpg')} alt="" className="rm-insta-t1" />
              <img src={assetUrl('/img/cases/case7_depois.jpg')} alt="" className="rm-insta-t2" />
            </div>
          </a>
        </div>
      </div>

      {/* ================= INTERACTIVE CASE DETAIL MODAL (Compact & Zero Scroll) ================= */}
      {selectedCase && (
        <div
          className="case-modal-backdrop"
          onClick={() => setSelectedCase(null)}
        >
          <div
            className="case-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedCase(null)}
              className="case-modal-close"
              aria-label="Fechar modal"
            >
              <X width={18} height={18} />
            </button>

            <div className="case-modal-tag">
              <DiamondIcon width={13} height={13} />
              <span>{selectedCase.tag}</span>
            </div>

            <h3 className="case-modal-title">{selectedCase.title}</h3>

            <div className="case-modal-photo-wrap">
              <HexFluidImage
                topSrc={selectedCase.antesImg}
                bottomSrc={selectedCase.depoisImg}
                alt={selectedCase.title}
                width={520}
                height={260}
                className="case-modal-photo"
              />
            </div>

            <blockquote className="case-modal-quote">
              &ldquo;{selectedCase.quote}&rdquo;
            </blockquote>

            <div className="case-modal-actions">
              <a
                href={`${WHATSAPP_URL}&text=${encodeURIComponent(
                  `Olá Dra. Isabella! Gostei muito do caso "${selectedCase.title}" e gostaria de agendar uma avaliação privativa.`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="case-modal-wa-btn"
              >
                <WhatsAppIcon width={18} height={18} />
                <span>Quero um resultado como este</span>
                <ArrowRight width={15} height={15} />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
