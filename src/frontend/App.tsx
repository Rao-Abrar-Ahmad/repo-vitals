import React from "react";
import { useAnalysis } from "./hooks/useAnalysis";
import { HeroInput } from "./components/HeroInput";
import { Report } from "./components/Report";
import { Github, Activity } from "lucide-react";

export default function App() {
  const { phase, analyze, reset, ...state } = useAnalysis();

  const handleAnalyze = (url: string) => {
    analyze(url);
  };

  const showReport = phase !== "idle" && phase !== "loading" || (phase === "loading" && state.repoMeta !== null);

  return (
    <div className="flex flex-col bg-base text-text-primary">
      {/* Header */}
      <header className="border-b border-white/5 bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={reset}>
            <span className="p-1.5 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple text-white glow-blue">
              <Activity size={18} className="stroke-[2.5]" />
            </span>
            <span className="font-black text-xl tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              RepoVitals
            </span>
          </div>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-white transition-colors"
          >
            <Github size={20} />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col justify-center">
        {showReport ? (
          <Report state={{ phase, analyze, ...state }} onBack={reset} />
        ) : (
          <div className="block">
            <HeroInput onAnalyze={handleAnalyze} isLoading={phase === "loading"} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 bg-card/20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted font-medium">
          <span>&copy; {new Date().getFullYear()} RepoVitals. All rights reserved.</span>
          <div className="flex gap-4">
            <span>Real-time Stream</span>
            <span>&bull;</span>
            <span>Public Repos Only</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
