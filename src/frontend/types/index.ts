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
  published?: string;
  modified?: string;
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
  analyze?: any;
}
