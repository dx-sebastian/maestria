'use client'

import { motion, type Variants } from 'motion/react'
import type { ReactNode } from 'react'
import { fadeUp } from '@/lib/motion'

interface RevealProps {
  children: ReactNode
  variants?: Variants
  className?: string
  /** delay in seconds */
  delay?: number
  /** how much must be visible before triggering (0..1) */
  amount?: number
  as?: 'div' | 'section' | 'li' | 'article' | 'figure' | 'header' | 'span'
}

/**
 * Scroll-triggered reveal. Honors prefers-reduced-motion through the global CSS
 * guard plus motion's own reduced-motion handling.
 */
export function Reveal({
  children,
  variants = fadeUp,
  className,
  delay = 0,
  amount = 0.25,
  as = 'div',
}: RevealProps) {
  const MotionTag = motion[as]
  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </MotionTag>
  )
}
