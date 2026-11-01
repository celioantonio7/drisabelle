import { useRef, useId } from 'react'
import { gsap, useGSAP, ScrollTrigger } from '../animations/gsap'
import './SerpentineTextScroll.css'

/**
 * Generates an SVG path matching 01_serpentine_line.webp / svg with dynamic velocity bend.
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
const REPETITION_COUNT = 3
const IDLE_SPEED = 48 // SVG units per second; scroll-driven travel stays unchanged.

export default function SerpentineTextScroll() {
  const sectionRef = useRef<HTMLElement>(null)
  const mainPathRef = useRef<SVGPathElement>(null)
  const topSplineRef = useRef<SVGPathElement>(null)
  const botSplineRef = useRef<SVGPathElement>(null)
  const textPathRef = useRef<SVGTextPathElement>(null)
  const textGroupRef = useRef<SVGGElement>(null)

  const uid = useId().replace(/:/g, '')
  const mainPathId = `serpentine-curve-${uid}`
  const gradLineId = `serp-line-grad-${uid}`

  useGSAP(() => {
    const section = sectionRef.current
    const path = mainPathRef.current
    const composition = section?.parentElement?.parentElement
    if (!section || !path || !composition) return
    const mm = gsap.matchMedia()
    mm.add('(max-width: 767px)', () => {
      const svg = section.querySelector('svg')
      svg?.setAttribute('viewBox', '0 0 900 440')
      return () => svg?.setAttribute('viewBox', '0 0 2400 440')
    })
    let disposed = false
    let refreshTimer = 0
    let waitingForScrollEnd = false
    const finishRefresh = () => {
      ScrollTrigger.removeEventListener('scrollEnd', finishRefresh)
      waitingForScrollEnd = false
      if (!disposed) ScrollTrigger.refresh()
    }
    // Image/font changes may alter layout. Defer recalculation until a gesture ends.
    const queueRefresh = () => {
      window.clearTimeout(refreshTimer)
      refreshTimer = window.setTimeout(() => {
        if (ScrollTrigger.isScrolling()) {
          if (!waitingForScrollEnd) {
            waitingForScrollEnd = true
            ScrollTrigger.addEventListener('scrollEnd', finishRefresh)
          }
        } else finishRefresh()
      }, 120)
    }
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const length = path.getTotalLength()
      const motion = { progress: 0 }
      const scrollDistance = length * .12
      let phase = 0
      let repeatWidth = 0
      let visible = false
      let alive = true
      let lastOffset = Number.NaN
      const writeOffset = () => {
        const offset = -scrollDistance * motion.progress - phase
        if (offset === lastOffset) return
        textPathRef.current?.setAttribute('startOffset', String(offset))
        lastOffset = offset
      }
      const measureText = () => {
        const text = textPathRef.current?.parentElement as SVGTextElement | null
        repeatWidth = text ? text.getComputedTextLength() / REPETITION_COUNT : 0
      }
      const timeline = gsap.timeline({ scrollTrigger: {
        id: 'hero-serpentine', trigger: section,
        // Draw while the boundary crosses the viewport. Holding the entire
        // Hero/About composition created a long dead zone for native scrolling.
        start: 'center 85%', end: 'center 25%',
        scrub: 1, invalidateOnRefresh: true,
      } })
      timeline.fromTo(path, { strokeDasharray: length, strokeDashoffset: length },
        { strokeDashoffset: 0, duration: 1, ease: 'none' }, 0)
      // The scrub and the idle glide share one numeric coordinate system and
      // one writer. Keep the accumulated phase when reversing the scroll.
      timeline.to(motion, { progress: 1, duration: 1, ease: 'none', onUpdate: writeOffset }, 0)
      measureText()
      writeOffset()
      document.fonts.ready.then(() => { if (alive) measureText() })
      const visibility = new IntersectionObserver(entries => {
        visible = entries[0]?.isIntersecting ?? false
      })
      visibility.observe(section)
      const glide = (_time: number, deltaTime: number) => {
        const trigger = timeline.scrollTrigger
        if (!trigger || !visible || document.hidden || repeatWidth <= 0) return
        if (window.scrollY < trigger.end || motion.progress < .999) return
        phase = (phase + Math.min(deltaTime, 100) * IDLE_SPEED / 1000) % repeatWidth
        writeOffset()
      }
      gsap.ticker.add(glide)
      return () => {
        alive = false
        gsap.ticker.remove(glide)
        visibility.disconnect()
        textPathRef.current?.setAttribute('startOffset', '0')
      }
    })
    document.fonts.ready.then(() => { if (!disposed) queueRefresh() })
    const images = Array.from(composition.querySelectorAll('img'))
    images.forEach(img => img.addEventListener('load', queueRefresh))
    return () => {
      disposed = true
      window.clearTimeout(refreshTimer)
      ScrollTrigger.removeEventListener('scrollEnd', finishRefresh)
      images.forEach(img => img.removeEventListener('load', queueRefresh))
      mm.revert()
    }
  }, { scope: sectionRef })

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
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={gradLineId} x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#1873ff" />
              <stop offset="53%" stopColor="#8abaff" />
              <stop offset="100%" stopColor="#1163f3" />
            </linearGradient>

            <path
              id={mainPathId}
              d={generateWavePath(0, 220, 140)}
              fill="none"
            />
          </defs>

          {/* Upper dashed hairline spline matching 01_serpentine_line.webp */}
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

          {/* Existing primary curve, drawn from left to right. */}
          <path
            ref={mainPathRef}
            d={generateWavePath(0, 220, 140)}
            fill="none"
            stroke={`url(#${gradLineId})`}
            strokeWidth="5"
            strokeLinecap="round"
            strokeOpacity="0.85"
          />

          {/* Big, bold, impactful continuous textPath */}
          <g ref={textGroupRef} className="serpentine-text-group">
            <text className="serpentine-text-content" dy="34">
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
