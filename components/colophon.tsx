'use client'

import { SITE, DIARY } from '@/data/diario'
import { Reveal } from '@/components/reveal'
import { fadeUpSmall } from '@/lib/motion'

export function Colophon() {
  return (
    <footer className="relative border-t border-border bg-paper-deep">
      <div className="paper-grain absolute inset-0" />
      <div className="relative z-[1] mx-auto max-w-[88rem] px-10 py-16">
        <Reveal variants={fadeUpSmall} className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-hand text-3xl text-ink">Diario Lúdico</p>
            <p className="mt-2 max-w-md font-body text-base leading-relaxed text-ink-soft">
              {SITE.tagline}. Diario de campo de {SITE.author}, {SITE.role.toLowerCase()}.
            </p>
            <p className="mt-3 max-w-md font-sans text-[0.7rem] font-semibold uppercase leading-relaxed tracking-[0.18em] text-ink-soft">
              {SITE.school} · {SITE.city}
            </p>
            <p className="mt-1 max-w-md font-sans text-[0.7rem] uppercase leading-relaxed tracking-[0.18em] text-ink-faint">
              {SITE.seminar}
            </p>
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
                  {String(d.index).padStart(2, '0')} · {d.label}
                </button>
              </li>
            ))}
          </ul>
          <p className="font-sans text-xs uppercase tracking-[0.18em]">{SITE.program}</p>
        </Reveal>
      </div>
    </footer>
  )
}
