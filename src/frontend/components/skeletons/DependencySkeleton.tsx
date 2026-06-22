import React from "react";

export const DependencySkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse-slow">
      {/* Score ring skeleton */}
      <div className="glass-panel p-6 flex flex-col md:flex-row items-center gap-6 lg:col-span-1">
        <div className="w-32 h-32 rounded-full border-[10px] border-white/5" />
        <div className="space-y-3 flex-1">
          <div className="h-4 w-24 bg-white/5 rounded" />
          <div className="h-6 w-36 bg-white/5 rounded" />
        </div>
      </div>
      {/* Dep health stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:col-span-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-panel p-4 flex flex-col justify-between h-28">
            <div className="flex justify-between">
              <div className="w-12 h-3 bg-white/5 rounded" />
              <div className="w-4 h-4 bg-white/5 rounded-full" />
            </div>
            <div className="w-10 h-8 bg-white/5 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};
