'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, ContactShadows, Float } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { Stage3D } from '@/components/three/stage3d'
import { StudioEnv, KeyLight } from '@/components/three/lighting'
import { Butterfly3D } from '@/components/three/butterflies'

const W = 2.5
const H = 3.95
const T = 0.55

/** A canvas-drawn cover face: gold border, emblem, title and the author name. */
function useCoverTexture() {
  return useMemo(() => {
    if (typeof document === 'undefined') return null
    const w = 640
    const h = 1010
    const cv = document.createElement('canvas')
    cv.width = w
    cv.height = h
    const ctx = cv.getContext('2d')
    if (!ctx) return null
    const gold = '#d9a843'
    const goldSoft = '#eccd8a'
    ctx.clearRect(0, 0, w, h)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // double gold frame
    ctx.strokeStyle = gold
    ctx.lineWidth = 3
    ctx.strokeRect(48, 48, w - 96, h - 96)
    ctx.lineWidth = 1
    ctx.strokeRect(64, 64, w - 128, h - 128)

    // emblem: ring + butterfly
    const ey = 330
    ctx.strokeStyle = gold
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(w / 2, ey, 104, 0, Math.PI * 2)
    ctx.stroke()
    ctx.fillStyle = gold
    const wing = (dx: number, rot: number) => {
      ctx.save()
      ctx.translate(w / 2, ey)
      ctx.rotate(rot)
      ctx.beginPath()
      ctx.ellipse(dx, -8, 32, 46, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(dx * 0.82, 36, 22, 30, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
    wing(-32, -0.18)
    wing(32, 0.18)
    ctx.fillStyle = '#2a1a08'
    ctx.fillRect(w / 2 - 3.5, ey - 44, 7, 92)

    // eyebrow
    try { ctx.letterSpacing = '7px' } catch {}
    ctx.fillStyle = gold
    ctx.font = '600 22px Georgia, "Times New Roman", serif'
    ctx.fillText('DIARIO DE CAMPO', w / 2, 512)
    try { ctx.letterSpacing = '0px' } catch {}

    // title
    ctx.fillStyle = goldSoft
    ctx.font = '600 80px Georgia, "Times New Roman", serif'
    ctx.fillText('Diario Lúdico', w / 2, 592)

    // tagline
    ctx.fillStyle = gold
    ctx.font = 'italic 30px Georgia, "Times New Roman", serif'
    ctx.fillText('Habitar la escuela desde la lúdica', w / 2, 648)

    // rule
    ctx.strokeStyle = gold
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(w / 2 - 50, 740)
    ctx.lineTo(w / 2 + 50, 740)
    ctx.stroke()

    // author
    ctx.fillStyle = '#f4ddae'
    ctx.font = '600 56px Georgia, "Times New Roman", serif'
    ctx.fillText('Santiago Londoño', w / 2, 806)
    try { ctx.letterSpacing = '4px' } catch {}
    ctx.fillStyle = gold
    ctx.font = '600 20px Georgia, "Times New Roman", serif'
    ctx.fillText('DOCENTE · LENGUA Y FILOSOFÍA', w / 2, 858)
    try { ctx.letterSpacing = '0px' } catch {}

    const tex = new THREE.CanvasTexture(cv)
    tex.anisotropy = 8
    tex.colorSpace = THREE.SRGBColorSpace
    tex.needsUpdate = true
    return tex
  }, [])
}

function CoverLabel() {
  const tex = useCoverTexture()
  if (!tex) return null
  return (
    <mesh position={[W / 2, 0, 0.06]}>
      <planeGeometry args={[W * 0.94, H * 0.94]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  )
}

function EmergingButterflies({ open }: { open: React.RefObject<number> }) {
  const g = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!g.current) return
    const o = open.current ?? 0
    g.current.visible = o > 0.3
    const t = clock.getElapsedTime()
    g.current.children.forEach((c, i) => {
      const rise = Math.max(0, o - 0.3) / 0.7
      // Emerge from the lower half of the book and stay within the camera's
      // visible frame (cap ~y = 1.3) so the swarm never escapes the canvas.
      c.position.y = -0.6 + rise * (0.5 + i * 0.28) + Math.sin(t * 1.3 + i) * 0.14
      c.position.x = 0.1 + Math.sin(t * 0.7 + i * 2) * (0.55 + i * 0.22)
      c.position.z = 0.6 + Math.cos(t * 0.6 + i) * 0.4
      const s = (0.62 + rise * 0.45) * 0.95
      c.scale.setScalar(s)
    })
  })
  return (
    <group ref={g}>
      {[0, 1, 2, 3, 4].map((i) => (
        <group key={i}>
          <Butterfly3D color={i % 2 ? '#efb52f' : '#f6d06a'} phase={i * 2.1} flapSpeed={9 + i} />
        </group>
      ))}
    </group>
  )
}

function Book({ open, onOpen }: { open: boolean; onOpen: () => void }) {
  const amt = useRef(0)
  const cover = useRef<THREE.Group>(null)
  const [hover, setHover] = useState(false)

  useFrame((_, delta) => {
    const target = open ? 1 : 0
    amt.current += (target - amt.current) * Math.min(1, delta * 4)
    const o = THREE.MathUtils.clamp(amt.current, 0, 1)
    const ease = 1 - Math.pow(1 - o, 3)
    if (cover.current) cover.current.rotation.y = -ease * 2.2
  })

  useEffect(() => {
    document.body.style.cursor = hover && !open ? 'pointer' : 'auto'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [hover, open])

  return (
    <group
      rotation={[-0.05, 0.14, 0]}
      position={[0.05, 0, 0]}
      onClick={(e) => {
        e.stopPropagation()
        if (!open) onOpen()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHover(true)
      }}
      onPointerOut={() => setHover(false)}
    >
      {/* back cover */}
      <RoundedBox args={[W, H, 0.1]} radius={0.06} smoothness={6} position={[0, 0, -T / 2]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#6d4527" roughness={0.55} clearcoat={0.25} clearcoatRoughness={0.5} />
      </RoundedBox>

      {/* page block */}
      <RoundedBox args={[W * 0.95, H * 0.96, T * 0.92]} radius={0.02} smoothness={4} position={[0.04, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#efe6cf" roughness={0.92} />
      </RoundedBox>
      {/* fore-edge page striations */}
      <mesh position={[W / 2 - 0.02, 0, 0]}>
        <boxGeometry args={[0.04, H * 0.92, T * 0.88]} />
        <meshStandardMaterial color="#e3d8b9" roughness={0.96} />
      </mesh>

      {/* spine */}
      <RoundedBox args={[0.18, H, T + 0.12]} radius={0.06} smoothness={6} position={[-W / 2, 0, 0]} castShadow>
        <meshPhysicalMaterial color="#5c391f" roughness={0.5} clearcoat={0.3} />
      </RoundedBox>

      {/* front cover, hinged at the spine */}
      <group ref={cover} position={[-W / 2, 0, T / 2 + 0.01]}>
        <RoundedBox args={[W, H, 0.1]} radius={0.06} smoothness={6} position={[W / 2, 0, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial color="#7a4a28" roughness={0.46} clearcoat={0.4} clearcoatRoughness={0.38} />
        </RoundedBox>
        <CoverLabel />
      </group>

      <EmergingButterflies open={amt} />
    </group>
  )
}

export function BookScene({ open, onOpen }: { open: boolean; onOpen: () => void }) {
  return (
    <Stage3D
      className="h-full w-full"
      camera={{ position: [0.1, 0.5, 6.7], fov: 37 }}
      dpr={[1, 2]}
    >
      <KeyLight intensity={2} position={[5, 9, 6]} />
      <StudioEnv />
      <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.35} floatingRange={[-0.04, 0.04]}>
        <Book open={open} onOpen={onOpen} />
      </Float>
      <ContactShadows position={[0, -2.15, 0]} opacity={0.4} scale={10} blur={2.8} far={4.5} frames={80} color="#2a1c0c" />
      <EffectComposer>
        <Bloom intensity={0.32} luminanceThreshold={0.72} luminanceSmoothing={0.4} radius={0.5} mipmapBlur />
      </EffectComposer>
    </Stage3D>
  )
}
