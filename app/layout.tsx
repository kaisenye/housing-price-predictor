import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Housing Price Predictor',
  description: 'Predict housing prices based on square footage and bedroom count',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="container mx-auto px-4 py-8 max-w-xl">
          {children}
        </main>
      </body>
    </html>
  )
} 