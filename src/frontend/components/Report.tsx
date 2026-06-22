import React from "react";
import type { AnalysisState } from "../types";
import { ArrowLeft, RefreshCw } from "lucide-react";

// Components
import { RepoIdentityCard } from "./sections/RepoIdentityCard";
import { ActivityStatsRow } from "./sections/ActivityStatsRow";
import { HealthFlagsRow } from "./sections/HealthFlagsRow";
import { ScoreSection } from "./sections/ScoreSection";
import { LanguageChart } from "./sections/LanguageChart";
import { TopContributors } from "./sections/TopContributors";
import { LatestRelease } from "./sections/LatestRelease";
import { DependencyHealth } from "./sections/DependencyHealth";
import { OutdatedPackages } from "./sections/OutdatedPackages";
import { VulnerabilityTable } from "./sections/VulnerabilityTable";
import { CodeQualitySignals } from "./sections/CodeQualitySignals";

// AI Components
import { ArchitectureSection } from "./sections/ArchitectureSection";
import { LibraryChoices } from "./sections/LibraryChoices";
import { SecurityFlags } from "./sections/SecurityFlags";
import { QuickWins } from "./sections/QuickWins";
import { AISummary } from "./sections/AISummary";

// Skeletons
import { RepoIdentitySkeleton } from "./skeletons/RepoIdentitySkeleton";
import { ActivityStatsSkeleton } from "./skeletons/ActivityStatsSkeleton";
import { LanguageChartSkeleton } from "./skeletons/LanguageChartSkeleton";
import { DependencySkeleton } from "./skeletons/DependencySkeleton";
import { AISkeleton } from "./skeletons/AISkeleton";

interface ReportProps {
  state: AnalysisState;
  onBack: () => void;
}

export const Report: React.FC<ReportProps> = ({ state, onBack }) => {
  const {
    phase,
    repoMeta,
    languages,
    contributors,
    release,
    depHealth,
    vulnerabilities,
    score,
    signals,
    aiNarrative,
    error,
  } = state;

  const phase1Ready = !!repoMeta;
  const phase2Ready = !!depHealth && !!score;
  const phase3Ready = !!aiNarrative && Object.keys(aiNarrative).length > 0;

  const getPhaseMessage = () => {
    switch (phase) {
      case "loading": return "Initializing checkup...";
      case "phase1": return "Retrieving repository layout...";
      case "phase2": return "Auditing packages & vulnerabilities...";
      case "phase3": return "Consulting AI architect...";
      case "done": return "Checkup complete";
      case "error": return "Analysis interrupted";
      default: return "";
    }
  };

  // Count total vulnerable CVEs
  const vulnerableCount = vulnerabilities.flatMap(v => v.vulns).length;

  return (
    <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 py-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-white transition-colors bg-white/5 px-3.5 py-2 rounded-xl border border-white/5"
        >
          <ArrowLeft size={14} />
          <span>Analyze Another Repo</span>
        </button>

        <div className="flex items-center gap-3">
          {phase !== "done" && phase !== "error" && (
            <div className="flex items-center gap-2">
              <RefreshCw size={14} className="animate-spin text-accent-blue" />
              <span className="text-xs text-text-muted font-medium">{getPhaseMessage()}</span>
            </div>
          )}
          {/* <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted bg-white/5 border border-white/5 px-2.5 py-1 rounded-full">
            Stateless Mode
          </span> */}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl border border-red-500/25 bg-red-500/10 text-red-400 text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* Main Grid */}
      <div className="space-y-6">
        {/* Phase 1 Layout */}
        {!phase1Ready ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <RepoIdentitySkeleton />
              <ActivityStatsSkeleton />
            </div>
            <div className="lg:col-span-1">
              <LanguageChartSkeleton />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
            {/* Left Main */}
            <div className="lg:col-span-2 space-y-6">
              <RepoIdentityCard meta={repoMeta!} />
              <HealthFlagsRow meta={repoMeta!} />
              <ActivityStatsRow meta={repoMeta!} />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <TopContributors contributors={contributors} />
                <LatestRelease release={release} />
              </div>
            </div>

            {/* Right Main */}
            <div className="lg:col-span-1 space-y-6">
              {/* Score section wrapper */}
              {phase2Ready ? (
                <ScoreSection score={score!.score} grade={score!.grade} />
              ) : (
                <div className="glass-panel p-6 flex flex-col items-center justify-center min-h-[160px] animate-pulse-slow">
                  <div className="w-16 h-16 rounded-full border-4 border-white/5 border-t-accent-blue animate-spin" />
                  <span className="text-xs text-text-muted mt-3 font-semibold">Running audits...</span>
                </div>
              )}
              <LanguageChart languages={languages} />
            </div>
          </div>
        )}

        {/* Phase 2 Layout */}
        {phase1Ready && (
          <div className="space-y-6">
            {!phase2Ready ? (
              <DependencySkeleton />
            ) : (
              <div className="space-y-6 animate-slide-up">
                <DependencyHealth summary={depHealth!} vulnerableCount={vulnerableCount} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <OutdatedPackages packages={depHealth!.outdatedList} />
                    <VulnerabilityTable vulnerabilities={vulnerabilities} />
                  </div>
                  <div className="lg:col-span-1">
                    <CodeQualitySignals signals={signals!} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Phase 3 Layout (AI Narrative) */}
        {phase2Ready && (
          <div className="space-y-6">
            {!phase3Ready && phase !== "done" && phase !== "error" ? (
              <AISkeleton />
            ) : phase3Ready ? (
              <div className="space-y-6 animate-slide-up">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ArchitectureSection observations={aiNarrative.architectureObservations} />
                  <LibraryChoices choices={aiNarrative.libraryChoices} />
                </div>

                <SecurityFlags security={aiNarrative.securityFlags} />
                <QuickWins wins={aiNarrative.quickWins} />
                <AISummary summary={aiNarrative.mentorSummary} />
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
