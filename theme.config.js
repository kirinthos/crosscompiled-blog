/**
 * Theme Configuration
 *
 * This is where you can easily change all the colors for your blog.
 * Just update the colors below and the entire site will use the new theme!
 *
 * Color format: Use hex codes (e.g., '#3b82f6') or CSS color names (e.g., 'blue')
 * You can also use any valid CSS color value.
 */

const theme = {
  colors: {
    // Primary: Soft pastel pink (GNOME 48 inspired)
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
    },

    // Text colors - optimized for readability
    text: {
      primary: "#0f172a", // Very dark grey (almost black)
      secondary: "#475569", // Medium dark grey
      muted: "#64748b", // Medium grey
      inverse: "#f8fafc", // Light text for dark backgrounds
    },

    // Status colors - GNOME inspired
    status: {
      success: "#10b981", // Green
      warning: "#f59e0b", // Amber
      error: "#ef4444", // Red
      info: "#3b82f6", // Blue
    },
  },

  // Typography settings
  typography: {
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
      mono: ["JetBrains Mono", "Consolas", "Monaco", "monospace"],
    },
  },

  // Border radius settings
  borderRadius: {
    sm: "0.375rem", // Small elements
    md: "0.5rem", // Default
    lg: "0.75rem", // Cards, larger elements
    xl: "1rem", // Hero sections
  },

  // Shadow settings
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  },
};

module.exports = theme;
