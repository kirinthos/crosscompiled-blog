import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeKatex from 'rehype-katex';
import { visit } from 'unist-util-visit';

const postsDirectory = path.join(process.cwd(), 'posts');

// Custom remark plugin to handle callout syntax
function remarkCallouts() {
  return (tree: any) => {
    visit(tree, 'blockquote', (node: any) => {
      // Look for blockquotes that start with a callout indicator
      const firstChild = node.children?.[0];
      if (firstChild?.type === 'paragraph') {
        const firstText = firstChild.children?.[0];
        if (firstText?.type === 'text' && firstText.value) {
          const calloutMatch = firstText.value.match(/^\[!(info|warning|danger|thought|success|error|note|tip|prompt|robot)\]\s*/i);
          if (calloutMatch) {
            const calloutType = calloutMatch[1].toLowerCase();
            
            // Remove the callout indicator from the text
            firstText.value = firstText.value.replace(calloutMatch[0], '');
            
            // Transform the blockquote into a div with callout classes
            node.type = 'html';
            node.value = `<div class="callout ${calloutType}">`;
            
            // Process the content
            const content = node.children.map((child: any) => {
              if (child.type === 'paragraph') {
                return child.children.map((c: any) => c.value || '').join('');
              }
              return '';
            }).join('\n\n');
            
            // Clean up the content and close the div
            const cleanContent = content.replace(/^\s+|\s+$/g, '');
            node.value += cleanContent + '</div>';
            
            // Remove children since we've converted to HTML
            delete node.children;
          }
        }
      }
    });
  };
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt?: string;
  tags?: string[];
  author?: string;
  content: string;
  draft?: boolean;
}

export function getSortedPostsData(): BlogPost[] {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      // Remove ".md" from file name to get id
      const id = fileName.replace(/\.md$/, '');

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Combine the data with the id
      return {
        id,
        title: matterResult.data.title || id,
        date: matterResult.data.date || new Date().toISOString(),
        excerpt: matterResult.data.excerpt || '',
        tags: matterResult.data.tags || [],
        author: matterResult.data.author || '',
        content: matterResult.content,
        draft: matterResult.data.draft || false,
        ...matterResult.data,
      } as BlogPost;
    })
    .filter(post => !post.draft); // Filter out draft posts in production

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostsData(): BlogPost[] {
  // Same as getSortedPostsData but includes drafts (for development)
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      // Remove ".md" from file name to get id
      const id = fileName.replace(/\.md$/, '');

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Combine the data with the id
      return {
        id,
        title: matterResult.data.title || id,
        date: matterResult.data.date || new Date().toISOString(),
        excerpt: matterResult.data.excerpt || '',
        tags: matterResult.data.tags || [],
        author: matterResult.data.author || '',
        content: matterResult.content,
        draft: matterResult.data.draft || false,
        ...matterResult.data,
      } as BlogPost;
    });

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      return {
        params: {
          id: fileName.replace(/\.md$/, ''),
        },
      };
    });
}

export async function getPostData(id: string): Promise<BlogPost> {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string with enhanced features
  const processedContent = await remark()
    .use(gfm) // GitHub Flavored Markdown support
    .use(remarkCallouts) // Custom callout boxes
    .use(remarkMath) // Math notation support
    .use(html, { sanitize: false })
    .use(rehypeHighlight) // Syntax highlighting for code blocks
    .use(rehypeSlug) // Add IDs to headings
    .use(rehypeAutolinkHeadings, {
      // Add clickable links to headings
      behavior: 'wrap',
      properties: {
        className: ['heading-link']
      }
    })
    .use(rehypeKatex) // Math rendering
    .process(matterResult.content);
  
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    id,
    title: matterResult.data.title || id,
    date: matterResult.data.date || new Date().toISOString(),
    excerpt: matterResult.data.excerpt || '',
    tags: matterResult.data.tags || [],
    author: matterResult.data.author || '',
    content: contentHtml,
    ...matterResult.data,
  } as BlogPost;
}