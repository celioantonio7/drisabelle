import { useEffect, useState } from 'react'
import { X, Play } from 'lucide-react'
import { WHATSAPP_URL } from '../data'
import { Loading09, AttentionArrow } from './LottieflowIcons'

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function VideoModal({ isOpen, onClose }: VideoModalProps) {
  const [imgLoaded, setImgLoaded] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setImgLoaded(false)
      return
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="video-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="video-modal-container" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="video-modal-close"
          onClick={onClose}
          aria-label="Fechar vídeo"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="video-modal-body">
          <div className="video-modal-media">
            {!imgLoaded && (
              <div className="video-modal-loader">
                <Loading09 size={40} />
              </div>
            )}
            <img
              src="/img/bg-clinica.jpg"
              alt="Clínica Dra. Isabella Ferro"
              className="video-modal-poster"
              onLoad={() => setImgLoaded(true)}
            />
            <div className="video-modal-overlay">
              <div className="video-modal-play-badge">
                <Play className="w-8 h-8 fill-blue-600 text-blue-600 ml-1" />
              </div>
              <h3 className="video-modal-title">Nosso Espaço e Filosofia</h3>
              <p className="video-modal-desc">
                Um ambiente pensado nos mínimos detalhes para acolher você com conforto,
                privacidade e biossegurança de padrão internacional.
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-btn-primary mt-4"
              >
                <span>Agendar uma visita presencial</span>
                <AttentionArrow size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
