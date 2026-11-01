import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { ScrollTrigger } from '../animations/gsap'

interface WobbleSpiralCanvasProps {
  images: string[]
  onSelect?: (index: number) => void
  className?: string
  pinnedTriggerSelector?: string
}

// Planar rigid vertex shader — Cards are completely flat and straight, without warping
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// Fragment shader with rounded corners and strict object-fit: cover mapping
// Guarantees zero distortion: dental smiles and faces keep their exact natural aspect ratio
const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uImageAspect;
  uniform float uCardAspect;
  varying vec2 vUv;

  void main() {
    // Rounded corners in UV space
    vec2 p = vUv - 0.5;
    vec2 b = vec2(0.48, 0.48);
    float r = 0.04;
    vec2 d = abs(p) - b;
    float dist = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - r;
    if (dist > 0.0) discard;

    // Aspect-ratio cover mapping (zero stretch/squeeze)
    vec2 coverUv = vUv;
    if (uImageAspect > uCardAspect) {
      float scale = uCardAspect / uImageAspect;
      coverUv.x = (vUv.x - 0.5) * scale + 0.5;
    } else {
      float scale = uImageAspect / uCardAspect;
      coverUv.y = (vUv.y - 0.5) * scale + 0.5;
    }

    vec4 color = texture2D(uTexture, coverUv);

    // Clean subtle white hairline border for crisp premium look
    float borderDist = abs(dist + 0.005);
    float borderAlpha = smoothstep(0.007, 0.0, borderDist);
    color.rgb = mix(color.rgb, vec3(1.0, 1.0, 1.0), borderAlpha * 0.45);

    if (!gl_FrontFacing) {
      color.rgb = vec3(0.92, 0.96, 1.0);
    }
    gl_FragColor = color;
  }
`

export default function WobbleSpiralCanvas({
  images,
  onSelect,
  className = '',
  pinnedTriggerSelector,
}: WobbleSpiralCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container || images.length === 0) return

    let animationId = 0
    let isVisible = true
    const w = container.clientWidth || 560
    const h = container.clientHeight || 540

    try {
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
      if (gl) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
      }
    } catch {
      // ignore
    }

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(w, h, false)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100)
    camera.position.z = 7.0

    // Dimensions tuned for horizontal dental smile framing and straight orientation
    const settings = {
      radius: 2.15,
      verticalGap: 0.48,
      angleGap: 0.72,
      cardWidth: 1.68,
      cardHeight: 1.28,
      idleSpin: 0.002,
      scrollSensitivity: 0.0035,
      smoothing: 0.12,
    }

    const cardAspect = settings.cardWidth / settings.cardHeight
    const cardGeometry = new THREE.PlaneGeometry(settings.cardWidth, settings.cardHeight, 1, 1)
    const textureLoader = new THREE.TextureLoader().setCrossOrigin('anonymous')

    const fullList = [...images, ...images]
    const cardCount = fullList.length

    const cards: THREE.Mesh[] = fullList.map((url, i) => {
      const mat = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        side: THREE.DoubleSide,
        transparent: true,
        uniforms: {
          uTexture: { value: null },
          uImageAspect: { value: 1.45 },
          uCardAspect: { value: cardAspect },
        },
      })

      const texture = textureLoader.load(url, (tex) => {
        const img = tex.image as HTMLImageElement
        if (img) {
          const naturalAspect =
            (img.naturalWidth || img.width || 640) / (img.naturalHeight || img.height || 440)
          mat.uniforms.uImageAspect.value = naturalAspect
        }
      })
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      mat.uniforms.uTexture.value = texture

      const mesh = new THREE.Mesh(cardGeometry, mat)
      mesh.userData = { originalIndex: i % images.length }
      scene.add(mesh)
      return mesh
    })

    const state = {
      rotation: 0,
      rotationTarget: 0,
      scrollRotation: 0,
      dragOffset: 0,
    }

    // Connect to GSAP ScrollTrigger Pinned Section
    let st: ScrollTrigger | null = null
    const triggerEl = pinnedTriggerSelector
      ? (document.querySelector(pinnedTriggerSelector) as HTMLElement | null)
      : null

    if (triggerEl) {
      st = ScrollTrigger.create({
        trigger: triggerEl,
        start: 'top top',
        end: () => (window.innerWidth < 768 ? '+=950' : '+=1500'),
        pin: true,
        scrub: 0.75,
        onUpdate: (self) => {
          state.scrollRotation = self.progress * (cardCount / 2)
        },
      })
    }

    let isDragging = false
    let startY = 0
    let startX = 0
    let didMove = false

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true
      didMove = false
      startY = 'touches' in e ? e.touches[0].clientY : e.clientY
      startX = 'touches' in e ? e.touches[0].clientX : e.clientX
    }

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return
      const isTouch = 'touches' in e
      const currentY = isTouch ? e.touches[0].clientY : e.clientY
      const currentX = isTouch ? e.touches[0].clientX : e.clientX
      const deltaY = currentY - startY
      const deltaX = currentX - startX

      if (isTouch && !triggerEl && Math.abs(deltaY) > Math.abs(deltaX) * 1.5) {
        isDragging = false
        return
      }

      if (Math.abs(deltaY) > 4 || Math.abs(deltaX) > 4) {
        didMove = true
      }
      state.dragOffset += (deltaY - deltaX * 0.6) * settings.scrollSensitivity
      state.rotationTarget += (deltaY - deltaX * 0.6) * settings.scrollSensitivity
      startY = currentY
      startX = currentX
    }

    const onPointerUp = (e: MouseEvent | TouchEvent) => {
      if (isDragging && !didMove && onSelect) {
        const rect = canvas.getBoundingClientRect()
        const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : (e as MouseEvent).clientX
        const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : (e as MouseEvent).clientY

        const mouseX = ((clientX - rect.left) / rect.width) * 2 - 1
        const mouseY = -((clientY - rect.top) / rect.height) * 2 + 1

        const raycaster = new THREE.Raycaster()
        raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera)
        const intersects = raycaster.intersectObjects(cards)
        if (intersects.length > 0) {
          const hit = intersects[0].object
          const idx = hit.userData.originalIndex
          if (idx !== undefined) onSelect(idx)
        }
      }
      isDragging = false
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()
      state.rotationTarget += e.deltaY * settings.scrollSensitivity * 0.55
    }

    canvas.addEventListener('mousedown', onPointerDown)
    window.addEventListener('mousemove', onPointerMove, { passive: true })
    window.addEventListener('mouseup', onPointerUp)

    canvas.addEventListener('touchstart', onPointerDown, { passive: true })
    window.addEventListener('touchmove', onPointerMove, { passive: true })
    window.addEventListener('touchend', onPointerUp)

    if (!triggerEl) {
      canvas.addEventListener('wheel', onWheel, { passive: false })
    }

    let lastW = w
    let lastH = h
    const handleResize = () => {
      if (!container) return
      const nw = container.clientWidth || 560
      const nh = container.clientHeight || 540
      if (Math.abs(nw - lastW) < 2 && Math.abs(nh - lastH) < 2) return
      lastW = nw
      lastH = nh
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh, false)
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

    const animate = () => {
      animationId = requestAnimationFrame(animate)
      if (!isVisible) return

      if (triggerEl) {
        const target = state.scrollRotation + state.dragOffset
        state.rotation += (target - state.rotation) * settings.smoothing
      } else {
        if (!isDragging) {
          state.rotationTarget += settings.idleSpin
        }
        state.rotation += (state.rotationTarget - state.rotation) * settings.smoothing
      }

      cards.forEach((card, index) => {
        let slot = (index - state.rotation) % cardCount
        if (slot < 0) slot += cardCount
        slot -= cardCount / 2

        const angle = slot * settings.angleGap + Math.PI / 2
        const rawX = Math.cos(angle) * settings.radius
        const rawY = slot * settings.verticalGap
        const rawZ = Math.sin(angle) * settings.radius

        // Cards aligned straight towards the user:
        // Center card faces 100% straight ahead with zero tilt.
        // Lateral cards retain very gentle 3D depth without distorting or clipping text/smiles.
        const curveOffsetX = (rawY * 0.20) - 0.06

        card.position.set(rawX * 0.86 + curveOffsetX, rawY, rawZ)
        card.rotation.y = (Math.PI / 2 - angle) * 0.20
        card.rotation.x = 0
        card.rotation.z = 0
      })

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      canvas.removeEventListener('mousedown', onPointerDown)
      window.removeEventListener('mousemove', onPointerMove)
      window.removeEventListener('mouseup', onPointerUp)
      canvas.removeEventListener('touchstart', onPointerDown)
      window.removeEventListener('touchmove', onPointerMove)
      window.removeEventListener('touchend', onPointerUp)
      if (!triggerEl) {
        canvas.removeEventListener('wheel', onWheel)
      }
      ro.disconnect()
      io.disconnect()
      st?.kill()
      cardGeometry.dispose()
      cards.forEach((c) => {
        ;(c.material as THREE.Material).dispose()
      })
      try {
        const gl = renderer.getContext()
        if (gl) {
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
          gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
        }
      } catch {
        // ignore
      }
      renderer.dispose()
    }
  }, [images, onSelect, pinnedTriggerSelector])

  return (
    <div ref={containerRef} className={`spiral-3d-stage ${className}`}>
      <canvas ref={canvasRef} className="spiral-3d-canvas" />
    </div>
  )
}
