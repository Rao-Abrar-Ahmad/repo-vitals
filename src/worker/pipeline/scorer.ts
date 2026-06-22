import type { NpmRegistryResult } from "./npm";
import type { PackageVulns } from "./osv";

export interface AnalysisInput {
  repoMeta: {
    archived: boolean;
    default_branch: string;
  };
  npmResults: NpmRegistryResult[];
  vulns: PackageVulns[];
  signals: {
    hasTypeScript: boolean;
    hasEslint: boolean;
    hasPrettier: boolean;
    hasTests: boolean;
    hasCI: boolean;
    hasReadme: boolean;
    hasLockFile: boolean;
    hasGitignore: boolean;
  };
}

export function calculateScore(data: AnalysisInput): { score: number; grade: string } {
  let score = 100;

  // Vulnerability penalties
  const flatVulns = data.vulns.flatMap(v => v.vulns);
  const critCount = flatVulns.filter(v => v.severity === "Critical").length;
  const highCount  = flatVulns.filter(v => v.severity === "High").length;
  const medCount   = flatVulns.filter(v => v.severity === "Medium").length;
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
