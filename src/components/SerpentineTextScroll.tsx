import { useRef, useId } from 'react'
import { gsap, useGSAP, ScrollTrigger } from '../animations/gsap'
import './SerpentineTextScroll.css'

/**
 * Generates an SVG path with continuous C1/C2 curvature for smooth serpentine waves.
 * @param bend Dynamic vertical offset applied to wave crests and troughs based on scroll velocity
 * @param yCenter Baseline vertical center
 * @param amp Wave amplitude
 */
function generateWavePath(bend = 0, yCenter = 210, amp = 130): string {
  const effectiveAmp = amp + bend
  return (
    `M -300,${yCenter} ` +
    `C 100,${yCenter - effectiveAmp} 500,${yCenter + effectiveAmp} 900,${yCenter} ` +
    `C 1300,${yCenter - effectiveAmp} 1700,${yCenter + effectiveAmp} 2100,${yCenter} ` +
    `C 2500,${yCenter - effectiveAmp} 2900,${yCenter + effectiveAmp} 3300,${yCenter}`
  )
}

const PHRASE_PARTS = [
  { text: 'Sorrisos que transformam.', className: 'st-serif-italic' },
  { text: ' ', className: 'st-space' },
  { text: 'Beleza que inspira.', className: 'st-serif-bold' },
  { text: ' • ', className: 'st-bullet' },
  { text: 'Odontologia Estética de Alta Precisão', className: 'st-sans-badge' },
  { text: ' • ', className: 'st-bullet' },
  { text: 'Dra. Isabella Ferro', className: 'st-serif-royal' },
  { text: ' • ', className: 'st-bullet' },
]

// 5 repetitions to guarantee continuous cascading flow across the entire viewport curve
const REPETITION_COUNT = 5

export default function SerpentineTextScroll() {
  const sectionRef = useRef<HTMLElement>(null)
  const mainPathRef = useRef<SVGPathElement>(null)
  const topSplineRef = useRef<SVGPathElement>(null)
  const botSplineRef = useRef<SVGPathElement>(null)
  const textPathRef = useRef<SVGTextPathElement>(null)
  const textGroupRef = useRef<SVGGElement>(null)
  const ambientSplineRef = useRef<SVGPathElement>(null)

  const uid = useId().replace(/:/g, '')
  const mainPathId = `serpentine-curve-${uid}`
  const gradRoyalId = `serp-grad-royal-${uid}`
  const gradSplineId = `serp-grad-spline-${uid}`
  const gradSplineLightId = `serp-grad-spline-light-${uid}`
  const glowFilterId = `serp-glow-${uid}`

  useGSAP(
    () => {
      const section = sectionRef.current
      const mainPath = mainPathRef.current
      const topSpline = topSplineRef.current
      const botSpline = botSplineRef.current
      const textPath = textPathRef.current
      const textGroup = textGroupRef.current
      const ambientSpline = ambientSplineRef.current

      if (!section || !mainPath || !textPath) return

      const mm = gsap.matchMedia()

      // 1. Accessibility: prefers-reduced-motion fallback
      mm.add('(prefers-reduced-motion: reduce)', () => {
        textPath.setAttribute('startOffset', '0%')
        if (textGroup) {
          gsap.set(textGroup, { skewX: 0, skewY: 0, clearProps: 'all' })
        }
      })

      // 2. High-performance scrub & dynamic velocity reactive curve
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Continuous scrub of text along path based on scroll position
        const offsetProxy = { offset: 12 }
        const scrubTween = gsap.to(offsetProxy, {
          offset: -108,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom+=120',
            end: 'bottom top-=120',
            scrub: 1.2,
            onUpdate: () => {
              textPath.setAttribute('startOffset', `${offsetProxy.offset}%`)
            },
          },
        })

        // Velocity reactive physics with elastic/smooth dampening
        const physics = { bend: 0, skew: 0 }

        const applyPhysics = () => {
          const b = physics.bend
          mainPath.setAttribute('d', generateWavePath(b, 210, 130))

          if (topSpline) {
            topSpline.setAttribute('d', generateWavePath(b * 0.72, 160, 110))
          }
          if (botSpline) {
            botSpline.setAttribute('d', generateWavePath(b * 0.72, 260, 110))
          }
          if (textGroup) {
            gsap.set(textGroup, {
              skewX: physics.skew,
              transformOrigin: '50% 50%',
            })
          }
        }

        const bendQuick = gsap.quickTo(physics, 'bend', {
          duration: 0.55,
          ease: 'power3.out',
          onUpdate: applyPhysics,
        })

        const skewQuick = gsap.quickTo(physics, 'skew', {
          duration: 0.5,
          ease: 'power3.out',
          onUpdate: applyPhysics,
        })

        let idleTimer: ReturnType<typeof setTimeout> | null = null

        const velTrigger = ScrollTrigger.create({
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const v = self.getVelocity()
            // Proportional velocity mapping with safe aesthetic clamping
            const targetBend = gsap.utils.clamp(-48, 48, v / 32)
            const targetSkew = gsap.utils.clamp(-7, 7, v / 180)

            bendQuick(targetBend)
            skewQuick(targetSkew)

            if (idleTimer) clearTimeout(idleTimer)
            idleTimer = setTimeout(() => {
              bendQuick(0)
              skewQuick(0)
            }, 80)
          },
        })

        // Ambient background spline continuous glide
        let ambientTween: gsap.core.Tween | null = null
        if (ambientSpline) {
          ambientTween = gsap.to(ambientSpline, {
            strokeDashoffset: -1600,
            duration: 30,
            repeat: -1,
            ease: 'none',
          })
        }

        return () => {
          if (idleTimer) clearTimeout(idleTimer)
          scrubTween.kill()
          velTrigger.kill()
          if (ambientTween) ambientTween.kill()
        }
      })

      return () => mm.revert()
    },
    { scope: sectionRef },
  )

  const initialMainPath = generateWavePath(0, 210, 130)
  const initialTopSpline = generateWavePath(0, 160, 110)
  const initialBotSpline = generateWavePath(0, 260, 110)

  return (
    <section
      ref={sectionRef}
      className="serpentine-scroll-section"
      aria-label="Destaque Serpentine: Odontologia Estética de Alta Precisão"
      role="region"
    >
      {/* Background Soft SVG Spline Canvas — Fluid Ambient Depth */}
      <div className="serpentine-ambient-spline-wrap" aria-hidden="true">
        <svg
          viewBox="-200 0 2800 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="serpentine-ambient-svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={gradSplineLightId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0056d6" stopOpacity="0" />
              <stop offset="25%" stopColor="#0056d6" stopOpacity="0.14" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.28" />
              <stop offset="75%" stopColor="#0056d6" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#0056d6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            ref={ambientSplineRef}
            d="M -200,240 C 350,420 850,70 1450,290 C 2000,470 2400,120 2800,260"
            stroke={`url(#${gradSplineLightId})`}
            strokeWidth="2.5"
            strokeDasharray="14 16"
            strokeDashoffset="0"
          />
        </svg>
      </div>

      {/* Main Serpentine Curve & Typography Stage */}
      <div className="serpentine-stage-container">
        <svg
          viewBox="-300 0 3300 420"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="serpentine-svg-canvas"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id={gradRoyalId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0056d6" />
              <stop offset="50%" stopColor="#0b192c" />
              <stop offset="100%" stopColor="#0056d6" />
            </linearGradient>

            <linearGradient id={gradSplineId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0056d6" stopOpacity="0" />
              <stop offset="20%" stopColor="#0056d6" stopOpacity="0.32" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.55" />
              <stop offset="80%" stopColor="#0056d6" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#0056d6" stopOpacity="0" />
            </linearGradient>

            <filter id={glowFilterId} x="-10%" y="-20%" width="120%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Precision Architectural Spline Contours (Top & Bottom Guides) */}
          <path
            ref={topSplineRef}
            d={initialTopSpline}
            stroke={`url(#${gradSplineId})`}
            strokeWidth="1.5"
            strokeDasharray="7 9"
            className="serpentine-spline-contour"
            filter={`url(#${glowFilterId})`}
            aria-hidden="true"
          />

          <path
            ref={botSplineRef}
            d={initialBotSpline}
            stroke={`url(#${gradSplineId})`}
            strokeWidth="1.2"
            strokeOpacity="0.45"
            className="serpentine-spline-contour"
            aria-hidden="true"
          />

          {/* Primary Text Anchor Path (Invisible geometry guide) */}
          <path
            id={mainPathId}
            ref={mainPathRef}
            d={initialMainPath}
            fill="none"
            stroke="transparent"
            strokeWidth="1"
          />

          {/* Dynamic Interactive Serpentine Text */}
          <g ref={textGroupRef} className="serpentine-text-group">
            <text className="serpentine-text-content">
              <textPath
                ref={textPathRef}
                href={`#${mainPathId}`}
                startOffset="12%"
              >
                {Array.from({ length: REPETITION_COUNT }).map((_, repIdx) => (
                  <tspan key={`rep-${repIdx}`}>
                    {PHRASE_PARTS.map((part, pIdx) => (
                      <tspan key={`rep-${repIdx}-part-${pIdx}`} className={part.className}>
                        {part.text}
                      </tspan>
                    ))}
                  </tspan>
                ))}
              </textPath>
            </text>
          </g>
        </svg>
      </div>
    </section>
  )
}
