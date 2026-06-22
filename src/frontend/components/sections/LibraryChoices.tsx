import React from "react";
import { Sparkles, Library } from "lucide-react";

interface LibraryChoicesProps {
  choices?: string;
}

export const LibraryChoices: React.FC<LibraryChoicesProps> = ({ choices }) => {
  if (!choices) return null;

  return (
    <div className="glass-panel p-6 border-l-4 border-l-accent-blue relative overflow-hidden transition-all hover:bg-card-hover/20 duration-300">
      <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded-full border border-accent-blue/20">
        <Sparkles size={10} /> AI
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Library size={16} className="text-accent-blue" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
          Library & NPM Choices
        </h3>
      </div>

      <p className="text-sm text-text-primary leading-relaxed font-medium">
        {choices}
      </p>
    </div>
  );
};
