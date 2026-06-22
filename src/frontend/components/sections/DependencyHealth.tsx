import React from "react";
import type { DepHealthSummary } from "../../types";
import { StatCard } from "../ui/StatCard";
import { Box, AlertTriangle, ShieldAlert, CheckCircle } from "lucide-react";

interface DependencyHealthProps {
  summary: DepHealthSummary;
  vulnerableCount: number;
}

export const DependencyHealth: React.FC<DependencyHealthProps> = ({ summary, vulnerableCount }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        label="Total Dependencies"
        value={summary.total}
        icon={<Box size={16} />}
        colorClass="text-accent-blue"
        description="Total declared dependencies"
      />
      <StatCard
        label="Outdated"
        value={summary.outdated}
        icon={<AlertTriangle size={16} />}
        colorClass="text-yellow-500"
        description="Updates are available"
      />
      <StatCard
        label="Vulnerable"
        value={vulnerableCount}
        icon={<ShieldAlert size={16} />}
        colorClass="text-red-500"
        description="Known vulnerabilities found"
      />
      <StatCard
        label="Deprecated"
        value={summary.deprecated}
        icon={<CheckCircle size={16} />}
        colorClass="text-orange-500"
        description="Marked as deprecated by author"
      />
    </div>
  );
};
