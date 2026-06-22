import React from "react";

interface QuickWinCardProps {
  num: number;
  text: string;
}

export const QuickWinCard: React.FC<QuickWinCardProps> = ({ num, text }) => {
  return (
    <div className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300 relative overflow-hidden group">
      {/* Left gradient line indicator */}
      <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-accent-blue to-accent-purple" />
      
      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 text-white font-bold text-sm border border-accent-blue/30 group-hover:scale-105 transition-transform">
        {num}
      </div>
      
      <div className="flex-grow">
        <p className="text-sm font-medium text-white leading-relaxed">{text}</p>
      </div>
    </div>
  );
};
