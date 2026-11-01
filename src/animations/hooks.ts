import type { RefObject } from 'react'
import { gsap, SplitText } from './gsap'
import { useMotion } from './useMotion'

type Scope = RefObject<HTMLElement | null>

const q = <T extends Element = HTMLElement>(root: HTMLElement, sel: string) =>
  gsap.utils.toArray<T>(sel, root)

/* -------------------------------------------------------------------------- */
/* Section Reveal — [data-reveal]                                              */
/* -------------------------------------------------------------------------- */
export function useScrollReveal(scope: Scope) {
  useMotion(scope, ({ motion, desktop }, root) => {
    if (!motion) return
    const items = q(root, '[data-reveal]')
    if (!items.length) return
    gsap.from(items, {
      y: desktop ? 36 : 20,
      opacity: 0.2,
      duration: 0.75,
      ease: 'power3.out',
      stagger: 0.08,
      clearProps: 'all',
      scrollTrigger: {
        trigger: root,
        start: 'top 92%',
        once: true,
      },
    })
  })
}

/* -------------------------------------------------------------------------- */
/* SplitText — [data-split]  (Codrops-Paper 3D masked word & line reveal)      */
/* -------------------------------------------------------------------------- */
export function useSplitTextReveal(scope: Scope) {
  useMotion(scope, ({ motion }, root) => {
    if (!motion) return
    q(root, '[data-split]').forEach((el) => {
      try {
        const split = new SplitText(el, {
          type: 'words',
          wordsClass: 'split-word',
        })
        gsap.from(split.words, {
          y: 18,
          opacity: 0.25,
          duration: 0.75,
          ease: 'power3.out',
          stagger: 0.035,
          clearProps: 'all',
          scrollTrigger: {
            trigger: el,
            start: 'top 92%',
            once: true,
          },
        })
      } catch {
        // Safe fallback - keep text fully visible
      }
    })
  })
}

/* -------------------------------------------------------------------------- */
/* Expand Photo on Scroll — [data-expand-photo]                                */
/* -------------------------------------------------------------------------- */
export function useExpandPhotoOnScroll(scope: Scope) {
  useMotion(scope, ({ motion, desktop }, root) => {
    if (!motion) return
    q(root, '[data-expand-photo]').forEach((el) => {
      const img = el.querySelector('img')
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 92%',
          end: 'top 38%',
          scrub: 0.7,
        },
      })
      tl.fromTo(
        el,
        {
          clipPath: desktop
            ? 'inset(7% 7% 7% 7% round 46px)'
            : 'inset(4% 4% 4% 4% round 32px)',
        },
        {
          clipPath: 'inset(0% 0% 0% 0% round 28px)',
          ease: 'none',
        },
      )
      if (img) {
        tl.fromTo(
          img,
          { scale: 1.1 },
          { scale: 1, ease: 'none' },
          0,
        )
      }
    })
  })
}

/* -------------------------------------------------------------------------- */
/* Strategic Circular Expansion Reveal — [data-circle-reveal]                  */
/* -------------------------------------------------------------------------- */
export function useCircularReveal(scope: Scope) {
  useMotion(scope, ({ motion }, root) => {
    if (!motion) return
    q(root, '[data-circle-reveal]').forEach((el) => {
      gsap.fromTo(
        el,
        { clipPath: 'circle(18% at 50% 55%)' },
        {
          clipPath: 'circle(125% at 50% 50%)',
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 92%',
            end: 'top 35%',
            scrub: 0.65,
          },
        },
      )
    })
  })
}

/* -------------------------------------------------------------------------- */
/* Image Reveal — [data-img-reveal="vertical|organic"]                         */
/* -------------------------------------------------------------------------- */
export function useImageReveal(scope: Scope) {
  useMotion(scope, ({ motion }, root) => {
    if (!motion) return
    q(root, '[data-img-reveal]').forEach((el) => {
      const img = el.querySelector('img')
      const organic = el.dataset.imgReveal === 'organic'
      const from = organic
        ? 'inset(10% 8% 12% 14% round 10% 22% 14% 28%)'
        : 'inset(100% 0% 0% 0% round 0% 0% 0% 0%)'
      const to = organic
        ? 'inset(0% 0% 0% 0% round 0% 0% 0% 0%)'
        : 'inset(0% 0% 0% 0% round 0% 0% 0% 0%)'
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        onComplete: () => gsap.set(el, { clearProps: 'clipPath' }),
      })
      tl.fromTo(el, { clipPath: from }, { clipPath: to, duration: 1.2, ease: 'power3.inOut' })
      if (img) tl.fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1.5, ease: 'power3.out' }, 0)
    })
  })
}

/* -------------------------------------------------------------------------- */
/* Parallax — [data-parallax="8"]  (yPercent ± valor, scrub)                    */
/* -------------------------------------------------------------------------- */
export function useParallax(scope: Scope) {
  useMotion(scope, ({ motion, desktop }, root) => {
    if (!motion) return
    q(root, '[data-parallax]').forEach((el) => {
      const amp = parseFloat(el.dataset.parallax || '8') * (desktop ? 1 : 0.4)
      gsap.fromTo(
        el,
        { yPercent: -amp },
        {
          yPercent: amp,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement ?? el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        },
      )
    })
  })
}

/* -------------------------------------------------------------------------- */
/* Line Drawing — [data-draw] (ao entrar) e [data-draw-scrub] (com a rolagem)    */
/* -------------------------------------------------------------------------- */
const GEOM = 'path,circle,rect,line,polyline,polygon,ellipse'

function prepStroke(el: HTMLElement) {
  return q<SVGGeometryElement>(el, GEOM)
    .concat(el.matches(GEOM) ? [el as unknown as SVGGeometryElement] : [])
    .filter((p) => typeof p.getTotalLength === 'function')
    .map((p) => {
      const len = Math.ceil(p.getTotalLength()) + 1
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
      return p
    })
}

export function useLineDraw(scope: Scope) {
  useMotion(scope, ({ motion }, root) => {
    if (!motion) return
    q(root, '[data-draw]').forEach((el) => {
      const paths = prepStroke(el)
      if (!paths.length) return
      gsap.to(paths, {
        strokeDashoffset: 0,
        duration: 1.3,
        ease: 'power2.inOut',
        stagger: 0.08,
        delay: Number(el.dataset.drawDelay || 0.25),
        clearProps: 'strokeDasharray,strokeDashoffset',
        scrollTrigger: { trigger: el.closest('[data-reveal]') ?? el, start: 'top 88%', once: true },
      })
    })
    q(root, '[data-draw-scrub]').forEach((el) => {
      const paths = prepStroke(el)
      gsap.to(paths, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 35%', scrub: 1 },
      })
    })
  })
}

/* -------------------------------------------------------------------------- */
/* Magnetic Button — [data-magnetic]  (somente mouse + hover)                  */
/* -------------------------------------------------------------------------- */
export function useMagneticButton(scope: Scope) {
  useMotion(scope, ({ motion, fine }, root) => {
    if (!motion || !fine) return
    const MAX = 6
    const items = q(root, '[data-magnetic]').map((el) => {
      const inner = q(el, '[data-mag-inner]')
      return {
        el,
        x: gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' }),
        y: gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' }),
        inner: inner.map((n) => ({
          x: gsap.quickTo(n, 'x', { duration: 0.6, ease: 'power3.out' }),
          y: gsap.quickTo(n, 'y', { duration: 0.6, ease: 'power3.out' }),
        })),
        active: false,
      }
    })
    const reset = (it: (typeof items)[number]) => {
      it.active = false
      it.x(0)
      it.y(0)
      it.inner.forEach((i) => (i.x(0), i.y(0)))
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      items.forEach((it) => {
        const r = it.el.getBoundingClientRect()
        const pad = 28 // raio de aproximação
        const near =
          e.clientX > r.left - pad && e.clientX < r.right + pad &&
          e.clientY > r.top - pad && e.clientY < r.bottom + pad
        if (!near) return it.active ? reset(it) : undefined
        it.active = true
        const dx = gsap.utils.clamp(-1, 1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2))
        const dy = gsap.utils.clamp(-1, 1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2))
        it.x(dx * MAX)
        it.y(dy * MAX)
        it.inner.forEach((i) => (i.x(dx * MAX * 0.7), i.y(dy * MAX * 0.7)))
      })
    }
    const onLeaveWindow = () => items.forEach(reset)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeaveWindow)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeaveWindow)
      items.forEach((it) => gsap.set([it.el, ...q(it.el, '[data-mag-inner]')], { clearProps: 'transform' }))
    }
  })
}

/* -------------------------------------------------------------------------- */
/* Animated Border Trace — [data-trace] com <svg class="trace"><rect/></svg>    */
/* -------------------------------------------------------------------------- */
export function useAnimatedBorder(scope: Scope) {
  useMotion(scope, ({ motion, fine }, root) => {
    if (!motion || !fine) return
    const cleanups: Array<() => void> = []
    q(root, '[data-trace]').forEach((host) => {
      const rect = host.querySelector<SVGRectElement>('svg.trace rect')
      const svg = host.querySelector<SVGSVGElement>('svg.trace')
      if (!rect || !svg) return
      const radius = parseFloat(getComputedStyle(host).borderTopLeftRadius) || 16
      let len = 0
      const layout = () => {
        const { width, height } = host.getBoundingClientRect()
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
        rect.setAttribute('x', '1')
        rect.setAttribute('y', '1')
        rect.setAttribute('width', String(Math.max(0, width - 2)))
        rect.setAttribute('height', String(Math.max(0, height - 2)))
        rect.setAttribute('rx', String(Math.max(0, radius - 1)))
        len = Math.ceil(rect.getTotalLength())
        gsap.set(rect, { strokeDasharray: len, strokeDashoffset: len })
      }
      layout()
      const ro = new ResizeObserver(layout)
      ro.observe(host)
      const enter = () =>
        gsap.to(rect, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut', overwrite: true })
      const leave = () =>
        gsap.to(rect, { strokeDashoffset: len, duration: 0.45, ease: 'power2.inOut', overwrite: true })
      host.addEventListener('pointerenter', enter)
      host.addEventListener('pointerleave', leave)
      host.addEventListener('focusin', enter)
      host.addEventListener('focusout', leave)
      cleanups.push(() => {
        ro.disconnect()
        host.removeEventListener('pointerenter', enter)
        host.removeEventListener('pointerleave', leave)
        host.removeEventListener('focusin', enter)
        host.removeEventListener('focusout', leave)
      })
    })
    return () => cleanups.forEach((c) => c())
  })
}

/* -------------------------------------------------------------------------- */
/* Card 3D hover — [data-tilt]  (elevação 6px, scale 1.015, ≤2°, foto 1.04)      */
/* -------------------------------------------------------------------------- */
export function useCardTilt(scope: Scope) {
  useMotion(scope, ({ motion, fine, desktop }, root) => {
    if (!motion || !fine || !desktop) return
    const cleanups: Array<() => void> = []
    q(root, '[data-tilt]').forEach((card) => {
      const img = card.querySelector('[data-tilt-img]')
      const arrow = card.querySelector('[data-tilt-arrow]')
      const MAX = 2
      const to = (vars: gsap.TweenVars) =>
        gsap.to(card, { duration: 0.6, ease: 'power3.out', overwrite: 'auto', transformPerspective: 900, ...vars })
      const enter = () => {
        to({ y: -6, scale: 1.015 })
        if (img) gsap.to(img, { scale: 1.04, duration: 0.9, ease: 'power3.out' })
        if (arrow) gsap.to(arrow, { x: 4, duration: 0.4, ease: 'power3.out' })
      }
      const move = (e: PointerEvent) => {
        const r = card.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width - 0.5
        const py = (e.clientY - r.top) / r.height - 0.5
        to({ rotationY: px * MAX * 2, rotationX: -py * MAX * 2, y: -6, scale: 1.015 })
      }
      const leave = () => {
        to({ y: 0, scale: 1, rotationX: 0, rotationY: 0 })
        if (img) gsap.to(img, { scale: 1, duration: 0.9, ease: 'power3.out' })
        if (arrow) gsap.to(arrow, { x: 0, duration: 0.4, ease: 'power3.out' })
      }
      card.addEventListener('pointerenter', enter)
      card.addEventListener('pointermove', move)
      card.addEventListener('pointerleave', leave)
      cleanups.push(() => {
        card.removeEventListener('pointerenter', enter)
        card.removeEventListener('pointermove', move)
        card.removeEventListener('pointerleave', leave)
        gsap.set([card, img, arrow].filter(Boolean) as Element[], { clearProps: 'transform' })
      })
    })
    return () => cleanups.forEach((c) => c())
  })
}

/* -------------------------------------------------------------------------- */
/* Float — continuous oval drift; no shared stop at the turning points.       */
/* -------------------------------------------------------------------------- */
export function useFloat(scope: Scope) {
  useMotion(scope, ({ motion }, root) => {
    if (!motion) return
    const cleanups: Array<() => void> = []
    q(root, '[data-float]').forEach(el => {
      const original = el.style.transform
      const phase = { angle: 0 }
      const paint = (transform: string) => { el.style.transform = transform }
      const tween = gsap.to(phase, {
        angle: Math.PI * 2, duration: 11.5, ease: 'none', repeat: -1, paused: true,
        onUpdate: () => {
          const x = Math.sin(phase.angle) * 3
          const y = (Math.cos(phase.angle) - 1) * 4
          const roll = Math.sin(phase.angle) * .14
          paint(`translate3d(${x}px, ${y}px, 0) rotate(${roll}deg)`)
        },
      })
      let visible = false
      const sync = () => { if (visible && !document.hidden) tween.play(); else tween.pause() }
      // A margin wider than the drift prevents pause/resume flicker at the edge.
      const observer = new IntersectionObserver(entries => {
        visible = entries[0]?.isIntersecting ?? false
        sync()
      }, { rootMargin: '40px 0px' })
      observer.observe(el)
      document.addEventListener('visibilitychange', sync)
      cleanups.push(() => {
        observer.disconnect()
        document.removeEventListener('visibilitychange', sync)
        tween.kill()
        el.style.transform = original
      })
    })
    return () => cleanups.forEach(cleanup => cleanup())
  })
}
