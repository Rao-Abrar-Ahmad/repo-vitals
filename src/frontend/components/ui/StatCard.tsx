import React from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass?: string;
  description?: string;
  valueClass?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  colorClass = "text-text-primary",
  description,
  valueClass
}) => {
  return (
    <div className="glass-panel p-4 flex flex-col justify-between hover:bg-card-hover/80 transition-all duration-300">
      <div className="flex justify-between items-start gap-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">{label}</span>
        <span className={`text-lg ${colorClass}`}>{icon}</span>
      </div>
      <div className="mt-3">
        <div className={`${valueClass ? valueClass : 'text-2xl'} font-bold tracking-tight text-white`}>{value}</div>
        {description && <p className="text-xs text-text-muted mt-1 leading-normal">{description}</p>}
      </div>
    </div>
  );
};
