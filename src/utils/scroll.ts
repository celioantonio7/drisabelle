import { gsap } from '../animations/gsap'

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function scrollToId(id: string) {
  const target = document.getElementById(id)
  if (!target) return
  const isFooter = id === 'contato'
  if (reduced()) {
    target.scrollIntoView({ behavior: 'smooth', block: isFooter ? 'end' : 'start' })
    return
  }
  gsap.to(window, {
    duration: 1.1,
    ease: 'power3.inOut',
    scrollTo: isFooter ? { y: 'max' } : { y: target, offsetY: 70 },
  })
}

