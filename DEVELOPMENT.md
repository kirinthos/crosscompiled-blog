# Development Guide

## Live Editing Setup

Your blog now has enhanced live editing capabilities! Here's how to use them:

### 🚀 Quick Start

```bash
# Start development server with live reloading
npm run dev

# Alternative: Enhanced file watching (recommended)
npm run dev:watch
```

### ✨ Live Editing Features

#### 📝 **Markdown Posts**

- **Auto-reload**: Changes to `.md` files in `posts/` trigger immediate page
  updates
- **Draft support**: Drafts show with visual indicators during development
- **New posts**: Automatically detected and added to the site
- **Real-time preview**: See changes as you type (with compatible editors)

#### 🎨 **Theme Changes**

- **Instant updates**: Modify `theme.config.js` and see changes immediately
- **CSS updates**: Tailwind classes update without full page reload
- **Configuration**: Changes to styling configs trigger automatic rebuilds

#### ⚙️ **Configuration Files**

The following files trigger automatic server restarts when modified:

- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Styling configuration
- `theme.config.js` - Theme colors and settings
- `package.json` - Dependencies and scripts

### 🛠️ Development Commands

```bash
# Standard development (basic live reload)
npm run dev

# Enhanced development (advanced file watching)
npm run dev:watch

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code
npm run lint
```

### 📁 File Watching

The development server watches these locations:

```
posts/              # Markdown blog posts
├── *.md           # Auto-reload on changes
├── drafts/        # Draft posts (dev-only)
└── images/        # Post assets

app/               # Next.js app directory
├── **/*.tsx       # React components
├── **/*.css       # Stylesheets
└── globals.css    # Global styles

lib/               # Utility libraries
└── markdown.ts    # Markdown processing

theme.config.js    # Theme configuration
tailwind.config.js # Tailwind CSS config
next.config.js     # Next.js config
```

### 🔥 Hot Reload Features

#### **React Components**

- Fast Refresh for component changes
- State preservation during updates
- Error recovery and display

#### **Styling**

- Instant CSS updates
- Tailwind class changes
- Theme color modifications

#### **Markdown Processing**

- Syntax highlighting updates
- Math equation rendering
- Table and formatting changes

### 🎯 Writing Workflow

1. **Start dev server**: `npm run dev`
2. **Open browser**: `http://localhost:3000`
3. **Edit posts**: Make changes to `.md` files in `posts/`
4. **See changes**: Browser updates automatically
5. **Iterate quickly**: No manual rebuilds needed!

### 📝 Post Development Tips

#### **Draft Workflow**

```markdown
---
title: "Work in Progress"
draft: true # Shows in dev, hidden in production
---
```

#### **Live Preview**

- Use split-screen: editor on one side, browser on the other
- Changes appear within 1-2 seconds
- Syntax errors show helpful messages

#### **Asset Handling**

```markdown
![Image](./images/my-image.png) # Relative to posts/
![Image](/images/my-image.png) # Relative to public/
```

### 🐛 Troubleshooting

#### **Changes Not Showing?**

1. Check console for errors
2. Verify file is saved
3. Restart dev server: `Ctrl+C` then `npm run dev`

#### **Slow Updates?**

1. Try `npm run dev:watch` for enhanced watching
2. Check system resources
3. Reduce polling interval in `next.config.js`

#### **Build Errors?**

1. Check markdown frontmatter syntax
2. Verify all required fields are present
3. Run `npm run lint` to check for issues

### 🔧 Advanced Configuration

#### **Custom Watch Patterns**

Edit `next.config.js` to modify file watching:

```javascript
webpack: (config, { dev }) => {
  if (dev) {
    config.watchOptions = {
      poll: 1000, // Check every second
      ignored: ["**/node_modules", "**/.git"],
    };
  }
  return config;
};
```

#### **Performance Tuning**

- Adjust polling interval for your system
- Exclude large directories from watching
- Use SSD storage for faster file access

### 🎨 Theme Development

#### **Color Changes**

1. Edit `theme.config.js`
2. Modify color values
3. Save file
4. See changes instantly!

```javascript
// Example: Change primary color
primary: {
  500: "#ec4899",  // Change this
}
```

#### **Typography Updates**

- Font changes update immediately
- Size and spacing modifications
- Custom CSS additions

### 📊 Monitoring

The dev server provides helpful feedback:

```bash
✓ Ready in 2.3s
○ Local:        http://localhost:3000
○ Network:      http://192.168.1.100:3000

📝 Post updated: my-new-post.md
🎨 Theme change detected, updating...
⚡ Hot reload complete in 234ms
```

### 🚀 Production Deployment

When ready to deploy:

```bash
# Build static site
npm run build

# Test production build locally
npm run preview

# Deploy (automatic via GitHub Actions)
git push origin main
```

## Tips for Optimal Experience

1. **Use a good editor**: VS Code with Markdown extensions
2. **Split screen**: Editor + browser for instant feedback
3. **Save frequently**: Changes trigger on file save
4. **Watch console**: Helpful error messages and feedback
5. **Use drafts**: Test content before publishing

Happy writing! 🎉
