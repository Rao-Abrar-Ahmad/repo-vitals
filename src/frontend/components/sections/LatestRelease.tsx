import React from "react";
import type { Release } from "../../types";
import { formatRelativeDate } from "../../lib/utils";
import { Tag, Calendar } from "lucide-react";

interface LatestReleaseProps {
  release: Release | null;
}

export const LatestRelease: React.FC<LatestReleaseProps> = ({ release }) => {
  return (
    <div className="glass-panel p-6 hover:bg-card-hover/30 transition-all duration-300 h-full flex flex-col justify-between">
      <div className="flex items-center gap-2 mb-4">
        <Tag size={16} className="text-accent-purple" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
          Latest Release
        </h3>
      </div>

      {!release ? (
        <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 p-3 rounded-lg text-xs font-semibold">
          No releases published yet on GitHub.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <a
            href={release.htmlUrl || release.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-bold text-white hover:text-accent-blue transition-colors flex items-center gap-2"
          >
            {release.tag_name}
            {release.name && release.name !== release.tag_name && (
              <span className="text-xs text-text-muted font-normal">({release.name})</span>
            )}
          </a>
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Calendar size={12} />
            <span>Released {formatRelativeDate(release.published_at)}</span>
          </div>
        </div>
      )}
    </div>
  );
};
