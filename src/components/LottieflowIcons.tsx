import type { SVGProps } from 'react'

/**
 * 1. Official crisp WhatsApp SVG from thesvg.org/icon/whatsapp
 * Full-color squircle/circle brand icon + monochrome glyph variant.
 */
export function TheSvgWhatsAppBrand({
  size = 60,
  className = '',
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`thesvg-whatsapp-brand ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="thesvg-wa-grad" x1="128" y1="0" x2="128" y2="256" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5BD066" />
          <stop offset="100%" stopColor="#20B038" />
        </linearGradient>
      </defs>
      <circle cx="128" cy="128" r="120" fill="url(#thesvg-wa-grad)" />
      <path
        fill="#FFFFFF"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M128.05 52C86.11 52 52.02 85.94 52 127.8C51.99 142.1 55.98 156.03 63.53 168.12L51.5 212L96.55 200.22C108.16 206.53 121.2 209.86 134.48 209.87H134.51C176.43 209.87 210.52 175.93 210.54 134.07C210.55 113.81 202.66 94.77 188.31 80.44C173.97 66.11 154.9 58.21 128.05 52ZM128.08 67.6C145.64 67.61 162.14 74.45 174.54 86.85C186.94 99.26 193.76 115.75 193.75 133.29C193.73 169.51 164.22 198.98 128.04 198.98H128.01C116.24 198.97 104.7 195.81 94.61 189.83L92.21 188.41L67.35 194.92L73.99 170.72L72.43 168.23C65.87 157.8 62.41 145.75 62.42 133.27C62.44 97.05 91.93 67.6 128.08 67.6ZM99.45 96.32C97.98 93.05 96.43 92.98 95.02 92.92C93.88 92.87 92.57 92.88 91.26 92.88C89.95 92.88 87.82 93.37 86.02 95.33C84.22 97.29 79.15 102.03 79.15 111.67C79.15 121.31 86.19 130.63 87.17 131.94C88.15 133.25 100.76 153.68 120.72 161.53C137.31 168.06 140.69 166.77 144.29 166.44C147.89 166.11 155.91 161.69 157.55 157.11C159.19 152.53 159.19 148.61 158.7 147.79C158.21 146.97 156.9 146.48 154.93 145.5C152.96 144.52 143.31 139.77 141.51 139.12C139.71 138.47 138.4 138.14 137.09 140.1C135.78 142.06 132.02 146.48 130.87 147.79C129.72 149.1 128.58 149.26 126.61 148.28C124.64 147.3 118.31 145.22 110.8 138.52C104.96 133.31 101.02 126.87 99.87 124.91C98.72 122.95 99.75 121.89 100.73 120.91C101.62 120.03 102.7 118.62 103.68 117.48C104.66 116.34 104.99 115.52 105.64 114.21C106.29 112.9 105.97 111.75 105.48 110.77C104.99 109.79 101.17 100.09 99.45 96.32Z"
      />
    </svg>
  )
}

export function TheSvgWhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 0 0 1.333 4.993L2 22l5.233-1.237a9.994 9.994 0 0 0 4.779 1.217h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.669-1.037-5.176-2.922-7.062A9.935 9.935 0 0 0 12.012 2Zm0 1.83c2.177 0 4.222.849 5.76 2.388a8.105 8.105 0 0 1 2.383 5.766c-.002 4.492-3.659 8.146-8.146 8.146a8.13 8.13 0 0 1-4.148-1.137l-.297-.177-3.088.729.825-3.012-.194-.309a8.117 8.117 0 0 1-1.246-4.342c.002-4.492 3.658-8.146 8.151-8.146Zm-3.515 4.46c-.182 0-.477.068-.727.341-.25.273-.955.932-.955 2.273s.977 2.637 1.114 2.819c.136.182 1.896 3.035 4.682 4.137 2.313.914 2.784.732 3.284.686.5-.045 1.614-.659 1.841-1.296.227-.636.227-1.182.159-1.295-.068-.114-.25-.182-.523-.319-.273-.136-1.614-.795-1.864-.886-.25-.091-.432-.137-.614.136-.182.273-.704.887-.863 1.069-.16.182-.319.204-.591.068-.273-.136-1.152-.425-2.194-1.353-.811-.723-1.358-1.617-1.517-1.89-.159-.273-.017-.42.119-.556.123-.122.273-.318.409-.477.137-.159.182-.273.273-.455.091-.182.045-.341-.023-.477-.068-.137-.602-1.464-.841-1.999-.218-.489-.441-.416-.614-.422-.158-.006-.34-.007-.522-.007Z" />
    </svg>
  )
}

/**
 * 2. Finsweet Lottieflow `menu-nav-11-11`
 * Animated 3-line staggered menu icon that morphs into a crisp X when open.
 */
export function LottieMenuNav11({ open }: { open: boolean }) {
  return (
    <svg
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lottie-menu-nav-11 ${open ? 'is-open' : ''}`}
      aria-hidden="true"
    >
      <line className="lf-menu11-line lf-menu11-top" x1="4" y1="6.5" x2="20" y2="6.5" />
      <line className="lf-menu11-line lf-menu11-mid" x1="7" y1="12" x2="20" y2="12" />
      <line className="lf-menu11-line lf-menu11-bot" x1="4" y1="17.5" x2="17" y2="17.5" />
    </svg>
  )
}

/**
 * 3. Finsweet Lottieflow `attention-8` Arrow
 * Sits completely still at rest; animates ONLY when hovering its parent card or button!
 */
export function AttentionArrow({
  size = 15,
  diagonal = false,
  className = '',
}: {
  size?: number
  diagonal?: boolean
  className?: string
}) {
  return (
    <span
      className={`lf-attention8-wrap ${diagonal ? 'is-diagonal' : ''} ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lf-attention8-svg lf-attention8-primary"
      >
        <path className="lf-attention8-shaft" d="M4 12h15" />
        <path className="lf-attention8-head" d="m13 6 6 6-6 6" />
      </svg>
    </span>
  )
}

/**
 * 4. Finsweet Lottieflow `social-media` Category Icons (Hover-triggered keyframe motion)
 */
export function SocialInstagramLottie({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.85}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lf-social-svg lf-social-ig"
      aria-hidden="true"
    >
      <rect className="lf-ig-frame" x="3" y="3" width="18" height="18" rx="5" />
      <circle className="lf-ig-lens" cx="12" cy="12" r="4" />
      <circle className="lf-ig-flash" cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function SocialWhatsAppLottie({ size = 16 }: { size?: number }) {
  return (
    <span className="lf-social-svg lf-social-wa" style={{ display: 'inline-flex' }}>
      <TheSvgWhatsAppIcon width={size} height={size} />
    </span>
  )
}

export function SocialLocationLottie({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.85}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lf-social-svg lf-social-pin"
      aria-hidden="true"
    >
      <path className="lf-pin-body" d="M20 10c0 5.5-8 12-8 12s-8-6.5-8-12a8 8 0 0 1 16 0Z" />
      <circle className="lf-pin-dot" cx="12" cy="10" r="2.8" />
    </svg>
  )
}

/**
 * 5. Finsweet Lottieflow `loading-09` (Lightweight Spinner — NOT the Preloader)
 */
export function Loading09({ size = 36, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      fill="none"
      className={`lf-loading-09 ${className}`}
      aria-label="Carregando"
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        stroke="currentColor"
        strokeOpacity="0.18"
        strokeWidth="4"
      />
      <circle
        className="lf-loading-09-arc"
        cx="25"
        cy="25"
        r="20"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  )
}
