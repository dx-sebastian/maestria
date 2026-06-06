import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

mkdirSync('shots', { recursive: true })
const browser = await chromium.launch({ args: ['--use-gl=angle', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
const errors = []
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))

await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)
await page.evaluate(() => {
  const y = document.getElementById('abre').getBoundingClientRect().top + window.scrollY
  window.scrollTo({ top: y, behavior: 'instant' })
})
await page.waitForTimeout(1600)
await page.screenshot({ path: 'shots/book-1-closed.png' })

await page.getByRole('button', { name: /Abrir el libro/i }).click({ force: true })
await page.waitForTimeout(2200)
await page.screenshot({ path: 'shots/book-2-open.png' })

const next = page.getByRole('button', { name: /Página siguiente/i })
await next.click({ force: true })
await page.waitForTimeout(900)
await page.screenshot({ path: 'shots/book-3.png' })
await next.click({ force: true })
await page.waitForTimeout(900)
await page.screenshot({ path: 'shots/book-4.png' })

console.log('CONSOLE ERRORS:', errors.length)
errors.slice(0, 20).forEach((e) => console.log('•', e.slice(0, 200)))
await browser.close()
console.log(errors.length ? 'ERRORS' : 'CLEAN')
