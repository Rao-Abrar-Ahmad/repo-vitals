import React from "react";

interface TopicChipProps {
  topic: string;
}

export const TopicChip: React.FC<TopicChipProps> = ({ topic }) => {
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 text-text-muted hover:text-white transition-all cursor-default">
      {topic}
    </span>
  );
};
