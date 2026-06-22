import React from "react";
import type { Contributor } from "../../types";
import { ContributorAvatar } from "../ui/ContributorAvatar";
import { Users } from "lucide-react";

interface TopContributorsProps {
  contributors: Contributor[];
}

export const TopContributors: React.FC<TopContributorsProps> = ({ contributors }) => {
  return (
    <div className="glass-panel p-6 hover:bg-card-hover/30 transition-all duration-300 col-span-2">
      <div className="flex items-center gap-2 mb-4">
        <Users size={16} className="text-accent-blue" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
          Top Contributors
        </h3>
      </div>

      {contributors.length === 0 ? (
        <div className="text-xs text-text-muted">No contributors list available.</div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {contributors.map((c) => (
            <ContributorAvatar
              key={c.login}
              login={c.login}
              avatarUrl={c.avatarUrl || c.avatar_url}
              contributions={c.contributions}
              htmlUrl={c.htmlUrl || c.html_url}
            />
          ))}
        </div>
      )}
    </div>
  );
};
