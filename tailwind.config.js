const theme = require("./theme.config.js");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: theme.colors.primary,
        secondary: theme.colors.secondary,
        neutral: theme.colors.neutral,
        background: theme.colors.background,
        text: theme.colors.text,
        status: theme.colors.status,
      },
      fontFamily: theme.typography.fontFamily,
      borderRadius: theme.borderRadius,
      boxShadow: theme.shadows,
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: theme.colors.text.primary,
            a: {
              color: theme.colors.primary[500],
              textDecoration: "none",
              "&:hover": {
                color: theme.colors.primary[700],
                textDecoration: "underline",
              },
            },
            h1: {
              color: theme.colors.text.primary,
            },
            h2: {
              color: theme.colors.text.primary,
            },
            h3: {
              color: theme.colors.text.primary,
            },
            h4: {
              color: theme.colors.text.primary,
            },
            h5: {
              color: theme.colors.text.primary,
            },
            h6: {
              color: theme.colors.text.primary,
            },
            strong: {
              color: theme.colors.text.primary,
            },
            code: {
              color: theme.colors.primary[700],
              backgroundColor: theme.colors.background.accent,
              padding: "0.25rem 0.375rem",
              borderRadius: theme.borderRadius.sm,
              fontSize: "0.875em",
            },
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
            pre: {
              backgroundColor: theme.colors.background.accent,
              color: theme.colors.text.primary,
              borderRadius: theme.borderRadius.md,
            },
            blockquote: {
              borderLeftColor: theme.colors.primary[500],
              color: theme.colors.text.secondary,
            },
            hr: {
              borderColor: theme.colors.neutral[200],
            },
            table: {
              fontSize: "0.875em",
            },
            "thead th": {
              color: theme.colors.text.primary,
              borderBottomColor: theme.colors.neutral[300],
            },
            "tbody td": {
              borderBottomColor: theme.colors.neutral[200],
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
