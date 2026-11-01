import { useEffect, useRef } from 'react'
import { gsap } from '../animations/gsap'
import { registerBackground, type BackgroundVariant } from './backgrounds/backgroundManager'
import './SectionBackground.css'

export type SectionBackgroundProps = { variant?: BackgroundVariant }

export default function SectionBackground({ variant = 'static' }: SectionBackgroundProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const host = hostRef.current
    const section = host?.closest<HTMLElement>('[data-background-scope], section, footer')
    if (!host || !section) return
    section.classList.add('has-section-background')
    const media = gsap.matchMedia()
    media.add({ motion: '(prefers-reduced-motion: no-preference)', fine: '(hover: hover) and (pointer: fine)', desktop: '(min-width: 960px)' }, ctx => {
      const device = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
      const modestDevice = (device.deviceMemory ?? 8) < 4 || (device.hardwareConcurrency ?? 8) <= 2 || !!device.connection?.saveData
      const kinetic = !!ctx.conditions?.motion && !!ctx.conditions?.fine && !!ctx.conditions?.desktop && !modestDevice && variant !== 'static'
      const unregister = registerBackground(host, variant, { motion: kinetic, shader: kinetic })
      let onMove: ((event: PointerEvent) => void) | undefined
      let onLeave: (() => void) | undefined
      if (kinetic) {
        gsap.fromTo(host, { '--sb-presence': .55, '--sb-scroll-y': '-6px' }, {
          '--sb-presence': 1, '--sb-scroll-y': '6px', ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1, invalidateOnRefresh: true },
        })
        const x = gsap.quickTo(host, '--sb-x', { duration: .9, ease: 'power2.out' })
        const y = gsap.quickTo(host, '--sb-y', { duration: .9, ease: 'power2.out' })
        onMove = event => {
          if (event.pointerType !== 'mouse' || host.dataset.motion === 'off') return
          const bounds = section.getBoundingClientRect()
          x((event.clientX / innerWidth - .5) * 8)
          y(((event.clientY - bounds.top) / bounds.height - .5) * 8)
        }
        onLeave = () => { x(0); y(0) }
        section.addEventListener('pointermove', onMove, { passive: true })
        section.addEventListener('pointerleave', onLeave)
      }
      return () => {
        if (onMove) section.removeEventListener('pointermove', onMove)
        if (onLeave) section.removeEventListener('pointerleave', onLeave)
        unregister()
      }
    })
    return () => { media.revert(); section.classList.remove('has-section-background') }
  }, [variant])
  return <div ref={hostRef} className="section-background" data-variant={variant} data-motion="off" data-renderer="static" aria-hidden="true">
    <div className="section-background__illumination" />
  </div>
}
