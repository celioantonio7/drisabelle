import type { createBackgroundRenderer } from './BackgroundRenderer'

export type BackgroundVariant = 'soft-aurora' | 'silk' | 'mesh-gradient' | 'static' | 'color-bends'
type Entry = { host: HTMLElement; section: HTMLElement; variant: BackgroundVariant; shader: boolean; motion: boolean; visible: boolean }
type Renderer = ReturnType<typeof createBackgroundRenderer>
const entries = new Set<Entry>()
let renderer: Renderer | null = null
let loading = false
let downgraded = false

function downgrade() {
  downgraded = true
  renderer?.dispose()
  renderer = null
  entries.forEach(entry => {
    entry.host.dataset.motion = 'off'
    entry.host.dataset.renderer = 'static'
  })
}
function selectActive() {
  if (document.hidden || downgraded) { renderer?.detach(); return }
  let selected: Entry | undefined
  let best = 0
  entries.forEach(entry => {
    if (!entry.visible) return
    const bounds = entry.section.getBoundingClientRect()
    const visible = Math.max(0, Math.min(innerHeight, bounds.bottom) - Math.max(0, bounds.top))
    if (visible > best) { best = visible; selected = entry }
  })
  if (!selected?.shader || !['silk', 'soft-aurora', 'color-bends'].includes(selected.variant)) {
    renderer?.detach()
    return
  }
  if (renderer) { renderer.attach(selected.host, selected.variant as 'silk' | 'soft-aurora' | 'color-bends'); return }
  if (loading) return
  loading = true
  import('./BackgroundRenderer').then(module => {
    loading = false
    if (!entries.size || downgraded) return
    try { renderer = module.createBackgroundRenderer(downgrade); selectActive() } catch { downgrade() }
  }).catch(() => { loading = false; downgrade() })
}

export function registerBackground(host: HTMLElement, variant: BackgroundVariant, options: { shader: boolean; motion: boolean }) {
  const section = host.closest<HTMLElement>('section, footer') ?? host.parentElement!
  const entry: Entry = { host, section, variant, ...options, visible: false }
  entries.add(entry)
  host.dataset.motion = options.motion && !downgraded ? 'on' : 'off'
  host.dataset.renderer = options.motion && !downgraded ? 'css' : 'static'
  const observer = new IntersectionObserver(records => {
    const record = records[0]
    entry.visible = record?.isIntersecting ?? false
    host.dataset.visible = String(entry.visible)
    selectActive()
  }, { threshold: [0, .15, .35, .55, .75, 1] })
  observer.observe(section)
  if (entries.size === 1) document.addEventListener('visibilitychange', selectActive)
  return () => {
    observer.disconnect()
    entries.delete(entry)
    if (!entries.size) {
      document.removeEventListener('visibilitychange', selectActive)
      renderer?.dispose()
      renderer = null
      downgraded = false
    } else selectActive()
  }
}
