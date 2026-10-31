import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/**
 * PostCSS plugin "du" (design unit).
 * `12du` => `calc(12 * var(--u))`, onde --u = largura da viewport / 1024.
 * Permite escrever o CSS desktop direto nas medidas (px) das telas de referência
 * (1024 × 768) e escalar fluidamente para 1440 × 900 e além.
 */
const designUnit = () => ({
  postcssPlugin: 'postcss-design-unit',
  Declaration(decl: { value: string }) {
    if (/\ddu\b/.test(decl.value)) {
      decl.value = decl.value.replace(/(-?\d*\.?\d+)du\b/g, 'calc($1 * var(--u))')
    }
  },
})
designUnit.postcss = true

export default defineConfig({
  base: process.env.BASE_PATH || (process.env.NODE_ENV === 'production' ? '/drisabelle/' : '/'),
  plugins: [react()],
  css: { postcss: { plugins: [designUnit()] } },
})
