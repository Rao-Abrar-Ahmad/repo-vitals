import React from "react";
import { Sparkles, ShieldAlert } from "lucide-react";

interface SecurityFlagsProps {
  security?: string;
}

export const SecurityFlags: React.FC<SecurityFlagsProps> = ({ security }) => {
  if (!security) return null;

  return (
    <div className="glass-panel p-6 border-l-4 border-l-red-500 bg-red-500/[0.02] relative overflow-hidden transition-all hover:bg-card-hover/20 duration-300">
      <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
        <Sparkles size={10} /> AI
      </div>

      <div className="flex items-center gap-2 mb-3">
        <ShieldAlert size={16} className="text-red-400" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
          Security Flags
        </h3>
      </div>

      <p className="text-sm text-text-primary leading-relaxed font-medium">
        {security}
      </p>
    </div>
  );
};
