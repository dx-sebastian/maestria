'use client'

import { Canvas, type CanvasProps } from '@react-three/fiber'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext('webgl') || c.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

interface Stage3DProps {
  children: ReactNode
  className?: string
  camera?: CanvasProps['camera']
  dpr?: CanvasProps['dpr']
  /** Shown during SSR / before the canvas mounts / when WebGL is unavailable. */
  fallback?: ReactNode
  /** How early (before entering the viewport) to spin up the canvas. */
  rootMargin?: string
  shadows?: boolean
  onCreatedFog?: string
}

/**
 * A performance- and hydration-safe wrapper around an R3F <Canvas>.
 * - Renders a fallback during SSR and first client paint (no hydration mismatch).
 * - Only mounts the WebGL canvas once it nears the viewport.
 * - Pauses the render loop while off-screen (frameloop: never) to save the GPU.
 * - Falls back gracefully when WebGL is unavailable.
 */
export function Stage3D({
  children,
  className,
  camera,
  dpr = [1, 2],
  fallback = null,
  rootMargin = '300px',
  shadows = true,
}: Stage3DProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [supported, setSupported] = useState(true)
  const [shown, setShown] = useState(false)
  const [active, setActive] = useState(false)

  useEffect(() => {
    setMounted(true)
    setSupported(hasWebGL())
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting)
        if (entry.isIntersecting) setShown(true)
      },
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])

  const ready = mounted && supported && shown

  return (
    <div ref={ref} className={cn('relative', className)}>
      {ready ? (
        <Canvas
          shadows={shadows}
          dpr={dpr}
          camera={camera}
          frameloop={active ? 'always' : 'never'}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            preserveDrawingBuffer: true,
          }}
          className="!absolute inset-0"
        >
          {children}
        </Canvas>
      ) : null}
      {/* fallback stays until canvas is ready; for WebGL-less clients it remains */}
      {!ready ? <div className="absolute inset-0">{fallback}</div> : null}
    </div>
  )
}
