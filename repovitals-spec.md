# RepoVitals — Full Project Specification

> A full health checkup for your GitHub repository.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure](#3-folder-structure)
4. [Architecture Overview](#4-architecture-overview)
5. [Data Sources & APIs](#5-data-sources--apis)
6. [Analysis Pipeline](#6-analysis-pipeline)
7. [Progressive SSE Streaming Strategy](#7-progressive-sse-streaming-strategy)
8. [OpenRouter AI Integration](#8-openrouter-ai-integration)
9. [API Endpoints (Hono Backend)](#9-api-endpoints-hono-backend)
10. [Report Sections & UI Design](#10-report-sections--ui-design)
11. [Frontend Implementation](#11-frontend-implementation)
12. [Cloudflare Deployment](#12-cloudflare-deployment)
13. [Environment Variables](#13-environment-variables)
14. [Constraints & Limitations](#14-constraints--limitations)

---

## 1. Project Overview

**RepoVitals** is a stateless, one-shot GitHub repository analyzer for JavaScript/Node.js projects. A developer pastes a public GitHub repo URL, the system fetches and analyzes the repo's structure, dependencies, vulnerabilities, and code quality signals, then streams a comprehensive AI-generated report back to the user in real time — progressively, section by section, as data becomes available.

### Core Goals

- Zero friction — no login, no account, just paste a URL
- Public GitHub repos only
- JavaScript/Node.js ecosystem only (v1)
- Stateless — no database, no persistence, no user data stored
- Fully free to run — all data sources and AI tier are free
- Beautiful, data-rich report with charts, tables, scores, and AI narrative
- Progressive rendering — widgets appear immediately as data arrives, no waiting for the full report

### What It Is NOT

- Not a CI/CD tool
- Not a code linter (no AST parsing)
- Not a private repo scanner
- Not a multi-language analyzer (v1)
- Not WebSocket-based — SSE (Server-Sent Events) handles all streaming perfectly since communication is one-directional (server → client only)

---

## 2. Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend | React (SPA) + Vite | Fast build, SPA fits stateless one-shot flow |
| Styling | Tailwind CSS | Utility-first, fast to build attractive UI |
| Charts | Recharts | Lightweight, React-native, no canvas dep |
| Backend | Hono.js | Cloudflare Workers native, minimal, fast |
| Runtime | Cloudflare Workers | CF-native, free tier, edge deployment |
| Static Assets | Cloudflare Pages (via Workers) | React SPA served as static assets from same worker |
| Streaming | SSE (Server-Sent Events) | One-directional server→client stream, CF Workers native |
| AI Provider | OpenRouter (free tier) | Free models with large context windows |
| AI Models | `google/gemini-flash-2.0` (primary), `deepseek/deepseek-r1` (fallback) | Large context, free tier, fast |
| Package Manager | pnpm | Fast, disk-efficient |
| Language | TypeScript | End-to-end type safety |

---

## 3. Folder Structure

```
repo-vitals/
├── src/
│   ├── frontend/                  # React SPA
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── ScoreRing.tsx          # Animated circular score ring
│   │   │   │   ├── StatCard.tsx           # Generic stat card (stars, forks, etc.)
│   │   │   │   ├── SeverityBadge.tsx      # CVE severity badges
│   │   │   │   ├── ChecklistItem.tsx      # Code quality signals checklist row
│   │   │   │   ├── QuickWinCard.tsx       # Numbered quick win card
│   │   │   │   ├── TopicChip.tsx          # Repo topic pill
│   │   │   │   ├── HealthFlag.tsx         # Archived / fork / master-branch flag pill
│   │   │   │   └── ContributorAvatar.tsx  # Contributor avatar + count chip
│   │   │   ├── sections/
│   │   │   │   ├── RepoIdentityCard.tsx   # Owner avatar, name, description, topics
│   │   │   │   ├── ActivityStatsRow.tsx   # Stars / Forks / Watchers / Issues / Size / Age
│   │   │   │   ├── HealthFlagsRow.tsx     # Archived, fork, master branch warnings
│   │   │   │   ├── ScoreSection.tsx       # Score ring + grade badge
│   │   │   │   ├── LanguageChart.tsx      # Donut chart with percentages
│   │   │   │   ├── TopContributors.tsx    # Top 5 contributor avatars + counts
│   │   │   │   ├── LatestRelease.tsx      # Latest version tag + date
│   │   │   │   ├── DependencyHealth.tsx   # 4 stat cards: total/outdated/vuln/deprecated
│   │   │   │   ├── OutdatedPackages.tsx   # Table of outdated packages with upgrade cmd
│   │   │   │   ├── VulnerabilityTable.tsx # CVE table sortable by severity
│   │   │   │   ├── CodeQualitySignals.tsx # Checklist: TS, tests, CI, lint, etc.
│   │   │   │   ├── ArchitectureSection.tsx
│   │   │   │   ├── LibraryChoices.tsx
│   │   │   │   ├── SecurityFlags.tsx
│   │   │   │   ├── QuickWins.tsx
│   │   │   │   └── AISummary.tsx
│   │   │   ├── skeletons/
│   │   │   │   ├── RepoIdentitySkeleton.tsx
│   │   │   │   ├── ActivityStatsSkeleton.tsx
│   │   │   │   ├── LanguageChartSkeleton.tsx
│   │   │   │   ├── DependencySkeleton.tsx
│   │   │   │   └── AISkeleton.tsx
│   │   │   ├── HeroInput.tsx              # Landing page URL input + analyze button
│   │   │   └── Report.tsx                 # Full report container (orchestrates phases)
│   │   ├── hooks/
│   │   │   └── useAnalysis.ts             # SSE streaming hook with phase management
│   │   ├── lib/
│   │   │   ├── utils.ts                   # Helpers, formatters (dates, bytes, etc.)
│   │   │   └── languageColors.ts          # Official GitHub language color map
│   │   ├── types/
│   │   │   └── index.ts                   # All shared TypeScript types
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   │
│   └── worker/                    # Hono backend (Cloudflare Worker)
│       ├── index.ts               # Hono app entry point + static asset serving
│       ├── routes/
│       │   └── analyze.ts         # POST /api/analyze — SSE streaming handler
│       ├── pipeline/
│       │   ├── github.ts          # All GitHub API calls
│       │   ├── npm.ts             # npm registry checker (outdated/deprecated/abandoned)
│       │   ├── osv.ts             # OSV batch vulnerability checker
│       │   ├── scorer.ts          # Score + grade calculator
│       │   └── payload.ts         # Builds structured AI payload from all data
│       └── ai/
│           └── openrouter.ts      # OpenRouter streaming client
│
├── public/                        # Static assets (favicon, og image)
├── wrangler.toml                  # Cloudflare Workers config
├── vite.config.ts                 # Vite build config
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 4. Architecture Overview

```
User (Browser)
     │
     │  1. Paste GitHub URL → click Analyze
     ▼
React SPA (Cloudflare Pages / Static Assets)
     │
     │  2. POST /api/analyze  { url: "https://github.com/user/repo" }
     │     Opens SSE stream — listens for events
     ▼
Hono Worker (Cloudflare Workers)
     │
     ├── 3a. GitHub API (parallel):
     │       - GET /repos/{owner}/{repo}         → repo metadata
     │       - GET /repos/{owner}/{repo}/languages → language bytes
     │       - GET /repos/{owner}/{repo}/contents/package.json → deps
     │       - GET /repos/{owner}/{repo}/contents/ → root file listing
     │       - GET /repos/{owner}/{repo}/contributors?per_page=5
     │       - GET /repos/{owner}/{repo}/releases?per_page=1
     │
     │  → SSE Event 1: { type: "repo_meta", data: {...} }
     │  → SSE Event 2: { type: "languages",  data: {...} }
     │  → SSE Event 3: { type: "contributors", data: [...] }
     │  → SSE Event 4: { type: "release", data: {...} }
     │
     │  React renders Phase 1 widgets immediately ↑
     │  (RepoIdentityCard, ActivityStatsRow, LanguageChart,
     │   HealthFlagsRow, TopContributors, LatestRelease)
     │
     ├── 3b. npm Registry API (parallel Promise.all):
     │       - GET registry.npmjs.org/{pkg} for every dependency
     │       → outdated / deprecated / abandoned results
     │
     ├── 3c. OSV API (single batch POST):
     │       - POST osv.dev/v1/querybatch with all packages
     │       → CVE vulnerabilities per package
     │
     │  → SSE Event 5: { type: "dep_health", data: {...} }
     │  → SSE Event 6: { type: "vulnerabilities", data: [...] }
     │
     │  React renders Phase 2 widgets ↑
     │  (DependencyHealth cards, VulnerabilityTable,
     │   OutdatedPackages, CodeQualitySignals, ScoreRing)
     │
     ├── 3d. Build AI payload from all collected data
     │
     ├── 3e. POST to OpenRouter → streaming AI response
     │
     │  → SSE Events 7–N: { type: "ai_chunk", chunk: "..." }
     │  → SSE Event N+1:  { type: "done" }
     │
     │  React renders Phase 3 widgets as AI streams ↑
     │  (ArchitectureSection, LibraryChoices, SecurityFlags,
     │   QuickWins, AISummary)
     ▼
User sees report building progressively in real time
```

---

## 5. Data Sources & APIs

### 5.1 GitHub REST API

- **Base URL:** `https://api.github.com`
- **Auth:** None required for public repos (60 req/hour unauthenticated per IP)
- **All calls run in parallel via `Promise.all()`**

#### Endpoint 1 — Repo Metadata

```
GET /repos/{owner}/{repo}

Fields used from response:
  owner.login          → username
  owner.avatar_url     → avatar image for RepoIdentityCard
  name                 → repo name
  full_name            → "owner/repo"
  description          → repo description
  html_url             → link to GitHub
  homepage             → project website URL
  stargazers_count     → ⭐ star count
  forks_count          → 🍴 fork count
  watchers_count       → 👁 watcher count
  subscribers_count    → subscriber count
  open_issues_count    → 🐛 open issue count
  size                 → repo size in KB
  created_at           → project age calculation
  pushed_at            → "last active X days ago"
  default_branch       → flag if "master" (nudge to rename)
  language             → primary language badge
  topics[]             → topic chips
  license.name         → license badge (MIT, GPL, etc.)
  license.spdx_id      → license identifier
  archived             → ⚠️ show "Archived" warning flag
  disabled             → ⚠️ show "Disabled" warning flag
  fork                 → show "Fork" badge + parent link
  is_template          → show "Template" badge
  has_issues           → issues enabled signal
  has_discussions      → discussions enabled signal
  visibility           → public/private badge
  network_count        → total fork network size
```

#### Endpoint 2 — Languages

```
GET /repos/{owner}/{repo}/languages

Response: { "JavaScript": 45231, "CSS": 12400, "HTML": 3200 }

Processing:
  - Sum all byte values → total bytes
  - Each language % = (bytes / total) * 100
  - Round to 1 decimal
  - Used for language donut chart
```

#### Endpoint 3 — Package.json

```
GET /repos/{owner}/{repo}/contents/package.json

Response: { content: "<base64>", encoding: "base64" }

Processing:
  - atob(content) → JSON.parse → package object
  - Extract: name, version, description, scripts, engines,
    keywords, dependencies, devDependencies
```

#### Endpoint 4 — Root Contents (Code Quality Signals)

```
GET /repos/{owner}/{repo}/contents/

Response: array of { name, type } objects

Check for presence of:
  tsconfig.json              → has TypeScript
  .eslintrc / eslint.config  → has ESLint
  .prettierrc / prettier.config → has Prettier
  jest.config.* / vitest.config.* → has tests
  .github/ (type: dir)       → has CI/CD
  README.md                  → has README
  .env.example               → has env example
  package-lock.json / yarn.lock / pnpm-lock.yaml → has lock file
  .gitignore                 → has gitignore
  Dockerfile                 → has Docker setup
```

#### Endpoint 5 — Top Contributors

```
GET /repos/{owner}/{repo}/contributors?per_page=5

Response: [{ login, avatar_url, contributions, html_url }]

Used for: TopContributors widget — 5 avatar chips with contribution counts
```

#### Endpoint 6 — Latest Release

```
GET /repos/{owner}/{repo}/releases?per_page=1

Response: [{ tag_name, name, published_at, html_url }]

Used for: LatestRelease widget — version badge + published date
If empty: show "No releases published" in yellow
```

**Total GitHub API calls per analysis: 6 (all parallelized)**
**Rate limit impact: 6 of 60 available requests**

---

### 5.2 npm Registry API

- **Base URL:** `https://registry.npmjs.org`
- **Auth:** None required
- **All package checks run in parallel via `Promise.all()`**

```
GET https://registry.npmjs.org/{packageName}

Response fields used:
  dist-tags.latest          → latest available version
  time.modified             → last publish date
  time[version]             → publish date per version
  deprecated                → deprecation notice string (if deprecated)
  versions                  → all published versions list
```

**Logic:**

| Check | Condition | Widget |
|---|---|---|
| Outdated | installed semver < latest | Yellow row in OutdatedPackages table |
| Deprecated | `deprecated` field present | Orange badge in dependency list |
| Abandoned | `time.modified` > 2 years ago | Gray "abandoned" badge |

**Upgrade command shown in UI:**
```
npm install {packageName}@{latestVersion}
```

---

### 5.3 OSV Vulnerability Database

- **Base URL:** `https://api.osv.dev/v1`
- **Auth:** None required
- **Single batch POST — all packages in one request**

```
POST https://api.osv.dev/v1/querybatch

Request:
{
  "queries": [
    { "package": { "name": "lodash", "ecosystem": "npm" }, "version": "4.17.15" },
    { "package": { "name": "axios",  "ecosystem": "npm" }, "version": "0.21.0" }
  ]
}

Response:
{
  "results": [
    {
      "vulns": [{
        "id": "GHSA-p6mc-m468-83gw",
        "summary": "Prototype pollution in lodash",
        "severity": [{ "type": "CVSS_V3", "score": "7.5" }],
        "references": [{ "url": "https://github.com/advisories/..." }]
      }]
    },
    { "vulns": [] }   ← axios is clean
  ]
}
```

**CVSS Score → Severity mapping:**

| CVSS Score | Severity | Color |
|---|---|---|
| 9.0 – 10.0 | Critical | Red `#ef4444` |
| 7.0 – 8.9 | High | Orange `#f97316` |
| 4.0 – 6.9 | Medium | Yellow `#eab308` |
| 0.1 – 3.9 | Low | Blue `#3b82f6` |

---

## 6. Analysis Pipeline

Complete step-by-step flow inside the Hono Worker for a single analysis request.

### Step 1 — Parse & Validate GitHub URL

```typescript
function parseGitHubUrl(url: string): { owner: string; repo: string } {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) throw new Error("Invalid GitHub URL");
  return { owner: match[1], repo: match[2].replace(".git", "").split("/")[0] };
}
```

### Step 2 — Fetch All GitHub Data in Parallel

```typescript
const [repoMeta, languages, packageJsonRaw, rootContents, contributors, releases] =
  await Promise.all([
    fetchRepoMeta(owner, repo),          // GET /repos/{owner}/{repo}
    fetchLanguages(owner, repo),         // GET /repos/{owner}/{repo}/languages
    fetchPackageJson(owner, repo),       // GET /repos/{owner}/{repo}/contents/package.json
    fetchRootContents(owner, repo),      // GET /repos/{owner}/{repo}/contents/
    fetchContributors(owner, repo),      // GET /repos/{owner}/{repo}/contributors?per_page=5
    fetchLatestRelease(owner, repo),     // GET /repos/{owner}/{repo}/releases?per_page=1
  ]);

// Emit Phase 1 SSE events immediately after this resolves
```

### Step 3 — Parse package.json

```typescript
const pkgContent = atob(packageJsonRaw.content.replace(/\n/g, ""));
const pkg = JSON.parse(pkgContent);

const prodDeps = pkg.dependencies ?? {};
const devDeps = pkg.devDependencies ?? {};
const allDeps = { ...prodDeps, ...devDeps };
// e.g. { "lodash": "^4.17.15", "react": "^18.0.0", "jest": "^29.0.0" }
```

### Step 4 — Extract Code Quality Signals

```typescript
const fileNames = rootContents.map((f: any) => f.name.toLowerCase());
const dirNames  = rootContents.filter((f: any) => f.type === "dir").map((f: any) => f.name);

const signals = {
  hasTypeScript:  fileNames.includes("tsconfig.json"),
  hasEslint:      fileNames.some(n => n.includes("eslint")),
  hasPrettier:    fileNames.some(n => n.includes("prettier")),
  hasTests:       fileNames.some(n => n.includes("jest.config") || n.includes("vitest.config")),
  hasCI:          dirNames.includes(".github"),
  hasReadme:      fileNames.includes("readme.md"),
  hasEnvExample:  fileNames.includes(".env.example"),
  hasLockFile:    fileNames.some(n => ["package-lock.json","yarn.lock","pnpm-lock.yaml"].includes(n)),
  hasGitignore:   fileNames.includes(".gitignore"),
  hasDocker:      fileNames.includes("dockerfile"),
};
```

### Step 5 — Calculate Language Percentages

```typescript
function calcLanguagePercentages(languages: Record<string, number>) {
  const total = Object.values(languages).reduce((a, b) => a + b, 0);
  return Object.entries(languages).map(([name, bytes]) => ({
    name,
    bytes,
    percentage: parseFloat(((bytes / total) * 100).toFixed(1)),
    color: LANGUAGE_COLORS[name] ?? "#8b8b8b",
  }));
}
```

### Step 6 — Check npm Registry in Parallel

```typescript
const npmResults = await Promise.all(
  Object.entries(allDeps).map(async ([name, versionRange]) => {
    const data = await fetch(`https://registry.npmjs.org/${name}`).then(r => r.json());
    const installedVersion = versionRange.replace(/[\^~>=<]/g, "");
    const latestVersion    = data["dist-tags"]?.latest ?? "unknown";
    const lastModified     = new Date(data.time?.modified ?? 0);
    const twoYearsAgo      = new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000);

    return {
      name,
      installedVersion,
      latestVersion,
      isOutdated:   installedVersion !== latestVersion,
      isDeprecated: !!data.versions?.[installedVersion]?.deprecated,
      isAbandoned:  lastModified < twoYearsAgo,
      deprecationMessage: data.versions?.[installedVersion]?.deprecated ?? null,
      isProd: name in prodDeps,
    };
  })
);
```

### Step 7 — OSV Vulnerability Batch Check

```typescript
const osvResponse = await fetch("https://api.osv.dev/v1/querybatch", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    queries: Object.entries(allDeps).map(([name, versionRange]) => ({
      package: { name, ecosystem: "npm" },
      version: versionRange.replace(/[\^~>=<]/g, ""),
    })),
  }),
}).then(r => r.json());

// Map results back to package names
const vulnResults = osvResponse.results.map((result: any, i: number) => ({
  packageName: Object.keys(allDeps)[i],
  vulns: (result.vulns ?? []).map((v: any) => ({
    id: v.id,
    summary: v.summary,
    cvssScore: parseFloat(v.severity?.[0]?.score ?? "0"),
    severity: mapCvssToSeverity(parseFloat(v.severity?.[0]?.score ?? "0")),
    url: v.references?.[0]?.url ?? `https://osv.dev/vulnerability/${v.id}`,
  })),
})).filter(r => r.vulns.length > 0);
```

### Step 8 — Calculate Score

```typescript
function calculateScore(data: AnalysisInput): { score: number; grade: string } {
  let score = 100;

  // Vulnerability penalties
  const critCount = data.vulns.filter(v => v.severity === "Critical").length;
  const highCount  = data.vulns.filter(v => v.severity === "High").length;
  const medCount   = data.vulns.filter(v => v.severity === "Medium").length;
  score -= critCount * 15;
  score -= highCount * 8;
  score -= medCount  * 3;

  // Dependency penalties
  const outdatedCount   = data.npmResults.filter(r => r.isOutdated).length;
  const deprecatedCount = data.npmResults.filter(r => r.isDeprecated).length;
  const abandonedCount  = data.npmResults.filter(r => r.isAbandoned).length;
  score -= Math.min(outdatedCount * 2, 20);   // cap at -20
  score -= deprecatedCount * 5;
  score -= abandonedCount  * 3;

  // Code quality signals
  if (!data.signals.hasTests)      score -= 10;
  if (!data.signals.hasTypeScript) score -= 5;
  if (!data.signals.hasCI)         score -= 5;
  if (!data.signals.hasLockFile)   score -= 5;
  if (!data.signals.hasEslint)     score -= 3;
  if (!data.signals.hasReadme)     score -= 2;
  if (!data.signals.hasGitignore)  score -= 2;

  // Repo health flags
  if (data.repoMeta.archived)                    score -= 20;
  if (data.repoMeta.default_branch === "master") score -= 3;

  score = Math.max(0, Math.min(100, Math.round(score)));

  const grade =
    score >= 90 ? "A" :
    score >= 75 ? "B" :
    score >= 60 ? "C" :
    score >= 40 ? "D" : "F";

  return { score, grade };
}
```

### Step 9 — Build AI Payload

```typescript
const aiPayload = {
  repo: {
    name:        repoMeta.full_name,
    description: repoMeta.description,
    language:    repoMeta.language,
    topics:      repoMeta.topics,
    stars:       repoMeta.stargazers_count,
    openIssues:  repoMeta.open_issues_count,
    lastCommit:  repoMeta.pushed_at,
    license:     repoMeta.license?.name,
    ageInDays:   Math.floor((Date.now() - new Date(repoMeta.created_at).getTime()) / 86400000),
  },
  score,
  grade,
  languages: languagePercentages.slice(0, 5),
  packageJson: {
    name:     pkg.name,
    version:  pkg.version,
    scripts:  Object.keys(pkg.scripts ?? {}),
    engines:  pkg.engines,
    keywords: pkg.keywords,
  },
  topLevelFolders: rootContents.filter((f: any) => f.type === "dir").map((f: any) => f.name),
  dependencies: {
    totalCount:    Object.keys(allDeps).length,
    prodCount:     Object.keys(prodDeps).length,
    devCount:      Object.keys(devDeps).length,
    outdated:      npmResults.filter(r => r.isOutdated).slice(0, 20),
    deprecated:    npmResults.filter(r => r.isDeprecated).slice(0, 10),
    abandoned:     npmResults.filter(r => r.isAbandoned).slice(0, 10),
    allProdNames:  Object.keys(prodDeps).slice(0, 50),  // cap for token limit
  },
  vulnerabilities: vulnResults.slice(0, 30),  // cap for token limit
  codeQualitySignals: signals,
};
```

---

## 7. Progressive SSE Streaming Strategy

This is the core UX mechanic. The report renders in 3 phases — each phase unlocks as data becomes available, replacing skeleton placeholders with real widgets.

### SSE Event Types

```typescript
type SSEEvent =
  | { type: "repo_meta";       data: RepoMeta }
  | { type: "languages";       data: LanguageEntry[] }
  | { type: "contributors";    data: Contributor[] }
  | { type: "release";         data: Release | null }
  | { type: "dep_health";      data: DepHealthSummary }
  | { type: "vulnerabilities"; data: VulnResult[] }
  | { type: "score";           data: { score: number; grade: string } }
  | { type: "signals";         data: CodeQualitySignals }
  | { type: "ai_chunk";        chunk: string }
  | { type: "done" }
  | { type: "error";           message: string };
```

### Phase Rendering Map

```
PHASE 1 — fires after GitHub API resolves (~1–2s)
  SSE: repo_meta, languages, contributors, release
  Renders:
    ✅ RepoIdentityCard   (avatar, name, description, topics, license, homepage)
    ✅ ActivityStatsRow   (stars, forks, watchers, issues, size, age)
    ✅ HealthFlagsRow     (archived, fork, master-branch warnings)
    ✅ LanguageChart      (donut chart with percentages)
    ✅ TopContributors    (5 avatar chips with contribution counts)
    ✅ LatestRelease      (version badge + date, or "no releases" message)
  Still skeleton:
    ⏳ ScoreSection
    ⏳ DependencyHealth
    ⏳ VulnerabilityTable
    ⏳ CodeQualitySignals
    ⏳ All AI sections

PHASE 2 — fires after npm + OSV resolve (~3–6s)
  SSE: dep_health, vulnerabilities, score, signals
  Renders:
    ✅ ScoreSection       (animated ring counts up to final score)
    ✅ DependencyHealth   (4 stat cards: total, outdated, vulnerable, deprecated)
    ✅ OutdatedPackages   (table with upgrade commands)
    ✅ VulnerabilityTable (sorted by severity, expandable rows)
    ✅ CodeQualitySignals (checklist with pass/fail per signal)
  Still skeleton:
    ⏳ ArchitectureSection
    ⏳ LibraryChoices
    ⏳ SecurityFlags
    ⏳ QuickWins
    ⏳ AISummary

PHASE 3 — fires as AI streams (~8–20s total)
  SSE: ai_chunk (many), done
  Renders (progressively as JSON builds up):
    ✅ ArchitectureSection
    ✅ LibraryChoices
    ✅ SecurityFlags
    ✅ QuickWins
    ✅ AISummary
```

### Skeleton Design

Each skeleton section is a pulse-animated gray block that matches the approximate shape of the real widget it will replace. When data arrives for that section, the skeleton fades out and the real widget fades in with a subtle entrance animation.

```typescript
// Skeleton visibility logic in Report.tsx
const phase1Ready = !!repoMeta;
const phase2Ready = !!depHealth && !!vulns;
const phase3Ready = !!aiNarrative?.mentorSummary;
```

---

## 8. OpenRouter AI Integration

### System Prompt

```
You are RepoVitals AI — a senior software architect and security expert reviewing a JavaScript/Node.js GitHub repository.

You will receive structured analysis data. Write a detailed, honest, mentor-like report.
Reference actual package names, folder names, and findings from the data.
Do not be generic. Be specific.

Your output must be a single valid JSON object with these exact keys:

{
  "architectureObservations": "2-4 sentences analyzing folder structure, project organization, separation of concerns, and whether patterns are used correctly.",
  "libraryChoices": "2-4 sentences evaluating whether the chosen npm packages are appropriate, modern, and well-maintained. Call out any surprising or problematic choices.",
  "securityFlags": "2-3 sentences summarizing the most critical security concerns based on the vulnerabilities and signals found.",
  "quickWins": [
    "Specific action 1 — reference actual package name or file",
    "Specific action 2",
    "Specific action 3",
    "Specific action 4",
    "Specific action 5"
  ],
  "mentorSummary": "3-4 sentences overall verdict. Be honest and constructive. Mention what was done well AND what needs improvement."
}

Return ONLY the JSON object. No markdown fences, no preamble, no explanation.
```

### API Call

```typescript
// src/worker/ai/openrouter.ts

export async function streamFromOpenRouter(
  payload: AIPayload,
  env: Env
): Promise<ReadableStream> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization":  `Bearer ${env.OPENROUTER_API_KEY}`,
      "Content-Type":   "application/json",
      "HTTP-Referer":   "https://repovitals.dev",
      "X-Title":        "RepoVitals",
    },
    body: JSON.stringify({
      model:      "google/gemini-flash-2.0",
      stream:     true,
      max_tokens: 2000,
      messages: [{
        role:    "user",
        content: `Analyze this repository and return your JSON report:\n\n${JSON.stringify(payload, null, 2)}`,
      }],
    }),
  });

  if (!response.ok) throw new Error(`OpenRouter error: ${response.status}`);
  return response.body!;
}
```

### Model Fallback Order

1. `google/gemini-flash-2.0` — primary (fast, large context, free)
2. `deepseek/deepseek-r1` — fallback (strong reasoning)
3. `meta-llama/llama-3.3-70b-instruct` — secondary fallback

### Token Extraction from OpenRouter SSE

```typescript
function extractTokenFromOpenRouterChunk(chunk: string): string {
  // OpenRouter streams in OpenAI-compatible SSE format
  // Each chunk: "data: {...}\n\n"
  const lines = chunk.split("\n").filter(l => l.startsWith("data: ") && !l.includes("[DONE]"));
  return lines
    .map(line => {
      try {
        const json = JSON.parse(line.slice(6));
        return json.choices?.[0]?.delta?.content ?? "";
      } catch {
        return "";
      }
    })
    .join("");
}
```

---

## 9. API Endpoints (Hono Backend)

### POST /api/analyze

**Request:**
```json
{ "url": "https://github.com/expressjs/express" }
```

**Response:** `Content-Type: text/event-stream`

**Full SSE event sequence:**

```
data: {"type":"repo_meta","data":{"name":"express","full_name":"expressjs/express","description":"...","owner":{"login":"expressjs","avatar_url":"..."},"stargazers_count":64000,"forks_count":13000,"watchers_count":64000,"open_issues_count":170,"size":3200,"created_at":"2009-06-26T...","pushed_at":"2024-01-10T...","default_branch":"master","language":"JavaScript","topics":["nodejs","web","framework"],"license":{"name":"MIT License"},"archived":false,"fork":false,"homepage":"https://expressjs.com"}}

data: {"type":"languages","data":[{"name":"JavaScript","bytes":282318,"percentage":96.5,"color":"#f1e05a"},{"name":"HTML","bytes":7823,"percentage":2.7,"color":"#e34c26"}]}

data: {"type":"contributors","data":[{"login":"dougwilson","avatar_url":"...","contributions":898,"html_url":"..."}]}

data: {"type":"release","data":{"tag_name":"4.18.3","name":"4.18.3","published_at":"2024-02-29T...","html_url":"..."}}

data: {"type":"dep_health","data":{"total":35,"outdated":8,"deprecated":2,"abandoned":1,"outdatedList":[{"name":"qs","installed":"6.11.0","latest":"6.13.0","isProd":true}],"deprecatedList":[{"name":"...","message":"..."}],"abandonedList":[]}}

data: {"type":"vulnerabilities","data":[{"packageName":"qs","vulns":[{"id":"GHSA-hrpp-h998-j3pp","summary":"Prototype Pollution in qs","cvssScore":6.5,"severity":"Medium","url":"https://osv.dev/vulnerability/GHSA-hrpp-h998-j3pp"}]}]}

data: {"type":"score","data":{"score":74,"grade":"B"}}

data: {"type":"signals","data":{"hasTypeScript":false,"hasEslint":true,"hasPrettier":false,"hasTests":true,"hasCI":true,"hasReadme":true,"hasEnvExample":false,"hasLockFile":true,"hasGitignore":true,"hasDocker":false}}

data: {"type":"ai_chunk","chunk":"{\n  \"architectureObservations\":"}
data: {"type":"ai_chunk","chunk":" \"Express follows a classic"}
... (many more chunks)
data: {"type":"done"}
```

**Error response:**
```
data: {"type":"error","message":"Could not fetch package.json — is this a Node.js project?"}
```

### GET /api/health

```json
{ "status": "ok", "version": "1.0.0" }
```

---

## 10. Report Sections & UI Design

### Visual Design System

```css
/* Color palette */
--bg-base:     #0a0a0f;   /* page background */
--bg-card:     #111118;   /* card background */
--bg-card-hover: #16161f;
--border:      rgba(255, 255, 255, 0.08);
--text-primary: #f8f8f8;
--text-muted:  #6b7280;
--accent-blue: #3b82f6;
--accent-purple: #8b5cf6;

/* Score colors */
--score-green:  #22c55e;  /* 80–100 */
--score-yellow: #eab308;  /* 60–79 */
--score-orange: #f97316;  /* 40–59 */
--score-red:    #ef4444;  /* 0–39 */

/* Severity colors */
--sev-critical: #ef4444;
--sev-high:     #f97316;
--sev-medium:   #eab308;
--sev-low:      #3b82f6;
```

**Typography:** Inter (Google Fonts)
**Cards:** `border: 1px solid var(--border)`, `border-radius: 12px`, `backdrop-filter: blur(4px)`
**Animations:** CSS transitions for skeleton→content fade. Score ring counts up with `requestAnimationFrame`.

---

### PHASE 1 WIDGETS (render immediately from GitHub data)

#### Widget 1 — Repo Identity Card

```
┌─────────────────────────────────────────────────────┐
│  [avatar]  expressjs/express          ⭐ 64k        │
│            Fast, unopinionated web framework         │
│            🔗 expressjs.com                         │
│                                                     │
│  [nodejs] [web] [framework] [http]   📄 MIT         │
└─────────────────────────────────────────────────────┘
```

- Owner avatar (32px circle) + repo full name as heading
- Description text
- Homepage link if present
- Topics as colored chips (truncate after 6)
- License badge
- If `archived: true` → red banner across top: "⚠️ This repository is archived"
- If `fork: true` → gray badge: "Fork"

#### Widget 2 — Activity Stats Row

6 stat pills in a horizontal row:

| Stat | Icon | Source |
|---|---|---|
| Stars | ⭐ | `stargazers_count` |
| Forks | 🍴 | `forks_count` |
| Watchers | 👁 | `watchers_count` |
| Open Issues | 🐛 | `open_issues_count` |
| Repo Size | 💾 | `size` KB → format as "3.2 MB" |
| Project Age | 📅 | `created_at` → "4 years old" |

#### Widget 3 — Health Flags Row

Colored pill badges for repo-level signals:

| Flag | Condition | Color |
|---|---|---|
| Archived | `archived === true` | Red |
| Disabled | `disabled === true` | Red |
| Fork | `fork === true` | Gray |
| Template | `is_template === true` | Blue |
| Old Branch Name | `default_branch === "master"` | Yellow — "Consider renaming to main" |
| No Homepage | `homepage === null` | Gray — informational |

Only show flags that are triggered. If all clear → show single green "✅ No issues" pill.

#### Widget 4 — Language Donut Chart

```
         JS 96.5%
        ╭───────╮
       │   JS   │   ● JavaScript  96.5%
       │   ██   │   ● HTML         2.7%
        ╰───────╯   ● CSS          0.8%
```

- Recharts `PieChart` with `innerRadius={60} outerRadius={90}`
- Each language uses its official GitHub color (see `languageColors.ts`)
- Legend list below chart with color dot + name + percentage
- Tooltip on hover: `{ name: "JavaScript", bytes: "282,318 bytes", percentage: "96.5%" }`
- If only 1 language: still show as donut (100%)

**Language color map (partial — full map in `src/frontend/lib/languageColors.ts`):**
```typescript
export const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript:  "#f1e05a",
  TypeScript:  "#3178c6",
  CSS:         "#563d7c",
  HTML:        "#e34c26",
  Python:      "#3572A5",
  Rust:        "#dea584",
  Go:          "#00ADD8",
  Java:        "#b07219",
  "C++":       "#f34b7d",
  Ruby:        "#701516",
  PHP:         "#4F5D95",
  Shell:       "#89e051",
  // ... extend as needed
};
```

#### Widget 5 — Top Contributors

5 avatar chips in a row:

```
[😀 dougwilson  898] [😀 tj  678] [😀 jonathanong  234] ...
```

Each chip: avatar (24px circle) + username + contribution count. Clicking opens GitHub profile.

#### Widget 6 — Latest Release

```
┌────────────────────────┐
│  🏷️ Latest Release     │
│  v4.18.3               │
│  Released Feb 29, 2024 │
└────────────────────────┘
```

If no releases: yellow card saying "No releases published yet."

---

### PHASE 2 WIDGETS (render after npm + OSV checks)

#### Widget 7 — Score Ring

```
         ╭────────╮
        │   74   │   Grade: B
        │  /100  │
         ╰────────╯
    "Good project with some areas to improve"
```

- SVG circle with `stroke-dashoffset` animation — counts from 0 to final score over 1.5s
- Color of ring changes based on score range
- Grade badge beside ring with matching background color
- Tagline below generated based on score bucket

#### Widget 8 — Dependency Health (4 Stat Cards)

```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│    35    │ │    8     │ │    3     │ │    2     │
│  Total   │ │ Outdated │ │Vulnerable│ │Deprecated│
│   📦    │ │   ⬆️    │ │   🔴    │ │   ⚠️    │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
```

Colors: Total (blue), Outdated (yellow), Vulnerable (red), Deprecated (orange).

#### Widget 9 — Outdated Packages Table

| Package | Installed | Latest | Type | Upgrade Command |
|---|---|---|---|---|
| qs | 6.11.0 | 6.13.0 | prod | `npm i qs@6.13.0` |
| mocha | 9.0.0 | 10.4.0 | dev | `npm i -D mocha@10.4.0` |

- Copy button on each upgrade command
- "Deprecated" badge if also deprecated
- "Abandoned" badge if last updated > 2 years ago

#### Widget 10 — Vulnerability Table

Columns: Package | CVE ID | Summary | Severity | Details

- Sorted by severity (Critical first)
- Each row expandable to show full description + link to advisory
- `SeverityBadge` component: colored pill with severity label
- Empty state: green card "✅ No vulnerabilities found in your dependencies"

#### Widget 11 — Code Quality Signals

2-column checklist grid:

```
✅ TypeScript          ✅ README
✅ ESLint              ❌ Prettier
✅ Tests (Jest/Vitest) ❌ .env.example
✅ CI/CD (.github)     ✅ Lock file
✅ .gitignore          ❌ Docker
```

Green checkmark for pass, red X for fail. Each item has a 1-line tooltip explaining why it matters.

---

### PHASE 3 WIDGETS (render as AI streams)

All AI sections have a subtle `✨ AI` badge in the top-right corner.

#### Widget 12 — Architecture Observations

Purple left-border card. AI prose. 2–4 sentences.

#### Widget 13 — Library Choices

Blue left-border card. AI prose referencing actual package names.

#### Widget 14 — Security Flags

Red-tinted card background. AI prose summarizing critical security concerns.

#### Widget 15 — Quick Wins

5 numbered cards with gradient left border (blue → purple). Each card is 1–2 sentences, specific, actionable, references real files or packages.

#### Widget 16 — Mentor Summary

Large prominent card at bottom. Gradient border. The "final verdict" — 3–4 sentences that a senior dev mentor would say. Honest, constructive, specific.

---

## 11. Frontend Implementation

### TypeScript Types

```typescript
// src/frontend/types/index.ts

export type AnalysisPhase = "idle" | "loading" | "phase1" | "phase2" | "phase3" | "done" | "error";

export interface RepoMeta {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  owner: { login: string; avatar_url: string; html_url: string };
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  size: number;
  created_at: string;
  pushed_at: string;
  default_branch: string;
  language: string | null;
  topics: string[];
  license: { name: string; spdx_id: string } | null;
  archived: boolean;
  disabled: boolean;
  fork: boolean;
  is_template: boolean;
  visibility: string;
}

export interface LanguageEntry {
  name: string;
  bytes: number;
  percentage: number;
  color: string;
}

export interface Contributor {
  login: string;
  avatar_url: string;
  contributions: number;
  html_url: string;
}

export interface Release {
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
}

export interface NpmResult {
  name: string;
  installedVersion: string;
  latestVersion: string;
  isOutdated: boolean;
  isDeprecated: boolean;
  isAbandoned: boolean;
  deprecationMessage: string | null;
  isProd: boolean;
}

export interface VulnEntry {
  id: string;
  summary: string;
  cvssScore: number;
  severity: "Critical" | "High" | "Medium" | "Low";
  url: string;
}

export interface VulnResult {
  packageName: string;
  vulns: VulnEntry[];
}

export interface CodeQualitySignals {
  hasTypeScript: boolean;
  hasEslint: boolean;
  hasPrettier: boolean;
  hasTests: boolean;
  hasCI: boolean;
  hasReadme: boolean;
  hasEnvExample: boolean;
  hasLockFile: boolean;
  hasGitignore: boolean;
  hasDocker: boolean;
}

export interface DepHealthSummary {
  total: number;
  outdated: number;
  deprecated: number;
  abandoned: number;
  outdatedList: NpmResult[];
  deprecatedList: NpmResult[];
  abandonedList: NpmResult[];
}

export interface AIReport {
  architectureObservations: string;
  libraryChoices: string;
  securityFlags: string;
  quickWins: string[];
  mentorSummary: string;
}

export interface AnalysisState {
  phase: AnalysisPhase;
  repoMeta: RepoMeta | null;
  languages: LanguageEntry[];
  contributors: Contributor[];
  release: Release | null;
  depHealth: DepHealthSummary | null;
  vulnerabilities: VulnResult[];
  score: { score: number; grade: string } | null;
  signals: CodeQualitySignals | null;
  aiNarrative: Partial<AIReport>;
  error: string | null;
}
```

### SSE Streaming Hook

```typescript
// src/frontend/hooks/useAnalysis.ts

import { useState, useCallback } from "react";
import type { AnalysisState } from "../types";

const INITIAL_STATE: AnalysisState = {
  phase: "idle",
  repoMeta: null,
  languages: [],
  contributors: [],
  release: null,
  depHealth: null,
  vulnerabilities: [],
  score: null,
  signals: null,
  aiNarrative: {},
  error: null,
};

export function useAnalysis() {
  const [state, setState] = useState<AnalysisState>(INITIAL_STATE);

  const analyze = useCallback(async (url: string) => {
    setState({ ...INITIAL_STATE, phase: "loading" });

    let aiBuffer = "";

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) throw new Error("Analysis request failed");

      setState(s => ({ ...s, phase: "phase1" }));

      const reader  = response.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const raw   = decoder.decode(value, { stream: true });
        const lines = raw.split("\n").filter(l => l.startsWith("data: "));

        for (const line of lines) {
          const event = JSON.parse(line.slice(6));

          switch (event.type) {
            case "repo_meta":
              setState(s => ({ ...s, repoMeta: event.data }));
              break;
            case "languages":
              setState(s => ({ ...s, languages: event.data }));
              break;
            case "contributors":
              setState(s => ({ ...s, contributors: event.data }));
              break;
            case "release":
              setState(s => ({ ...s, release: event.data }));
              break;
            case "dep_health":
              setState(s => ({ ...s, depHealth: event.data, phase: "phase2" }));
              break;
            case "vulnerabilities":
              setState(s => ({ ...s, vulnerabilities: event.data }));
              break;
            case "score":
              setState(s => ({ ...s, score: event.data }));
              break;
            case "signals":
              setState(s => ({ ...s, signals: event.data }));
              break;
            case "ai_chunk":
              aiBuffer += event.chunk;
              try {
                const parsed = JSON.parse(aiBuffer);
                setState(s => ({ ...s, aiNarrative: parsed, phase: "phase3" }));
              } catch {
                // JSON not complete yet — keep buffering
              }
              break;
            case "done":
              setState(s => ({ ...s, phase: "done" }));
              break;
            case "error":
              setState(s => ({ ...s, phase: "error", error: event.message }));
              break;
          }
        }
      }
    } catch (err: any) {
      setState(s => ({ ...s, phase: "error", error: err.message }));
    }
  }, []);

  const reset = useCallback(() => setState(INITIAL_STATE), []);

  return { ...state, analyze, reset };
}
```

### URL Validation

```typescript
export function isValidGitHubUrl(url: string): boolean {
  return /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+(\/)?$/.test(url.trim());
}
```

### Utility Formatters

```typescript
// src/frontend/lib/utils.ts

export function formatBytes(kb: number): string {
  if (kb < 1024) return `${kb} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export function formatAge(createdAt: string): string {
  const days = Math.floor((Date.now() - new Date(createdAt).getTime()) / 86400000);
  if (days < 30)  return `${days} days old`;
  if (days < 365) return `${Math.floor(days / 30)} months old`;
  return `${Math.floor(days / 365)} years old`;
}

export function formatRelativeDate(dateStr: string): string {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30)  return `${days} days ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

export function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
```

---

## 12. Cloudflare Deployment

### wrangler.toml

```toml
name = "repo-vitals"
main = "src/worker/index.ts"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]

[assets]
directory = "./dist"
binding   = "ASSETS"

[vars]
ENVIRONMENT = "production"
```

### Vite Config

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: "src/frontend",
  build: {
    outDir:    "../../dist",
    emptyOutDir: true,
  },
});
```

### Hono Entry Point

```typescript
// src/worker/index.ts
import { Hono } from "hono";
import { cors } from "hono/cors";
import { analyzeRoute } from "./routes/analyze";

type Env = { ASSETS: Fetcher; OPENROUTER_API_KEY: string };

const app = new Hono<{ Bindings: Env }>();

app.use("*", cors());
app.route("/api", analyzeRoute);

// Serve React SPA static assets
app.get("*", (c) => c.env.ASSETS.fetch(c.req.raw));

export default app;
```

### Build & Deploy

```bash
# Install
pnpm install

# Local development
pnpm wrangler dev

# Build React SPA
pnpm vite build

# Deploy
pnpm wrangler deploy

# Set API key secret
pnpm wrangler secret put OPENROUTER_API_KEY
```

---

## 13. Environment Variables

| Variable | Where set | Description |
|---|---|---|
| `OPENROUTER_API_KEY` | `wrangler secret put` | Free API key from openrouter.ai |

No other secrets needed. GitHub API, npm Registry, and OSV are all fully public with no authentication.

---

## 14. Constraints & Limitations

| Constraint | Detail |
|---|---|
| Public repos only | No OAuth, no private repo support |
| JS/Node.js only | Requires `package.json` at root — graceful error if absent |
| GitHub rate limit | 60 unauthenticated req/hour per IP — 6 calls per analysis = ~10 analyses/hour max |
| OSV batch limit | 1000 queries per batch — covers any realistic repo size |
| OpenRouter free tier | Rate limited at peak hours — acceptable for v1, add retry logic |
| Token limit safety | AI payload caps dependencies at 50 prod names + 20 outdated — prevents context overflow |
| Monorepos | Only root `package.json` analyzed — no workspace/nested package support in v1 |
| Large binary repos | `size` field in KB; no file content is fetched except `package.json` |
| SSE not WebSockets | One-directional only — correct for this use case, simpler, CF Workers native |

### Error States & Handling

| Error | Detection | User Message |
|---|---|---|
| Invalid URL | regex validation client-side | "Please enter a valid GitHub repository URL" |
| Repo not found | GitHub API 404 | "Repository not found or may be private" |
| No package.json | GitHub contents API 404 | "No package.json found — is this a Node.js project?" |
| GitHub rate limit | GitHub API 403 + rate limit header | "GitHub API rate limit reached. Try again in a few minutes." |
| OpenRouter failure | HTTP error or timeout | Structured data report shown, AI sections marked as "Unavailable" |
| Network failure | fetch() throws | "Connection failed. Please check your internet and try again." |

---

*Document version 2 — updated with progressive SSE rendering strategy, full GitHub API field mapping, all new widgets, and complete TypeScript types.*
