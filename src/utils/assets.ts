/**
 * Retorna o caminho correto para assets públicos, respeitando a baseURL do Vite
 * (ex: '/drisabelle/' no GitHub Pages ou '/' em dev local).
 */
export function assetUrl(path: string): string {
  if (!path) return ''
  if (/^(?:https?:)?\/\//i.test(path) || path.startsWith('data:') || path.startsWith('blob:')) {
    return path
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  const base = import.meta.env.BASE_URL || '/'
  return base.endsWith('/') ? `${base}${cleanPath}` : `${base}/${cleanPath}`
}
