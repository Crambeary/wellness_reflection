import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/header'
import { Providers } from './providers'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css'
import { ThemeProvider } from 'next-themes'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Wellness Reflection',
  description: 'Track your daily wellness journey',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap" rel="stylesheet"/>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='anonymous' />
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap" rel="stylesheet"></link>
        <link rel='icon' href='/logo.svg' type='image/svg' sizes='16x16' />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Elevate" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta property="og:image" content="/opengraph-image.png" />
        {/* <!-- HTML Meta Tags --> */}
        <title>Wellness Reflection</title>
        <meta name="description" content="Track your daily wellness journey"/>

        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content="https://wellness-reflection.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Wellness Reflection" />
        <meta property="og:description" content="Track your daily wellness journey" />
        <meta property="og:image" content="https://wellness-reflection.vercel.app/opengraph-image.png" />

        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="wellness-reflection.vercel.app" />
        <meta property="twitter:url" content="https://wellness-reflection.vercel.app/" />
        <meta name="twitter:title" content="Wellness Reflection" />
        <meta name="twitter:description" content="Track your daily wellness journey" />
        <meta name="twitter:image" content="https://wellness-reflection.vercel.app/opengraph-image.png" />

        {/* <!-- Meta Tags Generated via https://www.opengraph.xyz --> */}
        </head>
      <body className={`${inter.className} `} >
        <ThemeProvider attribute="data-bs-theme" defaultTheme="dark">
          <Providers>
            <Header />
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}