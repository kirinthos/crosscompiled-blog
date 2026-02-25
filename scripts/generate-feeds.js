/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { getSortedPostsData } = require("../lib/posts-data.js");

const ISO_DATE_RE = /\d{4}-\d{2}-\d{2}T[\d:.]+(?:Z|[+-]\d{2}:\d{2})?/g;
function normalizeTimestamps(str) {
  return str.replace(ISO_DATE_RE, "__TS__");
}

function writeIfChanged(filePath, content) {
  const existing = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
  if (normalizeTimestamps(existing) === normalizeTimestamps(content)) {
    return false;
  }
  fs.writeFileSync(filePath, content);
  return true;
}

async function generateFeeds() {
  const { Feed } = await import("feed");

  // Site configuration - you may want to move this to a config file
  const siteUrl = "https://blog.crosscompiled.com";
  const siteTitle = "CrossCompiled Blog";
  const siteDescription =
    "A blog about software development, AI, and technology";
  const authorName = "Jay";
  const authorEmail = "blog@crosscompiled.com";

  console.log("🔄 Generating feeds...");

  try {
    // Get all published posts (excluding drafts)
    const posts = getSortedPostsData(false);
    console.log(`📝 Found ${posts.length} published posts`);

    if (posts.length === 0) {
      console.log("⚠️  No published posts found, skipping feed generation");
      return;
    }

    // Create the feed instance
    const feed = new Feed({
      title: siteTitle,
      description: siteDescription,
      id: siteUrl,
      link: siteUrl,
      language: "en",
      image: `${siteUrl}/images/logo.png`, // Add a logo if you have one
      favicon: `${siteUrl}/favicon.ico`,
      copyright: `All rights reserved ${new Date().getFullYear()}, ${authorName}`,
      updated: new Date(posts[0].date), // Most recent post date
      generator: "CrossCompiled Blog Feed Generator",
      feedLinks: {
        json: `${siteUrl}/feed.json`,
        atom: `${siteUrl}/atom.xml`,
        rss: `${siteUrl}/rss.xml`,
      },
      author: {
        name: authorName,
        email: authorEmail,
        link: siteUrl,
      },
    });

    // Add each post to the feed
    posts.forEach((post) => {
      const postUrl = `${siteUrl}/posts/${post.id}/`;

      // Create a clean excerpt from content if no excerpt is provided
      let description = post.excerpt;
      if (!description && post.content) {
        // Strip HTML tags and get first 200 characters
        description = post.content
          .replace(/<[^>]*>/g, "")
          .replace(/\n/g, " ")
          .trim()
          .substring(0, 200);
        if (description.length === 200) {
          description += "...";
        }
      }

      // Escape content to prevent CDATA issues with ]]> sequences
      const safeContent = post.content
        ? post.content.replace(/]]>/g, "]]&gt;")
        : "";

      feed.addItem({
        title: post.title,
        id: postUrl,
        link: postUrl,
        description: description || `Read more about ${post.title}`,
        content: safeContent,
        author: [
          {
            name: post.author || authorName,
            email: authorEmail,
            link: siteUrl,
          },
        ],
        contributor: [
          {
            name: post.author || authorName,
            email: authorEmail,
            link: siteUrl,
          },
        ],
        date: new Date(post.date),
        category: post.tags?.map((tag) => ({ name: tag })) || [],
        // Add category as well
        ...(post.category && {
          category: [{ name: post.category }],
        }),
      });
    });

    // Ensure the public directory exists
    const publicDir = path.join(__dirname, "..", "public");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const rssContent = feed.rss2();
    const atomContent = feed.atom1();
    const jsonContent = feed.json1();

    const publicRss = path.join(publicDir, "rss.xml");
    const publicAtom = path.join(publicDir, "atom.xml");
    const publicJson = path.join(publicDir, "feed.json");

    const wroteRss = writeIfChanged(publicRss, rssContent);
    const wroteAtom = writeIfChanged(publicAtom, atomContent);
    const wroteJson = writeIfChanged(publicJson, jsonContent);

    console.log("✅ Successfully generated feeds:");
    console.log(`   📄 RSS 2.0: /rss.xml${wroteRss ? "" : " (no meaningful changes)"}`);
    console.log(`   📄 Atom 1.0: /atom.xml${wroteAtom ? "" : " (no meaningful changes)"}`);
    console.log(`   📄 JSON Feed: /feed.json${wroteJson ? "" : " (no meaningful changes)"}`);
    console.log(`   📊 ${posts.length} posts included in feeds`);

    const outDir = path.join(__dirname, "..", "out");
    if (fs.existsSync(outDir)) {
      const outWroteRss = writeIfChanged(path.join(outDir, "rss.xml"), rssContent);
      const outWroteAtom = writeIfChanged(path.join(outDir, "atom.xml"), atomContent);
      const outWroteJson = writeIfChanged(path.join(outDir, "feed.json"), jsonContent);
      if (outWroteRss || outWroteAtom || outWroteJson) {
        console.log("✅ Feeds also copied to /out directory for static export");
      }
    }
  } catch (error) {
    console.error("❌ Error generating feeds:", error);
    process.exit(1);
  }
}

// Run the feed generation
if (require.main === module) {
  generateFeeds();
}

module.exports = { generateFeeds };
