import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Three layers of stars for parallax depth:
// Layer 0 — distant tiny dim stars (lots)
// Layer 1 — mid stars, slightly bigger
// Layer 2 — close bright stars, occasional (few)

const LAYERS = [
  { count: 420, size: 0.06, opacity: 0.35, speed: 0.0008, spread: [140, 100, 50] },
  { count: 180, size: 0.13, opacity: 0.55, speed: 0.0018, spread: [120, 90, 40] },
  { count:  45, size: 0.28, opacity: 0.85, speed: 0.003,  spread: [100, 80, 30] },
] as const

interface StarfieldBackgroundProps {
  leftOnly?: boolean  // when true, clips particles to left 55% — for hero use
}

export default function StarfieldBackground({ leftOnly = false }: StarfieldBackgroundProps) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const W = mount.clientWidth  || window.innerWidth
    const H = mount.clientHeight || window.innerHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 300)
    camera.position.z = 40

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // Build star layers
    const layerObjects: THREE.Points[] = []

    LAYERS.forEach((layer) => {
      const positions = new Float32Array(layer.count * 3)
      const [sx, sy, sz] = layer.spread

      for (let i = 0; i < layer.count; i++) {
        // leftOnly: concentrate stars in left 55% of the canvas
        const xRand = leftOnly
          ? (Math.random() - 0.85) * sx   // biased left, fades out toward center
          : (Math.random() - 0.5)  * sx
        positions[i * 3]     = xRand
        positions[i * 3 + 1] = (Math.random() - 0.5) * sy
        positions[i * 3 + 2] = (Math.random() - 0.5) * sz
      }

      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

      const mat = new THREE.PointsMaterial({
        size: layer.size,
        color: 0xdde8ff,       // cool blue-white, matches the screenshot
        transparent: true,
        opacity: layer.opacity,
        sizeAttenuation: true,
      })

      const points = new THREE.Points(geo, mat)
      scene.add(points)
      layerObjects.push(points)
    })

    // Twinkle — oscillate opacity of layer 2 (brightest stars only)
    let twinkleT = 0

    // Mouse parallax (very subtle)
    const mouse = { x: 0, y: 0 }
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    const onResize = () => {
      const w = mount.clientWidth  || window.innerWidth
      const h = mount.clientHeight || window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    let animId: number

    const animate = () => {
      animId = requestAnimationFrame(animate)
      twinkleT += 0.012

      layerObjects.forEach((pts, i) => {
        const layer = LAYERS[i]

        // Slow drift — each layer at different speed for parallax
        pts.position.y -= layer.speed
        // Wrap vertically
        if (pts.position.y < -2) pts.position.y = 2

        // Subtle mouse parallax
        pts.position.x += (mouse.x * (i + 1) * 0.04 - pts.position.x) * 0.02
        pts.rotation.y  += (mouse.x * 0.005 - pts.rotation.y) * 0.02
      })

      // Twinkle only the bright layer
      const brightMat = layerObjects[2].material as THREE.PointsMaterial
      brightMat.opacity = LAYERS[2].opacity * (0.7 + 0.3 * Math.sin(twinkleT))

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      layerObjects.forEach((pts) => {
        pts.geometry.dispose() ;
        (pts.material as THREE.Material).dispose()
      })
      renderer.dispose()
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    />
  )
}
