import React from "react";

interface ContributorAvatarProps {
  login: string;
  avatarUrl: string;
  contributions: number;
  htmlUrl: string;
}

export const ContributorAvatar: React.FC<ContributorAvatarProps> = ({
  login,
  avatarUrl,
  contributions,
  htmlUrl,
}) => {
  return (
    <a
      href={htmlUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 p-1 pr-3 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-xs text-text-muted hover:text-white"
    >
      <img
        src={avatarUrl}
        alt={`${login}'s avatar`}
        className="w-6 h-6 rounded-full border border-white/10"
        loading="lazy"
      />
      <span className="font-semibold text-white">{login}</span>
      <span className="opacity-60">{contributions} commits</span>
    </a>
  );
};
