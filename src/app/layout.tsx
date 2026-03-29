import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Providers from '@/components/layout/Providers'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: {
    default: 'Smart Government Service Navigator',
    template: '%s | GovNavigator BD',
  },
  description: 'Find and navigate government services in Bangladesh easily and quickly.',
  keywords: ['government', 'services', 'Bangladesh', 'passport', 'NID', 'trade license'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
