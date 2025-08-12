# 🎨 Easy Theme Customization Guide

Your blog now has a centralized theming system that makes it super easy to
change colors! Here's how to customize it.

## 📍 Where to Make Changes

All theme colors are defined in **`theme.config.js`** in the root directory.
This is the only file you need to edit to change the entire site's appearance!

## 🚀 Quick Start

1. Open `theme.config.js` in any text editor
2. Find the `colors` object
3. Change the color values (use hex codes like `#3b82f6`)
4. Save the file
5. Refresh your browser to see changes!

## 🎯 Key Colors to Focus On

For the biggest visual impact, start with these main colors:

```javascript
// In theme.config.js
primary: {
  500: '#3b82f6',  // 👈 Main brand color - CHANGE THIS FIRST!
},

secondary: {
  500: '#22c55e',  // 👈 Accent color for tags and highlights
},

text: {
  primary: '#111827',    // 👈 Main text color
  secondary: '#6b7280',  // 👈 Secondary text color
},

background: {
  primary: '#ffffff',    // 👈 Main content background
  secondary: '#f9fafb',  // 👈 Page background
}
```

## 🌈 Pre-made Themes

I've created some ready-to-use color schemes in the `themes/` folder:

### 🌊 Ocean Breeze

- **Primary**: Teal/cyan tones
- **Feel**: Calm, refreshing
- **File**: `themes/ocean-breeze.js`

### 🌅 Sunset Warm

- **Primary**: Orange/amber tones
- **Feel**: Warm, inviting
- **File**: `themes/sunset-warm.js`

### 💜 Purple Elegance

- **Primary**: Purple tones
- **Feel**: Elegant, sophisticated
- **File**: `themes/purple-elegance.js`

## 🔄 How to Apply a Pre-made Theme

1. Open the theme file you like (e.g., `themes/ocean-breeze.js`)
2. Copy all the colors from that file
3. Open `theme.config.js`
4. Replace the entire `colors` object with the copied colors
5. Save and refresh!

## 🛠️ Custom Colors

### Finding Colors

- **Online Color Picker**: Use [coolors.co](https://coolors.co) or
  [color.adobe.com](https://color.adobe.com)
- **From Images**: Use tools to extract colors from photos
- **Color Palettes**: Browse [dribbble.com](https://dribbble.com) for
  inspiration

### Color Format

Use hex codes (recommended):

```javascript
primary: {
  500: '#ff6b6b',  // ✅ Good
}
```

You can also use CSS color names:

```javascript
primary: {
  500: 'crimson',  // ✅ Also works
}
```

## 🎨 Understanding Color Shades

Each color has multiple shades (50-900):

- **50-200**: Very light (backgrounds, subtle accents)
- **300-400**: Light (borders, disabled states)
- **500**: Main color (buttons, links) 👈 **Most important!**
- **600-700**: Darker (hover states, emphasis)
- **800-900**: Very dark (text on light backgrounds)

**Pro tip**: Start by changing just the `500` values, then adjust others if
needed!

## 📱 Testing Your Theme

After making changes:

1. **Development**: Run `npm run dev` and check `localhost:3000`
2. **Production**: Run `npm run build && npm start` to test the final build
3. **Mobile**: Test on different screen sizes
4. **Accessibility**: Ensure good contrast between text and backgrounds

## 🎯 Quick Theme Ideas

### Professional Blue (Current Default)

```javascript
primary: { 500: '#3b82f6' }  // Blue
secondary: { 500: '#22c55e' }  // Green
```

### Elegant Dark

```javascript
primary: { 500: '#8b5cf6' }  // Purple
secondary: { 500: '#06b6d4' }  // Cyan
text: { primary: '#1f2937' }  // Dark gray
```

### Warm & Friendly

```javascript
primary: { 500: '#f59e0b' }  // Orange
secondary: { 500: '#ec4899' }  // Pink
background: { secondary: '#fffbeb' }  // Warm white
```

### Minimalist

```javascript
primary: { 500: '#6b7280' }  // Gray
secondary: { 500: '#3b82f6' }  // Blue accent
```

## 🆘 Need Help?

- **Colors look wrong?** Check that hex codes start with `#`
- **Site won't build?** Make sure all colors are in quotes: `'#ff0000'`
- **Want to revert?** Copy colors from `themes/` back to `theme.config.js`

## 🎉 Have Fun!

The theming system is designed to be safe and easy to experiment with. Don't be
afraid to try different colors - you can always change them back!

**Happy theming! 🎨**
