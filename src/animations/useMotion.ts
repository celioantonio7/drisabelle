import type { RefObject } from 'react'
import { gsap, useGSAP } from './gsap'

export type MotionConditions = {
  /** usuário NÃO pediu movimento reduzido */
  motion: boolean
  /** viewport de desktop (layout de referência) */
  desktop: boolean
  /** dispositivo com mouse e hover */
  fine: boolean
}

/**
 * Wrapper sobre useGSAP + gsap.matchMedia.
 * - Limpa automaticamente tweens, ScrollTriggers e SplitTexts criados no callback.
 * - Reexecuta quando as condições (reduced-motion, breakpoint, hover) mudam.
 * - Evita ScrollTriggers duplicados em re-renders / React StrictMode.
 */
export function useMotion(
  scope: RefObject<HTMLElement | null>,
  setup: (c: MotionConditions, root: HTMLElement) => void | (() => void),
) {
  useGSAP(
    () => {
      const root = scope.current
      if (!root) return
      const mm = gsap.matchMedia()
      mm.add(
        {
          motion: '(prefers-reduced-motion: no-preference)',
          desktop: '(min-width: 961px)',
          fine: '(hover: hover) and (pointer: fine)',
        },
        (ctx) => {
          const c = ctx.conditions as Record<string, boolean>
          return setup({ motion: !!c.motion, desktop: !!c.desktop, fine: !!c.fine }, root)
        },
      )
      return () => mm.revert()
    },
    { scope },
  )
}
