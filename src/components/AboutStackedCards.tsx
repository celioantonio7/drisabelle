import { useRef, useState } from 'react'
import { GraduationCap, Award, HeartHandshake } from 'lucide-react'
import { gsap, useGSAP, ScrollTrigger } from '../animations/gsap'

export default function AboutStackedCards() {
  const containerRef = useRef<HTMLDivElement>(null)
  const deckRef = useRef<HTMLDivElement>(null)
  const isAnimatingRef = useRef(false)
  const hasCompletedRef = useRef(false)

  // Drag interaction state
  const dragStartRef = useRef<{ x: number; y: number } | null>(null)
  const currentDragCardRef = useRef<HTMLElement | null>(null)

  // Track the current display order of cards: [slot0, slot1, slot2, slot3]
  // card 0: Electric Blue, 1: Vibrant Purple, 2: Deep Turquoise, 3: Amber Orange
  const [deckOrder, setDeckOrder] = useState<number[]>([0, 1, 2, 3])
  const deckOrderRef = useRef<number[]>([0, 1, 2, 3])
  deckOrderRef.current = deckOrder

  useGSAP(
    () => {
      if (!deckRef.current || !containerRef.current) return

      const cards = gsap.utils.toArray<HTMLElement>('.about-stacked-card', deckRef.current)
      if (cards.length < 4) return

      const mm = gsap.matchMedia()

      // =========================================================================
      // 1. DESKTOP ANIMATION (>= 769px)
      // Trava na primeira rolagem até o último card subir.
      // Uma vez completado, destrava e rolar para cima mantém o stack montado.
      // =========================================================================
      mm.add('(min-width: 769px)', () => {
        if (hasCompletedRef.current) {
          // Já completado: manter empilhado permanentemente
          gsap.set(cards[0], { scale: 0.88, y: -24, opacity: 1, zIndex: 10, yPercent: 0 })
          gsap.set(cards[1], { scale: 0.92, y: 8, opacity: 1, zIndex: 20, yPercent: 0 })
          gsap.set(cards[2], { scale: 0.96, y: 40, opacity: 1, zIndex: 30, yPercent: 0 })
          gsap.set(cards[3], { scale: 1.0, y: 72, opacity: 1, zIndex: 40, yPercent: 0 })
          return
        }

        // Initial state: Card 01 static and visible; Cards 02, 03, 04 hidden below
        gsap.set(cards[0], { y: 0, scale: 1, opacity: 1, zIndex: 10, yPercent: 0 })
        gsap.set(cards[1], { yPercent: 125, y: 0, scale: 0.98, opacity: 0, zIndex: 20 })
        gsap.set(cards[2], { yPercent: 135, y: 0, scale: 0.98, opacity: 0, zIndex: 30 })
        gsap.set(cards[3], { yPercent: 145, y: 0, scale: 0.98, opacity: 0, zIndex: 40 })

        const lockAndComplete = (st?: ScrollTrigger) => {
          if (hasCompletedRef.current) return
          hasCompletedRef.current = true
          gsap.set(cards[0], { scale: 0.88, y: -24, opacity: 1, zIndex: 10, yPercent: 0 })
          gsap.set(cards[1], { scale: 0.92, y: 8, opacity: 1, zIndex: 20, yPercent: 0 })
          gsap.set(cards[2], { scale: 0.96, y: 40, opacity: 1, zIndex: 30, yPercent: 0 })
          gsap.set(cards[3], { scale: 1.0, y: 72, opacity: 1, zIndex: 40, yPercent: 0 })
          if (st) {
            st.kill(false)
            ScrollTrigger.refresh()
          }
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '#sobre',
            start: 'top top+=65',
            end: '+=680',
            pin: true,
            pinSpacing: true,
            scrub: 0.65,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onLeave: (self) => {
              lockAndComplete(self)
            },
            onUpdate: (self) => {
              // Se atingiu o final do empilhamento na primeira rolagem, fixa e destrava
              if (self.progress >= 0.98 && !hasCompletedRef.current) {
                lockAndComplete(self)
              }
            },
          },
        })

        // STAGE 1: Card 01 comprime, Card 02 sobe e empilha
        tl.to(
          cards[0],
          {
            scale: 0.96,
            y: -8,
            duration: 1,
            ease: 'power1.inOut',
          },
          0,
        )
          .fromTo(
            cards[1],
            { yPercent: 125, opacity: 0 },
            {
              yPercent: 0,
              y: 24,
              opacity: 1,
              scale: 1,
              duration: 1,
              ease: 'power1.inOut',
            },
            0,
          )
          .fromTo(
            cards[1].querySelector('.about-stack-card-shine'),
            { opacity: 0, x: -30 },
            { opacity: 1, x: 0, duration: 0.8, ease: 'power1.out' },
            0.1,
          )

        // STAGE 2: Cards 01 & 02 comprimem, Card 03 sobe e empilha
        tl.to(
          cards[0],
          {
            scale: 0.92,
            y: -16,
            duration: 1,
            ease: 'power1.inOut',
          },
          1,
        )
          .to(
            cards[1],
            {
              scale: 0.96,
              y: 16,
              duration: 1,
              ease: 'power1.inOut',
            },
            1,
          )
          .fromTo(
            cards[2],
            { yPercent: 135, opacity: 0 },
            {
              yPercent: 0,
              y: 48,
              opacity: 1,
              scale: 1,
              duration: 1,
              ease: 'power1.inOut',
            },
            1,
          )
          .fromTo(
            cards[2].querySelector('.about-stack-card-shine'),
            { opacity: 0, x: -30 },
            { opacity: 1, x: 0, duration: 0.8, ease: 'power1.out' },
            1.1,
          )

        // STAGE 3: Cards 01, 02, 03 comprimem, Card 04 sobe e completa o stack
        tl.to(
          cards[0],
          {
            scale: 0.88,
            y: -24,
            duration: 1,
            ease: 'power1.inOut',
          },
          2,
        )
          .to(
            cards[1],
            {
              scale: 0.92,
              y: 8,
              duration: 1,
              ease: 'power1.inOut',
            },
            2,
          )
          .to(
            cards[2],
            {
              scale: 0.96,
              y: 40,
              duration: 1,
              ease: 'power1.inOut',
            },
            2,
          )
          .fromTo(
            cards[3],
            { yPercent: 145, opacity: 0 },
            {
              yPercent: 0,
              y: 72,
              opacity: 1,
              scale: 1,
              duration: 1,
              ease: 'power1.inOut',
            },
            2,
          )
          .fromTo(
            cards[3].querySelector('.about-stack-card-shine'),
            { opacity: 0, x: -30 },
            { opacity: 1, x: 0, duration: 0.8, ease: 'power1.out' },
            2.1,
          )
      })

      // =========================================================================
      // 2. MOBILE ANIMATION (<= 768px)
      // =========================================================================
      mm.add('(max-width: 768px)', () => {
        if (hasCompletedRef.current) {
          gsap.set(cards[0], { scale: 0.91, y: -16, opacity: 1, zIndex: 10, yPercent: 0 })
          gsap.set(cards[1], { scale: 0.94, y: 8, opacity: 1, zIndex: 20, yPercent: 0 })
          gsap.set(cards[2], { scale: 0.97, y: 32, opacity: 1, zIndex: 30, yPercent: 0 })
          gsap.set(cards[3], { scale: 1.0, y: 56, opacity: 1, zIndex: 40, yPercent: 0 })
          return
        }

        gsap.set(cards[0], { y: 0, scale: 1, opacity: 1, zIndex: 10, yPercent: 0 })
        gsap.set(cards[1], { yPercent: 110, y: 0, scale: 0.98, opacity: 0, zIndex: 20 })
        gsap.set(cards[2], { yPercent: 120, y: 0, scale: 0.98, opacity: 0, zIndex: 30 })
        gsap.set(cards[3], { yPercent: 130, y: 0, scale: 0.98, opacity: 0, zIndex: 40 })

        const lockMobileAndComplete = (st?: ScrollTrigger) => {
          if (hasCompletedRef.current) return
          hasCompletedRef.current = true
          gsap.set(cards[0], { scale: 0.91, y: -16, opacity: 1, zIndex: 10, yPercent: 0 })
          gsap.set(cards[1], { scale: 0.94, y: 8, opacity: 1, zIndex: 20, yPercent: 0 })
          gsap.set(cards[2], { scale: 0.97, y: 32, opacity: 1, zIndex: 30, yPercent: 0 })
          gsap.set(cards[3], { scale: 1.0, y: 56, opacity: 1, zIndex: 40, yPercent: 0 })
          if (st) {
            st.kill(false)
            ScrollTrigger.refresh()
          }
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 0.5,
            invalidateOnRefresh: true,
            onLeave: (self) => {
              lockMobileAndComplete(self)
            },
            onUpdate: (self) => {
              if (self.progress >= 0.98 && !hasCompletedRef.current) {
                lockMobileAndComplete(self)
              }
            },
          },
        })

        tl.to(cards[0], { scale: 0.96, y: -6, duration: 1, ease: 'power1.inOut' }, 0)
          .fromTo(
            cards[1],
            { yPercent: 110, opacity: 0 },
            { yPercent: 0, y: 20, opacity: 1, scale: 1, duration: 1, ease: 'power1.inOut' },
            0,
          )

        tl.to(cards[0], { scale: 0.93, y: -12, duration: 1, ease: 'power1.inOut' }, 1)
          .to(cards[1], { scale: 0.96, y: 14, duration: 1, ease: 'power1.inOut' }, 1)
          .fromTo(
            cards[2],
            { yPercent: 120, opacity: 0 },
            { yPercent: 0, y: 40, opacity: 1, scale: 1, duration: 1, ease: 'power1.inOut' },
            1,
          )

        tl.to(cards[0], { scale: 0.91, y: -16, duration: 1, ease: 'power1.inOut' }, 2)
          .to(cards[1], { scale: 0.94, y: 8, duration: 1, ease: 'power1.inOut' }, 2)
          .to(cards[2], { scale: 0.97, y: 32, duration: 1, ease: 'power1.inOut' }, 2)
          .fromTo(
            cards[3],
            { yPercent: 130, opacity: 0 },
            { yPercent: 0, y: 56, opacity: 1, scale: 1, duration: 1, ease: 'power1.inOut' },
            2,
          )
      })

      // =========================================================================
      // 3. ACCESSIBILITY: REDUCED MOTION
      // =========================================================================
      mm.add('(prefers-reduced-motion: reduce)', () => {
        hasCompletedRef.current = true
        gsap.set(cards[0], { y: -24, scale: 0.88, opacity: 1, zIndex: 10, yPercent: 0 })
        gsap.set(cards[1], { y: 8, scale: 0.92, opacity: 1, zIndex: 20, yPercent: 0 })
        gsap.set(cards[2], { y: 40, scale: 0.96, opacity: 1, zIndex: 30, yPercent: 0 })
        gsap.set(cards[3], { y: 72, scale: 1.0, opacity: 1, zIndex: 40, yPercent: 0 })
      })

      return () => mm.revert()
    },
    { scope: containerRef },
  )

  // =========================================================================
  // INTERAÇÃO DE PUXAR / CLICAR ("pode também puxar/trocar igual era antes")
  // Cicla a carta do topo para trás, avançando todas as outras
  // =========================================================================
  const cycleCardToBack = (directionX = 85) => {
    if (isAnimatingRef.current || !deckRef.current) return
    const order = [...deckOrderRef.current]
    if (order.length < 4) return

    // Front card is the last element in deckOrder
    const frontCardIndex = order[order.length - 1]
    const frontCardEl = deckRef.current.querySelector<HTMLElement>(`[data-index="${frontCardIndex}"]`)
    if (!frontCardEl) return

    isAnimatingRef.current = true

    // New order: front card moves to the back (index 0)
    const newOrder = [frontCardIndex, order[0], order[1], order[2]]

    const isMobile = window.innerWidth <= 768
    const desktopSlots = [
      { y: -24, scale: 0.88, zIndex: 10 },
      { y: 8, scale: 0.92, zIndex: 20 },
      { y: 40, scale: 0.96, zIndex: 30 },
      { y: 72, scale: 1.0, zIndex: 40 },
    ]
    const mobileSlots = [
      { y: -16, scale: 0.91, zIndex: 10 },
      { y: 8, scale: 0.94, zIndex: 20 },
      { y: 32, scale: 0.97, zIndex: 30 },
      { y: 56, scale: 1.0, zIndex: 40 },
    ]
    const slots = isMobile ? mobileSlots : desktopSlots

    // 1. Animate other cards moving one slot forward
    for (let slot = 0; slot < 3; slot++) {
      const cardIdx = order[slot]
      const cardEl = deckRef.current.querySelector<HTMLElement>(`[data-index="${cardIdx}"]`)
      if (cardEl) {
        const nextSlot = slots[slot + 1]
        gsap.to(cardEl, {
          y: nextSlot.y,
          scale: nextSlot.scale,
          zIndex: nextSlot.zIndex,
          duration: 0.38,
          ease: 'power2.out',
        })
      }
    }

    // 2. Animate front card flying out, lowering zIndex to 5, and sliding back into slot 0
    const backSlot = slots[0]
    gsap.timeline({
      onComplete: () => {
        setDeckOrder(newOrder)
        deckOrderRef.current = newOrder
        isAnimatingRef.current = false
      },
    })
      .to(frontCardEl, {
        x: directionX,
        rotation: directionX > 0 ? 6 : -6,
        scale: 0.94,
        opacity: 0.85,
        duration: 0.20,
        ease: 'power2.out',
      })
      .set(frontCardEl, {
        zIndex: 5,
        y: backSlot.y,
        scale: backSlot.scale,
      })
      .to(frontCardEl, {
        x: 0,
        rotation: 0,
        opacity: 1,
        zIndex: backSlot.zIndex,
        duration: 0.26,
        ease: 'power2.inOut',
      })
  }

  // Pointer event listeners to support physical dragging / pulling on cards
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isAnimatingRef.current) return
    dragStartRef.current = { x: e.clientX, y: e.clientY }
    currentDragCardRef.current = e.currentTarget
    if (e.pointerType === 'mouse') {
      try {
        e.currentTarget.setPointerCapture(e.pointerId)
      } catch {
        // ignore
      }
    }
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current || !currentDragCardRef.current) return
    const deltaX = e.clientX - dragStartRef.current.x
    const deltaY = e.clientY - dragStartRef.current.y
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    try {
      if (currentDragCardRef.current.hasPointerCapture(e.pointerId)) {
        currentDragCardRef.current.releasePointerCapture(e.pointerId)
      }
    } catch {
      // ignore
    }

    dragStartRef.current = null
    currentDragCardRef.current = null

    // If vertical movement dominated (user was scrolling the page on touch), do NOT cycle!
    if (absY > absX && absY > 15) {
      return
    }

    // Se puxou mais de 25px horizontalmente
    if (absX > 25) {
      cycleCardToBack(deltaX >= 0 ? 85 : -85)
    } else if (absX < 10 && absY < 10) {
      // Clique ou toque simples deliberado: cicla a carta para trás
      cycleCardToBack(80)
    }
  }

  return (
    <div ref={containerRef} className="about-stack-scroll-wrapper">
      <div
        ref={deckRef}
        className="about-stack-scroll-deck is-interactive-deck"
        aria-label="Diferenciais e Credenciais — Puxe ou clique para alternar os cards"
      >
        {/* CARD 01 — AZUL ELÉTRICO (#0036B8 → #0755E9 → #2585FF) */}
        <div
          className="about-stacked-card about-card-electric-blue"
          data-index="0"
          role="button"
          tabIndex={0}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          aria-label="Card 1: Ciência, Arte e Naturalidade. Puxe ou clique para alternar."
          onKeyDown={(e) => e.key === 'Enter' && cycleCardToBack(80)}
        >
          <div className="about-stack-card-inner">
            <div className="about-stack-card-shine" aria-hidden="true" />
            <div className="about-stack-card-left">
              <div className="about-stack-texts">
                <strong className="about-science-tags">CIÊNCIA &bull; ARTE &bull; NATURALIDADE</strong>
                <p className="about-science-desc">Cuidado individualizado em cada etapa.</p>
              </div>
            </div>
            <span className="about-stack-badge">01 / 04</span>
          </div>
        </div>

        {/* CARD 02 — ROXO VIBRANTE (#4610A8 → #7624E8 → #A248FF) */}
        <div
          className="about-stacked-card about-card-vibrant-purple"
          data-index="1"
          role="button"
          tabIndex={0}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          aria-label="Card 2: Dentística e Harmonização Facial. Puxe ou clique para alternar."
          onKeyDown={(e) => e.key === 'Enter' && cycleCardToBack(80)}
        >
          <div className="about-stack-card-inner">
            <div className="about-stack-card-shine" aria-hidden="true" />
            <div className="about-stack-card-left">
              <span className="about-stack-icon-pill" aria-hidden="true">
                <GraduationCap size={22} className="about-cred-icon" />
              </span>
              <div className="about-stack-texts">
                <strong>Dentística &amp; Harmonização Facial</strong>
                <p>Protocolos avançados em Lentes de Resina, Porcelana e Full Face</p>
              </div>
            </div>
            <span className="about-stack-badge">02 / 04</span>
          </div>
        </div>

        {/* CARD 03 — TURQUESA PROFUNDO (#00535E → #008C92 → #00C7BD) */}
        <div
          className="about-stacked-card about-card-deep-turquoise"
          data-index="2"
          role="button"
          tabIndex={0}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          aria-label="Card 3: Excelência Estética. Puxe ou clique para alternar."
          onKeyDown={(e) => e.key === 'Enter' && cycleCardToBack(80)}
        >
          <div className="about-stack-card-inner">
            <div className="about-stack-card-shine" aria-hidden="true" />
            <div className="about-stack-card-left">
              <span className="about-stack-icon-pill" aria-hidden="true">
                <Award size={22} className="about-cred-icon" />
              </span>
              <div className="about-stack-texts">
                <strong>Excelência Estética</strong>
                <p>Mais de 10 anos transformando sorrisos com precisão e harmonia</p>
              </div>
            </div>
            <span className="about-stack-badge">03 / 04</span>
          </div>
        </div>

        {/* CARD 04 — LARANJA ÂMBAR (#B74200 → #E86B12 → #FF9A26) */}
        <div
          className="about-stacked-card about-card-amber-orange"
          data-index="3"
          role="button"
          tabIndex={0}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          aria-label="Card 4: Atendimento Privativo. Puxe ou clique para alternar."
          onKeyDown={(e) => e.key === 'Enter' && cycleCardToBack(80)}
        >
          <div className="about-stack-card-inner">
            <div className="about-stack-card-shine" aria-hidden="true" />
            <div className="about-stack-card-left">
              <span className="about-stack-icon-pill" aria-hidden="true">
                <HeartHandshake size={22} className="about-cred-icon" />
              </span>
              <div className="about-stack-texts">
                <strong>Atendimento Privativo</strong>
                <p>Número limitado de pacientes por período para máxima dedicação</p>
              </div>
            </div>
            <span className="about-stack-badge">04 / 04</span>
          </div>
        </div>
      </div>
    </div>
  )
}
