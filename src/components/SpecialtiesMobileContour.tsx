import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../animations/gsap'
import './SpecialtiesMobileContour.css'

/** The same path defines the pale surface, its edge and the travelling light. */
export default function SpecialtiesMobileContour() {
  const svgRef = useRef<SVGSVGElement>(null)
  useLayoutEffect(() => {
    const svg = svgRef.current
    const row = svg?.parentElement
    const lead = row?.querySelector<HTMLElement>('.spec-col-lead')
    const edge = svg?.querySelector<SVGPathElement>('.spec-contour-edge')
    const light = svg?.querySelector<SVGPathElement>('.spec-contour-light')
    const surface = svg?.querySelector<SVGPathElement>('.spec-contour-surface')
    if (!svg || !row || !lead || !edge || !light || !surface) return
    const media = gsap.matchMedia()
    media.add({ mobile: '(max-width: 1023px)', motion: '(prefers-reduced-motion: no-preference)' }, context => {
      if (!context.conditions?.mobile) return
      let tween: gsap.core.Tween | undefined
      let lastSize = ''
      const layout = () => {
        const bounds = svg.getBoundingClientRect()
        const text = lead.getBoundingClientRect()
        const w = bounds.width
        const h = bounds.height
        if (!w || !h) return
        const size = `${w}:${h}:${text.width}:${text.height}`
        if (size === lastSize) return
        lastSize = size
        const x = Math.min(w - 64, text.right - bounds.left + 1)
        const amplitude = Math.min(14, w * .035)
        const path = `M ${x - 16} 0 C ${x - 10} ${h * .09}, ${x - 18} ${h * .18}, ${x} ${h * .24} S ${x + amplitude} ${h * .30}, ${x + amplitude} ${h * .35} S ${x + 6} ${h * .45}, ${x} ${h * .50} C ${x + amplitude} ${h * .51}, ${x + amplitude} ${h * .55}, ${x + amplitude * .6} ${h * .59} S ${x + 6} ${h * .70}, ${x - 8} ${h * .75} S ${x - 16} ${h * .80}, ${x - 16} ${h * .88} S ${x - 10} ${h * .97}, ${x + 12} ${h}`
        svg.setAttribute('viewBox', `0 0 ${w} ${h}`)
        surface.setAttribute('d', `${path} L 0 ${h} L 0 0 Z`)
        edge.setAttribute('d', path)
        light.setAttribute('d', path)
        const length = light.getTotalLength()
        tween?.scrollTrigger?.kill()
        tween?.kill()
        if (context.conditions?.motion) {
          const progress = .12
          gsap.set(light, { strokeDasharray: `${length * progress} ${length}`, strokeDashoffset: length * progress, opacity: 1 })
          tween = gsap.to(light, { strokeDashoffset: -length, ease: 'none', scrollTrigger: {
            trigger: row, start: 'top 80%', end: 'bottom 20%', scrub: .7, invalidateOnRefresh: true,
          } })
        }
      }
      layout()
      const observer = new ResizeObserver(layout)
      observer.observe(row)
      observer.observe(lead)
      let mounted = true
      document.fonts.ready.then(() => { if (mounted) layout() })
      const refresh = requestAnimationFrame(() => ScrollTrigger.refresh())
      return () => {
        mounted = false
        cancelAnimationFrame(refresh)
        observer.disconnect()
        tween?.scrollTrigger?.kill()
        tween?.kill()
      }
    })
    return () => media.revert()
  }, [])
  return <svg ref={svgRef} className="spec-mobile-contour" fill="none" aria-hidden="true" focusable="false">
    <path className="spec-contour-surface" />
    <path className="spec-contour-edge" />
    <path className="spec-contour-light" />
  </svg>
}
