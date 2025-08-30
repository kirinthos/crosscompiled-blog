# Callouts Reference

This document describes the available callout types you can use in your blog
posts. Callouts are special highlighted boxes that help draw attention to
important information, thoughts, warnings, and other content.

## Syntax

Callouts use a blockquote syntax with a special indicator:

```markdown
> [!type] Your callout content goes here. You can have multiple lines in a
> callout. They will all be styled consistently.
```

## Available Callout Types

### 1. Info (ℹ️)

Use for general information or explanatory content.

```markdown
> [!info] This is an informational callout that provides helpful context or
> additional details about the topic being discussed.
```

**Styling**: Blue background with blue border and info icon

---

### 2. Warning (⚠️)

Use for cautionary information or things to be aware of.

```markdown
> [!warning] This is a warning callout that alerts readers to potential issues
> or things they should be careful about.
```

**Styling**: Yellow background with yellow border and warning icon

---

### 3. Danger (🚨)

Use for critical warnings or serious issues that could cause problems.

```markdown
> [!danger] This is a danger callout for critical information that requires
> immediate attention or could cause serious issues.
```

**Styling**: Red background with red border (thicker than other callouts) and
alarm icon

---

### 4. Success (✅)

Use for positive outcomes, achievements, or successful completions.

```markdown
> [!success] This is a success callout that highlights positive outcomes or
> successful completion of tasks.
```

**Styling**: Green background with green border and checkmark icon

---

### 5. Error (❌)

Use for error messages or failure scenarios.

```markdown
> [!error] This is an error callout that describes what went wrong or highlights
> failure scenarios.
```

**Styling**: Red background with red border and X icon

---

### 6. Note (📝)

Use for neutral notes or general observations.

```markdown
> [!note] This is a note callout for general observations or neutral information
> that doesn't fit other categories.
```

**Styling**: Gray background with gray border and note icon

---

### 7. Tip (💡)

Use for helpful tips, tricks, or suggestions.

```markdown
> [!tip] This is a tip callout that provides helpful suggestions or useful
> tricks for readers.
```

**Styling**: Emerald background with emerald border and lightbulb icon

---

### 8. Thought (💭)

Use for stream-of-consciousness content, personal reflections, or informal
thoughts.

```markdown
> [!thought] This is a thought callout for stream-of-consciousness content or
> personal reflections during the writing process.
```

**Styling**: Purple background with purple border, thought bubble icon, and
italic text

---

### 9. Prompt (🧪)

Use for user prompts to AI systems or experimental content.

```markdown
> [!prompt] This is a prompt callout used when showing prompts given to AI
> systems or experimental interactions.
```

**Styling**: Indigo background with indigo border, test tube icon, and monospace
font

---

### 10. Robot (🤖)

Use for AI responses or automated system outputs.

```markdown
> [!robot] This is a robot callout used for AI responses or automated system
> outputs and responses.
```

**Styling**: Slate background with slate border, robot icon, and monospace font

---

## Dark Theme Support

All callouts automatically adapt to dark themes with appropriate color
adjustments for better readability in both light and dark modes.

## Examples in Use

Here are some real examples from the blog:

### Thought Callout Example

```markdown
> [!thought] These decisions were made consciously. I have a lot of experience
> in all manners of engineering, from realtime operating systems on constrained
> hardware to complex multiplatform UI to highly performant big data
```

### Warning Callout Example

```markdown
> [!warning] I didn't notice that my first figure only had two rows, so when
> copying this content into a jupyter cell to graph this exact code I did have
> to change `nrows=2` to `nrows=3`, but that was the only change!
```

## Custom PNG Emojis

In addition to standard Unicode emojis, this blog supports custom PNG emojis
that you can use throughout your posts. These work just like Slack-style emoji
shortcuts.

### Usage

Use the same `:emoji-name:` syntax as regular emojis:

```markdown
I'm scratching my head about this :head-scratch:
```

### Available Custom Emojis

- `:head-scratch:` - A head-scratching emoji for confusion or puzzlement

### Adding New Custom Emojis

To add your own custom PNG emojis:

1. **Add the PNG file** to `/public/images/` (recommended size: 32x32px or
   similar)
2. **Update the emoji map** in `/lib/emojis.ts`:
   ```typescript
   export const customEmojiMap: Record<string, string> = {
     "head-scratch": "head-scratch.png",
     "your-emoji-name": "your-emoji-file.png", // Add your emoji here
   };
   ```
3. **Use in your posts** with `:your-emoji-name:`

Custom emojis will automatically be styled to match the text size and flow
inline with your content.

## Technical Implementation

Callouts are implemented using:

- **Markdown Processing**: Custom remark plugin (`remarkCallouts`) in
  `lib/markdown.ts`
- **Styling**: CSS classes in `app/globals.css` with Tailwind utilities
- **Syntax**: Blockquote syntax with `[!type]` indicators
- **Icons**: Unicode emoji icons positioned with CSS pseudo-elements
- **Custom Emojis**: PNG images with inline styling for seamless integration
- **Responsive**: Automatic dark/light theme support

## Tips for Usage

1. **Choose the right type**: Match the callout type to your content's purpose
2. **Keep it concise**: Callouts work best with focused, concise content
3. **Use sparingly**: Too many callouts can overwhelm readers
4. **Consistent style**: Stick to the established syntax for proper rendering
5. **Test in both themes**: Verify readability in both light and dark modes

---

_This callout system enhances the blog's readability by providing visual
hierarchy and drawing attention to important information in a consistent,
accessible way._
