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
            
            // Process the content with proper markdown line break handling and inline formatting
            const content = node.children.map((child: any) => {
              if (child.type === 'paragraph') {
                return child.children.map((c: any) => {
                  if (c.type === 'text') {
                    // Handle markdown-style line breaks: only double newlines create breaks
                    // Single newlines (from editor wrapping) are treated as spaces
                    let text = (c.value || '')
                      .replace(/\n\n+/g, '<br><br>') // Double+ newlines become paragraph breaks
                      .replace(/\n/g, ' '); // Single newlines become spaces
                    
                    // Process inline markdown formatting
                    text = text
                      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') // Bold
                      .replace(/\*([^*]+)\*/g, '<em>$1</em>') // Italic
                      .replace(/`([^`]+)`/g, '<code>$1</code>') // Inline code
                      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>'); // Links
                    
                    return text;
                  }
                  if (c.type === 'strong') {
                    return `<strong>${c.children.map((sc: any) => sc.value || '').join('')}</strong>`;
                  }
                  if (c.type === 'emphasis') {
                    return `<em>${c.children.map((sc: any) => sc.value || '').join('')}</em>`;
                  }
                  if (c.type === 'inlineCode') {
                    return `<code>${c.value || ''}</code>`;
                  }
                  if (c.type === 'link') {
                    const linkText = c.children.map((sc: any) => sc.value || '').join('');
                    return `<a href="${c.url}">${linkText}</a>`;
                  }
                  return c.value || '';
                }).join('');
              }
              return '';
            }).join('<br><br>');
            
            // Clean up the content and convert emojis
            const cleanContent = content.replace(/^\s+|\s+$/g, '');
            const contentWithEmojis = convertEmojis(cleanContent);
            node.value += contentWithEmojis + '</div>';
            
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
            const parts = child.alt.split('|').map(p => p.trim());
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
          
          // Convert to video player component
          const propsString = Object.entries(videoProps)
            .map(([key, value]) => {
              if (typeof value === 'boolean') {
                return value ? key : '';
              }
              return `${key}="${value}"`;
            })
            .filter(Boolean)
            .join(' ');
          
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
            const { customEmojiMap, emojiMap } = require('./emojis');
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
    .use(remarkMermaid) // Custom Mermaid diagram handling
    .use(remarkVideo) // Custom video embed handling
    .use(remarkEmojis) // Custom emoji conversion
    .use(remarkMath) // Math notation support
    .use(remarkRehype, { allowDangerousHtml: true }) // Convert remark AST to rehype AST
    // After remarkRehype, we've converted the markdown AST into the html AST
    // so we'll apply the rehype plugins now
    .use(rehypeKatex) // Math rendering (dynamically loaded)
    .use(rehypeHighlight, {
      // Configure supported languages
      languages: {
        ...common,
      }
    }) // Syntax highlighting for code blocks
    .use(rehypeSlug) // Add IDs to headings
    .use(rehypeAutolinkHeadings, {
      // Add clickable links to headings
      behavior: 'wrap',
      properties: {
        className: ['heading-link']
      }
    })
    .use(rehypeRaw)
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