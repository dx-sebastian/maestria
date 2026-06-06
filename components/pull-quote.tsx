'use client'

import { motion } from 'motion/react'
import { EASE_PAPER } from '@/lib/motion'

interface PullQuoteProps {
  children: string
  accent?: string
  dark?: boolean
}

/** A large editorial pull-quote that breaks the reading column to emphasize a key line. */
export function PullQuote({ children, accent = 'var(--ochre)', dark = false }: PullQuoteProps) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.45 }}
      transition={{ duration: 1, ease: EASE_PAPER }}
      className="relative mx-auto my-16 max-w-[44rem] px-10 text-center md:my-20"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 select-none font-heading text-[7rem] leading-none"
        style={{ color: accent, opacity: 0.22 }}
      >
        &ldquo;
      </span>
      <blockquote
        className={`relative font-heading text-[1.7rem] font-medium italic leading-[1.5] tracking-[-0.01em] md:text-[2.15rem] ${dark ? 'text-[oklch(0.97_0.02_88)] text-shadow-soft' : 'text-ink'}`}
      >
        {children}
      </blockquote>
      <span
        aria-hidden="true"
        className="mx-auto mt-7 block h-px w-16"
        style={{ background: accent }}
      />
    </motion.figure>
  )
}
