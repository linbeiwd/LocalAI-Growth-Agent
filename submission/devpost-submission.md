# Devpost Submission Copy

## Project title

LocalAI Growth Agent

## Tagline

Turn seven facts about a local store into one week of practical, channel-ready marketing content.

## Category

Work & Productivity

## Inspiration and problem

Small local merchants often know their products and customers well but lack a dedicated marketing team. They need more than generic copy: each channel has a different format, promotions must remain factually accurate, and a busy owner needs a simple plan they can execute throughout the week.

## What it does

The merchant enters the store name, business type, location, target audience, current offer, goal, and competitive context. LocalAI Growth Agent returns an audience profile, content strategy, 15-second Douyin script, Xiaohongshu post, WeChat Moments copy, seven-day action plan, and promotion advice.

## How it was built

The app uses Next.js-compatible Vinext, React, TypeScript, and a Cloudflare Worker-compatible server route. Merchant input is validated before any model call. The default runtime uses SiliconFlow's OpenAI-compatible Chat Completions endpoint with `deepseek-ai/DeepSeek-V3.2` in JSON mode; OpenAI GPT-5.6 through the Responses API remains a fallback. Parsed output must pass a server-side structural check before being returned to the UI.

## How Codex and GPT-5.6 were used

Codex with GPT-5.6 was the main development environment. It helped translate the official rules into a build plan, design the workflow and interface, implement the server integration and tests, diagnose MCP/API/proxy failures, verify a real end-to-end generation, and prepare the submission package. The human builder selected the merchant problem, the university-town food scenario, the accuracy constraints, and the runtime-provider decision.

## Challenges

The original OpenAI API route was blocked by unavailable API credits, while the local Cloudflare development runtime also exposed a Windows proxy incompatibility. The project was kept honest and runnable by retaining the OpenAI route as a fallback, integrating an authorized third-party provider, adding a proxy-aware development command, and validating every provider response before rendering it.

## Accomplishments and learnings

- A complete input-to-plan workflow rather than a single text box
- Safe server-side key handling and bounded error messages
- Real HTTP 200 generation with all seven planned days returned
- Four focused tests, ESLint, and a production build
- Clear separation between GPT-5.6/Codex development work and the default runtime model

## What's next

Test with consenting merchants, add feedback-based content revision, introduce reusable industry templates only after real demand is observed, and measure which channels and themes lead to merchant inquiries.

## Testing instructions

1. Open the live demo.
2. Keep the pre-filled university-town restaurant example or replace it with your own facts.
3. Select **Generate my content growth plan**.
4. Review the six result sections and the seven-day plan.
5. If a provider is temporarily unavailable, use **View the complete sample** to inspect the full product flow.

## Submission links

- Live demo: https://localai-growth-agent.qwewqsd.chatgpt.site
- Code repository: https://github.com/linbeiwd/LocalAI-Growth-Agent
- Public YouTube demo: `YOUTUBE_DEMO_URL`
- Codex `/feedback` Session ID: `CODEX_FEEDBACK_SESSION_ID`
