'use client'

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
  type PanInfo,
} from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { PRESENTATION } from '@/data/diario'
import { EASE_PAPER } from '@/lib/motion'

/* ──────────────────────────────────────────────────────────────────────────
 *  Motion-orchestrated page turn.
 *
 *  A SINGLE leaf rotates in 3D (rotateY) about the central spine. One source
 *  MotionValue — the leaf's turn `progress` (0 → 1) — is wired, via useTransform,
 *  to EVERY secondary visual so nothing can drift out of sync (no parallel
 *  timelines):
 *
 *    · the leaf rotation itself           (rotateY 0 → ±180°)
 *    · the travelling curl SHEEN          (a specular band sweeping the bend)
 *    · the directional SHADE              (the angled face darkening)
 *    · the CAST SHADOW on the page below  (deepest at the apex of the lift)
 *    · the underlying centre GUTTER SHADOW (driven by the very same value)
 *
 *  `useAnimate` orchestrates the imperative turn with a meticulous paper easing.
 *  prefers-reduced-motion → a flawless instant CROSSFADE via AnimatePresence;
 *  no 3D, no rotation theatre.
 *
 *  Both leaf faces are rendered up-front (double-buffered, backface-hidden) so a
 *  turn never pops content. The static base shows the destination half beneath
 *  the leaf, so the lift uncovers real content. Markup is deterministic
 *  (SSR === CSR) → no hydration mismatch and no layout shift.
 *
 *  Affordances: prev/next buttons, dot navigation, close — plus
 *  keyboard (←/→, PageUp/Down, Home/End, Esc) and a cheap horizontal drag-to-turn.
 *
 *  At the last spread, `›` no longer disables: it triggers the EXIT sequence
 *  (back-cover swing + zoom + fullscreen color-grade) and hands off to the
 *  journey via `onStart()` mid-fade, so the reader never sees a hard cut.
 * ────────────────────────────────────────────────────────────────────────── */

const P = PRESENTATION.paragraphs

interface PageContent {
  kind: 'title' | 'text' | 'closing'
  body?: string
}

interface Spread {
  left: PageContent
  right: PageContent
}

const SPREADS: Spread[] = [
  { left: { kind: 'title' }, right: { kind: 'text', body: P[0] } },
  { left: { kind: 'text', body: P[1] }, right: { kind: 'text', body: P[2] } },
  { left: { kind: 'text', body: P[3] }, right: { kind: 'closing', body: P[4] } },
]

const TOTAL = SPREADS.length

/** Page-turn duration (ms). The leaf is paced by a hand-rolled rAF tween with
 *  an easeInOutCubic so it accelerates softly, sweeps visibly through the middle,
 *  and lands gently — it reads as a real sheet of paper being turned. */
const TURN_MS = 920
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

/* ──────────────────────────────────────────────────────────────────────────
 *  Page faces — pure content, no flip awareness. Reused by both the static
 *  pages and the two faces of the leaf, guaranteeing identical content.
 * ────────────────────────────────────────────────────────────────────────── */

function TitleFace() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <p className="eyebrow text-ochre">{PRESENTATION.kicker}</p>
      <h3 className="mt-5 font-heading text-3xl font-semibold leading-[1.05] tracking-[-0.02em] text-ink">
        {PRESENTATION.title}
      </h3>
    </div>
  )
}

function PageFace({ page }: { page: PageContent }) {
  if (page.kind === 'title') return <TitleFace />
  return (
    <div className="flex h-full flex-col">
      <p className={`reading !text-[1.06rem] !leading-[1.7] ${page.kind === 'closing' ? '' : 'dropcap-sm'}`}>
        {page.body}
      </p>
    </div>
  )
}

/** Geometry shared by every half-page (static page and leaf face alike).
 *  The page height is a uniform floor — `max(58vh, 32rem)` — so every spread is
 *  the SAME height regardless of how much text it holds. 58vh keeps it
 *  proportional on tall screens; the 32rem floor (≥ the tallest spread's
 *  content) prevents a shorter spread (e.g. page 2) from collapsing below the
 *  others on laptop-height viewports. No fixed height → text is never clipped. */
const HALF =
  'relative h-full min-h-[max(58vh,32rem)] overflow-hidden bg-paper px-10 py-12 md:px-14'

/** A half-page rendered inside the book grid (no 3D, full opacity). */
function StaticHalf({ page, side }: { page: PageContent; side: 'left' | 'right' }) {
  return (
    <div className={`${HALF} ${side === 'left' ? 'border-r border-border/40' : ''}`}>
      <span aria-hidden="true" className="paper-grain pointer-events-none absolute inset-0 z-0" />
      <div className="relative z-[1] h-full">
        <PageFace page={page} />
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
 *  One face of the flipping leaf, with its own travelling curl sheen and a
 *  directional shade so the angled paper reads as turning (never just fading).
 * ────────────────────────────────────────────────────────────────────────── */

function LeafFace({
  page,
  side,
  face,
  sheen,
  sheenPos,
  shade,
}: {
  page: PageContent
  side: 'left' | 'right'
  face: 'front' | 'back'
  /** Opacity of the curl sheen band (0 → 1). */
  sheen: MotionValue<number>
  /** Centre of the sheen band, in %, travelling across the leaf. */
  sheenPos: MotionValue<number>
  /** Opacity of the directional shade as the face angles away. */
  shade: MotionValue<number>
}) {
  /* Travelling specular band. Compositor-friendly: a FIXED gradient swept across
     the leaf via transform (translateX) instead of re-rasterizing a gradient
     string every frame. `sheenPos` (≈0→100) maps to a translate percentage. */
  const sheenX = useTransform(sheenPos, (x) => `${x - 50}%`)

  return (
    <div
      className="absolute inset-0"
      style={{
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        /* Back face is pre-flipped so, with backface-hidden, each face shows
           from exactly one side of the leaf — the double buffer. */
        transform: face === 'back' ? 'rotateY(180deg)' : undefined,
      }}
    >
      {/* page content (rendered up-front for both faces → no swap pop) */}
      <div className={`${HALF} ${side === 'left' ? 'border-r border-border/40' : ''}`}>
        <span aria-hidden="true" className="paper-grain pointer-events-none absolute inset-0 z-0" />
        <div className="relative z-[1] h-full">
          <PageFace page={page} />
        </div>
      </div>

      {/* gutter-side core shadow → reads as bound at the spine */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 z-[2] w-12"
        style={
          {
            [side === 'left' ? 'right' : 'left']: 0,
            background:
              side === 'left'
                ? 'linear-gradient(to right, transparent, rgba(60,45,15,0.2))'
                : 'linear-gradient(to left, transparent, rgba(60,45,15,0.2))',
          } as React.CSSProperties
        }
      />

      {/* travelling curl SHEEN (rotation-driven, transform-swept) */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[3] mix-blend-soft-light"
        style={{
          opacity: sheen,
          x: sheenX,
          background:
            'linear-gradient(105deg, transparent 36%, rgba(255,250,236,0.95) 50%, transparent 64%)',
        }}
      />

      {/* directional SHADE so the angled face darkens convincingly */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[3]"
        style={{
          opacity: shade,
          background:
            side === 'left'
              ? 'linear-gradient(to left, rgba(28,20,6,0.6), rgba(28,20,6,0.06) 58%, transparent)'
              : 'linear-gradient(to right, rgba(28,20,6,0.6), rgba(28,20,6,0.06) 58%, transparent)',
        }}
      />
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
 *  The flipping leaf + the cast shadow it throws on the page beneath.
 * ────────────────────────────────────────────────────────────────────────── */

interface LeafConfig {
  dir: 1 | -1
  /** Outward face (currently visible to the reader). */
  front: PageContent
  /** Inward face (revealed once the leaf passes vertical). */
  back: PageContent
}

function FlippingLeaf({
  config,
  progress,
}: {
  config: LeafConfig
  progress: MotionValue<number>
}) {
  const isNext = config.dir === 1

  /* Rotation about the spine. Negative → turns left (next); positive → right (prev). */
  const rotateY = useTransform(progress, [0, 1], [0, isNext ? -180 : 180])

  /* CAST SHADOW: softest at rest, deepest at mid-flip when the raised leaf hangs
     over the page beneath, fading again as it lands. NOTE: the blur radius is
     STATIC (animating blur() re-rasterizes every frame and jank-locks the main
     thread); we animate only opacity + width, which the compositor handles. */
  const castOpacity = useTransform(progress, [0, 0.5, 1], [0, 0.5, 0])
  /* width via scaleX (compositor) instead of animating `width` (layout/frame). */
  const castScaleX = useTransform(progress, [0, 0.5, 1], [0.55, 1, 0.55])

  /* FRONT curl sheen: enters bright, peaks before vertical, then leaves. */
  const frontSheen = useTransform(progress, [0, 0.42, 0.7, 1], [0.1, 0.55, 0.18, 0])
  const frontSheenPos = useTransform(progress, [0, 1], isNext ? [118, 38] : [-18, 62])
  const frontShade = useTransform(progress, [0, 0.5, 1], [0, 0.34, 0.5])

  /* BACK curl sheen: appears past vertical, sweeps the opposite way, settles. */
  const backSheen = useTransform(progress, [0.5, 0.74, 1], [0, 0.4, 0.06])
  const backSheenPos = useTransform(progress, [0, 1], isNext ? [72, -8] : [108, 32])
  const backShade = useTransform(progress, [0.5, 1], [0.42, 0])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 z-[5]"
      style={{
        /* occupy exactly one half of the spread, hinged at the gutter */
        left: isNext ? '50%' : 0,
        right: isNext ? 0 : '50%',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* soft cast shadow on the page beneath, anchored toward the spine */}
      <motion.span
        className="pointer-events-none absolute inset-y-2 z-0 rounded-[6px]"
        style={{
          [isNext ? 'left' : 'right']: 0,
          width: '62%',
          scaleX: castScaleX,
          transformOrigin: isNext ? 'left center' : 'right center',
          opacity: castOpacity,
          filter: 'blur(16px)',
          background: isNext
            ? 'linear-gradient(to left, rgba(34,24,7,0.6), rgba(34,24,7,0.16) 48%, transparent 80%)'
            : 'linear-gradient(to right, rgba(34,24,7,0.6), rgba(34,24,7,0.16) 48%, transparent 80%)',
        }}
      />

      {/* the leaf itself, rotating about the gutter */}
      <motion.div
        className="absolute inset-0"
        style={{
          transformStyle: 'preserve-3d',
          transformOrigin: isNext ? 'left center' : 'right center',
          rotateY,
          willChange: 'transform',
        }}
      >
        <LeafFace
          page={config.front}
          side={isNext ? 'right' : 'left'}
          face="front"
          sheen={frontSheen}
          sheenPos={frontSheenPos}
          shade={frontShade}
        />
        <LeafFace
          page={config.back}
          side={isNext ? 'left' : 'right'}
          face="back"
          sheen={backSheen}
          sheenPos={backSheenPos}
          shade={backShade}
        />
      </motion.div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
 *  BookSpread — orchestrates the static base + the single flipping leaf.
 * ────────────────────────────────────────────────────────────────────────── */

export function BookSpread({ onClose, onStart }: { onClose: () => void; onStart: () => void }) {
  const reduced = useReducedMotion()

  const [spread, setSpread] = useState(0)
  /** Active flip config, or null when the book is at rest. */
  const [leaf, setLeaf] = useState<LeafConfig | null>(null)
  /** True while the exit sequence is playing (back-cover + zoom + color-grade). */
  const [exiting, setExiting] = useState(false)

  /** Single source of truth for the flip phase (0 → 1); drives every visual. */
  const progress = useMotionValue(0)

  /* Gutter shadow — driven by the SAME `progress` value, but as OPACITY on a
     fixed gradient (compositor-friendly) rather than re-rasterizing a gradient
     string each frame. Deepens as the leaf lifts, eases back as it lands. */
  const gutterOpacity = useTransform(progress, [0, 0.5, 1], [0.5, 1, 0.5])

  /* We drive a single `progress` MotionValue with the imperative `animate`;
     every visual (rotation, sheen, shade, casts, gutter) derives from that
     one source via useTransform, so nothing can desync. */

  /* Latest spread in a ref so async callbacks never read a stale value. */
  const spreadRef = useRef(spread)
  spreadRef.current = spread

  /* Stop any in-flight animation on unmount → no setState-after-unmount. */
  const stopRef = useRef<(() => void) | null>(null)
  useEffect(
    () => () => {
      stopRef.current?.()
    },
    [],
  )

  const go = useCallback(
    (dir: 1 | -1) => {
      if (leaf) return
      const from = spreadRef.current
      const to = from + dir
      if (to < 0 || to >= TOTAL) return

      const cur = SPREADS[from]
      const dest = SPREADS[to]
      const config: LeafConfig =
        dir === 1
          ? { dir: 1, front: cur.right, back: dest.left }
          : { dir: -1, front: cur.left, back: dest.right }

      /* Reduced motion: commit instantly. The AnimatePresence crossfade on the
         static base provides the gentle, no-3D fallback. */
      if (reduced) {
        setSpread(to)
        return
      }

      progress.set(0)
      setLeaf(config)

      /* Hand-rolled rAF tween of the single source value. Everything else
         (rotation, sheen, shade, casts, gutter) follows it via useTransform, so
         the whole turn stays in lockstep and the duration is exact. */
      const t0 = performance.now()
      let raf = 0
      const tick = (now: number) => {
        const t = Math.min(1, (now - t0) / TURN_MS)
        progress.set(easeInOutCubic(t))
        if (t < 1) {
          raf = requestAnimationFrame(tick)
        } else {
          /* Commit the destination spread (static base already shows it under
             the leaf), THEN drop the leaf — guarantees no swap pop. */
          setSpread(to)
          setLeaf(null)
          stopRef.current = null
        }
      }
      raf = requestAnimationFrame(tick)
      stopRef.current = () => cancelAnimationFrame(raf)
    },
    [leaf, progress, reduced],
  )

  const goToIndex = useCallback(
    (i: number) => {
      if (leaf || i === spreadRef.current) return
      go(i > spreadRef.current ? 1 : -1)
    },
    [go, leaf],
  )

  /* Exit choreography — when the reader clicks `›` on the last page, the book
     closes onto its back cover, zooms in, and a warm color-graded overlay
     fades over the viewport while `onStart()` mounts the journey behind it.
     Timing is unhurried on purpose: ~1.1s of cover settling before the unlock,
     then a long color-grade fade so the swap is never jarring. */
  const onExit = useCallback(() => {
    if (leaf || exiting) return
    setExiting(true)
    /* Commit the unlock + scroll mid-animation, while the overlay covers the
       viewport — by the time it fades out, the next section is in place. */
    window.setTimeout(() => onStart(), reduced ? 80 : 1100)
  }, [leaf, exiting, onStart, reduced])

  /* Unified next: turns a page, or — at the last page — triggers the exit. */
  const onNext = useCallback(() => {
    if (leaf || exiting) return
    if (spreadRef.current >= TOTAL - 1) onExit()
    else go(1)
  }, [leaf, exiting, go, onExit])

  /* Keyboard affordances (cheap, accessible). */
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (exiting) return
      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault()
          onNext()
          break
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault()
          go(-1)
          break
        case 'Home':
          e.preventDefault()
          if (!leaf) setSpread(0)
          break
        case 'End':
          e.preventDefault()
          if (!leaf) setSpread(TOTAL - 1)
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    },
    [exiting, onNext, go, leaf, onClose],
  )

  /* Cheap drag-to-turn: a horizontal fling commits a turn in its direction.
     On the last page, a forward fling triggers the exit choreography. */
  const onDragEnd = useCallback(
    (_e: unknown, info: PanInfo) => {
      if (exiting) return
      const swipe = info.offset.x + info.velocity.x * 0.1
      if (swipe < -56) onNext()
      else if (swipe > 56) go(-1)
    },
    [exiting, onNext, go],
  )

  /* Double-buffering of the static base: while a leaf turns, the half it will
     uncover already shows the destination page, so the lift reveals real
     content with no flash. Everything else stays on the current spread. */
  const base = SPREADS[spread]
  const dest = leaf ? SPREADS[spread + leaf.dir] : null
  const flippingNext = leaf?.dir === 1
  const flippingPrev = leaf?.dir === -1
  const leftPage = flippingPrev && dest ? dest.left : base.left
  const rightPage = flippingNext && dest ? dest.right : base.right

  const atFirst = spread === 0
  const atLast = spread === TOTAL - 1
  const busy = leaf !== null

  return (
    <motion.div
      className="relative w-full max-w-5xl"
      animate={exiting ? { scale: reduced ? 1 : 1.04, y: reduced ? 0 : -6 } : { scale: 1, y: 0 }}
      transition={{ duration: 1.6, ease: EASE_PAPER }}
      style={{ perspective: '2400px' }}
    >
      {/* book frame */}
      <div className="relative overflow-hidden rounded-[14px] border-[10px] border-[#6d4527] bg-[#6d4527] shadow-[0_40px_90px_-40px_rgba(40,28,8,0.8)]">
        <div className="rounded-[6px] p-[3px]" style={{ boxShadow: 'inset 0 0 0 1.5px rgba(216,166,63,0.55)' }}>
          <div
            className="relative overflow-hidden rounded-[4px] bg-paper"
            role="group"
            aria-roledescription="Libro"
            aria-label="Presentación del diario"
            tabIndex={0}
            onKeyDown={onKeyDown}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* static base spread (with double-buffered destination halves).
                Reduced motion → instant crossfade between spreads. */}
            {reduced ? (
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={spread}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18, ease: 'linear' }}
                  className="relative z-[1] grid grid-cols-2"
                >
                  <StaticHalf page={base.left} side="left" />
                  <StaticHalf page={base.right} side="right" />
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="relative z-[1] grid grid-cols-2">
                <StaticHalf page={leftPage} side="left" />
                <StaticHalf page={rightPage} side="right" />
              </div>
            )}

            {/* drag / swipe affordance (idle, full-motion only).
                Scoped to two slim outer margins so it never blocks text
                selection or the in-page CTA — flinging from the page edge
                turns a leaf. */}
            {!reduced
              ? (['left', 'right'] as const).map((edge) => (
                  <motion.div
                    key={edge}
                    aria-hidden="true"
                    className="absolute inset-y-0 z-[2] w-10"
                    style={{
                      [edge]: 0,
                      pointerEvents: busy || exiting ? 'none' : 'auto',
                      cursor: 'grab',
                    }}
                    drag="x"
                    dragSnapToOrigin
                    dragElastic={0.1}
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={onDragEnd}
                    whileTap={{ cursor: 'grabbing' }}
                  />
                ))
              : null}

            {/* center GUTTER SHADOW — same `progress` source, as opacity */}
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-1/2 z-[3] w-[84px] -translate-x-1/2"
              style={{
                opacity: busy ? gutterOpacity : 0.5,
                background:
                  'linear-gradient(to right, transparent, rgba(54,40,12,0.4), transparent)',
              }}
            />
            {/* always-present spine hairline */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-1/2 z-[3] w-px -translate-x-1/2"
              style={{ background: 'rgba(60,45,15,0.22)' }}
            />

            {/* the single flipping leaf, above the base only while turning */}
            {leaf ? <FlippingLeaf config={leaf} progress={progress} /> : null}

            {/* EXIT — the book closes onto its back cover. We fade a dark
                backdrop over the open spread (so the paper recedes) and lift a
                CLOSED-BOOK-SHAPED leather cover (single-page width, not the
                whole spread) into place at the centre, settling from a slight
                tilt + scale. The motion is deliberately slow and soft so the
                reader feels the cover landing rather than snapping shut. */}
            <AnimatePresence>
              {exiting ? (
                <>
                  {/* dark backdrop dims the open spread under the cover */}
                  <motion.div
                    key="exit-backdrop"
                    aria-hidden="true"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: reduced ? 0.18 : 1.05, ease: EASE_PAPER }}
                    className="absolute inset-0 z-[14]"
                    style={{
                      background:
                        'radial-gradient(ellipse at center, rgba(36,22,8,0.78) 0%, rgba(20,12,4,0.92) 70%)',
                    }}
                  />

                  {/* the back cover — proportioned like the CLOSED book (one
                      page wide), centred, landing softly from a tilt + scale */}
                  <motion.div
                    key="backcover"
                    aria-hidden="true"
                    initial={{ opacity: 0, scale: 0.78, rotateY: -22, y: 14 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0, y: 0 }}
                    transition={{
                      duration: reduced ? 0.22 : 1.35,
                      ease: EASE_PAPER,
                      opacity: { duration: reduced ? 0.18 : 0.7, ease: 'easeOut' },
                    }}
                    className="absolute left-1/2 top-1/2 z-[16] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-[4px]"
                    style={{
                      /* closed-book proportions: ~46% of spread width (≈ one
                         page), 92% of spread height. Capped to keep it neat at
                         very wide viewports. */
                      width: 'min(46%, 26rem)',
                      height: '92%',
                      background:
                        'linear-gradient(135deg, #6d4527 0%, #7a4a28 42%, #5c391f 100%)',
                      transformOrigin: 'center center',
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden',
                      boxShadow:
                        '0 30px 60px -20px rgba(20,12,4,0.65), 0 10px 22px -10px rgba(20,12,4,0.5), inset 0 0 0 1px rgba(0,0,0,0.25)',
                    }}
                  >
                    {/* double gold frame, echoing the 3D cover */}
                    <span className="pointer-events-none absolute inset-5 border-[3px] border-[#d9a843]/85" />
                    <span className="pointer-events-none absolute inset-[1.75rem] border border-[#d9a843]/55" />
                    <div className="relative z-[1] px-6 text-center">
                      <h3 className="mt-3 font-heading text-[1.8rem] font-semibold leading-[1.05] text-[#eccd8a]">
                        {PRESENTATION.title}
                      </h3>
                      <p className="mt-2 font-heading text-sm italic text-[#d9a843]/90">
                        {PRESENTATION.kicker}
                      </p>
                      <span className="my-4 inline-block h-px w-10 bg-[#d9a843]/70" />
                      <p className="mt-5 font-sans text-[0.56rem] uppercase tracking-[0.28em] text-[#d9a843]/80">
                        Comienza el recorrido
                      </p>
                    </div>
                    {/* warm specular sweep across the leather, hinting at depth */}
                    <span
                      className="pointer-events-none absolute inset-0 mix-blend-soft-light"
                      style={{
                        background:
                          'linear-gradient(115deg, transparent 38%, rgba(255,236,180,0.32) 52%, transparent 66%)',
                      }}
                    />
                  </motion.div>
                </>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        {/* page-turn buttons */}
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={atFirst || busy || exiting}
          aria-label="Página anterior"
          className="absolute left-3 top-1/2 z-[6] flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-paper/85 text-ink shadow-md backdrop-blur transition-all hover:scale-105 disabled:pointer-events-none disabled:opacity-0"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={busy || exiting}
          aria-label={atLast ? 'Continuar al recorrido' : 'Página siguiente'}
          className="absolute right-3 top-1/2 z-[6] flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-paper/85 text-ink shadow-md backdrop-blur transition-all hover:scale-105 disabled:pointer-events-none disabled:opacity-0"
        >
          ›
        </button>
      </div>

      {/* controls under the book */}
      <div className="mt-6 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={onClose}
          disabled={exiting}
          className="font-sans text-[0.68rem] uppercase tracking-[0.22em] text-ink-faint transition-colors hover:text-ink disabled:opacity-40"
        >
          Cerrar el libro
        </button>
        <div className="flex items-center gap-2">
          {SPREADS.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Abrir parte ${i + 1}`}
              aria-current={i === spread ? 'true' : undefined}
              onClick={() => goToIndex(i)}
              disabled={busy || exiting}
              className="size-2 rounded-full transition-all disabled:cursor-default"
              style={{
                background: i === spread ? 'var(--ochre)' : 'color-mix(in oklch, var(--ink) 25%, transparent)',
                transform: i === spread ? 'scale(1.3)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      </div>

      {/* FULLSCREEN COLOR-GRADE — a warm radial vignette fades in over the
          viewport while the page underneath unlocks and scrolls to the first
          chapter; then fades out, revealing the next section in place. A single
          opacity keyframe ([0,1,1,0]) covers the swap so the reader never sees
          a hard cut between the book and the journey. The fade is long and
          gentle on purpose — closer to a film dissolve than a flash. */}
      <AnimatePresence>
        {exiting ? (
          <motion.div
            key="grade"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: reduced ? [0, 1, 0] : [0, 1, 1, 0] }}
            transition={
              reduced
                ? { duration: 0.6, times: [0, 0.5, 1], ease: 'linear' }
                : { duration: 2.8, times: [0, 0.38, 0.7, 1], ease: EASE_PAPER }
            }
            className="pointer-events-none fixed inset-0 z-[80]"
            style={{
              background:
                'radial-gradient(ellipse at center, color-mix(in oklch, var(--ochre) 70%, var(--paper)) 0%, var(--paper) 50%, color-mix(in oklch, var(--ink) 26%, var(--paper)) 100%)',
            }}
          />
        ) : null}
      </AnimatePresence>
    </motion.div>
  )
}
