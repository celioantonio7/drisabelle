import { useRef, useState } from 'react'
import { GraduationCap, Award, HeartHandshake } from 'lucide-react'
import { gsap, useGSAP } from '../animations/gsap'

export default function AboutStackedCards() {
  const containerRef = useRef<HTMLDivElement>(null)
  const deckRef = useRef<HTMLDivElement>(null)
  const isAnimatingRef = useRef(false)
  const hasCompletedRef = useRef(false)

  // Drag interaction state
  const dragStartRef = useRef<{ x: number; y: number } | null>(null)
  const currentDragCardRef = useRef<HTMLElement | null>(null)

  // Track the current display order of cards [0, 1, 2, 3]
  // card 0: Electric Blue, 1: Vibrant Purple, 2: Deep Turquoise, 3: Amber Orange
  const [, setActiveCardsOrder] = useState<number[]>([0, 1, 2, 3])

  useGSAP(
    () => {
      if (!deckRef.current || !containerRef.current) return

      const cards = gsap.utils.toArray<HTMLElement>('.about-stacked-card', deckRef.current)
      if (cards.length < 4) return

      const mm = gsap.matchMedia()

      // =========================================================================
      // 1. DESKTOP ANIMATION (>= 769px)
      // Trava na primeira rolagem até o último card subir.
      // Uma vez completado, rolar para cima mantém o stack montado.
      // =========================================================================
      mm.add('(min-width: 769px)', () => {
        // Initial state: Card 01 static and visible; Cards 02, 03, 04 hidden below
        gsap.set(cards[0], { y: 0, scale: 1, opacity: 1, zIndex: 10 })
        gsap.set(cards[1], { yPercent: 125, y: 0, scale: 0.98, opacity: 0, zIndex: 20 })
        gsap.set(cards[2], { yPercent: 135, y: 0, scale: 0.98, opacity: 0, zIndex: 30 })
        gsap.set(cards[3], { yPercent: 145, y: 0, scale: 0.98, opacity: 0, zIndex: 40 })

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
            onLeave: () => {
              // Quando o último card terminar de subir, marca como completado
              hasCompletedRef.current = true
            },
            onUpdate: (self) => {
              // Se já completou uma vez na descida, ao rolar para cima não desmonta os cards
              if (hasCompletedRef.current && self.direction === -1 && self.progress < 0.99) {
                // Mantém todos empilhados permanentemente
                gsap.set(cards[0], { scale: 0.88, y: -24, opacity: 1, zIndex: 10 })
                gsap.set(cards[1], { scale: 0.92, y: 8, yPercent: 0, opacity: 1, zIndex: 20 })
                gsap.set(cards[2], { scale: 0.96, y: 40, yPercent: 0, opacity: 1, zIndex: 30 })
                gsap.set(cards[3], { scale: 1, y: 72, yPercent: 0, opacity: 1, zIndex: 40 })
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
        gsap.set(cards[0], { y: 0, scale: 1, opacity: 1, zIndex: 10 })
        gsap.set(cards[1], { yPercent: 110, y: 0, scale: 0.98, opacity: 0, zIndex: 20 })
        gsap.set(cards[2], { yPercent: 120, y: 0, scale: 0.98, opacity: 0, zIndex: 30 })
        gsap.set(cards[3], { yPercent: 130, y: 0, scale: 0.98, opacity: 0, zIndex: 40 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            end: 'bottom 25%',
            scrub: 0.5,
            invalidateOnRefresh: true,
            onLeave: () => {
              hasCompletedRef.current = true
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

        tl.to(cards[0], { scale: 0.90, y: -18, duration: 1, ease: 'power1.inOut' }, 2)
          .to(cards[1], { scale: 0.93, y: 8, duration: 1, ease: 'power1.inOut' }, 2)
          .to(cards[2], { scale: 0.96, y: 34, duration: 1, ease: 'power1.inOut' }, 2)
          .fromTo(
            cards[3],
            { yPercent: 130, opacity: 0 },
            { yPercent: 0, y: 60, opacity: 1, scale: 1, duration: 1, ease: 'power1.inOut' },
            2,
          )
      })

      // =========================================================================
      // 3. ACCESSIBILITY: REDUCED MOTION
      // ==========================================
      mm.add('(prefers-reduced-motion: reduce)', () => {
        hasCompletedRef.current = true
        gsap.set(cards[0], { y: 0, scale: 1, opacity: 1, zIndex: 10 })
        gsap.set(cards[1], { y: 24, scale: 0.97, opacity: 1, zIndex: 20 })
        gsap.set(cards[2], { y: 48, scale: 0.94, opacity: 1, zIndex: 30 })
        gsap.set(cards[3], { y: 72, scale: 0.91, opacity: 1, zIndex: 40 })
      })

      return () => mm.revert()
    },
    { scope: containerRef },
  )

  // =========================================================================
  // INTERAÇÃO DE PUXAR / CLICAR ("pode também puxar/trocar igual era antes")
  // =========================================================================
  const sendCardToBack = (cardIndex: number, directionX = 80) => {
    if (isAnimatingRef.current || !deckRef.current) return
    const cardEl = deckRef.current.querySelector<HTMLElement>(`[data-index="${cardIndex}"]`)
    if (!cardEl) return

    isAnimatingRef.current = true

    const currentZ = parseInt(window.getComputedStyle(cardEl).zIndex || '40', 10)
    gsap.timeline({
      onComplete: () => {
        setActiveCardsOrder((prev) => {
          const rest = prev.filter((i) => i !== cardIndex)
          return [...rest, cardIndex]
        })
        isAnimatingRef.current = false
      },
    })
      .to(cardEl, {
        x: directionX,
        rotation: directionX > 0 ? 5 : -5,
        scale: 0.92,
        opacity: 0.85,
        duration: 0.22,
        ease: 'power2.out',
      })
      .set(cardEl, {
        zIndex: Math.max(1, currentZ - 35),
      })
      .to(cardEl, {
        x: 0,
        rotation: 0,
        scale: 0.96,
        opacity: 1,
        duration: 0.32,
        ease: 'power2.inOut',
      })
  }

  // Pointer event listeners to support physical dragging / pulling on cards
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isAnimatingRef.current) return
    dragStartRef.current = { x: e.clientX, y: e.clientY }
    currentDragCardRef.current = e.currentTarget
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>, cardIdx: number) => {
    if (!dragStartRef.current || !currentDragCardRef.current) return
    const deltaX = e.clientX - dragStartRef.current.x
    const deltaY = e.clientY - dragStartRef.current.y
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    try {
      currentDragCardRef.current.releasePointerCapture(e.pointerId)
    } catch {
      // ignore
    }

    dragStartRef.current = null
    currentDragCardRef.current = null

    // Se puxou mais de 35px para o lado ou para cima, ou se foi um clique simples
    if (absX > 35 || absY > 35) {
      sendCardToBack(cardIdx, deltaX >= 0 ? 90 : -90)
    } else {
      // Clique simples também envia para trás
      sendCardToBack(cardIdx, 75)
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
          onPointerUp={(e) => handlePointerUp(e, 0)}
          aria-label="Card 1: Ciência, Arte e Naturalidade. Puxe ou clique para alternar."
          onKeyDown={(e) => e.key === 'Enter' && sendCardToBack(0, 75)}
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
          onPointerUp={(e) => handlePointerUp(e, 1)}
          aria-label="Card 2: Dentística e Harmonização Facial. Puxe ou clique para alternar."
          onKeyDown={(e) => e.key === 'Enter' && sendCardToBack(1, 75)}
        >
          <div className="about-stack-card-inner">
            <div className="about-stack-card-shine" aria-hidden="true" />
            <div className="about-stack-card-left">
              <div className="about-stack-icon-pill">
                <GraduationCap width={20} height={20} className="about-cred-icon" />
              </div>
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
          onPointerUp={(e) => handlePointerUp(e, 2)}
          aria-label="Card 3: Excelência Estética. Puxe ou clique para alternar."
          onKeyDown={(e) => e.key === 'Enter' && sendCardToBack(2, 75)}
        >
          <div className="about-stack-card-inner">
            <div className="about-stack-card-shine" aria-hidden="true" />
            <div className="about-stack-card-left">
              <div className="about-stack-icon-pill">
                <Award width={20} height={20} className="about-cred-icon" />
              </div>
              <div className="about-stack-texts">
                <strong>Excelência Estética</strong>
                <p>Planejamento digital tridimensional personalizado para cada sorriso</p>
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
          onPointerUp={(e) => handlePointerUp(e, 3)}
          aria-label="Card 4: Atendimento Privativo. Puxe ou clique para alternar."
          onKeyDown={(e) => e.key === 'Enter' && sendCardToBack(3, 75)}
        >
          <div className="about-stack-card-inner">
            <div className="about-stack-card-shine" aria-hidden="true" />
            <div className="about-stack-card-left">
              <div className="about-stack-icon-pill">
                <HeartHandshake width={20} height={20} className="about-cred-icon" />
              </div>
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
