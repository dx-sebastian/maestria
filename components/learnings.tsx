'use client'

import { motion, useReducedMotion } from 'motion/react'
import { LEARNINGS } from '@/data/diario'
import { Reveal } from '@/components/reveal'
import { stagger, fadeUp, fadeUpSmall } from '@/lib/motion'

/**
 * "Aprendizajes luego del seminario" — an editorial postscript to the diary.
 *
 * Distinct visual language from Reflection (no photographic atmosphere): a
 * paper canvas with a warm radial wash, a tall typographic title plate, and a
 * final paragraph lifted onto a softly bordered card that reads as the
 * author's handwritten close.
 */
export function Learnings() {
  const reduced = useReducedMotion()

  return (
    <section
      id="aprendizajes"
      aria-labelledby="aprendizajes-title"
      className="relative isolate overflow-hidden bg-paper-deep"
      style={{ ['--accent' as string]: 'var(--ochre)' }}
    >
      {/* paper canvas with a warm, breathing wash */}
      <span aria-hidden="true" className="paper-grain pointer-events-none absolute inset-0 z-0" />
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(60% 50% at 22% 14%, color-mix(in oklch, var(--amber) 35%, transparent), transparent 70%), radial-gradient(55% 60% at 84% 92%, color-mix(in oklch, var(--ochre) 28%, transparent), transparent 72%)',
        }}
        animate={reduced ? undefined : { opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* HERO — editorial title plate */}
      <header className="relative z-[1] mx-auto flex min-h-[78vh] w-full max-w-[88rem] flex-col justify-center px-10 pt-28 pb-16 md:pt-32">
        {/* oversized number motif behind the title */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-6 top-16 select-none font-heading text-[26vw] font-semibold leading-none text-[color-mix(in_oklch,var(--ochre)_18%,transparent)] md:right-10 md:top-20"
        >
          VI
        </span>

        <Reveal variants={fadeUpSmall}>
          <p className="eyebrow text-ochre">{LEARNINGS.kicker}</p>
        </Reveal>

        <Reveal variants={fadeUp} delay={0.06}>
          <h2
            id="aprendizajes-title"
            className="mt-6 max-w-5xl font-heading text-[clamp(3rem,7.5vw,6.6rem)] font-semibold leading-[0.94] tracking-[-0.03em] text-ink"
          >
            {LEARNINGS.title}
          </h2>
        </Reveal>

        <Reveal variants={fadeUp} delay={0.14}>
          <p className="mt-7 max-w-3xl font-heading text-[clamp(1.45rem,2.4vw,2.05rem)] font-light italic leading-[1.4] tracking-[-0.005em] text-ink-soft">
            {LEARNINGS.subtitle}
          </p>
        </Reveal>

        <Reveal variants={fadeUpSmall} delay={0.22}>
          <div className="mt-12 flex items-center gap-5">
            <span className="h-px w-16 bg-ochre/70" />
            <span className="font-sans text-[0.7rem] uppercase tracking-[0.28em] text-ink-faint">
              Postscriptum del diario
            </span>
          </div>
        </Reveal>
      </header>

      {/* BODY — reading paragraphs */}
      <div className="relative z-[1] mx-auto max-w-[46rem] px-8 pb-20 md:pb-28">
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.08 }}
          className="reading"
        >
          {LEARNINGS.paragraphs.map((p, i) => (
            <motion.p key={i} variants={fadeUp} className={i === 0 ? 'dropcap' : undefined}>
              {p}
            </motion.p>
          ))}
        </motion.div>
      </div>

      {/* CLOSING — author's last breath, lifted onto a soft card */}
      <div className="relative z-[1] mx-auto max-w-[46rem] px-8 pb-32 md:pb-40">
        <Reveal variants={fadeUp}>
          <figure className="relative rounded-[1.4rem] border border-ochre/30 bg-[color-mix(in_oklch,var(--paper)_88%,var(--amber))] px-8 py-12 shadow-[0_30px_70px_-40px_rgba(70,40,8,0.5)] md:px-12 md:py-14">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-3 left-10 select-none font-heading text-[5rem] leading-none text-ochre/35"
            >
              “
            </span>
            <blockquote className="relative font-heading text-[1.25rem] font-light italic leading-[1.6] tracking-[-0.005em] text-ink md:text-[1.45rem]">
              {LEARNINGS.closing}
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-4">
              <span className="h-px w-10 bg-ochre/70" />
              <span className="font-hand text-2xl text-ink-soft">{LEARNINGS.signature}</span>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}
