import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const NODE_COUNT = 86
const FIELD_WIDTH = 64
const FIELD_HEIGHT = 26
const FIELD_DEPTH = 7
const CONNECTION_DISTANCE = 9.5

function seededRandom(seed: number) {
  let value = seed
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296
    return value / 4294967296
  }
}

export default function ProjectsDataField() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 160)
    camera.position.set(0, 0, 30)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const group = new THREE.Group()
    group.position.set(0, -1.2, -2)
    group.rotation.set(-0.16, -0.08, 0)
    scene.add(group)

    const random = seededRandom(42)
    const nodePositions: THREE.Vector3[] = []
    const positions = new Float32Array(NODE_COUNT * 3)

    for (let i = 0; i < NODE_COUNT; i++) {
      const sideBias = random() < 0.44 ? (random() < 0.5 ? -1 : 1) : 0
      const x = sideBias
        ? sideBias * (FIELD_WIDTH * 0.24 + random() * FIELD_WIDTH * 0.26)
        : (random() - 0.5) * FIELD_WIDTH
      const y = (random() - 0.5) * FIELD_HEIGHT
      const z = (random() - 0.5) * FIELD_DEPTH

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
      nodePositions.push(new THREE.Vector3(x, y, z))
    }

    const pointGeometry = new THREE.BufferGeometry()
    pointGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const pointMaterial = new THREE.PointsMaterial({
      color: 0xf59a1b,
      size: 0.22,
      transparent: true,
      opacity: 0.54,
      sizeAttenuation: true,
    })

    const points = new THREE.Points(pointGeometry, pointMaterial)
    group.add(points)

    const linePositions: number[] = []
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        const distance = nodePositions[i].distanceTo(nodePositions[j])
        if (distance > CONNECTION_DISTANCE || random() > 0.22) continue

        linePositions.push(
          nodePositions[i].x,
          nodePositions[i].y,
          nodePositions[i].z,
          nodePositions[j].x,
          nodePositions[j].y,
          nodePositions[j].z,
        )
      }
    }

    const lineGeometry = new THREE.BufferGeometry()
    lineGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(linePositions), 3),
    )

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xf59a1b,
      transparent: true,
      opacity: 0.13,
    })

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial)
    group.add(lines)

    const scanGeometry = new THREE.PlaneGeometry(FIELD_WIDTH * 1.1, 0.08)
    const scanMaterial = new THREE.MeshBasicMaterial({
      color: 0xf59a1b,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const scanLine = new THREE.Mesh(scanGeometry, scanMaterial)
    scanLine.position.set(0, -FIELD_HEIGHT / 2, -0.6)
    group.add(scanLine)

    const mouse = new THREE.Vector2(0, 0)

    const resize = () => {
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

    const clock = new THREE.Clock()
    let frameId = 0

    const animate = () => {
      frameId = window.requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()

      group.rotation.y += ((mouse.x * 0.035) - group.rotation.y) * 0.035
      group.rotation.x += ((-0.16 + mouse.y * 0.025) - group.rotation.x) * 0.035
      points.rotation.z = Math.sin(elapsed * 0.08) * 0.025
      lines.rotation.copy(points.rotation)

      scanLine.position.y = -FIELD_HEIGHT / 2 + ((elapsed * 2.1) % FIELD_HEIGHT)
      scanMaterial.opacity = 0.1 + Math.sin(elapsed * 2.2) * 0.04
      pointMaterial.opacity = 0.48 + Math.sin(elapsed * 0.9) * 0.08

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)

      pointGeometry.dispose()
      pointMaterial.dispose()
      lineGeometry.dispose()
      lineMaterial.dispose()
      scanGeometry.dispose()
      scanMaterial.dispose()
      renderer.dispose()

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={mountRef} aria-hidden="true" className="projects-data-field-canvas" />
}
