import React from "react";
import { QuickWinCard } from "../ui/QuickWinCard";
import { Sparkles, Trophy } from "lucide-react";

interface QuickWinsProps {
  wins?: string[];
}

export const QuickWins: React.FC<QuickWinsProps> = ({ wins }) => {
  if (!wins || wins.length === 0) return null;

  return (
    <div className="glass-panel p-6 relative overflow-hidden transition-all hover:bg-card-hover/20 duration-300">
      <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold text-accent-purple bg-accent-purple/10 px-2 py-0.5 rounded-full border border-accent-purple/20">
        <Sparkles size={10} /> AI
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Trophy size={16} className="text-accent-blue" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
          Recommended Quick Wins
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {wins.map((win, index) => (
          <QuickWinCard key={index} num={index + 1} text={win} />
        ))}
      </div>
    </div>
  );
};
