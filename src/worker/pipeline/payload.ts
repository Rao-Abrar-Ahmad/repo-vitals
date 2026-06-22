import type { NpmRegistryResult } from "./npm";
import type { PackageVulns } from "./osv";

export interface AIPayloadInput {
  repoMeta: any;
  score: { score: number; grade: string };
  languagePercentages: any[];
  pkg: any;
  rootContents: any[];
  npmResults: NpmRegistryResult[];
  vulns: PackageVulns[];
  signals: any;
  prodDeps: Record<string, string>;
  devDeps: Record<string, string>;
  allDeps: Record<string, string>;
}

export function buildAIPayload(data: AIPayloadInput) {
  const {
    repoMeta,
    score,
    languagePercentages,
    pkg,
    rootContents,
    npmResults,
    vulns,
    signals,
    prodDeps,
    devDeps,
    allDeps,
  } = data;

  return {
    repo: {
      name: repoMeta.full_name,
      description: repoMeta.description,
      language: repoMeta.language,
      topics: repoMeta.topics || [],
      stars: repoMeta.stargazers_count,
      openIssues: repoMeta.open_issues_count,
      lastCommit: repoMeta.pushed_at,
      license: repoMeta.license?.name,
      ageInDays: Math.floor((Date.now() - new Date(repoMeta.created_at).getTime()) / 86400000),
    },
    score: score.score,
    grade: score.grade,
    languages: languagePercentages.slice(0, 5),
    packageJson: {
      name: pkg.name,
      version: pkg.version,
      scripts: Object.keys(pkg.scripts ?? {}),
      engines: pkg.engines,
      keywords: pkg.keywords,
    },
    topLevelFolders: rootContents.filter((f: any) => f.type === "dir").map((f: any) => f.name),
    dependencies: {
      totalCount: Object.keys(allDeps).length,
      prodCount: Object.keys(prodDeps).length,
      devCount: Object.keys(devDeps).length,
      outdated: npmResults.filter(r => r.isOutdated).slice(0, 20),
      deprecated: npmResults.filter(r => r.isDeprecated).slice(0, 10),
      abandoned: npmResults.filter(r => r.isAbandoned).slice(0, 10),
      allProdNames: Object.keys(prodDeps).slice(0, 50),
    },
    vulnerabilities: vulns.slice(0, 30),
    codeQualitySignals: signals,
  };
}
export type AIPayload = ReturnType<typeof buildAIPayload>;
