import './CardHoverLight.css'

/** A soft caustic passes behind card content; it never owns pointer events. */
export default function CardHoverLight() {
  return <span className="card-hover-light" aria-hidden="true" />
}
