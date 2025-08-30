import Link from 'next/link';
import { getSortedPostsData, BlogPost } from '@/lib/markdown';
import { format, parseISO } from 'date-fns';

export default function Home() {
  // In development, show all posts including drafts
  const allPostsData = getSortedPostsData(process.env.NODE_ENV === 'development');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-text-primary mb-4">Latest Posts</h1>
        <p className="text-xl text-text-secondary">
          Welcome to my blog where I share insights about software development, engineering practices, and technology.
        </p>
      </div>

      <div className="space-y-6">
        {allPostsData.map((post: BlogPost) => (
          <article key={post.id} className={`bg-background-primary rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 border ${post.draft ? 'border-status-warning bg-yellow-50' : 'border-neutral-100'}`}>
            <Link href={`/posts/${post.id}`} className="block group">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-semibold text-text-primary group-hover:text-primary-600 transition-colors duration-200">
                  {post.title}
                </h2>
                {post.draft && (
                  <span className="px-2 py-1 bg-status-warning text-white text-xs rounded-full font-medium">
                    DRAFT
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm text-text-muted mb-3">
                <time dateTime={post.date}>
                  {format(parseISO(post.date), 'MMMM d, yyyy')}
                </time>
                {post.author && <span>by {post.author}</span>}
              </div>
              {post.excerpt && (
                <p className="text-text-secondary leading-relaxed mb-4">
                  {post.excerpt}
                </p>
              )}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full border border-primary-200 hover:bg-primary-100 transition-colors duration-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          </article>
        ))}
      </div>

      {allPostsData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-text-muted text-lg">
            No blog posts yet. Create your first post in the <code className="bg-background-accent px-2 py-1 rounded text-primary-700">posts/</code> directory!
          </p>
        </div>
      )}
    </div>
  );
}