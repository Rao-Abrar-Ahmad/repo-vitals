# RepoVitals

A full health checkup for your GitHub repository.

RepoVitals is a stateless, one-shot analyzer for public JavaScript and Node.js GitHub repositories. Paste a repository URL, and the app fetches repository metadata, language usage, dependency health, known vulnerabilities, code quality signals, and an AI-generated review. Results stream back progressively, so the report starts rendering as soon as the first data is available.

## What It Does

- Analyzes public GitHub repositories with a root `package.json`
- Fetches GitHub metadata, languages, contributors, releases, and root project files
- Checks npm packages for outdated, deprecated, and abandoned dependencies
- Queries OSV for known dependency vulnerabilities
- Calculates a repository health score and grade
- Streams report sections in real time with Server-Sent Events
- Adds AI narrative sections through OpenRouter
- Runs without accounts, a database, or stored user data

## How It Is Built

RepoVitals is built as a React single-page app backed by a Cloudflare Worker.

The frontend uses React, Vite, TypeScript, Tailwind CSS, Recharts, and small UI components for score rings, stat cards, health flags, dependency tables, vulnerability tables, language charts, and AI summary sections.

The backend uses Hono on Cloudflare Workers. The `/api/analyze` endpoint accepts a GitHub repository URL, gathers data from GitHub, npm, and OSV, calculates health signals, then streams events back to the browser using SSE.

OpenRouter powers the AI review. The structured report can still render repository and dependency data even if the AI step is unavailable.

## Architecture

```text
Browser
  |
  | Paste GitHub URL
  v
React SPA
  |
  | POST /api/analyze
  v
Hono Cloudflare Worker
  |
  | GitHub API: repo metadata, languages, package.json, files, contributors, releases
  | npm Registry: dependency freshness and deprecation status
  | OSV: vulnerability checks
  | OpenRouter: AI narrative
  v
SSE stream back to React report UI
```

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Backend | Hono |
| Runtime | Cloudflare Workers |
| Streaming | Server-Sent Events |
| AI | OpenRouter |
| Data sources | GitHub REST API, npm Registry API, OSV API |

## Project Structure

```text
src/
  frontend/
    components/      React report components and UI primitives
    context/         Theme state
    hooks/           Analysis/SSE hook
    lib/             Formatters and language colors
    types/           Shared frontend types
  worker/
    ai/              OpenRouter streaming client
    pipeline/        GitHub, npm, OSV, scoring, and AI payload logic
    routes/          Hono API routes
    index.ts         Worker entry point
```

## Requirements

- Node.js 18+
- pnpm
- An OpenRouter API key for AI narrative sections

The GitHub, npm, and OSV integrations use public APIs and do not need API keys.

## Environment Setup

Create a local `.dev.vars` file for Wrangler:

```bash
OPENROUTER_API_KEY=your_openrouter_api_key
```

For deployed Cloudflare Workers, set the secret with:

```bash
pnpm wrangler secret put OPENROUTER_API_KEY
```

## Install

```bash
pnpm install
```

## Run Locally

Start the Vite frontend and local Wrangler worker together:

```bash
pnpm dev
```

Vite serves the frontend locally and proxies `/api` requests to Wrangler at `http://localhost:8787`.

Open the Vite URL printed in your terminal, usually:

```text
http://localhost:5173
```

## Close The App

To stop the local development servers, return to the terminal running `pnpm dev` and press:

```text
Ctrl+C
```

If prompted to terminate the batch job, confirm with `Y`.

## Build

```bash
pnpm build
```

The production frontend build is written to `dist/`, which is served by the Cloudflare Worker assets binding.

## Deploy

```bash
pnpm deploy
```

The deploy script builds the frontend and publishes the Worker with Wrangler.

## API

### `GET /api/health`

Returns a simple health check:

```json
{ "status": "ok", "version": "1.0.0" }
```

### `POST /api/analyze`

Starts a streamed repository analysis.

Request body:

```json
{ "url": "https://github.com/owner/repo" }
```

The response is an SSE stream with events for repository metadata, languages, contributors, releases, dependency health, vulnerabilities, score, quality signals, AI chunks, completion, and errors.

## Current Limitations

- Public GitHub repositories only
- JavaScript and Node.js projects only
- Requires a root-level `package.json`
- No private repository scanning
- No database or persistent history
- Only the root package is analyzed for monorepos
- GitHub unauthenticated rate limits may apply

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Install dependencies with `pnpm install`.
4. Run the app locally with `pnpm dev`.
5. Keep changes focused and consistent with the existing React, Hono, and TypeScript structure.
6. Build before opening a pull request:

```bash
pnpm build
```

When contributing, prefer small pull requests with a clear description of what changed, why it changed, and how it was tested.

## License

MIT License.

Copyright (c) 2026 RepoVitals contributors.
