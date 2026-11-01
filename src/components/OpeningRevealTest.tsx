import { useEffect, useRef, useState } from 'react'
import { gsap } from '../animations/gsap'
import './OpeningRevealTest.css'

export type OpeningVariant = 'curva' | 'arco' | 'paineis'
/** Opt-in previews only. The normal site keeps its signature opening. */
export default function OpeningRevealTest({ ready, variant }: { ready: boolean; variant: OpeningVariant }) {
  const ref = useRef<SVGSVGElement>(null)
  const [done, setDone] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    if (!ready) return
    const root = ref.current
    if (!root) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let active = true
    let timeout: ReturnType<typeof setTimeout>
    const context = gsap.context(() => {}, root)
    const assets = [document.fonts.ready, ...Array.from(document.querySelectorAll<HTMLImageElement>('#inicio img')).slice(0, 2).map(image => image.decode())]
    Promise.race([Promise.allSettled(assets), new Promise(resolve => { timeout = setTimeout(resolve, 1500) })]).then(() => {
      if (!active) return
      clearTimeout(timeout)
      context.add(() => {
        const timeline = gsap.timeline({ delay: .55, defaults: { duration: 1.05, ease: 'power3.inOut' }, onComplete: () => setDone(true) })
        if (variant === 'curva') {
          timeline.to('.opening-test-curtain', { attr: { d: 'M0 0 H1000 V0 C750 -160 250 -160 0 0 Z' } })
        } else if (variant === 'arco') {
          timeline.to('.opening-test-aperture', { attr: { r: 1500 }, duration: 1.1 })
        } else {
          timeline.to('.opening-test-panel-left', { x: -530 }, 0).to('.opening-test-panel-right', { x: 530 }, 0)
        }
        timeline.to(root, { opacity: 0, duration: .15 }, '-=.1')
      })
    })
    return () => { active = false; clearTimeout(timeout); context.revert() }
  }, [ready, variant])
  if (done) return null
  return <svg ref={ref} className="opening-reveal-test" data-opening={variant} viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
    {variant === 'curva' && <path className="opening-test-curtain" d="M0 0 H1000 V1000 C750 1000 250 1000 0 1000 Z" fill="#f8fbff" stroke="#91bdf5" strokeWidth="2" />}
    {variant === 'arco' && <>
      <defs><mask id="opening-test-iris"><rect width="1000" height="1000" fill="white" /><circle className="opening-test-aperture" cx="500" cy="450" r="0" fill="black" /></mask></defs>
      <rect width="1000" height="1000" fill="#f8fbff" mask="url(#opening-test-iris)" />
    </>}
    {variant === 'paineis' && <>
      <path className="opening-test-panel-left" d="M0 0H500C560 280 440 720 500 1000H0Z" fill="#f8fbff" stroke="#c8dfff" />
      <path className="opening-test-panel-right" d="M500 0H1000V1000H500C440 720 560 280 500 0Z" fill="#f8fbff" stroke="#c8dfff" />
    </>}
  </svg>
}
