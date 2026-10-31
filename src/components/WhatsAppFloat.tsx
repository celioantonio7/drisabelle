import { useState, useRef, useEffect } from 'react'
import { WHATSAPP_URL } from '../data'
import { TheSvgWhatsAppBrand } from './LottieflowIcons'

export default function WhatsAppFloat() {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
  const isDraggingRef = useRef(false)
  const startPosRef = useRef({ x: 0, y: 0 })
  const startOffsetRef = useRef({ x: 0, y: 0 })
  const movedRef = useRef(false)
  const btnRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const isMobile = window.innerWidth < 640
    const initX = isMobile ? window.innerWidth - 76 : window.innerWidth - 88
    const initY = isMobile ? window.innerHeight - 82 : window.innerHeight - 92
    setPosition({ x: Math.max(16, initX), y: Math.max(16, initY) })

    const handleResize = () => {
      setPosition((prev) => {
        if (!prev) return null
        return {
          x: Math.min(prev.x, window.innerWidth - 76),
          y: Math.min(prev.y, window.innerHeight - 76),
        }
      })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const onPointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true
    movedRef.current = false
    startPosRef.current = { x: e.clientX, y: e.clientY }

    if (position) {
      startOffsetRef.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      }
    }

    const onPointerMove = (moveEv: PointerEvent) => {
      if (!isDraggingRef.current) return
      const dx = moveEv.clientX - startPosRef.current.x
      const dy = moveEv.clientY - startPosRef.current.y
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        movedRef.current = true
      }

      const nextX = Math.max(10, Math.min(window.innerWidth - 74, moveEv.clientX - startOffsetRef.current.x))
      const nextY = Math.max(10, Math.min(window.innerHeight - 74, moveEv.clientY - startOffsetRef.current.y))
      setPosition({ x: nextX, y: nextY })
    }

    const onPointerUp = () => {
      isDraggingRef.current = false
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }

  const handleClick = (e: React.MouseEvent) => {
    if (movedRef.current) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  if (!position) return null

  return (
    <aside
      ref={btnRef}
      onPointerDown={onPointerDown}
      className="float-draggable-wrap"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      aria-label="Atendimento via WhatsApp (Arrastável)"
    >
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="wa-float-icon-only"
        aria-label="Fale com a Dra. Isabella pelo WhatsApp"
        draggable={false}
      >
        <TheSvgWhatsAppBrand size={62} className="wa-float-webp-img" />
      </a>
    </aside>
  )
}
