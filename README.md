# LocalAI Growth Agent

> Turn a local merchant's real store information into a practical one-week content plan.

LocalAI Growth Agent is a responsive web app for small offline businesses that do not have a dedicated marketing team. A merchant enters seven facts about the store, audience, promotion, and competition. The app returns content that can be reviewed and used across Douyin, Xiaohongshu, and WeChat.

**OpenAI Build Week track:** Work & Productivity  
**Built during:** July 13–21, 2026

## Why it matters

Small merchants often know their product but lack the time and experience to turn that knowledge into consistent online content. Generic AI copy is not enough: it can invent prices or claims, ignore local context, and provide no execution plan. This project converts a short merchant brief into a structured, channel-specific workflow while preserving the facts supplied by the user.

## What it generates

- Audience profile and positioning strategy
- 15-second Douyin script
- Xiaohongshu title, post, and tags
- WeChat Moments copy
- Seven-day content action plan
- Promotion improvement advice

The included university-town Guizhou barbecue example makes the complete flow testable without preparing data first.

## Architecture

```text
Browser form
   │ POST /api/generate
   ▼
Server-side input validation
   │
   ├─ SiliconFlow Chat Completions + DeepSeek-V3.2 (default)
   └─ OpenAI Responses API + GPT-5.6 (fallback)
   │
   ▼
JSON parsing and output-shape validation
   │
   ▼
Six result sections in the web UI
```

API keys remain server-side. The app prefers SiliconFlow when `SILICONFLOW_API_KEY` is configured and uses OpenAI only when that key is absent.

## How Codex and GPT-5.6 contributed

The majority of the project's core functionality was built in one Codex project thread during OpenAI Build Week.

Codex with GPT-5.6 helped to:

- inspect the official requirements and turn them into an implementation checklist;
- plan the product architecture and the judge-facing demo flow;
- build the responsive interface, API route, validation, and tests;
- diagnose MCP sandbox, API quota, and Windows proxy failures;
- verify both a minimal provider request and a full HTTP 200 merchant-plan generation;
- prepare this repository and the English submission materials.

The human builder made the key product decisions: focusing on university-town merchants, selecting the Guizhou barbecue scenario, prohibiting fabricated commercial claims, and choosing an available third-party runtime when OpenAI API credits were unavailable. GPT-5.6 was used through Codex for development and engineering work; the default production inference provider is identified separately and is not presented as GPT-5.6 output.

## Responsible output

The server prompt requires the model to use only facts supplied by the merchant. It explicitly prohibits invented discounts, sales figures, rankings, awards, addresses, contact details, customer feedback, and outcome guarantees. Every response is parsed and checked for the complete expected structure before it reaches the interface.

## Quick start

Requirements: Node.js 22.13 or newer.

```bash
npm ci
copy .env.example .env.local
npm run dev
```

Configure at least one provider in `.env.local`:

```dotenv
SILICONFLOW_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
```

Open <http://localhost:3000>. On Windows with `HTTP_PROXY` or `HTTPS_PROXY`, Node.js 24+ users can run `npm run dev:proxy`.

## Validation

```bash
npm test
npm run lint
npm run build
```

The current validation covers input normalization, invalid input rejection, OpenAI Responses parsing, SiliconFlow Chat Completions parsing, and final marketing-plan shape checks.

## Build Week submission

Submission-ready copy, the under-three-minute video script, and the final checklist are in [`submission/`](submission/). The official challenge page is [OpenAI Build Week on Devpost](https://openai.devpost.com/).

## License

[MIT](LICENSE)

