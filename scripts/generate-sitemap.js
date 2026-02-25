/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { getSortedPostsData } = require("../lib/posts-data");

// Configuration
const SITE_URL = "https://crosscompiled.com"; // Update this to your actual domain
const OUTPUT_PATH = path.join(process.cwd(), "public", "sitemap.xml");

const ISO_DATE_RE = /\d{4}-\d{2}-\d{2}T[\d:.]+(?:Z|[+-]\d{2}:\d{2})?/g;
function normalizeTimestamps(str) {
  return str.replace(ISO_DATE_RE, "__TS__");
}

// Get all posts with their metadata using the shared library function
function getAllPosts() {
  const posts = getSortedPostsData(false); // false = exclude drafts

  return posts.map((post) => {
    // Get file stats for lastModified date
    const filePath = path.join(process.cwd(), "posts", `${post.id}.md`);
    const lastModified = fs.existsSync(filePath)
      ? fs.statSync(filePath).mtime.toISOString()
      : new Date().toISOString();

    return {
      id: post.id,
      url: `/posts/${post.id}/`,
      title: post.title,
      date: post.date,
      lastModified,
    };
  });
}

// Generate sitemap XML
function generateSitemap() {
  const posts = getAllPosts();

  // Static pages
  const staticPages = [
    {
      url: "/",
      lastModified: new Date().toISOString(),
      changeFreq: "weekly",
      priority: "1.0",
    },
  ];

  // Dynamic post pages
  const postPages = posts.map((post) => ({
    url: post.url,
    lastModified: post.lastModified,
    changeFreq: "monthly",
    priority: "0.8",
  }));

  const allPages = [...staticPages, ...postPages];

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return sitemap;
}

// Main function
function main() {
  try {
    console.log("🗺️  Generating sitemap...");

    // Ensure public directory exists
    const publicDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const sitemap = generateSitemap();
    const existing = fs.existsSync(OUTPUT_PATH) ? fs.readFileSync(OUTPUT_PATH, "utf8") : "";
    if (normalizeTimestamps(existing) === normalizeTimestamps(sitemap)) {
      console.log("   ⏭️  No meaningful changes (timestamp-only), skipping write");
    } else {
      fs.writeFileSync(OUTPUT_PATH, sitemap, "utf8");
    }

    const posts = getAllPosts();
    console.log(`✅ Sitemap generated successfully!`);
    console.log(`   📄 ${posts.length} blog posts included`);
    console.log(`   📍 Saved to: ${OUTPUT_PATH}`);
    console.log(`   🌐 Site URL: ${SITE_URL}`);

    // Show some sample URLs
    if (posts.length > 0) {
      console.log("\n📋 Sample URLs included:");
      console.log(`   ${SITE_URL}/`);
      posts.slice(0, 3).forEach((post) => {
        console.log(`   ${SITE_URL}${post.url}`);
      });
      if (posts.length > 3) {
        console.log(`   ... and ${posts.length - 3} more posts`);
      }
    }
  } catch (error) {
    console.error("❌ Error generating sitemap:", error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateSitemap, getAllPosts };
