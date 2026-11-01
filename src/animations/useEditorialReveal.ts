import { useEffect, useRef, type RefObject } from 'react'
import { gsap, ScrollTrigger, SplitText } from './gsap'

type Kind = 'about' | 'signature'

export function useEditorialReveal(scope: RefObject<HTMLElement | null>, kind: Kind) {
  const entered = useRef(false)
  useEffect(() => {
    const root = scope.current
    if (!root) return
    let cancelled = false
    let dispose = () => {}
    // Text remains ordinary, visible HTML until fonts and enhancement are ready.
    document.fonts.ready.then(() => {
      if (cancelled) return
      const media = gsap.matchMedia()
      media.add({ motion: '(prefers-reduced-motion: no-preference)', mobile: '(max-width: 768px)' }, mediaContext => {
        if (!mediaContext.conditions?.motion) return
        const mobile = !!mediaContext.conditions.mobile
        const duration = mobile ? .72 : .95
        let animationContext: gsap.Context | undefined
        let splits: SplitText[] = []
        let frame = 0
        const reset = () => {
          animationContext?.revert()
          splits.forEach(split => { if (split.isSplit) split.revert() })
          splits = []
          cancelAnimationFrame(frame)
        }
        const build = () => {
          reset()
          const initializers: Array<() => void> = []
          let play = () => {}
          animationContext = gsap.context(() => {
            const timeline = gsap.timeline({ paused: true, defaults: { duration, ease: 'power3.out' } })
            const split = (element: Element, type: 'words' | 'lines') => {
              const instance = SplitText.create(element, {
                type, mask: type, aria: 'auto',
                wordsClass: 'editorial-word', linesClass: 'editorial-line',
              })
              splits.push(instance)
              return type === 'words' ? instance.words : instance.lines
            }
            const reveal = (targets: gsap.TweenTarget, from: gsap.TweenVars, to: gsap.TweenVars, at: number) => {
              initializers.push(() => gsap.set(targets, from))
              timeline.to(targets, to, at)
            }
            if (kind === 'signature') {
              const first = root.querySelector('.footer-cta-headline > span:first-child')
              const signature = root.querySelector('.footer-cta-headline > .text-accent-blue')
              if (!first || !signature) return
              reveal(split(first, 'words'), { yPercent: mobile ? 75 : 110, opacity: 0 },
                { yPercent: 0, opacity: 1, stagger: mobile ? .08 : .12 }, 0)
              reveal(split(signature, 'words'), {
                clipPath: 'inset(0 100% 0 0)', y: mobile ? 6 : 12, opacity: 0,
              }, {
                clipPath: 'inset(0 0% 0 0)', y: 0, opacity: 1,
                stagger: mobile ? .08 : .12, duration: mobile ? .78 : 1.05,
              }, .2)
              reveal(root.querySelector('.footer-signature-rule'), { scaleX: 0, transformOrigin: 'left center' },
                { scaleX: 1, duration: mobile ? .7 : .8 }, .45)
              reveal(root.querySelector('.footer-cta-sub'), { filter: 'blur(8px)', opacity: 0, y: mobile ? 12 : 24 },
                { filter: 'blur(0px)', opacity: 1, y: 0, duration: mobile ? .7 : .9 }, .65)
            } else {
              const eyebrow = root.querySelector('.about-desktop-header .section-eyebrow > span:first-child')
              const title = root.querySelector('.about-title')
              const subtitle = root.querySelector('.about-highlight-sub')
              if (!eyebrow || !title || !subtitle) return
              const spacing = getComputedStyle(eyebrow).letterSpacing
              reveal(eyebrow, { letterSpacing: '.38em', opacity: 0 },
                { letterSpacing: spacing, opacity: 1, duration: mobile ? .7 : .8 }, 0)
              reveal(split(title, 'words'), { yPercent: 110, opacity: 0 },
                { yPercent: 0, opacity: 1, stagger: mobile ? .07 : .10 }, .1)
              reveal(root.querySelector('.about-mandic-sub'), { clipPath: 'inset(0 100% 0 0)' },
                { clipPath: 'inset(0 0% 0 0)', duration: mobile ? .7 : .9 }, .25)
              const secondaryWords = split(subtitle, 'words')
              const sharp = { opacity: 1, filter: 'blur(0px)', y: 0, duration: mobile ? .7 : .8 }
              const soft = { opacity: 0, filter: 'blur(6px)', y: mobile ? 3 : 6 }
              reveal(secondaryWords.slice(0, 2), soft, sharp, .45)
              reveal(secondaryWords.slice(2), soft, sharp, .6)
              root.querySelectorAll('.about-text p').forEach((paragraph, index) => {
                reveal(split(paragraph, 'lines'), { y: mobile ? 10 : 20, opacity: 0 },
                  { y: 0, opacity: 1, stagger: .06, duration: mobile ? .7 : .85 }, .8 + index * .15)
              })
              const frame = root.querySelector('.about-photo-wrap')
              const portrait = root.querySelector('.fluid-reveal-container')
              if (frame && portrait) {
                reveal(frame, { clipPath: 'inset(100% 0 0 0)' },
                  { clipPath: 'inset(0% 0 0 0)', duration: mobile ? .8 : 1.1 }, 0)
                reveal(portrait, { scale: mobile ? 1.04 : 1.08 },
                  { scale: 1, duration: mobile ? .8 : 1.1 }, 0)
              }
              gsap.fromTo(root.querySelector('.about-photo-card'), { y: mobile ? -2 : -4 }, {
                y: mobile ? 2 : 4, ease: 'none', scrollTrigger: {
                  trigger: root.closest('.about-sticky-track') ?? root,
                  start: 'top bottom', end: 'bottom top', scrub: 1,
                  pinnedContainer: '.hero-transition-composition', invalidateOnRefresh: true,
                },
              })
            }
            play = () => {
              initializers.forEach(initialize => initialize())
              timeline.play(0)
            }
            if (entered.current) timeline.progress(1)
          }, root)
          const context = animationContext
          if (!entered.current) context.add(() => {
            ScrollTrigger.create({
              id: `editorial-${kind}`, trigger: kind === 'about' ? root.closest('.about-sticky-track') ?? root : root.querySelector('.footer-signature-cta'),
              start: 'top 75%', once: true,
              pinnedContainer: kind === 'about' ? '.hero-transition-composition' : undefined,
              onEnter: () => {
                entered.current = true
                context.add(play)
              },
            })
          })
          frame = requestAnimationFrame(() => ScrollTrigger.refresh())
        }
        try { build() } catch { reset() }
        const measured = root.querySelector(kind === 'about' ? '.about-content-col' : '.footer-signature-cta') ?? root
        let width = measured.getBoundingClientRect().width
        const observer = new ResizeObserver(() => {
          const nextWidth = measured.getBoundingClientRect().width
          if (Math.abs(nextWidth - width) < 1) return
          width = nextWidth
          try { build() } catch { reset() }
        })
        observer.observe(measured)
        return () => { observer.disconnect(); reset() }
      })
      dispose = () => media.revert()
    })
    return () => { cancelled = true; dispose() }
  }, [scope, kind])
}
