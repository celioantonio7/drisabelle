import './LiquidGlass.css'
import LiquidGlassDefinitions from './components/LiquidGlassDefinitions'
import './GlassSurfaces.css'
import { useDoctorPortraitMotion } from './animations/useDoctorPortraitMotion'
import { useCallback, useEffect, useState } from 'react'
import SignaturePreloader from './components/SignaturePreloader'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import SerpentineTextScroll from './components/SerpentineTextScroll'
import About from './components/About'
import Specialties from './components/Specialties'
import Experience from './components/Experience'
import FAQSection from './components/FAQ'
import Results from './components/Results'
import Footer from './components/Footer'
import VideoModal from './components/VideoModal'
import WhatsAppFloat from './components/WhatsAppFloat'
import BackToTopFloat from './components/BackToTopFloat'
import SectionIndexStrip from './components/SectionIndexStrip'
import NotFound404 from './components/NotFound404'
import { useAwwwardsScrollSystem } from './animations/useAwwwardsScrollSystem'

function checkIsNotFound(): boolean {
  if (typeof window === 'undefined') return false
  const path = window.location.pathname.replace(/\/+$/, '')
  const hash = window.location.hash
  const search = window.location.search
  if (hash === '#404' || search.includes('404')) return true

  const validPaths = [
    '',
    '/',
    '/index.html',
    '/drisabelle',
    '/drisabelle/',
    '/drisabelle/index.html',
  ]
  return !validPaths.includes(path) && !validPaths.includes(window.location.pathname)
}

export default function App() {
  useDoctorPortraitMotion()
  const [videoOpen, setVideoOpen] = useState(false)
  const [isNotFound, setIsNotFound] = useState<boolean>(() => checkIsNotFound())
  const [isReady, setIsReady] = useState(false)
  const handlePreloaderComplete = useCallback(() => setIsReady(true), [])

  // Ativa o sistema premium de animações GSAP + ScrollTrigger após o preloader
  useAwwwardsScrollSystem(isReady)

  useEffect(() => {
    const syncRoute = () => setIsNotFound(checkIsNotFound())
    window.addEventListener('popstate', syncRoute)
    window.addEventListener('hashchange', syncRoute)
    return () => {
      window.removeEventListener('popstate', syncRoute)
      window.removeEventListener('hashchange', syncRoute)
    }
  }, [])

  if (isNotFound) {
    return <NotFound404 onGoHome={() => setIsNotFound(false)} />
  }

  return (
    <div className={`site-wrapper ${isReady ? 'is-page-ready' : 'is-page-preloading'}`}>
      {/* Preloader de Assinatura Caligráfica — Página só abre após 100% concluído */}
      <SignaturePreloader onComplete={handlePreloaderComplete} />

      <LiquidGlassDefinitions />

      {/* Barra de Navegação */}
      <Navbar />

      {/* Indicador Fixo de Seções 01..06 que aparece na rolagem */}
      <SectionIndexStrip />

      {/* Conteúdo Principal — Ordem exata do menu e das referências 01..07 */}
      <main id="main-content">
        {/* Hero and About share an overlapping SVG boundary in the native scroll flow. */}
        <div className="hero-transition-composition">
          <div className="hero-transition-opening">
            <Hero onOpenVideo={() => setVideoOpen(true)} />
            <SerpentineTextScroll />
          </div>
          <div className="about-sticky-track">
            <About />
          </div>
        </div>

        {/* 03: Especialidades (Lentes em Resina, Porcelana e Harmonização) */}
        <Specialties />

        {/* 04: Experiência além do procedimento */}
        <Experience onOpenVideo={() => setVideoOpen(true)} />

        {/* 05: Perguntas Frequentes (FAQ) */}
        <FAQSection />

        {/* 06: Resultados e Casos Clínicos (Spiral 3D + Colmeia + Lando Norris) */}
        <Results />

        {/* 07: Rodapé e Contato (Expansível com botão MAIS ^) */}
        <Footer />
      </main>

      {/* Modal Interativo de Vídeo / Espaço */}
      <VideoModal isOpen={videoOpen} onClose={() => setVideoOpen(false)} />

      {/* Botões Flutuantes Arrastáveis */}
      <WhatsAppFloat />
      <BackToTopFloat />
    </div>
  )
}
