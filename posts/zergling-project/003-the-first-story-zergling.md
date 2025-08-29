---
title: "The First Story: Zergling"
date: "2025-08-12"
author: "Jay"
excerpt:
  "An engineer's journey into AI-assisted development: building agents with AI,
  exploring the boundaries of what's possible, and discovering a new way to
  create software."
tags: ["ai", "development", "agents", "claude", "cursor", "llm", "engineering"]
draft: false
---

# Zergling

The first thing I decided to build entirely with AI was not the modeling stack
that will be the focus of this entire series. Instead, it was a gnome extension.

Yeah...why did I choose a gnome extension? Does that seem like a bizarre choice?

## I don't know shit about Gnome Extensions

I don't. I've never written a Gnome extension and I have relatively light
exposure to Gnome as a system itself. I've been an engineer for decades, so I
have developed applications that run in various UI frameworks like QT and GTK,
but I've never written a Gnome Extension.

Why did I choose this? Because I know nothing about them, certainly. This
provides the perfect arena to allow AI to inform and educate a seasoned veteran
on new technologies he knows nothing about. Then I get to do some research and
find out just how truthful and knowledgeable the AI is. On top of this, the
problem space that's formed by a qualified engineer, not to toot my own horn,
intersecting with a development pattern he knows nothing of combined with a
machine who speaks in half-truths is a challenging problem space indeed.

From this I hope to learn two major things. The primary one is how I can learn
from the AI itself, and we will not be using coding AI tools alone to do this
(_NotebookLM_ the studying champion, ChatGPT study mode, and eventually my own
AI that interfaces directly with my notes and research). _We all know that
generative AI is a liar._

In all seriousness, if you know about how generative AI works, we know that it
is not truly lying. Lying would require that the AI understand and comprehend
the truth and then to intentionally skirt it with misrepresentation of that
underlying truth. Instead, what is happening is that the model is selecting from
some probability distribution of potential next tokens. This implies that the
correctness of the result could be dependent on a roll of the dice, does it not?
Either way, we as engineers today are trying to find a way to reduce these
'hallucinations', a clever term given to errors produced by this principle of
probabalistic selection of sequence terms.

I will be trying to find my way around these issues as well.

## Wait, Gnome Extensions

Stay on track, Jay. We're talking about why Gnome Extensions.

I have a vision.

I have always wanted a system that I can interact with directly using my voice.
I have always wanted a system that can do work in the background while I'm doing
work in the foreground. I have always wanted a system that is at my fingertips,
not buried in my tools.

The answer to all of these is Operating System level integration.

Now, we're here. Gnome Extensions "interact with the operating system directly"
so I naively tell myself. As we dig deeper into this system, I'm sure we will
hit limitations that prevent us from realizing the depth of features I truly
want to build with my agentic AI systems. However, as I started -- and of course
I know nothing about Gnome Extensions and how deeply they integrate with the
operating system itself -- I realized that a Gnome Extension isn't necessarily
granted any more power over the Linux OS as any other application with the right
permissions. Nonetheless, we continue to build this Gnome Extension as it is how
I initially embarked on this project.

Ideally, throughout our development of this stack, we'll maintain both some type
of common user interface and then an operating system level interface like a
Gnome Extension.

Sorry other operating system users and followers of this blog, we won't be
covering you in this foray.

The initial implementation is successful already if I do say so myself. I want
something outside of the browser because it feels more native.

![Zergling Gnome Extension Screenshot](/images/Zergling.Extension.First.png)

I can call up my extension with Super+Space and immediately start interacting
with my model. At the time, I'm using Claude and I do tend to prefer it for
analytical and programming tasks to ChatGPT so far. This allows me to rather
seamlessly interact with my model and to this we'll begin to add the ability to
do far more like render images, interact with the filesystem, and eventually
create and host our own
[MCP server](https://www.cloudflare.com/learning/ai/what-is-model-context-protocol-mcp/)
(I have always liked Cloudflare's explanations of complex subjects) to build
tools for the model.

# Side Note

Have you seen this baller logo DALL-E made me after repeatedly asking it to
render me a Zergling in black and white!? It's in the screenshot above in the
panel bar. You can click this icon to do the equivalent of my hotkey: open/close
the chat panel. If you've ever played StarCraft, you know this doesn't look even
one bit like a zergling...but I've grown to love this icon.

![Zergling Icon](/images/zergling.png)

# Next Time

In the next post we'll dive more into the code and some of the issues I had
developing this extension.
