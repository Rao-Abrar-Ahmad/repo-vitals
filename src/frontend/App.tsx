import React from "react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { useAnalysis } from "./hooks/useAnalysis";
import { HeroInput } from "./components/HeroInput";
import { Report } from "./components/Report";
import { Github, Activity, Sun, Moon } from "lucide-react";

function AppContent() {
  const { isDark, toggleTheme } = useTheme();
  const { phase, analyze, reset, ...state } = useAnalysis();

  const handleAnalyze = (url: string) => {
    analyze(url);
  };

  const showReport =
    (phase !== "idle" && phase !== "loading") ||
    (phase === "loading" && state.repoMeta !== null);

  return (
    <div className="flex flex-col min-h-screen bg-base text-text-primary transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-white/5 bg-card/50 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={reset}>
            <span className="p-1.5 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple text-white glow-blue">
              <Activity size={18} className="stroke-[2.5]" />
            </span>
            <span className="font-black text-xl tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              RepoVitals
            </span>
          </div>

          {/* Header actions */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Rao-Abrar-Ahmad/repo-vitals"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-white transition-colors"
              title="View on GitHub"
            >
              <Github size={20} />
            </a>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-200"
              aria-label="Toggle light/dark mode"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <Sun size={16} className="text-yellow-400" />
              ) : (
                <Moon size={16} className="text-accent-blue" />
              )}
            </button>
          </div>
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
      <footer className="border-t border-white/5 py-6 bg-card/20 transition-colors duration-300">
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

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
