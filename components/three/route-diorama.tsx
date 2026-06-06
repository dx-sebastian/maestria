'use client'

import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, RoundedBox, ContactShadows, Float } from '@react-three/drei'
import * as THREE from 'three'
import { DIARY, type DayId } from '@/data/diario'
import { Stage3D } from '@/components/three/stage3d'
import { StudioEnv, KeyLight } from '@/components/three/lighting'

const SPAN_X = 9
const SPAN_Z = 5.4

function toWorld([cx, cy]: [number, number]): [number, number] {
  return [(cx / 100 - 0.5) * SPAN_X, (cy / 100 - 0.5) * SPAN_Z]
}

/**
 * Vivid hex accents per day for the 3D markers. (The CSS palette is authored in
 * oklch — which THREE.Color can't parse — and is intentionally muted for text;
 * slightly more saturated values read better as little 3D beads.)
 */
const ACCENT3D: Record<DayId, string> = {
  lunes: '#c47a3a',
  martes: '#5f76a8',
  miercoles: '#5f8a55',
  jueves: '#3f8f63',
  viernes: '#c98a3c',
}

function Marker({
  x,
  z,
  index,
  label,
  station,
  accent,
  onSelect,
  id,
}: {
  x: number
  z: number
  index: number
  label: string
  station: string
  accent: string
  id: DayId
  onSelect: (id: DayId) => void
}) {
  const ref = useRef<THREE.Group>(null)
  const [hover, setHover] = useState(false)
  useFrame(({ clock }, delta) => {
    if (!ref.current) return
    const target = hover ? 1.2 : 1
    ref.current.scale.lerp(new THREE.Vector3(target, target, target), Math.min(1, delta * 8))
    ref.current.position.y = 0.05 + Math.sin(clock.getElapsedTime() * 1.5 + index) * 0.04
  })
  return (
    <group position={[x, 0.05, z]}>
      {/* glow disc on the ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.42, 32]} />
        <meshBasicMaterial color={accent} transparent opacity={hover ? 0.4 : 0.22} />
      </mesh>
      <group
        ref={ref}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHover(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHover(false)
          document.body.style.cursor = 'auto'
        }}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(id)
        }}
      >
        {/* post */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.045, 0.6, 12]} />
          <meshStandardMaterial color="#6b4a28" roughness={0.6} />
        </mesh>
        {/* head */}
        <mesh position={[0, 0.74, 0]} castShadow>
          <sphereGeometry args={[0.18, 28, 28]} />
          <meshStandardMaterial
            color={accent}
            roughness={0.45}
            metalness={0}
            emissive={accent}
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>
      <Html
        position={[0, 1.25, 0]}
        center
        distanceFactor={9}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <div style={{ textAlign: 'center', whiteSpace: 'nowrap', transform: 'translateY(-50%)' }}>
          <div
            style={{
              fontFamily: 'var(--font-fraunces), serif',
              fontWeight: 600,
              fontSize: 19,
              color: 'var(--ink)',
            }}
          >
            {index}. {label}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-inter), sans-serif',
              fontSize: 11.5,
              letterSpacing: '0.04em',
              color: 'var(--ink-soft)',
            }}
          >
            {station}
          </div>
        </div>
      </Html>
    </group>
  )
}

function Route({ points }: { points: THREE.Vector3[] }) {
  const geo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5)
    return new THREE.TubeGeometry(curve, 140, 0.04, 10, false)
  }, [points])
  return (
    <mesh geometry={geo} position={[0, 0.08, 0]}>
      <meshStandardMaterial color="#a9772f" roughness={0.5} emissive="#7a5418" emissiveIntensity={0.2} />
    </mesh>
  )
}

function Terrain() {
  // soft mossy mounds scattered to suggest a small territory
  const mounds = useMemo(
    () => [
      { p: [-3.2, 0, 1.4], s: 1.3, c: '#8a9a5b' },
      { p: [2.6, 0, -1.6], s: 1.0, c: '#9aa766' },
      { p: [3.6, 0, 1.7], s: 0.8, c: '#7e8e52' },
      { p: [-1.2, 0, -1.9], s: 0.7, c: '#94a35f' },
    ],
    [],
  )
  return (
    <group>
      {/* clay base slab */}
      <RoundedBox args={[SPAN_X + 2.4, 0.6, SPAN_Z + 2.2]} radius={0.18} smoothness={4} position={[0, -0.3, 0]} receiveShadow castShadow>
        <meshStandardMaterial color="#ece2c7" roughness={0.95} />
      </RoundedBox>
      {/* top surface highlight */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
        <planeGeometry args={[SPAN_X + 2.2, SPAN_Z + 2]} />
        <meshStandardMaterial color="#efe7cf" roughness={0.96} />
      </mesh>
      {mounds.map((m, i) => (
        <mesh key={i} position={m.p as [number, number, number]} scale={[m.s, m.s * 0.4, m.s]} castShadow receiveShadow>
          <sphereGeometry args={[1, 24, 16]} />
          <meshStandardMaterial color={m.c} roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

function DioramaContent({ onSelect }: { onSelect: (id: DayId) => void }) {
  const group = useRef<THREE.Group>(null)
  const nodes = useMemo(
    () =>
      DIARY.map((d) => {
        const [x, z] = toWorld(d.coord)
        return { id: d.id, x, z, index: d.index, label: d.label, station: d.station, accent: ACCENT3D[d.id] }
      }),
    [],
  )
  const points = useMemo(
    () => nodes.map((n) => new THREE.Vector3(n.x, 0.14, n.z)),
    [nodes],
  )

  useFrame(({ clock }) => {
    // gentle sway rather than a full spin — keeps labels stable and legible
    if (group.current) group.current.rotation.y = -0.1 + Math.sin(clock.getElapsedTime() * 0.26) * 0.16
  })

  return (
    <Float speed={1} rotationIntensity={0.12} floatIntensity={0.25}>
      <group ref={group}>
        <Terrain />
        <Route points={points} />
        {nodes.map((n) => (
          <Marker key={n.id} {...n} onSelect={onSelect} />
        ))}
      </group>
    </Float>
  )
}

export function RouteDiorama({
  onSelect,
  fallback,
}: {
  onSelect: (id: DayId) => void
  fallback?: React.ReactNode
}) {
  return (
    <Stage3D
      className="h-full w-full"
      camera={{ position: [0, 6.2, 7.4], fov: 34 }}
      dpr={[1, 2]}
      fallback={fallback}
    >
      <KeyLight intensity={1.5} position={[6, 10, 6]} />
      <StudioEnv />
      <DioramaContent onSelect={onSelect} />
      <ContactShadows position={[0, -0.02, 0]} opacity={0.4} scale={16} blur={2.4} far={5} frames={60} color="#3a2c12" />
    </Stage3D>
  )
}
