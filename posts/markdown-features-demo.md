---
title: "Markdown Features Demo"
date: "2024-01-05"
author: "Your Name"
excerpt:
  "A comprehensive demonstration of all supported markdown features in this
  blog."
tags: ["markdown", "demo", "features", "documentation"]
---

# Markdown Features Demo

This post demonstrates all the markdown features supported by this blog. It's a
great reference for writing your own posts!

## Headers

You can use headers from H1 to H6:

# H1 Header

## H2 Header

### H3 Header

#### H4 Header

##### H5 Header

###### H6 Header

## Text Formatting

**Bold text** and _italic text_ and **_bold italic text_**.

You can also use ~~strikethrough~~ text.

## Lists

### Unordered Lists

- Item 1
- Item 2
  - Nested item 2.1
  - Nested item 2.2
- Item 3

### Ordered Lists

1. First item
2. Second item
   1. Nested item 2.1
   2. Nested item 2.2
3. Third item

### Task Lists

- [x] Completed task
- [x] Another completed task
- [ ] Incomplete task
- [ ] Another incomplete task

## Code

### Inline Code

Use `console.log()` to print to the console.

### Code Blocks

```javascript
// JavaScript example
function greetUser(name) {
  console.log(`Hello, ${name}!`);
  return `Welcome to the blog, ${name}`;
}

greetUser("Developer");
```

```python
# Python example
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(10))
```

```bash
# Bash commands
npm install
npm run build
npm run dev
```

```json
{
  "name": "example",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0"
  }
}
```

## Tables

| Feature    | Supported | Notes            |
| ---------- | --------- | ---------------- |
| Headers    | ✅        | H1-H6            |
| **Bold**   | ✅        | Double asterisks |
| _Italic_   | ✅        | Single asterisks |
| `Code`     | ✅        | Backticks        |
| Links      | ✅        | See below        |
| Tables     | ✅        | This table!      |
| Task Lists | ✅        | Checkbox syntax  |

## Links

[External link to GitHub](https://github.com)

[Link with title](https://example.com "Example Website")

## Blockquotes

> This is a blockquote. It can span multiple lines and is great for highlighting
> important information or quotes from other sources.
>
> You can have multiple paragraphs in blockquotes too.

> **Note**: This is a styled blockquote with bold text inside.

## Horizontal Rules

You can create horizontal rules with three or more hyphens:

---

## Images

While this demo doesn't include images, you can add them using standard markdown
syntax:

```markdown
![Alt text](image-url.jpg "Optional title")
```

## Advanced Features

### GitHub Flavored Markdown

This blog supports GitHub Flavored Markdown (GFM), which includes:

- [x] Task lists (shown above)
- Tables (shown above)
- Strikethrough text (shown above)
- Automatic URL linking: https://github.com
- Syntax highlighting in code blocks

### HTML Support

You can also use HTML tags when needed:

<div style="background: #f0f8ff; padding: 1rem; border-radius: 8px;">
This is a custom HTML block with inline styling.
</div>

<details>
<summary>Click to expand</summary>

This content is hidden by default and can be expanded by clicking the summary.

</details>

## Escaping Characters

If you need to display literal markdown characters, escape them with
backslashes:

\*This text is not italic\*

\`This is not code\`

## Best Practices

1. **Use descriptive headers** to organize your content
2. **Include code examples** when writing technical posts
3. **Use tables** for structured data comparison
4. **Add task lists** for tutorials or step-by-step guides
5. **Include links** to relevant resources
6. **Use blockquotes** for important notes or quotes

## Conclusion

This blog supports all standard markdown features plus GitHub Flavored Markdown
extensions. The combination of markdown simplicity with the power of React and
Next.js makes it easy to create rich, engaging blog posts.

Happy writing! 🚀
