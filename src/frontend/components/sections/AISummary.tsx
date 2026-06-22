import React from "react";
import { Sparkles, GraduationCap } from "lucide-react";

interface AISummaryProps {
  summary?: string;
}

export const AISummary: React.FC<AISummaryProps> = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="relative p-[1px] rounded-2xl bg-gradient-to-r from-accent-blue via-accent-purple to-pink-500 shadow-xl group hover:shadow-2xl hover:shadow-accent-blue/10 transition-all duration-300">
      <div className="bg-card rounded-[15px] p-6 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -right-20 -bottom-20 w-48 h-48 rounded-full bg-accent-blue/10 blur-3xl pointer-events-none group-hover:bg-accent-blue/15 transition-colors" />
        
        <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-bold text-accent-purple bg-accent-purple/10 px-2.5 py-0.5 rounded-full border border-accent-purple/20">
          <Sparkles size={10} /> AI
        </div>

        <div className="flex items-center gap-2 mb-4">
          <GraduationCap size={20} className="text-white" />
          <h3 className="text-base font-bold text-white tracking-tight">
            Mentor Verdict
          </h3>
        </div>

        <p className="text-sm text-text-primary leading-relaxed font-medium">
          "{summary}"
        </p>
      </div>
    </div>
  );
};
