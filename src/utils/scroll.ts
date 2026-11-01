import { gsap, ScrollTrigger } from '../animations/gsap'

export function scrollToId(id: string, options: { immediate?: boolean } = {}) {
  const target = document.getElementById(id)
  if (!target) return
  gsap.killTweensOf(window)
  ScrollTrigger.refresh()
  const navbar = document.querySelector('.nav-wrapper')
  const offset = navbar ? navbar.getBoundingClientRect().height + 24 : 88
  let y = id === 'inicio' ? 0 : target.getBoundingClientRect().top + window.scrollY - offset
  // While an ancestor is pinned, its document position still has scroll distance to consume.
  ScrollTrigger.getAll().forEach(trigger => {
    if (id !== 'inicio' && trigger.isActive && trigger.pin?.contains(target)) y += trigger.end - window.scrollY
  })
  y = Math.max(0, Math.min(y, ScrollTrigger.maxScroll(window)))
  if (options.immediate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.scrollTo({ top: y, behavior: 'instant' })
    ScrollTrigger.update()
    return
  }
  // A single native smooth scroll remains interruptible by touch or wheel.
  window.scrollTo({ top: y, behavior: 'smooth' })
}
