import { useRef, useState } from 'react'
import { GraduationCap, Award, HeartHandshake } from 'lucide-react'
import { gsap, useGSAP } from '../animations/gsap'

export default function AboutStackedCards() {
  const containerRef = useRef<HTMLDivElement>(null)
  const deckRef = useRef<HTMLDivElement>(null)
  const isAnimatingRef = useRef(false)

  // Track the current display order of cards [0, 1, 2, 3]
  // card 0: Electric Blue, 1: Vibrant Purple, 2: Deep Turquoise, 3: Amber Orange
  const [, setActiveCardsOrder] = useState<number[]>([0, 1, 2, 3])

  useGSAP(
    () => {
      if (!deckRef.current || !containerRef.current) return

      const cards = gsap.utils.toArray<HTMLElement>('.about-stacked-card', deckRef.current)
      if (cards.length < 4) return

      const mm = gsap.matchMedia()

      // ==========================================
      // 1. DESKTOP ANIMATION (>= 769px) — TRAVA A PÁGINA ATÉ O ÚLTIMO STACK TER SUBIDO
      // ==========================================
      mm.add('(min-width: 769px)', () => {
        // Initial static state
        gsap.set(cards[0], { y: 0, scale: 1, opacity: 1, zIndex: 10 })
        gsap.set(cards[1], { yPercent: 125, y: 0, scale: 0.98, opacity: 0, zIndex: 20 })
        gsap.set(cards[2], { yPercent: 135, y: 0, scale: 0.98, opacity: 0, zIndex: 30 })
        gsap.set(cards[3], { yPercent: 145, y: 0, scale: 0.98, opacity: 0, zIndex: 40 })

        // Trava a página na seção #sobre durante a rolagem até o último card empilhar
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

      // ==========================================
      // 2. MOBILE ANIMATION (<= 768px)
      // ==========================================
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

      // ==========================================
      // 3. ACCESSIBILITY: REDUCED MOTION
      // ==========================================
      mm.add('(prefers-reduced-motion: reduce)', () => {
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
  // INTERATIVIDADE POR CLIQUE ("pode também trocar igual era antes")
  // =========================================================================
  const handleCardClick = (clickedIdx: number) => {
    if (isAnimatingRef.current || !deckRef.current) return
    const cardEl = deckRef.current.querySelector<HTMLElement>(`[data-index="${clickedIdx}"]`)
    if (!cardEl) return

    isAnimatingRef.current = true

    // Efeito suave de voar levemente para a direita e ir para trás da pilha
    const currentZ = parseInt(window.getComputedStyle(cardEl).zIndex || '10', 10)
    gsap.timeline({
      onComplete: () => {
        setActiveCardsOrder((prev) => {
          const rest = prev.filter((i) => i !== clickedIdx)
          return [...rest, clickedIdx]
        })
        isAnimatingRef.current = false
      },
    })
      .to(cardEl, {
        x: 65,
        rotation: 4,
        scale: 0.94,
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
        duration: 0.32,
        ease: 'power2.inOut',
      })
  }

  return (
    <div ref={containerRef} className="about-stack-scroll-wrapper">
      <div
        ref={deckRef}
        className="about-stack-scroll-deck is-interactive-deck"
        aria-label="Diferenciais e Credenciais — Clique para alternar os cards"
      >
        {/* CARD 01 — AZUL ELÉTRICO (#0036B8 → #0755E9 → #2585FF) */}
        <div
          className="about-stacked-card about-card-electric-blue"
          data-index="0"
          onClick={() => handleCardClick(0)}
          role="button"
          tabIndex={0}
          aria-label="Card 1: Ciência, Arte e Naturalidade. Clique para alternar."
          onKeyDown={(e) => e.key === 'Enter' && handleCardClick(0)}
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
          onClick={() => handleCardClick(1)}
          role="button"
          tabIndex={0}
          aria-label="Card 2: Dentística e Harmonização Facial. Clique para alternar."
          onKeyDown={(e) => e.key === 'Enter' && handleCardClick(1)}
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
          onClick={() => handleCardClick(2)}
          role="button"
          tabIndex={0}
          aria-label="Card 3: Excelência Estética. Clique para alternar."
          onKeyDown={(e) => e.key === 'Enter' && handleCardClick(2)}
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
          onClick={() => handleCardClick(3)}
          role="button"
          tabIndex={0}
          aria-label="Card 4: Atendimento Privativo. Clique para alternar."
          onKeyDown={(e) => e.key === 'Enter' && handleCardClick(3)}
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
