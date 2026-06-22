import React from "react";
import type { RepoMeta } from "../../types";
import { TopicChip } from "../ui/TopicChip";
import { ExternalLink, Shield, Star, GitFork, AlertTriangle } from "lucide-react";

interface RepoIdentityCardProps {
  meta: RepoMeta;
}

export const RepoIdentityCard: React.FC<RepoIdentityCardProps> = ({ meta }) => {
  return (
    <div className="glass-panel p-6 relative overflow-hidden transition-all hover:bg-card-hover/40 duration-300">
      {meta.archived && (
        <div className="absolute top-0 left-0 right-0 bg-red-500/25 border-b border-red-500/20 px-4 py-2 flex items-center gap-2 text-red-300 text-xs font-semibold">
          <AlertTriangle size={14} className="text-red-400" />
          <span>This repository has been archived by the owner. It is now read-only.</span>
        </div>
      )}

      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${meta.archived ? "pt-8" : ""}`}>
        <div className="flex items-center gap-4">
          <img
            src={meta.owner.avatar_url}
            alt={meta.owner.login}
            className="w-12 h-12 rounded-lg border border-white/10 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href={meta.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl font-bold text-white hover:text-accent-blue transition-colors flex items-center gap-1.5"
              >
                {meta.full_name}
              </a>
              {meta.fork && (
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-text-muted text-[10px] font-semibold flex items-center gap-1">
                  <GitFork size={10} /> Fork
                </span>
              )}
            </div>
            {meta.homepage && (
              <a
                href={meta.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent-blue hover:underline flex items-center gap-1 mt-1 font-medium"
              >
                <ExternalLink size={12} />
                {meta.homepage.replace(/^https?:\/\/(www\.)?/, "")}
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-sm text-white">
            <Star size={14} className="text-yellow-400 fill-yellow-400/20" />
            <span className="font-semibold">{(meta.stargazers_count / 1000).toFixed(1)}k</span>
          </div>
        </div>
      </div>

      {meta.description && (
        <p className="mt-4 text-sm text-text-primary leading-relaxed max-w-3xl">
          {meta.description}
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-2 items-center">
        {meta.license && (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center gap-1.5 cursor-default">
            <Shield size={12} />
            {meta.license.spdx_id || meta.license.name}
          </span>
        )}
        {meta.topics.slice(0, 6).map((topic) => (
          <TopicChip key={topic} topic={topic} />
        ))}
        {meta.topics.length > 6 && (
          <span className="text-xs text-text-muted font-medium pl-1">
            +{meta.topics.length - 6} more
          </span>
        )}
      </div>
    </div>
  );
};
