import { chromium } from 'playwright'

const URL = 'http://localhost:3000'
const browser = await chromium.launch({ args: ['--use-gl=angle', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })

const errors = []
const warnings = []
page.on('console', (msg) => {
  const t = msg.type()
  const text = msg.text()
  if (t === 'error') errors.push(text)
  else if (t === 'warning' && !/Download the React DevTools|Reduced Motion/.test(text)) warnings.push(text)
})
page.on('pageerror', (err) => errors.push('PAGEERROR: ' + err.message))

await page.goto(URL, { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)
// scroll through to mount/exercise every 3D canvas + reveals
await page.evaluate(async () => {
  const step = window.innerHeight * 0.45
  for (let y = 0; y <= document.body.scrollHeight; y += step) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 220))
  }
})
await page.waitForTimeout(1500)
// scroll back up too
await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(800)

console.log('=== CONSOLE ERRORS:', errors.length, '===')
errors.slice(0, 30).forEach((e) => console.log('•', e.slice(0, 240)))
console.log('=== NON-trivial WARNINGS:', warnings.length, '===')
warnings.slice(0, 15).forEach((w) => console.log('•', w.slice(0, 200)))

// quick WebGL sanity: how many canvases mounted
const canvases = await page.evaluate(() => document.querySelectorAll('canvas').length)
console.log('canvas elements present:', canvases)

await browser.close()
console.log(errors.length === 0 ? 'RESULT: CLEAN' : 'RESULT: ERRORS FOUND')
