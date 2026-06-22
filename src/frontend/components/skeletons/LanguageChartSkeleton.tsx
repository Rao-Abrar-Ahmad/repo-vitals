import React from "react";

export const LanguageChartSkeleton: React.FC = () => {
  return (
    <div className="glass-panel p-6 flex flex-col items-center justify-center min-h-[300px] animate-pulse-slow">
      <div className="w-40 h-40 rounded-full border-[12px] border-white/5 flex items-center justify-center">
        <div className="w-16 h-4 bg-white/5 rounded" />
      </div>
      <div className="mt-6 flex flex-wrap gap-4 justify-center w-full">
        <div className="w-24 h-4 bg-white/5 rounded" />
        <div className="w-20 h-4 bg-white/5 rounded" />
        <div className="w-28 h-4 bg-white/5 rounded" />
      </div>
    </div>
  );
};
