#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

const { spawn } = require("child_process");
const chokidar = require("chokidar");
const path = require("path");

console.log("🚀 Starting development server with enhanced file watching...");

let devServer = null;

function startDevServer() {
  if (devServer) {
    console.log("🔄 Restarting development server...");
    devServer.kill();
    // Give the process time to fully terminate
    setTimeout(() => {
      startServer();
    }, 1000);
  } else {
    startServer();
  }
}

function startServer() {
  devServer = spawn("npm", ["run", "dev"], {
    stdio: "inherit",
    shell: true,
  });

  devServer.on("error", (err) => {
    console.error("❌ Dev server error:", err);
    // Attempt to restart after a delay if there's an error
    setTimeout(() => {
      console.log("🔄 Attempting to restart after error...");
      startDevServer();
    }, 2000);
  });

  devServer.on("exit", (code) => {
    if (code !== 0 && code !== null) {
      console.log(`⚠️  Dev server exited with code ${code}, restarting...`);
      setTimeout(() => {
        startDevServer();
      }, 1000);
    }
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
const postsWatcher = chokidar.watch("posts/**/*", {
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
