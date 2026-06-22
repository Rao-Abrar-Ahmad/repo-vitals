import React from "react";
import type { RepoMeta } from "../../types";
import { StatCard } from "../ui/StatCard";
import { formatBytes, formatAge } from "../../lib/utils";
import { Star, GitFork, Eye, Bug, HardDrive, Calendar } from "lucide-react";

interface ActivityStatsRowProps {
  meta: RepoMeta;
}

export const ActivityStatsRow: React.FC<ActivityStatsRowProps> = ({ meta }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <StatCard
        label="Stars"
        value={meta.stargazers_count.toLocaleString()}
        icon={<Star size={16} className="fill-yellow-400/20 text-yellow-400" />}
      />
      <StatCard
        label="Forks"
        value={meta.forks_count.toLocaleString()}
        icon={<GitFork size={16} className="text-blue-400" />}
      />
      {/* <StatCard
        label="Watchers"
        value={meta.watchers_count.toLocaleString()}
        icon={<Eye size={16} className="text-purple-400" />}
      /> */}
      <StatCard
        label="Open Issues"
        value={meta.open_issues_count.toLocaleString()}
        icon={<Bug size={16} className="text-red-400" />}
      />
      <StatCard
        label="Repo Size"
        value={formatBytes(meta.size)}
        icon={<HardDrive size={16} className="text-indigo-400" />}
        valueClass="text-lg"
      />
      <StatCard
        label="Project Age"
        value={formatAge(meta.created_at)}
        icon={<Calendar size={16} className="text-green-400" />}
        valueClass="text-base"
      />
    </div>
  );
};
