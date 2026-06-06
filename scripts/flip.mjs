import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

mkdirSync('shots/flip', { recursive: true })
const browser = await chromium.launch({ args: ['--use-gl=angle', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
await page.emulateMedia({ reducedMotion: 'no-preference' })
const errors = []
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })

await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)
await page.getByRole('button', { name: /Abrir el libro/i }).click({ force: true })
await page.waitForTimeout(1400)

const clickNext = () => page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find((x) => /Página siguiente/i.test(x.getAttribute('aria-label') || ''))
  if (b) b.click()
})
const clickPrev = () => page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find((x) => /Página anterior/i.test(x.getAttribute('aria-label') || ''))
  if (b) b.click()
})

// each sample: trigger a turn, take ONE screenshot at a precise mid-turn delay
async function sample(name, trigger, delay) {
  await trigger()
  await page.waitForTimeout(delay)
  await page.screenshot({ path: `shots/flip/${name}.png` })
  await page.waitForTimeout(1100) // let the turn fully settle before the next
}

await sample('turn-a-300', clickNext, 300) // 0->1, early lift
await sample('turn-b-560', clickNext, 560) // 1->2, past vertical (back face)
await sample('turn-c-prev-420', clickPrev, 420) // 2->1, reverse direction

console.log('CONSOLE ERRORS:', errors.length)
errors.slice(0, 8).forEach((e) => console.log('•', e.slice(0, 150)))
await browser.close()
console.log('done')
