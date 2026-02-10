/* eslint-disable @typescript-eslint/no-explicit-any */
// disable no-explicit-any for the entire file because the AI doesn't know how to type up plugins
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import gfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { common } from 'lowlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
// Dynamic import for KaTeX to avoid module resolution issues in development
let rehypeKatex: any = null;
import { visit } from 'unist-util-visit';
import { convertEmojis, customEmojiMap, emojiMap } from './emojis';

const postsDirectory = path.join(process.cwd(), 'posts');

function renderInlineToHtml(nodes: any[]): string {
  return (nodes || []).map((c: any) => {
    if (c.type === 'text') {
      let text = (c.value || '')
        .replace(/\n\n+/g, '<br><br>')
        .replace(/\n/g, ' ');
      text = text
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
      return text;
    }
    if (c.type === 'strong') {
      return `<strong>${(c.children || []).map((sc: any) => sc.value || '').join('')}</strong>`;
    }
    if (c.type === 'emphasis') {
      return `<em>${(c.children || []).map((sc: any) => sc.value || '').join('')}</em>`;
    }
    if (c.type === 'inlineCode') {
      return `<code>${c.value || ''}</code>`;
    }
    if (c.type === 'link') {
      const linkText = (c.children || []).map((sc: any) => sc.value || '').join('');
      return `<a href="${c.url}">${linkText}</a>`;
    }
    return c.value || '';
  }).join('');
}

function renderListToHtml(listNode: any): string {
  const tag = listNode.ordered ? 'ol' : 'ul';
  const items = (listNode.children || []).map((li: any) => {
    const blocks = li.children || [];
    const parts = blocks.map((block: any) => {
      if (block.type === 'paragraph') {
        const html = renderInlineToHtml(block.children || []);
        return { html, type: 'paragraph' as const };
      }
      if (block.type === 'list') {
        return { html: renderListToHtml(block), type: 'list' as const };
      }
      return { html: '', type: 'other' as const };
    }).filter((p: { html: string }) => p.html);
    const wrapInP = blocks.length > 1 || blocks.some((b: any) => b.type === 'list');
    const content = parts.map(({ html, type }) =>
      wrapInP && type === 'paragraph' ? `<p>${html}</p>` : html
    ).join('');
    return `<li>${content}</li>`;
  }).join('');
  return `<${tag}>${items}</${tag}>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderBlockChildToHtml(child: any): { html: string; block: boolean } | null {
  if (child.type === 'paragraph') {
    return { html: renderInlineToHtml(child.children || []), block: false };
  }
  if (child.type === 'list') {
    return { html: renderListToHtml(child), block: true };
  }
  if (child.type === 'thematicBreak') {
    return { html: '<hr>', block: true };
  }
  if (child.type === 'code') {
    const langClass = child.lang ? `language-${child.lang}` : 'language-plaintext';
    return { html: `<pre><code class="${langClass}">${escapeHtml(child.value || '')}</code></pre>`, block: true };
  }
  if (child.type === 'heading') {
    const depth = Math.min(6, Math.max(1, child.depth ?? 2));
    const tag = `h${depth}`;
    return { html: `<${tag}>${renderInlineToHtml(child.children || [])}</${tag}>`, block: true };
  }
  return null;
}

function joinBlockParts(parts: { html: string; block: boolean }[]): string {
  return parts
    .map((p, i) => {
      const next = parts[i + 1];
      const needBreak = next && !p.block && !next.block;
      return p.html + (needBreak ? '<br><br>' : '');
    })
    .join('');
}

// Custom remark plugin to handle callout syntax
function remarkCallouts() {
  return (tree: any) => {
    visit(tree, 'blockquote', (node: any) => {
      const firstChild = node.children?.[0];
      if (firstChild?.type === 'paragraph') {
        const firstText = firstChild.children?.[0];
        if (firstText?.type === 'text' && firstText.value) {
          const calloutMatch = firstText.value.match(/^\[!(info|warning|danger|thought|success|error|note|tip|prompt|robot)\]\s*/i);
          if (calloutMatch) {
            const calloutType = calloutMatch[1].toLowerCase();
            firstText.value = firstText.value.replace(calloutMatch[0], '');

            node.type = 'html';
            node.value = `<div class="callout ${calloutType}">`;

            const contentParts = node.children
              .map((child: any) => renderBlockChildToHtml(child))
              .filter((p): p is { html: string; block: boolean } => p != null);

            const content = joinBlockParts(contentParts);
            const cleanContent = content.replace(/^\s+|\s+$/g, '');
            const contentWithEmojis = convertEmojis(cleanContent);
            node.value += contentWithEmojis + '</div>';
            delete node.children;
          }
        }
      }
    });
  };
}

// Custom remark plugin for collapsible sections: first line "?? Summary" or "??? Summary" (open by default)
function remarkCollapse() {
  return (tree: any) => {
    visit(tree, 'blockquote', (node: any) => {
      const firstChild = node.children?.[0];
      if (firstChild?.type !== 'paragraph') return;
      const firstText = firstChild.children?.[0];
      if (firstText?.type !== 'text' || !firstText.value) return;
      const match = firstText.value.match(/^\?\?\?\s+(.+)$/) ?? firstText.value.match(/^\?\?\s+(.+)$/);
      if (!match) return;
      const summary = match[1].trim();
      const openByDefault = firstText.value.startsWith('???');
      const rest = node.children.slice(1);
      const contentParts = rest
        .map((child: any) => renderBlockChildToHtml(child))
        .filter((p): p is { html: string; block: boolean } => p != null);
      const bodyHtml = contentParts.length
        ? `<div class="collapse-content">${convertEmojis(joinBlockParts(contentParts))}</div>`
        : '';
      const openAttr = openByDefault ? ' open' : '';
      node.type = 'html';
      node.value = `<details class="collapse"${openAttr}><summary class="collapse-summary">${convertEmojis(renderInlineToHtml(firstChild.children || []).replace(/^\?\?\s+|\?\?\?\s+/g, '').trim())}</summary>${bodyHtml}</details>`;
      delete node.children;
    });
  };
}

// Custom remark plugin to handle Mermaid diagrams
function remarkMermaid() {
  return (tree: any) => {
    visit(tree, 'code', (node: any) => {
      if (node.lang === 'mermaid') {
        // Convert mermaid code block to a custom HTML element
        // Properly escape the mermaid data to prevent JavaScript errors
        const escapedData = encodeURIComponent(node.value).replace(/'/g, '%27').replace(/"/g, '%22');
        node.type = 'html';
        node.value = `<div class="mermaid-diagram" data-mermaid="${escapedData}"></div>`;
      }
    });
  };
}

// Custom remark plugin to handle video embeds
function remarkVideo() {
  return (tree: any) => {
    visit(tree, 'paragraph', (node: any) => {
      // Look for paragraphs that contain only a video link
      if (node.children && node.children.length === 1) {
        const child = node.children[0];
        
        // Handle video syntax: ![Video description](path/to/video.mp4)
        if (child.type === 'image' && child.url && child.url.match(/\.(mp4|webm|ogg|mov)$/i)) {
          const videoProps = {
            src: child.url,
            alt: child.alt || '',
            controls: true
          };
          
          // Parse additional attributes from alt text if present
          // Format: ![Video description | autoplay | loop | muted | width:800 | height:600](video.mp4)
          if (child.alt) {
            const parts = child.alt.split('|').map((p: any) => p.trim());
            videoProps.alt = parts[0] || '';
            
            for (let i = 1; i < parts.length; i++) {
              const part = parts[i].toLowerCase();
              if (part === 'autoplay') {
                (videoProps as any).autoplay = true;
              } else if (part === 'loop') {
                (videoProps as any).loop = true;
              } else if (part === 'muted') {
                (videoProps as any).muted = true;
              } else if (part === 'no-controls') {
                videoProps.controls = false;
              } else if (part.startsWith('width:')) {
                (videoProps as any).width = part.split(':')[1];
              } else if (part.startsWith('height:')) {
                (videoProps as any).height = part.split(':')[1];
              } else if (part.startsWith('poster:')) {
                (videoProps as any).poster = part.split(':')[1];
              }
            }
          }
          
          node.type = 'html';
          node.value = `<div class="video-embed" data-video-props='${JSON.stringify(videoProps)}'></div>`;
        }
        
        // Handle direct video links in text: [video](path/to/video.mp4)
        else if (child.type === 'link' && child.url && child.url.match(/\.(mp4|webm|ogg|mov)$/i)) {
          const videoProps = {
            src: child.url,
            alt: child.children?.[0]?.value || 'Video',
            controls: true
          };
          
          node.type = 'html';
          node.value = `<div class="video-embed" data-video-props='${JSON.stringify(videoProps)}'></div>`;
        }
      }
    });
    
    // Also handle video syntax in text nodes: @video[description](path.mp4)
    visit(tree, 'text', (node: any, index: number | undefined, parent: any) => {
      if (node.value && typeof node.value === 'string') {
        const videoPattern = /@video\[([^\]]*)\]\(([^)]+\.(?:mp4|webm|ogg|mov))\)/gi;
        const matches: RegExpMatchArray[] = Array.from(node.value.matchAll(videoPattern));
        
        if (matches.length > 0) {
          const newNodes: any[] = [];
          let lastIndex = 0;
          
          for (const match of matches) {
            const fullMatch = match[0];
            const description = match[1];
            const videoUrl = match[2];
            const matchStart = match.index!;
            const matchEnd = matchStart + fullMatch.length;
            
            // Add text before the video (if any)
            if (matchStart > lastIndex) {
              const textBefore = node.value.substring(lastIndex, matchStart);
              if (textBefore) {
                newNodes.push({
                  type: 'text',
                  value: textBefore
                });
              }
            }
            
            // Add video embed
            const videoProps = {
              src: videoUrl,
              alt: description || 'Video',
              controls: true
            };
            
            newNodes.push({
              type: 'html',
              value: `<div class="video-embed" data-video-props='${JSON.stringify(videoProps)}'></div>`
            });
            
            lastIndex = matchEnd;
          }
          
          // Add remaining text after the last video (if any)
          if (lastIndex < node.value.length) {
            const textAfter = node.value.substring(lastIndex);
            if (textAfter) {
              newNodes.push({
                type: 'text',
                value: textAfter
              });
            }
          }
          
          // Replace the current node with the new nodes
          if (parent && typeof index === 'number') {
            parent.children.splice(index, 1, ...newNodes);
          }
        }
      }
    });
  };
}

// Custom remark plugin to handle Slack-style emoji syntax
function remarkEmojis() {
  return (tree: any) => {
    visit(tree, 'text', (node: any, index: number | undefined, parent: any) => {
      if (node.value && typeof node.value === 'string') {
        // Check if this text contains emoji patterns
        const emojiPattern = /:([a-zA-Z0-9-+-]+):/g;
        const matches: RegExpMatchArray[] = Array.from(node.value.matchAll(emojiPattern));
        
        if (matches.length > 0) {
          const newNodes: any[] = [];
          let lastIndex = 0;
          
          for (const match of matches) {
            const fullMatch = match[0];
            const emojiName = match[1];
            const matchStart = match.index!;
            const matchEnd = matchStart + fullMatch.length;
            
            // Add text before the emoji (if any)
            if (matchStart > lastIndex) {
              const textBefore = node.value.substring(lastIndex, matchStart);
              if (textBefore) {
                newNodes.push({
                  type: 'text',
                  value: textBefore
                });
              }
            }
            
            // Check for custom emoji first
            const lowerName = emojiName.toLowerCase();
            const customEmoji = customEmojiMap[lowerName];
            
            if (customEmoji) {
              // Create HTML node for custom emoji
              newNodes.push({
                type: 'html',
                value: `<img src="/images/${customEmoji}" alt="${emojiName}" class="inline-emoji" style="display: inline; width: 1.2em; height: 1.2em; vertical-align: text-bottom; margin: 0 0.1em;" />`
              });
            } else {
              // Check for Unicode emoji
              const unicodeEmoji = emojiMap[lowerName];
              if (unicodeEmoji) {
                newNodes.push({
                  type: 'text',
                  value: unicodeEmoji
                });
              } else {
                // Keep original text if emoji not found
                newNodes.push({
                  type: 'text',
                  value: fullMatch
                });
              }
            }
            
            lastIndex = matchEnd;
          }
          
          // Add remaining text after the last emoji (if any)
          if (lastIndex < node.value.length) {
            const textAfter = node.value.substring(lastIndex);
            if (textAfter) {
              newNodes.push({
                type: 'text',
                value: textAfter
              });
            }
          }
          
          // Replace the current node with the new nodes
          if (parent && typeof index === 'number') {
            parent.children.splice(index, 1, ...newNodes);
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

export function getSortedPostsData(includeDrafts: boolean = false): BlogPost[] {
  // Get all markdown files recursively
  const markdownFiles = findMarkdownFiles(postsDirectory);
  const allPostsData = markdownFiles
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        category: category || 'Miscellaneous',
        filePath: relativePath,
        ...matterResult.data,
      } as BlogPost;
    })
    .filter(post => includeDrafts || !post.draft);

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
    .use(remarkCollapse) // Collapsible details/summary
    .use(remarkMermaid) // Custom Mermaid diagram handling
    .use(remarkVideo) // Custom video embed handling
    .use(remarkEmojis) // Custom emoji conversion
    .use(remarkMath) // Math notation support
    .use(remarkRehype, { allowDangerousHtml: true }) // Convert remark AST to rehype AST
    // Parse raw HTML (callouts, collapse, mermaid) so later plugins can process inner nodes
    .use(rehypeRaw)
    .use(rehypeKatex) // Math rendering (dynamically loaded)
    .use(rehypeHighlight, {
      // Configure supported languages
      languages: {
        ...common,
      }
    }) // Syntax highlighting for code blocks (including those inside callouts/collapse)
    .use(rehypeSlug) // Add IDs to headings
    .use(rehypeAutolinkHeadings, {
      // Add clickable links to headings
      behavior: 'wrap',
      properties: {
        className: ['heading-link']
      }
    })
    .use(rehypeStringify) // Convert rehype AST to HTML string
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
export function getCategories(includeDrafts: boolean = false): string[] {
  const posts = getSortedPostsData(includeDrafts);
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