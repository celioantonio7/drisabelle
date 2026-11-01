import { useRef, useId, useEffect } from 'react'
import { gsap, useGSAP, ScrollTrigger } from '../animations/gsap'
import './SerpentineTextScroll.css'

/**
 * Generates an SVG path matching 01_serpentine_line.png / svg with dynamic velocity bend.
 */
function generateWavePath(bend = 0, yCenter = 220, amp = 140): string {
  const effectiveAmp = amp + bend
  return (
    `M -300,${yCenter} ` +
    `C 100,${yCenter - effectiveAmp} 500,${yCenter + effectiveAmp} 900,${yCenter} ` +
    `C 1300,${yCenter - effectiveAmp} 1700,${yCenter + effectiveAmp} 2100,${yCenter} ` +
    `C 2500,${yCenter - effectiveAmp} 2900,${yCenter + effectiveAmp} 3300,${yCenter}`
  )
}

const PHRASE_PARTS = [
  { text: 'Sorrisos que transformam.', className: 'st-serif-bold-blue' },
  { text: ' ', className: 'st-space' },
  { text: 'Beleza que inspira.', className: 'st-serif-bold-navy' },
  { text: ' • ', className: 'st-bullet' },
  { text: 'ODONTOLOGIA ESTÉTICA DE ALTA PRECISÃO', className: 'st-sans-bold' },
  { text: ' • ', className: 'st-bullet' },
  { text: 'Dra. Isabella Ferro', className: 'st-serif-bold-royal' },
  { text: ' • ', className: 'st-bullet' },
]

// Repetitions to ensure continuous looping without visual seams
const REPETITION_COUNT = 6

export default function SerpentineTextScroll() {
  const sectionRef = useRef<HTMLElement>(null)
  const mainPathRef = useRef<SVGPathElement>(null)
  const topSplineRef = useRef<SVGPathElement>(null)
  const botSplineRef = useRef<SVGPathElement>(null)
  const textPathRef = useRef<SVGTextPathElement>(null)
  const textGroupRef = useRef<SVGGElement>(null)

  const offsetRef = useRef<number>(0)
  const scrollBoostRef = useRef<number>(0)
  const lastScrollYRef = useRef<number>(0)

  const uid = useId().replace(/:/g, '')
  const mainPathId = `serpentine-curve-${uid}`
  const gradLineId = `serp-line-grad-${uid}`

  // Infinite continuous glide + scroll acceleration loop
  useEffect(() => {
    let rafId = 0
    let lastTime = performance.now()

    const loop = (currentTime: number) => {
      const delta = Math.min(32, currentTime - lastTime)
      lastTime = currentTime

      // Base idle speed (continuous infinite crawl along curve)
      const baseSpeed = 0.038 * (delta / 16.66)

      // Decay scroll boost smoothly back to 0
      scrollBoostRef.current *= 0.94

      // Advance offset
      offsetRef.current += baseSpeed + scrollBoostRef.current

      // Wrap around percentage to prevent overflow
      if (offsetRef.current > 1000) offsetRef.current %= 100
      if (offsetRef.current < -1000) offsetRef.current %= 100

      if (textPathRef.current) {
        textPathRef.current.setAttribute('startOffset', `${offsetRef.current}%`)
      }

      rafId = requestAnimationFrame(loop)
    }

    rafId = requestAnimationFrame(loop)

    const onScroll = () => {
      const currentY = window.scrollY
      const deltaY = currentY - lastScrollYRef.current
      lastScrollYRef.current = currentY

      // Add scroll velocity to the animation
      scrollBoostRef.current += deltaY * 0.04
      scrollBoostRef.current = Math.max(-2.5, Math.min(2.5, scrollBoostRef.current))
    }

    lastScrollYRef.current = window.scrollY
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useGSAP(
    () => {
      const section = sectionRef.current
      const mainPath = mainPathRef.current
      const topSpline = topSplineRef.current
      const botSpline = botSplineRef.current
      const textGroup = textGroupRef.current

      if (!section || !mainPath) return

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const physics = { bend: 0, skew: 0 }

        const applyPhysics = () => {
          const b = physics.bend
          mainPath.setAttribute('d', generateWavePath(b, 220, 140))

          if (topSpline) {
            topSpline.setAttribute('d', generateWavePath(b * 0.7, 160, 120))
          }
          if (botSpline) {
            botSpline.setAttribute('d', generateWavePath(b * 0.7, 280, 120))
          }
          if (textGroup) {
            textGroup.setAttribute('transform', `skewX(${physics.skew})`)
          }
        }

        const setBend = gsap.quickTo(physics, 'bend', {
          duration: 0.65,
          ease: 'power3.out',
          onUpdate: applyPhysics,
        })

        const setSkew = gsap.quickTo(physics, 'skew', {
          duration: 0.55,
          ease: 'power3.out',
          onUpdate: applyPhysics,
        })

        ScrollTrigger.create({
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const v = self.getVelocity()
            const clampedV = Math.max(-2200, Math.min(2200, v))
            const targetBend = (clampedV / 2200) * 45
            const targetSkew = -(clampedV / 2200) * 8

            setBend(targetBend)
            setSkew(targetSkew)
          },
          onLeave: () => {
            setBend(0)
            setSkew(0)
          },
          onLeaveBack: () => {
            setBend(0)
            setSkew(0)
          },
        })
      })

      return () => {
        mm.revert()
      }
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      className="serpentine-scroll-section"
      aria-label="Frase de destaque estética"
    >
      <div className="serpentine-stage-container">
        <svg
          viewBox="0 0 2400 440"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="serpentine-svg-canvas"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id={gradLineId} x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#1873ff" />
              <stop offset="53%" stopColor="#8abaff" />
              <stop offset="100%" stopColor="#1163f3" />
            </linearGradient>

            <path
              id={mainPathId}
              ref={mainPathRef}
              d={generateWavePath(0, 220, 140)}
              fill="none"
            />
          </defs>

          {/* Upper dashed hairline spline matching 01_serpentine_line.png */}
          <path
            ref={topSplineRef}
            d={generateWavePath(0, 160, 120)}
            fill="none"
            stroke="#93c5fd"
            strokeWidth="2.5"
            strokeDasharray="10 10"
            strokeOpacity="0.45"
          />

          {/* Lower atmospheric guide spline */}
          <path
            ref={botSplineRef}
            d={generateWavePath(0, 280, 120)}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1.8"
            strokeOpacity="0.25"
          />

          {/* Main bold serpentine wave path */}
          <path
            d={generateWavePath(0, 220, 140)}
            fill="none"
            stroke={`url(#${gradLineId})`}
            strokeWidth="5"
            strokeLinecap="round"
            strokeOpacity="0.85"
          />

          {/* Big, bold, impactful continuous textPath */}
          <g ref={textGroupRef} className="serpentine-text-group">
            <text className="serpentine-text-content" dy="-14">
              <textPath
                ref={textPathRef}
                href={`#${mainPathId}`}
                startOffset="0%"
                method="align"
                spacing="auto"
              >
                {Array.from({ length: REPETITION_COUNT }).map((_, rIdx) => (
                  <tspan key={rIdx}>
                    {PHRASE_PARTS.map((part, pIdx) => (
                      <tspan key={pIdx} className={part.className}>
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
