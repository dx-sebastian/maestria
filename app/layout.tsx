import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Fraunces, Inter, Caveat, Newsreader } from 'next/font/google'
import { assetPath } from '@/lib/assets'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  axes: ['opsz', 'SOFT', 'WONK'],
})

const newsreader = Newsreader({
  variable: '--font-newsreader',
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
})

const caveat = Caveat({
  variable: '--font-caveat',
  subsets: ['latin'],
  display: 'swap',
})

const showAnalytics = process.env.NODE_ENV === 'production' && process.env.GITHUB_PAGES !== 'true'

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ),
  title: 'Diario Lúdico:',
  description:
    'Mi nombre es Santiago Londoño. Soy docente de lengua castellana y filosofía en una institución educativa pública de la ciudad de Medellín.',
  authors: [{ name: 'Santiago Londoño' }],
  keywords: [
    'educación',
    'lúdica',
    'pedagogía',
    'diario de campo',
    'escuela',
    'realismo mágico',
    'filosofía',
    'lectura crítica',
  ],
  openGraph: {
    title: 'Diario Lúdico:',
    description:
      'Mi nombre es Santiago Londoño. Soy docente de lengua castellana y filosofía en una institución educativa pública de la ciudad de Medellín.',
    type: 'article',
    locale: 'es_CO',
  },
}

export const viewport: Viewport = {
  themeColor: [{ media: '(prefers-color-scheme: light)', color: '#f2ead6' }],
  colorScheme: 'light',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${fraunces.variable} ${newsreader.variable} ${caveat.variable}`}
    >
      <body
        className="font-sans antialiased"
        suppressHydrationWarning
        style={{ ['--paper-texture' as string]: `url("${assetPath('/images/paper-texture.png')}")` }}
      >
        {children}
        {showAnalytics && <Analytics />}
      </body>
    </html>
  )
}
