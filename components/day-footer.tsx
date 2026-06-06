'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { DIARY } from '@/data/diario'

const ACCENT3D: Record<string, string> = {
  lunes: '#c47a3a',
  martes: '#5f76a8',
  miercoles: '#5f8a55',
  jueves: '#3f8f63',
  viernes: '#c98a3c',
}

/**
 * Fixed "weather vane" of the journey: a bordered, shadowed plate that shows
 * the day of the week currently being read, with a subtle climatic glow in that
 * day's colour. It appears only while a day section is on screen.
 */
export function DayFooter() {
  const [active, setActive] = useState<string | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const mid = window.innerHeight * 0.5
        let current: string | null = null
        for (const d of DIARY) {
          const el = document.getElementById(d.id)
          if (!el) continue
          const r = el.getBoundingClientRect()
          if (r.top <= mid && r.bottom >= mid) current = d.id
        }
        setActive(current)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const day = active ? DIARY.find((d) => d.id === active) : null
  const accent = day ? ACCENT3D[day.id] : '#c47a3a'

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center">
      <AnimatePresence mode="wait">
        {day ? (
          <motion.div
            key={day.id}
            initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto relative overflow-hidden rounded-full border px-6 py-3 backdrop-blur-xl"
            style={{
              borderColor: `color-mix(in oklch, ${accent} 55%, transparent)`,
              background: 'oklch(0.16 0.02 60 / 0.62)',
              boxShadow: `0 18px 50px -18px ${accent}66, 0 2px 10px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.06)`,
            }}
          >
            {/* climatic breathing glow */}
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-10 -z-[1]"
              style={{
                background: `radial-gradient(60% 80% at 30% 50%, ${accent}55, transparent 70%)`,
              }}
              animate={reduced ? undefined : { opacity: [0.35, 0.7, 0.35], x: ['-6%', '8%', '-6%'] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="relative flex items-center gap-3.5">
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full font-heading text-sm font-semibold"
                style={{ background: `color-mix(in oklch, ${accent} 26%, transparent)`, color: '#fbe6c4' }}
              >
                {day.index}
              </span>
              <span className="font-heading text-lg font-semibold leading-none text-[oklch(0.97_0.02_88)]">
                {day.label}
              </span>
              <span className="h-3 w-px" style={{ background: `color-mix(in oklch, ${accent} 60%, transparent)` }} />
              <span className="hidden font-sans text-[0.62rem] uppercase tracking-[0.2em] text-[oklch(0.9_0.02_88/0.78)] sm:inline">
                {day.themeFull}
              </span>
              {/* shimmer line */}
              <motion.span
                aria-hidden="true"
                className="ml-1 hidden h-px w-10 sm:block"
                style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
                animate={reduced ? undefined : { opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
