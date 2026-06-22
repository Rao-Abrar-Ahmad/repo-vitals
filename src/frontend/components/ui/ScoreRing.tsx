import React, { useEffect, useState } from "react";

interface ScoreRingProps {
  score: number;
  grade: string;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({ score, grade }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing out quad
      const easeProgress = progress * (2 - progress);
      const current = Math.round(easeProgress * score);
      setAnimatedScore(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  const getColor = (val: number) => {
    if (val >= 90) return "#22c55e"; // Green
    if (val >= 75) return "#eab308"; // Yellow
    if (val >= 60) return "#f97316"; // Orange
    return "#ef4444"; // Red
  };

  const getGradeBg = (g: string) => {
    switch (g) {
      case "A": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "B": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "C": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      default: return "bg-red-500/10 text-red-400 border-red-500/20";
    }
  };

  const color = getColor(score);
  const size = 120;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-4 justify-between">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90 w-full h-full">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-white/5"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated score ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.1s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold text-white tracking-tight">{animatedScore}</span>
          <span className="text-xs text-text-muted font-medium">/ 100</span>
        </div>
      </div>

      <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm font-semibold uppercase tracking-wider text-text-muted">Health Rating</span>
          <span className={`px-2.5 py-0.5 rounded-full text-sm font-bold border ${getGradeBg(grade)}`}>
            Grade {grade}
          </span>
        </div>
        <p className="text-white font-medium text-sm max-w-xs">
          {score >= 90 && "Outstanding repository health and setup!"}
          {score >= 75 && score < 90 && "Good project health with minor areas to improve."}
          {score >= 60 && score < 75 && "Fair health rating, but significant technical debt detected."}
          {score < 60 && "Critical concerns. Needs substantial refactoring and security updates."}
        </p>
      </div>
    </div>
  );
};
