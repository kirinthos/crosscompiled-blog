---
title: "Draft: Work in Progress Post"
date: "2024-01-26"
author: "Your Name"
excerpt:
  "This is an example of a draft post that won't appear in production but will
  show up during development."
tags: ["draft", "example", "work-in-progress"]
draft: true
---

# Draft: Work in Progress Post

This is an example of a draft post! Notice a few things:

## How Drafts Work

1. **Frontmatter Control**: Set `draft: true` in the frontmatter
2. **Development Visibility**: Drafts show up when running `npm run dev`
3. **Production Hidden**: Drafts are filtered out in production builds
4. **Visual Indicators**: Draft posts have a yellow background and "DRAFT" badge

## Draft Features

- ✅ **Yellow highlighting** on the home page
- ✅ **DRAFT badge** on both list and individual post views
- ✅ **Full functionality** - all markdown features work in drafts
- ✅ **Easy publishing** - just change `draft: true` to `draft: false`

## Use Cases for Drafts

### Writing Process

- Start with rough ideas
- Iterate on content
- Get feedback before publishing

### Content Planning

- Plan out post series
- Outline future topics
- Keep notes and research

### Collaboration

- Share work-in-progress with team members
- Review content before going live
- Maintain editorial workflow

## Publishing a Draft

When you're ready to publish, simply:

1. Change `draft: true` to `draft: false` in the frontmatter
2. Update the title (remove "Draft:" prefix if used)
3. Set the publication date
4. Build and deploy!

This post will only be visible during development. Try building the site for
production and this post will disappear!

## Next Steps

- Write more content
- Add images and examples
- Review and edit
- Publish when ready

_This is just a demonstration of the draft functionality. Feel free to delete
this file once you understand how drafts work!_
