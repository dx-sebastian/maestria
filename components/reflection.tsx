'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import { REFLECTION, STORYBOOK } from '@/data/diario'
import { Reveal } from '@/components/reveal'
import { assetPath } from '@/lib/assets'
import { stagger, fadeUp, fadeUpSmall, EASE_PAPER } from '@/lib/motion'

const ButterfliesCanvas = dynamic(
  () => import('@/components/three/butterflies').then((m) => m.ButterfliesCanvas),
  { ssr: false },
)

export function Reflection() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '14%'])

  return (
    <section
      id="reflexion"
      aria-labelledby="reflexion-title"
      style={{ ['--accent' as string]: 'var(--dusk)' }}
    >
      {/* narration bridge into the epilogue */}
      <div className="relative bg-background">
        <div className="paper-grain absolute inset-0" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[oklch(0.2_0.02_60/0.12)] to-transparent"
        />
        <Reveal variants={fadeUp} className="relative z-[1] mx-auto max-w-3xl px-8 py-20 text-center md:py-28">
          <div className="mb-6 flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-dusk/55" />
            <span className="eyebrow text-dusk">Epílogo</span>
            <span className="h-px w-10 bg-dusk/55" />
          </div>
          <p className="font-heading text-[1.55rem] font-light italic leading-[1.5] tracking-[-0.01em] text-ink md:text-[2.05rem]">
            {STORYBOOK.toReflection}
          </p>
        </Reveal>
      </div>

      {/* opener */}
      <header
        ref={ref}
        className="relative isolate flex min-h-[78vh] w-full items-end overflow-hidden bg-paper-deep"
      >
        <motion.div style={{ y: imageY }} className="absolute inset-0 -z-10 scale-110">
          <Image
            src={assetPath('/images/viernes-esperanza.png')}
            alt="Aula vacía al atardecer con luz dorada entrando por la ventana."
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 mix-blend-soft-light" style={{ background: 'var(--dusk)', opacity: 0.45 }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.16_0.02_55/0.95)] via-[oklch(0.16_0.02_55/0.5)] to-[oklch(0.16_0.02_55/0.45)]" />
        </motion.div>

        <div className="relative z-[1] mx-auto w-full max-w-[88rem] px-10 pb-20">
          <Reveal variants={fadeUpSmall}>
            <p className="eyebrow text-[oklch(0.88_0.1_70/0.9)]">{REFLECTION.kicker}</p>
          </Reveal>
          <Reveal variants={fadeUp} delay={0.06}>
            <h2
              id="reflexion-title"
              className="mt-4 max-w-4xl font-heading text-[clamp(2.8rem,6.5vw,5.5rem)] font-semibold leading-[0.96] tracking-[-0.03em] text-[oklch(0.98_0.02_88)] text-shadow-deep"
            >
              {REFLECTION.title}
            </h2>
          </Reveal>
        </div>
      </header>

      {/* reading */}
      <div className="relative bg-background">
        <div className="paper-grain absolute inset-0" />
        <div className="relative z-[1] mx-auto max-w-[46rem] px-8 py-24 md:py-32">
          <motion.div
            variants={stagger(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="reading"
          >
            {REFLECTION.paragraphs.map((p, i) => (
              <motion.p key={i} variants={fadeUp} className={i === 0 ? 'dropcap' : undefined}>
                {p}
              </motion.p>
            ))}
          </motion.div>
        </div>
      </div>

      {/* closing crescendo */}
      <div className="relative isolate flex min-h-[88vh] w-full items-center justify-center overflow-hidden bg-paper-deep">
        <div className="absolute inset-0 -z-10">
          <Image
            src={assetPath('/images/constellation-classroom.png')}
            alt="Aula al anochecer con una constelación dibujada sobre el pizarrón."
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[oklch(0.14_0.02_60/0.82)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.14_0.02_60/0.5)] via-transparent to-[oklch(0.14_0.02_60/0.85)]" />
        </div>

        <ButterfliesCanvas count={8} spread={7} className="pointer-events-none absolute inset-0 z-[1]" />

        <div className="relative z-[2] mx-auto max-w-4xl px-10 text-center">
          <Reveal variants={fadeUpSmall}>
            <span className="mx-auto mb-9 block h-px w-20 bg-[oklch(0.86_0.12_80/0.8)]" />
          </Reveal>
          <Reveal variants={fadeUp}>
            <p className="font-heading text-[clamp(1.9rem,4vw,3.2rem)] font-light italic leading-[1.32] tracking-[-0.01em] text-[oklch(0.97_0.03_88)] text-shadow-deep">
              {REFLECTION.closing}
            </p>
          </Reveal>
          <Reveal variants={fadeUpSmall} delay={0.15}>
            <div className="mt-14 flex flex-col items-center gap-1">
              <span className="font-hand text-4xl text-[oklch(0.95_0.04_88)]">
                {REFLECTION.signature}
              </span>
              <span className="font-sans text-[0.7rem] uppercase tracking-[0.28em] text-[oklch(0.9_0.02_88/0.7)]">
                Diario Lúdico · Habitar la escuela desde la lúdica
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
