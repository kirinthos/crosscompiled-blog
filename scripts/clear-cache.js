#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("🧹 Clearing Next.js cache...");

const nextDir = path.join(process.cwd(), ".next");

function removeDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`✅ Removed: ${dirPath}`);
  } else {
    console.log(`ℹ️  Directory not found: ${dirPath}`);
  }
}

// Clear Next.js cache directories
removeDir(nextDir);

// Also clear node_modules/.cache if it exists
const nodeModulesCache = path.join(process.cwd(), "node_modules", ".cache");
removeDir(nodeModulesCache);

console.log("🎉 Cache cleared! You can now restart your development server.");
