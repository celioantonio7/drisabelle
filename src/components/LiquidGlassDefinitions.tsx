/** Refraction is applied to decorative pseudo-elements, never to readable content. */
export default function LiquidGlassDefinitions() {
  return <svg className="liquid-glass-definitions" width="0" height="0" aria-hidden="true" focusable="false">
    <defs>
      <filter id="clinic-liquid-refraction" x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency=".008 .014" numOctaves="2" seed="7" result="glassNoise" />
        <feGaussianBlur in="glassNoise" stdDeviation="2" result="softNoise" />
        <feDisplacementMap in="SourceGraphic" in2="softNoise" scale="6" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>
}
