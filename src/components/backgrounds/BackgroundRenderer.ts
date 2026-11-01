import { COLOR_BENDS_FRAGMENT } from './colorBendsShader'
import { AURORA, SILK, VERTEX } from './reactBitsShaders'

type ShaderVariant = 'soft-aurora' | 'silk' | 'color-bends'
type Program = { program: WebGLProgram; attribute: number; uniforms: Record<string, WebGLUniformLocation | null> }

// One context shared by every SectionBackground, loaded only on eligible desktops.
export function createBackgroundRenderer(onSlowDevice: () => void) {
  const canvas = document.createElement('canvas')
  canvas.className = 'section-background__shader'
  canvas.setAttribute('aria-hidden', 'true')
  const gl = canvas.getContext('webgl2', { alpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' })
  if (!gl) throw new Error('WebGL2 unavailable')
  const shaders: WebGLShader[] = []
  const programs: Program[] = []
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)
    if (!shader) throw new Error('Shader allocation failed')
    shaders.push(shader)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Shader compilation failed')
    return shader
  }
  const link = (source: string): Program => {
    const program = gl.createProgram()
    if (!program) throw new Error('Program allocation failed')
    const result: Program = { program, attribute: 0, uniforms: {} }
    programs.push(result)
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX))
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, source))
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Shader link failed')
    result.attribute = gl.getAttribLocation(program, 'aPosition')
    for (let i = 0; i < gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS); i++) {
      const info = gl.getActiveUniform(program, i)
      if (info) result.uniforms[info.name.replace('[0]', '')] = gl.getUniformLocation(program, info.name)
    }
    return result
  }
  let aurora: Program
  let silk: Program
  let bends: Program
  try { aurora = link(AURORA); silk = link(SILK); bends = link('#version 300 es\nprecision highp float;\nout vec4 fragColor;\n' + COLOR_BENDS_FRAGMENT.replace('varying vec2 vUv;', 'in vec2 vUv;').replaceAll('gl_FragColor', 'fragColor')) } catch (error) {
    programs.forEach(p => gl.deleteProgram(p.program))
    shaders.forEach(s => gl.deleteShader(s))
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    throw error
  }
  shaders.forEach(s => gl.deleteShader(s))
  const buffer = gl.createBuffer()
  const vao = gl.createVertexArray()
  gl.bindVertexArray(vao)
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  let host: HTMLElement | null = null
  let variant: ShaderVariant = 'soft-aurora'
  let raf = 0
  let last = 0
  let clock = 0
  let slowFrames = 0
  let dead = false
  const bendsPalette = new Float32Array([0,86/255,214/255,61/255,139/255,1,122/255,167/255,1,56/255,189/255,248/255,0,0,0,0,0,0,0,0,0,0,0,0])
  const waves = new Float32Array(16)
  const palette = new Float32Array([.9, .035, 4.4, .82, .07, 4.45, .7, .12, 4.5, .82, .07, 4.45, .9, .035, 4.4])
  let px = 0
  let py = 0
  const resize = () => {
    if (!host) return
    const width = host.clientWidth
    const height = host.clientHeight
    const mobile = matchMedia('(max-width: 959px)').matches
    const maxWidth = mobile ? 420 : variant === 'color-bends' ? 720 : 960
    const maxHeight = mobile ? 560 : variant === 'color-bends' ? 480 : 720
    const ratio = Math.min(1, maxWidth / Math.max(1, width), maxHeight / Math.max(1, height))
    canvas.width = Math.max(1, Math.round(width * ratio))
    canvas.height = Math.max(1, Math.round(height * ratio))
    gl.viewport(0, 0, canvas.width, canvas.height)
  }
  const observer = new ResizeObserver(resize)
  const frame = (now: number) => {
    raf = 0
    if (dead || !host || document.hidden) return
    raf = requestAnimationFrame(frame)
    const elapsed = last ? now - last : 34
    if (elapsed < 33) return // Quiet lighting does not need 60 GPU draws per second.
    last = now
    clock += Math.min(elapsed, 80) / 1000
    slowFrames = elapsed > 85 ? slowFrames + 1 : Math.max(0, slowFrames - 1)
    if (slowFrames >= 18) { onSlowDevice(); return }
    const tx = Number.parseFloat(host.style.getPropertyValue('--sb-x')) || 0
    const ty = Number.parseFloat(host.style.getPropertyValue('--sb-y')) || 0
    px += (tx / 8 - px) * .045
    py += (ty / 8 - py) * .045
    const p = variant === 'color-bends' ? bends : variant === 'silk' ? silk : aurora
    gl.useProgram(p.program)
    gl.bindVertexArray(vao)
    const location = p.attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.enableVertexAttribArray(location)
    gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0)
    const u = p.uniforms
    gl.uniform1f(u.uTime, clock * .16)
    if (variant === 'color-bends') {
      gl.uniform1f(u.uTime, clock)
      gl.uniform2f(u.uCanvas, canvas.width, canvas.height)
      gl.uniform1f(u.uSpeed, .2)
      gl.uniform2f(u.uRot, 0, 1)
      gl.uniform1i(u.uColorCount, 4)
      gl.uniform3fv(u.uColors, bendsPalette)
      gl.uniform1i(u.uTransparent, 1)
      gl.uniform1f(u.uScale, 1)
      gl.uniform1f(u.uFrequency, 1)
      gl.uniform1f(u.uWarpStrength, 1)
      gl.uniform2f(u.uPointer, px, -py)
      gl.uniform1f(u.uMouseInfluence, 1)
      gl.uniform1f(u.uParallax, .5)
      gl.uniform1f(u.uNoise, .15)
      gl.uniform1i(u.uIterations, 1)
      gl.uniform1f(u.uIntensity, 1.5)
      gl.uniform1f(u.uBandWidth, 6)
    } else if (variant === 'silk') {
      gl.uniform2f(u.uView, canvas.width, canvas.height)
      gl.uniform1f(u.uScale, 1.05)
      gl.uniform1f(u.uRotation, -.18)
      gl.uniform1f(u.uWave, .35)
      gl.uniform1f(u.uRipple, .35)
      gl.uniform1f(u.uFold, .65)
      gl.uniform2f(u.uShift, px * .012, py * .012)
      gl.uniform4f(u.uPointer, .5 + px * .06, .5 + py * .06, .15, .6)
      gl.uniform2f(u.uDrag, px * .008, py * .008)
      gl.uniform4fv(u.uWaves, waves)
    } else {
      gl.uniform2f(u.uResolution, canvas.width, canvas.height)
      // OKLCH stops for ice blue; the source shader converts these to sRGB.
      gl.uniform3fv(u.uStops, palette)
      gl.uniform1i(u.uStopCount, 3)
      gl.uniform1f(u.uAmplitude, .55)
      gl.uniform1f(u.uBlend, .85)
      gl.uniform1f(u.uHeight, .55)
      gl.uniform1f(u.uScale, .7)
      gl.uniform1f(u.uGlow, .15)
      gl.uniform1f(u.uBrightness, .7)
      gl.uniform1i(u.uLayers, 1)
      gl.uniform1f(u.uFlip, 0)
      gl.uniform3f(u.uPointer, px * .12, .5 + py * .06, .12)
      gl.uniform1f(u.uReveal, 1)
      gl.uniform1f(u.uOpacity, .7)
      gl.uniform1f(u.uLightMode, 1)
    }
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }
  const detach = () => {
    cancelAnimationFrame(raf)
    raf = 0
    last = 0
    observer.disconnect()
    if (host) host.dataset.renderer = 'css'
    host = null
    canvas.remove()
  }
  const lost = (event: Event) => { event.preventDefault(); if (!dead) onSlowDevice() }
  canvas.addEventListener('webglcontextlost', lost)
  return {
    attach(next: HTMLElement, type: ShaderVariant) {
      if (dead) return
      if (host !== next) {
        detach()
        host = next
        variant = type
        next.append(canvas)
        next.dataset.renderer = 'webgl'
        observer.observe(next)
        resize()
      }
      if (!raf) raf = requestAnimationFrame(frame)
    },
    detach,
    dispose() {
      dead = true
      detach()
      canvas.removeEventListener('webglcontextlost', lost)
      observer.disconnect()
      programs.forEach(p => gl.deleteProgram(p.program))
      gl.deleteBuffer(buffer)
      gl.deleteVertexArray(vao)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    },
  }
}
