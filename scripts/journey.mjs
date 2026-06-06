import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

mkdirSync('shots', { recursive: true })
const browser = await chromium.launch({ args: ['--use-gl=angle', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
await page.emulateMedia({ reducedMotion: 'no-preference' })
const errors = []
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))

const shot = (n) => page.screenshot({ path: `shots/${n}.png` })
const scrollTo = async (sel, off = 0) =>
  page.evaluate(([s, o]) => { const e = document.querySelector(s); if (e) window.scrollTo({ top: e.getBoundingClientRect().top + window.scrollY + o, behavior: 'instant' }) }, [sel, off])

await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)

const lockedHasDays = await page.evaluate(() => !!document.getElementById('lunes'))
console.log('GATE — días presentes antes de abrir el libro (debe ser false):', lockedHasDays)

await scrollTo('#abre')
await page.waitForTimeout(1500)
await shot('j1-libro-cerrado')

await page.getByRole('button', { name: /Abrir el libro/i }).click({ force: true })
await page.waitForTimeout(1200)
await shot('j2-libro-abierto')

// turn through the presentation; the › button advances and, at the last page,
// becomes "Continuar al recorrido" and triggers the exit → onStart() → unlock.
const clickNext = () => page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find((x) => /siguiente|continuar al recorrido/i.test(x.getAttribute('aria-label') || ''))
  if (b) b.click()
})
await clickNext(); await page.waitForTimeout(360)
await shot('j2a-volteo')
await page.waitForTimeout(900)              // settle on spread 2
await clickNext(); await page.waitForTimeout(360)
await shot('j2c-volteo')
await page.waitForTimeout(900)              // settle on spread 3 (last)
await shot('j2d-ultima')
await clickNext()                           // "Continuar al recorrido" → exit
await page.waitForTimeout(2200)             // exit choreography + unlock

const unlockedHasDays = await page.evaluate(() => !!document.getElementById('lunes'))
console.log('GATE — días presentes tras comenzar (debe ser true):', unlockedHasDays)

const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes']
let i = 3
for (const d of days) {
  await scrollTo('#' + d, 8)
  await page.waitForTimeout(d === 'jueves' ? 2000 : 900)
  await shot(`j${i++}-${d}-top`)
  // a reading shot (scroll past the title into the panel)
  await page.evaluate(() => window.scrollBy(0, Math.round(window.innerHeight * 1.25)))
  await page.waitForTimeout(700)
  await shot(`j${i++}-${d}-lee`)
}
await scrollTo('#reflexion')
await page.waitForTimeout(900)
await shot(`j${i++}-reflexion`)

console.log('CONSOLE ERRORS:', errors.length)
errors.slice(0, 25).forEach((e) => console.log('•', e.slice(0, 200)))
await browser.close()
console.log(errors.length ? 'ERRORS' : 'CLEAN')
