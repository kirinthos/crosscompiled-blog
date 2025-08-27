---
draft: true
---

# Day 2: Adding Voice To Text

One thing I've always wanted in Linux was a way to do arbitrary voice to text. I
ultimately want to write this directly into an input field, but I'll settle for
through this extension, because then I can talk to the chatbot about my text
I've generated; it can cleanup, suggest, and improve.

I ask it to add voice to text through the google API and I provide their
documentation that links directly to the python implementation page for this
product. While Claude is coding, I start setting up a trial GCP account and
Service Account key and get my speech to text service enabled and configured. I
finish a bit before Claude does and I observe as it writes out the full python
http server (oh, you didn't choose DBUS!?) and then continues to write a few
endpoints to communicate with it.

> ![info] One of the things I love most about the AI-assisted development
> ecosystem so far is that I don't have to do boilerplate anymore. I rarely ever
> write boilerplate. I have found that comment-led development can help when
> issues arise as I describe in [Detour Autocomplete](./detour-autocomplete.md)

It sets up the system with `arecord` which is surprisingly a good choice. ALSA
setups are very common as its a fundamental package in the Linux sound
ecosystem. It can configure the recording setup which will be great for reducing
the size of our upload and changing quality if we want. _Although it did wrongly
assess that I have the package `alsa-utils` which I did not._ Despite how
excited I am, I am absolutely not giving AI root access, so I install the
package myself, test `arecord` and then tell the robot to resume developing the
server. It was waiting to see if the server had started.

> ![warn] Cursor regularly gets hungup on foreground processes that don't
> return. Be aware of this and plan accordingly. Sometimes I have it build in to
> its system the ability to add a test parameter to cause an exit somehow, which
> allows the system to iterate on backend development autonomously.

> ![thought] At this point, I might start making this type of breakout. This is
> my thoughts callout pane. I will type stream of consciousness interruptions to
> main content in blurbs like these. Here's one coming now:
>
> I've had the blog AI write the ability to add callouts. It's quite satisfying
> to add arbitrary features to my own blog without doing anything myself. I
> still fear the day I need to heavily modify something manually.

It fires up the google server, talks to the text to speech api, uploads my
file...and has a configuration error.

> Error: sample_rate is 44100Hz when wav header says 16000Hz

Nice. So, I direct the robot to fix its configuration error, which turned out to
be a default value in the recorder that wasn't set to the same sample rate as
the api call to google. While it's fixing this I queue up the next prompt (yes,
I finally started recording the prompts for the blog!)
