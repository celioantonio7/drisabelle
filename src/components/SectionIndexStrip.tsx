import { useEffect, useState } from 'react'

const SECTIONS = [
  { num: '01', id: 'inicio', label: 'Início' },
  { num: '02', id: 'sobre', label: 'Sobre' },
  { num: '03', id: 'especialidades', label: 'Especialidades' },
  { num: '04', id: 'experiencia', label: 'Experiência' },
  { num: '05', id: 'faq', label: 'FAQ' },
  { num: '06', id: 'resultados', label: 'Resultados' },
]

export default function SectionIndexStrip() {
  const [visible, setVisible] = useState(false)
  const [activeId, setActiveId] = useState('inicio')

  useEffect(() => {
    let scrollTimer: number | null = null

    const handleScroll = () => {
      const y = window.scrollY

      // Only show while actively scrolling (and hide at top <= 70)
      if (y > 70) {
        setVisible(true)
        if (scrollTimer) window.clearTimeout(scrollTimer)
        // Auto-hide when user stops scrolling (fade out like menu)
        scrollTimer = window.setTimeout(() => {
          setVisible(false)
        }, 1100)
      } else {
        setVisible(false)
        if (scrollTimer) window.clearTimeout(scrollTimer)
      }

      // Determine which section is currently in the middle of the viewport
      const viewportMid = y + window.innerHeight * 0.42
      let current = 'inicio'
      for (const sec of SECTIONS) {
        if (sec.id === 'inicio') continue
        const el = document.getElementById(sec.id)
        if (el) {
          const top = el.getBoundingClientRect().top + y
          if (viewportMid >= top) {
            current = sec.id
          }
        }
      }
      setActiveId(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimer) window.clearTimeout(scrollTimer)
    }
  }, [])

  return (
    <aside
      className={`section-index-strip ${visible ? 'is-visible' : ''}`}
      aria-label="Indicador de seções"
    >
      {SECTIONS.map((sec) => {
        const isActive = activeId === sec.id
        return (
          <a
            key={sec.id}
            href={`#${sec.id}`}
            className={`section-index-item ${isActive ? 'is-active' : ''}`}
            title={sec.label}
          >
            <span className="section-index-num">{sec.num}</span>
          </a>
        )
      })}
    </aside>
  )
}

