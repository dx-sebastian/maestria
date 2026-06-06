'use client'

import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import { useRef } from 'react'
import { SITE } from '@/data/diario'
import { assetPath } from '@/lib/assets'
import { EASE_PAPER } from '@/lib/motion'
import { Butterfly } from '@/components/butterfly'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '16%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '-9%'])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section
      id="inicio"
      ref={ref}
      className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden bg-paper-deep"
    >
      {/* Parallax background */}
      <motion.div style={{ y: imageY }} className="absolute inset-0 -z-10 scale-110">
        <Image
          src={assetPath('/images/hero-teacher.png')}
          alt="Docente de pie en el pasillo de la Institución Educativa Rodrigo Correa Palacio, abrazando libros y cuadernos."
          fill
          priority
          sizes="100vw"
          className="object-cover object-[68%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.2_0.02_55/0.94)] via-[oklch(0.2_0.02_55/0.5)] to-[oklch(0.2_0.02_55/0.35)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.2_0.02_55/0.78)] via-transparent to-transparent" />
      </motion.div>

      <Butterfly className="absolute right-[16%] top-[24%] hidden lg:block" size={64} />
      <Butterfly
        className="absolute right-[26%] top-[40%] hidden lg:block"
        size={40}
        delay={1.6}
        variant="settle"
      />

      {/* Top masthead */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE_PAPER, delay: 0.1 }}
        className="relative z-10 mx-auto flex w-full max-w-[88rem] items-center justify-between px-10 pt-9"
      >
        <span className="font-hand text-2xl text-[oklch(0.92_0.05_88)]">Diario Lúdico</span>
        <span className="hidden text-right font-sans text-[0.7rem] uppercase tracking-[0.3em] text-[oklch(0.92_0.03_88/0.75)] md:block">
          {SITE.school} · {SITE.city}
        </span>
      </motion.header>

      {/* Title block */}
      <motion.div
        style={{ y: textY, opacity: fade }}
        className="relative z-10 mx-auto mt-auto w-full max-w-[88rem] px-10 pb-24"
      >
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_PAPER, delay: 0.25 }}
          className="eyebrow text-[oklch(0.86_0.12_88)]"
        >
          {SITE.subtitle}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_PAPER, delay: 0.35 }}
          className="mt-5 font-heading text-[clamp(4rem,11vw,10rem)] font-semibold leading-[0.9] tracking-[-0.03em] text-[oklch(0.97_0.02_88)] text-shadow-deep"
        >
          Diario Lúdico
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_PAPER, delay: 0.5 }}
          className="mt-4 max-w-2xl font-heading text-2xl font-light italic leading-snug text-[oklch(0.93_0.04_88)] md:text-3xl"
        >
          {SITE.tagline}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_PAPER, delay: 0.62 }}
          className="mt-7 max-w-xl font-body text-lg leading-relaxed text-[oklch(0.92_0.02_88/0.88)]"
        >
          {SITE.standfirst}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_PAPER, delay: 0.78 }}
          className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-[0.72rem] uppercase tracking-[0.22em] text-[oklch(0.9_0.02_88/0.78)]"
        >
          <span>{SITE.author}</span>
          <span className="h-1 w-1 rounded-full bg-[oklch(0.86_0.12_88)]" />
          <span>{SITE.role}</span>
          <span className="h-1 w-1 rounded-full bg-[oklch(0.86_0.12_88)]" />
          <span>{SITE.meta}</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_PAPER, delay: 0.9 }}
          className="mt-3 font-sans text-[0.68rem] uppercase tracking-[0.2em] text-[oklch(0.86_0.1_88/0.82)]"
        >
          {SITE.credit}
        </motion.p>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        aria-hidden="true"
        style={{ opacity: fade }}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 1 }}
          className="flex flex-col items-center gap-2"
        >
          <span className="font-sans text-[0.62rem] uppercase tracking-[0.3em] text-[oklch(0.9_0.02_88/0.7)]">
            Comenzar la lectura
          </span>
          <motion.span
            animate={reduced ? undefined : { y: [0, 7, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="flex h-9 w-[22px] items-start justify-center rounded-full border border-[oklch(0.9_0.02_88/0.5)] p-1.5"
          >
            <span className="h-2 w-1 rounded-full bg-[oklch(0.9_0.02_88/0.8)]" />
          </motion.span>
        </motion.div>
      </motion.div>
    </section>
  )
}
