'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ButterflyShape } from '@/components/butterfly'

interface SwarmButterfly {
  id: number
  size: number
  top: number
  left: number
  delay: number
  duration: number
  rise: number
  drift: number
  color: string
}

const COLORS = ['#f4c542', '#e9b22e', '#f6d167', '#d99a1f', '#f2c14e']

/**
 * A localized layer of García Márquez–style yellow butterflies that drift
 * within their parent container (which must be `relative`). Deliberately sparse
 * and slow so it accents the page without distracting from reading.
 * Renders nothing when the user prefers reduced motion.
 */
export function ButterflySwarm({
  count = 6,
  opacity = 0.85,
  seed = 0,
}: {
  count?: number
  opacity?: number
  seed?: number
}) {
  const reduced = useReducedMotion()
  // Render only after mount so SSR and first client paint agree (the swarm is a
  // purely decorative, client-only layer). Prevents hydration mismatches when
  // the client's reduced-motion preference differs from the server default.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const butterflies = useMemo<SwarmButterfly[]>(() => {
    // Deterministic pseudo-random so SSR and client match.
    const rnd = (n: number) => {
      const x = Math.sin((n + 1) * 12.9898 + seed * 78.233) * 43758.5453
      return x - Math.floor(x)
    }
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      size: 22 + Math.round(rnd(i) * 30),
      top: 8 + Math.round(rnd(i + 11) * 78),
      left: Math.round(rnd(i + 23) * 88),
      delay: rnd(i + 31) * 8,
      duration: 14 + rnd(i + 41) * 12,
      rise: -40 - rnd(i + 53) * 90,
      drift: 20 + rnd(i + 61) * 60,
      color: COLORS[i % COLORS.length],
    }))
  }, [count, seed])

  if (!mounted || reduced) return null

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {butterflies.map((b) => (
        <motion.div
          key={b.id}
          className="absolute"
          style={{ top: `${b.top}%`, left: `${b.left}%`, width: b.size, height: b.size }}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{
            x: [0, b.drift, b.drift * 0.4, b.drift, 0],
            y: [0, b.rise * 0.6, b.rise, b.rise * 0.5, 0],
            opacity: [0, opacity, opacity, opacity, 0],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: 'easeInOut',
            times: [0, 0.2, 0.5, 0.8, 1],
          }}
        >
          <motion.div
            animate={{ rotate: [0, 7, -5, 4, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ButterflyShape size={b.size} color={b.color} flapSpeed={0.42} />
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}
