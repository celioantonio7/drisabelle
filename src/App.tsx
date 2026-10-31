import { useEffect, useState } from 'react'
import SignaturePreloader from './components/SignaturePreloader'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
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

function checkIsNotFound(): boolean {
  if (typeof window === 'undefined') return false
  const path = window.location.pathname
  const hash = window.location.hash
  const search = window.location.search
  if (hash === '#404' || search.includes('404')) return true
  return path !== '/' && path !== '/index.html'
}

export default function App() {
  const [videoOpen, setVideoOpen] = useState(false)
  const [isNotFound, setIsNotFound] = useState<boolean>(() => checkIsNotFound())

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
    <div className="site-wrapper">
      {/* Preloader de Assinatura Caligráfica */}
      <SignaturePreloader />

      {/* Barra de Navegação */}
      <Navbar />

      {/* Indicador Fixo de Seções 01..06 que aparece na rolagem */}
      <SectionIndexStrip />

      {/* Conteúdo Principal — Ordem exata do menu e das referências 01..07 */}
      <main id="main-content">
        {/* 01: Hero Section */}
        <Hero onOpenVideo={() => setVideoOpen(true)} />

        {/* 02: Sobre a Dra. Isabella Ferro */}
        <About />

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
