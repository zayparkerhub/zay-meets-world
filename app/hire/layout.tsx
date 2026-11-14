import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hire a Hero · Zay Meets World',
  description: 'Surprise someone you love, share a meal, or have a friend for the day. Hire Zay to show up for you.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
