import React from "react";
import { Check, X, HelpCircle } from "lucide-react";

interface ChecklistItemProps {
  label: string;
  passed: boolean;
  tooltip: string;
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({ label, passed, tooltip }) => {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group relative">
      <div className="flex items-center gap-3">
        {passed ? (
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
            <Check size={12} className="stroke-[3]" />
          </span>
        ) : (
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
            <X size={12} className="stroke-[3]" />
          </span>
        )}
        <span className="text-xs font-medium text-white">{label}</span>
      </div>

      <div className="text-text-muted hover:text-white transition-colors cursor-help group/tooltip">
        <HelpCircle size={14} />
        {/* Tooltip */}
        <div className="absolute right-3 bottom-full mb-2 w-64 p-2 bg-card border border-white/10 text-xs text-text-primary rounded shadow-xl opacity-0 scale-95 group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 transition-all pointer-events-none z-10">
          {tooltip}
        </div>
      </div>
    </div>
  );
};
