import { useRef, useState, useEffect } from 'react'
import { GraduationCap, Award, HeartHandshake } from 'lucide-react'
import { gsap, useGSAP, ScrollTrigger } from '../animations/gsap'

type DeckPointerEvent = PointerEvent & { currentTarget: HTMLDivElement }

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

  const revealTimelineRef = useRef<ReturnType<typeof gsap.timeline> | null>(null)

  const { contextSafe } = useGSAP(() => {
    const deck = deckRef.current
    const container = containerRef.current
    if (!deck || !container) return
    const cards = Array.from(deck.querySelectorAll<HTMLElement>('.about-stacked-card'))
    const mm = gsap.matchMedia()
    mm.add({ all: '(min-width: 0px)', mobile: '(max-width: 768px)', reduced: '(prefers-reduced-motion: reduce)' }, ctx => {
      const mobile = !!ctx.conditions?.mobile
      const reduced = !!ctx.conditions?.reduced
      const step = mobile ? 24 : 32
      const firstY = mobile ? -16 : -24
      const scaleStep = mobile ? .03 : .04
      const arrange = () => deckOrderRef.current.forEach((index, slot) => {
        gsap.set(cards[index], { x: 0, rotation: 0, yPercent: 0,
          y: firstY + slot * step, scale: 1 - (3 - slot) * scaleStep,
          autoAlpha: 1, zIndex: (slot + 1) * 10 })
      })
      const resize = () => {
        const height = Math.max(...cards.map(card => card.offsetHeight)) + firstY + step * 3 + 16
        gsap.set(deck, { height })
        gsap.set(container, { '--about-deck-height': `${height}px` })
      }
      const stage = container.closest<HTMLElement>('#sobre')
      const track = container.closest<HTMLElement>('.about-sticky-track')
      const sizeTrack = () => {
        if (stage && track) track.style.setProperty('--about-stage-height', `${stage.offsetHeight}px`)
      }
      resize()
      sizeTrack()
      const stageObserver = new ResizeObserver(sizeTrack)
      if (stage) stageObserver.observe(stage)
      const observer = new ResizeObserver(resize)
      cards.forEach(card => observer.observe(card))
      if (hasCompletedRef.current || reduced) {
        hasCompletedRef.current = true
        arrange()
        return () => { observer.disconnect(); stageObserver.disconnect() }
      }
      gsap.set(cards, { yPercent: 0, x: 0, rotation: 0 })
      cards.forEach((card, index) => gsap.set(card, {
        y: index === 0 ? 0 : 80, scale: 1, autoAlpha: index === 0 ? 1 : 0,
        zIndex: (index + 1) * 10,
      }))
      cards.forEach((card, index) => gsap.set(card.querySelector('.about-stack-card-inner'), { opacity: index === 0 ? 1 : 0 }))
      const timeline = gsap.timeline({ paused: true })
      revealTimelineRef.current = timeline
      for (let next = 1; next < cards.length; next++) {
        const at = .35 + (next - 1) * 1.65
        timeline.to(cards[next - 1].querySelector('.about-stack-card-inner'), { opacity: 0, duration: .55 }, at)
        timeline.to(cards[next].querySelector('.about-stack-card-inner'), { opacity: 1, duration: .7 }, at + .35)
        for (let index = 0; index < next; index++) {
          timeline.to(cards[index], {
            scale: 1 - (next - index) * scaleStep,
            y: firstY * next / 3 + index * step, duration: 1.25, ease: 'power2.inOut',
          }, at)
        }
        timeline.to(cards[next], { y: firstY * next / 3 + next * step,
          autoAlpha: 1, duration: 1.25, ease: 'power2.inOut' }, at)
      }
      timeline.to({}, { duration: .45 })
      let furthest = 0
      const smoothProgress = gsap.quickTo(timeline, 'progress', {
        duration: .85, ease: 'power2.out',
        onComplete: () => { if (furthest === 1) hasCompletedRef.current = true },
      })
      ScrollTrigger.create({
        id: 'about-stack-reveal', trigger: container,
        start: () => {
          const track = container.closest<HTMLElement>('.about-sticky-track') ?? container
          return track.getBoundingClientRect().top + window.scrollY - 80
        },
        end: () => `+=${window.innerHeight * .6}`, invalidateOnRefresh: true,
        onUpdate: self => {
          if (hasCompletedRef.current || self.direction < 0 || self.progress <= furthest) return
          furthest = self.progress
          smoothProgress(furthest)
        },
      })
      return () => { observer.disconnect(); stageObserver.disconnect(); gsap.killTweensOf(timeline); revealTimelineRef.current = null }
    })
    return () => mm.revert()
  }, { scope: containerRef })

  const finishReveal = () => {
    const timeline = revealTimelineRef.current
    if (timeline && !hasCompletedRef.current) {
      gsap.killTweensOf(timeline)
      timeline.progress(1).pause()
    }
    hasCompletedRef.current = true
  }

  // =========================================================================
  // INTERAÇÃO DE PUXAR / CLICAR ("pode também puxar/trocar igual era antes")
  // Cicla a carta do topo para trás, avançando todas as outras
  // =========================================================================
  const cycleCardToBack = contextSafe((directionX = 85) => {
    finishReveal()
    if (isAnimatingRef.current || !deckRef.current) return
    const order = [...deckOrderRef.current]
    if (order.length < 4) return

    // Front card is the last element in deckOrder
    const frontCardIndex = order[order.length - 1]
    const frontCardEl = deckRef.current.querySelector<HTMLElement>(`[data-index="${frontCardIndex}"]`)
    if (!frontCardEl) return

    isAnimatingRef.current = true
    order.forEach((index, slot) => {
      gsap.to(deckRef.current!.querySelector(`[data-index="${index}"] .about-stack-card-inner`), { opacity: slot === 2 ? 1 : 0, duration: .25 })
    })

    // New order: front card moves to the back (index 0)
    const newOrder = [frontCardIndex, order[0], order[1], order[2]]

    const motionDuration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1
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
          duration: 0.38 * motionDuration,
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
        duration: 0.20 * motionDuration,
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
        duration: 0.26 * motionDuration,
        ease: 'power2.inOut',
      })
  })

  // Pointer event listeners to support physical dragging / pulling on cards
  const handlePointerDown = (e: DeckPointerEvent) => {
    if (isAnimatingRef.current) return
    finishReveal()
    dragStartRef.current = { x: e.clientX, y: e.clientY }
    const frontIndex = deckOrderRef.current[3]
    currentDragCardRef.current = deckRef.current?.querySelector<HTMLElement>(`[data-index="${frontIndex}"]`) ?? e.currentTarget
    if (e.pointerType === 'mouse') {
      try {
        e.currentTarget.setPointerCapture(e.pointerId)
      } catch {
        // ignore
      }
    }
  }

  const handlePointerMove = contextSafe((e: DeckPointerEvent) => {
    const start = dragStartRef.current
    const card = currentDragCardRef.current
    if (!start || !card) return
    const dx = e.clientX - start.x
    const dy = e.clientY - start.y
    if (Math.abs(dx) <= Math.abs(dy)) return
    gsap.set(card, { x: Math.max(-100, Math.min(100, dx)), rotation: dx * .035 })
  })

  const handlePointerCancel = contextSafe(() => {
    if (currentDragCardRef.current) gsap.to(currentDragCardRef.current, { x: 0, rotation: 0, duration: .2 })
    dragStartRef.current = null
    currentDragCardRef.current = null
  })

  const handlePointerUp = contextSafe((e: DeckPointerEvent) => {
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
      gsap.to(e.currentTarget, { x: 0, rotation: 0, duration: .2 })
      return
    }

    // Se puxou mais de 25px horizontalmente
    if (absX > 25) {
      cycleCardToBack(deltaX >= 0 ? 85 : -85)
    } else if (absX < 10 && absY < 10) {
      // Clique ou toque simples deliberado: cicla a carta para trás
      cycleCardToBack(80)
    } else {
      gsap.to(e.currentTarget, { x: 0, rotation: 0, duration: .2 })
    }
  })

  // Keep pointer ownership on each card, independent of scroll animation updates.
  useEffect(() => {
    const cards = Array.from(deckRef.current?.querySelectorAll<HTMLDivElement>('.about-stacked-card') ?? [])
    const down = (event: PointerEvent) => handlePointerDown(event as DeckPointerEvent)
    const move = (event: PointerEvent) => handlePointerMove(event as DeckPointerEvent)
    const up = (event: PointerEvent) => handlePointerUp(event as DeckPointerEvent)
    const cancel = () => handlePointerCancel()
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); cycleCardToBack(80) }
    }
    cards.forEach(card => {
      card.addEventListener('pointerdown', down)
      card.addEventListener('pointermove', move)
      card.addEventListener('pointerup', up)
      card.addEventListener('pointercancel', cancel)
      card.addEventListener('keydown', key)
    })
    return () => cards.forEach(card => {
      card.removeEventListener('pointerdown', down)
      card.removeEventListener('pointermove', move)
      card.removeEventListener('pointerup', up)
      card.removeEventListener('pointercancel', cancel)
      card.removeEventListener('keydown', key)
    })
  })

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
          aria-label="Card 1: Ciência, Arte e Naturalidade. Puxe ou clique para alternar."
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
          aria-label="Card 2: Dentística e Harmonização Facial. Puxe ou clique para alternar."
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
          aria-label="Card 3: Excelência Estética. Puxe ou clique para alternar."
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
          aria-label="Card 4: Atendimento Privativo. Puxe ou clique para alternar."
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
