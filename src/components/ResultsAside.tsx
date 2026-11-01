import CardHoverLight from './CardHoverLight'
import { CalendarDays, Gem, Heart, ShieldCheck } from 'lucide-react'
import { ToothIcon } from './Icons'
import { WHATSAPP_URL } from '../data'

export default function ResultsAside() {
  return <div className="results-feature-rail">
    <div className="results-excellence-card has-card-light">
        <CardHoverLight />
      <div className="results-excellence-mark">
        <ToothIcon width={25} height={25} />
        <span>RESULTADOS<br />COM EXCELÊNCIA</span>
      </div>
      <ul>
        <li><Gem size={22} /><span>Estética e naturalidade</span></li>
        <li><ShieldCheck size={22} /><span>Segurança e tecnologia</span></li>
        <li><Heart size={22} /><span>Confiança e bem-estar</span></li>
      </ul>
    </div>
    <div className="results-evaluation-card has-card-light">
        <CardHoverLight />
      <div><CalendarDays size={24} /><p>Pronto(a) para transformar o seu sorriso?</p></div>
      <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">Solicitar avaliação <span aria-hidden="true">→</span></a>
    </div>
  </div>
}
