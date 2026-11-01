import { useRef } from 'react'
import { gsap, useGSAP } from './gsap'

/** Move only the portrait surface, leaving links and card layout stationary. */
export function useDoctorPortraitMotion() {
  const scope = useRef<HTMLElement | null>(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const cleanup: Array<() => void> = []
      const portraits = [
        ['.hero-master-canvas', '.hero-doctor-image'],
        ['.about-photo-card', '.fluid-reveal-container'],
        ['.faq-side-doctor-card', '.faq-side-doctor-img'],
        ['.exp-doctor-asym-frame', '.exp-doctor-img'],
      ]
      portraits.forEach(([hostSelector, imageSelector]) => {
        const host = document.querySelector<HTMLElement>(hostSelector)
        const portrait = host?.querySelector<HTMLElement>(imageSelector)
        if (!host || !portrait) return
        // Individual CSS transforms compose with existing GSAP parallax transforms.
        const pose = { x: 0, y: 0, angle: 0 }
        const paint = () => {
          portrait.style.translate = `${pose.x}px ${pose.y}px`
          portrait.style.rotate = `${pose.angle}deg`
        }
        const move = (event: PointerEvent) => {
          const rect = host.getBoundingClientRect()
          const x = (event.clientX - rect.left) / rect.width - .5
          const y = (event.clientY - rect.top) / rect.height - .5
          gsap.to(pose, { x: x * 10, y: y * 6, angle: x * .8, duration: .65, overwrite: true, ease: 'power2.out', onUpdate: paint })
        }
        const reset = () => gsap.to(pose, { x: 0, y: 0, angle: 0, duration: .7, overwrite: true, onUpdate: paint })
        host.addEventListener('pointermove', move)
        host.addEventListener('pointerleave', reset)
        cleanup.push(() => {
          host.removeEventListener('pointermove', move)
          host.removeEventListener('pointerleave', reset)
          gsap.killTweensOf(pose)
          portrait.style.removeProperty('translate')
          portrait.style.removeProperty('rotate')
        })
      })
      return () => cleanup.forEach(fn => fn())
    })
    return () => mm.revert()
  }, { scope })
}
