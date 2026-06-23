import React, { useState } from "react";
import { isValidGitHubUrl } from "../lib/utils";
import { Search, Github, ArrowRight } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface HeroInputProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

export const HeroInput: React.FC<HeroInputProps> = ({ onAnalyze, isLoading }) => {
  const { isDark } = useTheme();
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError("Please enter a repository URL");
      return;
    }

    if (!isValidGitHubUrl(trimmedUrl)) {
      setError("Please enter a valid GitHub repository URL (e.g. https://github.com/owner/repo)");
      return;
    }

    onAnalyze(trimmedUrl);
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-4xl mx-auto text-center px-4 py-16">
      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-text-muted mb-6">
        <Github size={12} />
        <span>GitHub Health Analyzer</span>
      </div>

      {/* Headline */}
      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6">
        Check the <span className="bg-gradient-to-r from-accent-blue via-accent-purple to-pink-500 bg-clip-text text-transparent">Vitals</span> of Your Repo
      </h1>

      <p className="text-text-muted text-base sm:text-lg mb-8 max-w-lg leading-relaxed">
        Paste any public JavaScript or Node.js GitHub repository URL to receive an instant, AI-guided quality and vulnerability checkup.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full relative">
        <div className="relative flex items-center p-1 rounded-2xl bg-white/5 border border-white/10 focus-within:border-accent-blue/50 focus-within:ring-1 focus-within:ring-accent-blue/50 transition-all duration-300 shadow-2xl">
          <div className="pl-3 md:pl-4 text-text-muted">
            <Search size={20} />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError(null);
            }}
            placeholder="https://github.com/expressjs/express"
            disabled={isLoading}
            className="w-full py-2 md:py-4 pl-3 pr-20 bg-transparent text-text-primary placeholder-text-muted/60 text-sm focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`absolute right-1.5 top-1.5 bottom-1.5 px-3 md:px-5 rounded-xl text-sm md:text-base font-bold shadow transition-all flex items-center gap-1.5 disabled:opacity-50 ${
              isDark
                ? "bg-white text-accent-blue hover:bg-white/90"
                : "bg-accent-blue text-white hover:bg-blue-700"
            }`}
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
            ) : (
              <>
                <span className="hidden md:inline">Analyze</span>
                <ArrowRight size={14} className="stroke-[2.5]" />
              </>
            )}
          </button>
        </div>

        {error && (
          <p className="absolute left-0 right-0 top-full mt-2 text-xs text-red-400 font-medium text-left px-2">
            ⚠️ {error}
          </p>
        )}
      </form>

      {/* Quick suggestions */}
      <div className="mt-12 flex flex-col sm:flex-row items-center gap-3 justify-center text-xs text-text-muted">
        <span>Try these examples:</span>
        <div className="flex gap-2">
          <button
            onClick={() => { setUrl("https://github.com/isfhan/burger-api"); setError(null); }}
            className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 hover:text-white transition-colors border border-white/5"
          >
            burger-api
          </button>
          <button
            onClick={() => { setUrl("https://github.com/seerr-team/seerr"); setError(null); }}
            className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 hover:text-white transition-colors border border-white/5"
          >
            seerr
          </button>
        </div>
      </div>
    </div>
  );
};
