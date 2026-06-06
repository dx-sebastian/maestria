'use client'

import dynamic from 'next/dynamic'
import { useCallback, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { BookSpread } from '@/components/book-spread'
import { EASE_PAPER } from '@/lib/motion'

const BookScene = dynamic(
  () => import('@/components/three/book-scene').then((m) => m.BookScene),
  { ssr: false, loading: () => <BookFallback /> },
)

type Phase = 'closed' | 'opening' | 'reading'

function BookFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-ink-faint">
        <span className="block h-12 w-9 rounded-sm border border-ink-faint/40 bg-paper-raised shadow-sm" />
        <span className="font-hand text-lg">abriendo el diario…</span>
      </div>
    </div>
  )
}

export function BookGateway({ onStart }: { onStart: () => void }) {
  const [phase, setPhase] = useState<Phase>('closed')
  const reduced = useReducedMotion()

  const open = useCallback(() => {
    setPhase((p) => {
      if (p !== 'closed') return p
      window.setTimeout(() => setPhase('reading'), reduced ? 80 : 450)
      return 'opening'
    })
  }, [reduced])

  const close = useCallback(() => setPhase('closed'), [])
  const start = useCallback(() => onStart(), [onStart])

  return (
    <section
      id="abre"
      aria-label="Diario Lúdico — apertura"
      className="paper-grain relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-paper via-paper-raised to-paper-deep px-6 py-12"
    >
      {/* warm halo behind the book */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklch, var(--amber) 28%, transparent), transparent 62%)',
          filter: 'blur(18px)',
        }}
      />

      {/* The book is the whole stage */}
      <div className="relative z-[1] flex w-full max-w-5xl flex-1 items-center justify-center">
        <AnimatePresence mode="wait">
          {phase !== 'reading' ? (
            <motion.div
              key="book"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE_PAPER }}
              className={phase === 'opening' ? 'pointer-events-none h-[78vh] w-full' : 'h-[78vh] w-full'}
            >
              <BookScene open={phase !== 'closed'} onOpen={open} />
            </motion.div>
          ) : (
            <motion.div
              key="reader"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE_PAPER }}
              className="flex w-full justify-center py-6"
            >
              <BookSpread onClose={close} onStart={start} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* minimal affordance */}
      <AnimatePresence>
        {phase !== 'reading' ? (
          <motion.div
            key="foot"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE_PAPER }}
            className="relative z-[2] -mt-2 flex flex-col items-center gap-5 text-center"
          >
            {phase === 'closed' ? (
              <motion.button
                type="button"
                onClick={open}
                animate={reduced ? undefined : { scale: [1, 1.035, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                className="rounded-full bg-ink px-8 py-3.5 font-sans text-[0.74rem] uppercase tracking-[0.24em] text-paper shadow-[0_16px_36px_-16px_rgba(40,28,8,0.7)] transition-colors hover:bg-ochre"
              >
                Abrir el libro
              </motion.button>
            ) : (
              <span className="font-hand text-2xl text-ink-soft">abriendo…</span>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
