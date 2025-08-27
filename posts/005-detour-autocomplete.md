## draft: true

# Detour: AI Autocompletion

I want to talk about AI autocomplete. I at first thought it was quite miraculous
that it could complete so much so quickly. As time drew on, some of the
suggestions, particularly in systems languages like Rust, wouldn't be up to par.
I needed some way to improve them.

This is how I did it.

# Leading The Question

There's a psychology principle called leading the question where the question
you asks steers the responder to a particular answer. I have begun doing this by
building comment plans and loading that into the context. I'll be experimenting
with expanding this idea into architectural design with systems later, but for
now I want to show some examples of optimizing the autocomplete engine using
comments!
