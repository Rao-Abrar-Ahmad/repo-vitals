import React from "react";

interface SeverityBadgeProps {
  severity: "Critical" | "High" | "Medium" | "Low";
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => {
  const getColors = () => {
    switch (severity) {
      case "Critical":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "High":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "Medium":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "Low":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }
  };

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getColors()}`}>
      {severity}
    </span>
  );
};
