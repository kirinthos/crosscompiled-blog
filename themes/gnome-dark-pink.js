// GNOME 48 Dark Grey & Pastel Pink Theme
// Inspired by modern GNOME design with dark greys and soft pink accents
// Copy these colors to your theme.config.js file

const gnomeDarkPinkColors = {
  // Primary: Soft pastel pink
  primary: {
    50: "#fdf2f8", // Very light pink
    100: "#fce7f3", // Light pink
    200: "#fbcfe8", // Soft pink
    300: "#f9a8d4", // Medium pink
    400: "#f472b6", // Bright pink
    500: "#ec4899", // Main pastel pink
    600: "#db2777", // Deeper pink
    700: "#be185d", // Dark pink
    800: "#9d174d", // Very dark pink
    900: "#831843", // Darkest pink
  },

  // Secondary: Complementary purple-pink
  secondary: {
    50: "#faf5ff",
    100: "#f3e8ff",
    200: "#e9d5ff",
    300: "#d8b4fe",
    400: "#c084fc",
    500: "#a855f7", // Soft purple
    600: "#9333ea",
    700: "#7c3aed",
    800: "#6b21a8",
    900: "#581c87",
  },

  // Neutral: GNOME-inspired dark greys
  neutral: {
    50: "#f8fafc", // Almost white
    100: "#f1f5f9", // Very light grey
    200: "#e2e8f0", // Light grey
    300: "#cbd5e1", // Medium light grey
    400: "#94a3b8", // Medium grey
    500: "#64748b", // Medium dark grey
    600: "#475569", // Dark grey
    700: "#334155", // Very dark grey
    800: "#1e293b", // GNOME dark
    900: "#0f172a", // Darkest grey
  },

  // Background colors - GNOME 48 inspired
  background: {
    primary: "#ffffff", // Pure white for content
    secondary: "#f8fafc", // Very light grey for page bg
    accent: "#f1f5f9", // Light grey for code blocks
    dark: "#1e293b", // Dark mode option
    darkAccent: "#334155", // Dark mode accent
  },

  // Text colors - optimized for readability
  text: {
    primary: "#0f172a", // Very dark grey (almost black)
    secondary: "#475569", // Medium dark grey
    muted: "#64748b", // Medium grey
    inverse: "#f8fafc", // Light text for dark backgrounds
    accent: "#ec4899", // Pink for special text
  },

  // Status colors - GNOME inspired
  status: {
    success: "#10b981", // Green
    warning: "#f59e0b", // Amber
    error: "#ef4444", // Red
    info: "#3b82f6", // Blue
  },

  // Code syntax highlighting colors
  syntax: {
    background: "#f8fafc", // Light background
    text: "#1e293b", // Dark text
    comment: "#64748b", // Grey comments
    keyword: "#ec4899", // Pink keywords
    string: "#10b981", // Green strings
    number: "#f59e0b", // Amber numbers
    function: "#3b82f6", // Blue functions
    variable: "#8b5cf6", // Purple variables
    operator: "#6b7280", // Grey operators
    punctuation: "#475569", // Dark grey punctuation
  },
};

module.exports = gnomeDarkPinkColors;
