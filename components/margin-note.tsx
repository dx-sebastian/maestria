'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { EASE_PAPER } from '@/lib/motion'

interface MarginNoteProps {
  label?: string
  text: string
  accent?: string
  className?: string
}

/**
 * A handwritten annotation pinned to the page like a sticky note in a teacher's
 * field journal. Used for real marginalia from the diary (e.g. the "Nota mental").
 */
export function MarginNote({ label, text, accent = 'var(--ochre)', className }: MarginNoteProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 26, rotate: -2.4 }}
      whileInView={{ opacity: 1, y: 0, rotate: -1.4 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.9, ease: EASE_PAPER }}
      className={cn(
        'relative max-w-md rounded-[0.4rem] bg-paper-raised px-7 py-6',
        'shadow-[0_2px_4px_rgba(60,45,15,0.06),0_18px_40px_-24px_rgba(60,45,15,0.5)]',
        className,
      )}
      style={{ ['--accent' as string]: accent }}
    >
      {/* tape / pin */}
      <span
        aria-hidden="true"
        className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-2 rounded-[2px] bg-amber/35 backdrop-blur-sm"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.25)' }}
      />
      <span
        aria-hidden="true"
        className="absolute left-0 top-6 bottom-6 w-[3px] rounded-full"
        style={{ background: accent }}
      />
      {label ? (
        <p
          className="eyebrow mb-2 text-[0.7rem]"
          style={{ color: accent }}
        >
          {label}
        </p>
      ) : null}
      <p className="font-hand text-2xl leading-snug text-ink">{text}</p>
    </motion.aside>
  )
}
