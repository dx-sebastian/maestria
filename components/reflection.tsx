'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import { REFLECTION } from '@/data/diario'
import { Reveal } from '@/components/reveal'
import { assetPath } from '@/lib/assets'
import { stagger, fadeUp, fadeUpSmall } from '@/lib/motion'

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
            <p className="eyebrow text-[oklch(0.88_0.1_70/0.9)]">Diario Lúdico:</p>
          </Reveal>
          <Reveal variants={fadeUp} delay={0.06}>
            <h2
              id="reflexion-title"
              className="mt-4 max-w-4xl font-heading text-[clamp(2.8rem,6.5vw,5.5rem)] font-semibold leading-[0.96] tracking-[-0.03em] text-[oklch(0.98_0.02_88)] text-shadow-deep"
            >
              {REFLECTION.heading}
            </h2>
          </Reveal>
        </div>
      </header>

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
    </section>
  )
}
