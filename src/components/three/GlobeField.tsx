import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const GOLD = 0xff9f1c
const DEEP_GOLD = 0xd87100
const LIGHT_GOLD = 0xffc04d
const GLOBE_RADIUS = 8.85
const VIEW_CENTER_LON = 122
const LAND_GEOJSON_URL = `${import.meta.env.BASE_URL}data/world-countries.geojson`
const BASE_ROTATION_X = THREE.MathUtils.degToRad(-5)
const BASE_ROTATION_Y = THREE.MathUtils.degToRad(-6)
const BASE_ROTATION_Z = THREE.MathUtils.degToRad(-4)
const HERO_DRIFT_Y = THREE.MathUtils.degToRad(2.8)
const HERO_DRIFT_X = THREE.MathUtils.degToRad(0.8)
const HERO_DRIFT_Z = THREE.MathUtils.degToRad(0.45)

type GlobePoint = {
  lon: number
  lat: number
}

type Bounds = {
  minLon: number
  maxLon: number
  minLat: number
  maxLat: number
}

type Position = [number, number]
type LinearRing = Position[]
type PolygonCoordinates = LinearRing[]
type MultiPolygonCoordinates = PolygonCoordinates[]

type PolygonGeometry = {
  type: 'Polygon'
  coordinates: PolygonCoordinates
}

type MultiPolygonGeometry = {
  type: 'MultiPolygon'
  coordinates: MultiPolygonCoordinates
}

type LandFeature = {
  type: 'Feature'
  geometry: PolygonGeometry | MultiPolygonGeometry | null
}

type LandFeatureCollection = {
  type: 'FeatureCollection'
  features: LandFeature[]
}

type PreparedPolygon = Bounds & {
  rings: PolygonCoordinates
}

const VISIBLE_GLOBE_BOUNDS: Bounds = {
  minLon: 34,
  maxLon: 178,
  minLat: -48,
  maxLat: 73,
}

const DETAIL_SAMPLE_BOUNDS: Bounds[] = [
  // Three large non-adjacent zones — zero internal tile boundaries in visible areas

  // Asia-Pacific main landmass (single pass, no internal splits)
  { minLon: 68, maxLon: 147, minLat: -12, maxLat: 55 },

  // Island SE Asia + Pacific (separate only because non-contiguous lon)
  { minLon: 112, maxLon: 178, minLat: -48, maxLat: -9 },

  // Middle East + West Asia
  { minLon: 34, maxLon: 68, minLat: 5, maxLat: 55 },
]

const NETWORK_NODES = {
  manila: { lon: 120.98, lat: 14.6 },
  tokyo: { lon: 139.7, lat: 35.68 },
  seoul: { lon: 126.98, lat: 37.57 },
  shanghai: { lon: 121.47, lat: 31.23 },
  beijing: { lon: 116.4, lat: 39.9 },
  hongKong: { lon: 114.16, lat: 22.32 },
  taipei: { lon: 121.56, lat: 25.04 },
  singapore: { lon: 103.85, lat: 1.29 },
  jakarta: { lon: 106.82, lat: -6.2 },
  sydney: { lon: 151.21, lat: -33.87 },
  melbourne: { lon: 144.96, lat: -37.81 },
  bangkok: { lon: 100.5, lat: 13.76 },
  hanoi: { lon: 105.85, lat: 21.03 },
  delhi: { lon: 77.21, lat: 28.61 },
  mumbai: { lon: 72.88, lat: 19.08 },
  perth: { lon: 115.86, lat: -31.95 },
}

const ORBITAL_NODES: GlobePoint[] = [
  { lon: 50, lat: 54 },
  { lon: 70, lat: -8 },
  { lon: 88, lat: 63 },
  { lon: 150, lat: 54 },
  { lon: 168, lat: 16 },
  { lon: 169, lat: -39 },
]

const ARC_PAIRS: Array<[GlobePoint, GlobePoint]> = [
  [NETWORK_NODES.manila, NETWORK_NODES.tokyo],
  [NETWORK_NODES.manila, NETWORK_NODES.singapore],
  [NETWORK_NODES.manila, NETWORK_NODES.jakarta],
  [NETWORK_NODES.manila, NETWORK_NODES.sydney],
  [NETWORK_NODES.manila, NETWORK_NODES.hongKong],
  [NETWORK_NODES.manila, NETWORK_NODES.taipei],
  [NETWORK_NODES.tokyo, NETWORK_NODES.seoul],
  [NETWORK_NODES.tokyo, NETWORK_NODES.shanghai],
  [NETWORK_NODES.tokyo, NETWORK_NODES.sydney],
  [NETWORK_NODES.shanghai, NETWORK_NODES.singapore],
  [NETWORK_NODES.beijing, NETWORK_NODES.delhi],
  [NETWORK_NODES.hongKong, NETWORK_NODES.jakarta],
  [NETWORK_NODES.singapore, NETWORK_NODES.sydney],
  [NETWORK_NODES.singapore, NETWORK_NODES.mumbai],
  [NETWORK_NODES.bangkok, NETWORK_NODES.hanoi],
  [NETWORK_NODES.bangkok, NETWORK_NODES.jakarta],
  [NETWORK_NODES.perth, NETWORK_NODES.singapore],
  [NETWORK_NODES.melbourne, NETWORK_NODES.tokyo],
  [ORBITAL_NODES[0], NETWORK_NODES.delhi],
  [ORBITAL_NODES[1], NETWORK_NODES.mumbai],
  [ORBITAL_NODES[2], NETWORK_NODES.beijing],
  [ORBITAL_NODES[3], NETWORK_NODES.tokyo],
  [ORBITAL_NODES[4], NETWORK_NODES.manila],
  [ORBITAL_NODES[5], NETWORK_NODES.sydney],
]

function lonLatToVector(lon: number, lat: number, radius = GLOBE_RADIUS) {
  const centeredLon = THREE.MathUtils.degToRad(lon - VIEW_CENTER_LON)
  const latitude = THREE.MathUtils.degToRad(lat)
  const cosLat = Math.cos(latitude)

  return new THREE.Vector3(
    radius * cosLat * Math.sin(centeredLon),
    radius * Math.sin(latitude),
    radius * cosLat * Math.cos(centeredLon),
  )
}

function createDotTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 96
  canvas.height = 96

  const ctx = canvas.getContext('2d')
  if (ctx) {
    const gradient = ctx.createRadialGradient(48, 48, 0, 48, 48, 45)
    gradient.addColorStop(0, 'rgba(255, 216, 130, 1)')
    gradient.addColorStop(0.28, 'rgba(255, 159, 28, 0.95)')
    gradient.addColorStop(0.68, 'rgba(255, 126, 0, 0.26)')
    gradient.addColorStop(1, 'rgba(255, 126, 0, 0)')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(48, 48, 44, 0, Math.PI * 2)
    ctx.fill()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function seededNoise(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453
  return value - Math.floor(value)
}

function ringBounds(ring: LinearRing): Bounds {
  return ring.reduce<Bounds>(
    (bounds, [lon, lat]) => ({
      minLon: Math.min(bounds.minLon, lon),
      maxLon: Math.max(bounds.maxLon, lon),
      minLat: Math.min(bounds.minLat, lat),
      maxLat: Math.max(bounds.maxLat, lat),
    }),
    { minLon: 180, maxLon: -180, minLat: 90, maxLat: -90 },
  )
}

function intersectsBounds(bounds: Bounds, target: Bounds) {
  return (
    bounds.maxLon >= target.minLon &&
    bounds.minLon <= target.maxLon &&
    bounds.maxLat >= target.minLat &&
    bounds.minLat <= target.maxLat
  )
}

function prepareLandPolygons(collection: LandFeatureCollection) {
  const prepared: PreparedPolygon[] = []

  collection.features.forEach((feature) => {
    const geometry = feature.geometry
    if (!geometry) return

    const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates

    polygons.forEach((rings) => {
      if (!rings[0]?.length) return

      const bounds = ringBounds(rings[0])
      if (!intersectsBounds(bounds, VISIBLE_GLOBE_BOUNDS)) return

      prepared.push({ ...bounds, rings })
    })
  })

  return prepared
}

function isPointInRing(lon: number, lat: number, ring: LinearRing) {
  let inside = false

  for (let index = 0, previous = ring.length - 1; index < ring.length; previous = index++) {
    const [currentLon, currentLat] = ring[index]
    const [previousLon, previousLat] = ring[previous]
    const crossesLatitude = currentLat > lat !== previousLat > lat

    if (!crossesLatitude) continue

    const crossingLon = ((previousLon - currentLon) * (lat - currentLat)) / (previousLat - currentLat) + currentLon
    if (lon < crossingLon) inside = !inside
  }

  return inside
}

function isLandPoint(lon: number, lat: number, polygons: PreparedPolygon[]) {
  for (const polygon of polygons) {
    if (lon < polygon.minLon || lon > polygon.maxLon || lat < polygon.minLat || lat > polygon.maxLat) {
      continue
    }

    if (!isPointInRing(lon, lat, polygon.rings[0])) continue

    const isInsideHole = polygon.rings.slice(1).some((ring) => isPointInRing(lon, lat, ring))
    if (!isInsideHole) return true
  }

  return false
}

function addLandSamples(
  points: GlobePoint[],
  seen: Set<string>,
  polygons: PreparedPolygon[],
  bounds: Bounds,
  step: number,
  jitterScale: number,
) {
  let seed = 0

  for (let lat = bounds.minLat; lat <= bounds.maxLat; lat += step) {
    for (let lon = bounds.minLon; lon <= bounds.maxLon; lon += step) {
      seed = Math.round(lon * 1000) * 10000 + Math.round(lat * 1000)

      const sampleLon = lon + (seededNoise(seed) - 0.5) * step * jitterScale
      const sampleLat = lat + (seededNoise(seed + 117) - 0.5) * step * jitterScale
      if (!isLandPoint(sampleLon, sampleLat, polygons)) continue

      const key = `${Math.round(sampleLon * 28)}:${Math.round(sampleLat * 28)}`
      if (seen.has(key)) continue

      seen.add(key)
      points.push({ lon: sampleLon, lat: sampleLat })
    }
  }
}

function buildLandPoints(polygons: PreparedPolygon[], isMobile: boolean) {
  const points: GlobePoint[] = []
  const seen = new Set<string>()

  // Single uniform pass — no base/detail split to avoid density seams
  DETAIL_SAMPLE_BOUNDS.forEach((bounds) => {
    addLandSamples(points, seen, polygons, bounds, isMobile ? 0.42 : 0.22, 0.1)
  })

  return points
}

function buildNodePositions() {
  const uniqueNodes = new Map<string, GlobePoint>()

  ARC_PAIRS.flat().forEach((point) => {
    uniqueNodes.set(`${point.lon.toFixed(2)}:${point.lat.toFixed(2)}`, point)
  })

  ORBITAL_NODES.forEach((point) => {
    uniqueNodes.set(`${point.lon.toFixed(2)}:${point.lat.toFixed(2)}`, point)
  })

  const nodePositions = new Float32Array(uniqueNodes.size * 3)

  Array.from(uniqueNodes.values()).forEach((point, index) => {
    const isOrbital = ORBITAL_NODES.includes(point)
    const vector = lonLatToVector(point.lon, point.lat, GLOBE_RADIUS + (isOrbital ? 1.1 : 0.4))
    nodePositions[index * 3] = vector.x
    nodePositions[index * 3 + 1] = vector.y
    nodePositions[index * 3 + 2] = vector.z
  })

  return nodePositions
}

function createLandGeometry(points: GlobePoint[]) {
  const landPositions = new Float32Array(points.length * 3)

  points.forEach((point, index) => {
    const vector = lonLatToVector(point.lon, point.lat, GLOBE_RADIUS + 0.055)
    landPositions[index * 3] = vector.x
    landPositions[index * 3 + 1] = vector.y
    landPositions[index * 3 + 2] = vector.z
  })

  const landGeometry = new THREE.BufferGeometry()
  landGeometry.setAttribute('position', new THREE.BufferAttribute(landPositions, 3))
  return landGeometry
}

export default function GlobeField() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const isMobile = window.matchMedia('(max-width: 760px)').matches
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 130)
    camera.position.set(0, 0, 22.7)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.7))
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mount.appendChild(renderer.domElement)

    const globeGroup = new THREE.Group()
    globeGroup.position.set(isMobile ? 0.55 : 4.75, isMobile ? 0.1 : 0.04, 0)
    globeGroup.rotation.set(BASE_ROTATION_X, BASE_ROTATION_Y, BASE_ROTATION_Z)
    scene.add(globeGroup)

    const darkSphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 0.998, 96, 96)
    const darkSphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x020100,
      depthWrite: true,
    })
    const darkSphere = new THREE.Mesh(darkSphereGeometry, darkSphereMaterial)
    globeGroup.add(darkSphere)

    const surfaceHazeGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.004, 96, 96)
    const surfaceHazeMaterial = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        glowColor: { value: new THREE.Color(DEEP_GOLD) },
      },
      vertexShader: `
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;

        void main() {
          vWorldNormal = normalize(mat3(modelMatrix) * normal);
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;

        void main() {
          vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
          float fresnel = pow(1.0 - max(dot(normalize(vWorldNormal), viewDirection), 0.0), 2.25);
          float face = pow(max(dot(normalize(vWorldNormal), viewDirection), 0.0), 2.6);
          gl_FragColor = vec4(glowColor, fresnel * 0.32 + face * 0.055);
        }
      `,
    })
    const surfaceHaze = new THREE.Mesh(surfaceHazeGeometry, surfaceHazeMaterial)
    globeGroup.add(surfaceHaze)

    const atmosphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.055, 128, 128)
    const atmosphereMaterial = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        glowColor: { value: new THREE.Color(GOLD) },
      },
      vertexShader: `
        varying vec3 vNormal;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying vec3 vNormal;

        void main() {
          float rim = pow(0.84 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.15);
          gl_FragColor = vec4(glowColor, rim * 0.82);
        }
      `,
    })
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
    globeGroup.add(atmosphere)

    const dotTexture = createDotTexture()
    const nodeGeometry = new THREE.BufferGeometry()
    nodeGeometry.setAttribute('position', new THREE.BufferAttribute(buildNodePositions(), 3))
    const nodeGlowMaterial = new THREE.PointsMaterial({
      color: LIGHT_GOLD,
      size: isMobile ? 0.58 : 0.7,
      map: dotTexture,
      transparent: true,
      opacity: 0.28,
      alphaTest: 0.02,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const nodeGlow = new THREE.Points(nodeGeometry, nodeGlowMaterial)
    globeGroup.add(nodeGlow)

    const nodeMaterial = new THREE.PointsMaterial({
      color: LIGHT_GOLD,
      size: isMobile ? 0.19 : 0.25,
      map: dotTexture,
      transparent: true,
      opacity: 1,
      alphaTest: 0.02,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const nodes = new THREE.Points(nodeGeometry, nodeMaterial)
    globeGroup.add(nodes)

    let disposed = false
    let landGeometry: THREE.BufferGeometry | null = null
    let landMaterial: THREE.PointsMaterial | null = null
    let landGlowMaterial: THREE.PointsMaterial | null = null

    const loadLandParticles = async () => {
      try {
        const response = await fetch(LAND_GEOJSON_URL)
        if (!response.ok) throw new Error(`Unable to load land GeoJSON: ${response.status}`)

        const collection = (await response.json()) as LandFeatureCollection
        if (disposed) return

        const landPoints = buildLandPoints(prepareLandPolygons(collection), isMobile)
        landGeometry = createLandGeometry(landPoints)

        landGlowMaterial = new THREE.PointsMaterial({
          color: DEEP_GOLD,
          size: isMobile ? 0.1 : 0.11,
          map: dotTexture,
          transparent: true,
          opacity: 0.22,
          alphaTest: 0.02,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
        const landGlow = new THREE.Points(landGeometry, landGlowMaterial)
        globeGroup.add(landGlow)

        landMaterial = new THREE.PointsMaterial({
          color: LIGHT_GOLD,
          size: isMobile ? 0.042 : 0.036,
          map: dotTexture,
          transparent: true,
          opacity: 1,
          alphaTest: 0.025,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
        const landDots = new THREE.Points(landGeometry, landMaterial)
        globeGroup.add(landDots)
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error(error)
        }
      }
    }

    void loadLandParticles()

    const resize = () => {
      const width = mount.clientWidth || 1
      const height = mount.clientHeight || 1
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    resize()
    window.addEventListener('resize', resize)

    const clock = new THREE.Clock()
    let frameId = 0

    const animate = () => {
      frameId = window.requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()

      // Hero composition only: keep Asia-Pacific locked front-facing, with no continuous spin.
      globeGroup.rotation.y = BASE_ROTATION_Y + Math.sin(elapsed * 0.18) * HERO_DRIFT_Y
      globeGroup.rotation.x = BASE_ROTATION_X + Math.sin(elapsed * 0.14) * HERO_DRIFT_X
      globeGroup.rotation.z = BASE_ROTATION_Z + Math.sin(elapsed * 0.1) * HERO_DRIFT_Z

      if (landMaterial) landMaterial.opacity = 0.94 + Math.sin(elapsed * 0.78) * 0.055
      if (landGlowMaterial) landGlowMaterial.opacity = 0.22 + Math.sin(elapsed * 0.62) * 0.04

      nodeMaterial.opacity = 0.86 + Math.sin(elapsed * 0.95) * 0.12
      nodeGlowMaterial.opacity = 0.22 + Math.sin(elapsed * 0.72) * 0.08
      nodeGlowMaterial.size = (isMobile ? 0.58 : 0.7) + Math.sin(elapsed * 0.7) * 0.06
      atmosphereMaterial.uniforms.glowColor.value.setHex(elapsed % 7 > 3.5 ? LIGHT_GOLD : GOLD)

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      disposed = true
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)

      darkSphereGeometry.dispose()
      darkSphereMaterial.dispose()
      surfaceHazeGeometry.dispose()
      surfaceHazeMaterial.dispose()
      atmosphereGeometry.dispose()
      atmosphereMaterial.dispose()
      nodeGeometry.dispose()
      nodeMaterial.dispose()
      nodeGlowMaterial.dispose()
      landGeometry?.dispose()
      landMaterial?.dispose()
      landGlowMaterial?.dispose()
      dotTexture.dispose()
      renderer.dispose()

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={mountRef} aria-hidden="true" className="hero-globe-canvas" />
}