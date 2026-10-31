import { useState, useRef, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export default function BackToTopFloat() {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
  const [visible, setVisible] = useState(false)
  const isDraggingRef = useRef(false)
  const startPosRef = useRef({ x: 0, y: 0 })
  const startOffsetRef = useRef({ x: 0, y: 0 })
  const movedRef = useRef(false)

  useEffect(() => {
    const initX = 20
    const initY = window.innerHeight - 82
    setPosition({ x: initX, y: Math.max(20, initY) })

    const handleScroll = () => {
      setVisible(window.scrollY > 280)
    }

    const handleResize = () => {
      setPosition((prev) => {
        if (!prev) return null
        return {
          x: Math.min(prev.x, window.innerWidth - 70),
          y: Math.min(prev.y, window.innerHeight - 70),
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
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

      const nextX = Math.max(10, Math.min(window.innerWidth - 60, moveEv.clientX - startOffsetRef.current.x))
      const nextY = Math.max(10, Math.min(window.innerHeight - 60, moveEv.clientY - startOffsetRef.current.y))
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
      return
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!position || !visible) return null

  return (
    <aside
      onPointerDown={onPointerDown}
      className="float-draggable-wrap"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      aria-label="Voltar ao Topo (Arrastável)"
    >
      <button
        type="button"
        onClick={handleClick}
        className="btt-float-icon-only"
        aria-label="Rolar para o topo da página"
      >
        <ArrowUp width={24} height={24} strokeWidth={2.4} />
      </button>
    </aside>
  )
}
