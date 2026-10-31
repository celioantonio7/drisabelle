import type { SVGProps } from 'react'

/**
 * Ícones de traço (line-art) da identidade visual. Todos usam `currentColor`
 * e possuem dimensões explícitas (width/height = 20 por padrão) para nunca
 * expandirem caso uma classe utilitária não exista.
 */
type P = SVGProps<SVGSVGElement>

const base = (p: P): P => ({
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
  ...p,
})

export const ToothIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M8 3.5c-2.4 0-4 1.7-4 4.2 0 1.7.7 2.9 1.2 4.5.6 1.9.6 4.4 1.4 6.6.3.8 1.4.8 1.7 0 .6-1.6.8-3.7 1.7-3.7s1.1 2.1 1.7 3.7c.3.8 1.4.8 1.7 0 .8-2.2.8-4.7 1.4-6.6.5-1.6 1.2-2.8 1.2-4.5 0-2.5-1.6-4.2-4-4.2-1.5 0-2 .8-3 .8s-1.5-.8-3-.8z" />
  </svg>
)

export const DiamondIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M6.5 4h11l4 5.5L12 20.5 2.5 9.5z" />
    <path d="M2.5 9.5h19M9.5 4 8 9.5l4 11 4-11L14.5 4" />
  </svg>
)

export const ShieldIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3 5 5.8v5.4c0 4.3 3 7.8 7 9.8 4-2 7-5.5 7-9.8V5.8z" />
    <path d="m9 12 2.2 2.2L15.5 10" />
  </svg>
)

export const UsersIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="9" cy="8.5" r="3" />
    <path d="M3.5 19c0-3 2.4-5 5.5-5s5.5 2 5.5 5" />
    <circle cx="17" cy="9.5" r="2.3" />
    <path d="M16 14.2c2.8-.3 4.8 1.3 4.8 4" />
  </svg>
)

export const SmileIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M4.5 10c1.8 5.2 13.2 5.2 15 0" />
  </svg>
)

export const HeartIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 20s-7.5-4.7-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.3 12 20 12 20z" />
  </svg>
)

export const FaceIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M10 3c-3.6.8-5.3 4-5 7.3.1 1.2.6 1.9 1 2.7.4.8-.1 1.5-.9 1.9l.4 1.1c.2.6.9.7 1.5.7H9v3.5h7.5V16c2.2-1.2 3.4-3.2 3.4-5.7C19.9 6 16.5 2.5 10 3z" />
    <path d="M13.5 8.8c.9.6 1.5 1.8 1.3 3" />
  </svg>
)

export const BarsIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="4" y="13" width="4" height="7" rx="1" />
    <rect x="10" y="9" width="4" height="11" rx="1" />
    <rect x="16" y="4" width="4" height="16" rx="1" />
  </svg>
)

export const WhatsAppIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false" {...p}>
    <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 0 0 1.333 4.993L2 22l5.233-1.237a9.994 9.994 0 0 0 4.779 1.217h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.669-1.037-5.176-2.922-7.062A9.935 9.935 0 0 0 12.012 2Zm0 1.83c2.177 0 4.222.849 5.76 2.388a8.105 8.105 0 0 1 2.383 5.766c-.002 4.492-3.659 8.146-8.146 8.146a8.13 8.13 0 0 1-4.148-1.137l-.297-.177-3.088.729.825-3.012-.194-.309a8.117 8.117 0 0 1-1.246-4.342c.002-4.492 3.658-8.146 8.151-8.146Zm-3.515 4.46c-.182 0-.477.068-.727.341-.25.273-.955.932-.955 2.273s.977 2.637 1.114 2.819c.136.182 1.896 3.035 4.682 4.137 2.313.914 2.784.732 3.284.686.5-.045 1.614-.659 1.841-1.296.227-.636.227-1.182.159-1.295-.068-.114-.25-.182-.523-.319-.273-.136-1.614-.795-1.864-.886-.25-.091-.432-.137-.614.136-.182.273-.704.887-.863 1.069-.16.182-.319.204-.591.068-.273-.136-1.152-.425-2.194-1.353-.811-.723-1.358-1.617-1.517-1.89-.159-.273-.017-.42.119-.556.123-.122.273-.318.409-.477.137-.159.182-.273.273-.455.091-.182.045-.341-.023-.477-.068-.137-.602-1.464-.841-1.999-.218-.489-.441-.416-.614-.422-.158-.006-.34-.007-.522-.007Z" />
  </svg>
)

export const InstagramIcon = (p: P) => (
  <svg {...base({ strokeWidth: 1.8, ...p })}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" />
  </svg>
)
