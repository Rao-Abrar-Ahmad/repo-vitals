import React from "react";
import type { CodeQualitySignals as Signals } from "../../types";
import { ChecklistItem } from "../ui/ChecklistItem";

interface CodeQualitySignalsProps {
  signals: Signals;
}

export const CodeQualitySignals: React.FC<CodeQualitySignalsProps> = ({ signals }) => {
  const checklist = [
    {
      label: "TypeScript Support",
      passed: signals.hasTypeScript,
      tooltip: "Checks for tsconfig.json. TypeScript enforces static types, helping catch bugs earlier in development.",
    },
    {
      label: "ESLint Configured",
      passed: signals.hasEslint,
      tooltip: "Checks for .eslintrc or eslint.config.js. ESLint helps enforce consistent code standards and catches lint errors.",
    },
    {
      label: "Prettier Formatter",
      passed: signals.hasPrettier,
      tooltip: "Checks for .prettierrc or prettier.config.js. Prettier automatically formats files to ensure clean readable style.",
    },
    {
      label: "Test Suite Config",
      passed: signals.hasTests,
      tooltip: "Checks for jest.config, vitest.config, or playwright.config. Automated tests are critical for regression prevention.",
    },
    {
      label: "CI/CD Workflows",
      passed: signals.hasCI,
      tooltip: "Checks for a .github folder directory. CI/CD runs automatic builds/tests on PRs, improving release safety.",
    },
    {
      label: "Project Documentation",
      passed: signals.hasReadme,
      tooltip: "Checks for README.md. Documentation allows developer onboarding and details usage examples.",
    },
    {
      label: "Environment Config Template",
      passed: signals.hasEnvExample,
      tooltip: "Checks for .env.example. Providing templates helps others set up local dev environment variables without leaks.",
    },
    {
      label: "Package Lock File",
      passed: signals.hasLockFile,
      tooltip: "Checks for package-lock.json, yarn.lock, or pnpm-lock.yaml. Ensures exact deterministic builds across machines.",
    },
    {
      label: "Gitignore Exclusions",
      passed: signals.hasGitignore,
      tooltip: "Checks for .gitignore. Ignores Node modules, secrets, build artifacts, preventing dirty commits.",
    },
    {
      label: "Containerization (Docker)",
      passed: signals.hasDocker,
      tooltip: "Checks for a Dockerfile. Docker enables consistent runtime isolation, simplifying production deployments.",
    },
  ];

  return (
    <div className="glass-panel p-6 hover:bg-card-hover/20 transition-all duration-300">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4">
        Code Quality Signals
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {checklist.map((item, idx) => (
          <ChecklistItem
            key={idx}
            label={item.label}
            passed={item.passed}
            tooltip={item.tooltip}
          />
        ))}
      </div>
    </div>
  );
};
