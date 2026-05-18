---
title: "It's Been A While"
date: "2026-05-13"
author: "Jay"
excerpt:
tags: ["agents", "llms", "local", "assistant", "network"]
---

# It's Been A While

Hello, everyone. It has been quite some time since the last time I wrote a post.
So much has changed it is quite unreal to me. My work has been busier than ever
and I have had to sacrifice much of my personal project time to work and family.
That isn't a bad thing by any means, but I do want to keep making progress on
some of my personal AI projects.

AI has come _so far_ since the last time I wrote an article.

1. Anthropic’s Claude Mythos changed the AI security conversation
   1. Anthropic released “Claude Mythos Preview,” a frontier model focused on
      autonomous vulnerability discovery and exploit generation.
   1. Mythos reportedly found zero-days in major operating systems, browsers,
      OpenBSD, FFmpeg, and Linux subsystems.
1. [Linux Foundation Open Source and the Future of AI](https://www.linuxfoundation.org/hubfs/Research%20Reports/Open%20Source%20and%20the%20Future%20of%20AI_Report_2026.pdf?hsLang=en&utm_source=chatgpt.com)
   1. Profound statements on the use of AI and how it is evolving Software
      Engineering into architecture and design overseeing agentic implementation
   1. [Torvalds allows AI contributions to the Linux kernel](https://www.tomshardware.com/software/linux/linux-lays-down-the-law-on-ai-generated-code-yes-to-copilot-no-to-ai-slop-and-humans-take-the-fall-for-mistakes-after-months-of-fierce-debate-torvalds-and-maintainers-come-to-an-agreement) -
      Humans are responsible for the consequences, though!
1. [Robots are having their ChatGPT moment](https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Releases-New-Physical-AI-Models-as-Global-Partners-Unveil-Next-Generation-Robots/?utm_source=chatgpt.com)
   Boston Dynamics and friends are using NVIDIA robotics stack to create AI
   driven robots
1. [AI benchmarks are becoming solved](https://hai.stanford.edu/ai-index/2026-ai-index-report%20?utm_source=chatgpt.com)
   1. Near-100% SWE-bench coding performance
   1. IMO gold-medal math performance (technically 2025)
   1. Google, Meta, and others are even more aggressively chasing Agentic AI
      (yes, Meta restructured again...)

There has been so many changes this year so far it is truly a sight to behold.
We're on the cusp of the exponential curve of AI advancement in my opinion. I
liken the state we're currently in to when the C compiler was developed and
expanded the capability of writing programs to more people by abstracting away
the complexities of Assembly.

We're here now, at the beginning, the first compiler after Assembly. The jump is
starting to accelerate and I doubt that before long we'll have AI improving AI,
which will be the next true marker of acceleration!

# What I'm Excited About

I've been doing a lot of local experimentation with all sorts of AI tools.
Everything from NotebookLM to study new concepts, to using Claude Code and
Cursor to develop at the speed of my voice, to compiling ComfyUI graphs into
image renderings, to building my own agent harness in the Zergling project.
There is so much going on right now in the AI space that I'm relinquishing much
of my skepticism. AI is here to stay. It has become a profound tool and, when
wielded by those who are capable, can accomplish much in very short time.

It is the age of the generalist! With a "team of experts" in the palm of your
hand, the true power lies in those with enough general knowledge to connect all
of these experts. To stitch them into the fabric of creativity and bring forth
their ideations with little effort of their own.

One of my favorite AI processes is to do a bit of design work up front, which
usually involves chatting with AI, having the robot do some research and build
up an archive of Obsidian markdown notes for me to peruse later. Then distilling
those notes with my LLM companion into the concepts I need to know. Once we
understand what we're doing, we set the robot down the path of implementing the
prototype engine!

This involves "steering" the LLM. I don't say "create me an app that does
X"...no, no. Instead, I like to design the modular layout of the software as if
I were beginning to write it. "Build this REST API module here, expose routes A,
B, and C" and "use this database that we decided on from our research, host it
locally, define a schema and then let's review that schema, recall the schema
must represent business models X, Y, and Z" and so on it goes. This way I have
an understanding of the application I'm building while the LLM is building it.
It helps me to debug the system and also to understand where points of debugging
should be inserted.

In my own Zergling project, this first took form in the shape of a termianl REPL
(read-evaluate-print-loop). When attempting to debug the inter-session
communication between agents, I couldn't determine where the suspend and awake
messages were hung up. I realized we need a way to inspect the message queues,
chat sessions, actions, and tool calls of the agent teams and so instructed the
LLM to build a REPL that interacts with a backend API. This allows us to do
terminal-level testing, but _also_ gives the LLM the ability to use terminal
inputs in the REPL to examine the state of agents and debug itself! It's truly
amazing.

# Signing off

This is my first post in a while and I promise I will try hard to produce
content each week this year. I have a very, very long list of topics I'd like to
cover. On top of that there are several subjects I want to learn this year and
I'm going to reproduce my learnings in blog posts like these or...who
knows...maybe even some YouTube videos if I can convince myself to set it up!

Stay tuned for projects in the future!

For now it's back to work on the Zergling project and my new side project:
ATLAS!! Details to come soon.
