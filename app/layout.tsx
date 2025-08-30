import './globals.css'
import { Inter } from 'next/font/google'
import MermaidInitializer from '../components/MermaidInitializer'
import CategoryNavigation from '../components/CategoryNavigation'
import { getCategories, getPostsByCategory, getSortedPostsData } from '@/lib/markdown'

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
  // Get categories and posts for navigation
  const categories = getCategories(process.env.NODE_ENV === 'development');
  const postsByCategory: Record<string, Array<{
    id: string;
    title: string;
    date: string;
    category?: string;
  }>> = {};

  categories.forEach(category => {
    // In development, show all posts including drafts; in production, exclude drafts
    const allPosts = getSortedPostsData(process.env.NODE_ENV === 'development');
    const posts = allPosts.filter(post => post.category === category);
    postsByCategory[category] = posts.map(post => ({
      id: post.id,
      title: post.title,
      date: post.date,
      category: post.category,
    }));
  });

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background-secondary">
          {/* Header */}
          <header className="bg-background-primary shadow-sm border-b border-neutral-200 w-full">
            <div className="w-full pl-16 pr-4 lg:px-8 py-6">
              <div className="flex items-start justify-between lg:ml-64 max-w-none">
                <div>
                  <h1 className="text-3xl font-bold text-text-primary">
                    <a href="/" className="hover:text-primary-600 transition-colors duration-200">
                      CrossCompiled Blog
                    </a>
                  </h1>
                  <p className="text-text-secondary mt-2">
                    Cross compiled perspective on technology.
                  </p>
                </div>
                
                {/* Social Links */}
                <div className="flex items-center space-x-4 mt-1 lg:mr-4">
                  {/* Email */}
                  <a
                    href="mailto:blog@crosscompiled.com"
                    className="text-text-secondary hover:text-primary-600 transition-colors duration-200"
                    title="Email: blog@crosscompiled.com"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </a>
                  
                  {/* Twitter/X - Commented out for now */}
                  {/* <a
                    href="https://x.com/CrossCompiled"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary hover:text-primary-600 transition-colors duration-200"
                    title="Follow @CrossCompiled on X"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a> */}
                </div>
              </div>
            </div>
          </header>

          {/* Layout with sidebar */}
          <div className="flex">
            {/* Navigation Sidebar */}
            <CategoryNavigation 
              categories={categories} 
              postsByCategory={postsByCategory} 
            />

            {/* Main Content */}
            <main className="flex-1">
              <div className="max-w-4xl mx-auto lg:px-8 py-8">
                {children}
              </div>
            </main>
          </div>

          {/* Footer */}
          <footer className="bg-background-primary border-t border-neutral-200 mt-16">
            <div className="lg:ml-64 xl:ml-72">
              <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 text-center text-text-secondary">
                <p>&copy; 2025 CrossCompiled Blog.</p>
              </div>
            </div>
          </footer>
        </div>
        <MermaidInitializer />
      </body>
    </html>
  )
}