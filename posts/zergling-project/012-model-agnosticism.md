---
title: "Model Agnosticism and Local LLMs"
date: "2026-02-09"
author: "Jay"
excerpt:
  "Introduce model agnosticism into our agent-server and load up some local
  models!"
tags: ["agents", "llms", "local", "openai", "anthropic", "modularity"]
---

# Picking Up Where We Left Off

Oooh, title case, gotta love it.

What were we doing last time? Let's just ask:

> [!prompt] what were we doing in our last commit and what do you think our next
> step should be if we want to introduce an abstraction on model vendor choice?

While it examines what we've done, I want to ask an interesting thing of the
model. I want it to document what we have constructed inside of a markdown file.
I want this file to describe our modules and implementation choices, interfaces,
utilities, libraries, all of the goodies. With this over-arching description of
our project, I can begin to manipulate the context of the model and point it to
subsections of the project to work on. This will be very powerful (I suspect)
for our current goal of running LOCAL LLMS! :moneybag:

Let's look at that prompt.

> [!prompt] I would like you to build a document hierarchy. Create a new
> top-level directory called architcture/ and in this directory I would like you
> to write markdown files describing our entire codebase. These documents should
> be relatively concise, describing only what they need to and when more
> detailed information is needed, link out to another markdown document. As an
> example, we have four main projects so far: zergling-extension,
> zergling-agent-server, zergling-web-ui, and zergling-voice2text. Let's order
> this folder hierarchically as well, with each directory containing a
> CONTENTS.md file. The CONTENTS.md file will be a brief description of the
> current level of the hierarchy and act as a table of contents for the sibling
> markdown files in the same directory. This means there will be four folders,
> one for each project, each containing a CONTENTS.md. As an example of what
> these directories contain, take zergling-agent-server: there should be a
> document describing the web server and the api and another document describing
> the mcp server and integrated tools. As you scan each project and compose this
> document hierarchy, group related information in the same document. Once you
> are done, generate a RULES.md file in the root of the repository that
> describes the rules for reading and modifying these documents.

WOOF! What a mouthful. Let's see if this works. This agent will churn in the
background while we get back to work. This, to me, is some of the most power to
gain from agents. I love modularity and I aim to instruct our agents to maintain
my love with the ulterior goal of having discrete modules that encapsulate
work...much like the paradigm itself! We know that if we have some module that
loads files and that module has a public interface and is sound and well tested
that we don't need to think about what that module does, only _what it provides
for us!_ We're going to exploit this to the optimus!

> [!robot] What the last commit did
>
> The last commit introduced the Zergling agent server, REPL, and web UI, and
> then added MCP tool support across all of them.
>
> - Agent server (zergling-agent-server)
>   - FastAPI app that proxies chat to the Anthropic Messages API.
>   - POST /chat: forwards messages (and optional system/tools) to Anthropic;
>     supports tool-use loop (up to 10 rounds).
>   - GET /config, GET /health, GET /tools (from MCP), GET /models
>     (vendor-keyed: anthropic from Anthropic’s API, openai as a placeholder).
>     API key from env or x-zergling-api-key; model/endpoint from headers.
>   - MCP app mounted at /mcp; tools (e.g. list_directory) are converted to
>     Anthropic tool format and executed in the loop.
> - REPL
>   - Adds /tool (list/set/clear tools), sends tool_names in chat when set,
>     shows active tools in the banner.
> - Web UI
>   - Tools row and expandable tools panel; activeToolNames in settings and sent
>     with chat.
>
> So the current state is: one backend (Anthropic only) for both listing models
> and performing chat; OpenAI is only a placeholder in the /models response.

> [!note] Ah, shit. Bullets don't render in callouts. I wonder if the blog agent
> can fix that while I keep working... [prompt: I can't put bullets in my > > >
>
> > callouts, could you fix this for me?]

Also, we're making use of AGENTS.md. Because I want to be model agnostic, I
don't want to use specifically cursor rules. We're going to have our local
agents obey AGENTS.md as well! Here's all I'm putting in there right now:

```markdown
# Role

You are an expert programmer. You write concise code and use modularity to
maintain a clean and simple codebase.

# Always

- See architecture/CONTENTS.md for documentation on the project.
  - Observe RULES.md when modifying architecture documentation
- Prefer unit tests. Do not create new files for one off testing. Write test
  suites.
- Run python in a virtualenv
```

Start simple. Add as needed. We'll refine this over time and I will point out
whenever I do. Back to the next step, model modularity. Here's the paraphrased
output of "what we should do next" from the AI point of view.

> [!robot]
>
> - Define a small provider interface (e.g. in zergling-agent-server/):
> - Implement an Anthropic provider that wraps the current logic:
> - Route by model (or vendor) in the API layer:
> - Keep tool handling vendor-aware

Hmm, not bad. I'm going to ask it to write a plan for this, but to include in
this plan developing an abstract class for vendors, or potentially models? -- so
we can add new models as we use them. Let's get started.

> [!prompt] Great idea. Develop a plan on the changes we plan to make. Consider
> using an abstract class to create a model agnostic interface. We know we'll
> want to chat with the models, and we know we'll need tools, be sure to include
> these features.

Have to give the guy some encouragement, he's doing a great job. While this
thing churns I'll say that GPT-5 is great for this planning feature. I'm
thinking that when we get our local model swarm off the ground, we may use a
very "intelligent" model to do our planning and have it compose documents or
tickets of what needs to be done, then pass that to an orchestrator who spins up
implementing agents. I'll get a diagram for this as we get closer.

The plan is solid. I want to find a way to start including these plans in the
blog posts in an expanding output or something so that you can read what I'm
generating and have context when I make suggestions to the agent about the plan.
Let me see if this blog agent can figure that out.............Alright, here's
the plan after some back and forth while this collapsible section was built in
the blog.

> ?? Model Vendor Abstraction Plan
>
> ---
>
> name: Model vendor abstraction overview: Introduce an abstract ModelProvider
> base class in the agent server that defines a vendor-agnostic interface for
> listing models and performing chat (including tool-use rounds). Move the
> existing Anthropic logic behind an AnthropicProvider implementation and route
> requests in main.py via the abstraction. todos:
>
> - id: base-interface content: Add providers/base.py with ABC, result types,
>   registry, get_provider_for_model status: completed
> - id: anthropic-provider content: Implement AnthropicProvider (list_models
>   from API, chat, to_tools) status: completed
> - id: main-refactor content: Refactor main.py to use providers for /models and
>   /chat; no static model lists status: completed
> - id: openai-provider content: Implement OpenAIProvider (list_models from
>   OpenAI API, chat with tool_calls, to_tools); register and route gpt-\*
>   status: in_progress isProject: false
>
> ---
>
> # Model vendor abstraction plan
>
> ## Goal
>
> Support multiple model vendors (Anthropic now, OpenAI later) behind a single
> API by defining a model-agnostic interface and moving Anthropic behind it.
> Chat and tools are first-class: the interface includes listing models, sending
> chat with optional tools, and handling tool-use rounds.
>
> ## Current state
>
> - [main.py](zergling-agent-server/main.py): All vendor logic is
>   inline—Anthropic Messages API for GET /models (lines 124–188) and POST /chat
>   (lines 219–307), including the tool-use loop and MCP tool execution.
> - Tools: MCP exposes tools as `{name, description, input_schema}`; Anthropic
>   uses the same shape. The server converts by name, runs tools via
>   `mcp.get_tools()` and `tool.run(input)`, and appends tool_result blocks to
>   messages.
>
> ## Architecture
>
> ```mermaid
> flowchart LR
>     subgraph api [HTTP API]
>         GET_models[GET /models]
>         POST_chat[POST /chat]
>     end
>     subgraph routing [Routing]
>         resolve[Resolve provider by model]
>     end
>     subgraph providers [Providers]
>         ABC[ModelProvider ABC]
>         Anthropic[AnthropicProvider]
>         OpenAI[OpenAIProvider]
>         ABC --> Anthropic
>         ABC --> OpenAI
>     end
>     subgraph mcp [MCP]
>         get_tools[get_tools_for_api]
>         run_tool[tool.run]
>     end
>     GET_models --> resolve
>     POST_chat --> resolve
>     resolve --> Anthropic
>     Anthropic --> get_tools
>     POST_chat --> run_tool
> ```
>
> - **One round per provider**: Each provider implements a single chat round
>   (request → response). The server owns the tool loop: it calls the provider;
>   if the response is tool_use, it runs MCP tools, appends results to messages,
>   and calls the provider again (up to N rounds).
> - **Canonical tools**: MCP gives a canonical list
>   `[{name, description, input_schema}]`. Each provider converts that to its
>   own API format and parses tool_use from its response into a normalized shape
>   so the server can execute by name and feed back.
>
> ## 1. Abstract interface and types
>
> **New module**: `zergling-agent-server/providers/base.py` (or a single
> `providers.py` if preferred).
>
> - **Result types** (vendor-agnostic):
>   - `ListModelsResult`: `models: list[dict]` (each with at least `id`;
>     optional `display_name`, `created_at`, `type`), optional `error: str`,
>     optional pagination fields (`has_more`, `first_id`, `last_id`).
>   - `ChatRoundResult`: either final text or tool uses—e.g. a small dataclass
>     or TypedDict with `content: str | None` and
>     `tool_uses: list[ToolUse] | None` where one is set; `ToolUse` has `id`,
>     `name`, `input: dict`.
> - **Abstract base class** `ModelProvider` (use `abc.ABC` and
>   `@abstractmethod`):
>   - `vendor_id: str` — e.g. `"anthropic"` (class or instance attribute).
>   - `list_models(self, api_key: str | None) -> ListModelsResult` — async;
>     fetches model list for this vendor (or returns error if key
>     missing/invalid).
>   - `chat(self, messages: list[dict], model: str, system: str, max_tokens: int, tools: list[dict] | None) -> ChatRoundResult`
>     — async; one round. `tools` are in **vendor-specific format** (provider
>     converts from canonical internally or receives already converted; see
>     below).
>   - `to_tools(self, canonical_tools: list[dict]) -> list[dict]` — convert from
>     MCP/canonical `{name, description, input_schema}` to the format this
>     vendor’s API expects. For Anthropic the canonical shape is already
>     compatible; for OpenAI this would map to function-calling format.
>
> So the server will: get canonical tools from MCP; call
> `provider.to_tools(canonical)`; in a loop call
> `provider.chat(messages, model, system, max_tokens, tools)`; if result has
> `content`, return it; else for each `tool_use` run MCP by name, append
> assistant + user tool_result messages, repeat.
>
> ## 2. Anthropic provider
>
> **New module**: `zergling-agent-server/providers/anthropic.py`.
>
> - Implement `ModelProvider`: `vendor_id = "anthropic"`.
> - **list_models**: Move the existing GET logic from
>   [main.py](zergling-agent-server/main.py) (lines 131–186) into this
>   method—httpx to `ANTHROPIC_MODELS_URL` with pagination, return
>   `ListModelsResult` with `models` (and optional `error`, `has_more`, etc.).
> - **to_tools**: Accept canonical list; return as-is (Anthropic format matches)
>   or ensure `input_schema` has `type: "object"`; same as current
>   `_anthropic_tools_from_names` but keyed by the canonical list, not by names
>   filter.
> - **chat**: Accept `messages`, `model`, `system`, `max_tokens`, `tools`. Build
>   request, POST to `DEFAULT_ENDPOINT` (or configurable), use
>   `anthropic-version` and `x-api-key`. Parse response:
>   - If `stop_reason == "end_turn"`: return `ChatRoundResult(content=text)`.
>   - If `stop_reason == "tool_use"`: extract `tool_use` blocks to
>     `ToolUse(id, name, input)` and return `ChatRoundResult(tool_uses=[...])`.
>   - Otherwise raise or return an error result.
>
> Dependencies (httpx) stay in the provider; no need to change
> [requirements.txt](zergling-agent-server/requirements.txt) if httpx is already
> there.
>
> ## 3. Provider registry and routing
>
> - **Registry**: In `base.py` or a small `providers/registry.py`, maintain a
>   mapping `vendor_id -> ModelProvider` instance. Register provider instances
>   at import/startup only—**no static model lists**. The registry holds only
>   the code that knows how to talk to each vendor; model lists are always
>   loaded live from the vendor API when GET /models is called. For each
>   registered provider, GET /models calls `provider.list_models(api_key)`,
>   which performs an HTTP request to that vendor’s models API (e.g. Anthropic
>   GET /v1/models, OpenAI GET /v1/models) and returns the result. Do not cache
>   or store model lists in the registry or in config.
> - **Resolve provider from model**: Add a function
>   `get_provider_for_model(model_id: str) -> ModelProvider`. Use model-id
>   prefix (e.g. `claude-` for Anthropic, `gpt-` for OpenAI) to return the
>   correct provider; unknown prefixes return None. Optionally support an
>   explicit `x-zergling-vendor` header later; for this step prefix-based is
>   enough so the REPL and web UI need no change.
>
> ## 4. Changes in main.py
>
> - **Imports**: Import the abstract types, `get_provider_for_model`, and the
>   registry (so Anthropic is registered).
> - **GET /models**: Build result dict by iterating registered providers (or by
>   vendor keys you want to expose). For each, call
>   `provider.list_models(api_key)` and map `provider.vendor_id` →
>   `ListModelsResult` serialized to the current JSON shape (`models`, `error`,
>   `has_more`, etc.). Keep the same response shape so the UI and REPL remain
>   compatible.
> - **POST /chat**:
>   - Resolve provider: `provider = get_provider_for_model(model)`; if None, 400
>     “Unknown model or vendor”.
>   - API key / endpoint: today we have Anthropic-only env/headers. Pass the
>     resolved key and optional endpoint into the provider (Anthropic provider
>     can take `api_key` and optional `endpoint`; other vendors can have their
>     own env vars later).
>   - Get canonical tools from MCP if `body.tool_names` is set; filter by
>     `tool_names`; call `provider.to_tools(filtered_canonical)`.
>   - Tool loop: `messages` list, `max_tool_rounds = 10`. Loop:
>     `result = await provider.chat(messages, model, system, max_tokens, tools)`.
>     If `result.content` is set, return `ChatResponse(content=result.content)`.
>     If `result.tool_uses` is set, for each item run the MCP tool by name (same
>     as today: `mcp.get_tools()`, `tool.run(input)`), build tool_result blocks,
>     append assistant message with content list and user message with
>     tool_result blocks to `messages`, then continue the loop. After max
>     rounds, return 502.
> - **Config / keys**: Leave `_server_has_anthropic_key()` and `/config` as-is
>   for now (still Anthropic-focused). Later you can generalize to “has API key
>   for vendor X” when adding OpenAI.
>
> Remove from main.py: inline Anthropic URL/endpoint constants used only by the
> provider, the direct Anthropic GET /models and POST /chat implementation,
> `_anthropic_tools_from_names` (replaced by provider.to_tools + filter by
> tool_names). Keep `_tool_result_content`, `_get_api_key`, `_get_model`,
> `_parse_max_tokens`, and request/response models.
>
> ## 5. Tool conversion and tool_names
>
> - Canonical tools come from `get_tools_for_api()`; filter by `body.tool_names`
>   to the list of tool definitions for those names. Pass that filtered list to
>   `provider.to_tools(...)`. So the provider receives only the tools that are
>   enabled for this request, in canonical form, and returns vendor-specific
>   tools. The server then passes that vendor payload into
>   `provider.chat(..., tools=...)`.
>
> ## 6. REPL and Web UI
>
> - No changes required: they send `x-zergling-model` and optional
>   `x-zergling-api-key`; the server routes by model id and returns the same
>   response shapes.
>
> ## 7. Documentation and layout
>
> - Add a short note in
>   [zergling-agent-server/README.md](zergling-agent-server/README.md) that the
>   server uses a provider abstraction and supports Anthropic and OpenAI; model
>   id prefix is used to select the vendor. Document env vars for both (e.g.
>   `ZERGLING_ANTHROPIC_API_KEY`, `OPENAI_API_KEY` or
>   `ZERGLING_OPENAI_API_KEY`).
> - If you add `architecture/zergling-agent-server/` docs, add a sentence that
>   GET /models and POST /chat are vendor-agnostic and implemented via the
>   ModelProvider abstraction; model lists are loaded from each vendor’s API,
>   not stored statically.
>
> ## 8. OpenAI provider
>
> - **New module**: `zergling-agent-server/providers/openai.py`.
> - **list_models**: Call OpenAI’s models API (e.g.
>   `GET https://api.openai.com/v1/models`) with the provider’s API key. Map the
>   response to `ListModelsResult` (id, and optionally display name / created,
>   etc.). Handle pagination if the API supports it. Require API key (return
>   error in result if missing).
> - **chat**: One round using OpenAI Chat Completions API. Accept `messages`,
>   `model`, `system`, `max_tokens`, `tools`. Convert messages to OpenAI format
>   (role + content). If `tools` is set, send them as `tools` in the request
>   (function-calling format). Parse the response: if the choice has a
>   `message.content` and no `tool_calls`, return
>   `ChatRoundResult(content=...)`. If the choice has `message.tool_calls`, map
>   each to `ToolUse(id, name, input)` and return
>   `ChatRoundResult(tool_uses=[...])`. Map OpenAI’s tool call id/name/arguments
>   (JSON string) into the normalized `ToolUse` shape.
> - **to_tools**: Convert canonical `{name, description, input_schema}` to
>   OpenAI’s function format:
>   `{"type": "function", "function": {"name": ..., "description": ..., "parameters": input_schema}}`.
> - **Config**: Read API key from env `OPENAI_API_KEY` or
>   `ZERGLING_OPENAI_API_KEY` (and optionally from a future header like
>   `x-zergling-openai-api-key`). No static model list; models come from
>   `list_models()` only.
> - **Registry**: Register `OpenAIProvider()` in the provider registry under
>   `vendor_id = "openai"`.
> - **Routing**: In `get_provider_for_model`, treat model ids that start with
>   `gpt-` (or other known OpenAI prefixes, e.g. `o1-`) as OpenAI and return the
>   OpenAI provider.
> - **GET /models**: Already iterates providers; the new OpenAI provider will be
>   included automatically and its `list_models(api_key)` will be called to fill
>   the `openai` key in the response (replacing the current placeholder empty
>   list).
>
> ## Summary of new/edited files
>
> | File                                           | Action                                                                                                                                                                                    |
> | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
> | `zergling-agent-server/providers/base.py`      | New: ABC, `ListModelsResult`, `ChatRoundResult`, `ToolUse`, `get_provider_for_model`, registry                                                                                            |
> | `zergling-agent-server/providers/anthropic.py` | New: `AnthropicProvider` implementing list_models, chat, to_tools                                                                                                                         |
> | `zergling-agent-server/providers/__init__.py`  | New: export provider types and register Anthropic + OpenAI (so main can import and have registry populated)                                                                               |
> | `zergling-agent-server/providers/openai.py`    | New: `OpenAIProvider` implementing list_models (from OpenAI API), chat (Chat Completions + tool_calls), to_tools (function format)                                                        |
> | `zergling-agent-server/main.py`                | Edit: use providers for /models and /chat; remove inline Anthropic logic; keep MCP mount, /tools, /config, and tool-execution loop; support both vendors’ API keys for /config if desired |
>
> ## Optional follow-ups (out of scope for this plan)
>
> - Generalize `/config` to report per-vendor API key presence (e.g.
>   `has_anthropic_key`, `has_openai_key`).
> - Add `x-zergling-vendor` header to force provider selection when model id is
>   ambiguous.

Well that's lengthy as shit. At least you can read it though! There's still some
rendering issues in there for sure, but we'll fix those later. It's getting late
and I want to get on with the modeling. Let's make sure our vendor abstraction
works and check out some code.

> ?? Model Provider Base Class
>
> ```python
> from abc import ABC, abstractmethod
> from dataclasses import dataclass, field
> from typing import Optional
>
> PROVIDER_REGISTRY: dict[str, "ModelProvider"] = {}
>
>
> @dataclass
> class ToolUse:
>     id: str
>     name: str
>     input: dict
>
>
> @dataclass
> class ListModelsResult:
>     models: list[dict] = field(default_factory=list)
>     error: Optional[str] = None
>     has_more: Optional[bool] = None
>     first_id: Optional[str] = None
>     last_id: Optional[str] = None
>
>
> @dataclass
> class ChatRoundResult:
>     content: Optional[str] = None
>     tool_uses: Optional[list[ToolUse]] = None
>
>
> class ModelProvider(ABC):
>     vendor_id: str = ""
>
>     @abstractmethod
>     async def list_models(self, api_key: Optional[str]) -> ListModelsResult:
>         pass
>
>     @abstractmethod
>     async def chat(
>         self,
>         messages: list[dict],
>         model: str,
>         system: str,
>         max_tokens: int,
>         tools: Optional[list[dict]] = None,
>         api_key: Optional[str] = None,
>         endpoint: Optional[str] = None,
>     ) -> ChatRoundResult:
>         pass
>
>     @abstractmethod
>     def to_tools(self, canonical_tools: list[dict]) -> list[dict]:
>         pass
>
>
> def register_provider(provider: ModelProvider) -> None:
>     PROVIDER_REGISTRY[provider.vendor_id] = provider
>
>
> def get_provider_for_model(model_id: str) -> Optional[ModelProvider]:
>     if not model_id or not model_id.strip():
>         return None
>     mid = model_id.strip().lower()
>     if mid.startswith("claude-"):
>         return PROVIDER_REGISTRY.get("anthropic")
>     if mid.startswith("gpt-") or mid.startswith("o1-") or mid.startswith("o3-"):
>         return PROVIDER_REGISTRY.get("openai")
>     return None
> ```

So far this doesn't look too bad. I appreciate the use of dataclasses to gather
information on how models behave. I'm unsure as of right now what
`ListModelsResult` will be, but we have a way to get a provider's list of models
and chat with that model. Keeping this chat function as entirely functional (you
have to pass in the api_key, endpoint, tools, etc. each time) may end up
benefitting us in the long run as it will allow us to switch models easily.
Essentially, if we can abstract away the differences between each provider and
end up with a similar way to communicate with each one, including my local
models, then we can select the right model for the job.

Restarting the app and server, everything seems to continue to work. Let's have
it setup OpenAI as well and we'll see how well that works. Also, while we're at
it, let's take a look at those architecture documents. OOOOOOHHHH, it didn't
update the architecture directory! I've directed it to do this now. Seems like
AGENTS.md may not have been picked up by Cursor? Maybe I'll make a rule in
cursor to observe AGENTS.md if it exists. Excellent, it even updated existing
files, though the documentation itself is quite bland and not instructive (docs
below). I've added another rule to AGENTS.md:

> - Write documentation for your functions and classes

> ?? Model Providers Architecture Doc
>
> # Model Providers
>
> ## Overview
>
> Chat and model listing are **vendor-agnostic**: they go through a provider
> abstraction in `providers/`. The registry holds only provider instances; model
> lists are **loaded from each vendor’s API** when `GET /models` is called (no
> static model list). See [web-server-and-api.md](web-server-and-api.md) for how
> the API uses providers.
>
> ## Interface
>
> - **Module**: `providers/base.py` defines the abstract base and shared types.
> - **`ModelProvider`** (ABC): `vendor_id`, `list_models(api_key)`,
>   `chat(messages, model, system, max_tokens, tools, api_key?, endpoint?)`,
>   `to_tools(canonical_tools)`.
> - **Result types**: `ListModelsResult` (models, error?, pagination),
>   `ChatRoundResult` (content? or tool_uses?), `ToolUse` (id, name, input). One
>   round per `chat()` call; the server in `main.py` runs the tool loop (MCP
>   execution and re-calling the provider).
>
> ## Registry and routing
>
> - **Registry**: `PROVIDER_REGISTRY` in `base.py`;
>   `register_provider(provider)` at import (see `providers/__init__.py`).
> - **Routing**: `get_provider_for_model(model_id)` selects by model-id prefix:
>   `claude-` → Anthropic, `gpt-` / `o1-` / `o3-` → OpenAI. Unknown prefix
>   returns `None` (API returns 400).
>
> ## Implementations
>
> | Provider  | Module                   | Vendor ID   | Model prefix         | List models              | Chat                                                |
> | --------- | ------------------------ | ----------- | -------------------- | ------------------------ | --------------------------------------------------- |
> | Anthropic | `providers/anthropic.py` | `anthropic` | `claude-`            | GET Anthropic /v1/models | Messages API, tool_use → normalized `ToolUse`       |
> | OpenAI    | `providers/openai.py`    | `openai`    | `gpt-`, `o1-`, `o3-` | GET OpenAI /v1/models    | Chat Completions, tool_calls → normalized `ToolUse` |
>
> Each provider converts canonical tools (`name`, `description`, `input_schema`
> from MCP) to its API format via `to_tools()`; the server passes the result
> into `chat(..., tools=...)`.
>
> ## Configuration
>
> API keys are resolved in `main.py` per provider (header or env). Anthropic:
> `ZERGLING_ANTHROPIC_API_KEY` / `ANTHROPIC_API_KEY`. OpenAI:
> `ZERGLING_OPENAI_API_KEY` / `OPENAI_API_KEY`. Endpoint override
> (`ZERGLING_API_ENDPOINT`) applies to Anthropic only.

Okay, now the last piece for this article because it's getting late. I need a
model selector in the chat app...and a dark mode theme! So let's instruct a new
agent so it has 0 context from the prior agent's work and it has to use the
architecture docs, and I'm going to add some special sauce to this prompt.

> [!prompt] Update the zergling-web-ui to allow for model selection inside of
> the settings flyout. This should be a dropdown list of the models we can
> select. Query the server for supported models to ensure our list is up to
> date. Note that the server should use one API key header from the web ui, so
> if it requires different headers for anthropic and openai keys, fix that so
> they are the same header name. Once you are done with the model selection
> implementation. Add a theme to the settings menu as well. I want a theme that
> is a darker grey with white-ish text and pink as an accent color. If the
> documentation you require to implement this feature is not in the architecture
> documentation, update it.

> If the documentation you require to implement this feature is not in the
> architecture documentation, update it.

This. Will this work? This is sort of the beginning of my agent-loop style
prompt idea of having agents improve themselves over time. Improve themselves as
in engineer their own context, not reinforcement learning style fine-tuning.
Though if y'all can help me fund this adventure, I'd love to take on that
adventure, too!

![Model Selection Dropdown](/images/Zergling.Web.Model.Dropdown.png)

![WebUI Dark Mode](/images/Zergling.Web.Dark.Mode.Fail.png)

Oh fuck. Dark mode looks awful. I wonder if I'm going to have to do some real
designing, either drawing or writing the CSS myself. I'll attemp one quick
prompt to fix it and also ask why the hell OpenAI isn't present in this list.

> [!prompt] Dark Mode only affects the settings panel and the textbox, the
> entire page should be rendered in a dark theme. Also, I do not see OpenAI
> models present in the dropdown. Ensure that the server can query for OpenAI
> models
> https://developers.openai.com/api/reference/resources/models/methods/list

Once we get this working I'm going to call it a night. Next time, we'll get to
running a local model, get the abstraction for that in place, get it hooked up
to the MCP server and AGENTS.md and see if we can incorporate it into some of
the work we're doing! I only have 12GB of VRAM though, so I can't run anything
too powerful........yet!

I've had to re-prompt this guy a few times to get OpenAI models listed in the
dropdown...here's the most recent one:

> [!prompt] great, but i loaded the server with an OPENAI_API_KEY. Also, I don't
> care if there's an API key or not, we should always be listing all models that
> we support and if there is not an API key present then we should show an error
> to the user. OpenAI models should be present in the dropdown as well.

![Dark Mode and OpenAI](/images/Zergling.Web.Dark.Mode.And.OpenAI.png)

Fuck yeah!
