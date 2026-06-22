import React from "react";

export const AISkeleton: React.FC = () => {
  return (
    <div className="glass-panel p-6 space-y-6 animate-pulse-slow">
      <div className="flex justify-between items-center">
        <div className="h-6 w-40 bg-white/5 rounded" />
        <div className="h-5 w-16 bg-white/5 rounded-full" />
      </div>
      <div className="space-y-3">
        <div className="h-4 w-full bg-white/5 rounded" />
        <div className="h-4 w-5/6 bg-white/5 rounded" />
        <div className="h-4 w-4/5 bg-white/5 rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 bg-white/5 rounded-lg border border-white/5" />
        ))}
      </div>
    </div>
  );
};
