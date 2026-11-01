import { useRef } from 'react'
import { gsap, useGSAP } from '../animations/gsap'

interface CinematicTransitionProps {
  children: React.ReactNode
}

/**
 * Cinematic ScrollTrigger Section Transition
 * 1. Pins the transition stage when arriving at the boundary.
 * 2. Next section starts as a compact centered rounded card (~15% scale).
 * 3. An elegant blue SVG stroke is drawn across the screen synchronized with scroll.
 * 4. Section expands to 100% viewport width/height while border-radius smoothly reduces to 0.
 * 5. Uses an internal wrapper element for scaling (never transforms the pinned element).
 * 6. Reveals interior cards & titles with stagger upon full expansion.
 * 7. Unpins when done, reversable when scrolling up.
 * 8. Optimized for mobile with shorter scroll distance and GPU-friendly transforms.
 */
export default function CinematicTransition({ children }: CinematicTransitionProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const pinStageRef = useRef<HTMLDivElement>(null)
  const innerScaleRef = useRef<HTMLDivElement>(null)
  const svgPathRef = useRef<SVGPathElement>(null)

  useGSAP(
    () => {
      const wrapper = wrapperRef.current
      const pinStage = pinStageRef.current
      const innerScale = innerScaleRef.current
      const svgPath = svgPathRef.current

      if (!wrapper || !pinStage || !innerScale || !svgPath) return

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(innerScale, { scale: 1, borderRadius: 0, clearProps: 'all' })
        gsap.set(svgPath, { strokeDashoffset: 0 })
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const isDesktop = window.innerWidth >= 769
        const pathLength = Math.ceil(svgPath.getTotalLength() || 1800)

        // Setup SVG path stroke
        gsap.set(svgPath, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        })

        // Initial state of expanding inner portal
        const initialScale = isDesktop ? 0.16 : 0.35
        const initialRadius = isDesktop ? 44 : 28

        gsap.set(innerScale, {
          scale: initialScale,
          borderRadius: `${initialRadius}px`,
          transformOrigin: 'center center',
          boxShadow: '0 30px 90px rgba(0, 86, 214, 0.38)',
          overflow: 'hidden',
        })

        // Interior elements to stagger reveal once expanded
        const contentTargets = gsap.utils.toArray<HTMLElement>(
          '.exp-headline, .exp-c1-pos, .exp-c2-pos, .exp-c3-pos, .exp-c4-pos, .em-hero-badge, .em-staggered-cards',
          innerScale,
        )

        if (contentTargets.length > 0) {
          gsap.set(contentTargets, { opacity: 0.35, y: 30 })
        }

        // Master Timeline linked to ScrollTrigger
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            pin: pinStage,
            start: 'top top',
            end: () => (isDesktop ? '+=180%' : '+=90%'),
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        // Step 1: Synchronized SVG path draw & section expansion
        tl.to(
          svgPath,
          {
            strokeDashoffset: 0,
            ease: 'power2.inOut',
            duration: 1.0,
          },
          0,
        )
          .to(
            innerScale,
            {
              scale: 1,
              borderRadius: '0px',
              boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
              ease: 'power2.inOut',
              duration: 1.0,
            },
            0,
          )

        // Step 2: Stagger reveal of internal contents as portal reaches 100%
        if (contentTargets.length > 0) {
          tl.to(
            contentTargets,
            {
              opacity: 1,
              y: 0,
              stagger: 0.06,
              ease: 'power3.out',
              duration: 0.45,
            },
            0.75,
          )
        }
      })

      return () => {
        mm.revert()
      }
    },
    { scope: wrapperRef },
  )

  return (
    <div ref={wrapperRef} className="cinematic-transition-wrapper">
      {/* Pinned Stage: Stays 100vh locked while scroll drives the timeline */}
      <div ref={pinStageRef} className="cinematic-pinned-stage">
        {/* Background Atmosphere & Elegant Synchronized Curve SVG */}
        <div className="cinematic-svg-atmosphere" aria-hidden="true">
          <svg
            viewBox="0 0 1440 900"
            fill="none"
            preserveAspectRatio="none"
            className="cinematic-svg-element"
          >
            <defs>
              <linearGradient id="cinematic-spline-grad" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#0056d6" />
                <stop offset="50%" stopColor="#3d8bff" />
                <stop offset="100%" stopColor="#93c5fd" />
              </linearGradient>
              <filter id="cinematic-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Subtle glow ghost behind the main spline */}
            <path
              d="M -60 860 C 320 860, 420 180, 720 450 C 1020 720, 1140 140, 1500 120"
              stroke="#60a5fa"
              strokeWidth="10"
              strokeOpacity="0.22"
              strokeLinecap="round"
              filter="url(#cinematic-glow)"
            />

            {/* Main animated blue curve path */}
            <path
              ref={svgPathRef}
              d="M -60 860 C 320 860, 420 180, 720 450 C 1020 720, 1140 140, 1500 120"
              stroke="url(#cinematic-spline-grad)"
              strokeWidth="3.6"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Scalable Internal Portal Frame: Never transforms the pinned root */}
        <div ref={innerScaleRef} className="cinematic-portal-inner">
          {children}
        </div>
      </div>
    </div>
  )
}
