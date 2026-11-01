import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface FluidRevealCanvasProps {
  topSrc: string
  bottomSrc: string
  className?: string
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fluidFragmentShader = `
  uniform sampler2D uPrevTrails;
  uniform vec2 uMouse;
  uniform vec2 uPrevMouse;
  uniform float uDecay;
  uniform bool uIsMoving;
  varying vec2 vUv;

  void main() {
    vec4 prevState = texture2D(uPrevTrails, vUv);
    float newValue = prevState.r * uDecay;

    if (uIsMoving) {
      vec2 mouseDirection = uMouse - uPrevMouse;
      float lineLength = length(mouseDirection);

      if (lineLength > 0.0001) {
        vec2 mouseDir = mouseDirection / lineLength;
        vec2 toPixel = vUv - uPrevMouse;
        float projAlong = dot(toPixel, mouseDir);
        projAlong = clamp(projAlong, 0.0, lineLength);

        vec2 closestPoint = uPrevMouse + projAlong * mouseDir;
        float dist = length(vUv - closestPoint);
        float lineWidth = 0.16;
        float intensity = smoothstep(lineWidth, 0.0, dist) * 0.75;
        newValue = min(1.0, newValue + intensity);
      } else {
        float dist = length(vUv - uMouse);
        float intensity = smoothstep(0.15, 0.0, dist) * 0.65;
        newValue = min(1.0, newValue + intensity);
      }
    }

    gl_FragColor = vec4(newValue, 0.0, 0.0, 1.0);
  }
`

const displayFragmentShader = `
  uniform sampler2D uFluid;
  uniform sampler2D uTopTexture;
  uniform sampler2D uBottomTexture;
  uniform vec2 uResolution;
  uniform float uDpr;
  uniform vec2 uTopTextureSize;
  uniform vec2 uBottomTextureSize;
  varying vec2 vUv;

  vec2 getCoverUV(vec2 uv, vec2 textureSize) {
    if (textureSize.x < 1.0 || textureSize.y < 1.0) return uv;
    vec2 s = uResolution / textureSize;
    float scale = max(s.x, s.y);
    vec2 scaledSize = textureSize * scale;
    vec2 offset = (uResolution - scaledSize) * 0.5;
    vec2 scaledUV = (uv * uResolution - offset) / scaledSize;
    return clamp(scaledUV, 0.0, 1.0);
  }

  void main() {
    float fluid = texture2D(uFluid, vUv).r;
    vec2 topUV = getCoverUV(vUv, uTopTextureSize);
    vec2 bottomUV = getCoverUV(vUv, uBottomTextureSize);

    vec4 topColor = texture2D(uTopTexture, topUV);
    vec4 bottomColor = texture2D(uBottomTexture, bottomUV);

    float threshold = 0.02;
    float edgeWidth = 0.015 / max(uDpr, 1.0);
    float t = smoothstep(threshold, threshold + edgeWidth, fluid);

    // t = 0 -> topColor (Adulta), t = 1 -> bottomColor (Criança)
    gl_FragColor = mix(topColor, bottomColor, t);
  }
`

export default function FluidRevealCanvas({ topSrc, bottomSrc, className = '' }: FluidRevealCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    let animationFrameId = 0
    let isVisible = true
    let needsDraw = true
    let trailFrames = 0
    const w = Math.min(container.clientWidth || 420, 600)
    const h = Math.min(container.clientHeight || 520, 700)
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    })
    renderer.setSize(w, h, false)
    renderer.setPixelRatio(dpr)

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    const mouse = new THREE.Vector2(0.5, 0.5)
    const prevMouse = new THREE.Vector2(0.5, 0.5)
    let isMoving = false
    let lastMoveTime = 0
    let mouseInCanvas = false

    const simSize = 256
    const rtType = renderer.capabilities.isWebGL2 ? THREE.HalfFloatType : THREE.UnsignedByteType
    const pingPong = [
      new THREE.WebGLRenderTarget(simSize, simSize, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: rtType,
      }),
      new THREE.WebGLRenderTarget(simSize, simSize, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: rtType,
      }),
    ]
    let currentTarget = 0

    const makeColorTex = (color: string) => {
      const c = document.createElement('canvas')
      c.width = 16
      c.height = 16
      const ctx = c.getContext('2d')
      if (ctx) {
        ctx.fillStyle = color
        ctx.fillRect(0, 0, 16, 16)
      }
      const tex = new THREE.CanvasTexture(c)
      tex.minFilter = THREE.LinearFilter
      tex.magFilter = THREE.LinearFilter
      return tex
    }

    const topTextureSize = new THREE.Vector2(1, 1)
    const bottomTextureSize = new THREE.Vector2(1, 1)

    const trailsMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPrevTrails: { value: null },
        uMouse: { value: mouse },
        uPrevMouse: { value: prevMouse },
        uDecay: { value: 0.88 },
        uIsMoving: { value: false },
      },
      vertexShader,
      fragmentShader: fluidFragmentShader,
    })

    const displayMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uFluid: { value: null },
        uTopTexture: { value: makeColorTex('#0f172a') },
        uBottomTexture: { value: makeColorTex('#38bdf8') },
        uResolution: { value: new THREE.Vector2(w, h) },
        uDpr: { value: dpr },
        uTopTextureSize: { value: topTextureSize },
        uBottomTextureSize: { value: bottomTextureSize },
      },
      vertexShader,
      fragmentShader: displayFragmentShader,
    })

    let loadedCount = 0
    const checkLoaded = () => {
      needsDraw = true
      loadedCount++
      if (loadedCount >= 2) {
        setLoaded(true)
      }
    }

    const loadCanvasTexture = (url: string, isTop: boolean) => {
      const img = new Image()
      img.crossOrigin = 'Anonymous'
      let handled = false
      const onImageLoaded = () => {
        if (handled) return
        handled = true
        const cw = img.naturalWidth || img.width
        const ch = img.naturalHeight || img.height
        const c = document.createElement('canvas')
        c.width = cw
        c.height = ch
        const ctx = c.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0, cw, ch)
        }
        const tex = new THREE.CanvasTexture(c)
        tex.flipY = true
        tex.minFilter = THREE.LinearFilter
        tex.magFilter = THREE.LinearFilter
        tex.generateMipmaps = false
        tex.needsUpdate = true

        if (isTop) {
          topTextureSize.set(cw, ch)
          displayMaterial.uniforms.uTopTexture.value = tex
        } else {
          bottomTextureSize.set(cw, ch)
          displayMaterial.uniforms.uBottomTexture.value = tex
        }
        checkLoaded()
      }

      img.onload = onImageLoaded
      img.src = url
      if (img.complete && img.naturalWidth !== 0) {
        onImageLoaded()
      }
    }

    loadCanvasTexture(topSrc, true)
    loadCanvasTexture(bottomSrc, false)

    const plane = new THREE.PlaneGeometry(2, 2)
    const displayMesh = new THREE.Mesh(plane, displayMaterial)
    scene.add(displayMesh)

    const simScene = new THREE.Scene()
    const simMesh = new THREE.Mesh(plane, trailsMaterial)
    simScene.add(simMesh)

    renderer.setRenderTarget(pingPong[0])
    renderer.clear()
    renderer.setRenderTarget(pingPong[1])
    renderer.clear()
    renderer.setRenderTarget(null)

    const updateMouseCoords = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) return
      const nx = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      const ny = Math.max(0, Math.min(1, 1 - (clientY - rect.top) / rect.height))

      if (!mouseInCanvas) {
        mouse.set(nx, ny)
        prevMouse.set(nx, ny)
        mouseInCanvas = true
      } else {
        prevMouse.copy(mouse)
        mouse.set(nx, ny)
      }
      isMoving = true
      trailFrames = 60
      lastMoveTime = performance.now()
    }

    const onMouseEnter = (e: MouseEvent) => {
      mouseInCanvas = false
      updateMouseCoords(e.clientX, e.clientY)
    }
    const onMouseMove = (e: MouseEvent) => {
      updateMouseCoords(e.clientX, e.clientY)
    }
    const onMouseLeave = () => {
      mouseInCanvas = false
      isMoving = false
    }
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updateMouseCoords(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    canvas.addEventListener('mouseenter', onMouseEnter)
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)
    canvas.addEventListener('touchstart', onTouchMove, { passive: true })
    canvas.addEventListener('touchmove', onTouchMove, { passive: true })
    canvas.addEventListener('touchend', onMouseLeave)

    let lastW = w
    let lastH = h
    const handleResize = () => {
      if (!container) return
      const nw = Math.min(container.clientWidth || 420, 600)
      const nh = Math.min(container.clientHeight || 520, 700)
      if (Math.abs(nw - lastW) < 2 && Math.abs(nh - lastH) < 2) return
      lastW = nw
      lastH = nh
      needsDraw = true
      renderer.setSize(nw, nh, false)
      displayMaterial.uniforms.uResolution.value.set(nw, nh)
      displayMaterial.uniforms.uDpr.value = Math.min(window.devicePixelRatio || 1, 2)
    }

    const ro = new ResizeObserver(handleResize)
    ro.observe(container)

    const io = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true
      },
      { threshold: 0.02 },
    )
    io.observe(container)

    const renderLoop = () => {
      animationFrameId = requestAnimationFrame(renderLoop)
      // A settled portrait is a static frame. Avoid two WebGL passes per
      // frame while the user is scrolling past the Hero/About boundary.
      if (!isVisible || document.hidden || (!needsDraw && trailFrames === 0)) return
      needsDraw = false
      trailFrames = Math.max(0, trailFrames - 1)

      if (isMoving && performance.now() - lastMoveTime > 70) {
        isMoving = false
      }

      const prevTarget = pingPong[currentTarget]
      currentTarget = (currentTarget + 1) % 2
      const currentRenderTarget = pingPong[currentTarget]

      trailsMaterial.uniforms.uPrevTrails.value = prevTarget.texture
      trailsMaterial.uniforms.uMouse.value.copy(mouse)
      trailsMaterial.uniforms.uPrevMouse.value.copy(prevMouse)
      trailsMaterial.uniforms.uIsMoving.value = isMoving

      renderer.setRenderTarget(currentRenderTarget)
      renderer.render(simScene, camera)

      displayMaterial.uniforms.uFluid.value = currentRenderTarget.texture
      renderer.setRenderTarget(null)
      renderer.render(scene, camera)
    }

    renderLoop()

    return () => {
      cancelAnimationFrame(animationFrameId)
      canvas.removeEventListener('mouseenter', onMouseEnter)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
      canvas.removeEventListener('touchstart', onTouchMove)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onMouseLeave)
      ro.disconnect()
      io.disconnect()
      pingPong[0].dispose()
      pingPong[1].dispose()
      plane.dispose()
      trailsMaterial.dispose()
      displayMaterial.dispose()
      renderer.dispose()
    }
  }, [topSrc, bottomSrc])

  return (
    <div ref={containerRef} className={`fluid-reveal-container ${className}`}>
      <img
        src={topSrc}
        alt="Dra. Isabella Ferro"
        className={`fluid-reveal-fallback ${loaded ? 'is-hidden' : ''}`}
      />
      <canvas
        ref={canvasRef}
        className={`fluid-reveal-canvas ${loaded ? 'is-ready' : ''}`}
      />
    </div>
  )
}
