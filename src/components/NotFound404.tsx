import { ArrowLeft } from 'lucide-react'
import FuzzyText from './FuzzyText'
import ColorBends from './ColorBends'

interface NotFound404Props {
  onGoHome?: () => void
}

export default function NotFound404({ onGoHome }: NotFound404Props) {
  const handleBackHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    if (onGoHome) {
      onGoHome()
    }
  }

  return (
    <main className="notfound-404-stage" aria-label="Página 404 - Não Encontrada">
      {/* Full-Page ColorBends Shader Background */}
      <ColorBends
        colors={['#0056d6', '#3d8bff', '#7aa7ff', '#38bdf8']}
        rotation={90}
        speed={0.2}
        scale={1}
        frequency={1}
        warpStrength={1}
        mouseInfluence={1}
        noise={0.15}
        parallax={0.5}
        iterations={1}
        intensity={1.5}
        bandWidth={6}
        transparent
        className="notfound-404-colorbends"
      />

      {/* Free-Floating Content (Zero Modal / Box) */}
      <div className="notfound-404-free-content">
        <span className="notfound-404-eyebrow">DRA. ISABELLA FERRO &bull; ODONTOLOGIA ESTÉTICA</span>

        <div className="notfound-404-fuzzy-wrap">
          <FuzzyText
            fontSize="clamp(9.5rem, 27vw, 21rem)"
            fontWeight={800}
            fontFamily="'Playfair Display Variable', serif"
            color="#0056d6"
            colorSplit={0}
            trigger="hover"
            direction="horizontal"
            baseIntensity={0.2}
            hoverIntensity={0.5}
            fuzzRange={30}
            sliceSize={1}
            fps={60}
            transitionDuration={0}
            intro={true}
            introDuration={1400}
            letterSpacing={0}
            enableHover={true}
            clickEffect={false}
            glitchMode={false}
            glitchInterval={2000}
            glitchDuration={200}
          >
            404
          </FuzzyText>
        </div>

        <h1 className="notfound-404-title">Página não encontrada.</h1>
        <p className="notfound-404-desc">
          O endereço que você procura pode ter sido movido ou não existe mais.
          Retorne à página principal para conhecer nossos tratamentos exclusivos.
        </p>

        <a
          href="/"
          onClick={handleBackHome}
          className="notfound-404-home-btn"
        >
          <span className="notfound-404-btn-icon">
            <ArrowLeft width={18} height={18} />
          </span>
          <span className="notfound-404-btn-label">Voltar ao Início</span>
        </a>
      </div>
    </main>
  )
}
