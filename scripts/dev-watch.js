#!/usr/bin/env node

const { spawn } = require("child_process");
const chokidar = require("chokidar");
const path = require("path");

console.log("🚀 Starting development server with enhanced file watching...");

let devServer = null;

function startDevServer() {
  if (devServer) {
    console.log("🔄 Restarting development server...");
    devServer.kill();
  }

  devServer = spawn("npm", ["run", "dev"], {
    stdio: "inherit",
    shell: true,
  });

  devServer.on("error", (err) => {
    console.error("❌ Dev server error:", err);
  });
}

function restartDevServer() {
  console.log("📝 Configuration change detected, restarting...");
  startDevServer();
}

// Start the dev server initially
startDevServer();

// Watch for changes in configuration files
const configWatcher = chokidar.watch(
  ["next.config.js", "tailwind.config.js", "theme.config.js", "package.json"],
  {
    persistent: true,
    ignoreInitial: true,
  }
);

configWatcher.on("change", restartDevServer);

// Watch for new markdown files
const postsWatcher = chokidar.watch("posts/**/*.md", {
  persistent: true,
  ignoreInitial: true,
});

postsWatcher.on("add", (filePath) => {
  console.log(`📄 New post added: ${path.basename(filePath)}`);
});

postsWatcher.on("change", (filePath) => {
  console.log(`✏️  Post updated: ${path.basename(filePath)}`);
});

postsWatcher.on("unlink", (filePath) => {
  console.log(`🗑️  Post deleted: ${path.basename(filePath)}`);
});

// Handle process termination
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down development server...");
  if (devServer) {
    devServer.kill();
  }
  configWatcher.close();
  postsWatcher.close();
  process.exit(0);
});

console.log("👀 Watching for changes in:");
console.log(
  "   - Configuration files (next.config.js, tailwind.config.js, etc.)"
);
console.log("   - Markdown posts (posts/**/*.md)");
console.log("   - Press Ctrl+C to stop");
