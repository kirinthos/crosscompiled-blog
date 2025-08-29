'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface CategoryNavigationProps {
  categories: string[];
  postsByCategory: Record<string, Array<{
    id: string;
    title: string;
    date: string;
    category?: string;
  }>>;
}

export default function CategoryNavigation({ categories, postsByCategory }: CategoryNavigationProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  // Auto-expand category if we're viewing a post from that category
  useEffect(() => {
    if (pathname.startsWith('/posts/')) {
      const postId = pathname.replace('/posts/', '');
      for (const [category, posts] of Object.entries(postsByCategory)) {
        if (posts.some(post => post.id === postId)) {
          setExpandedCategories(prev => new Set(Array.from(prev).concat(category)));
          break;
        }
      }
    }
  }, [pathname, postsByCategory]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(Array.from(prev));
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background-primary border border-neutral-200 rounded-md shadow-md"
        aria-label="Toggle navigation"
      >
        <svg
          className="w-5 h-5 text-text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Navigation sidebar */}
      <nav
        className={`
          fixed lg:sticky top-0 left-0 h-screen lg:h-auto
          w-80 lg:w-64 xl:w-72
          bg-background-primary border-r border-neutral-200
          overflow-y-auto z-40
          transition-transform duration-300 ease-in-out
          ${isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
        `}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-text-primary">Categories</h2>
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-1 text-text-secondary hover:text-text-primary"
              aria-label="Close navigation"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* All Posts link */}
          <Link
            href="/"
            className={`
              block px-3 py-2 rounded-md text-sm font-medium mb-4
              transition-colors duration-200
              ${pathname === '/' 
                ? 'bg-primary-100 text-primary-800 border-l-4 border-primary-600' 
                : 'text-text-secondary hover:text-text-primary hover:bg-neutral-50'
              }
            `}
          >
            All Posts
          </Link>

          {/* Categories */}
          <div className="space-y-1">
            {categories.map((category) => {
              const posts = postsByCategory[category] || [];
              const isExpanded = expandedCategories.has(category);
              const categoryPosts = posts.length;

              return (
                <div key={category}>
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center justify-between px-3 py-2 text-left text-sm font-medium text-text-primary hover:bg-neutral-50 rounded-md transition-colors duration-200"
                  >
                    <span className="flex items-center">
                      <span className="capitalize">{category}</span>
                      <span className="ml-2 text-xs text-text-secondary bg-neutral-100 px-2 py-1 rounded-full">
                        {categoryPosts}
                      </span>
                    </span>
                    <svg
                      className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Posts in category */}
                  {isExpanded && (
                    <div className="ml-4 mt-1 space-y-1">
                      {posts.map((post) => (
                        <Link
                          key={post.id}
                          href={`/posts/${post.id}`}
                          className={`
                            block px-3 py-2 text-sm rounded-md
                            transition-colors duration-200
                            ${pathname === `/posts/${post.id}`
                              ? 'bg-primary-50 text-primary-700 border-l-2 border-primary-400'
                              : 'text-text-secondary hover:text-text-primary hover:bg-neutral-50'
                            }
                          `}
                        >
                          <div className="break-words leading-tight">{post.title}</div>
                          <div className="text-xs text-text-secondary mt-1">
                            {new Date(post.date).toLocaleDateString()}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
