import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const PARTICLE_COUNT = 235
const CONNECTION_DISTANCE = 5
const W = 60   // full horizontal spread
const H = 46   // full vertical spread
const D = 8    // depth variation
const X_MIN = -W / 2
const X_MAX = W / 2

export default function ParticleField() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const W_px = mount.clientWidth
    const H_px = mount.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, W_px / H_px, 0.1, 200)
    camera.position.z = 28
    const mouse = { x: 0, y: 0 }

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
    renderer.setSize(W_px, H_px)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // Distribute particles across the full canvas with a balanced horizontal spread
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const velocities: { x: number; y: number }[] = []

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const lowerBand = Math.random() < 0.18
      positions[i * 3] = (Math.random() - 0.5) * W
      positions[i * 3 + 1] = lowerBand
        ? (-0.16 - Math.random() * 0.34) * H
        : (Math.random() - 0.5) * H
      positions[i * 3 + 2] = (Math.random() - 0.5) * D

      velocities.push({
        x: (Math.random() - 0.5) * 0.015,
        y: (Math.random() - 0.5) * 0.01,
      })
    }

    const pointGeo = new THREE.BufferGeometry()
    pointGeo.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3))

    const pointMat = new THREE.PointsMaterial({
      size: 0.26,
      color: 0xf59a1b,
      transparent: true,
      opacity: 0.86,
      sizeAttenuation: true,
    })

    const points = new THREE.Points(pointGeo, pointMat)
    scene.add(points)

    // Lines
    const maxLines = PARTICLE_COUNT * 8
    const linePositions = new Float32Array(maxLines * 6)
    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))

    const lineMat = new THREE.LineBasicMaterial({
      color: 0xf59a1b,
      transparent: true,
      opacity: 0.22,
    })

    const lineSegs = new THREE.LineSegments(lineGeo, lineMat)
    scene.add(lineSegs)

    // Resize
    const handleResize = () => {
      if (!mount) return
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth - 0.5) * 2
      mouse.y = -(event.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', handleMouseMove)

    let animId: number

    const animate = () => {
      animId = requestAnimationFrame(animate)

      const pos = pointGeo.attributes.position.array as Float32Array

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        pos[i * 3]     += velocities[i].x
        pos[i * 3 + 1] += velocities[i].y

        // Wrap at edges
        if (pos[i * 3] > X_MAX) pos[i * 3] = X_MIN
        if (pos[i * 3] < X_MIN) pos[i * 3] = X_MAX
        if (pos[i * 3 + 1] >  H / 2) pos[i * 3 + 1] = -H / 2
        if (pos[i * 3 + 1] < -H / 2) pos[i * 3 + 1] =  H / 2
      }

      pointGeo.attributes.position.needsUpdate = true

      // Rebuild line segments
      const lp = lineGeo.attributes.position.array as Float32Array
      let count = 0

      for (let i = 0; i < PARTICLE_COUNT && count < maxLines; i++) {
        for (let j = i + 1; j < PARTICLE_COUNT && count < maxLines; j++) {
          const dx = pos[i * 3]     - pos[j * 3]
          const dy = pos[i * 3 + 1] - pos[j * 3 + 1]
          const dz = pos[i * 3 + 2] - pos[j * 3 + 2]
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

          if (dist < CONNECTION_DISTANCE) {
            lp[count * 6]     = pos[i * 3]
            lp[count * 6 + 1] = pos[i * 3 + 1]
            lp[count * 6 + 2] = pos[i * 3 + 2]
            lp[count * 6 + 3] = pos[j * 3]
            lp[count * 6 + 4] = pos[j * 3 + 1]
            lp[count * 6 + 5] = pos[j * 3 + 2]
            count++
          }
        }
      }

      lineGeo.attributes.position.needsUpdate = true
      lineGeo.setDrawRange(0, count * 2)

      points.rotation.x += (mouse.y * 0.08 - points.rotation.x) * 0.04
      points.rotation.y += (mouse.x * 0.08 - points.rotation.y) * 0.04
      lineSegs.rotation.copy(points.rotation)

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
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
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    />
  )
}
