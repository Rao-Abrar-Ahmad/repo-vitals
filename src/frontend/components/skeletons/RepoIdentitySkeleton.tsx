import React from "react";

export const RepoIdentitySkeleton: React.FC = () => {
  return (
    <div className="glass-panel p-6 animate-pulse-slow">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-white/5" />
        <div className="space-y-2 flex-1">
          <div className="h-6 w-48 bg-white/5 rounded" />
          <div className="h-4 w-32 bg-white/5 rounded" />
        </div>
        <div className="w-16 h-8 bg-white/5 rounded-full" />
      </div>
      <div className="mt-4 h-4 w-3/4 bg-white/5 rounded" />
      <div className="mt-2 h-4 w-1/2 bg-white/5 rounded" />
      <div className="mt-6 flex gap-2">
        <div className="w-16 h-6 bg-white/5 rounded-full" />
        <div className="w-20 h-6 bg-white/5 rounded-full" />
        <div className="w-14 h-6 bg-white/5 rounded-full" />
      </div>
    </div>
  );
};
