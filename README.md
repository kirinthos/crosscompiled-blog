# CrossCompiled Blog

A modern static blog built with Next.js, TypeScript, and Tailwind CSS. Write
your blog posts in Markdown and deploy automatically to AWS S3 using GitHub
Actions.

## Features

- 📝 **Markdown Support**: Write posts in Markdown with full GitHub Flavored
  Markdown support
- 🎨 **Modern Design**: Clean, responsive design with Tailwind CSS
- ⚡ **Static Generation**: Fast loading with Next.js static site generation
- 🚀 **Auto Deployment**: Automatic deployment to S3 via GitHub Actions
- 🏷️ **Tags & Metadata**: Support for tags, excerpts, and post metadata
- 📱 **Responsive**: Mobile-first responsive design
- 🔍 **SEO Friendly**: Optimized for search engines

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn
- AWS account (for deployment)
- GitHub repository

### Local Development

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd crosscompiled-blog
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev          # Basic development server
   npm run dev:watch    # Enhanced file watching (recommended)
   ```

4. **Open your browser** Visit [http://localhost:3000](http://localhost:3000)

### 🔥 Live Editing Features

Your blog now supports **real-time editing**:

- **📝 Markdown Posts**: Edit `.md` files and see changes instantly
- **🎨 Theme Updates**: Modify `theme.config.js` for live color changes
- **⚙️ Configuration**: Auto-restart on config file changes
- **🎯 Draft Support**: Drafts show with visual indicators in development

**Enhanced Development:**

```bash
npm run dev:watch    # Advanced file watching with notifications
```

### Production Preview

To test the production build locally:

```bash
npm run build    # Build the static site
npm start        # Serve the static files locally
```

This will serve your built site at
[http://localhost:3000](http://localhost:3000)

### Writing Blog Posts

1. Create a new `.md` file in the `posts/` directory
2. Add frontmatter with metadata:

```markdown
---
title: "Your Post Title"
date: "2024-01-15"
author: "Your Name"
excerpt: "A brief description of your post"
tags: ["tag1", "tag2", "tag3"]
---

# Your Post Title

Your content here...
```

3. Write your content using Markdown
4. Commit and push to trigger automatic deployment

### Supported Frontmatter Fields

- `title` (required): The post title
- `date` (required): Publication date in YYYY-MM-DD format
- `author` (optional): Author name
- `excerpt` (optional): Brief description for the post list
- `tags` (optional): Array of tags
- `draft` (optional): Set to `true` to mark as draft (defaults to `false`)

### Working with Drafts

Draft posts are perfect for work-in-progress content:

```markdown
---
title: "My Upcoming Post"
date: "2024-01-26"
draft: true
---

Content here...
```

**Draft Behavior:**

- ✅ **Development**: Visible when running `npm run dev`
- ❌ **Production**: Hidden in production builds (`npm run build`)
- 🎨 **Visual Indicators**: Yellow background and "DRAFT" badge
- 🔄 **Easy Publishing**: Change `draft: true` to `draft: false`

## Deployment Setup

### GitHub Pages Setup

1. **Go to your GitHub repository**
2. **Click Settings** (in the repository, not your profile)
3. **Scroll down to "Pages"** in the left sidebar
4. **Under "Source"** select: **"GitHub Actions"**
5. **That's it!** No additional configuration needed.

The workflow will automatically:

- ✅ Build your Next.js blog on every push to `main`
- ✅ Deploy to GitHub Pages
- ✅ Your blog will be available at:
  `https://[username].github.io/crosscompiled-blog`

### No Secrets Required!

Unlike S3 deployment, GitHub Pages uses the built-in `GITHUB_TOKEN`
automatically - no manual secret configuration needed.

## Project Structure

```
crosscompiled-blog/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── posts/
│       └── [id]/
│           └── page.tsx   # Individual post pages
├── lib/
│   └── markdown.ts        # Markdown processing utilities
├── posts/                 # Your blog posts (Markdown files)
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Actions workflow
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── package.json           # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (generates static files)
- `npm run start` - Serve the built static files locally
- `npm run preview` - Build and serve in one command
- `npm run lint` - Run ESLint

## Customization

### Styling

The blog uses Tailwind CSS. You can customize:

- Colors and theme in `tailwind.config.js`
- Global styles in `app/globals.css`
- Layout in `app/layout.tsx`

### Site Information

Update the site title, description, and other metadata in:

- `app/layout.tsx` - Site metadata
- `next.config.js` - Base path and asset prefix (if needed)

### Markdown Processing

The markdown processor supports:

- GitHub Flavored Markdown
- Code syntax highlighting
- Tables
- Task lists
- Strikethrough
- Autolinks

## Troubleshooting

### Build Issues

1. **Module not found errors**: Run `npm install` to ensure all dependencies are
   installed
2. **TypeScript errors**: Check your TypeScript configuration in `tsconfig.json`
3. **Missing posts**: Ensure your markdown files are in the `posts/` directory

### Deployment Issues

1. **GitHub Pages not enabled**: Ensure Pages is enabled in repository settings
2. **Build failures**: Check the Actions tab for build error details
3. **404 errors**: Verify your repository name matches the URL path

### Performance

1. **Large images**: Optimize images before adding them to posts
2. **Many posts**: Consider implementing pagination for better performance
3. **Bundle size**: Use `npm run build` to analyze bundle size

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## License

This project is open source and available under the MIT License.
