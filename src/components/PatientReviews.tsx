import DepthCarousel from './DepthCarousel'
import { assetUrl } from '../utils/assets'
import './PatientReviews.css'

// Excerpts transcribed from the Google review screenshots supplied by the user.
const REVIEWS = [
  { name: 'Vitória Teixeira Guimarães', initials: 'VT', text: 'Foi uma experiência fantástica e eu gostaria de contar isso aos quatro cantos desse mundo!' },
  { name: 'Roberta Dias', initials: 'RD', text: 'Olha eu não tenho nada de ruim a relatar, apenas elogios desde o primeiro contato com vocês através do orçamento' },
  { name: 'Fabio Guardiano', initials: 'FG', text: 'sempre fui muito bem atendido por toda equipe, cheio de simpatia e de um profissionalismo impecável.' },
]
const ITEMS = REVIEWS.map(review => ({ image: '', alt: review.name }))

export default function PatientReviews() {
  return (
    <aside className="patient-reviews" aria-label="Avaliações de pacientes">
      <p className="patient-reviews-label">QUEM CONFIA, CONTA</p>
      <DepthCarousel items={ITEMS} cardWidth={245} cardHeight={350} depth={100}
        spread={12} tilt={6} visibleCards={3} falloff={.08} blur={0}
        duration={850} autoplay={false} showIndicators={false} className="patient-reviews-carousel"
        renderItem={index => {
          const review = REVIEWS[index]
          return <article className="patient-review">
            <div className="patient-review-cover" aria-hidden="true">
              <img src={assetUrl('/img/clinica.webp')} alt="" loading="lazy" />
              <span className="patient-review-cover-label">CUIDADO EM CADA DETALHE</span>
              <span className="patient-review-avatar">{review.initials}</span>
            </div>
            <div className="patient-review-content">
              <h3>{review.name}</h3>
              <span className="patient-review-stars" aria-label="5 de 5 estrelas">★★★★★</span>
              <blockquote>“{review.text}”</blockquote>
              <span className="patient-review-source">Trecho de avaliação no Google</span>
            </div>
          </article>
        }} />
    </aside>
  )
}
