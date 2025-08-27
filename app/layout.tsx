import './globals.css'
import { Inter } from 'next/font/google'
import MermaidInitializer from '../components/MermaidInitializer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CrossCompiled Blog',
  description: 'A technical blog about software development and engineering',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background-secondary">
          <header className="bg-background-primary shadow-sm border-b border-neutral-200">
            <div className="max-w-4xl mx-auto px-4 py-6">
              <h1 className="text-3xl font-bold text-text-primary">
                <a href="/" className="hover:text-primary-600 transition-colors duration-200">
                  CrossCompiled Blog
                </a>
              </h1>
              <p className="text-text-secondary mt-2">
                Cross compiled perspective on technology.
              </p>
            </div>
          </header>
          <main className="max-w-4xl mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="bg-background-primary border-t border-neutral-200 mt-16">
            <div className="max-w-4xl mx-auto px-4 py-8 text-center text-text-secondary">
              <p>&copy; 2024 CrossCompiled Blog. Built with Next.js and deployed with GitHub Actions.</p>
            </div>
          </footer>
        </div>
        <MermaidInitializer />
      </body>
    </html>
  )
}