import { useEffect, useRef } from 'react'
import * as THREE from 'three'

type Trace = {
  points: THREE.Vector3[]
  speed: number
  phase: number
}

const TRACE_COLOR = 0xf59a1b
const TRACE_OPACITY = 0.24
const GLOW_OPACITY = 0.46
const NODE_OPACITY = 0.84

export default function CircuitField() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 120)
    camera.position.set(0, 0, 20)

    const group = new THREE.Group()
    group.position.set(0.2, -0.3, -1.6)
    group.rotation.set(-0.12, -0.26, -0.03)
    scene.add(group)

    const traces: Trace[] = []
    const pulseMaterials: THREE.MeshBasicMaterial[] = []
    const disposables: THREE.BufferGeometry[] = []
    const mouse = new THREE.Vector2(0, 0)

    const addLine = (points: [number, number, number][]) => {
      const vectors = points.map(([x, y, z]) => new THREE.Vector3(x, y, z))
      const geometry = new THREE.BufferGeometry().setFromPoints(vectors)
      disposables.push(geometry)

      const line = new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({
          color: TRACE_COLOR,
          transparent: true,
          opacity: TRACE_OPACITY,
        }),
      )
      group.add(line)

      const glow = new THREE.Line(
        geometry.clone(),
        new THREE.LineBasicMaterial({
          color: TRACE_COLOR,
          transparent: true,
          opacity: GLOW_OPACITY,
        }),
      )
      glow.scale.setScalar(1.006)
      group.add(glow)
      disposables.push(glow.geometry as THREE.BufferGeometry)

      const nodeGeometry = new THREE.CircleGeometry(0.11, 18)
      const nodeMaterial = new THREE.MeshBasicMaterial({
        color: TRACE_COLOR,
        transparent: true,
        opacity: NODE_OPACITY,
        side: THREE.DoubleSide,
      })
      disposables.push(nodeGeometry)

      const start = new THREE.Mesh(nodeGeometry, nodeMaterial)
      start.position.copy(vectors[0])
      group.add(start)

      const end = new THREE.Mesh(nodeGeometry.clone(), nodeMaterial.clone())
      end.position.copy(vectors[vectors.length - 1])
      group.add(end)
      disposables.push(end.geometry as THREE.BufferGeometry)

      const pulseGeometry = new THREE.SphereGeometry(0.1, 10, 10)
      const pulseMaterial = new THREE.MeshBasicMaterial({
        color: 0xffd08a,
        transparent: true,
        opacity: 0.9,
      })
      const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial)
      pulse.position.copy(vectors[0])
      group.add(pulse)
      pulseMaterials.push(pulseMaterial)
      disposables.push(pulseGeometry)

      traces.push({
        points: vectors,
        speed: 0.1 + Math.random() * 0.08,
        phase: Math.random(),
      })

      return pulse
    }

    const pulseMeshes = [
      addLine([
        [4.2, 8.7, 0.24],
        [2.8, 6.6, 0.16],
        [2.8, 3.8, 0.02],
        [1.3, 1.8, -0.14],
      ]),
      addLine([
        [4.8, 2.8, 0.12],
        [3.1, 2.8, 0.03],
        [1.6, 0.9, -0.16],
        [1.6, -4.1, -0.28],
      ]),
      addLine([
        [4.3, -8.9, 0.18],
        [2.9, -7.1, 0.1],
        [1.4, -7.1, -0.06],
        [0.1, -5.4, -0.2],
      ]),
      addLine([
        [2.6, 10.2, 0.14],
        [2.6, 7.1, 0.02],
        [1.1, 5.3, -0.1],
        [1.1, 2.2, -0.22],
      ]),
      addLine([
        [5.1, -3.3, 0.18],
        [3.6, -3.3, 0.06],
        [2.0, -5.1, -0.08],
        [2.0, -8.2, -0.2],
      ]),
    ]

    const ambient = new THREE.AmbientLight(0xffffff, 0.45)
    scene.add(ambient)

    const resize = () => {
      if (!mount) return
      const width = mount.clientWidth
      const height = mount.clientHeight
      camera.aspect = width / height || 1
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -((event.clientY / window.innerHeight) * 2 - 1)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouseMove)

    const tempPoint = new THREE.Vector3()
    const clock = new THREE.Clock()
    let frameId = 0

    const animate = () => {
      frameId = window.requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()

      group.rotation.y += ((-0.26 + mouse.x * 0.03) - group.rotation.y) * 0.035
      group.rotation.x += ((-0.16 + mouse.y * 0.03) - group.rotation.x) * 0.035
      group.position.y += ((-0.35 + mouse.y * 0.16) - group.position.y) * 0.03

      traces.forEach((trace, index) => {
        const progress = (elapsed * trace.speed + trace.phase) % 1
        const scaled = progress * (trace.points.length - 1)
        const segmentIndex = Math.min(Math.floor(scaled), trace.points.length - 2)
        const localT = scaled - segmentIndex

        tempPoint.copy(trace.points[segmentIndex]).lerp(trace.points[segmentIndex + 1], localT)
        pulseMeshes[index].position.copy(tempPoint)
        pulseMaterials[index].opacity = 0.45 + Math.sin(elapsed * 3.2 + index) * 0.2
      })

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      renderer.dispose()
      pulseMaterials.forEach((material) => material.dispose())
      group.traverse((child) => {
        const mesh = child as THREE.Mesh
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
          materials.forEach((material) => material.dispose())
        }
      })
      disposables.forEach((geometry) => geometry.dispose())
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
        opacity: 0.85,
      }}
    />
  )
}
