import { ArrowUpRight, MapPin } from 'lucide-react'
import { ADDRESS_TEXT, MAPS_EMBED_URL, MAPS_URL } from '../data'
import './FooterLocationMap.css'

export default function FooterLocationMap() {
  return <figure className="footer-location" aria-label="Localização da clínica">
    <div className="footer-location-shell">
      <div className="footer-location-viewport">
        <iframe
          src={`${MAPS_EMBED_URL}&hl=pt-BR`}
          title="Google Maps: clínica Dra. Isabella Ferro, Av. Itália, 928, Taubaté"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
    <figcaption className="footer-location-caption">
      <MapPin size={22} aria-hidden="true" />
      <div>
        <strong>Dra. Isabella Ferro</strong>
        <address>{ADDRESS_TEXT}</address>
      </div>
      <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" aria-label="Abrir endereço da clínica no Google Maps">
        <ArrowUpRight size={20} aria-hidden="true" />
      </a>
    </figcaption>
  </figure>
}
