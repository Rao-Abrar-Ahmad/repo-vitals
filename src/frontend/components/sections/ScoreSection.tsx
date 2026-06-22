import React from "react";
import { ScoreRing } from "../ui/ScoreRing";

interface ScoreSectionProps {
  score: number;
  grade: string;
}

export const ScoreSection: React.FC<ScoreSectionProps> = ({ score, grade }) => {
  return (
    <div className="glass-panel p-4 flex flex-col justify-center min-h-60">
      <ScoreRing score={score} grade={grade} />
    </div>
  );
};
