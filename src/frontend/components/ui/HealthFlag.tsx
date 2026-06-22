import React from "react";

interface HealthFlagProps {
  flag: string;
  type: "red" | "yellow" | "gray" | "blue" | "green";
}

export const HealthFlag: React.FC<HealthFlagProps> = ({ flag, type }) => {
  const getStyle = () => {
    switch (type) {
      case "red":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "yellow":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "blue":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "green":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "gray":
      default:
        return "bg-white/5 text-text-muted border-white/10";
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStyle()} flex items-center gap-1.5`}>
      {type === "red" && <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />}
      {type === "yellow" && <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />}
      {type === "blue" && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
      {type === "green" && <span className="w-1.5 h-1.5 rounded-full bg-green-400" />}
      {flag}
    </span>
  );
};
