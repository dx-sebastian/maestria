'use client'

import dynamic from 'next/dynamic'
import { motion, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import type { DiaryDay } from '@/data/diario'
import { Reveal } from '@/components/reveal'
import { PullQuote } from '@/components/pull-quote'
import { MarginNote } from '@/components/margin-note'
import { assetPath } from '@/lib/assets'
import { stagger, fadeUp, fadeUpSmall } from '@/lib/motion'

const ButterfliesCanvas = dynamic(
  () => import('@/components/three/butterflies').then((m) => m.ButterfliesCanvas),
  { ssr: false },
)

const ROMAN = ['I', 'II', 'III', 'IV', 'V']

/** A soft, drifting "weather" of light tinted by the day's accent. */
function Climatic() {
  const reduced = useReducedMotion()
  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 50% at 28% 18%, color-mix(in oklch, var(--accent) 32%, transparent), transparent 70%)',
          mixBlendMode: 'screen',
        }}
        animate={reduced ? undefined : { opacity: [0.35, 0.65, 0.35], x: ['-4%', '6%', '-4%'] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(50% 60% at 80% 90%, color-mix(in oklch, var(--accent) 24%, transparent), transparent 72%)',
          mixBlendMode: 'screen',
        }}
        animate={reduced ? undefined : { opacity: [0.25, 0.5, 0.25] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
    </>
  )
}

export function DayChapter({ day }: { day: DiaryDay }) {
  const accent = day.accent
  const pullAfter = Math.ceil(day.movements.length / 2) - 1

  return (
    <article
      id={day.id}
      aria-labelledby={`${day.id}-title`}
      className="relative isolate scroll-mt-0"
      style={{ ['--accent' as string]: accent }}
    >
      {/* ── Pinned day atmosphere (the whole background becomes this day) ── */}
      <div className="sticky top-0 z-0 h-screen w-full overflow-hidden bg-paper-deep">
        <Image
          src={assetPath(day.image)}
          alt={day.imageAlt}
          fill
          sizes="100vw"
          className="object-cover"
          style={day.imageFilter ? { filter: day.imageFilter } : undefined}
        />
        <div className="absolute inset-0 mix-blend-soft-light" style={{ background: accent, opacity: 0.5 }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.12_0.02_55/0.92)] via-[oklch(0.12_0.02_55/0.5)] to-[oklch(0.12_0.02_55/0.72)]" />
        <Climatic />
        {day.id === 'jueves' ? (
          <ButterfliesCanvas count={6} spread={9} className="pointer-events-none absolute inset-0 opacity-80" />
        ) : null}
      </div>

      {/* ── Content riding over the pinned atmosphere ── */}
      <div className="relative z-10 -mt-[100vh]">
        {/* day title over the atmosphere */}
        <div className="mx-auto flex min-h-[92vh] w-full max-w-[88rem] items-end px-10 pb-14">
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-[34vh] right-0 select-none font-heading text-[24vw] font-semibold leading-none text-[oklch(0.97_0.02_88/0.08)]"
            >
              {String(day.index).padStart(2, '0')}
            </span>

            <Reveal variants={fadeUpSmall}>
              <p className="eyebrow text-[oklch(0.9_0.04_88)] text-shadow-soft">{day.theme}</p>
            </Reveal>
            <Reveal variants={fadeUp} delay={0.05}>
              <h2
                id={`${day.id}-title`}
                className="mt-4 font-heading text-[clamp(3.4rem,8vw,7rem)] font-semibold leading-[0.92] tracking-[-0.03em] text-[oklch(0.98_0.02_88)] text-shadow-deep"
              >
                {day.label}
              </h2>
            </Reveal>
            <Reveal variants={fadeUp} delay={0.12}>
              <p className="mt-5 max-w-2xl font-heading text-xl font-light leading-snug text-[oklch(0.95_0.03_88)] text-shadow-soft md:text-[1.55rem]">
                {day.themeFull}
              </p>
            </Reveal>
          </div>
        </div>

        {/* reading over the day's atmosphere */}
        <div className="px-6 pb-28">
          <div className="mx-auto max-w-[47rem] rounded-[1.6rem] border border-white/10 bg-[oklch(0.14_0.02_60/0.66)] px-7 py-14 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.8)] backdrop-blur-2xl md:px-14 md:py-16">
            {day.movements.map((mv, mi) => (
              <div key={mi} className={mi > 0 ? 'mt-16' : undefined}>
                <Reveal variants={fadeUpSmall} className="mb-7">
                  <div className="flex items-baseline gap-4">
                    <span className="font-heading text-xl font-semibold" style={{ color: 'color-mix(in oklch, white 30%, var(--accent))' }}>
                      {ROMAN[mi]}
                    </span>
                    <span className="h-px flex-1" style={{ background: 'color-mix(in oklch, var(--accent) 50%, transparent)' }} />
                    <span className="font-sans text-[0.7rem] uppercase tracking-[0.22em] text-[oklch(0.88_0.02_88/0.75)]">
                      {mv.title}
                    </span>
                  </div>
                  <h3 className="mt-4 font-heading text-[1.7rem] font-semibold leading-tight tracking-[-0.01em] text-[oklch(0.97_0.02_88)]">
                    {mv.scene}
                  </h3>
                </Reveal>

                <motion.div
                  variants={stagger(0.1)}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.12 }}
                  className="reading reading-dark"
                >
                  {mv.paragraphs.map((p, pi) => (
                    <motion.p key={pi} variants={fadeUp} className={mi === 0 && pi === 0 ? 'dropcap' : undefined}>
                      {p}
                    </motion.p>
                  ))}
                </motion.div>

                {mi === pullAfter ? (
                  <PullQuote accent={'color-mix(in oklch, white 35%, var(--accent))'} dark>
                    {day.pullQuote}
                  </PullQuote>
                ) : null}
              </div>
            ))}

            {day.note ? (
              <div className="mt-14 flex justify-center">
                <MarginNote label={day.note.label} text={day.note.text} accent={accent} />
              </div>
            ) : null}

            <Reveal variants={fadeUpSmall} className="mt-16">
              <p className="eyebrow mb-4 text-[oklch(0.85_0.02_88/0.6)]">En esta jornada</p>
              <ul className="flex flex-wrap gap-2.5">
                {day.concepts.map((c) => (
                  <li
                    key={c}
                    className="rounded-full border px-3.5 py-1.5 font-sans text-[0.8rem] text-[oklch(0.92_0.02_88/0.85)]"
                    style={{ borderColor: 'color-mix(in oklch, var(--accent) 55%, transparent)' }}
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal variants={fadeUp} className="mt-14 text-center">
              <span className="mx-auto mb-7 block h-px w-16" style={{ background: 'color-mix(in oklch, white 30%, var(--accent))' }} />
              <p className="mx-auto max-w-2xl font-heading text-[1.45rem] font-medium leading-[1.5] tracking-[-0.01em] text-[oklch(0.96_0.02_88)] md:text-[1.7rem]">
                {day.close}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </article>
  )
}
