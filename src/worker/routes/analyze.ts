import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import {
  fetchRepoMeta,
  fetchLanguages,
  fetchPackageJson,
  fetchRootContents,
  fetchContributors,
  fetchLatestRelease,
} from "../pipeline/github";
import { checkNpmPackage } from "../pipeline/npm";
import { checkOsvVulnerabilities } from "../pipeline/osv";
import { calculateScore } from "../pipeline/scorer";
import { buildAIPayload } from "../pipeline/payload";
import { streamFromOpenRouter, extractTokenFromOpenRouterChunk } from "../ai/openrouter";
import { LANGUAGE_COLORS } from "../../frontend/lib/languageColors";

export const analyzeRoute = new Hono<{ Bindings: { OPENROUTER_API_KEY: string } }>();

function parseGitHubUrl(url: string): { owner: string; repo: string } {
  const cleanUrl = url.trim().replace(/\/$/, "");
  const match = cleanUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) throw new Error("Invalid GitHub URL");
  return { owner: match[1], repo: match[2].replace(".git", "") };
}

analyzeRoute.post("/analyze", async (c) => {
  const { url } = await c.req.json<{ url: string }>();

  if (!url) {
    return c.json({ error: "URL is required" }, 400);
  }

  let owner: string;
  let repo: string;
  try {
    const parsed = parseGitHubUrl(url);
    owner = parsed.owner;
    repo = parsed.repo;
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }

  return streamSSE(c, async (stream) => {
    // 1. Fetch GitHub data in parallel
    let repoMeta, languages, packageJsonRaw, rootContents, contributors, release;

    try {
      [repoMeta, languages, packageJsonRaw, rootContents, contributors, release] =
        await Promise.all([
          fetchRepoMeta(owner, repo),
          fetchLanguages(owner, repo),
          fetchPackageJson(owner, repo),
          fetchRootContents(owner, repo),
          fetchContributors(owner, repo),
          fetchLatestRelease(owner, repo),
        ]);
    } catch (err: any) {
      await stream.writeSSE({
        data: JSON.stringify({ type: "error", message: err.message }),
      });
      return;
    }

    // 2. Parse package.json
    let pkg: any;
    let prodDeps: Record<string, string> = {};
    let devDeps: Record<string, string> = {};
    let allDeps: Record<string, string> = {};

    try {
      const pkgContent = atob(packageJsonRaw.content.replace(/\s/g, ""));
      pkg = JSON.parse(pkgContent);
      prodDeps = pkg.dependencies ?? {};
      devDeps = pkg.devDependencies ?? {};
      allDeps = { ...prodDeps, ...devDeps };
    } catch (err: any) {
      await stream.writeSSE({
        data: JSON.stringify({
          type: "error",
          message: "No package.json found or package.json is invalid — is this a Node.js project?",
        }),
      });
      return;
    }

    // 3. Extract Code Quality Signals
    const fileNames = rootContents.map((f: any) => f.name.toLowerCase());
    const dirNames = rootContents.filter((f: any) => f.type === "dir").map((f: any) => f.name.toLowerCase());

    const signals = {
      hasTypeScript: fileNames.includes("tsconfig.json"),
      hasEslint: fileNames.some(n => n.includes("eslint")),
      hasPrettier: fileNames.some(n => n.includes("prettier")),
      hasTests: fileNames.some(n => n.includes("jest.config") || n.includes("vitest.config") || n.includes("playwright.config")),
      hasCI: dirNames.includes(".github"),
      hasReadme: fileNames.includes("readme.md"),
      hasEnvExample: fileNames.includes(".env.example"),
      hasLockFile: fileNames.some(n => ["package-lock.json", "yarn.lock", "pnpm-lock.yaml"].includes(n)),
      hasGitignore: fileNames.includes(".gitignore"),
      hasDocker: fileNames.includes("dockerfile"),
    };

    // 4. Calculate Language Percentages
    const totalBytes = Object.values(languages).reduce((a: number, b: number) => a + b, 0);
    const languagePercentages = Object.entries(languages).map(([name, bytes]: [string, any]) => ({
      name,
      bytes,
      percentage: parseFloat(((bytes / totalBytes) * 100).toFixed(1)),
      color: LANGUAGE_COLORS[name] ?? "#8b8b8b",
    })).sort((a, b) => b.bytes - a.bytes);

    // Write Phase 1 events
    await stream.writeSSE({
      data: JSON.stringify({ type: "repo_meta", data: repoMeta }),
    });
    await stream.writeSSE({
      data: JSON.stringify({ type: "languages", data: languagePercentages }),
    });
    await stream.writeSSE({
      data: JSON.stringify({ type: "contributors", data: contributors }),
    });
    await stream.writeSSE({
      data: JSON.stringify({ type: "release", data: release }),
    });

    // 5. Check npm Registry and OSV vulnerabilities in parallel
    const depNames = Object.keys(allDeps);
    let npmResults: any[] = [];
    let vulnResults: any[] = [];

    try {
      const npmChecks = Object.entries(allDeps).map(([name, range]) =>
        checkNpmPackage(name, range, name in prodDeps)
      );

      const osvCheck = checkOsvVulnerabilities(
        Object.entries(allDeps).map(([name, range]) => ({ name, versionRange: range }))
      );

      [npmResults, vulnResults] = await Promise.all([
        Promise.all(npmChecks),
        osvCheck,
      ]);
    } catch (err: any) {
      console.error("NPM or OSV check error", err);
    }

    // 6. Calculate score
    const score = calculateScore({
      repoMeta,
      npmResults,
      vulns: vulnResults,
      signals,
    });

    // Build Dep Health Summary
    const outdatedList = npmResults.filter(r => r.isOutdated);
    const deprecatedList = npmResults.filter(r => r.isDeprecated);
    const abandonedList = npmResults.filter(r => r.isAbandoned);

    const depHealth = {
      total: depNames.length,
      outdated: outdatedList.length,
      deprecated: deprecatedList.length,
      abandoned: abandonedList.length,
      outdatedList,
      deprecatedList,
      abandonedList,
    };

    // Write Phase 2 events
    await stream.writeSSE({
      data: JSON.stringify({ type: "dep_health", data: depHealth }),
    });
    await stream.writeSSE({
      data: JSON.stringify({ type: "vulnerabilities", data: vulnResults }),
    });
    await stream.writeSSE({
      data: JSON.stringify({ type: "score", data: score }),
    });
    await stream.writeSSE({
      data: JSON.stringify({ type: "signals", data: signals }),
    });

    // 7. OpenRouter AI Analysis
    const openrouterKey = c.env.OPENROUTER_API_KEY;
    if (!openrouterKey) {
      await stream.writeSSE({
        data: JSON.stringify({ type: "error", message: "OpenRouter API Key not configured. AI narrative skipped." }),
      });
      await stream.writeSSE({
        data: JSON.stringify({ type: "done" }),
      });
      return;
    }

    const aiPayload = buildAIPayload({
      repoMeta,
      score,
      languagePercentages,
      pkg,
      rootContents,
      npmResults,
      vulns: vulnResults,
      signals,
      prodDeps,
      devDeps,
      allDeps,
    });

    try {
      const aiStream = await streamFromOpenRouter(aiPayload, openrouterKey);
      const reader = aiStream.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const token = extractTokenFromOpenRouterChunk(chunk);
        if (token) {
          await stream.writeSSE({
            data: JSON.stringify({ type: "ai_chunk", chunk: token }),
          });
        }
      }
    } catch (err: any) {
      console.error("OpenRouter stream failed:", err);
      await stream.writeSSE({
        data: JSON.stringify({ type: "error", message: `AI analysis failed: ${err.message}` }),
      });
    }

    // Done
    await stream.writeSSE({
      data: JSON.stringify({ type: "done" }),
    });
  });
});
