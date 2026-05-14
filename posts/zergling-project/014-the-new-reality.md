---
title: "The New Reality"
date: "2026-02-24"
author: "Jay"
excerpt:
  "I re-developed a major portion of this application over a couple of days and
  I'm here to report the insane changes that have come to the system."
tags: ["agents", "llms", "local", "assistant", "network"]
---

# I'm Sorry

First, let me apologize. I wrote this article post-mortem. I started
implementing this next amount of work with the aim of doing my usual post as I
went. Alas, I was completely carried away by the amount of progress I was making
and I used the full extent of my wait-time to study the existing code to ensure
I wasn't "coding myself into a box."

> [!note] Wait-time: The time I spend waiting for AI to implement the next
> prompt.
>
> I typically spend this time writing a blog post to catch you readers up on
> what I'm doing and my process, but this most recent time...I used it to study.
> This is one of the serious powers of vibe-coding-done-right, to me. If you can
> wield AI in specific, non-critical locations, then you can do _additional_
> work in the down time.

The changes that I've made to our application astound me. I have now realized
there is a critical component that I needed to operate my network of agents in
the fashion I want. I will talk about this more in a while...for now, I'm
wondering if there's a potentially useful product in here somewhere -- if it
doesn't exist already.

Let me say that I _still_ have not fired up all of the new hotness: OpenClaw. In
developing my system, and seeing videos and articles on OpenClaw, I wonder how
similar my system may be to that one. However, I decided to carry on developing
my own network for two main reasons. One: it's educational and I'm learning a
ton about manipulating LLMs, and two: in the case that some of this technology
does not exist, it will be very worthwhile to create (imo).

# The Details

- Massive UI changes
- Introduction of agents
- Streaming chat + my first debugging case (streaming tool calls)
- Databases and Sessions
- Background Agent to User communication
- Software Development with AI in-mind: Building to Introspect (and Debug)
- Iterative and Guided Development with AI
- A Massive Prompt

# Massive Prompt Time

Okay. Check this the fuck out. This is definitely my largest prompt to date and
I think well-describes my paradigm of "Guided Development." I don't want to tell
the AI at an extremely high level what I want and _hope_ it gets the system
right and constructed in an easily modifiable way. Instead, I want to help build
a software architecture that is easy for me to reason about as well; maintaining
one of my favorite software design principles: modularity.

> [!prompt] We need to empower agent teams. I realized something quite
> interesting. we built queues for an agent for communication, but we did not
> build a way for agents to retain their session. This can matter if there is a
> call and response requirement such as when there is a user notification that
> requires a response. Let's create the agent_sessions table. This table will
> have rows identified by the agent ID. Similarly to the sessions tables, we'll
> track the agent session messages in an additional table. This will allow
> agents to build a long-running session of turns, tool calls, and
> communications -- or to shut down and be recalled retaining the full context
> of their prior execution. It will also help when agents communicate with one
> another to retain the context of that communication over time.
>
> With this in place, I think we need to modify how agents and teams work. I
> thought we would be creating individual agents, but I see now that this is not
> the way forward. Instead, teams will be configured as a template for creating
> agents. We already have a couple of these configuration pieces in place: the
> system prompt and tool selection. We need additionally the ability to assign a
> model to the team, and the number of agents within the team. Now we can modify
> how teams behave! We will remove the agent messaging and work queues and
> instead we will have the Team messaging queue. The agent listener loop will be
> responsible for delegating messages to a new module, the agent_team_listener.
> This module will be responsible for holding the team queue and processing
> messages designated for a team. Each Team should spawn a new thread to perform
> its own listening loops so we can operate concurrently. This means that the
> agent_listener could likely become the agent_team_listener since the
> functionality will be quite similar, only instead of processing N queues, it
> will process only its own queue. We will
>
> The team listener wil have agent-based responsibilities. It will create an
> agent if there is a slot available (recall teams have a specified number of
> agents), and will otherwise enqueue the work into a holding queue for when an
> agent completes their prior work. Agents within a team will have a lifecycle.
> If the requested agent does not yet exist, it will be created and the creation
> event (or hook) will take place. When an agent requests some work from another
> team or a response from the user, it will go into a suspended state. After the
> agent has completed the work assigned to it, it will go into the shutdown
> state. Let's talk about these states.
>
> - Creation: create the agent with corresponding new ID. Create the agent's
>   session. Initiate the agent with the team's system prompt, toolbox, and
>   model configuration. Initiate the chat session with the work message and
>   details
> - Suspended: when awaiting feedback or output from another entity we suspend
>   the agent. This is much like an async/await system. The agent will use a new
>   tool, agent*suspend_with_message, which will take a message and suspend the
>   agent until a response is reached. The message should generate a unique
>   response ID (such as a UUID) and the team_listener will save the details of
>   the agent and the response identifier along with any other details into a
>   new suspended agents map (response ID -> agent). Suspended agents \_should
>   not* be used to do new work. Each work item that requires new context will
>   create a new agent. Suspended agents are woken when a message enters the
>   team queue with the correct response ID, at which point the team listener
>   waits for an open agent slot and revives the suspended agent, appends the
>   response to its session, and re-initiates the chat loop.
> - Shutdown: At the completion of an agent's work item, that agent is shutdown.
>   This means that all details are saved into the database, as they should be
>   already due to agent session tracking, we can mark the agent session as
>   complete in the database. Any resources in use are returned into the agent
>   pool and this will free up an agent slot for use for future work.
>
> Messages that go into team queues or the user notifications will have more
> details associated with them. All message originators need a unique message
> ID, this can be in the constructor for the message object itself. Messages
> should contain an originator data object that defines who the message came
> from, for example the user, another agent/team, or an event integration. This
> message ID can serve as the response ID in agents that require a response.
> Future messages that occur _in response_ to another message, such as a user
> responding to a user notification, should have an originator_message_id
> parameter in the message that will capture the original message's ID (the
> response ID which will identify which agent needs to be woken up). With this
> in place, we should be able to facilitate back and forth messaging between
> entities. Note: event integration messages do not exist yet, it is just
> another example of a message type that will come in the future.
>
> With all of these changes complete, we then need to modify the UI to suppor
> the new teams architecture. Creating a team will now require specifying a
> model and parameters for that model (context window, max tokens, etc.), the
> system prompt, the toolbox, and anything else. These should all be modifable
> properties as well, so we can change existing teams' settings. Responding to
> user notifications will require the additional message details to route
> messages to the correct team for waking up the suspended agent.

And the Plan that was generated:

> ?? Massive Agent Teams Refactor Plan
>
> # Agent sessions and teams architecture
>
> ## Current state (brief)
>
> - **DB**: [db.py](zergling-agent-server/data/db.py): `teams` (name,
>   system_prompt, tool_names), `agents` (name, team_id, model_id,
>   max_context_tokens), `sessions` / `session_messages` (user chat),
>   `user_notifications`, `processed_queue_messages` /
>   `agent_conversation_turns` (one-shot work log). No agent-level session.
> - **Queues**: One `team:{name}:work` and one `team:{name}:messaging` per team;
>   [AgentListener](zergling-agent-server/agent/agent_listener.py) polls all
>   team work queues with a global semaphore, processes one message per worker,
>   uses team config from first agent via
>   [get_team_agent_config](zergling-agent-server/data/teams_agents.py).
> - **Agents**: Created explicitly via POST /agents (name, team_name, model_id?,
>   context_window?); config split between team (system_prompt, tool_names) and
>   agent (model, context).
> - **Messages**: Work payloads are free-form (e.g. `{content}`); no message_id
>   or originator.
>   [submit_response](zergling-agent-server/data/user_notifications.py) only
>   updates DB; no queue wake-up.
>
> ## 1. Database: agent sessions and schema shifts
>
> **New tables in [db.py](zergling-agent-server/data/db.py)**
>
> - **agent_sessions**: `id`, `agent_id` (UNIQUE), `created_at`, `updated_at`,
>   `completed_at` (NULL = active). One row per agent instance; keyed by agent
>   id for long-running context.
> - **agent_session_messages**: `id`, `agent_session_id`, `turn_index`,
>   `originator`, `category`, `content`, `created_at`. Same shape as
>   [session_messages](zergling-agent-server/data/sessions.py) for consistency;
>   supports user, assistant, tool_call, tool_result, etc.
>
> **Team-as-template**
>
> - **teams**: Add `model_id`, `max_context_tokens`, `max_tokens` (optional),
>   `num_agents` (integer, default 1). Remove or stop using per-agent
>   model/context; team holds model config.
> - **agents**: Becomes “pool members” created on demand: keep `id`, `team_id`;
>   add `name` as optional/display (e.g. `agent-{uuid}`) or keep for
>   compatibility; drop or ignore `model_id` / `max_context_tokens` on agent
>   (read from team). No longer create agents by user-supplied name via API;
>   creation is internal when team listener allocates a slot.
> - **user_notifications**: Add `response_id` (TEXT, UUID) and `team_id` (or
>   `team_name`) for routing. When a notification is created from
>   `agent_suspend_with_message`, set these so that on PATCH response we can
>   enqueue to the correct team queue with
>   `originator_message_id = response_id`.
>
> **Data layer**
>
> - New module e.g. [data/agent_sessions.py](zergling-agent-server/data/):
>   `create_agent_session(agent_id)`, `get_agent_session(agent_id)`,
>   `append_agent_session_messages(session_id, messages)`,
>   `list_agent_session_messages(session_id, ...)`,
>   `complete_agent_session(agent_id)` (set `completed_at`). Mirror patterns
>   from [data/sessions.py](zergling-agent-server/data/sessions.py).
> - [teams_agents.py](zergling-agent-server/data/teams_agents.py): Add team
>   columns and
>   `update_team_config(..., model_id=, max_context_tokens=, max_tokens=, num_agents=)`.
>   Add `create_agent_for_team(team_id)` (insert agent, return agent_id) and
>   `get_team_config(team_id)` returning full template (system_prompt,
>   tool_names, model_id, max_context_tokens, max_tokens, num_agents). Deprecate
>   or remove “get config from first agent” in favor of team-only config.
> - [user_notifications.py](zergling-agent-server/data/user_notifications.py):
>   Add `response_id`, `team_id` to `create_notification` (optional); in
>   `submit_response`, return or expose `response_id` and `team_id` so callers
>   can enqueue the reply (or perform enqueue inside a new helper used by the
>   route).
>
> ## 2. Message envelope and queue semantics
>
> **Unified message shape** (for team queue and user-facing APIs)
>
> - **message_id**: Unique (e.g. UUID), set in constructor/factory for every
>   message.
> - **originator**: Object describing source — e.g. `{ type: "user" }`,
>   `{ type: "agent", agent_id, team_id }`, `{ type: "team", team_name }`,
>   `{ type: "event_integration", ... }` for future use.
> - **originator_message_id**: Optional; when present, this message is a
>   _response_ to that message (e.g. user reply to a notification). Team
>   listener uses this to wake the suspended agent that owns that response_id.
>
> **Concrete types**
>
> - Extend or replace [WorkItem](zergling-agent-server/message_queue/work.py)
>   (or introduce a `TeamQueueMessage`): required `message_id`, `originator`,
>   optional `originator_message_id`, plus body (e.g. `content`, or structured
>   payload). Keep backward compatibility for enqueue if needed (e.g. wrap
>   legacy `{content}` in default originator).
> - [InterTeamMessage](zergling-agent-server/message_queue/messaging.py): Add
>   `message_id`, `originator`, `originator_message_id` for consistency when
>   used in cross-team or wake-up flows.
>
> **Team queue only**
>
> - Single queue per team: `team:{team_name}:work`. Remove per-agent work
>   queues. Remove or repurpose `team:{team_name}:messaging` as needed (e.g. for
>   inter-team or internal use); plan assumes work and wake-up both go to the
>   team work queue with envelope fields.
>
> ## 3. Agent lifecycle and team listener
>
> **States**
>
> - **Creation**: Team listener allocates an agent (insert row), creates
>   agent_session, builds initial chat from team config (system_prompt,
>   tool_names, model_id, max_context_tokens, max_tokens) and work message, runs
>   chat loop.
> - **Suspended**: Agent calls `agent_suspend_with_message`; server generates
>   `response_id`, stores in
>   `suspended_agents[response_id] = (agent_id, session_id, …)`, creates user
>   notification with `response_id` and `team_id`. Chat loop stops until a
>   message with `originator_message_id == response_id` arrives.
> - **Shutdown**: After agent “finishes” (no suspend, no more tool rounds), mark
>   agent_session complete, release slot, optionally mark agent row for reuse or
>   leave as-is.
>
> **agent_team_listener (new module, e.g.
> [agent/agent_team_listener.py](zergling-agent-server/agent/agent_team_listener.py))**
>
> - Holds: team_id / team_name, team queue (single), `num_agents` (from team
>   config), in-memory **slot pool** (e.g. semaphore or set of “busy” agent
>   ids), **suspended_agents** dict:
>   `response_id -> { agent_id, session_id, ... }`, and a **holding queue**
>   (in-memory deque or list) for messages that arrived when no slot was free.
> - Loop (single thread/task per team):
>   1. Wait for message on team queue (or take from holding queue when a slot
>      frees).
>   2. If message has `originator_message_id` and it’s in `suspended_agents`:
>      pop entry, load agent session, append response as user message, re-run
>      chat loop for that agent (same run_chat, tools include
>      `agent_suspend_with_message` and `notify`), then on next shutdown release
>      slot and optionally push next holding item to queue.
>   3. Else if message is “new” work and there’s a free slot: create agent +
>      agent_session, init chat with work message, run chat (may suspend or
>      shutdown); if shutdown, release slot and process holding.
>   4. Else: push message to holding queue.
> - Run chat: same pattern as current listener (build `ChatRequest` from session
>   history, call `run_chat`, handle tool_uses; on `agent_suspend_with_message`
>   tool call, generate response_id, register in suspended_agents, create
>   notification, return from run so the loop “stops” for that agent until
>   wake).
>
> **agent_suspend_with_message tool**
> ([mcp_server.py](zergling-agent-server/mcp_server.py) or MCP layer)
>
> - Params: e.g. `message`, `title`, `summary` (similar to notify). Generates
>   `response_id` (UUID), creates user notification with
>   `response_requested=True`, `response_id`, `team_id`. Returns
>   `{ response_id, notification_id, ... }`. The **team listener** must
>   intercept this tool result: when the model calls this tool, the runner
>   (inside team listener) does not append a normal tool result and continue; it
>   registers the agent in suspended_agents and exits the chat loop for that
>   agent. So the tool can be implemented as a special case in the team
>   listener’s tool-dispatch (or the MCP tool returns a sentinel that the
>   listener treats as “suspend and store response_id”).
>
> **agent_listener refactor** ([main.py](zergling-agent-server/main.py) +
> [agent/agent_listener.py](zergling-agent-server/agent/agent_listener.py))
>
> - **agent_listener** becomes a thin coordinator: on startup, for each team
>   (from DB), ensure `team:{name}:work` queue exists, create one
>   **AgentTeamListener** instance, start one asyncio task per team running that
>   instance’s `run_loop()`. No longer register multiple queues on a single
>   global loop; each team task runs independently.
> - Remove global “register team work queue” from
>   [data_routes.py](zergling-agent-server/routes/data_routes.py) for new model:
>   new teams get a queue when the team is created; POST to enqueue still
>   creates queue if missing and ensures a team listener is attached (or team
>   listeners are created at startup from DB only).
>
> ## 4. User notification response → wake suspended agent
>
> - When user submits response: PATCH `/notifications/{id}/response` with
>   `response_text`. Backend:
>   [submit_response](zergling-agent-server/data/user_notifications.py) updates
>   notification; then (in route or a small service) fetch notification row for
>   `response_id` and `team_id`, enqueue to `team:{team_name}:work` a message
>   with `message_id=new_uuid`, `originator={ type: "user" }`,
>   `originator_message_id=response_id`, `content=response_text`. Team listener
>   will dequeue, match `originator_message_id` to suspended_agents, wake agent,
>   append message, resume chat.
>
> ## 5. API and routes
>
> - **Teams**: POST `/agents/teams` (or similar) to create team with name,
>   model_id, max_context_tokens, max_tokens, num_agents, system_prompt,
>   tool_names. PATCH `/agents/teams/{id}` extended to allow updating model_id,
>   max_context_tokens, max_tokens, num_agents, system_prompt, tool_names. GET
>   `/agents` continues to list teams with config (and can list “current” pool
>   agents per team if desired).
> - **Agents**: Remove or deprecate POST `/agents` (create agent by name).
>   Agents are created internally by team listener. Optional: GET
>   `/agents/teams/{id}/agents` to list active/pool agents for a team.
> - **Queues**: POST `/data/queues/{queue_name}/messages` body must support new
>   envelope: `message_id`, `originator`, `originator_message_id`, plus payload.
>   If omitted, generate default message_id and originator for backward
>   compatibility.
> - **Notifications**: PATCH `/notifications/{id}/response` body unchanged;
>   server-side uses stored `response_id` and `team_id` to enqueue the reply to
>   the correct team queue.
>
> ## 6. UI ([zergling-web-ui](zergling-web-ui))
>
> - **Teams (Agents page)**: Create team with required fields: name, model
>   (dropdown from `/models`), context window, max tokens, num_agents, system
>   prompt, toolbox. Edit team: same fields editable. Remove “Create agent”
>   (name + team); show teams and their config plus optional “pool size” or
>   “active agents” read-only.
> - **Notifications**: When submitting a response, no change to the payload;
>   backend uses `response_id` + `team_id` to route. If the UI ever needs to
>   show “which team this notification belongs to”, add optional display from
>   API (e.g. notification detail includes `team_name` or `response_id` for
>   debugging).
>
> ## 7. Documentation and tests
>
> - Update [CONTEXT.md](CONTEXT.md) and [architecture](architecture/) per
>   [RULES.md](architecture/RULES.md): agent_sessions, team-as-template, one
>   queue per team, agent_team_listener, lifecycle, message envelope,
>   notification response routing.
> - Tests: unit tests for agent_sessions CRUD, team config (create/update with
>   model and num_agents), message envelope parsing, team listener behavior
>   (allocate slot, suspend, wake, shutdown); integration test for enqueue
>   response with originator_message_id and wake-up.
>
> ## Implementation order (suggested)
>
> 1. DB schema: agent_sessions, agent_session_messages; team columns (model_id,
>    max_context_tokens, max_tokens, num_agents);
>    user_notifications.response_id, team_id. Data layer for agent_sessions and
>    team config.
> 2. Message envelope: WorkItem/TeamQueueMessage with message_id, originator,
>    originator_message_id; adopt in queue and APIs.
> 3. agent_suspend_with_message tool and notification creation with
>    response_id + team_id; submit_response enqueue-to-team logic.
> 4. AgentTeamListener: single-queue loop, slot pool, suspended_agents, holding
>    queue, create agent + session, run chat, handle suspend/shutdown.
> 5. Refactor startup: one AgentTeamListener task per team; remove old
>    AgentListener multi-queue loop.
> 6. API: teams CRUD with full config; deprecate or remove POST create agent;
>    queues accept new envelope.
> 7. UI: team create/edit with model and params; remove create-agent flow;
>    notifications response unchanged (backend routing).
>
> ## Diagram (high level)
>
> ```mermaid
> flowchart LR
>   subgraph teams [Teams]
>     T1[Team A]
>     T2[Team B]
>   end
>   subgraph queues [Team queues]
>     Q1["team:A:work"]
>     Q2["team:B:work"]
>   end
>   subgraph listeners [Team listeners]
>     L1[AgentTeamListener A]
>     L2[AgentTeamListener B]
>   end
>   T1 --> Q1
>   T2 --> Q2
>   Q1 --> L1
>   Q2 --> L2
>   L1 --> Pool1[Slot pool A]
>   L2 --> Pool2[Slot pool B]
>   L1 --> Suspended1[suspended_agents A]
>   L2 --> Suspended2[suspended_agents B]
>   User[User / API] --> Q1
>   User --> Q2
>   Notif[Notification response] --> Q1
> ```
>
> ```mermaid
> stateDiagram-v2
>   [*] --> Creation
>   Creation --> Running
>   Running --> Suspended : agent_suspend_with_message
>   Running --> Shutdown : work complete
>   Suspended --> Running : message with originator_message_id
>   Shutdown --> [*]
> ```

This turned out to be a ridiculous success and I was able to properly
orchestrate agents and allow them to communicate between one another. They could
develop a request for work and submit that work to the appropriate agent team
and then shut down and await a response from that team that work was completed,
then we reload the context and pick up where we left off.

It was really quite amazing to see this work in action and I started with a very
simple email reading team that would get emails and read their contents, then
query for agent teams and determine which one was best able to handle the
content in the message, such as scheduling events when my kids' schools emailed
us with event changes and updates.

This is the foundation of the new reality of the Zergling project. In order to
create a true agent swarm, they need to be able to communicate with each other
and delegate tasks to each other. Over my time using agents, I've found that
there is much more to gain by creating focused, specific agents that have a
collection of skills and tools to do exactly what they need.

This is fundamentally **_Context Engineering_**!

I'm going to keep this article short and sweet as I begin to re-imagine my
entire project.
