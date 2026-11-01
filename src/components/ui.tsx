import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { ToothIcon } from './Icons'
import { assetUrl } from '../utils/assets'

/** Botão principal / outline com Arrow Slide, Background Slide e Magnetic Hover */
export function Button ({
  href,
  children,
  variant = 'primary',
  className = '',
  external,
  magnetic = true,
    ... rest
}: {
  href: string
  children: ReactNode
  variant?: 'primary' | 'outline'
  className?: string
  external?: boolean
  magnetic?: boolean
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'>) {
  return (
    <a
      href={href}
      className={`btn btn--${variant} ${className}`}
      {...(magnetic ? { 'data-magnetic': '' } : {})}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      <span className="btn__label" data-mag-inner>
        {children}
      </span>
      <span className="btn__arrow" data-mag-inner>
        <ArrowRight strokeWidth={1.8} aria-hidden />
      </span>
    </a>
  )
}

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`eyebrow ${className}`}>
      <i aria-hidden />
      <span>{children}</span>
    </p>
  )
}

/** Assinatura manuscrita + CRO (aparece sobre a fotografia, como nas referências) */
export function Signature({ className = '' }: { className?: string }) {
  return (
    <div className={`signature ${className}`} data-deco>
      <span className="signature__script">Dra. Isabella Ferro</span>
      <span className="signature__cro">
        <i aria-hidden />
        CRO 140267
      </span>
    </div>
  )
}

/** Selo circular "Odontologia Estética • Resultados Reais" */
export function Badge({ id, className = '' }: { id: string; className?: string }) {
  return (
    <div className={`badge ${className}`} data-deco role="img" aria-label="Odontologia estética, resultados reais">
      <svg viewBox="0 0 130 130" aria-hidden>
        <defs>
          <path id={`${id}-top`} d="M 17 65 A 48 48 0 0 1 113 65" />
          <path id={`${id}-bot`} d="M 10.500 65 A 54.500 54.500 0 0 0 119.500 65" />
        </defs>
        <text className="badge__text">
          <textPath href={`#${id}-top`} startOffset="50%" textAnchor="middle">
            ODONTOLOGIA ESTÉTICA
          </textPath>
        </text>
        <text className="badge__text">
          <textPath href={`#${id}-bot`} startOffset="50%" textAnchor="middle">
            RESULTADOS REAIS
          </textPath>
        </text>
        <circle cx="13" cy="65" r="1.600" className="badge__dot" />
        <circle cx="117" cy="65" r="1.600" className="badge__dot" />
      </svg>
      <ToothIcon className="badge__tooth" />
    </div>
  )
}

/** Arcos finos decorativos (canto direito de Hero e FAQ) */
export function Arcs() {
  return null
}

/** Fotografia da Dra. + assinatura + selo, compartilhados entre Hero e FAQ */
export function PersonScene({
  id,
  className = '',
  children,
}: {
  id: string
  className?: string
  children?: ReactNode
}) {
  return (
    <div className={`scene ${className}`}>
      <div className="scene__photo" data-img-reveal="organic">
        <img
          src={assetUrl('/img/hero.webp')}
          width={1200}
          height={896}
          alt="Dra. Isabella Ferro sorrindo, em sua clínica de odontologia estética"
          decoding="async"
          {...(id === 'hero' ? { fetchPriority: 'high' as const } : { loading: 'lazy' as const })}
        />
      </div>
      <Arcs />
      <Signature />
      <Badge id={`badge-${id}`} />
      {children}
    </div>
  )
}
