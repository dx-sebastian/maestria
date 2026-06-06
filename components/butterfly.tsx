'use client'

import { useId } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

/**
 * A single hand-drawn yellow butterfly rendered as animated SVG — an homage to
 * the amarillas butterflies of García Márquez. Wings flap continuously; no
 * external image, fully transparent, themeable by `color`.
 */
function ButterflyShape({
  size = 64,
  color = '#f4c542',
  flapSpeed = 0.42,
}: {
  size?: number
  color?: string
  flapSpeed?: number
}) {
  const reduced = useReducedMotion()
  const gid = `wg-${useId().replace(/:/g, '')}`
  const dark = `color-mix(in oklch, ${color} 62%, #6b4e16)`
  const light = `color-mix(in oklch, ${color} 60%, white)`

  // Wings flap by scaling on X around the body axis.
  const wingAnim = reduced
    ? { scaleX: 1 }
    : { scaleX: [1, 0.18, 1] }

  const wingTransition = {
    duration: flapSpeed,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <radialGradient id={gid} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor={light} />
          <stop offset="60%" stopColor={color} />
          <stop offset="100%" stopColor={dark} />
        </radialGradient>
      </defs>

      {/* Left wing pair */}
      <motion.g
        style={{ transformOrigin: '50px 50px', transformBox: 'fill-box' as never }}
        animate={wingAnim}
        transition={wingTransition}
      >
        <path
          d="M50 50 C 24 18, 2 26, 8 46 C 2 58, 22 60, 50 52 Z"
          fill={`url(#${gid})`}
          stroke={dark}
          strokeWidth="1.2"
        />
        <path
          d="M50 52 C 26 58, 8 66, 14 80 C 24 92, 42 74, 50 60 Z"
          fill={`url(#${gid})`}
          stroke={dark}
          strokeWidth="1.2"
        />
        <circle cx="22" cy="40" r="3" fill={dark} opacity="0.5" />
      </motion.g>

      {/* Right wing pair */}
      <motion.g
        style={{ transformOrigin: '50px 50px', transformBox: 'fill-box' as never }}
        animate={wingAnim}
        transition={wingTransition}
      >
        <path
          d="M50 50 C 76 18, 98 26, 92 46 C 98 58, 78 60, 50 52 Z"
          fill={`url(#${gid})`}
          stroke={dark}
          strokeWidth="1.2"
        />
        <path
          d="M50 52 C 74 58, 92 66, 86 80 C 76 92, 58 74, 50 60 Z"
          fill={`url(#${gid})`}
          stroke={dark}
          strokeWidth="1.2"
        />
        <circle cx="78" cy="40" r="3" fill={dark} opacity="0.5" />
      </motion.g>

      {/* Body + antennae */}
      <path
        d="M50 40 C 52.5 40, 52.5 64, 50 68 C 47.5 64, 47.5 40, 50 40 Z"
        fill={dark}
      />
      <path d="M50 41 C 46 32, 42 28, 39 27" stroke={dark} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M50 41 C 54 32, 58 28, 61 27" stroke={dark} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

interface ButterflyProps {
  className?: string
  size?: number
  variant?: 'drift' | 'settle'
  delay?: number
  color?: string
}

/**
 * A butterfly companion that flies in place / settles. Combines the flapping
 * SVG wings with a gentle floating transform on the wrapper.
 */
export function Butterfly({
  className,
  size = 64,
  variant = 'drift',
  delay = 0,
  color = '#f4c542',
}: ButterflyProps) {
  const reduced = useReducedMotion()

  const animate =
    reduced || variant === 'settle'
      ? { y: [0, -5, 0], rotate: [0, 2, 0] }
      : {
          y: [0, -16, 6, -10, 0],
          x: [0, 12, -8, 9, 0],
          rotate: [0, 6, -5, 3, 0],
        }

  return (
    <motion.div
      aria-hidden="true"
      className={cn('pointer-events-none select-none', className)}
      style={{ width: size, height: size }}
      animate={animate}
      transition={{
        duration: variant === 'settle' ? 6 : 9,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    >
      <ButterflyShape size={size} color={color} flapSpeed={variant === 'settle' ? 0.6 : 0.42} />
    </motion.div>
  )
}

export { ButterflyShape }
