'use client'

import { useCallback, useState } from 'react'
import { BookGateway } from '@/components/book-gateway'
import { DayChapter } from '@/components/day-chapter'
import { Reflection } from '@/components/reflection'
import { Colophon } from '@/components/colophon'
import { ProgressRail } from '@/components/progress-rail'
import { DayFooter } from '@/components/day-footer'
import { DIARY } from '@/data/diario'

/**
 * Orchestrates the gated experience: the reader cannot reach the journey until
 * they have opened the book and read Santiago's presentation. Only on
 * "Comenzar el recorrido" is the rest of the content mounted and revealed.
 */
export function Experience() {
  const [unlocked, setUnlocked] = useState(false)

  const unlock = useCallback(() => {
    setUnlocked(true)
    requestAnimationFrame(() => {
      window.setTimeout(() => {
        document.getElementById('lunes')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 90)
    })
  }, [])

  return (
    <main className="relative bg-background">
      <BookGateway onStart={unlock} />
      {unlocked ? (
        <>
          <ProgressRail />
          {DIARY.map((day) => (
            <DayChapter key={day.id} day={day} />
          ))}
          <Reflection />
          <Colophon />
          <DayFooter />
        </>
      ) : null}
    </main>
  )
}
