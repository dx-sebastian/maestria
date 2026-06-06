import type { Variants, Transition } from 'motion/react'

/** Easing curves shared across the experience — gentle, paper-like. */
export const EASE_PAPER: Transition['ease'] = [0.22, 1, 0.36, 1]
export const EASE_OUT: Transition['ease'] = [0.16, 1, 0.3, 1]

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE_PAPER },
  },
}

export const fadeUpSmall: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_PAPER },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.1, ease: EASE_PAPER } },
}

export const blurUp: Variants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1, ease: EASE_PAPER },
  },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: EASE_PAPER },
  },
}

export const stagger = (gap = 0.12, delay = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: gap, delayChildren: delay },
  },
})

/** Standard viewport config for scroll-triggered reveals. */
export const inView = { once: true, amount: 0.3 } as const
export const inViewSoft = { once: true, amount: 0.18 } as const
