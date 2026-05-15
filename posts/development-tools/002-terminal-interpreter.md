---
title: "Terminal Interpreter - Fix Your Forgetfulness"
date: "2026-05-13"
author: "Jay"
excerpt:
  "An interpreter for the things you actually want to type into your terminal"
tags: ["terminal", "devex", "vibecode"]
category: "development-tools"
---

# Terminal Interpreter: Stop Googling `awk`

[Terminal Interpreter Repo](https://github.com/kirinthos/terminal-interpreter)

![Terminal Interpreter Demo](/videos/terminal-interpreter-demo.mp4)

Look, I've been writing shell commands for a long time. I still cannot remember
the argument order for `tar`. I still can't remember whether it's `find . -name`
or `find -name .`, or how to use awk to print a column from some output. Every
time I want to `xargs` something I end up at `man xargs` to figure out `-I {}`
vs `-n 1` vs `-J %` or whatever it is.

I built a tool that lets me type the sentence instead.

> [!info] **Terminal Interpreter** is a small Rust binary plus a thin shell
> widget. You type what you want at the prompt — "list files including hidden,
> sorted by mtime" — press `Ctrl-G`, and the current line is replaced in place
> with `ls -alt`. Press Enter to run, or edit first if the model got cute.

That's the whole pitch. One binary. One config file. A shell snippet that binds
a hotkey. It's not an agent, it's not a chatbot, it's not trying to take over
your terminal it's an LLM-flavoured auto~~complete~~replace that runs exactly
when you ask it to and then gets out of the way.

Let's dive into why I built this tool to help me protect myself from how stupid
I am.

---

# Starting From Zero

I need something to fix my commands when I type something like the following:

```bash
$ kubectl get wait shit how do i list all the containers in all pods
```

I knew exactly two things:

1. I wanted a Rust binary. It's fast. It's cool. You love it. I love it.
2. I wanted the LLM provider to be swappable. I bounce between OpenAI,
   Anthropic, and a local Ollama box depending on mood and what's running. It
   also helps you avoid tokenmaxxing and breaking the bank.
3. I want it to be simpleAF to use.

Oh, that's three things.

This seems like a simple thing...and "why don't you just want to use an LLM
prompt?" is the first question that comes to mind. Let's be honest, when you're
working at the terminal you don't want to move to a prompt, or enter into a chat
mode that you're talking back and forth with the model. The motivating part of
this program to me is that interaction is easy. It's just `^G` at the command
line!

## Rust? Yes, Rust.

I love Rust. It's a great language and getting better all the time. This is
coming from an old C++/C developer, too! However, the models of the past
(like 2024) were not so good at writing Rust code. Guess what? The models of the
future (2026) are seemingly not-terrible at it! So, I decided to build a simple
project in Rust this time. A reminder that I am a "directing prompter" -- I
don't say things like "build me an application that does X" instead I say things
like

> [!prompt] Build me a Rust application using the clap library that initally
> supports only a config flag that points to a file that contains a json
> configuration file to configure our application and then all positional
> arguments as in `interpreter -- the rest of the arguments`. Those latter
> arguments will be the prompt that we will send to the LLM model. Use the llm
> crate for abstracting model choice and communication.

Then later, when I realized that I wanted to make installation and configuration
as simple as I possibly can (and also experiment with a TUI application) I used
a prompt like this

> [!prompt] Great! Now we need to build a configuration TUI using the cursive
> library to configure our json object. Store this file in the local
> configuration directory for the OS (mac or linux) and build a hierarchical TUI
> using a dark mode with a slate blue tone that allows us to edit the JSON
> object. Inputs should accept a value when enter is pushed and cancel when
> escape is pushed. I want vim navigation alongside natural arrow keys. The TUI
> should populate with the values from the configuration file. Produce a model
> list for suggesting model choices and query for both the model and cost so
> users can make an informed decision about which model they want to use. The
> model selection menu should be a filterable list that uses enter to select a
> model. This should all be developed in a new module init_tui and use the
> cursive library to build it.

Not too explicitly descriptive, but also I'm telling this thing what I want and
even sometimes where I want it. The downside is that I didn't get to learn
myself how to use the `cursive` library. However, the upside is that this TUI
was complete on the inside of a few minutes. I was off, I could
`interpreter --init` and configure this application entirely!

## Installation

From here, the natural point for me was to make the easiest possible
installation and while I'm at it make a debuggable application while I'm
building so I don't have to overwrite my installation of this binary once I get
to the point of publishing it...which should be soon I hope.

I asked the robot to create `interpreter --install` which would create the
configuration directory, put a sample json configuration file there with
defaults, then run `--init` the TUI to configure the application. After changing
any settings the user desires, the final output is how to install the
zsh/fish/bash commands that set the bindkey and do the command line replacement.

## The Shell Widget Is The Whole Product

What makes this tool _feel_ like a tool is the shell integration: the moment
where your half-baked command-with-words-in-it becomes a real command without
you ever leaving the prompt.

In zsh, the entire integration is twenty lines:

```zsh
_interpreter_widget() {
  emulate -L zsh
  local input=$BUFFER
  zle -R "interpreter: thinking…"

  local output rc
  output=$("$INTERPRETER_BIN" --config "$INTERPRETER_CONFIG" -- "$input" 2>/dev/null)
  rc=$?
  if (( rc != 0 )); then
    zle reset-prompt
    zle -M "interpreter: failed (exit $rc)"
    return 1
  fi

  BUFFER=${output%$'\n'}
  CURSOR=${#BUFFER}
  zle reset-prompt
}
zle -N _interpreter_widget
bindkey "$INTERPRETER_KEY" _interpreter_widget
```

This is the beauty is that it essentially overwrites your prompt with output
from the model. Many of the other chat-in-terminal tools I've used are
cumbersome to interact with. One of my favorite ones
[AIChat](https://github.com/sigoden/aichat) is _much_ more powerful than this
tool...but was too cumbersome to use to do the most useful part of it to me!

I just want to type some shit and get a command out. Better yet, use the history
of commands in this shell and of things I've used over time to make an educated
guess at what I'm trying to type.

It's handy. You should try it.

# Some Context

We, avid users of LLMs, all know that **Context Is King!** The next feature I
added was the ability to specify an additional context system prompt addition
which is a standard way to add your own flavor to the model output.

The other thing I added though, after asking a few of my friends to test the
CLI, was a "context files" feature that loads up file paths. These files are
loaded into the context window of the model and can be used to add specialized
information to the LLM such as commands you particularly use. Unforunately today
this is single-command, so everything would have to be on one line to currently
function, but perhaps in the future we can build a series of commands or
something if that's necessary. For now, though, this is primarily a "hotfix my
command" style interpreter.

Honestly, it really reminds me of [fuck](https://github.com/nvbn/thefuck)!

Loading these files has given me a real taste for the fine-tuning of LLM
behavior though. Despite having a simple system prompt that directs models to
prefer content from user-provided files....it often does not. It will take some
tinkering to get this to work properly, but I see a bright future on the
horizon.

# Close

So far the little tool has proven to be quite useful to me. Especially in the
age of context switching like mad between orchestration of agents in multiple
projects...It was fun to use claude and vim in combination to edit a live
codebase simultaneously using Rust. Even if it is a simpler project compared to
others.

Oh, one other thing I forgot to mention. I built in Ollama support so you can
run local models and not chew through :moneybag:! You're welcome!
