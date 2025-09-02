const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const postsDirectory = path.join(process.cwd(), "posts");

// Helper function to recursively find all markdown files
function findMarkdownFiles(dir, baseDir = dir) {
  const files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...findMarkdownFiles(fullPath, baseDir));
    } else if (item.endsWith(".md")) {
      const relativePath = path.relative(baseDir, fullPath);
      files.push({
        fileName: item,
        fullPath,
        relativePath,
      });
    }
  }

  return files;
}

/**
 * Get sorted posts data - Node.js compatible version of the TypeScript function
 * This maintains the same logic as getSortedPostsData from markdown.ts
 * @param {boolean} includeDrafts - Whether to include draft posts
 * @returns {Array} Array of blog post objects
 */
function getSortedPostsData(includeDrafts = false) {
  // Get all markdown files recursively
  const markdownFiles = findMarkdownFiles(postsDirectory);
  const allPostsData = markdownFiles
    .map(({ fileName, fullPath, relativePath }) => {
      // Create id from relative path without extension
      const id = relativePath.replace(/\.md$/, "").replace(/\\/g, "/");

      // Read markdown file as string
      const fileContents = fs.readFileSync(fullPath, "utf8");

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
        excerpt: matterResult.data.excerpt || "",
        tags: matterResult.data.tags || [],
        author: matterResult.data.author || "",
        content: matterResult.content,
        draft: matterResult.data.draft || false,
        category: category || "uncategorized",
        filePath: relativePath,
        ...matterResult.data,
      };
    })
    .filter((post) => includeDrafts || !post.draft);

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

module.exports = {
  getSortedPostsData,
  findMarkdownFiles,
};
