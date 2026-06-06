'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { DIARY } from '@/data/diario'
import { cn } from '@/lib/utils'

const ITEMS = [
  { id: 'abre', short: '00', label: 'El libro', accent: 'var(--ochre)' },
  ...DIARY.map((d) => ({
    id: d.id,
    short: String(d.index).padStart(2, '0'),
    label: d.label,
    accent: d.accent,
  })),
  { id: 'reflexion', short: '06', label: 'Reflexión', accent: 'var(--dusk)' },
]

/**
 * Narrative progress indicator: a slim top bar that fills with scroll, plus a
 * fixed side index that tracks the active section and lets the reader jump
 * between movements. Side index appears only on wide desktop and after the hero.
 */
export function ProgressRail() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 110, damping: 30, mass: 0.3 })
  const [active, setActive] = useState('abre')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const center = window.innerHeight * 0.4
        let current = ITEMS[0].id
        for (const it of ITEMS) {
          const el = document.getElementById(it.id)
          if (!el) continue
          if (el.getBoundingClientRect().top <= center) current = it.id
        }
        setActive(current)
        setVisible(window.scrollY > window.innerHeight * 0.72)
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

  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left"
        style={{
          scaleX,
          background:
            'linear-gradient(90deg, var(--ochre), var(--amber), var(--moss), var(--jade), var(--dusk))',
        }}
      />

      <nav
        aria-label="Índice del diario"
        className={cn(
          'fixed left-8 top-1/2 z-50 hidden -translate-y-1/2 transition-opacity duration-700 xl:block',
          visible ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <div className="relative">
          {/* spine */}
          <span
            aria-hidden="true"
            className="absolute left-[13px] top-2 bottom-2 w-px"
            style={{ background: 'color-mix(in oklch, var(--ink) 16%, transparent)' }}
          />
          <ul className="relative flex flex-col gap-2">
            {ITEMS.map((it) => {
              const isActive = active === it.id
              return (
                <li key={it.id}>
                  <button
                    type="button"
                    onClick={() => go(it.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className="group flex items-center gap-3.5"
                  >
                    <span className="flex h-7 w-7 items-center justify-center">
                      <span
                        className="block h-2.5 w-2.5 rounded-full border transition-all duration-300 group-hover:scale-110"
                        style={
                          isActive
                            ? {
                                background: it.accent,
                                borderColor: it.accent,
                                boxShadow: `0 0 0 4px color-mix(in oklch, ${it.accent} 20%, transparent)`,
                              }
                            : {
                                background: 'var(--paper)',
                                borderColor: 'color-mix(in oklch, var(--ink) 38%, transparent)',
                              }
                        }
                      />
                    </span>
                    <span
                      className={cn(
                        'whitespace-nowrap font-sans text-[0.7rem] font-semibold uppercase tracking-[0.2em] transition-all duration-300',
                        isActive
                          ? 'translate-x-0 opacity-100'
                          : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60',
                      )}
                      style={{ color: isActive ? 'var(--ink)' : 'var(--ink-soft)' }}
                    >
                      {it.label}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>
    </>
  )
}
