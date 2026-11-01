import { useEffect } from 'react'
import { gsap, ScrollTrigger } from './gsap'

/**
 * Premium Awwwards-Inspired GSAP + ScrollTrigger Animation System
 * Implements:
 * 1. Card entry reveal (opacity 0, y 45/25, scale 0.96 -> 1, power3.out, start: top 85%, stagger 0.12s)
 * 2. Editorial title & text reveal (masked lines rising smoothly from bottom)
 * 3. Cinematic image reveal (scale 1.08 -> 1, duration 1.2s)
 * 4. Distinct section transitions (Sobre, Especialidades, Experiência, Resultados, FAQ, Contato)
 * 5. Animated SVG decorative curves scrubbed with scroll
 * 6. Responsive matchMedia with prefers-reduced-motion safety
 */
export function useAwwwardsScrollSystem(isPageReady: boolean) {
  useEffect(() => {
    if (!isPageReady) return

    // Small delay to ensure DOM and fonts are 100% painted
    const initTimer = window.setTimeout(() => {
      const mm = gsap.matchMedia()

      // Respect prefers-reduced-motion
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(
          '[data-card-reveal], .spec-card, .exp-card, .faq-accordion-item, .rm-ba-card, .rm-split-card, .rm-insta-pill-card',
          { opacity: 1, y: 0, scale: 1, clearProps: 'all' },
        )
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const isDesktop = window.innerWidth >= 769
        const cardY = isDesktop ? 45 : 25
        const cardDuration = isDesktop ? 0.8 : 0.6

        // =========================================================================
        // 1. CARDS SCROLL REVEAL (Spec: opacity 0, y: 45/25, scale: 0.96, power3.out, top 85%)
        // =========================================================================
        const cardGroups = [
          // Specialties section cards
          {
            selector: '.spec-card-01-pos, .spec-card-02-pos, .spec-floating-planning-card, .spec-mobile-card',
            trigger: '#especialidades',
            stagger: 0.12,
          },
          // Experience cards & steps
          {
            selector: '.exp-glass-card, .exp-step-item, .exp-floating-badge',
            trigger: '#experiencia',
            stagger: 0.10,
          },
          // FAQ accordion items (progressive reveal)
          {
            selector: '.faq-accordion-item',
            trigger: '#faq',
            stagger: 0.08,
          },
          // Results mobile cards & honeycombs
          {
            selector: '.rm-ba-card, .rm-split-card, .rm-insta-pill-card, .colmeia-hex-wrapper',
            trigger: '#resultados',
            stagger: 0.12,
          },
        ]

        cardGroups.forEach((group) => {
          const els = gsap.utils.toArray<HTMLElement>(group.selector)
          if (!els.length) return

          // Initial state
          gsap.set(els, {
            opacity: 0,
            y: cardY,
            scale: 0.96,
          })

          ScrollTrigger.batch(els, {
            start: 'top 85%',
            once: true,
            onEnter: (batch) => {
              gsap.to(batch, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: cardDuration,
                ease: 'power3.out',
                stagger: group.stagger,
                clearProps: 'transform,opacity',
              })
            },
          })
        })

        // =========================================================================
        // 2. EDITORIAL TITLE & TEXT REVEAL
        // Headlines reveal from bottom with mask
        // =========================================================================
        const headlines = gsap.utils.toArray<HTMLElement>(
          '.hero-title, .about-title, .spec-headline, .exp-headline, .results-headline, .faq-headline, .footer-cta-headline',
        )

        headlines.forEach((el) => {
          gsap.fromTo(
            el,
            {
              opacity: 0,
              y: isDesktop ? 38 : 22,
            },
            {
              opacity: 1,
              y: 0,
              duration: isDesktop ? 0.9 : 0.7,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                once: true,
              },
            },
          )
        })

        // Eyebrows & Subtitles
        const subtitles = gsap.utils.toArray<HTMLElement>(
          '.section-eyebrow, .about-mobile-eyebrow, .about-mandic-sub, .about-highlight-sub, .footer-cta-eyebrow, .footer-cta-sub',
        )

        subtitles.forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 18 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                once: true,
              },
            },
          )
        })

        // =========================================================================
        // 3. CINEMATIC IMAGE REVEAL (scale 1.08 -> 1, duration 1.2s, power2.out)
        // =========================================================================
        const photoWraps = gsap.utils.toArray<HTMLElement>(
          '.hero-photo-wrap img, .about-photo-wrap, .exp-media-img, .rm-ba-viewport img',
        )

        photoWraps.forEach((img) => {
          gsap.fromTo(
            img,
            {
              scale: 1.08,
              opacity: 0.85,
            },
            {
              scale: 1,
              opacity: 1,
              duration: 1.2,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: img,
                start: 'top 88%',
                once: true,
              },
            },
          )
        })

        // Desktop subtle vertical parallax for images
        if (isDesktop) {
          const parallaxImgs = gsap.utils.toArray<HTMLElement>('[data-parallax-img]')
          parallaxImgs.forEach((target) => {
            gsap.fromTo(
              target,
              { yPercent: -5 },
              {
                yPercent: 5,
                ease: 'none',
                scrollTrigger: {
                  trigger: target.parentElement || target,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 1.2,
                },
              },
            )
          })
        }

        // =========================================================================
        // 4. SVG DECORATIVE SPLINES (Animated stroke-dashoffset scrubbed with scroll)
        // =========================================================================
        const splines = gsap.utils.toArray<SVGPathElement>(
          '.hero-spline-line, .spec-spline-line, .footer-bg-svg path[stroke], .about-svg-canvas path[stroke]',
        )

        splines.forEach((path) => {
          try {
            const length = Math.ceil(path.getTotalLength?.() || 1200)
            gsap.set(path, {
              strokeDasharray: length,
              strokeDashoffset: length,
            })

            gsap.to(path, {
              strokeDashoffset: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: path.ownerSVGElement?.parentElement || path,
                start: 'top 85%',
                end: 'bottom 25%',
                scrub: 0.8,
              },
            })
          } catch {
            // Safe fallback: keep stroke normal
          }
        })

        // =========================================================================
        // 5. SECTION-SPECIFIC TRANSITIONS
        // =========================================================================
        // Sobre: fade + slide transition
        const sobreGrid = document.querySelector('.about-grid')
        if (sobreGrid) {
          gsap.fromTo(
            sobreGrid,
            { opacity: 0.6, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: '#sobre',
                start: 'top 80%',
                once: true,
              },
            },
          )
        }

        // Especialidades: header badge pulse
        const specBadge = document.querySelector('.spec-floating-tech-badge')
        if (specBadge) {
          gsap.fromTo(
            specBadge,
            { scale: 0.85, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.7,
              ease: 'back.out(1.5)',
              scrollTrigger: {
                trigger: specBadge,
                start: 'top 85%',
                once: true,
              },
            },
          )
        }

        // Contato: CTA reveal
        const footerCta = document.querySelector('.footer-signature-cta')
        if (footerCta) {
          gsap.fromTo(
            footerCta,
            { opacity: 0, y: 40, scale: 0.97 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: footerCta,
                start: 'top 82%',
                once: true,
              },
            },
          )
        }

        ScrollTrigger.refresh()
      })

      return () => {
        mm.revert()
      }
    }, 120)

    return () => {
      window.clearTimeout(initTimer)
    }
  }, [isPageReady])
}
