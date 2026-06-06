'use client'

import { DIARY } from '@/data/diario'
import { Reveal } from '@/components/reveal'
import { fadeUpSmall } from '@/lib/motion'

export function Colophon() {
  return (
    <footer className="relative border-t border-border bg-paper-deep">
      <div className="paper-grain absolute inset-0" />
      <div className="relative z-[1] mx-auto max-w-[88rem] px-10 py-16">
        <Reveal variants={fadeUpSmall} className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-hand text-3xl text-ink">Diario Lúdico:</p>
          </div>

          <button
            type="button"
            onClick={() =>
              document.getElementById('abre')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="group inline-flex items-center gap-2 self-start font-sans text-[0.72rem] uppercase tracking-[0.22em] text-ink-soft transition-colors hover:text-ink"
          >
            <span className="inline-block transition-transform group-hover:-translate-y-0.5">↑</span>
            Volver al inicio
          </button>
        </Reveal>

        <div className="hairline my-10" />

        <Reveal variants={fadeUpSmall} className="flex flex-col gap-6 text-ink-faint md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-wrap gap-x-6 gap-y-1 font-sans text-xs uppercase tracking-[0.18em]">
            {DIARY.map((d) => (
              <li key={d.id}>
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById(d.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                  className="transition-colors hover:text-ink"
                  style={{ ['--tw-text-opacity' as string]: '1' }}
                >
                  {d.heading}
                </button>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </footer>
  )
}
