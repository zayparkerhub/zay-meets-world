import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  title: 'Zay Meets World',
  description: "We're filming human connection across America. You write the roadmap.",
  metadataBase: new URL('https://zaymeetsworld.com'),
  openGraph: {
    title: 'Zay Meets World',
    description: "We're filming human connection across America. You write the roadmap.",
    siteName: 'Zay Meets World',
    url: 'https://zaymeetsworld.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zay Meets World',
    description: "We're filming human connection across America. You write the roadmap.",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body>{children}</body>
    </html>
  )
}
