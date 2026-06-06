'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { Stage3D } from '@/components/three/stage3d'

function makeWingGeometry() {
  const s = new THREE.Shape()

  // Ala completa de un lado, conectada en una sola silueta.
  // El borde interno queda en x=0: esa es la bisagra real.
  s.moveTo(0, 0.46)
  s.bezierCurveTo(0.16, 0.68, 0.53, 0.72, 0.76, 0.42)
  s.bezierCurveTo(0.98, 0.13, 0.78, -0.08, 0.53, -0.03)
  s.bezierCurveTo(0.66, -0.18, 0.67, -0.42, 0.49, -0.57)
  s.bezierCurveTo(0.29, -0.75, 0.09, -0.58, 0, -0.45)
  s.closePath()

  const g = new THREE.ShapeGeometry(s, 72)
  g.computeVertexNormals()
  return g
}

function makeInnerRootGeometry() {
  const s = new THREE.Shape()

  // Pequeña raíz visual pegada al cuerpo. Evita que, al escalar o animar,
  // se perciba hueco entre ala y abdomen.
  s.moveTo(0, 0.43)
  s.bezierCurveTo(0.055, 0.32, 0.06, -0.32, 0, -0.46)
  s.lineTo(0, 0.43)
  s.closePath()

  const g = new THREE.ShapeGeometry(s, 24)
  g.computeVertexNormals()
  return g
}

function makeEllipseGeometry(
  x: number,
  y: number,
  rx: number,
  ry: number,
  rotation = 0,
  segments = 32,
) {
  const s = new THREE.Shape()
  s.absellipse(x, y, rx, ry, 0, Math.PI * 2, false, rotation)

  const g = new THREE.ShapeGeometry(s, segments)
  g.computeVertexNormals()
  return g
}

function makeVeinGeometry(
  start: [number, number, number],
  control: [number, number, number],
  end: [number, number, number],
  radius = 0.004,
) {
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(...start),
    new THREE.Vector3(...control),
    new THREE.Vector3(...end),
  )

  const g = new THREE.TubeGeometry(curve, 22, radius, 6, false)
  g.computeVertexNormals()
  return g
}

function makeAntennaGeometry(side: -1 | 1) {
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(side * 0.025, 0.39, 0.08),
    new THREE.Vector3(side * 0.1, 0.55, 0.08),
    new THREE.Vector3(side * 0.2, 0.58, 0.045),
  )

  const g = new THREE.TubeGeometry(curve, 28, 0.0045, 6, false)
  g.computeVertexNormals()
  return g
}

type ButterflyAssets = {
  wing: THREE.ShapeGeometry
  root: THREE.ShapeGeometry
  edge: THREE.ShapeGeometry
  highlights: THREE.ShapeGeometry[]
  spots: THREE.ShapeGeometry[]
  veins: THREE.TubeGeometry[]
  antennaLeft: THREE.TubeGeometry
  antennaRight: THREE.TubeGeometry
}

function makeButterflyAssets(): ButterflyAssets {
  return {
    wing: makeWingGeometry(),
    root: makeInnerRootGeometry(),
    edge: makeWingGeometry(),

    highlights: [
      makeEllipseGeometry(0.37, 0.31, 0.2, 0.045, -0.38, 36),
      makeEllipseGeometry(0.35, -0.39, 0.16, 0.04, -0.7, 36),
    ],

    spots: [
      makeEllipseGeometry(0.58, 0.33, 0.055, 0.075, -0.35),
      makeEllipseGeometry(0.43, 0.13, 0.034, 0.052, 0.18),
      makeEllipseGeometry(0.58, -0.13, 0.032, 0.044, 0.65),
      makeEllipseGeometry(0.43, -0.43, 0.058, 0.078, -0.42),
      makeEllipseGeometry(0.24, -0.56, 0.034, 0.048, 0.2),
    ],

    veins: [
      makeVeinGeometry([0.018, 0.32, 0.027], [0.22, 0.5, 0.03], [0.68, 0.42, 0.027], 0.0044),
      makeVeinGeometry([0.018, 0.2, 0.027], [0.25, 0.25, 0.03], [0.68, 0.19, 0.027], 0.0038),
      makeVeinGeometry([0.018, 0.08, 0.027], [0.24, 0.04, 0.03], [0.55, -0.04, 0.027], 0.0036),
      makeVeinGeometry([0.018, -0.1, 0.027], [0.25, -0.11, 0.03], [0.59, -0.28, 0.027], 0.0038),
      makeVeinGeometry([0.018, -0.23, 0.027], [0.18, -0.41, 0.03], [0.42, -0.62, 0.027], 0.0038),
      makeVeinGeometry([0.018, -0.34, 0.027], [0.1, -0.47, 0.03], [0.22, -0.62, 0.027], 0.0034),
    ],

    antennaLeft: makeAntennaGeometry(-1),
    antennaRight: makeAntennaGeometry(1),
  }
}

type ButterflyMaterials = {
  wing: THREE.MeshStandardMaterial
  edge: THREE.MeshStandardMaterial
  root: THREE.MeshStandardMaterial
  spot: THREE.MeshStandardMaterial
  vein: THREE.MeshStandardMaterial
  highlight: THREE.MeshStandardMaterial
  body: THREE.MeshStandardMaterial
  eye: THREE.MeshStandardMaterial
}

function makeButterflyMaterials(color: string): ButterflyMaterials {
  const base = new THREE.Color(color)
  const emissive = new THREE.Color(color).multiplyScalar(0.65)

  return {
    wing: new THREE.MeshStandardMaterial({
      color: base,
      emissive,
      emissiveIntensity: 0.32,
      roughness: 0.42,
      metalness: 0,
      transparent: true,
      opacity: 0.94,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),

    edge: new THREE.MeshStandardMaterial({
      color: '#6b3d0d',
      emissive: '#2d1603',
      emissiveIntensity: 0.12,
      roughness: 0.7,
      metalness: 0,
      transparent: true,
      opacity: 0.88,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),

    root: new THREE.MeshStandardMaterial({
      color: base,
      emissive,
      emissiveIntensity: 0.35,
      roughness: 0.45,
      metalness: 0,
      transparent: true,
      opacity: 0.96,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),

    spot: new THREE.MeshStandardMaterial({
      color: '#70410d',
      emissive: '#1c0d02',
      emissiveIntensity: 0.08,
      roughness: 0.74,
      metalness: 0,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),

    vein: new THREE.MeshStandardMaterial({
      color: '#8a5514',
      emissive: '#3a1e04',
      emissiveIntensity: 0.08,
      roughness: 0.7,
      metalness: 0,
      transparent: true,
      opacity: 0.46,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),

    highlight: new THREE.MeshStandardMaterial({
      color: '#fff0a5',
      emissive: '#ffd75c',
      emissiveIntensity: 0.22,
      roughness: 0.3,
      metalness: 0,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),

    body: new THREE.MeshStandardMaterial({
      color: '#2c1a07',
      emissive: '#120803',
      emissiveIntensity: 0.14,
      roughness: 0.55,
      metalness: 0.04,
    }),

    eye: new THREE.MeshStandardMaterial({
      color: '#050301',
      roughness: 0.32,
      metalness: 0.05,
    }),
  }
}

function WingHalf({
  assets,
  materials,
  mirror = false,
}: {
  assets: ButterflyAssets
  materials: ButterflyMaterials
  mirror?: boolean
}) {
  return (
    <group scale={mirror ? [-1, 1, 1] : [1, 1, 1]}>
      {/* borde exterior: un poco más grande, pero mantiene x=0 como bisagra */}
      <mesh
        geometry={assets.edge}
        material={materials.edge}
        scale={[1.025, 1.025, 1]}
        position={[0, 0, -0.006]}
        renderOrder={1}
      />

      {/* ala principal continua */}
      <mesh
        geometry={assets.wing}
        material={materials.wing}
        position={[0, 0, 0]}
        renderOrder={2}
      />

      {/* raíz pegada al cuerpo para evitar huecos visuales */}
      <mesh
        geometry={assets.root}
        material={materials.root}
        position={[0, 0, 0.014]}
        renderOrder={3}
      />

      {assets.highlights.map((geometry, i) => (
        <mesh
          key={`highlight-${i}`}
          geometry={geometry}
          material={materials.highlight}
          position={[0, 0, 0.02]}
          renderOrder={4}
        />
      ))}

      {assets.spots.map((geometry, i) => (
        <mesh
          key={`spot-${i}`}
          geometry={geometry}
          material={materials.spot}
          position={[0, 0, 0.024]}
          renderOrder={5}
        />
      ))}

      {assets.veins.map((geometry, i) => (
        <mesh
          key={`vein-${i}`}
          geometry={geometry}
          material={materials.vein}
          renderOrder={6}
        />
      ))}
    </group>
  )
}

export interface Butterfly3DProps {
  color?: string
  flapSpeed?: number
  phase?: number
}

/**
 * Mariposa amarilla con alas conectadas.
 * La clave: las alas nunca rotan tanto como para verse de canto.
 */
export function Butterfly3D({
  color = '#f4c64a',
  flapSpeed = 8,
  phase = 0,
}: Butterfly3DProps) {
  const left = useRef<THREE.Group>(null)
  const right = useRef<THREE.Group>(null)

  const assets = useMemo(() => makeButterflyAssets(), [])
  const materials = useMemo(() => makeButterflyMaterials(color), [color])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * flapSpeed + phase

    // Antes llegaba casi a 1.2 rad; eso hacía que el ala quedara de canto.
    // Este rango mantiene la silueta completa visible.
    const flap = 0.12 + (Math.sin(t) * 0.5 + 0.5) * 0.5
    const micro = Math.sin(t * 2.1 + phase) * 0.025

    if (left.current) {
      left.current.rotation.y = flap - micro
      left.current.rotation.z = Math.sin(t * 0.42 + phase) * 0.018
    }

    if (right.current) {
      right.current.rotation.y = -flap + micro
      right.current.rotation.z = -Math.sin(t * 0.42 + phase) * 0.018
    }
  })

  return (
    <group>
      <group ref={right}>
        <WingHalf assets={assets} materials={materials} />
      </group>

      <group ref={left}>
        <WingHalf assets={assets} materials={materials} mirror />
      </group>

      {/* cuerpo más ancho y más adelantado en Z para tapar siempre la unión */}
      <mesh material={materials.body} position={[0, -0.08, 0.075]} renderOrder={20}>
        <capsuleGeometry args={[0.048, 0.66, 8, 18]} />
      </mesh>

      <mesh material={materials.body} position={[0, -0.31, 0.078]} renderOrder={21}>
        <capsuleGeometry args={[0.055, 0.28, 8, 18]} />
      </mesh>

      <mesh material={materials.body} position={[0, 0.12, 0.082]} renderOrder={22}>
        <sphereGeometry args={[0.07, 16, 16]} />
      </mesh>

      <mesh material={materials.body} position={[0, 0.37, 0.085]} renderOrder={23}>
        <sphereGeometry args={[0.058, 16, 16]} />
      </mesh>

      <mesh material={materials.eye} position={[-0.027, 0.387, 0.132]} renderOrder={24}>
        <sphereGeometry args={[0.011, 8, 8]} />
      </mesh>

      <mesh material={materials.eye} position={[0.027, 0.387, 0.132]} renderOrder={24}>
        <sphereGeometry args={[0.011, 8, 8]} />
      </mesh>

      <mesh geometry={assets.antennaLeft} material={materials.body} renderOrder={25} />
      <mesh geometry={assets.antennaRight} material={materials.body} renderOrder={25} />

      <mesh material={materials.body} position={[-0.2, 0.58, 0.045]} renderOrder={26}>
        <sphereGeometry args={[0.012, 8, 8]} />
      </mesh>

      <mesh material={materials.body} position={[0.2, 0.58, 0.045]} renderOrder={26}>
        <sphereGeometry args={[0.012, 8, 8]} />
      </mesh>
    </group>
  )
}

function Drifter({
  curve,
  color,
  speed,
  phase,
  scale = 1,
}: {
  curve: THREE.CatmullRomCurve3
  color: string
  speed: number
  phase: number
  scale?: number
}) {
  const ref = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!ref.current) return

    const elapsed = clock.getElapsedTime()
    const t = (elapsed * speed + phase) % 1
    const p = curve.getPointAt(t)
    const tangent = curve.getTangentAt(t)

    const hover = Math.sin(elapsed * 1.45 + phase * 9) * 0.11
    const yaw = THREE.MathUtils.clamp(tangent.x * 0.32, -0.24, 0.24)

    ref.current.position.set(p.x, p.y + hover, p.z)

    // Sigue siendo frontal. No rota tanto como para perder la silueta.
    ref.current.rotation.x = -0.08 + Math.sin(elapsed * 1.1 + phase * 3) * 0.045
    ref.current.rotation.y = yaw + Math.sin(elapsed * 0.8 + phase * 4) * 0.12
    ref.current.rotation.z = Math.sin(elapsed * 1.55 + phase * 6) * 0.11
  })

  return (
    <group ref={ref} scale={scale}>
      <Butterfly3D
        color={color}
        phase={phase * 12}
        flapSpeed={7.2 + (phase % 1) * 3.8}
      />
    </group>
  )
}

const PALETTE = ['#f4c64a', '#efb52f', '#f7d06a', '#e7a92c', '#f8d879']

function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453123
  return x - Math.floor(x)
}

function Swarm({ count = 8, spread = 5 }: { count?: number; spread?: number }) {
  const drifters = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const pts: THREE.Vector3[] = []
      const segs = 7

      const cx = (pseudoRandom(i + 1) - 0.5) * spread
      const cy = (pseudoRandom(i + 9) - 0.42) * spread * 0.5
      // Bias depth AWAY from the camera so the swarm sits in the background and
      // never looms over the title/text.
      const cz = -1.4 - pseudoRandom(i + 17) * spread * 0.45

      const rx = 0.7 + pseudoRandom(i + 23) * 1.0
      const ry = 0.4 + pseudoRandom(i + 31) * 0.55
      const rz = 0.3 + pseudoRandom(i + 43) * 0.5

      for (let s = 0; s < segs; s++) {
        const a = (s / segs) * Math.PI * 2 + pseudoRandom(i * 13 + s) * 0.55
        const wobble = pseudoRandom(i * 19 + s + 5) - 0.5

        pts.push(
          new THREE.Vector3(
            cx + Math.cos(a) * rx * (0.8 + pseudoRandom(i + s + 2) * 0.36),
            cy + Math.sin(a * 1.35) * ry + wobble * 0.16,
            cz + Math.sin(a) * rz * (0.75 + pseudoRandom(i + s + 8) * 0.42),
          ),
        )
      }

      const curve = new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.55)
      curve.arcLengthDivisions = 140

      return {
        curve,
        color: PALETTE[i % PALETTE.length],
        speed: 0.024 + pseudoRandom(i + 61) * 0.045,
        phase: pseudoRandom(i + 79),

        // Pequeñas y ambientales: acompañan sin tapar el texto.
        scale: 0.5 + pseudoRandom(i + 97) * 0.3,
      }
    })
  }, [count, spread])

  return (
    <>
      {drifters.map((d, i) => (
        <Drifter key={i} {...d} />
      ))}
    </>
  )
}

export function ButterfliesCanvas({
  count = 8,
  spread = 5,
  className,
}: {
  count?: number
  spread?: number
  className?: string
}) {
  return (
    <Stage3D
      className={className}
      shadows={false}
      camera={{ position: [0, 0, 6.6], fov: 36 }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.95} />

      <directionalLight position={[3.5, 5, 5]} intensity={1.25} color="#fff3d4" />
      <directionalLight position={[-4.5, -2.5, 3]} intensity={0.34} color="#ffd89b" />
      <pointLight position={[0, 1.8, 3.2]} intensity={0.38} color="#ffe8a6" />

      <Swarm count={count} spread={spread} />

      <EffectComposer>
        <Bloom
          intensity={0.34}
          luminanceThreshold={0.64}
          luminanceSmoothing={0.42}
          radius={0.5}
          mipmapBlur
        />
      </EffectComposer>
    </Stage3D>
  )
}