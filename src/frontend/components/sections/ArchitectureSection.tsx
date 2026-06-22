import React from "react";
import { Sparkles, Network } from "lucide-react";

interface ArchitectureSectionProps {
  observations?: string;
}

export const ArchitectureSection: React.FC<ArchitectureSectionProps> = ({ observations }) => {
  if (!observations) return null;

  return (
    <div className="glass-panel p-6 border-l-4 border-l-accent-purple relative overflow-hidden transition-all hover:bg-card-hover/20 duration-300">
      <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold text-accent-purple bg-accent-purple/10 px-2 py-0.5 rounded-full border border-accent-purple/20">
        <Sparkles size={10} /> AI
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Network size={16} className="text-accent-purple" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
          Architecture Observations
        </h3>
      </div>

      <p className="text-sm text-text-primary leading-relaxed font-medium">
        {observations}
      </p>
    </div>
  );
};
