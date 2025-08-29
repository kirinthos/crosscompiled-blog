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
// Dynamic import for KaTeX to avoid module resolution issues in development
let rehypeKatex: any = null;
import { visit } from 'unist-util-visit';
import { convertEmojis } from './emojis';

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

// Custom remark plugin to handle Mermaid diagrams
function remarkMermaid() {
  return (tree: any) => {
    visit(tree, 'code', (node: any) => {
      if (node.lang === 'mermaid') {
        // Convert mermaid code block to a custom HTML element
        node.type = 'html';
        node.value = `<div class="mermaid-diagram" data-mermaid="${encodeURIComponent(node.value)}"></div>`;
      }
    });
  };
}

// Custom remark plugin to handle Slack-style emoji syntax
function remarkEmojis() {
  return (tree: any) => {
    visit(tree, 'text', (node: any) => {
      if (node.value && typeof node.value === 'string') {
        const convertedText = convertEmojis(node.value);
        if (convertedText !== node.value) {
          node.value = convertedText;
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
  category?: string;
  filePath?: string;
}

// Helper function to recursively find all markdown files
function findMarkdownFiles(dir: string, baseDir: string = dir): Array<{fileName: string, fullPath: string, relativePath: string}> {
  const files: Array<{fileName: string, fullPath: string, relativePath: string}> = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Recursively search subdirectories
      files.push(...findMarkdownFiles(fullPath, baseDir));
    } else if (item.endsWith('.md')) {
      const relativePath = path.relative(baseDir, fullPath);
      files.push({
        fileName: item,
        fullPath,
        relativePath
      });
    }
  }
  
  return files;
}

export function getSortedPostsData(): BlogPost[] {
  // Get all markdown files recursively
  const markdownFiles = findMarkdownFiles(postsDirectory);
  const allPostsData = markdownFiles
    .map(({fileName, fullPath, relativePath}) => {
      // Create id from relative path without extension
      const id = relativePath.replace(/\.md$/, '').replace(/\\/g, '/');

      // Read markdown file as string
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Extract category from metadata or infer from directory structure
      let category = matterResult.data.category;
      if (!category) {
        const pathParts = relativePath.split(path.sep);
        if (pathParts.length > 1) {
          // If in subdirectory, use directory name as category
          category = pathParts[0];
        }
      }

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
        category: category || 'uncategorized',
        filePath: relativePath,
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
  const markdownFiles = findMarkdownFiles(postsDirectory);
  const allPostsData = markdownFiles
    .map(({fileName, fullPath, relativePath}) => {
      // Create id from relative path without extension
      const id = relativePath.replace(/\.md$/, '').replace(/\\/g, '/');

      // Read markdown file as string
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Extract category from metadata or infer from directory structure
      let category = matterResult.data.category;
      if (!category) {
        const pathParts = relativePath.split(path.sep);
        if (pathParts.length > 1) {
          // If in subdirectory, use directory name as category
          category = pathParts[0];
        }
      }

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
        category: category || 'uncategorized',
        filePath: relativePath,
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
  const markdownFiles = findMarkdownFiles(postsDirectory);
  return markdownFiles.map(({relativePath}) => {
    return {
      params: {
        id: relativePath.replace(/\.md$/, '').replace(/\\/g, '/'),
      },
    };
  });
}

export async function getPostData(id: string): Promise<BlogPost> {
  // Handle both direct files and subdirectory files
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Extract category from metadata or infer from directory structure
  let category = matterResult.data.category;
  if (!category) {
    const pathParts = id.split('/');
    if (pathParts.length > 1) {
      // If in subdirectory, use directory name as category
      category = pathParts[0];
    }
  }

  // Dynamically import KaTeX to avoid module resolution issues
  if (!rehypeKatex) {
    try {
      rehypeKatex = (await import('rehype-katex')).default;
    } catch (error) {
      console.warn('Failed to load rehype-katex, math rendering will be disabled:', error);
      rehypeKatex = () => {}; // No-op plugin
    }
  }

  // Use remark to convert markdown into HTML string with enhanced features
  const processedContent = await remark()
    .use(gfm) // GitHub Flavored Markdown support
    .use(remarkCallouts) // Custom callout boxes
    .use(remarkMermaid) // Custom Mermaid diagram handling
    .use(remarkEmojis) // Custom emoji conversion
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
    .use(rehypeKatex) // Math rendering (dynamically loaded)
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
    category: category || 'uncategorized',
    filePath: `${id}.md`,
    ...matterResult.data,
  } as BlogPost;
}

// Get all unique categories (includes drafts for navigation)
export function getCategories(): string[] {
  const posts = getAllPostsData();
  const categories = new Set<string>();
  
  posts.forEach(post => {
    if (post.category) {
      categories.add(post.category);
    }
  });
  
  return Array.from(categories).sort();
}

// Get posts by category
export function getPostsByCategory(category: string): BlogPost[] {
  const posts = getSortedPostsData();
  return posts.filter(post => post.category === category);
}