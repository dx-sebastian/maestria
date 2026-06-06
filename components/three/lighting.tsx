'use client'

import { Environment, Lightformer } from '@react-three/drei'

/**
 * A warm studio image-based environment built entirely from Lightformers
 * (no external HDRI files). Gives materials soft, believable specular highlights.
 */
export function StudioEnv({ background = false }: { background?: boolean }) {
  return (
    <Environment resolution={256} background={background}>
      {/* warm key panel above */}
      <Lightformer
        form="rect"
        intensity={3.4}
        position={[0, 6, 1]}
        scale={[12, 6, 1]}
        rotation={[Math.PI / 2, 0, 0]}
        color="#fff0d6"
      />
      {/* warm fill from the left */}
      <Lightformer
        form="rect"
        intensity={1.6}
        position={[-6, 2, 3]}
        scale={[6, 8, 1]}
        rotation={[0, Math.PI / 2, 0]}
        color="#ffd49b"
      />
      {/* cool rim from the right for separation */}
      <Lightformer
        form="rect"
        intensity={1.1}
        position={[6, 2, -1]}
        scale={[6, 8, 1]}
        rotation={[0, -Math.PI / 2, 0]}
        color="#cfe0ff"
      />
      {/* soft glow behind */}
      <Lightformer
        form="ring"
        intensity={1.2}
        position={[0, 1, -6]}
        scale={[8, 8, 1]}
        color="#f6c66a"
      />
    </Environment>
  )
}

/** Key + fill directional lights with a tuned shadow camera for small scenes. */
export function KeyLight({
  intensity = 1.7,
  position = [5, 9, 6] as [number, number, number],
}) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight
        position={position}
        intensity={intensity}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
      />
      <directionalLight position={[-6, 4, -3]} intensity={0.35} color="#ffd9a0" />
    </>
  )
}
