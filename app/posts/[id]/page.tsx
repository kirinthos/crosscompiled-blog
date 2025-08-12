import { getAllPostIds, getPostData } from '@/lib/markdown';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';

export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths.map((path) => ({
    id: path.params.id,
  }));
}

export default async function Post({ params }: { params: { id: string } }) {
  const postData = await getPostData(params.id);

  return (
    <article className="bg-background-primary rounded-lg shadow-md overflow-hidden border border-neutral-100">
      <div className="px-8 py-6">
        <Link 
          href="/" 
          className="inline-flex items-center text-primary-600 hover:text-primary-800 mb-6 transition-colors duration-200 font-medium"
        >
          ← Back to all posts
        </Link>
        
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl font-bold text-text-primary">
              {postData.title}
            </h1>
            {postData.draft && (
              <span className="px-3 py-1 bg-status-warning text-white text-sm rounded-full font-medium">
                DRAFT
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-4 text-text-secondary mb-4">
            <time dateTime={postData.date}>
              {format(parseISO(postData.date), 'MMMM d, yyyy')}
            </time>
            {postData.author && <span>by {postData.author}</span>}
          </div>
          
          {postData.tags && postData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {postData.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full border border-primary-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: postData.content }}
        />
      </div>
    </article>
  );
}