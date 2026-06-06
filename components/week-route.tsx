'use client'

import dynamic from 'next/dynamic'
import { DIARY, type DayId } from '@/data/diario'
import { Reveal } from '@/components/reveal'
import { blurUp, fadeUpSmall } from '@/lib/motion'

const RouteDiorama = dynamic(
  () => import('@/components/three/route-diorama').then((m) => m.RouteDiorama),
  { ssr: false, loading: () => <RouteSkeleton /> },
)

const VW = 1000
const VH = 520

function toXY([x, y]: [number, number]): [number, number] {
  return [(x / 100) * VW, (y / 100) * VH]
}

function smoothPath(points: [number, number][]): string {
  if (points.length < 2) return ''
  let d = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return d
}

function go(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function RouteSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-ink-faint">
        <span className="size-8 animate-spin rounded-full border-2 border-border border-t-ochre" />
        <span className="font-hand text-lg">desplegando el territorio…</span>
      </div>
    </div>
  )
}

/** 2D hand-drawn route used when WebGL is unavailable. */
function RouteSvgFallback({ onSelect }: { onSelect: (id: DayId) => void }) {
  const nodes = DIARY.map((d) => {
    const [x, y] = toXY(d.coord)
    return { ...d, x, y }
  })
  const routePoints: [number, number][] = [
    [-30, VH * 0.86],
    ...nodes.map((n) => [n.x, n.y] as [number, number]),
    [VW + 40, VH * 0.42],
  ]
  const d = smoothPath(routePoints)
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="h-full w-full" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="route-ink-fb" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--ochre)" />
          <stop offset="28%" stopColor="var(--slate)" />
          <stop offset="52%" stopColor="var(--moss)" />
          <stop offset="74%" stopColor="var(--jade)" />
          <stop offset="100%" stopColor="var(--dusk)" />
        </linearGradient>
      </defs>
      <path d={d} fill="none" stroke="url(#route-ink-fb)" strokeWidth={3.4} strokeLinecap="round" />
      {nodes.map((n) => {
        const above = n.y < VH * 0.5
        const ly = above ? n.y - 42 : n.y + 48
        return (
          <g key={n.id} className="cursor-pointer" onClick={() => onSelect(n.id)}>
            <circle cx={n.x} cy={n.y} r={36} fill="transparent" />
            <circle cx={n.x} cy={n.y} r={16} fill="var(--paper-raised)" stroke={n.accent} strokeWidth={2.4} />
            <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="central" style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 600, fontSize: 16, fill: n.accent }}>
              {n.index}
            </text>
            <text x={n.x} y={ly} textAnchor="middle" style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 600, fontSize: 20, fill: 'var(--ink)' }}>
              {n.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export function WeekRoute() {
  return (
    <section id="ruta" className="relative mx-auto w-full max-w-6xl scroll-mt-24 px-8 py-28">
      <Reveal className="mx-auto max-w-2xl text-center" variants={fadeUpSmall}>
        <p className="eyebrow text-ochre">La ruta de la semana</p>
        <h2 className="mt-4 font-heading text-[2.4rem] font-semibold leading-[1.08] tracking-[-0.02em] text-ink md:text-[3rem]">
          Cinco estaciones de un mismo territorio
        </h2>
        <p className="mx-auto mt-5 max-w-xl font-body text-lg leading-relaxed text-ink-soft">
          Cada jornada es una estación en el recorrido de la escuela. Elige una estación
          en el mapa para entrar directamente a su página del diario.
        </p>
      </Reveal>

      <Reveal variants={blurUp} className="mt-14">
        <figure className="paper-grain dot-grid relative h-[64vh] min-h-[480px] overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-paper-raised to-paper-deep/50 shadow-[0_30px_80px_-50px_rgba(60,45,15,0.6)]">
          <span className="pointer-events-none absolute left-5 top-5 z-[2] font-hand text-2xl text-ink-soft/50">
            Bitácora · semana de campo
          </span>
          <span className="pointer-events-none absolute right-6 top-5 z-[2] font-sans text-[0.65rem] uppercase tracking-[0.3em] text-ink-soft/45">
            Medellín
          </span>
          <RouteDiorama onSelect={go} fallback={<RouteSvgFallback onSelect={go} />} />
          <p className="pointer-events-none absolute bottom-4 left-1/2 z-[2] -translate-x-1/2 font-hand text-lg text-ink-soft/70">
            Elige una estación para abrir su jornada
          </p>
        </figure>
      </Reveal>
    </section>
  )
}
