import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Christmas Wishlist · Zay Meets World',
  description: 'Nominate someone who could use a little Christmas magic this year, or share your own wish.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
