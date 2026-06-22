import React from "react";

export const ActivityStatsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 animate-pulse-slow">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="glass-panel p-4 h-24 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div className="w-12 h-3 bg-white/5 rounded" />
            <div className="w-4 h-4 bg-white/5 rounded-full" />
          </div>
          <div className="w-16 h-6 bg-white/5 rounded" />
        </div>
      ))}
    </div>
  );
};
