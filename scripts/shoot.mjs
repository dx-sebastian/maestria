import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const OUT = 'shots'
mkdirSync(OUT, { recursive: true })

const W = Number(process.argv[2] || 1440)
const H = Number(process.argv[3] || 900)
const URL = 'http://localhost:3000'

const browser = await chromium.launch({ args: ['--use-gl=angle', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 })
await page.emulateMedia({ reducedMotion: 'reduce' })

await page.goto(URL, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts && document.fonts.ready)
await page.waitForTimeout(1000)

// Walk down to trigger reveals + mount the 3D canvases.
await page.evaluate(async () => {
  const step = window.innerHeight * 0.5
  for (let y = 0; y <= document.body.scrollHeight; y += step) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 120))
  }
  window.scrollTo(0, 0)
})
await page.addStyleTag({
  content: '[style*="opacity:0"],[style*="opacity: 0"]{opacity:1 !important}',
})
await page.waitForTimeout(500)

// [name, selector, extraWaitMs] — 3D sections need longer to render/animate.
const shots = [
  ['01-hero', '#inicio', 300],
  ['02-abre-libro', '#abre', 2600],
  ['04-ruta', '#ruta', 2600],
  ['05-lunes', '#lunes', 400],
  ['06-martes', '#martes', 400],
  ['07-miercoles', '#miercoles', 400],
  ['08-jueves', '#jueves', 2200],
  ['09-viernes', '#viernes', 400],
  ['10-reflexion', '#reflexion', 500],
]

for (const [name, sel, wait] of shots) {
  await page.evaluate((s) => {
    const e = document.querySelector(s)
    const y = e.getBoundingClientRect().top + window.scrollY
    window.scrollTo(0, Math.max(0, y))
  }, sel)
  await page.waitForTimeout(wait)
  await page.screenshot({ path: `${OUT}/${name}.png` })
  console.log('shot', name)
}

// deep captures
const deep = [
  ['11-lunes-cita', '#lunes blockquote', 400],
  ['12-jueves-nota', '#jueves aside', 400],
  ['13-reflexion-cierre', '#reflexion > div:last-child', 2200],
  ['14-colofon', 'footer', 500],
]
for (const [name, sel, wait] of deep) {
  const e = page.locator(sel).first()
  if ((await e.count()) === 0) continue
  await page.evaluate((s) => {
    const el = document.querySelector(s)
    const r = el.getBoundingClientRect()
    const top = r.top + window.scrollY
    const y = r.height < window.innerHeight ? top - (window.innerHeight - r.height) / 2 : top - 100
    window.scrollTo(0, Math.max(0, y))
  }, sel)
  await page.waitForTimeout(wait)
  await page.screenshot({ path: `${OUT}/${name}.png` })
  console.log('shot', name)
}

await browser.close()
console.log('done')
