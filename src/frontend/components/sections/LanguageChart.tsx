import React from "react";
import type { LanguageEntry } from "../../types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface LanguageChartProps {
  languages: LanguageEntry[];
}

export const LanguageChart: React.FC<LanguageChartProps> = ({ languages }) => {
  if (languages.length === 0) {
    return (
      <div className="glass-panel p-6 flex items-center justify-center min-h-[300px] h-full text-text-muted">
        No language data available.
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-white/10 p-3 rounded-lg shadow-xl text-xs">
          <p className="font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
            {data.name}
          </p>
          <p className="text-text-muted mt-1">
            {data.bytes.toLocaleString()} bytes ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel p-6 flex flex-col items-center justify-between min-h-[340px] hover:bg-card-hover/30 transition-all duration-300 h-auto">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted self-start mb-4">
        Languages Distribution
      </h3>

      <div className="w-full h-48 flex justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={languages}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={2}
              dataKey="bytes"
            >
              {languages.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(10,10,15,0.8)" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 justify-center w-full">
        {languages.slice(0, 5).map((lang, idx) => (
          <div key={idx} className="flex items-center gap-1.5 text-xs">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lang.color }} />
            <span className="font-medium text-white">{lang.name}</span>
            <span className="text-text-muted">{lang.percentage}%</span>
          </div>
        ))}
        {languages.length > 5 && (
          <div className="text-xs text-text-muted font-medium">
            +{languages.length - 5} more
          </div>
        )}
      </div>
    </div>
  );
};
