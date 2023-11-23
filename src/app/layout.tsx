import './globals.css'
import {Inter} from 'next/font/google'
import {Metadata} from 'next'

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
  title: 'OpenCODETISAN',
  description: 'Open source technical assessment software.',
}

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en">
      <body className={`${inter.className} bg-stone-50 min-h-screen`}>
        {children}
      </body>
      </html>
    )
  }
