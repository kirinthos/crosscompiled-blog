# Collapsible Sections

Collapsible sections let you hide long or optional markdown behind a summary line. Readers see the summary when collapsed and can expand to read the full content.

## Syntax

Use a blockquote whose first line starts with `??` (collapsed by default) or `???` (open by default). The rest of the blockquote is the body and is rendered as markdown.

```markdown
> ?? Summary line shown when collapsed
> This **markdown** is visible when expanded.
> - bullet one
> - bullet two
```

Open by default:

```markdown
> ??? Summary line (section starts expanded)
> Body content here.
```

## Examples

Collapsed by default:

```markdown
> ?? Click to see the implementation
> Here is the code we used:
> - Step one
> - Step two
```

Expanded by default:

```markdown
> ??? Optional details (open by default)
> You can use **bold**, _italic_, and lists inside.
```

## Notes

- The summary line can use inline markdown (e.g. `**bold**`, `_italic_`, `` `code` ``).
- The body supports the same block-level markdown as callouts: paragraphs, lists, bold, italic, code, links.
- Empty body is allowed; the block will still show as a clickable summary.
